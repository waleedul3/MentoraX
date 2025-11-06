import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDownload, FiShare2, FiCheck, FiX, FiAward } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const Certificate = () => {
  const { certificateId, id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerification, setIsVerification] = useState(false);

  useEffect(() => {
    if (certificateId) {
      // Public verification
      setIsVerification(true);
      verifyCertificate(certificateId);
    } else if (id) {
      // Private certificate view
      fetchCertificate(id);
    }
  }, [certificateId, id]);

  const fetchCertificate = async (certId) => {
    try {
      const response = await api.get(`/certificates/${certId}`);
      setCertificate(response.data.data);
    } catch (error) {
      toast.error('Certificate not found');
    } finally {
      setLoading(false);
    }
  };

  const verifyCertificate = async (certId) => {
    try {
      const response = await api.get(`/certificates/verify/${certId}`);
      setCertificate(response.data.data);
    } catch (error) {
      toast.error('Certificate not found or invalid');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/certificates/${id}/download`);
      toast.success('Certificate download ready');
      // In a real implementation, this would trigger the actual download
      console.log('Download URL:', response.data.downloadUrl);
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/verify/${certificate.certificateId || certificateId}`;
    navigator.clipboard.writeText(url);
    toast.success('Certificate verification link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FiX className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Certificate Not Found</h1>
          <p className="text-gray-600">The certificate you're looking for doesn't exist or has been revoked.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Verification Status */}
        {isVerification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-3">
              <FiCheck className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Certificate Verified</h3>
                <p className="text-green-700">This certificate is authentic and valid.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Certificate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
            <FiAward className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">CERTIFICATE OF COMPLETION</h1>
            <p className="text-blue-100">This is to certify that</p>
          </div>

          {/* Certificate Body */}
          <div className="p-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {certificate.studentName || certificate.userId?.name}
            </h2>
            
            <p className="text-xl text-gray-600 mb-6">
              has successfully completed the course
            </p>
            
            <h3 className="text-3xl font-bold text-blue-600 mb-8">
              {certificate.courseName || certificate.courseId?.title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{certificate.score}%</div>
                <div className="text-gray-600">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{certificate.grade}</div>
                <div className="text-gray-600">Grade</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {new Date(certificate.issueDate).toLocaleDateString()}
                </div>
                <div className="text-gray-600">Issue Date</div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <p className="text-sm text-gray-600">Instructor</p>
                  <p className="font-semibold text-gray-900">
                    {certificate.instructorName || certificate.courseId?.instructor?.name}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-xs text-gray-500">QR Code</span>
                  </div>
                  <p className="text-xs text-gray-500">Scan to verify</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600">Certificate ID</p>
                  <p className="font-mono text-xs text-gray-900">
                    {certificate.certificateId || certificateId}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MentoraX
              </div>
              <p className="text-sm text-gray-500 mt-1">Learn. Code. Grow.</p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        {!isVerification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-4 mt-8"
          >
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiDownload className="w-5 h-5" />
              <span>Download PDF</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiShare2 className="w-5 h-5" />
              <span>Share Certificate</span>
            </button>
          </motion.div>
        )}

        {/* Certificate Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Student Details</h4>
              <p className="text-gray-600">Name: {certificate.studentName || certificate.userId?.name}</p>
              {!isVerification && certificate.userId?.email && (
                <p className="text-gray-600">Email: {certificate.userId.email}</p>
              )}
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Course Details</h4>
              <p className="text-gray-600">Course: {certificate.courseName || certificate.courseId?.title}</p>
              <p className="text-gray-600">Instructor: {certificate.instructorName || certificate.courseId?.instructor?.name}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Achievement</h4>
              <p className="text-gray-600">Score: {certificate.score}%</p>
              <p className="text-gray-600">Grade: {certificate.grade}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Verification</h4>
              <p className="text-gray-600">Issue Date: {new Date(certificate.issueDate).toLocaleDateString()}</p>
              <p className="text-gray-600 font-mono text-sm">ID: {certificate.certificateId || certificateId}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Certificate;