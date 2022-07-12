import * as React from 'react';

import GameListItem from '../GameListItem/GameListItem';

import { VStack, Heading, Spinner} from '@chakra-ui/react';

export default function GameList({heading, games}) {
  return (
    <VStack boxShadow={'xl'} bg={'gray.200'} p={'5'} spacing={'5'} mb={'5'} minW={'33%'} minH={'100%'}>
      <Heading size="md" borderBottom={'2px solid black'}>{heading}</Heading>
      <VStack spacing={'1px'}>
        {games ? 
          games.map((e) => (
            <GameListItem key={e.gameID} game={e}/>
          )) : <Spinner />}
      </VStack>
    </VStack>
  )
}