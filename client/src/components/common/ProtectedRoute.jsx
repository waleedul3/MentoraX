import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { loadUser } from '../../slices/authSlice';
import Spinner from './Spinner';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const token = localStorage.getItem('mentorax_token');

  useEffect(() => {
    // If we have a token but no user data, try to load user
    if (token && !user && !loading) {
      dispatch(loadUser());
    }
  }, [dispatch, token, user, loading]);

  // Show loading spinner while checking authentication
  if (loading || (token && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;