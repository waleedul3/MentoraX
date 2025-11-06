import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MentorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setError(null);
      console.log('Fetching courses...');
      const response = await api.get('/courses/my-courses');
      console.log('Courses response:', response);
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      console.error('Error details:', error.response?.data);
      setError(`Failed to load courses: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${courseId}`);
        setCourses(courses.filter(course => course._id !== courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  if (loading) return <div className="p-6">Loading courses...</div>;
  
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Courses</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchCourses}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Link 
          to="/mentor/courses/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't created any courses yet.</p>
          <Link 
            to="/mentor/courses/create"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={course.thumbnail || '/api/placeholder/300/200'} 
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    {course.enrolledStudents?.length || 0} students
                  </span>
                  <span className="text-sm text-yellow-600">
                    ⭐ {course.rating?.average || '0.0'}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Link 
                    to={`/mentor/courses/${course._id}/edit`}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-center hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                  <Link 
                    to={`/mentor/courses/${course._id}/students`}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-center hover:bg-green-700"
                  >
                    Students
                  </Link>
                  <button 
                    onClick={() => deleteCourse(course._id)}
                    className="bg-red-600 text-white py-2 px-3 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorCourses;