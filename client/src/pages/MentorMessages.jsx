import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMail, FiMessageCircle, FiClock, FiUser, FiSend } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const MentorMessages = () => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages/mentor');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (messageId) => {
    if (!replyText.trim()) return;
    
    try {
      const response = await api.post(`/messages/${messageId}/reply`, {
        message: replyText
      });
      
      setMessages(messages.map(msg => 
        msg._id === messageId ? response.data : msg
      ));
      
      if (selectedMessage && selectedMessage._id === messageId) {
        setSelectedMessage(response.data);
      }
      
      setReplyText('');
      toast.success('Reply sent successfully');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await api.put(`/messages/${messageId}/read`);
      setMessages(messages.map(msg => 
        msg._id === messageId ? { ...msg, isRead: true } : msg
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsRead(message._id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="h-64 bg-gray-200 rounded" />
                </div>
              </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Inbox</h2>
                  <p className="text-sm text-gray-600">{messages.length} messages</p>
                </div>
                
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <FiMail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No messages yet</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        onClick={() => handleSelectMessage(message)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedMessage?._id === message._id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                        } ${!message.isRead ? 'bg-blue-25' : ''}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <FiUser className="w-5 h-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium text-gray-900 truncate ${
                                !message.isRead ? 'font-bold' : ''
                              }`}>
                                {message.sender.name}
                              </p>
                              {!message.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                            <div className="flex items-center mt-1">
                              <FiClock className="w-3 h-3 text-gray-400 mr-1" />
                              <p className="text-xs text-gray-400">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                {selectedMessage ? (
                  <div className="h-full">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {selectedMessage.subject}
                          </h3>
                          <div className="flex items-center mt-2 text-sm text-gray-600">
                            <span>From: {selectedMessage.sender.name}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                          </div>
                          {selectedMessage.course && (
                            <div className="mt-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {selectedMessage.course.title}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 max-h-64 overflow-y-auto">
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                      
                      {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                        <div className="mt-6 space-y-4">
                          <h4 className="text-sm font-medium text-gray-900">Replies</h4>
                          {selectedMessage.replies.map((reply, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {reply.sender.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(reply.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {reply.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 border-t border-gray-200">
                      <div className="space-y-4">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleReply(selectedMessage._id)}
                            disabled={!replyText.trim()}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FiSend className="w-4 h-4 mr-2" />
                            Send Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <FiMessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Select a message to view</p>
                      <p className="text-sm">Choose a message from the list to read and reply</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MentorMessages;