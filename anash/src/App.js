import './App.css';
import Home from './components/home';
import { Link, Route, Routes } from 'react-router-dom';
import UnderConstruction from './components/UnderConstruction';
import ContactForm from './components/contactForm';
import AdminPanel from './components/admin/adminPanel';
import UserList from './components/contacts/userList';
import LoginForm from './components/users/loginForm';
import RegistrationForm from './components/users/registrationForm';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import ShowAds from './components/showAds';

function App() {

  const logedInUser = useSelector(state => state.users.loggedInUser);
  const isAdmin = useSelector(state => state.users.isAdmin);

  // useEffect(() => {
  //   console.log('logedInUser:', logedInUser);
  // }
  //   , [logedInUser]);
  return (
    <>
      <header className={`app-header ${logedInUser ? '' : 'logged-out'}`}>
        {logedInUser && <>
          < nav className={`app-nav ${logedInUser ? '' : 'logged-out'}`}>
            <Link className='app-Link active' to='./chat'>עדכוני אנ"ש</Link>
            <Link className='app-Link active' to='/temp'>תיווך דירות</Link>
            <Link className='app-Link active' to='/temp'>חדש בקהילה</Link>
            <Link className='app-Link active' to='/contacts'>רשימת אנ"ש</Link>
            <Link className='app-Link active' to='/temp'>תמיכה הדדית</Link>
            {isAdmin ?
              <Link className='app-Link active' to='/admin'>ניהול</Link>
              : <Link className='app-Link active' to='/contact'>צור קשר</Link>}
          </nav>
        </>}
        <img
          src='/logo-removebg.png'
          alt='לוגו'
          className={`logo-image` + (logedInUser ? ' logged-in' : ' logged-out')}
        />
      </header>
      <ShowAds/>
      <div className={`container ${logedInUser ? '' : 'logged-out'}`}>
        {/* <ShowAds/> */}
        <Routes>
          <Route path="/" element={logedInUser ? <div></div> : <Home />} />
          <Route path="/temp" element={<UnderConstruction />} />
          <Route path="/chat" element={<iframe src="/chat.html" width="100%" height="600px" />} />
          <Route path="/contacts" element={<UserList />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registration" element={<RegistrationForm />} />
        </Routes>
      </div>
      <footer className={`app-footer ${logedInUser ? '' : 'logged-out'}`}>
        <p>© כל הזכויות שמורות, פותח על ידי <bdi><a href='mailto:r0527187861@gmail.com' target="_blank">r0527187861@gmail.com</a></bdi> 2025.</p>

        <div>
        </div>
      </footer>
    </>

  );
}

export default App;
