import React, { useState } from 'react';
import './loginForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login,isAdmin } from './usersSlice';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const approvedUsersId = useSelector((state) => state.users.approvedUsersID);
  const managerPassword = useSelector(state => state.users.managerPassword);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!formData.email || !formData.password) {
      setError('נא למלא את כל השדות');
      return;
    }

    setError('');
    console.log('Login submitted:', formData);

    const response = await fetch('https://anash-server.onrender.com/contacts', { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to get the users');
    }
    const users = await response.json();
    const approvedUsers = users.filter(user => approvedUsersId.includes(user.id));
    const user = approvedUsers.find(user => user.email === formData.email && user.password === formData.password);
    if (user) {
      dispatch(login(user));
      //check if the user is a manager
      const password = formData.password;
      const response = await fetch(`https://anash-server.onrender.com/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          dispatch(isAdmin(true));
          navigate('/admin');
        }
      } else
        navigate('/');

    } else {
      setError('משתמש לא קיים או שאחד הנתונים שגוי');
    }
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>התחברות</h2>

        <input
          type="email"
          name="email"
          placeholder="אימייל"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="סיסמה"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit">התחבר</button>
        <Link to="/registration">משתמש חדש</Link>
      </form>
    </div>
  );
};

export default LoginForm;
