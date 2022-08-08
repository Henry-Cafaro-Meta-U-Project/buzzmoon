import * as React from 'react';
import {BackendActor} from '../../Server/BackendActor/backend-actor';

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

import backgroundImgURL from '/assets/login-background.png'

export default function Auth(props) {

  return (
    <div className="login-background" style={{
      height:"100vh",
      backgroundImage:`url(${backgroundImgURL})`
    }}
    >
    <Flex
      align={'center'}
      justify={'center'}>
        <Tabs size='md' variant='enclosed' colorScheme={'black'} mt={'4vh'}>
          <TabList>
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels mt={'0px'}>
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
      align={'start'}
      justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={'10px'} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}

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
                bg={'black'}
                color={'white'}
                _hover={{
                  bg: 'white',
                  color: 'black',
                  border: '1px solid black'
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
      align={'start'}
      justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={'10px'} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Create your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
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
                bg={'black'}
                color={'white'}
                _hover={{
                  bg: 'white',
                  color: 'black',
                  border: '1px solid black'
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
