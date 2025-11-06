import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiUser, FiBook, FiClock } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminPayments = () => {
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPayoutRequests();
  }, []);

  const fetchPayoutRequests = async () => {
    try {
      const response = await api.get('/admin/payout-requests');
      setPayoutRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch payout requests');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, status, notes = '') => {
    try {
      await api.put(`/admin/payout-requests/${requestId}/status`, { status, notes });
      toast.success(`Payout request ${status}`);
      fetchPayoutRequests();
    } catch (error) {
      toast.error('Failed to update request status');
    }
  };

  const filteredRequests = payoutRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
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
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded" />
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Payout Requests</h1>
            <p className="text-gray-600 mt-2">Manage mentor payout requests and payment details</p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {['all', 'pending', 'paid', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                      filter === status
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {status} ({payoutRequests.filter(r => status === 'all' || r.status === status).length})
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mentor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiUser className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {request.mentor?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.mentor?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {request.paymentDetails ? (
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {request.paymentDetails.bankName}
                            </div>
                            <div className="text-gray-500">
                              {request.paymentDetails.accountHolderName}
                            </div>
                            <div className="text-gray-500">
                              A/C: ****{request.paymentDetails.accountNumber.slice(-4)}
                            </div>
                            <div className="text-gray-500">
                              IFSC: {request.paymentDetails.ifscCode}
                            </div>
                            {request.paymentDetails.upiId && (
                              <div className="text-gray-500">
                                UPI: {request.paymentDetails.upiId}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-red-500">No payment details</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiDollarSign className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            ₹{request.amount}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiClock className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateRequestStatus(request._id, 'paid')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Pay
                              </button>
                              <button
                                onClick={() => updateRequestStatus(request._id, 'rejected')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {request.status === 'paid' && (
                            <span className="text-green-600 text-xs">Paid</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <FiDollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payout requests found</h3>
              <p className="text-gray-500">No payout requests match the current filter.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPayments;