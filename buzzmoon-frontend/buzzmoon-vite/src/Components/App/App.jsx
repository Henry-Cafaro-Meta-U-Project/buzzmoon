import * as React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

import Home from '../Home/Home';
import Navbar from '../Navbar/Navbar';
import './App.css';

function App() {
  let [loggedIn, setLoggedIn] = React.useState(true);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/compete" />}></Route>
          <Route path="/compete/*"  element={<Home />}></Route>
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
