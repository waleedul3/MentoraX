import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiPlay, FiClock, FiUsers, FiStar, FiAward, FiCheck, FiLock, FiMessageCircle } from 'react-icons/fi';
import { fetchCourse, enrollCourse } from '../slices/courseSlice';
import { fetchCourseProgress } from '../slices/progressSlice';
import PaymentModal from '../components/PaymentModal';
import MessageModal from '../components/MessageModal';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCourse, loading } = useSelector((state) => state.courses);
  const { currentCourseProgress } = useSelector((state) => state.progress);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  // Check enrollment from both course and user data
  const isEnrolledInCourse = currentCourse?.enrolledStudents?.includes(user?.id);
  const isEnrolledInUser = user?.coursesEnrolled?.includes(id);
  const isEnrolled = isEnrolledInCourse || isEnrolledInUser;
  
  // Debug logging
  console.log('Debug enrollment check:', {
    userId: user?.id,
    courseId: id,
    enrolledStudents: currentCourse?.enrolledStudents,
    userEnrolledCourses: user?.coursesEnrolled,
    isEnrolledInCourse,
    isEnrolledInUser,
    finalIsEnrolled: isEnrolled
  });
  const hasRated = currentCourse?.ratings?.some(r => r.user === user?.id);

  useEffect(() => {
    dispatch(fetchCourse(id));
    if (isAuthenticated) {
      dispatch(fetchCourseProgress(id));
    }
  }, [dispatch, id, isAuthenticated]);

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    dispatch(fetchCourse(id));
    // Refresh progress data as well
    if (isAuthenticated) {
      dispatch(fetchCourseProgress(id));
    }
  };

  const handleMessageMentor = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowMessageModal(true);
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!ratingValue) return toast.error('Please select a rating');
    try {
      await fetch(`/api/courses/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: ratingValue, comment: ratingComment }),
        credentials: 'include',
      });
      setRatingSubmitted(true);
      toast.success('Thank you for your rating!');
      dispatch(fetchCourse(id));
    } catch (err) {
      toast.error('Failed to submit rating');
    }
  };

  const renderLoading = () => {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="animate-pulse"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-64 bg-gray-200 rounded-lg" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
                <div className="space-y-4">
                  <div className="h-48 bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
          >
            {/* Course Header */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentCourse.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{currentCourse.subtitle}</p>

            {/* Course Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Navigation Tabs */}
                <nav className="flex space-x-8 border-b border-gray-200 mb-8">
                  {['overview', 'curriculum', 'instructor'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>

                {/* Tab Content */}
                <div className="space-y-8">
                  {activeTab === 'overview' && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {[
                          'Master the fundamentals and advanced concepts',
                          'Build real-world projects from scratch',
                          'Learn industry best practices',
                          'Get hands-on experience with tools',
                          'Understand core principles and patterns',
                          'Prepare for technical interviews'
                        ].map((item, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <FiCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                      <h3 className="text-xl font-semibold mb-4">Course Description</h3>
                      <p className="text-gray-700 leading-relaxed">{currentCourse.description}</p>
                    </div>
                  )}

                  {activeTab === 'curriculum' && (
                    <div>
                      <h3 className="text-xl font-semibold mb-6">Course Curriculum</h3>
                      <div className="space-y-4">
                        {currentCourse.lessons?.map((lesson, index) => (
                          <div
                            key={lesson._id}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                  {lesson.description && (
                                    <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">{lesson.duration} min</span>
                                {lesson.isPreview || isEnrolled ? (
                                  <FiPlay className="w-5 h-5 text-blue-600" />
                                ) : (
                                  <FiLock className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'instructor' && (
                    <div>
                      <div className="flex items-start space-x-6">
                        <img
                          src={currentCourse.instructor?.avatar || 'https://picsum.photos/96'}
                          alt={currentCourse.instructor?.name}
                          className="w-24 h-24 rounded-full"
                        />
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{currentCourse.instructor?.name}</h3>
                          <p className="text-gray-600 mb-4">Expert Instructor</p>
                          <p className="text-gray-700 leading-relaxed">
                            An experienced professional with years of industry experience. 
                            Passionate about teaching and helping students achieve their goals.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div>
                {/* Course Stats */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <FiClock className="w-4 h-4" />
                        <span className="text-sm">Duration</span>
                      </div>
                      <p className="font-medium">{currentCourse.duration} hours</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <FiUsers className="w-4 h-4" />
                        <span className="text-sm">Students</span>
                      </div>
                      <p className="font-medium">{currentCourse.enrolledStudents?.length || 0}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <FiStar className="w-4 h-4" />
                        <span className="text-sm">Rating</span>
                      </div>
                      <p className="font-medium">{currentCourse.averageRating?.toFixed(1) || 'N/A'}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <FiAward className="w-4 h-4" />
                        <span className="text-sm">Certificate</span>
                      </div>
                      <p className="font-medium">Yes</p>
                    </div>
                  </div>
                </div>

                {/* Course Actions */}
                <div className="space-y-4">
                  {isEnrolled ? (
                    <button
                      onClick={() => navigate(`/dashboard`)}
                      className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {currentCourseProgress?.percentage > 0 ? 'Continue Learning' : 'Start Learning'}
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Enroll Now
                    </button>
                  )}
                  <button
                    onClick={handleMessageMentor}
                    className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FiMessageCircle className="w-5 h-5" />
                    <span>Message Instructor</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Modals */}
        {currentCourse && (
          <>
            <PaymentModal
              course={currentCourse}
              isOpen={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              onSuccess={handlePaymentSuccess}
            />
            <MessageModal
              mentor={currentCourse.instructor}
              course={currentCourse}
              isOpen={showMessageModal}
              onClose={() => setShowMessageModal(false)}
            />
          </>
        )}
      </div>
    );
  };

  return loading || !currentCourse ? renderLoading() : renderContent();
};

export default CourseDetail;
