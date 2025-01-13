import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || !Array.isArray(user.roles) || !user.roles.includes('Admin')) {
    return <Navigate to="/" state={{ message: 'Nie masz uprawnień administratora' }} />;
  }

  return children;
};

export default ProtectedRoute;