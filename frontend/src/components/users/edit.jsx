import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/api';

const Edit = ({ userId, onClose, onUpdate }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: 'reader',
  });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('_auth_token');

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        setLoading(true);
        setError('');
        try {
          const res = await axiosInstance.get(`/users/${userId}`);
          setUser(res.data);
        } catch (error) {
          setError('Failed to fetch user data.');
          console.error('Error fetching user:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (userId) {
        // Update existing user
        await axiosInstance.put(`/users/${userId}`, user);
      } else {
        // Create new user
        await axiosInstance.post(`/users`, { ...user, password });
      }
      onUpdate();
      onClose();
    } catch (error) {
      setError(
        error.response.data.message || 'Failed to save user. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="bg-white p-4 rounded-lg w-full min-w-[340px]"
      onSubmit={handleSubmit}
    >
      {loading && (
        <div className="text-blue-500 text-center mb-4">
          {userId ? 'Loading user data...' : 'Saving...'}
        </div>
      )}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Name
        </label>
        <input
          type="text"
          placeholder="John Doe"
          name="name"
          value={user.name}
          onChange={handleChange}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="email@example.com"
          value={user.email}
          onChange={handleChange}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      {!userId && (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            placeholder="Enter password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Role
        </label>
        <select
          name="role"
          value={user.role}
          onChange={handleChange}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="reader">Reader</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex items-end justify-end">
        <button
          type="submit"
          className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default Edit;
