import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/api';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    oldPassword: '',
    newPassword: '',
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    // Fetch user details
    axiosInstance.get('users/me').then((response) => {
      setUser(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        oldPassword: '',
        newPassword: '',
      });
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await axiosInstance.put(`users/me`, formData);
      setUser(updatedUser.data);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error updating profile');
    }
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      {user && !editing ? (
        <div className="">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
          <p className="text-gray-600 mb-2">
            <strong className="text-gray-800">Name:</strong> {user.name}
          </p>
          <p className="text-gray-600">
            <strong className="text-gray-800">Email:</strong> {user.email}
          </p>
          <button
            className="bg-primary text-white py-2 px-4 rounded mt-6 hover:bg-primary transition duration-300"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-xl font-bold text-gray-800">Edit Profile</h1>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              disabled
              value={formData.email}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full rounded bg-gray-100 text-gray-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Old Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                placeholder="••••••••"
                name="oldPassword"
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.97 0-9-3.582-9-8s4.03-8 9-8c1.124 0 2.217.198 3.233.563M15 12c0 1.5-1.5 3-3 3s-3-1.5-3-3 1.5-3 3-3 3 1.5 3 3z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18m-5.124-5.124C14.355 16.147 13.2 16.8 12 16.8c-2.47 0-4.8-1.56-6.233-4.374m9.515 1.424L21 21M12 7.2c1.2 0 2.355.653 3.513 1.8"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="••••••••"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.97 0-9-3.582-9-8s4.03-8 9-8c1.124 0 2.217.198 3.233.563M15 12c0 1.5-1.5 3-3 3s-3-1.5-3-3 1.5-3 3-3 3 1.5 3 3z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18m-5.124-5.124C14.355 16.147 13.2 16.8 12 16.8c-2.47 0-4.8-1.56-6.233-4.374m9.515 1.424L21 21M12 7.2c1.2 0 2.355.653 3.513 1.8"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className=" bg-primary text-white py-2 px-4 rounded hover:bg-primary transition duration-300"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition duration-300"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
export default ProfilePage;
