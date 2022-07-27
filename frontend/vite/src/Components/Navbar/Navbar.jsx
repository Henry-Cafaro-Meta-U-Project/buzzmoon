import * as React from 'react';
import {
  Link
} from 'react-router-dom';
import {BackendActor} from '../../Server/BackendActor/backend-actor';

import {
  Flex,
  Heading,
  Center,
  HStack,
  IconButton,
  Show,
  useBreakpointValue
} from '@chakra-ui/react';

export default function NavbarBox(props) {

  return (
    <Center w={'100%'} h={'8rem'} top={"0rem"} right={'0rem'}>
      <Flex color={'white'} bg={'black'} w={'96%'} h={'80%'} top="0rem" right="0rem" align="center" shadow={'md'} px={'5'}>
        <Flex minW={'100%'} direction={'row'} justify={'space-between'} align={'center'}>
          <HStack align={'center'} spacing={'10'}>
            <Show above="md">
            <Link to="/">
            <Heading fontSize={'5xl'}>
              BuzzMoon
            </Heading>
            </Link>
            </Show>
            <Link to="/compete">
            <Heading fontSize={'3xl'}>
              Compete
            </Heading>
            </Link>
            <Link to="/create">
            <Heading fontSize={'3xl'}>
              Create
            </Heading>
            </Link>
          </HStack>
          <IconButton
            onClick={() => {
              BackendActor.handleLogOut(props.setCurrentUser);
              }}
            _hover={{ backgroundColor: 'transparent' }}
            icon={
              <Heading fontSize={'3xl'}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              </Heading>}
            size={'auto'}
            variant='ghost'>

          </IconButton>
        </Flex>
      </Flex>
    </Center>
  )
}
