import User from '../models/User.js';
import Message from '../models/Message.js';
import mongoose from 'mongoose';

// @desc    Get all mentors
// @route   GET /api/mentors
// @access  Private
export const getMentors = async (req, res, next) => {
  try {
    const mentors = await User.find({ role: 'mentor', isActive: true })
      .select('name email avatar preferences')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: mentors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single mentor
// @route   GET /api/mentors/:id
// @access  Private
export const getMentor = async (req, res, next) => {
  try {
    const mentor = await User.findOne({
      _id: req.params.id,
      role: 'mentor',
      isActive: true
    }).select('name email avatar preferences');

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: mentor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message to mentor
// @route   POST /api/mentors/:id/message
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { text, message, subject } = req.body;
    const mentorId = req.params.id;
    const senderId = req.user.id;

    // Handle both chat messages (text) and formal messages (message, subject)
    const messageText = text || message;
    
    if (!messageText) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required'
      });
    }

    // Create formal message using the correct Message model structure
    const newMessage = await Message.create({
      sender: senderId,
      recipient: mentorId,
      message: messageText,
      subject: subject || 'Direct Message'
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages with mentor
// @route   GET /api/mentors/:id/messages
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const mentorId = req.params.id;
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    // Get messages between user and mentor
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: mentorId },
        { sender: mentorId, recipient: userId }
      ]
    })
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar')
      .populate('replies.sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Mark messages as read where current user is recipient
    await Message.updateMany(
      {
        sender: mentorId,
        recipient: userId,
        isRead: false
      },
      {
        isRead: true
      }
    );

    res.status(200).json({
      success: true,
      data: messages.reverse() // Reverse to show oldest first
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's chat rooms
// @route   GET /api/mentors/chats
// @access  Private
export const getChatRooms = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all unique chat partners from messages
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: new mongoose.Types.ObjectId(userId) }, { recipient: new mongoose.Types.ObjectId(userId) }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', new mongoose.Types.ObjectId(userId)] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Populate user details
    const chatRooms = await Promise.all(
      messages.map(async (chat) => {
        const lastMessage = await Message.findById(chat.lastMessage._id)
          .populate('sender', 'name avatar')
          .populate('recipient', 'name avatar');

        const partner = await User.findById(chat._id).select('name avatar role');

        return {
          chatId: chat._id,
          partner,
          lastMessage,
          unreadCount: chat.unreadCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: chatRooms
    });
  } catch (error) {
    next(error);
  }
};