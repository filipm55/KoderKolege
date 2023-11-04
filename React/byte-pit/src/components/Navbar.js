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
      <div className="middle">
      <Link to='/calendar' className="nav-link middle-link">
          Kalendar natjecanja
        </Link>
        <Link to='/users' className="nav-link middle-link">
          Korisnici
        </Link>
        <Link to='/tasks' className="nav-link middle-link">
          Zadaci za vježbu
        </Link>
      </div>
      <div className="right">
        <Link to='/login' className="nav-link middle-link">
          Prijava
        </Link>
        <Link to='/registration' className="nav-link">
          Registracija
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
