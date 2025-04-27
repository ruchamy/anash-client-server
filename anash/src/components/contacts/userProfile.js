import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './userProfile.css';
import { FaUser } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { AiTwotoneMail, AiTwotonePhone } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../users/usersSlice';


const UserProfile = () => {
    const dispach = useDispatch()
    const [loggedInUser, setLoggedInUser] = useState(useSelector((state) => state.users.loggedInUser));
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        anotherPhone: '',
        adress: {
            street: '',
            hous: '',
            city: '',
        },
        profilePicture: null
    });

    const navigate = useNavigate();
    useEffect(() => {
        if (loggedInUser == null)
            navigate('/');
    });

    const showInput = (name) => {
        const inputElement = document.getElementById(name);
        //inputElement.style.display = "flex";
        if (name !== "profileImage")
            setFormData({ ...formData, [name]: loggedInUser[name] })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('adress/')) {
            const field = name.split('/')[1];
            setFormData({
                ...formData,
                adress: {
                    ...formData.adress,
                    [field]: value,
                },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    return (
        <div className="user-profile-container">
            <div className="user-profile-header">
                <img src={`https://anash-server.onrender.com${loggedInUser.profileImage}`} className="user-profile-image" alt='profileImage' />
                <h3><strong><FaUser /></strong>{`${loggedInUser.firstName} ב"ר ${loggedInUser.fathersName} ${loggedInUser.lastName}`}</h3>
            </div>
            <div className="user-profile-body">
                <p><strong><FaHouse /></strong> {loggedInUser.adress.street} {loggedInUser.adress.hous} {loggedInUser.adress.city}</p>
                <p><strong>< AiTwotonePhone /></strong> {loggedInUser.phone}</p>
                <p>{loggedInUser.anotherPhone}</p>
                <a href={`mailto:${loggedInUser.email}`} target="_blank" title="אימייל"><strong> < AiTwotoneMail /></strong> {loggedInUser.email}</a>
            </div>
            <button onClick={() => { if (window.confirm("לצאת?")) { dispach(logout()); } }}>התנתקות</button>
        </div>
    );
}

UserProfile.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        fathersName: PropTypes.string,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        anotherPhone: PropTypes.string,
        profilePicture: PropTypes.string,
    }).isRequired,
};

export default UserProfile;
