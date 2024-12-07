import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  logout,
} from '../redux/actions';
import { useEffect, useState } from 'react';
import axiosInstance from '../api/api';

const TOKEN_KEY = '_auth_token';

const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.store.isAuthenticated);
  const user = useSelector((state) => state.store.user);
  // const error = useSelector((state) => state.store.error);
  const [error, setError] = useState();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const loading = useSelector((state) => state.store.loading);
  const [successMessage, setSuccessMessage] = useState('');
  const [resetError, setResetError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const redirect = searchParams.get('redirect');
    if (token) {
      dispatch(loginSuccess(token, {}));
      axiosInstance
        .get('/users/me')
        .then((res) => {
          dispatch(loginSuccess(token, res.data));
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === '401') {
            window.location.reload();
          }
          localStorage.removeItem(TOKEN_KEY);
        });
    }
  }, [dispatch]);

  const login = async (email, password, redirectPath) => {
    setSuccessMessage('');
    setError('');
    dispatch(loginRequest());
    try {
      const response = await axiosInstance.post('/users/login', {
        email,
        password,
      });
      const data = response.data;
      if (response.status === 200) {
        dispatch(loginSuccess(data.token, data.data.user));
        localStorage.setItem(TOKEN_KEY, data.token);

        if (data.data.user.role === 'admin') {
          console.log(redirectPath);
          window.location.href = redirectPath || '/dashboard';
          return;
        }
        window.location.href = redirectPath || '/';
      } else {
        dispatch(loginFailure('an authorized'));
        setError('Unauthorized, meet super admin to access this page');
      }
    } catch (error) {
      dispatch(
        loginFailure(
          error.response.data.message || 'An error occurred during login'
        )
      );
      setError(error.response.data.message || 'Invalid credentials');
    }
  };

  const register = async (
    email,
    password,
    name,
    redirectPath,
    additionalData
  ) => {
    setSuccessMessage('');
    setError('');
    try {
      dispatch(loginRequest());
      const response = await axiosInstance.post('/users/register', {
        email,
        name,
        password,
        ...additionalData, // Spread the additional data for specific user types
      });

      const data = response.data;
      if (response.status === 201) {
        setSuccessMessage(
          'Registration successful! Please check your email to verify your account.'
        );
        dispatch(loginSuccess(data.token, data.data.user));
        window.location.href = redirectPath || '/';
        localStorage.setItem(TOKEN_KEY, data.token);
      } else {
        dispatch(loginFailure(data.error.message || 'Registration failed'));
        setError(data.error.message || 'Registration failed');
      }
    } catch (error) {
      console.log(error.response.data.message);
      dispatch(
        loginFailure(
          error.response.data.message || 'An error occurred during registration'
        )
      );
      setError(
        error.response.data.message || 'An error occurred during registration'
      );
    }
  };

  const forgotPassword = async (email) => {
    setSuccessMessage('');
    setResetError('');
    try {
      const response = await axiosInstance.post('/auth/forgot-password', {
        email,
      });

      if (response.status === 201) {
        setSuccessMessage('Password reset link sent! Please check your email.');
        setResetError('');
      } else {
        setResetError('Failed to send password reset link.');
        setSuccessMessage('');
      }
    } catch (error) {
      setSuccessMessage('');
      setResetError(
        error.response?.data?.message ||
          'An error occurred during password reset.'
      );
    }
  };

  const resetPassword = async (token, newPassword) => {
    setSuccessMessage('');
    setResetError('');
    try {
      const response = await axiosInstance.post(
        `/auth/reset-password/${token}`,
        {
          password: newPassword,
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Password reset successful! You can now log in.');
        setResetError('');
        console.log(response);
        dispatch(loginSuccess(response.data.token, response.data.data.user));
        localStorage.setItem(TOKEN_KEY, response.data.token);
        window.location.href = '/';
      } else {
        setSuccessMessage('');
        setResetError('Failed to reset password.');
      }
    } catch (error) {
      setSuccessMessage('');
      setResetError(
        error.response?.data?.message ||
          'An error occurred while resetting the password.'
      );
    }
  };

  const logoutUser = async () => {
    dispatch(logout());
    await axiosInstance.get('/users/logout');
    localStorage.removeItem(TOKEN_KEY);
  };

  const isLoggedIn = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  };

  return {
    isAuthenticated,
    user,
    error,
    successMessage,
    resetError,
    loading,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout: logoutUser,
    isLoggedIn,
  };
};

export default useAuth;
