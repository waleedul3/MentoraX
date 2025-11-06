import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiBriefcase, FiUsers } from 'react-icons/fi';
import api from '../services/api';

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await api.get('/careers');
      setCareers(response.data);
    } catch (error) {
      console.error('Failed to fetch careers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCareers = careers.filter(career => {
    if (filter === 'all') return true;
    return career.type === filter;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800';
      case 'part-time': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'internship': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-8" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Join Our <span className="text-blue-600">Team</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us revolutionize education and make learning accessible to everyone. 
            Explore exciting career opportunities at MentoraX.
          </p>
        </motion.div>

        {/* Why Work With Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-12 mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Why Work With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FiUsers className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Great Team</h3>
              <p className="text-blue-100">Work with passionate, talented individuals who care about education</p>
            </div>
            <div className="text-center">
              <FiBriefcase className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Growth Opportunities</h3>
              <p className="text-blue-100">Continuous learning and career advancement in a fast-growing company</p>
            </div>
            <div className="text-center">
              <FiClock className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Work-Life Balance</h3>
              <p className="text-blue-100">Flexible working hours and remote-friendly culture</p>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 justify-center">
              {['all', 'full-time', 'part-time', 'contract', 'internship'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    filter === type
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {type === 'all' ? 'All Positions' : type.replace('-', ' ')}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredCareers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FiBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Open Positions</h3>
              <p className="text-gray-600">
                We don't have any open positions at the moment, but we're always looking for talented individuals. 
                Feel free to send us your resume!
              </p>
            </motion.div>
          ) : (
            filteredCareers.map((career, index) => (
              <motion.div
                key={career._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{career.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(career.type)}`}>
                        {career.type.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center space-x-6 text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <FiBriefcase className="w-4 h-4" />
                        <span>{career.department}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiMapPin className="w-4 h-4" />
                        <span>{career.location}</span>
                      </div>
                      {career.salary && (
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600 font-medium">{career.salary}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{career.description}</p>
                    
                    {career.requirements && career.requirements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {career.requirements.slice(0, 3).map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                          {career.requirements.length > 3 && (
                            <li className="text-blue-600">+ {career.requirements.length - 3} more...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="lg:ml-8 mt-6 lg:mt-0">
                    <button className="w-full lg:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Apply Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 bg-white rounded-xl shadow-lg p-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Don't See the Right Role?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always interested in meeting talented individuals. Send us your resume and tell us how you'd like to contribute to MentoraX.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium text-lg">
            Send Your Resume
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Careers;