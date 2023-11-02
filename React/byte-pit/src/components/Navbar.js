import "./NavbarStyle.css"
import logo from "./logo.svg"

const Navbar = () => {

  return (
    <div className="navbar">
      <div className="left">
        <i className="menu-icon">
          &#9776;
        </i>
        <img src={logo} alt="Logo" className="logo" />
        </div>
      <div className="middle">
      <a href="/calendar" className="nav-link middle-link">
          Kalendar natjecanja
        </a>
        <a href="/users" className="nav-link middle-link">
          Korisnici
        </a>
        <a href="/tasks" className="nav-link middle-link">
          Zadaci za vježbu
        </a>
      </div>
      <div className="right">
        <a href="/login" className="nav-link middle-link">
          Prijava
        </a>
        <a href="/registration" className="nav-link">
          Registracija
        </a>
      </div>
    </div>
  );
};

export default Navbar;
