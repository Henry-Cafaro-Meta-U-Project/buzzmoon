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
      {mode === "signup" && <SignupForm setCurrentUser={props.setCurrentUser}/>}

    </div>
  )

}

function LoginForm(props) {
  let [email, setEmail] = React.useState('');
  let [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    await BackendActor.handleLogin(email, password, props.setCurrentUser);
    setPassword('');
    setUsername('');
  }

  return (
    <form className='auth-form'>
        <div className='flex-form'>
          <li>
            <label htmlFor="email">Email </label>
            <input type="text" name="email" value={email} 
              onChange={(event) => {setEmail(event.target.value)}}>
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

function SignupForm(props) {
  let [email, setEmail] = React.useState('');
  let [password, setPassword] = React.useState('');
  let [realName, setRealName] = React.useState('');

  const handleSignup = async () => {
    await BackendActor.handleSignup(email, password, realName, props.setCurrentUser);
    setPassword('');
    setUsername('');
  }

  return (
    <form className='auth-form'>
        <div className='flex-form'>
          <li>
            <label htmlFor="email">Email </label>
            <input type="text" name="email" value={email} 
              onChange={(event) => {setEmail(event.target.value)}}>
            </input>
          </li>
          <li>
            <label htmlFor="password">Password </label>
            <input type="password" name="password" value={password} 
              onChange={(event) => {setPassword(event.target.value)}}></input>  
          </li>
          <li>
            <label htmlFor="real name">Real Name </label>
              <input type="realName" name="real name" value={realName} 
                onChange={(event) => {setRealName(event.target.value)}}></input>  
          </li>
          <li>
            <button type="button" onClick={handleSignup}>Sign Up</button>
          </li>
        </div>
      </form>
  );
}