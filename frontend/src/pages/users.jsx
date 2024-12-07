import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Table from '../ui/table';
import Edit from '../components/users/edit';
import Modal from '../ui/modal';
import { API_URL } from '../constants/url';
import axiosInstance from '../api/api';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';

const TOKEN_KEY = '_auth_token';
const columns = ['NAME', 'EMAIL', 'ROLE', 'ACTION'];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [addUser, setAddUser] = useState(false);

  const token = localStorage.getItem(TOKEN_KEY);

  useEffect(() => {
    const fetchUsers = async () => {
      await axiosInstance
        .get(`/users`)
        .then((res) => {
          setUsers(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching users:', error.response.status);
          setError(error.response.data.message);
          if (error.response.status === 401 || error.response.status === 403) {
            window.location.href = '/auth/logout';
          }
          setLoading(false);
        });
    };

    fetchUsers();
  }, [token]);

  const handleDelete = async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      setUsers(users?.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (userId) => {
    setEditUserId(userId);
  };

  const handleUpdate = () => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get(`/users`);
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.response.data.message);
      }
    };

    fetchUsers();
  };

  const mappedUsers = users?.map((user) => ({
    NAME: user.name,
    EMAIL: user.email,
    ROLE: user.role,
    ACTION: (
      <Action userId={user._id} onDelete={handleDelete} onEdit={handleEdit} />
    ),
  }));

  return (
    <div className="w-full max-w-6xl">
      <button
        onClick={() => {
          setAddUser(true);
        }}
        className="bg-primary p-2 rounded hover:bg-primary/90 text-white mb-4"
      >
        Add User
      </button>
      <Table
        error={error}
        loading={loading}
        data={mappedUsers}
        columns={columns}
      />
      {(editUserId !== null || addUser) && (
        <Modal
          isOpen={editUserId !== null || addUser}
          onClose={() => {
            setEditUserId(null);
            setAddUser(false);
          }}
        >
          <Edit
            userId={editUserId}
            onClose={() => {
              setEditUserId(null);
              setAddUser(false);
            }}
            onUpdate={handleUpdate}
          />
        </Modal>
      )}
    </div>
  );
}

const Action = ({ userId, onDelete, onEdit }) => {
  return (
    <div>
      <div className="flex items-center gap-3 justify-center mx-auto ">
        <FaRegTrashAlt
          onClick={() => {
            onDelete(userId);
          }}
          className="cursor-pointer text-red-500 hover:text-red-700"
        />
        <FaEdit
          onClick={() => {
            onEdit(userId);
          }}
          className=" cursor-pointer text-ternary hover:text-primary"
        />
      </div>
    </div>
  );
};
