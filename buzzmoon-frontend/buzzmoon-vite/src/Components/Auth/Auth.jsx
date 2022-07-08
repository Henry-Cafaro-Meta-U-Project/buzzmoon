import * as React from 'react';
import BackendActor from '../BackendActor/backend-actor';
import './Auth.css';

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

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
      
      {/* {mode === "login" && <LoginForm setCurrentUser={props.setCurrentUser}/>} */}
      {mode === "login" && <LoginCard setCurrentUser={props.setCurrentUser}/>}
      {mode === "signup" && <SignupForm setCurrentUser={props.setCurrentUser}/>}

    </div>
  )
}

function LoginForm(props) {
  let [email, setEmail] = React.useState('');
  let [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    await BackendActor.handleLogin(email, password, props.setCurrentUser);
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



function LoginCard(props) {
  let [email, setEmail] = React.useState('');
  let [password, setPassword] = React.useState('');

  const handleSubmit = async () => {
    await BackendActor.handleLogin(email, password, props.setCurrentUser);
  }

  return (
    <Flex
      minH={'50vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <form onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input 
                type="email" 
                onChange={(event) => {setEmail(event.target.value)}}/>
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input 
                type="password" 
                onChange={(event) => (setPassword(event.target.value))}/>
            </FormControl>
            <Stack spacing={10} mt={5}>
              <Button
                bg={'blue.400'}
                color={'black'}
                _hover={{
                  bg: 'blue.500',
                  color: 'white',
                }}
                type="submit">
                Sign in
              </Button>
            </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}