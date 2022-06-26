import * as React from 'react';
import CompeteView from '../CompeteView/CompeteView';
import Navbar from '../Navbar/Navbar';
import './Home.css';

export default function Home() {
  return (
    <div className='home'>
      <Navbar />
      <CompeteView />
    </div>
  );
}
