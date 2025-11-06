import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();

const checkDatabase = async () => {
  try {
    console.log('🔍 Checking database connection and data...\n');
    
    await connectDB();
    
    // Check users
    const userCount = await User.countDocuments();
    console.log(`👥 Total users in database: ${userCount}`);
    
    if (userCount === 0) {
      console.log('⚠️  No users found! Run: npm run seed');
      return;
    }
    
    // Check demo users
    const demoUsers = await User.find({
      email: { $in: ['alice@mentorax.com', 'john@mentorax.com', 'admin@mentorax.com'] }
    }).select('name email role');
    
    console.log('\n📋 Demo users:');
    demoUsers.forEach(user => {
      console.log(`  ✅ ${user.role}: ${user.name} (${user.email})`);
    });
    
    if (demoUsers.length < 3) {
      console.log('\n⚠️  Some demo users missing! Run: npm run seed');
    } else {
      console.log('\n🎉 Database is ready for testing!');
      console.log('\nTest login credentials:');
      console.log('  Student: alice@mentorax.com / student123');
      console.log('  Mentor: john@mentorax.com / mentor123');
      console.log('  Admin: admin@mentorax.com / admin123');
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    process.exit(0);
  }
};

checkDatabase();