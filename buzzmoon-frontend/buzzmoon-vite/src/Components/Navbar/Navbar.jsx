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
          BuzzMoon
        </Link>
      </div>
      <div className='navbar-center'>
        <div className='nav-button'>
          <Link to="/compete">
            <i className="fa-solid fa-dumbbell"></i>
          </Link>
        </div>
        <div className='nav-button'>
          <Link to="/create">
            <i className="fa-solid fa-pencil"></i>
          </Link>
        </div>
        <div className='nav-button'>
          <button onClick={() => {
            BackendActor.handleLogOut(props.setCurrentUser);
            }}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
        
      </div>
      
    </div>
  );
}
