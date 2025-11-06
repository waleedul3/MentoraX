import React, { useState, useEffect } from 'react';

const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Checking connection...');

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch('http://localhost:4000/health');
      if (response.ok) {
        setStatus('connected');
        setMessage('Server Connected');
      } else {
        setStatus('error');
        setMessage('Server Error');
      }
    } catch (error) {
      setStatus('disconnected');
      setMessage('Server Disconnected');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'error': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getStatusColor()}`}>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-white' : 'bg-gray-300'} ${status === 'checking' ? 'animate-pulse' : ''}`}></div>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;