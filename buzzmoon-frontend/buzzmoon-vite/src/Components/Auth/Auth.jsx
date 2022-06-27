import * as React from 'react';
import BackendActor from '../BackendActor/backend-actor';
import './Auth.css';

export default function Auth(props) {
  let [username, setUsername] = React.useState('');
  let [password, setPassword] = React.useState('');

  const handleLogin = async  () => {
    console.log(1);
    await BackendActor.handleLogin(username, password, props.setCurrentUser);
    console.log('username: ', username);
    setPassword('');
    setUsername('');
  }

  return (
    <div className='auth'>
      <form className='auth-form'>
        <input type="text" name="username" value={username} 
          onChange={(event) => {setUsername(event.target.value)}}></input>
        <input type="password" name="password" value={password} 
          onChange={(event) => {setPassword(event.target.value)}}></input>  
        <button type="button" onClick={handleLogin}>Log In</button>
      </form>

    </div>
  )

}
