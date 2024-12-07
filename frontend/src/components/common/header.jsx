import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiUser } from 'react-icons/fi';
import { IoIosLogOut } from 'react-icons/io';
import useAuth from '../../hooks/useAuth';

const Header = () => {
  const { logout } = useAuth();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user); // User details from Redux
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      {/* Top Header */}
      <header className="bg-white w-full shadow-sm flex items-center justify-between px-6 py-2 z-50">
        <h1
          className="text-xl font-bold text-primary cursor-pointer"
          onClick={() => navigate('/')}
        >
          newSphere
        </h1>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary">
              About
            </Link>
          </nav>
          <div>
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary "
                >
                  <FiUser className="text-lg" />
                  <span className="">{user.name}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <FiUser className="text-lg inline-block text-primary" />
                      My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <IoIosLogOut className="inline-block mr-2 text-primary" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/auth/login"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-80"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-opacity-80"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
