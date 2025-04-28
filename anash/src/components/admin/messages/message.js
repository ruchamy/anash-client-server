import React, { useState } from "react";
import UserCard from "../../contacts/userCard";
import { RiDeleteBin6Line } from "react-icons/ri";
import './message.css';
import RegistrationForm from "../../users/registrationForm";
import { FaRegCopy } from "react-icons/fa";
const Message = ({ message, deleteMessage }) => {
    const [user, setUser] = useState(null);
    const [showUser, setShowUser] = useState(false);
    const [showEditingUser, setShowEditingUser] = useState(false);
    const [status, setStatus] = useState(message.status);

    const fetchUser = async (userId) => {
        setShowUser(!showUser);
        if (user) return;
        try {
            const response = await fetch(`https://anash-server.onrender.com/contacts/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch user');
            const data = await response.json();
            console.log(data);
            setUser(data);
        } catch (error) {
            console.error(error.message);
        }
    };
    const markAsRead = async () => {
        const newStatus = status === 'unread' ? 'read' : 'unread';
        try {
            const response = await fetch(`https://anash-server.onrender.com/messages/${message.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) throw new Error('Failed to mark status of message');

            setStatus(newStatus); // עדכון הסטטוס בתוך state
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className={`message ` + status}>
            <div>
                {message.content.subject === 'editProfile' && <>
                    <h3>בקשה לעריכת פרופיל</h3>
                    <div>
                        <p className="field">
                            {message.content.profileField === 'firstName' ? 'שם פרטי' : message.content.profileField === 'lastName' ? 'שם משפחה' : message.content.profileField === 'email' ? 'מייל' : message.content.profileField === 'phone' ? 'טלפון' : message.content.profileField === 'anotherPhone' ? 'טלפון נוסף' : message.content.profileField === 'adress' ? 'כתובת' : message.content.profileField === 'profilePicture' ? 'תמונה' : message.content.profileField} : </p>
                        <p className="value">
                            {message.content.profileField === 'profilePicture' ?
                                <img className="value-img" src={`https://anash-server.onrender.com/${message.content.value}` || '/logo512.png'} alt="תמונת פרופיל"/>
                                : message.content.profileField === 'adress' ?
                                    message.content.value.street + ' ' + message.content.value.hous + ' ' + message.content.value.city
                                    : message.content.value}
                            <button className="copy-button" title="העתק" onClick={() => navigator.clipboard.writeText(message.content.profileField === 'adress' ? message.content.value.street + ' ' + message.content.value.hous + ' ' + message.content.value.city : message.content.value)}> <FaRegCopy /> </button>
                        </p></div>
                </>}
                <p className="message-content">{message.content.message}</p>
                <label className="message-button">
                    <input type="checkbox" checked={status === 'read'} onChange={markAsRead} />
                    {status === 'unread' ? 'קראתי' : 'העבר למצב לא נקרא'}
                </label>
                <button className="message-button" onClick={() => fetchUser(message.userId)}>{showUser ? 'הסתר' : 'הצג'} פרטי המשתמש</button>
                {showUser && user && <button className="message-button" onClick={() => setShowEditingUser(true)}>עריכה</button>}
                <button className="message-button" onClick={() => deleteMessage(message.id)}><RiDeleteBin6Line /></button>
            </div>
            {showUser ? user ? <UserCard user={user} />:<p>המשתמש נמחק</p>:<></>}
            {showEditingUser && <RegistrationForm user={user} Cancel={() => { setShowEditingUser(false); fetchUser(); }} />}
        </div>
    );
};
export default Message;