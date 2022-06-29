import * as React from 'react';
import BackendActor from '../BackendActor/backend-actor';
import './Auth.css';

export default function Auth(props) {
  let [username, setUsername] = React.useState('');
  let [password, setPassword] = React.useState('');

  const handleLogin = async  () => {
    
    await BackendActor.handleLogin(username, password, props.setCurrentUser);
    setPassword('');
    setUsername('');
  }

  return (
    <div className='auth'>
      
      <form className='auth-form'>
        <div className='flex-form'>
          <li>
            <label htmlFor="username">Username </label>
            <input type="text" name="username" value={username} 
              onChange={(event) => {setUsername(event.target.value)}}>
            </input>
          </li>
          <li>
            <label htmlFor="password">Password </label>
            <input type="password" name="password" value={password} 
              onChange={(event) => {setPassword(event.target.value)}}></input>  
          </li>
          <li>
            <button type="button" onClick={handleLogin}>Log In</button>
          </li>
        </div>
      </form>
    </div>
  )

}
