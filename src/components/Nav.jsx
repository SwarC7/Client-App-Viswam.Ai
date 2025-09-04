import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthed, clearToken } from "../lib/auth";

export default function Nav() {
  const navigate = useNavigate();
  const authed = isAuthed();

  const onLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar__container">
        <Link to="/" className="brand" aria-label="Corpus Client home">
          <span className="brand__dot" />
          Corpus Client
        </Link>

        <nav aria-label="Primary" className="nav">
          {authed ? (
            <ul className="nav__list">
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/upload">Upload</Link></li>
              <li><Link to="/contributions">My Contributions</Link></li>
              <li><button className="nav__button" onClick={onLogout}>Logout</button></li>
            </ul>
          ) : (
            <ul className="nav__list">
              <li><Link to="/login">Login</Link></li>
              <li><Link className="nav__cta" to="/signup">Sign Up</Link></li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}
