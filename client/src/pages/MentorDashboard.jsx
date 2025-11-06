import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMentorOverview } from '../slices/mentorSlice';

const MentorDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { overview, loading } = useSelector((state) => state.mentor);

  useEffect(() => {
    if (user?.role === 'mentor') {
      dispatch(fetchMentorOverview());
    }
  }, [dispatch, user]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user?.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Courses</h3>
          <p className="text-3xl font-bold text-blue-600">{overview.totalCourses || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Students</h3>
          <p className="text-3xl font-bold text-green-600">{overview.totalStudents || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Average Rating</h3>
          <p className="text-3xl font-bold text-yellow-600">{overview.avgRating || '0.0'}⭐</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Monthly Earnings</h3>
          <p className="text-3xl font-bold text-purple-600">${overview.monthlyEarnings || 0}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/mentor/courses/create"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center"
            >
              Create New Course
            </Link>
            <Link
              to="/mentor/sessions"
              className="block w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-center"
            >
              Schedule Session
            </Link>
            <Link
              to="/mentor/messages"
              className="block w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 text-center"
            >
              View Messages
            </Link>
            <Link
              to="/mentor/payment-details"
              className="block w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 text-center"
            >
              Payment Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;