import React from 'react';
import { NavLink } from 'react-router-dom';
import { TfiBarChart } from 'react-icons/tfi';
import { FiSettings, FiUsers, FiExternalLink, FiEdit } from 'react-icons/fi';
import { BiNews } from 'react-icons/bi'; // For articles icon
import logo from '../../assets/images/logo.jpg';

const Sidebar = () => {
  const menuItems = [
    { icon: <TfiBarChart />, label: 'Dashboard', path: '/' },
    {
      icon: <BiNews />, // Article management icon
      label: 'Articles',
      path: '/articles',
    },
    {
      icon: <FiEdit />, // New article creation icon
      label: 'New Article',
      path: '/article/new',
    },
    { icon: <FiUsers />, label: 'users', path: '/users' },
    { icon: <FiSettings />, label: 'Settings', path: '/profile' },
  ];

  return (
    <aside className=" bg-gray-200  mt-4 h-[100vh]  w-64 mb-0  space-y-2">
      <NavLink className="bg-white  flex items-center pl-10 py-3  cursor-pointer ">
        <img className="w-10" src={logo} />
      </NavLink>
      {menuItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>
            ` flex items-center space-x-4 p-6 py-3  rounded-lg cursor-pointer  ${
              isActive
                ? 'bg-primary'
                : ' bg-white hover:bg-primary hover:bg-opacity-10'
            }`
          }
        >
          <div className={` flex gap-2 items-center`}>
            <span className="text-lg"> {item.icon}</span>
            <span>{item.label}</span>
          </div>
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
