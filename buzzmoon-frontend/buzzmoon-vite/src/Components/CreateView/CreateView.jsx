import * as React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './CreateView.css';

import { VStack, Box, Heading, Flex, Center, Button, Text} from '@chakra-ui/react';

import CreateGame from '../CreateGame/CreateGame';

export default  function CreateView(props) {
  return (
      <Routes>
        <Route path="/" element={
          <Center>
            <Box mt={'10'}>
              <VStack spacing={'8'}>
                <VStack boxShadow={'xl'} bg={'gray.200'} p={'5'} spacing={'5'} align={'start'}>
                  <Heading size="md" borderBottom={'2px solid black'}>Your Created Games</Heading>
                </VStack>
                <Link to="/create/new">
                  <Button leftIcon={<i className="fa-solid fa-plus"></i>} colorScheme={'green'}>
                    Create New
                  </Button>
                </Link>
              </VStack>
            </Box>

            
          </Center>}>
        </Route>
        <Route path="/new" element={<CreateGame />}></Route>
      </Routes>
  )
}