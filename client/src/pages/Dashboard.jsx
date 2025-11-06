import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiBook, FiTrendingUp, FiAward, FiClock, FiPlay, FiStar } from 'react-icons/fi';
import { fetchEnrolledCourses } from '../slices/courseSlice';
import { fetchProgress } from '../slices/progressSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { enrolledCourses, loading: coursesLoading } = useSelector((state) => state.courses);
  const { userProgress, loading: progressLoading } = useSelector((state) => state.progress);

  useEffect(() => {
    if (user) {
      dispatch(fetchEnrolledCourses());
      dispatch(fetchProgress());
    }
  }, [dispatch, user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    {
      icon: <FiBook className="w-6 h-6" />,
      label: 'Enrolled Courses',
      value: enrolledCourses?.length || 0,
      color: 'bg-blue-500'
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      label: 'XP Points',
      value: user?.xpPoints || 0,
      color: 'bg-green-500'
    },
    {
      icon: <FiAward className="w-6 h-6" />,
      label: 'Certificates',
      value: user?.certificates?.length || 0,
      color: 'bg-purple-500'
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      label: 'Day Streak',
      value: user?.streak || 0,
      color: 'bg-orange-500'
    }
  ];

  const recentCourses = enrolledCourses?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Ready to continue your learning journey?
          </p>
          {user?.role && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                user.role === 'mentor' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center">
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Continue Learning</h2>
              </div>
              
              {coursesLoading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : recentCourses.length > 0 ? (
                <div className="p-6 space-y-4">
                  {recentCourses.map((course) => (
                    <Link
                      key={course._id}
                      to={`/courses/${course._id}`}
                      className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <img
                        src={course.thumbnail || 'https://picsum.photos/64'}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600">{course.instructor?.name}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{course.progress || 0}%</span>
                          </div>
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${course.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <FiPlay className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <FiBook className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course</p>
                  <Link
                    to="/courses"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/courses"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <FiBook className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 group-hover:text-blue-600">Browse Courses</span>
                </Link>
                <Link
                  to="/mentors"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <FiStar className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 group-hover:text-purple-600">Find Mentors</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <FiAward className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 group-hover:text-green-600">View Certificates</span>
                </Link>
              </div>
            </motion.div>

            {/* XP Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white"
            >
              <h3 className="text-lg font-semibold mb-4">Level Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Current XP</span>
                  <span className="font-bold">{user?.xpPoints || 0}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className="bg-white h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(((user?.xpPoints || 0) % 100), 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-blue-100">
                  {100 - ((user?.xpPoints || 0) % 100)} XP to next level
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
