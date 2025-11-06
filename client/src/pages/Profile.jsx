import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiAward, FiTrendingUp, FiEdit3, FiSave, FiX } from 'react-icons/fi';
import { updateProfile } from '../slices/authSlice';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    preferences: {
      categories: [],
      learningStyle: 'visual'
    }
  });

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'AI/ML',
    'DevOps',
    'Cybersecurity',
    'Design',
    'Business'
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        avatar: user.avatar || '',
        preferences: {
          categories: user.preferences?.categories || [],
          learningStyle: user.preferences?.learningStyle || 'visual'
        }
      });
    }
    fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    try {
      const response = await api.get('/certificates');
      setCertificates(response.data.data);
    } catch (error) {
      console.error('Failed to fetch certificates');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        categories: prev.preferences.categories.includes(category)
          ? prev.preferences.categories.filter(c => c !== category)
          : [...prev.preferences.categories, category]
      }
    }));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      avatar: user.avatar || '',
      preferences: {
        categories: user.preferences?.categories || [],
        learningStyle: user.preferences?.learningStyle || 'visual'
      }
    });
    setIsEditing(false);
  };

  const getXPLevel = (xp) => {
    return Math.floor(xp / 100) + 1;
  };

  const getXPProgress = (xp) => {
    return xp % 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <img
                src={user?.avatar || 'https://picsum.photos/96'}
                alt={user?.name}
                className="w-24 h-24 rounded-full border-4 border-blue-100"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-600 capitalize">{user?.role}</p>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <FiEdit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{user?.xpPoints || 0}</div>
              <div className="text-sm text-gray-600">XP Points</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">Level {getXPLevel(user?.xpPoints || 0)}</div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{user?.streak || 0}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{certificates.length}</div>
              <div className="text-sm text-gray-600">Certificates</div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Level {getXPLevel(user?.xpPoints || 0)} Progress</span>
              <span>{getXPProgress(user?.xpPoints || 0)}/100 XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${getXPProgress(user?.xpPoints || 0)}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
              {isEditing && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-1 px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user?.name}</p>
                )}
              </div>

              {/* Learning Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Style
                </label>
                {isEditing ? (
                  <select
                    name="preferences.learningStyle"
                    value={formData.preferences.learningStyle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="visual">Visual</option>
                    <option value="auditory">Auditory</option>
                    <option value="kinesthetic">Kinesthetic</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{user?.preferences?.learningStyle || 'Visual'}</p>
                )}
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryToggle(category)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          formData.preferences.categories.includes(category)
                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                            : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user?.preferences?.categories?.length > 0 ? (
                      user.preferences.categories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {category}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No interests selected</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Certificates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">My Certificates</h2>
            
            {certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.map((certificate) => (
                  <div
                    key={certificate._id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                          <FiAward className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {certificate.courseId?.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Grade: {certificate.grade} • Score: {certificate.score}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(certificate.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => window.open(`/certificate/${certificate._id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiAward className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
                <p className="text-gray-600">Complete courses and pass quizzes to earn certificates</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
