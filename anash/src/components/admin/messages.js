import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Mesaage from './message';
import './messages.css';

const Messages = () => {
    const navigate = useNavigate();
    const loggedInUser = useSelector((state) => state.users.loggedInUser);
    const isAdmin = useSelector((state) => state.users.isAdmin);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (loggedInUser == null || !isAdmin) {
            navigate('/');
        } else {
            fetchMessages();
        }
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:3000/messages');
            if (!response.ok) throw new Error('Failed to fetch messages');
            const data = await response.json();
            console.log(data);
            setMessages(data);
        } catch (error) {
            console.error(error.message);
        }
    };


    const deleteMessage = async (messageId) => {
        try {
            const response = await fetch(`http://localhost:3000/messages/${messageId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete message');
            fetchMessages();
        } catch (error) {
            console.error(error.message);
        }
    };


    return (
        <div className="messages-container">
            {messages.map((message) =>
                <Mesaage
                    key={message.id}
                    message={message}
                    deleteMessage={deleteMessage} />
            )}
        </div>
    );
};

export default Messages;

