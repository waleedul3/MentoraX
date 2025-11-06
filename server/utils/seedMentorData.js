import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Session from '../models/Session.js';
import Earning from '../models/Earning.js';
import Message from '../models/Message.js';
import connectDB from '../config/database.js';

const seedMentorData = async () => {
  try {
    await connectDB();
    
    // Create sample earnings for existing mentors
    const mentors = await User.find({ role: 'mentor' });
    const students = await User.find({ role: 'student' });
    const courses = await Course.find();
    
    if (mentors.length > 0 && students.length > 0 && courses.length > 0) {
      // Create sample earnings
      const sampleEarnings = [
        {
          mentor: mentors[0]._id,
          course: courses[0]._id,
          student: students[0]._id,
          amount: 100,
          commission: 0.2,
          netAmount: 80,
          type: 'course_enrollment',
          status: 'paid'
        },
        {
          mentor: mentors[0]._id,
          course: courses[1]._id,
          student: students[1]._id,
          amount: 150,
          commission: 0.2,
          netAmount: 120,
          type: 'course_enrollment',
          status: 'pending'
        }
      ];
      
      await Earning.insertMany(sampleEarnings);
      
      // Create sample sessions
      const sampleSessions = [
        {
          title: 'React Fundamentals Live Session',
          description: 'Interactive session covering React basics',
          mentor: mentors[0]._id,
          course: courses[0]._id,
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          duration: 90,
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          status: 'scheduled'
        },
        {
          title: 'Advanced JavaScript Q&A',
          description: 'Ask questions about advanced JavaScript concepts',
          mentor: mentors[0]._id,
          course: courses[1]._id,
          scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
          duration: 60,
          meetingLink: 'https://meet.google.com/xyz-uvwx-yz',
          status: 'scheduled'
        }
      ];
      
      await Session.insertMany(sampleSessions);
      
      // Create sample messages
      const sampleMessages = [
        {
          sender: students[0]._id,
          recipient: mentors[0]._id,
          content: 'Hi! I have a question about the React hooks lesson.',
          course: courses[0]._id
        },
        {
          sender: mentors[0]._id,
          recipient: students[0]._id,
          content: 'Sure! What specific part of hooks are you struggling with?',
          course: courses[0]._id
        },
        {
          sender: students[1]._id,
          recipient: mentors[0]._id,
          content: 'When is the next live session scheduled?',
          course: courses[1]._id
        }
      ];
      
      await Message.insertMany(sampleMessages);
      
      console.log('✅ Mentor data seeded successfully');
    } else {
      console.log('❌ Please run the main seed script first to create users and courses');
    }
    
  } catch (error) {
    console.error('❌ Error seeding mentor data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedMentorData();