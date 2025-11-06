import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiClock, FiMessageSquare } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get('/admin/contacts');
      setContacts(response.data);
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (contactId, status) => {
    try {
      await api.put(`/admin/contacts/${contactId}/status`, { status });
      toast.success(`Contact marked as ${status}`);
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    return contact.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-gray-600 mt-2">Manage contact form submissions</p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {['all', 'new', 'read', 'replied'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                      filter === status
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {status} ({contacts.filter(c => status === 'all' || c.status === status).length})
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Contacts List */}
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <motion.div
                key={contact._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <FiUser className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{contact.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiMail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">{contact.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiClock className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {contact.subject}
                    </h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-2">
                        <FiMessageSquare className="w-5 h-5 text-gray-400 mt-1" />
                        <p className="text-gray-700">{contact.message}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col space-y-2">
                    {contact.status === 'new' && (
                      <button
                        onClick={() => updateStatus(contact._id, 'read')}
                        className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      >
                        Mark as Read
                      </button>
                    )}
                    {contact.status === 'read' && (
                      <button
                        onClick={() => updateStatus(contact._id, 'replied')}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Mark as Replied
                      </button>
                    )}
                    <a
                      href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
                    >
                      Reply
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <FiMail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
              <p className="text-gray-500">No contact messages match the current filter.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminContacts;