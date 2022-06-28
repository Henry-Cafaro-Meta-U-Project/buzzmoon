import * as React from 'react';
import './Navbar.css';
import {
  Link
} from 'react-router-dom';
import BackendActor from '../BackendActor/backend-actor';

export default function Navbar(props) {
  return (
    <div className="navbar">
      <div className='navbar-left'>
        <Link to="/"> 
          <i className="fa-solid fa-moon"></i>
        </Link>
      </div>
      <div className='navbar-right'>
        <button onClick={() => {
          BackendActor.handleLogOut(props.setCurrentUser);
          }}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </div>
  );
}
