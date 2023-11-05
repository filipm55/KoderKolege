import "./NavbarStyle.css"
import logo from "./logo.svg"
import {Link} from "react-router-dom";

const Navbar = () => {

  return (
    <div className="navbar">
      <div className="left">
        <i className="menu-icon">
          &#9776;
        </i>
       <Link to='/'> <img src={logo} alt="Logo" className="logo" /></Link>
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

      <div className="right">
        <Link to='/login' className="nav-link middle-link">
          PRIJAVA
        </Link>
        <Link to='/registration' className="nav-link">
          REGISTRACIJA
        </Link>
      </div>
      </div>
    </div>
  );
};

export default Navbar;
