import * as React from 'react';
import BackendActor from '../BackendActor/backend-actor';

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'


export default function Auth(props) {
  let [mode, setMode] = React.useState("login");


  return (
    <div className="login-background" style={{
      height:"100vh",
      backgroundImage:`url('../../../assets/login-background.png')`
    }}
    >
    <Flex
      align={'center'}
      justify={'center'}>
        <Tabs size='md' variant='enclosed'>
          <TabList>
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LoginCard setCurrentUser={props.setCurrentUser}/>
            </TabPanel>
            <TabPanel>
            <SignUpCard setCurrentUser={props.setCurrentUser}/>
            </TabPanel>
          </TabPanels>
        </Tabs>
    </Flex>
    </div>

  )
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
      justify={'center'}>
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

function SignUpCard(props) {
  let [email, setEmail] = React.useState('');
  let [password, setPassword] = React.useState('');
  let [realName, setRealName] = React.useState('');

  const handleSignup = async () => {
    await BackendActor.handleSignup(email, password, realName, props.setCurrentUser);
  }

  return (
    <Flex
      minH={'50vh'}
      align={'center'}
      justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Create your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <form onSubmit={(event) => {
              event.preventDefault();
              handleSignup();
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
            <FormControl id="realName" isRequired>
              <FormLabel>Real Name</FormLabel>
              <Input
                type="text"
                onChange={(event) => (setRealName(event.target.value))}/>
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
                Sign up
              </Button>
            </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
