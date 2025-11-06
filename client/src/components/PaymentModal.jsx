import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import toast from 'react-hot-toast';

const PaymentModal = ({ course, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Create payment order
      const orderResponse = await api.post('/payment/create-order', {
        courseId: course._id
      });

      const { orderId, amount, currency, key } = orderResponse.data;
      const fallbackKey = process.env.REACT_APP_RAZORPAY_KEY_ID;

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        toast.error('Payment gateway not loaded. Please refresh the page.');
        setLoading(false);
        return;
      }

      // Validate Razorpay key (use backend-provided key or client env fallback)
      const effectiveKey = key || fallbackKey;
      if (!effectiveKey) {
        toast.error('Payment gateway not configured. Please contact support.');
        setLoading(false);
        return;
      }

      // Razorpay options
      const options = {
        key: effectiveKey,
        amount: amount,
        currency: currency,
        name: 'MentoraX',
        description: `Enrollment for ${course.title}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course._id
            });

            toast.success('Payment successful! You are now enrolled.');
            onSuccess(course._id);
            onClose();
          } catch (error) {
            console.error('Payment verification failed:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Payment verification failed';
            toast.error(errorMessage);
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast('Payment cancelled', { icon: '❌' });
          }
        },
        error: function(error) {
          console.error('Razorpay error:', error);
          toast.error(`Payment failed: ${error.description || 'Unknown error'}`);
          setLoading(false);
        }
      };

      // Handle mock orders differently
      if (orderId.startsWith('order_mock_')) {
        console.log('Mock order detected - simulating payment');
        toast.success('Processing mock payment...');
        
        setTimeout(async () => {
          try {
            await api.post('/payment/verify-payment', {
              razorpay_order_id: orderId,
              razorpay_payment_id: `pay_mock_${Date.now()}`,
              razorpay_signature: 'mock_signature',
              courseId: course._id
            });
            toast.success('Payment successful! You are now enrolled.');
            onSuccess(course._id);
            onClose();
          } catch (error) {
            console.error('Mock payment verification failed:', error);
            toast.error('Payment verification failed');
          }
          setLoading(false);
        }, 2000);
        return;
      }

      // Open Razorpay checkout for real orders
      const rzp = new window.Razorpay(options);
      
      // Add error handling for Razorpay popup
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response);
        toast.error(`Payment failed: ${response.error?.description || 'Payment processing failed'}`);
        setLoading(false);
      });

      rzp.open();
      
    } catch (error) {
      console.error('Payment initiation failed:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid course or payment details');
      } else if (error.response?.status === 401) {
        toast.error('Please login to continue with payment');
      } else {
        toast.error(`Failed to initiate payment: ${error.response?.data?.message || error.message}`);
      }
      
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Enroll in Course</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold">{course.title}</h3>
          <p className="text-gray-600 mb-4">{course.description}</p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold text-green-600">₹{course.price}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded hover:bg-gray-400 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
        
        {/* Payment help text */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          {loading ? (
            <p>Please wait while we process your payment...</p>
          ) : (
            <p>Secure payment powered by Razorpay</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;