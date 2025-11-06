import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiPlus, FiEdit, FiTrash2, FiMapPin } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminCareers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time',
    description: '',
    requirements: [''],
    responsibilities: [''],
    salary: '',
    isActive: true
  });

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await api.get('/admin/careers');
      setCareers(response.data);
    } catch (error) {
      toast.error('Failed to fetch careers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        responsibilities: formData.responsibilities.filter(resp => resp.trim() !== '')
      };

      if (editingCareer) {
        await api.put(`/careers/${editingCareer._id}`, cleanedData);
        toast.success('Career updated successfully');
      } else {
        await api.post('/careers', cleanedData);
        toast.success('Career created successfully');
      }
      
      setShowModal(false);
      setEditingCareer(null);
      resetForm();
      fetchCareers();
    } catch (error) {
      toast.error('Failed to save career');
    }
  };

  const handleEdit = (career) => {
    setEditingCareer(career);
    setFormData({
      title: career.title,
      department: career.department,
      location: career.location,
      type: career.type,
      description: career.description,
      requirements: career.requirements.length > 0 ? career.requirements : [''],
      responsibilities: career.responsibilities.length > 0 ? career.responsibilities : [''],
      salary: career.salary || '',
      isActive: career.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (careerId) => {
    if (!window.confirm('Are you sure you want to delete this career?')) return;
    
    try {
      await api.delete(`/careers/${careerId}`);
      toast.success('Career deleted successfully');
      fetchCareers();
    } catch (error) {
      toast.error('Failed to delete career');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'full-time',
      description: '',
      requirements: [''],
      responsibilities: [''],
      salary: '',
      isActive: true
    });
  };

  const addArrayField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const updateArrayField = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray.length > 0 ? newArray : ['']
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800';
      case 'part-time': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'internship': return 'bg-orange-100 text-orange-800';
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
              {[...Array(3)].map((_, i) => (
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Career Management</h1>
              <p className="text-gray-600 mt-2">Manage job listings and career opportunities</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingCareer(null);
                setShowModal(true);
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Career</span>
            </button>
          </div>

          {/* Careers List */}
          <div className="space-y-4">
            {careers.map((career) => (
              <motion.div
                key={career._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{career.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(career.type)}`}>
                        {career.type.replace('-', ' ')}
                      </span>
                      {!career.isActive && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-gray-600 mb-3">
                      <div className="flex items-center space-x-2">
                        <FiBriefcase className="w-4 h-4" />
                        <span>{career.department}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiMapPin className="w-4 h-4" />
                        <span>{career.location}</span>
                      </div>
                      {career.salary && (
                        <span className="text-green-600 font-medium">{career.salary}</span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{career.description}</p>
                    
                    <div className="text-sm text-gray-500">
                      Created: {new Date(career.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="ml-6 flex space-x-2">
                    <button
                      onClick={() => handleEdit(career)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(career._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {careers.length === 0 && (
            <div className="text-center py-12">
              <FiBriefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No careers found</h3>
              <p className="text-gray-500">Create your first job listing to get started.</p>
            </div>
          )}
        </motion.div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingCareer ? 'Edit Career' : 'Add New Career'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary (Optional)</label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      placeholder="e.g., $50,000 - $70,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">Active (visible to public)</label>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                      {editingCareer ? 'Update Career' : 'Create Career'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCareers;