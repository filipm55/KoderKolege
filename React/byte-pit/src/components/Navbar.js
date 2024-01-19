import React, { useState, useEffect } from 'react';
import './NavbarStyle.css';
import logo from './logo.svg';
import logoUser from './user.svg';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  const cookies = new Cookies();

  useEffect(() => {
    setJwtToken(cookies.get('jwt_authorization'));
    if (jwtToken) {
      setIsLoggedIn(true);

      const fetchData = async () => {
        try {
          const url = `https://bytepitb-myjy.onrender.com/users/${jwtToken}`;
          const response = await fetch(url);
          const data = await response.json();
          setUserData(data); 
          console.log(data.id);
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    } else {
    }
  }, [jwtToken]);

  const logout = () => {
    cookies.remove('jwt_authorization');
    const allCookies = cookies.getAll();
    Object.keys(allCookies).forEach(cookieName => {
      cookies.remove(cookieName);
    });
    setJwtToken(null);
    localStorage.clear();
    window.location.href = '/login';
  };
  return (
    <div className="navbar">
      <div className="left">
        <Link to='/'> <img src={logo} alt="Logo" className="logo" /></Link>
        <h2 className="Bytepit" style={{ color: 'black', fontSize: 25}}>BytePit</h2>

      </div>
      <div className="omotac">
        <div className="middle">
          <p>|</p>
          <Link to='/calendar' className="nav-link middle-link">
            KALENDAR NATJECANJA
          </Link>

          {userData && (
          <p>|</p>
          )}
          {userData && (
          <Link to='/users' className="nav-link middle-link">
            KORISNICI
          </Link>
          )}
          
          {userData && (userData.userType==="ADMIN" || userData.userType==="COMPETITION_LEADER")  && 
          <p>
            |
            <Link to='/creation' className="nav-link middle-link">
              KREIRAJ SADRŽAJ
            </Link>
            </p>}
          <p>|</p>
          {userData && (
            <Link to='/practice' className="nav-link middle-link">
              VJEŽBA
            </Link>
          )}
          {userData && (
          <p>|</p>
          )}
          <Link to='competitions/results' className="nav-link middle-link">
            REZULTATI
          </Link>
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
            {userData.id!=1 &&<Link to={`/users/${userData.id}`}>
              <img src={logoUser} className="logoUser" alt="User Logo" />
              </Link>}
            <Link to={`/users/${userData.id}`} style={{ textDecoration: 'none' }}>
            <div className="nav-link middle-link">{userData && userData.id!=1 &&`${userData.name} ${userData.lastname}`}</div></Link>
            {userData && userData.id == 1 &&
            <div><img src={logoUser} className="logoUser" alt="User Logo" />admin</div>}
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
