import React from 'react';
import './contactsHome.css';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
// import LoginForm from './loginForm';
// import RegistrationForm from './registrationForm';
// import UserList from './userList';
// import Admin from './admin';

const ContactsHome = () => {
    const navigate = useNavigate();

    return (
        <div className="contacts-home-container">
            <nav>
                {/* <Link to="/contacts">בית</Link>
                <Link to="/contacts/login">התחברות</Link>
                <Link to="/contacts/registration">הרשמה</Link>
                <Link to="/contacts/users">צפיה באנשי קשר</Link>
                <Link to="/contacts/admin">ניהול</Link> */}
            </nav>

            {/* <Routes>
                <Route path="" element={<>
                    <button className='button' onClick={() => { navigate('/contacts/login') }}>כניסה</button>
                </>} />
                <Route path="login" element={<LoginForm />} />
                <Route path="registration" element={<RegistrationForm />} />
                <Route path="users" element={<UserList />} />
                <Route path="admin" element={<Admin />} />
            </Routes> */}
        </div>
    );
};

export default ContactsHome;