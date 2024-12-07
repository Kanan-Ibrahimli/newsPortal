import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiSettings, FiExternalLink, FiEdit } from 'react-icons/fi';
import { BiNews } from 'react-icons/bi'; // For articles icon
import logo from '../../assets/images/logo.jpg';

const Sidebar = () => {
  const menuItems = [
    {
      icon: <BiNews />, // Article management icon
      label: 'Articles',
      path: '/',
    },
    {
      icon: <FiEdit />, // New article creation icon
      label: 'New Article',
      path: '/article/new',
    },
    { icon: <FiSettings />, label: 'Settings', path: '/profile' },
    {
      icon: <FiExternalLink />,
      label: 'Log Out',
      path: '/',
    },
  ];

  return (
    <aside className="fixed top-0 left-0 bg-gray-200 h-full w-64 space-y-2 shadow-md z-50">
      <NavLink className="bg-white flex items-center pl-10 py-3 cursor-pointer">
        <img className="w-10" src={logo} alt="Logo" />
      </NavLink>
      {menuItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center space-x-4 p-6 py-3 rounded-lg cursor-pointer ${
              isActive
                ? 'bg-primary text-white'
                : 'bg-white hover:bg-primary hover:text-white'
            }`
          }
        >
          <div className="flex gap-4 items-center">
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
