import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiXCircle, FiAward } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const Quiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [courseId]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted, quiz]);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quiz/course/${courseId}`);
      const quizData = response.data.data;
      setQuiz(quizData);
      setTimeLeft(quizData.timeLimit * 60); // Convert minutes to seconds
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load quiz');
      navigate(`/courses/${courseId}`);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;

    const answersArray = quiz.questions.map((_, index) => answers[index] ?? -1);
    const timeTaken = (quiz.timeLimit * 60) - timeLeft;

    try {
      setLoading(true);
      const response = await api.post(`/quiz/${quiz._id}/submit`, {
        answers: answersArray,
        timeTaken
      });
      
      setResults(response.data.data);
      setIsSubmitted(true);
      
      if (response.data.data.passed) {
        toast.success('Congratulations! You passed the quiz!');
      } else {
        toast.error('You didn\'t pass this time. Keep learning!');
      }
    } catch (error) {
      toast.error('Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted && results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
          >
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              results.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {results.passed ? (
                <FiCheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <FiXCircle className="w-10 h-10 text-red-600" />
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {results.passed ? 'Congratulations!' : 'Keep Learning!'}
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              You scored {results.score}% ({results.correctAnswers}/{results.totalQuestions} correct)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">{results.score}%</div>
                <div className="text-sm text-gray-600">Your Score</div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">{results.correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">+{results.xpEarned}</div>
                <div className="text-sm text-gray-600">XP Earned</div>
              </div>
            </div>

            {results.certificate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-8"
              >
                <FiAward className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificate Earned!</h3>
                <p className="text-gray-600 mb-4">You've earned a certificate for completing this course.</p>
                <button
                  onClick={() => navigate(`/certificate/${results.certificate}`)}
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  View Certificate
                </button>
              </motion.div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => navigate(`/courses/${courseId}`)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Course
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quiz Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600 mt-1">{quiz.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-lg font-semibold text-blue-600">
                <FiClock className="w-5 h-5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <p className="text-sm text-gray-500">Time remaining</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
        >
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {quiz.questions[currentQuestion].question}
            </h2>

            <div className="space-y-4">
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion] === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex space-x-4">
              {currentQuestion < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Question Navigator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigator</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  index === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : answers[index] !== undefined
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Quiz;