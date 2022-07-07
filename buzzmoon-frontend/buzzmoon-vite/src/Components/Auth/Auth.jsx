import * as React from 'react';
import BackendActor from '../BackendActor/backend-actor';
import './Auth.css';

export default function Auth(props) {

  let [mode, setMode] = React.useState("login");



  return (
    <div className='auth'>
      <div className='auth-header'>
        <button type='button' className={mode === "login" ? "selected" : ""} onClick={() => {setMode("login")}}>
          Login
        </button>
        <button type='button' className={mode === "signup" ? "selected" : ""} onClick={() => {setMode("signup")}}>
          Signup
        </button>
      </div>
      
      {mode === "login" && <LoginForm setCurrentUser={props.setCurrentUser}/>}
    </div>
  )

}

function LoginForm(props) {
  let [username, setUsername] = React.useState('');
  let [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    await BackendActor.handleLogin(username, password, props.setCurrentUser);
    setPassword('');
    setUsername('');
  }

  return (
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
  );
}
