import * as React from 'react';
import {
  BrowserRouter,
} from 'react-router-dom';

import Home from '../Home/Home';
import Navbar from '../Navbar/Navbar';
import './App.css';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <Home />

      </BrowserRouter>
    </div>
  );
}

export default App;
