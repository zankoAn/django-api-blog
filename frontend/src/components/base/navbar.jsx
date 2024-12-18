// components/base/navbar.js
import { React, useState } from "react";
import { NavLink } from "react-router-dom";

import "./navbar.css";

export default function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  return (
    <header id="nav-head" className={`nav-links-${isActive ? "show" : "hide"}`}>
      <span className="toggler" onClick={toggleMenu}>
        {isActive ? (
          <svg
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="#dfdcff"
            className="toggler-icon-close"
          >
            <path d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#f5f7ff"
            className="toggler-icon-open"
          >
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </span>
      <NavLink to="/aboutMe/1" className="nav-link" onClick={toggleMenu}>
        <svg height="28px" viewBox="0 0 24 24" stroke="red">
          <path d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
        </svg>
        About Me
      </NavLink>
      <NavLink to="/programing" className="nav-link" onClick={toggleMenu}>
        <svg height="28px" viewBox="0 0 24 24" stroke="#6ffff0" fill="#6ffff0">
          <path d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
        </svg>
        Programming
      </NavLink>
      <NavLink to="/novels" className="nav-link" onClick={toggleMenu}>
        <svg height="28px" viewBox="0 0 24 24" stroke="#272650" fill="#d3b6ff">
          <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
        Novels
      </NavLink>
      <NavLink to="/movies" className="nav-link" onClick={toggleMenu}>
        <svg height="28px" viewBox="0 0 24 24" stroke="#272650" fill="#ffcfb6">
          <path d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        Movies
      </NavLink>
      <NavLink to="/?order=view" className="nav-link" onClick={toggleMenu}>
        <svg height="28px" viewBox="0 0 24 24" stroke="#0ade7f">
          <path d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
        </svg>
        Home
      </NavLink>
    </header>
  );
}
