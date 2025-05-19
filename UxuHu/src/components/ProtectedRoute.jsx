// ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const  user  = useAuth();
  const location = useLocation();

  // If the user is not logged in, redirect to the login page.
  // The 'state' prop is used to store the location the user was trying to access.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, render the children components.
  return children;
};

export default ProtectedRoute;
