import React from 'react';
import './home.css';
import { useNavigate } from 'react-router-dom';

const UserCard = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            {/* <h1>ברוכים הבאים!</h1> */}
            <button className='button' onClick={() => { navigate('/login') }}>כניסה</button>

        </div>
    );
};


export default UserCard;
