import React from 'react';
import PropTypes from 'prop-types';
import './userCard.css';
import { FaUser } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { AiTwotoneMail, AiTwotonePhone } from 'react-icons/ai';


const UserCard = ({
  user: {
    id,
    firstName,
    lastName,
    fathersName,
    adress,
    email,
    phone,
    anotherPhone,
    profileImage,
  },
}) => {
  const handleAddressClick = () => {
    const addressString = `${adress.street} ${adress.hous}, ${adress.city}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressString)}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="user-card">
      <div className="user-card-header">
        <img
          src={`https://anash-server.onrender.com${profileImage}` || '/logo512.png'}
          alt={`${firstName} ${lastName}`}
          className="user-card-image"
        />
      </div>
      <div className="user-card-body">
        <h3><strong><FaUser /></strong>{`${firstName} ב"ר ${fathersName} ${lastName}`}</h3>
        <a onClick={handleAddressClick} style={{ cursor: 'pointer', color: 'blue' }}>
          <strong><FaHouse /></strong> {adress.street} {adress.hous} {adress.city}
        </a>
        <p><strong>< AiTwotonePhone /></strong> <a href={`tel:${phone}`} title="טלפון">{phone}</a></p>
        <p><a href={`tel:${phone}`} title="טלפון">{anotherPhone}</a></p>
        <a href={`mailto:${email}`} target="_blank" title="אימייל"><strong> < AiTwotoneMail /></strong> {email}</a>
      </div>
    </div>
  );
};

UserCard.propTypes = {
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

export default UserCard;
