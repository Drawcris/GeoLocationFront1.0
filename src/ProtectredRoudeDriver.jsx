import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRouteDriver = ({ children }) => {
  const { user } = useAuth();

  if (!user || !Array.isArray(user.roles) || !user.roles.includes('Kierowca')) {
    return <Navigate to="/" state={{ message: 'Nie masz uprawnień Kierowcy' }} />;
  }

  return children;
};

export default ProtectedRouteDriver;