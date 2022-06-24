import * as React from 'react';
import './Auth.css';
import Parse from 'parse';
import { useHistory } from 'react-router-dom';

export default function Auth() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [loginMode, setLoginMode] = React.useState('login');

  const history = useHistory();

  const handleLogin = () => {
    const user = new Parse.User();

    user.set('username', username);
    user.set('password', password);

    user.login().then(() => {
      history.push('/');
    }).catch((err) => {
      alert(err.message);
    });
  };

  const handleRegister = () => {
    const user = new Parse.User();

    user.set('username', username);
    user.set('password', password);

    user.signUp().then(() => {
      handleLogin();
    }).catch((err) => {
      alert(err.message);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (loginMode === 'login') {
      handleLogin();
    } else if (loginMode === 'register') {
      handleRegister();
    }
  };

  return (
    <div className="auth-container">
      <h1> Auth</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            if (loginMode === 'login') {
              setLoginMode('register');
            } else if (loginMode === 'register') {
              setLoginMode('login');
            }
          }}
        >
          {((loginMode === 'login') ? 'Create New Account' : 'Use Existing Account')}
        </button>
        <button type="submit">{((loginMode === 'login') ? 'Log In' : 'Register')}</button>
      </form>
    </div>
  );
}
