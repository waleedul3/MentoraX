import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Lesson.deleteMany();
    await Quiz.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@mentorax.com',
      password: 'admin123',
      role: 'admin',
      xpPoints: 1000
    });

    const mentor1 = await User.create({
      name: 'John Smith',
      email: 'john@mentorax.com',
      password: 'mentor123',
      role: 'mentor',
      xpPoints: 500,
      preferences: {
        categories: ['Web Development', 'JavaScript']
      }
    });

    const mentor2 = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@mentorax.com',
      password: 'mentor123',
      role: 'mentor',
      xpPoints: 750,
      preferences: {
        categories: ['Data Science', 'AI/ML']
      }
    });

    const student1 = await User.create({
      name: 'Alice Brown',
      email: 'alice@mentorax.com',
      password: 'student123',
      role: 'student',
      xpPoints: 150,
      streak: 5,
      preferences: {
        categories: ['Web Development'],
        learningStyle: 'visual'
      }
    });

    const student2 = await User.create({
      name: 'Bob Wilson',
      email: 'bob@mentorax.com',
      password: 'student123',
      role: 'student',
      xpPoints: 200,
      streak: 3,
      preferences: {
        categories: ['Data Science'],
        learningStyle: 'auditory'
      }
    });

    console.log('👥 Created users');

    // Create courses
    const course1 = await Course.create({
      title: 'Complete React.js Masterclass',
      description: 'Learn React.js from basics to advanced concepts including hooks, context, and state management.',
      category: 'Web Development',
      level: 'Intermediate',
      price: 99.99,
      instructor: mentor1._id,
      isPublished: true,
      tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
      rating: { average: 4.8, count: 156 }
    });

    const course2 = await Course.create({
      title: 'Python Data Science Bootcamp',
      description: 'Master data science with Python, pandas, numpy, and machine learning fundamentals.',
      category: 'Data Science',
      level: 'Beginner',
      price: 149.99,
      instructor: mentor2._id,
      isPublished: true,
      tags: ['Python', 'Data Science', 'Machine Learning', 'Pandas'],
      rating: { average: 4.9, count: 203 }
    });

    const course3 = await Course.create({
      title: 'Advanced JavaScript Concepts',
      description: 'Deep dive into advanced JavaScript concepts including closures, prototypes, and async programming.',
      category: 'Web Development',
      level: 'Advanced',
      price: 79.99,
      instructor: mentor1._id,
      isPublished: true,
      tags: ['JavaScript', 'Advanced', 'ES6+', 'Async'],
      rating: { average: 4.7, count: 89 }
    });

    console.log('📚 Created courses');

    // Create lessons for React course
    const reactLessons = await Lesson.create([
      {
        courseId: course1._id,
        title: 'Introduction to React',
        description: 'What is React and why use it?',
        videoUrl: 'https://example.com/video1.mp4',
        content: 'React is a JavaScript library for building user interfaces...',
        duration: 15,
        order: 1,
        isPreview: true,
        resources: [
          { title: 'React Documentation', url: 'https://reactjs.org', type: 'link' },
          { title: 'Setup Guide', url: 'https://example.com/setup.pdf', type: 'pdf' }
        ]
      },
      {
        courseId: course1._id,
        title: 'JSX and Components',
        description: 'Understanding JSX syntax and creating components',
        videoUrl: 'https://example.com/video2.mp4',
        content: 'JSX allows you to write HTML-like syntax in JavaScript...',
        duration: 25,
        order: 2,
        resources: [
          { title: 'JSX Guide', url: 'https://example.com/jsx.pdf', type: 'pdf' }
        ]
      },
      {
        courseId: course1._id,
        title: 'State and Props',
        description: 'Managing component state and passing data with props',
        videoUrl: 'https://example.com/video3.mp4',
        content: 'State allows components to manage their own data...',
        duration: 30,
        order: 3
      },
      {
        courseId: course1._id,
        title: 'React Hooks',
        description: 'useState, useEffect, and custom hooks',
        videoUrl: 'https://example.com/video4.mp4',
        content: 'Hooks let you use state and other React features...',
        duration: 35,
        order: 4
      }
    ]);

    // Create lessons for Python course
    const pythonLessons = await Lesson.create([
      {
        courseId: course2._id,
        title: 'Python Basics for Data Science',
        description: 'Python fundamentals and data types',
        videoUrl: 'https://example.com/python1.mp4',
        content: 'Python is a powerful programming language...',
        duration: 20,
        order: 1,
        isPreview: true
      },
      {
        courseId: course2._id,
        title: 'NumPy Fundamentals',
        description: 'Working with arrays and mathematical operations',
        videoUrl: 'https://example.com/python2.mp4',
        content: 'NumPy is the foundation of data science in Python...',
        duration: 28,
        order: 2
      },
      {
        courseId: course2._id,
        title: 'Pandas for Data Manipulation',
        description: 'DataFrames, Series, and data cleaning',
        videoUrl: 'https://example.com/python3.mp4',
        content: 'Pandas provides powerful data structures...',
        duration: 40,
        order: 3
      }
    ]);

    // Update courses with lessons
    course1.lessons = reactLessons.map(lesson => lesson._id);
    course2.lessons = pythonLessons.map(lesson => lesson._id);
    await course1.save();
    await course2.save();

    console.log('📖 Created lessons');

    // Create quizzes
    const reactQuiz = await Quiz.create({
      courseId: course1._id,
      title: 'React Fundamentals Quiz',
      description: 'Test your knowledge of React basics',
      timeLimit: 30,
      questions: [
        {
          question: 'What is JSX?',
          options: [
            'A JavaScript extension',
            'A syntax extension for JavaScript',
            'A new programming language',
            'A CSS framework'
          ],
          correctIndex: 1,
          marks: 2,
          explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript.'
        },
        {
          question: 'Which hook is used for managing state in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correctIndex: 1,
          marks: 2,
          explanation: 'useState is the hook used for managing local state in functional components.'
        },
        {
          question: 'What does the useEffect hook do?',
          options: [
            'Manages component state',
            'Handles side effects',
            'Creates context',
            'Renders components'
          ],
          correctIndex: 1,
          marks: 3,
          explanation: 'useEffect is used to handle side effects like API calls, subscriptions, and DOM manipulation.'
        }
      ]
    });

    const pythonQuiz = await Quiz.create({
      courseId: course2._id,
      title: 'Python Data Science Quiz',
      description: 'Test your Python and data science knowledge',
      timeLimit: 25,
      questions: [
        {
          question: 'Which library is primarily used for numerical computing in Python?',
          options: ['Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn'],
          correctIndex: 1,
          marks: 2,
          explanation: 'NumPy is the fundamental library for numerical computing in Python.'
        },
        {
          question: 'What is a DataFrame in Pandas?',
          options: [
            'A 1D array',
            'A 2D labeled data structure',
            'A plotting function',
            'A machine learning model'
          ],
          correctIndex: 1,
          marks: 3,
          explanation: 'A DataFrame is a 2D labeled data structure with columns of potentially different types.'
        }
      ]
    });

    // Update courses with quizzes
    course1.quiz = reactQuiz._id;
    course2.quiz = pythonQuiz._id;
    await course1.save();
    await course2.save();

    console.log('❓ Created quizzes');

    // Enroll students in courses
    course1.enrolledStudents.push(student1._id, student2._id);
    course2.enrolledStudents.push(student1._id, student2._id);
    await course1.save();
    await course2.save();

    student1.coursesEnrolled.push(course1._id, course2._id);
    student2.coursesEnrolled.push(course1._id, course2._id);
    await student1.save();
    await student2.save();

    console.log('✅ Sample data seeded successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('Admin: admin@mentorax.com / admin123');
    console.log('Mentor: john@mentorax.com / mentor123');
    console.log('Mentor: sarah@mentorax.com / mentor123');
    console.log('Student: alice@mentorax.com / student123');
    console.log('Student: bob@mentorax.com / student123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();