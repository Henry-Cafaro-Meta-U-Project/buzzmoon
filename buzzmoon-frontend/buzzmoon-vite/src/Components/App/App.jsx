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
import CreateView from '../CreateView/CreateView';
import CompeteView from '../CompeteView/CompeteView';
import DevDashboard from '../DevDashboard/DevDashboard';

Parse.initialize(`nUrzDufzLEaJ3sjzvcvNHvw1hD46jOt4yEipaWHs`, `juaO5lbdY5jTtDXGpzEr2mGtggC0wf2Es11cEruf`);
Parse.serverURL = 'https://parseapi.back4app.com/';

function App() {
  let [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const user = localStorage.getItem('user');

    if(user !== "null"){
      setCurrentUser(user);
    }
  }, []);

  const handleLogOut = async () => {
    try {
      await Parse.User.logOut();
      setCurrentUser(null);
    } catch (error) {
      console.log('error: ', error);

    }
  }

  if(currentUser == null){
    return (<Auth setCurrentUser={setCurrentUser}/>)
  }else{
    return (
      <div className="app">
        <BrowserRouter basename='/buzzmoon'>
          <Navbar setCurrentUser={setCurrentUser} />
          <Routes>
            <Route path="/dev/" element={<DevDashboard />}></Route>
            <Route path="/" element={<Navigate to="/compete" />}></Route>
            <Route path="/compete/*"  element={<CompeteView />}></Route>
            <Route path="/create/*"  element={<CreateView />}></Route>
          </Routes>

        </BrowserRouter>
      </div>
    );
  }


}

export default App;
