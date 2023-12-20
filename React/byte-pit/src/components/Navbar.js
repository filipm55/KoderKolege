import React, { useState, useEffect } from 'react';
import './NavbarStyle.css';
import logo from './logo.svg';
import logoUser from './user.svg';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const cookies = new Cookies();
  const jwtToken = cookies.get('jwt_authorization');

  useEffect(() => {
    if (jwtToken) {
      setIsLoggedIn(true);

      const fetchData = async () => {
        try {
          const url = `http://localhost:8080/users/${jwtToken}`;
          const response = await fetch(url);
          const data = await response.json();
          setUserData(data); // Set user data fetched from the backend
        } catch (error) {
          // Handle error if needed
          console.error(error);
        }
      };

      fetchData();
    } else {
    }
  }, [jwtToken]);

  const logout = () => {
    cookies.remove('jwt_authorization');
    window.location.href = '/login'; // Redirect to the login page
  };
  return (
    <div className="navbar">
      <div className="left">
        <i className="menu-icon">
          &#9776;
        </i>
        <Link to='/'> <img src={logo} alt="Logo" className="logo" /></Link>
        <h2 className="Bytepit" style={{ color: 'black', fontSize: 25}}>BytePit</h2>

      </div>
      <div className="omotac">
        <div className="middle">
          <p>|</p>
          <Link to='/calendar' className="nav-link middle-link">
            KALENDAR NATJECANJA
          </Link>
          <p>|</p>
          <Link to='/users' className="nav-link middle-link">
            KORISNICI
          </Link>
          <p>|</p>
          <Link to='/tasks' className="nav-link middle-link">
            ZADACI ZA VJEŽBU
          </Link>
          <p>|</p>
        </div>
      </div>

        <div className="right">
          {isLoggedIn && userData && (
            <Link to='/login' onClick={logout} className="nav-link-log middle-link">
             ODJAVA
            </Link>
          )}
          {isLoggedIn && userData && (
            <div className="user-info">
            <Link to="/user">
              <img src={logoUser} className="logoUser" alt="User Logo" />
            </Link>
            <div>{userData && `${userData.name} ${userData.lastname}`}</div>
          </div>
          )}
          { !userData && (
            <Link to='/login' className="nav-link-log middle-link">
            PRIJAVA
            </Link>
          )}
          {!userData && (
            <Link to='/registration' className="nav-link-log">
              REGISTRACIJA
            </Link>
          )}
        </div>
      </div>
  );
};

export default Navbar;
