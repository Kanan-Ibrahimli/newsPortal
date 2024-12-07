import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [redirect, setRedirect] = useState(null);
  const user = useSelector((state) => state.store.user);
  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = isLoggedIn();
      if (!loggedIn) {
        setLoading(false);
      } else {
        setLoading(false);
      }
      if (
        user &&
        user?.role &&
        user.role !== 'admin' &&
        role !== 'all' &&
        user?.role !== role
      ) {
        setRedirect(`/users/${user?.username}`);
      }
    };

    // setTimeout(() => {
    checkAuth();
  }, [user, location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/auth/login?redirect=${location.pathname}`} />;
  }
  if (redirect) {
    return (window.location.href = redirect);
  }

  return children;
};

export default ProtectedRoute;
