import * as React from 'react';
import {
  Link
} from 'react-router-dom';
import BackendActor from '../BackendActor/backend-actor';

import {
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  HStack,
  IconButton,
} from '@chakra-ui/react';

export default function NavbarBox(props) {
  return (
    <Flex minW={'100%'} top="0rem" right="0rem" align="start" bg={useColorModeValue('gray.50', 'gray.800')}>
      <Flex minW={'100%'} direction={'row'} justify={'space-between'} align={'center'} borderBottom={'2px solid black'}>
        <HStack >
          <Link to="/"> 
          <Heading fontSize={'5xl'}>
            BuzzMoon
          </Heading>
          </Link>
        </HStack>
  
        <HStack fontSize={64} spacing={'5vw'}>
          <Link to="/compete">
            <i className="fa-solid fa-dumbbell"></i>
          </Link>
          <Link to="/create">
            <i className="fa-solid fa-pencil"></i>
          </Link>
        </HStack>

        <HStack mr={'3vw'} align={'center'}>
          <IconButton
            onClick={() => {
              BackendActor.handleLogOut(props.setCurrentUser);
              }}
            _hover={{ backgroundColor: 'transparent' }}
            icon={<i className="fa-solid fa-arrow-right-from-bracket"></i>}
            size={'auto'}
            fontSize={'64px'}
            variant='ghost'>

          </IconButton>
        </HStack>
      </Flex>
    </Flex>
  )
}
