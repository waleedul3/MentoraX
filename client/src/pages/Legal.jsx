import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiFileText, FiShield, FiUsers, FiBook } from 'react-icons/fi';

const Legal = () => {
  const legalPages = [
    {
      title: 'Terms of Service',
      description: 'Our terms and conditions for using MentoraX platform',
      icon: <FiFileText className="w-8 h-8" />,
      link: '/terms',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your personal information',
      icon: <FiShield className="w-8 h-8" />,
      link: '/privacy',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Community Guidelines',
      description: 'Rules and guidelines for our learning community',
      icon: <FiUsers className="w-8 h-8" />,
      link: '#',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Intellectual Property',
      description: 'Copyright and trademark information',
      icon: <FiBook className="w-8 h-8" />,
      link: '#',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

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
            Legal <span className="text-blue-600">Information</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Important legal documents and policies that govern your use of MentoraX platform.
          </p>
        </motion.div>

        {/* Legal Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {legalPages.map((page, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={page.link}
                className="block bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
              >
                <div className={`w-16 h-16 ${page.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {page.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {page.title}
                </h3>
                <p className="text-gray-600">
                  {page.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Legal Compliance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Data Protection</h3>
              <p className="text-gray-600 mb-4">
                MentoraX is committed to protecting your privacy and complying with applicable data protection laws, 
                including GDPR, CCPA, and other regional privacy regulations.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Secure data encryption and storage</li>
                <li>Regular security audits and assessments</li>
                <li>Transparent data collection practices</li>
                <li>User rights and data portability</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Educational Standards</h3>
              <p className="text-gray-600 mb-4">
                Our platform adheres to educational industry standards and best practices to ensure 
                quality learning experiences for all users.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Accredited course content and materials</li>
                <li>Qualified instructor verification</li>
                <li>Accessibility compliance (WCAG 2.1)</li>
                <li>Regular content quality reviews</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-12"
        >
          <h2 className="text-3xl font-bold mb-4">Legal Questions?</h2>
          <p className="text-xl mb-8 text-blue-100">
            If you have any questions about our legal policies or need clarification on any terms, 
            our legal team is here to help.
          </p>
          <div className="space-y-2">
            <p><strong>Legal Department:</strong> legal@mentorax.com</p>
            <p><strong>Privacy Officer:</strong> privacy@mentorax.com</p>
            <p><strong>Compliance Team:</strong> compliance@mentorax.com</p>
          </div>
        </motion.div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8 text-gray-500"
        >
          <p>Legal documents last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Legal;