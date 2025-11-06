import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: '',
    thumbnail: '',
    duration: '',
    lessons: [],
    requirements: [''],
    learningOutcomes: ['']
  });

  const categories = [
    'Programming', 'Web Development', 'Mobile Development', 'Data Science',
    'Machine Learning', 'DevOps', 'Cybersecurity', 'UI/UX Design',
    'Digital Marketing', 'Business', 'Photography', 'Music'
  ];

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      const course = response.data;
      
      setFormData({
        title: course.title || '',
        description: course.description || '',
        category: course.category || '',
        level: course.level || 'beginner',
        price: course.price || '',
        thumbnail: course.thumbnail || '',
        duration: course.duration || '',
        lessons: course.lessons || [],
        requirements: course.requirements?.length ? course.requirements : [''],
        learningOutcomes: course.learningOutcomes?.length ? course.learningOutcomes : ['']
      });
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course');
      navigate('/mentor/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLessonChange = (index, field, value) => {
    const updatedLessons = [...formData.lessons];
    updatedLessons[index] = { ...updatedLessons[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      lessons: updatedLessons
    }));
  };

  const addLesson = () => {
    setFormData(prev => ({
      ...prev,
      lessons: [...prev.lessons, { title: '', content: '', videoUrl: '', duration: 0 }]
    }));
  };

  const removeLesson = (index) => {
    if (formData.lessons.length > 1) {
      const updatedLessons = formData.lessons.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        lessons: updatedLessons
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      const updatedArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        [field]: updatedArray
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const cleanedData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        learningOutcomes: formData.learningOutcomes.filter(outcome => outcome.trim() !== ''),
        lessons: formData.lessons.map(lesson => ({
          ...lesson,
          duration: parseInt(lesson.duration) || 0
        }))
      };

      await api.put(`/courses/${id}`, cleanedData);
      toast.success('Course updated successfully!');
      navigate('/mentor/courses');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading course...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h1 className="text-3xl font-bold mb-6">Edit Course</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level *
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter requirement"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('requirements', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Requirement
            </button>
          </div>

          {/* Learning Outcomes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Outcomes
            </label>
            {formData.learningOutcomes.map((outcome, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={outcome}
                  onChange={(e) => handleArrayChange('learningOutcomes', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What will students learn?"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('learningOutcomes', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('learningOutcomes')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Learning Outcome
            </button>
          </div>

          {/* Lessons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Course Lessons
            </label>
            {formData.lessons.map((lesson, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-medium">Lesson {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove Lesson
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={lesson.duration}
                      onChange={(e) => handleLessonChange(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={lesson.videoUrl}
                    onChange={(e) => handleLessonChange(index, 'videoUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Content *
                  </label>
                  <textarea
                    value={lesson.content}
                    onChange={(e) => handleLessonChange(index, 'content', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addLesson}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              + Add Lesson
            </button>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Updating Course...' : 'Update Course'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/mentor/courses')}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditCourse;