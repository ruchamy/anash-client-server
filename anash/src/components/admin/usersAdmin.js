import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './usersAdmin.css';
import { approveNewUser, deleteUser } from '../users/usersSlice';
import UserCard from '../contacts/userCard';
import RegistrationForm from '../users/registrationForm';
import { useNavigate } from 'react-router-dom';
import Messages from './messages';
import AlertBox from '../alertBox';

const UsersAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.users.loggedInUser);
  const isAdmin = useSelector((state) => state.users.isAdmin);

  const approvedUsersId = useSelector((state) => state.users.approvedUsersID);
  const [users, setUsers] = useState([])
  const [newUsers, setNewUsers] = useState([]);


  const [editingUser, setEditingUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);


  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [approvedUsersId]);

  useEffect(() => {
    setNewUsers(users.filter((user) => !approvedUsersId.includes(user.id)))
  }, [users]);

  useEffect(() => {
    if (loggedInUser == null || !isAdmin) {
      navigate('/');
    }
  }, [loggedInUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://anash-server.onrender.com/contacts');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      await setUsers(data);
      setNewUsers(users.filter((user) => !approvedUsersId.includes(user.id)))
    } catch (error) {
      console.error(error.message);
    }
  }

  const handleApprove = async (id) => {
    await fetch("https://anash-server.onrender.com/approved-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    dispatch(approveNewUser(id));
  };

  const handleDelete = async (userId) => {
    setUserIdToDelete(userId);
    setShowAlert(true);
  };

  const confirmDelete = async (confirm) => {
    if (confirm) {
      try {
        // שליחת הנתונים לשרת
        const response = await fetch(`https://anash-server.onrender.com/contacts/${userIdToDelete}`, {
          method: 'delete',
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        const data = await response.json();
        console.log('Success:', data);
        fetchUsers();
      } catch (error) {
        console.error('Error:', error);
      }
    }
    setShowAlert(false);
    setUserIdToDelete(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  return (
    <div className="admin-page">
      <div className='admin-page-list' >
        <h2>משתמשים חדשים</h2>
        {users.length === 0 ? <p>טוען משתמשים...</p>
          : newUsers.length === 0 ? <p>אין משתמשים חדשים</p>
            : newUsers
              .sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName))
              .map((user) => (
                <div key={user.id} className="admin-page-user-card">
                  <UserCard key={user.id} user={user} />
                  <div className="button-container">
                    <button onClick={() => handleApprove(user.id)}>אישור</button>
                    <button onClick={() => handleEdit(user)}>עריכה</button>
                    <button onClick={() => handleDelete(user.id)}>מחיקה</button>
                  </div>
                </div>
              ))}
        <h2>משתמשים קיימים</h2>
        {users.length === 0 ? <p>טוען משתמשים...</p>
          : approvedUsersId.length === 0 ? <p>אין משתמשים רשומים שאושרו</p>
            : users.filter((user) => approvedUsersId.includes(user.id))
              .sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName))
              .map((user) => (
                <div key={user.id} className="admin-page-user-card">
                  <UserCard key={user.id} user={user} />
                  <div className="button-container">
                    <button onClick={() => handleEdit(user)}>עריכה</button>
                    <button onClick={() => handleDelete(user.id)}>מחיקה</button>
                  </div>
                </div>
              ))}
      </div>
      {editingUser &&
        <RegistrationForm user={editingUser} Cancel={() => { setEditingUser(null); fetchUsers(); }} />
      }
      {showAlert &&
        <AlertBox message="האם אתה בטוח שברצונך למחוק את המשתמש הזה?" showCancel={true} onClose={confirmDelete} />
      }
    </div>
  );
};

export default UsersAdmin;