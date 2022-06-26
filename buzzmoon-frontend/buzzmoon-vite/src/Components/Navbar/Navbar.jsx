import * as React from 'react';
import './Navbar.css';
import {
  Link
} from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="navbar">
      <Link to="/"> 
        <i className="fa-solid fa-moon"></i>
      </Link>
    </div>
  );
}
