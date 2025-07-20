// filepath: /c:/Users/משתמש/Desktop/הפרויקט הגדול/anash/src/components/contactForm.js
import React, { useEffect, useState } from 'react';
import './contactForm.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AlertBox from './alertBox.js';

const ContactForm = () => {
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.users.loggedInUser);
  const [subject, setSubject] = useState('');
  const [profileField, setProfileField] = useState('');
  const [message, setMessage] = useState('');
  const [alert, setAlert] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [values, setValues] = useState(
    {
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
  useEffect(() => {
    if (!loggedInUser) {
      navigate('/');
    }
  }, [loggedInUser, navigate]);

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    setProfileField('');
  };

  const handleProfileFieldChange = (e) => {
    setProfileField(e.target.value);
    setValues({
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
  };
  const handleValuesChange = (e) => {
    if (profileField === 'profilePicture' && e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setValues(prevValues => ({ ...prevValues, profilePicture: file }));
        setImagePreview(URL.createObjectURL(file));
      }
    } else if (profileField === 'adress') {
      const field = e.target.name;
      setValues(prevValues => ({
        ...prevValues,
        adress: {
          ...prevValues.adress,
          [field]: e.target.value,
        },
      }));
    } else {
      setValues(prevValues => ({ ...prevValues, [profileField]: e.target.value }));
    }
  };
  

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = {
      subject,
      message,
    };

    if (subject === 'editProfile') {
      content.profileField = profileField;
      if (profileField === 'profilePicture' && values.profilePicture instanceof File) {
        content.value = ""; // לא שולחים את שם הקובץ כטקסט
      } else {
        content.value = values[profileField]; // שאר הערכים נשארים רגילים
      }
    }

    const dataToSend = new FormData();
    dataToSend.append('userId', loggedInUser.id)
    dataToSend.append('content', JSON.stringify(content));

    if (subject === 'editProfile' && profileField === 'profilePicture' && values.profilePicture instanceof File) {
      dataToSend.append('profileImage', values.profilePicture);
    }

    // for (let pair of dataToSend.entries()) {
    //   console.log(pair[0] + ':', pair[1]);
    // }

    try {
      const response = await fetch('http://localhost:3000/messages', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json', // חובה כששולחים JSON
        // },
        body: dataToSend,
      });
      if (!response.ok) {
        throw new Error('Failed to send the message');
      }
      setAlert(() => ({ message: "ההודעה נשלחה בהצלחה" }));
    } catch (err) {
      // console.log(err);
    }
  };

  return (<>
    <form className="form-container" onSubmit={handleSubmit}>
      <label>
        נושא:
        <select value={subject} onChange={handleSubjectChange}>
          <option value="">בחר נושא</option>
          <option value="editProfile">עריכת פרופיל</option>
          <option value="other">אחר</option>
        </select>
      </label>
      {subject === 'editProfile' && (
        <>
          <label>
            בחר ערך לשינוי:
            <select value={profileField} onChange={handleProfileFieldChange}>
              <option value="">בחר ערך</option>
              <option value="email">אימייל</option>
              <option value="phone">טלפון</option>
              <option value="anotherPhone">טלפון נוסף</option>
              <option value="adress">כתובת</option>
              {/* <option value="password">סיסמה</option> */}
              <option value="profilePicture">תמונת פרופיל</option>
            </select>
          </label>
          {profileField && (
            <label>
              {profileField === 'profilePicture' ? (
                <>
                  <div
                    className="image-upload"
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        setValues({ ...values, profilePicture: file });
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="image-preview" />
                    ) : (
                      <label htmlFor="imageUpload" className="upload-label">
                        גרור ושחרר תמונה כאן או לחץ להעלאה
                      </label>
                    )}
                    <input
                      name='profilePicture'
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleValuesChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </>
              ) : profileField === 'adress' ? (
                <div className='adress'>
                  <input
                    name='street'
                    type="text"
                    value={values.adress.street}
                    onChange={(e) => handleValuesChange(e)}
                    placeholder='רחוב:'
                  />
                  <input
                    name='hous'
                    type="number"
                    value={values.adress.hous}
                    onChange={(e) => handleValuesChange(e)}
                    placeholder='בית:'
                  />
                  <input
                    name='city'
                    type="text"
                    value={values.adress.city}
                    onChange={(e) => handleValuesChange(e)}
                    placeholder='עיר:'
                  />
                </div>
              ) : (
                <>
                  {profileField}:
                  <input
                    type="text"
                    value={values[profileField]}
                    onChange={(e) => handleValuesChange(e)}
                  />
                </>
              )}
            </label>
          )}
        </>
      )}
      <label>
        הודעה:
        <textarea value={message} onChange={handleMessageChange} />
      </label>

      <button type="submit">שלח</button>
    </form>
    {alert && (
      <AlertBox
        message={alert.message}
        onClose={() => { setAlert(null); navigate('/'); }}
      />
    )}
  </>
  );
};

export default ContactForm;