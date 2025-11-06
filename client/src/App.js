import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ConnectionStatus from './components/ConnectionStatus';


// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Quiz from './pages/Quiz';
import Certificate from './pages/Certificate';
import Mentors from './pages/Mentors';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminPayments from './pages/AdminPayments';
import AdminContacts from './pages/AdminContacts';
import AdminCareers from './pages/AdminCareers';
import About from './pages/About';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Legal from './pages/Legal';
import MentorDashboard from './pages/MentorDashboard';
import MentorCourses from './pages/MentorCourses';
import MentorStudents from './pages/MentorStudents';
import MentorSessions from './pages/MentorSessions';
import MentorMessages from './pages/MentorMessages';
import MentorEarnings from './pages/MentorEarnings';
import MentorPaymentDetails from './pages/MentorPaymentDetails';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';

// Redux
import { loadUser } from './slices/authSlice';

// Styles
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <ConnectionStatus />

        <Navbar />
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen"
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/verify/:certificateId" element={<Certificate />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/legal" element={<Legal />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/student" element={
              <ProtectedRoute requiredRole="student">
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/quiz/:courseId" element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            } />
            
            <Route path="/certificate/:id" element={
              <ProtectedRoute>
                <Certificate />
              </ProtectedRoute>
            } />
            
            <Route path="/mentors" element={
              <ProtectedRoute>
                <Mentors />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/payments" element={
              <ProtectedRoute requiredRole="admin">
                <AdminPayments />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/contacts" element={
              <ProtectedRoute requiredRole="admin">
                <AdminContacts />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/careers" element={
              <ProtectedRoute requiredRole="admin">
                <AdminCareers />
              </ProtectedRoute>
            } />

            {/* Mentor Routes */}
            <Route path="/mentor" element={
              <ProtectedRoute requiredRole="mentor">
                <MentorDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/mentor/courses" element={
              <ProtectedRoute requiredRole="mentor">
                <ErrorBoundary>
                  <MentorCourses />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            
            <Route path="/mentor/courses/:courseId/students" element={
              <ProtectedRoute requiredRole="mentor">
                <MentorStudents />
              </ProtectedRoute>
            } />
            
            <Route path="/mentor/courses/create" element={
              <ProtectedRoute requiredRole="mentor">
                <CreateCourse />
              </ProtectedRoute>
            } />
            
            <Route path="/mentor/courses/:id/edit" element={
              <ProtectedRoute requiredRole="mentor">
                <EditCourse />
              </ProtectedRoute>
            } />
            
            <Route path="/mentor/sessions" element={
              <ProtectedRoute requiredRole="mentor">
                <MentorSessions />
              </ProtectedRoute>
            } />
            
            <Route path="/mentor/messages" element={
              <ProtectedRoute requiredRole="mentor">
                <MentorMessages />
              </ProtectedRoute>
            } />
            
            <Route path="/mentor/earnings" element={
              <ProtectedRoute requiredRole="mentor">
                <MentorEarnings />
              </ProtectedRoute>
            } />
            
            <Route path="/mentor/payment-details" element={
              <ProtectedRoute requiredRole="mentor">
                <MentorPaymentDetails />
              </ProtectedRoute>
            } />
          </Routes>
        </motion.main>

        <Footer />
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
