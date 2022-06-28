import * as React from 'react';
import CompeteView from '../CompeteView/CompeteView';
import Navbar from '../Navbar/Navbar';
import './Home.css';

export default function Home(props) {
  return (
    <div className='home'>
      <Navbar setCurrentUser={props.setCurrentUser}/>
      <CompeteView />
    </div>
  );
}
