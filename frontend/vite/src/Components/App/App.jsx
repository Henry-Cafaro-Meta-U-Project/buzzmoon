import * as React from 'react';
import {
  HashRouter,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

import Parse from 'parse/dist/parse.min.js'

import Navbar from '../Navbar/Navbar';
import Auth from '../Auth/Auth';
import CreateView from '../CreateView/CreateView';
import CompeteRouter from '../CompeteView/CompeteView';
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

  if(currentUser == null){
    return (<Auth setCurrentUser={setCurrentUser}/>)
  }else{
    return (
      <div className="app">
        <HashRouter>
          <Navbar setCurrentUser={setCurrentUser} />
          <Routes>
            <Route path="/dev/" element={<DevDashboard />}></Route>
            <Route path="/" element={<Navigate to="/compete" />}></Route>
            <Route path="/compete/*"  element={<CompeteRouter />}></Route>
            <Route path="/create/*"  element={<CreateView />}></Route>
          </Routes>

        </HashRouter>
      </div>
    );
  }


}

export default App;
