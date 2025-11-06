import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiUsers, FiAward, FiHeart } from 'react-icons/fi';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">MentoraX</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering learners worldwide through personalized mentorship and cutting-edge educational technology.
          </p>
        </motion.div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              At MentoraX, we believe that quality education should be accessible to everyone, everywhere. 
              Our mission is to bridge the gap between learners and industry experts through innovative 
              technology and personalized mentorship programs.
            </p>
            <p className="text-lg text-gray-600">
              We're committed to creating a learning ecosystem where students can grow, mentors can share 
              their expertise, and knowledge flows freely across boundaries.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose MentoraX?</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FiTarget className="w-6 h-6 text-blue-600 mt-1" />
                <span className="text-gray-600">Personalized learning paths tailored to your goals</span>
              </li>
              <li className="flex items-start space-x-3">
                <FiUsers className="w-6 h-6 text-blue-600 mt-1" />
                <span className="text-gray-600">Direct access to industry experts and mentors</span>
              </li>
              <li className="flex items-start space-x-3">
                <FiAward className="w-6 h-6 text-blue-600 mt-1" />
                <span className="text-gray-600">Verified certificates and skill recognition</span>
              </li>
              <li className="flex items-start space-x-3">
                <FiHeart className="w-6 h-6 text-blue-600 mt-1" />
                <span className="text-gray-600">Supportive community of learners and educators</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-blue-600 rounded-xl text-white p-12 mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold mb-2">10K+</h3>
              <p className="text-blue-100">Active Students</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">500+</h3>
              <p className="text-blue-100">Expert Mentors</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">1000+</h3>
              <p className="text-blue-100">Courses Available</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">95%</h3>
              <p className="text-blue-100">Success Rate</p>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-6">
              Founded in 2024, MentoraX was born from a simple observation: traditional education 
              wasn't keeping pace with the rapidly evolving job market. Our founders, experienced 
              educators and technologists, envisioned a platform where learning could be more 
              personal, practical, and accessible.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Today, MentoraX serves thousands of learners across the globe, connecting them with 
              industry professionals who provide real-world insights and guidance. Our platform 
              combines the best of technology with human connection to create meaningful learning experiences.
            </p>
            <p className="text-lg text-gray-600">
              We're just getting started. Join us as we continue to revolutionize education and 
              empower the next generation of learners and leaders.
            </p>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTarget className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Excellence</h3>
            <p className="text-gray-600">
              We strive for excellence in everything we do, from course content to user experience.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Community</h3>
            <p className="text-gray-600">
              Building a supportive community where learners and mentors can grow together.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Impact</h3>
            <p className="text-gray-600">
              Creating meaningful impact in learners' lives and careers through quality education.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;