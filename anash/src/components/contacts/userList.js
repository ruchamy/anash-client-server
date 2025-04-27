// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import UserCard from './userCard'; // יש לייבא את UserCard אם הוא בקובץ נפרד
// import './userList.css'; // קובץ עיצוב מותאם אישי
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import UpdateUser from './updateUser';

// const UserList = () => {
//   const navigate = useNavigate();
//   const approvedUsersId = useSelector((state) => state.users.approvedUsersID);
//   const [loggedInUser] = useState(useSelector((state) => state.users.loggedInUser));
//   const [users, setUsers] = useState([]); // השתמש ב-state עבור המשתמשים
//   const [filteredUsers, setFilteredUsers] = useState([]); // השתמש ב-state עבור המשתמשים המפולטרים
//   const [approvedUsers, setApprovedUsers] = useState([]);

//   useEffect(() => {
//     if (loggedInUser == null)
//       navigate('/');
//   }, [loggedInUser, navigate]);
//   useEffect(() => {
//     async function fetchUsers() {
//       const response = await fetch('http://localhost:3000/contacts', { method: 'GET' });
//       if (!response.ok) {
//         console.log(new Error('Failed to submit the form'));
//       }
//       const data = await response.json(); // קבלת הנתונים מה-API
//       setUsers(data); // עדכון ה-state עם הנתונים
//     }
//     fetchUsers();
//   }, [])

//   useEffect(() => {
//     console.log(users);
//     setApprovedUsers(users.filter(user => approvedUsersId.includes(user.id)))
//   }, [users])

//   useEffect(() => {
//     console.log(approvedUsers);
//     setFilteredUsers(approvedUsers); // עדכון filteredUsers עם המשתמשים המאושרים
//   }, [approvedUsers]);


//   const [showUserProfile, setShowUserProfile] = useState(false);
//   const [filters, setFilters] = useState(
//     {
//       firstName: '',
//       lastName: '',
//       fathersName: '',
//       phone: '',
//       email: '',
//       address: ''
//     }
//   );

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prevFilters => ({
//       ...prevFilters,
//       [name]: value
//     }));
//   };


//   const applyFilters =  (event) => {
//     event.preventDefault();
//     //  Array.from(event.target.elements).forEach( element => {
//     //   if (element.name) {
//     //     console.log(element);
//     //      handleFilterChange({ target: element });
//     //   }
//     // });
//     let newArray = approvedUsers;
//     Object.keys(filters).forEach(filter => {
//       if (filters[filter]) {
//         newArray = newArray.filter(user => user[filter]?.startsWith(filters[filter]));
//       }
//     });
//     setFilteredUsers(newArray);
//   };



//   const removeFilter = (filterName) => {
//     setFilters(prevFilters => {
//       const updatedFilters = { ...prevFilters, [filterName]: '' };
//       let newArray = approvedUsers;
//       Object.keys(updatedFilters).forEach(filter => {
//         if (updatedFilters[filter]) {
//           newArray = newArray.filter(user => user[filter]?.startsWith(updatedFilters[filter]));
//         }
//       });
//       setFilteredUsers(newArray);

//       return updatedFilters;
//     });
//   };


//   return (
//     <div className="user-list-page">
//       {loggedInUser != null &&
//         <div className="user-profile">
//           <img src={`http://localhost:3000${loggedInUser.profileImage}`} className="user-profile-image" onClick={() => { setShowUserProfile(!showUserProfile) }} alt='profileImage' />
//           {showUserProfile && <UpdateUser />}
//         </div>}
//       <div className="user-list-container">
//         <div className="filter-container">
//           <div className='filter-tags'>
//             {Object.keys(filters).map(filterName => (
//               filters[filterName] && (
//                 <div key={filterName} className="filter-tag">
//                   {/* {filterName}: */} {filters[filterName]}
//                   <button onClick={() => removeFilter(filterName)}>X</button>
//                 </div>
//               )
//             ))}
//           </div>
//           <form className='filter-form' onSubmit={e => applyFilters(e)}>
//             <input
//               type="text"
//               name="firstName"
//               placeholder="סינון לפי שם פרטי"
//             // value={filters.firstName}
//             // onChange={handleFilterChange} 
//             />
//             <input
//               type="text"
//               name="lastName"
//               placeholder="סינון לפי שם משפחה"
//             // value={filters.lastName}
//             // onChange={handleFilterChange}
//             />
//             <input
//               type="text"
//               name="fathersName"
//               placeholder="סינון לפי שם האב"
//             // value={filters.fathersName}
//             // onChange={handleFilterChange} 
//             />
//             <input
//               type="text"
//               name="phone"
//               placeholder="סינון לפי טלפון"
//             // value={filters.phone}
//             // onChange={handleFilterChange} 
//             />
//             <input
//               type="text"
//               name="email"
//               placeholder="סינון לפי מייל"
//             // value={filters.email}
//             // onChange={handleFilterChange}
//             />
//             <input
//               type="text"
//               name="address"
//               placeholder="סינון לפי כתובת"
//             // value={filters.address}
//             // onChange={handleFilterChange} 
//             />
//             <button type='submit'>סנן</button>
//           </form>
//         </div>
//         <div className="user-list">
//           {users.length === 0 && <h2>אין משתמשים רשומים</h2>}
//           {filteredUsers.map(user => (
//             <UserCard key={user.id} user={user} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// UserList.propTypes = {
//   users: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number.isRequired,
//       firstName: PropTypes.string.isRequired,
//       lastName: PropTypes.string.isRequired,
//       fathersName: PropTypes.string,
//       email: PropTypes.string.isRequired,
//       phone: PropTypes.string.isRequired,
//       anotherPhone: PropTypes.string,
//       profilePicture: PropTypes.string,
//     })
//   ).isRequired,
// };

// export default UserList;



















// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import UserCard from './userCard';
// import './userList.css';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import UpdateUser from './updateUser';

// const UserList = () => {
//   const navigate = useNavigate();
//   const approvedUsersId = useSelector((state) => state.users.approvedUsersID);
//   const loggedInUser = useSelector((state) => state.users.loggedInUser);
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [approvedUsers, setApprovedUsers] = useState([]);

//   useEffect(() => {
//     if (!loggedInUser) {
//       navigate('/');
//     }
//   }, [loggedInUser, navigate]);

//   useEffect(() => {
//     async function fetchUsers() {
//       try {
//         const response = await fetch('http://localhost:3000/contacts');
//         if (!response.ok) throw new Error('Failed to fetch users');
//         const data = await response.json();
//         setUsers(data);
//       } catch (error) {
//         console.error(error.message);
//       }
//     }
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     setApprovedUsers(users.filter(user => approvedUsersId.includes(user.id)));
//   }, [users, approvedUsersId]);

//   useEffect(() => {
//     setFilteredUsers(approvedUsers);
//   }, [approvedUsers]);

//   const [showUserProfile, setShowUserProfile] = useState(false);

//   // שדה שמאחסן ערכים זמניים לפני הלחיצה על סנן
//   const [tempFilters, setTempFilters] = useState({
//     firstName: '',
//     lastName: '',
//     fathersName: '',
//     phone: '',
//     email: '',
//     address: ''
//   });

//   // שדה שמכיל את הפילטרים המאושרים (יתעדכן רק בעת לחיצה על "סנן")
//   const [filters, setFilters] = useState({});

//   // עדכון הערכים הזמניים בזמן הקלדה
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setTempFilters(prevFilters => ({
//       ...prevFilters,
//       [name]: value
//     }));
//   };

//   // עדכון הסינון רק כאשר לוחצים על הכפתור
//   const applyFilters = (event) => {
//     event.preventDefault();
//     setFilters(tempFilters); // מעדכן את הפילטרים בפועל
//     let newArray = approvedUsers;

//     Object.keys(tempFilters).forEach(filter => {
//       if (tempFilters[filter]) {
//         newArray = newArray.filter(user => user[filter]?.startsWith(tempFilters[filter]));
//       }
//     });

//     setFilteredUsers(newArray);
//   };

//   // מחיקת פילטר ועדכון התוצאות
//   const removeFilter = (filterName) => {
//     setFilters(prevFilters => {
//       const updatedFilters = { ...prevFilters, [filterName]: '' };
//       let newArray = approvedUsers;

//       Object.keys(updatedFilters).forEach(filter => {
//         if (updatedFilters[filter]) {
//           newArray = newArray.filter(user => user[filter]?.startsWith(updatedFilters[filter]));
//         }
//       });

//       setFilteredUsers(newArray);
//       return updatedFilters;
//     });

//     // עדכון הטופס הזמני
//     setTempFilters(prevTempFilters => ({
//       ...prevTempFilters,
//       [filterName]: ''
//     }));
//   };

//   return (
//     <div className="user-list-page">
//       {loggedInUser && (
//         <div className="user-profile">
//           <img
//             src={`http://localhost:3000${loggedInUser.profileImage}`}
//             className="user-profile-image"
//             onClick={() => setShowUserProfile(!showUserProfile)}
//             alt="profileImage"
//           />
//           {showUserProfile && <UpdateUser />}
//         </div>
//       )}

//       <div className="user-list-container">
//         <div className="filter-container">
//           <div className="filter-tags">
//             {Object.keys(filters).map(filterName =>
//               filters[filterName] && (
//                 <div key={filterName} className="filter-tag">
//                   {filters[filterName]}
//                   <button onClick={() => removeFilter(filterName)}>X</button>
//                 </div>
//               )
//             )}
//           </div>

//           <form className="filter-form" onSubmit={applyFilters}>
//             <input
//               type="text"
//               name="firstName"
//               placeholder="סינון לפי שם פרטי"
//               value={tempFilters.firstName}
//               onChange={handleFilterChange}
//             />
//             <input
//               type="text"
//               name="lastName"
//               placeholder="סינון לפי שם משפחה"
//               value={tempFilters.lastName}
//               onChange={handleFilterChange}
//             />
//             <input
//               type="text"
//               name="fathersName"
//               placeholder="סינון לפי שם האב"
//               value={tempFilters.fathersName}
//               onChange={handleFilterChange}
//             />
//             <input
//               type="text"
//               name="phone"
//               placeholder="סינון לפי טלפון"
//               value={tempFilters.phone}
//               onChange={handleFilterChange}
//             />
//             <input
//               type="text"
//               name="email"
//               placeholder="סינון לפי מייל"
//               value={tempFilters.email}
//               onChange={handleFilterChange}
//             />
//             <input
//               type="text"
//               name="address"
//               placeholder="סינון לפי כתובת"
//               value={tempFilters.address}
//               onChange={handleFilterChange}
//             />
//             <button type="submit">סנן</button>
//           </form>
//         </div>

//         <div className="user-list">
//           {users.length === 0 && <h2>אין משתמשים רשומים</h2>}
//           {filteredUsers.map(user => (
//             <UserCard key={user.id} user={user} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// UserList.propTypes = {
//   users: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number.isRequired,
//       firstName: PropTypes.string.isRequired,
//       lastName: PropTypes.string.isRequired,
//       fathersName: PropTypes.string,
//       email: PropTypes.string.isRequired,
//       phone: PropTypes.string.isRequired,
//       anotherPhone: PropTypes.string,
//       profilePicture: PropTypes.string,
//     })
//   ).isRequired,
// };

// export default UserList;








import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import UserCard from './userCard';
import './userList.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserProfile from './userProfile';
import { BsArrowUpCircle } from 'react-icons/bs';

const UserList = () => {
  const navigate = useNavigate();
  const approvedUsersId = useSelector((state) => state.users.approvedUsersID);
  const loggedInUser = useSelector((state) => state.users.loggedInUser);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  // const [showUserProfile, setShowUserProfile] = useState(false);
  const [showFilterForm, setShowFilterForm] = useState(false);
  // ערכים זמניים מהאינפוטים
  const [tempFilters, setTempFilters] = useState({
    firstName: '',
    lastName: '',
    fathersName: '',
    phone: '',
    email: '',
    address: ''
  });
  // ערכי הסינון בפועל (ישמרו את כל התגיות הקודמות)
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/');
    }
  }, [loggedInUser, navigate]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('http://localhost:3000/contacts');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    setApprovedUsers(users.filter(user => approvedUsersId.includes(user.id)));
  }, [users, approvedUsersId]);

  useEffect(() => {
    setFilteredUsers(approvedUsers);
  }, [approvedUsers]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-form')) {
        setShowFilterForm(false);
      }
      // if (!event.target.closest('.user-profile-container')) {
      //       setShowUserProfile(false);
      //     }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const button = document.querySelector('.scroll-to-top');
      if (window.scrollY < window.innerHeight / 2) {
        button.classList.remove('fixed');
      } else {
        button.classList.add('fixed');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // עדכון הערכים הזמניים בזמן הקלדה
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // בעת לחיצה על "סנן" - הוספת ערכים חדשים בלבד (התגיות הקודמות נשארות)
  const applyFilters = (event) => {
    event.preventDefault();

    setFilters(prevFilters => {
      // מיזוג של הערכים החדשים עם הערכים הקודמים
      const newFilters = { ...prevFilters };

      Object.keys(tempFilters).forEach(filter => {
        if (tempFilters[filter]) { // רק אם יש ערך חדש, נוסיף אותו
          newFilters[filter] = tempFilters[filter];
        }
      });

      let newArray = approvedUsers;
      Object.keys(newFilters).forEach(filter => {
        if (newFilters[filter]) {
          newArray = newArray.filter(user => user[filter]?.startsWith(newFilters[filter]));
        }
      });

      setFilteredUsers(newArray);
      return newFilters;
    });

    // איפוס האינפוטים בלבד, אך השמירה של התגיות הקודמות נשארת
    setTempFilters({
      firstName: '',
      lastName: '',
      fathersName: '',
      phone: '',
      email: '',
      address: ''
    });
    setShowFilterForm(false)
  };

  // מחיקת פילטר ועדכון הרשימה מחדש
  const removeFilter = (filterName) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };
      delete updatedFilters[filterName];

      let newArray = approvedUsers;
      Object.keys(updatedFilters).forEach(filter => {
        if (updatedFilters[filter]) {
          newArray = newArray.filter(user => user[filter]?.startsWith(updatedFilters[filter]));
        }
      });

      setFilteredUsers(newArray);
      return updatedFilters;
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="user-list-page">
      {/* {loggedInUser && (
        <div className="user-profile">
          {!showUserProfile && <img
            src={`http://localhost:3000${loggedInUser.profileImage}`}
            className="user-profile-image"
            onClick={() => setShowUserProfile(!showUserProfile)}
            alt="profileImage"
          />}
          {showUserProfile && <UserProfile />}
        </div>
      )} */}
      <div className='user-list-header' style={{ height: '400px', backgroundColor: '#2f3b52' }}>
      </div>
      <div className='user-list-header' style={{ height: '250px' }}>
        <h1>מקושרים...</h1>
      </div>

      <button className="scroll-to-top" onClick={scrollToTop}>
        <BsArrowUpCircle />
      </button>
      <div className="filter-container">
        <div className="filter-tags">
          {Object.keys(filters).map(filterName =>
            filters[filterName] && (
              <div key={filterName} className="filter-tag">
                <button onClick={() => removeFilter(filterName)}>X</button>
                <p>{filters[filterName]}</p>
              </div>
            )
          )}
        </div>
        <div className="search-options">
          <button className='search-options-button' onClick={() => setShowFilterForm(true)}>אפשרויות חיפוש</button>
          {showFilterForm && <form className="filter-form" onSubmit={applyFilters}>

            <input
              type="text"
              name="lastName"
              placeholder="סינון לפי שם משפחה"
              value={tempFilters.lastName}
              onChange={handleFilterChange}
              disabled={!!filters.lastName}
            />
            <input
              type="text"
              name="firstName"
              placeholder="סינון לפי שם פרטי"
              value={tempFilters.firstName}
              onChange={handleFilterChange}
              disabled={!!filters.firstName} // מניעת שינוי אם יש כבר סינון על שדה זה
            />
            <input
              type="text"
              name="phone"
              placeholder="סינון לפי טלפון"
              value={tempFilters.phone}
              onChange={handleFilterChange}
              disabled={!!filters.phone}
            />
            <button type="submit">סנן</button>
          </form>}
        </div>
      </div>

      <div className="user-list">
        {users.length === 0 && <h2>אין משתמשים רשומים</h2>}
        {filteredUsers.map(user => (
          <div className="user-list-page-user-card">
            <UserCard key={user.id} user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      fathersName: PropTypes.string,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      anotherPhone: PropTypes.string,
      profilePicture: PropTypes.string,
    })
  ).isRequired,
};

export default UserList;
