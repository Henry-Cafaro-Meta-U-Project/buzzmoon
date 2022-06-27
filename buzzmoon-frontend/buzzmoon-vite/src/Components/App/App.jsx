import * as React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

import * as Parse from 'parse/dist/parse.min.js'

import Home from '../Home/Home';
import Navbar from '../Navbar/Navbar';
import Auth from '../Auth/Auth';
import './App.css';

Parse.initialize(`nUrzDufzLEaJ3sjzvcvNHvw1hD46jOt4yEipaWHs`, `juaO5lbdY5jTtDXGpzEr2mGtggC0wf2Es11cEruf`);
Parse.serverURL = 'https://parseapi.back4app.com/';

function App() {
  let [currentUser, setCurrentUser] = React.useState(null);

  if(currentUser == null){
    return (<Auth setCurrentUser={setCurrentUser}/>)
  }

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
