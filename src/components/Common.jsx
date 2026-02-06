import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const LoadingSpinner = () => (
  <div className="loading">
    <div className="spinner"></div>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="error-message">
    <p>{message}</p>
    {onRetry && <button onClick={onRetry}>Retry</button>}
  </div>
);

const SuccessMessage = ({ message }) => (
  <div className="success-message">
    <p>{message}</p>
  </div>
);

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const studentId = localStorage.getItem('studentId');
      const employerId = localStorage.getItem('employerId');
      
      let authenticated = false;
      
      if (studentId) {
        authenticated = true;
      } else if (employerId) {
        authenticated = true;
      }
      
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export { LoadingSpinner, ErrorMessage, SuccessMessage, ProtectedRoute };
