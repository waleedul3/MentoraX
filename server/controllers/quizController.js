import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import { generateCertificate } from '../utils/pdfGenerator.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Get quiz for course
// @route   GET /api/quiz/course/:courseId
// @access  Private
export const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ courseId: req.params.courseId })
      .select('-questions.correctIndex -questions.explanation');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found for this course'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz
// @route   POST /api/quiz/:quizId/submit
// @access  Private
export const submitQuiz = async (req, res, next) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(req.params.quizId).populate('courseId');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Calculate score
    let correctAnswers = 0;
    let totalMarks = 0;

    quiz.questions.forEach((question, index) => {
      totalMarks += question.marks;
      if (answers[index] === question.correctIndex) {
        correctAnswers += question.marks;
      }
    });

    const score = Math.round((correctAnswers / totalMarks) * 100);
    const passed = score >= (quiz.passingMarks / quiz.totalMarks) * 100;

    // Save attempt
    quiz.attempts.push({
      userId: req.user.id,
      score,
      answers,
      timeTaken
    });
    await quiz.save();

    // Award XP points
    const user = await User.findById(req.user.id);
    const xpEarned = passed ? 20 : 5; // 20 XP for passing, 5 for attempting
    user.xpPoints += xpEarned;
    await user.save();

    let certificate = null;

    // Generate certificate if passed
    if (passed) {
      try {
        const existingCert = await Certificate.findOne({
          userId: req.user.id,
          courseId: quiz.courseId._id
        });

        if (!existingCert) {
          const certData = await generateCertificate(user, quiz.courseId, score);
          
          // Save certificate to database
          certificate = await Certificate.create({
            userId: req.user.id,
            courseId: quiz.courseId._id,
            certificateId: certData.certificateId,
            certificateUrl: `/certificates/${certData.certificateId}.pdf`,
            qrCodeUrl: certData.qrCodeDataURL,
            verificationUrl: certData.verificationUrl,
            grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : score >= 50 ? 'C+' : 'C',
            score
          });

          // Add certificate to user
          user.certificates.push(certificate._id);
          await user.save();
        }
      } catch (certError) {
        console.error('Certificate generation error:', certError);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        score,
        passed,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        xpEarned,
        certificate: certificate ? certificate._id : null,
        feedback: quiz.questions.map((q, index) => ({
          question: q.question,
          yourAnswer: answers[index],
          correctAnswer: q.correctIndex,
          isCorrect: answers[index] === q.correctIndex,
          explanation: q.explanation
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create quiz
// @route   POST /api/quiz/course/:courseId
// @access  Private (Mentor/Admin)
export const createQuiz = async (req, res, next) => {
  try {
    const quizData = {
      ...req.body,
      courseId: req.params.courseId
    };

    const quiz = await Quiz.create(quizData);

    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quiz
// @route   PUT /api/quiz/:quizId
// @access  Private (Mentor/Admin)
export const updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz attempts
// @route   GET /api/quiz/:quizId/attempts
// @access  Private
export const getQuizAttempts = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const userAttempts = quiz.attempts.filter(
      attempt => attempt.userId.toString() === req.user.id
    );

    res.status(200).json({
      success: true,
      data: userAttempts
    });
  } catch (error) {
    next(error);
  }
};