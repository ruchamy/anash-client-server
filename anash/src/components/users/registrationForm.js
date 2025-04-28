import React, { useEffect, useState } from 'react';
import './registrationForm.css';
import { useDispatch } from 'react-redux';
import { register } from './usersSlice';
import { Link, useNavigate } from 'react-router-dom';
import AlertBox from '../alertBox.js';


const RegistrationForm = ({ user, Cancel }) => {
  const navigate = useNavigate(); // הוספת useNavigate כאן ברכיב React
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(null);

  const isEditMode = !!user;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fathersName: '',
    email: '',
    phone: '',
    anotherPhone: '',
    adress: {
      street: '',
      hous: '',
      city: '',
    },
    password: '',
    confirmPassword: '',
    profilePicture: null,
  });

  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        fathersName: user.fathersName || '',
        email: user.email || '',
        phone: user.phone || '',
        anotherPhone: user.anotherPhone || '',
        adress: user.adress || { street: '', hous: '', city: '' },
        password: '',
        confirmPassword: '',
        profilePicture: null, // לא נטען את תמונת הפרופיל אלא אם המנהל יבחר תמונה חדשה
      });

      if (user.profilePicture) {
        setImagePreview(`https://anash-server.onrender.com/${user.profilePicture}`);
      }
    }
  }, [user]);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const { password, confirmPassword, profilePicture, ...otherData } = formData;

    if (!isEditMode && !profilePicture) {
      setError('נא להעלות תמונה');
      return;
    }

    if (!isEditMode && password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    setError('');

    // יצירת אובייקט FormData
    const formDataToSend = new FormData();
    if (profilePicture) {
      formDataToSend.append('profileImage', profilePicture);
    }

    if (!isEditMode) {
      formDataToSend.append('password', password);
    }

    Object.entries(otherData).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          formDataToSend.append(`${key}[${nestedKey}]`, nestedValue);
        });
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      let response;
      if (isEditMode) {
        // עדכון משתמש קיים
        response = await fetch(`https://anash-server.onrender.com/contacts/${user.id}`, {
          method: 'PUT', // עדכון משתמש
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error('Failed to update user');
        }
        const updatedUser = await response.json();

        //האם השינוים מוצגים מייד למשתמש?

        setAlert(() => ({ message: 'פרטי המשתמש עודכנו בהצלחה', onClose: () => { Cancel(); setAlert(null); } }));
      } else {
        // רישום משתמש חדש
        response = await fetch('https://anash-server.onrender.com/contacts', {
          method: 'POST',
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error('Failed to submit the form');
        }

        const data = await response.json();
        console.log('Success:', data);
        dispatch(register(data)); // הוספה ל-Redux
        setAlert(() => ({ message: 'הפרטים נשלחו למערכת, בימים הקרובים תקבל הודעה למייל על אישור וסיום הרישום', onClose: () => { setAlert(null); navigate('/'); } }));

      }
    } catch (error) {
      console.error('Error:', error);
      setError(isEditMode ? 'שגיאה בעדכון המשתמש' : 'שגיאה ברישום המשתמש');
    }
  };

  return (
    <div className={`registration-form-container ${isEditMode ? 'edit-mode' : ''}`}>
      <form className={`registration-form ${isEditMode ? 'edit-mode' : ''}`} onSubmit={handleSubmit}>
        <div className="form-inputs">
          <h2>{isEditMode ? 'עריכת משתמש' : 'טופס רישום'}</h2>
          <div className="form-inputs-row">
            <input
              type="text"
              name="firstName"
              placeholder="שם פרטי"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="lastName"
              placeholder="שם משפחה"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="fathersName"
              placeholder="שם האב"
              value={formData.fathersName}
              onChange={handleChange}
            />
          </div>

          <div className="form-inputs-row">

            <input
              type="email"
              name="email"
              placeholder="אימייל"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-inputs-row">

            <input
              type="tel"
              name="phone"
              placeholder="טלפון"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="anotherPhone"
              placeholder="טלפון נוסף (אופציונלי)"
              value={formData.anotherPhone}
              onChange={handleChange}
            />
          </div>
          <div className="form-inputs-row">

            {/* <label>כתובת</label> */}
            <input
              type="text"
              name="adress/street"
              placeholder="רחוב"
              value={formData.adress.street}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="adress/hous"
              placeholder="מספר בית"
              value={formData.adress.hous}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="adress/city"
              placeholder="עיר"
              value={formData.adress.city}
              onChange={handleChange}
              required
            />
          </div>
          {!isEditMode && <div className="form-inputs-row">
            <input
              type="password"
              name="password"
              placeholder="סיסמה"
              value={formData.password}
              onChange={handleChange}
              required
              maxLength={8}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="אישור סיסמה"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>}


          {error && <p className="error-message">{error}</p>}
          {isEditMode && <div className="form-inputs-row"><button type="submit">שמור</button>
            <button type='button' onClick={Cancel}>בטל</button></div>}
          {!isEditMode && <><button type="submit">הירשם</button>
            <Link to="/login">משתמש רשום</Link></>}
        </div>
        <div
          className="image-upload-container"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          ) : (
            <label htmlFor="imageUpload" className="upload-label">
              גרור ושחרר תמונה כאן או לחץ להעלאה
            </label>
          )}
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>
      </form>
      {alert && (
        <AlertBox
          message={alert.message}
          showCancel={false}
          onClose={alert.onClose}
        />
      )}
    </div>
  );
};

export default RegistrationForm;
