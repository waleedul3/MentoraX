import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

// @desc    Get user certificates
// @route   GET /api/certificates
// @access  Private
export const getCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ userId: req.user.id })
      .populate('courseId', 'title thumbnail instructor')
      .populate({
        path: 'courseId',
        populate: {
          path: 'instructor',
          select: 'name'
        }
      })
      .sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      data: certificates
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Private
export const getCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('courseId', 'title description instructor')
      .populate({
        path: 'courseId',
        populate: {
          path: 'instructor',
          select: 'name'
        }
      });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    // Check if user owns this certificate or is admin
    if (certificate.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this certificate'
      });
    }

    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download certificate PDF
// @route   GET /api/certificates/:id/download
// @access  Private
export const downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('userId', 'name')
      .populate('courseId', 'title');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    // Check if user owns this certificate
    if (certificate.userId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this certificate'
      });
    }

    // In a real implementation, you would serve the actual PDF file
    // For now, we'll return the certificate URL
    res.status(200).json({
      success: true,
      message: 'Certificate download ready',
      downloadUrl: certificate.certificateUrl,
      data: certificate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify certificate
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
export const verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId,
      isValid: true
    })
      .populate('userId', 'name')
      .populate('courseId', 'title')
      .populate({
        path: 'courseId',
        populate: {
          path: 'instructor',
          select: 'name'
        }
      });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or invalid'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Certificate is valid',
      data: {
        studentName: certificate.userId.name,
        courseName: certificate.courseId.title,
        instructorName: certificate.courseId.instructor.name,
        issueDate: certificate.issueDate,
        grade: certificate.grade,
        score: certificate.score,
        certificateId: certificate.certificateId
      }
    });
  } catch (error) {
    next(error);
  }
};