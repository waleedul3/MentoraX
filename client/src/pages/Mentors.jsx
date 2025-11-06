import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiSend, FiUser } from 'react-icons/fi';
import { fetchMentors, fetchMessages, sendMessage, fetchChatRooms } from '../slices/chatSlice';
import MessageModal from '../components/MessageModal';
import toast from 'react-hot-toast';

const Mentors = () => {
  const dispatch = useDispatch();
  const { mentors, messages, chatRooms, loading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [activeTab, setActiveTab] = useState('mentors');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [mentorToMessage, setMentorToMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchMentors());
    dispatch(fetchChatRooms());
  }, [dispatch]);

  useEffect(() => {
    if (selectedMentor) {
      dispatch(fetchMessages(selectedMentor._id));
    }
  }, [dispatch, selectedMentor]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedMentor) return;

    try {
      await dispatch(sendMessage({
        mentorId: selectedMentor._id,
        text: messageText
      })).unwrap();
      setMessageText('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleMentorSelect = (mentor) => {
    setSelectedMentor(mentor);
    setActiveTab('chat');
  };

  const handleMessageMentor = (mentor) => {
    setMentorToMessage(mentor);
    setShowMessageModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Connect with Mentors</h1>
          <p className="text-xl text-gray-600">Get personalized guidance from industry experts</p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
            {/* Sidebar */}
            <div className="border-r border-gray-200">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('mentors')}
                    className={`flex-1 py-4 px-6 text-sm font-medium ${
                      activeTab === 'mentors'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Find Mentors
                  </button>
                  <button
                    onClick={() => setActiveTab('chats')}
                    className={`flex-1 py-4 px-6 text-sm font-medium ${
                      activeTab === 'chats'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    My Chats
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="h-full overflow-y-auto">
                {activeTab === 'mentors' ? (
                  <div className="p-4 space-y-4">
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex items-center space-x-3 p-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      mentors.map((mentor) => (
                        <motion.div
                          key={mentor._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={mentor.avatar || 'https://picsum.photos/48'}
                              alt={mentor.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{mentor.name}</h3>
                              <p className="text-sm text-gray-600">
                                {mentor.preferences?.categories?.join(', ') || 'General Mentor'}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleMentorSelect(mentor)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Start Chat"
                              >
                                <FiMessageCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleMessageMentor(mentor)}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Message
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {chatRooms.length > 0 ? (
                      chatRooms.filter(chat => chat.partner).map((chat) => (
                        <motion.div
                          key={chat.chatId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedMentor(chat.partner)}
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={chat.partner?.avatar || 'https://picsum.photos/48'}
                              alt={chat.partner?.name || 'Unknown'}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{chat.partner?.name || 'Unknown'}</h3>
                              <p className="text-sm text-gray-600 truncate">
                                {chat.lastMessage?.message || chat.lastMessage?.text || 'No messages yet'}
                              </p>
                            </div>
                            {chat.unreadCount > 0 && (
                              <div className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                                {chat.unreadCount}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FiMessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No conversations yet</p>
                        <p className="text-sm text-gray-500">Start chatting with a mentor</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 flex flex-col">
              {selectedMentor ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedMentor.avatar || 'https://picsum.photos/40'}
                        alt={selectedMentor.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedMentor.name}</h3>
                        <p className="text-sm text-gray-600">Mentor</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div key={message._id} className="space-y-3">
                        {/* Original Message */}
                        <div
                          className={`flex ${
                            message.sender._id === user.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender._id === user.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {message.subject && message.subject !== 'Direct Message' && (
                              <p className="font-semibold text-sm mb-1">{message.subject}</p>
                            )}
                            <p>{message.message || message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender._id === user.id ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        
                        {/* Replies */}
                        {message.replies && message.replies.length > 0 && (
                          <div className="ml-8 space-y-2">
                            {message.replies.map((reply, index) => (
                              <div
                                key={index}
                                className={`flex ${
                                  reply.sender === user.id ? 'justify-end' : 'justify-start'
                                }`}
                              >
                                <div
                                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                                    reply.sender === user.id
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-gray-200 text-gray-800'
                                  }`}
                                >
                                  <p>{reply.message}</p>
                                  <p className={`text-xs mt-1 ${
                                    reply.sender === user.id ? 'text-blue-100' : 'text-gray-600'
                                  }`}>
                                    {new Date(reply.createdAt).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={!messageText.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiSend className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Mentor</h3>
                    <p className="text-gray-600">Choose a mentor to start a conversation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Message Modal */}
        {mentorToMessage && (
          <MessageModal
            mentor={mentorToMessage}
            course={null}
            isOpen={showMessageModal}
            onClose={() => {
              setShowMessageModal(false);
              setMentorToMessage(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Mentors;
