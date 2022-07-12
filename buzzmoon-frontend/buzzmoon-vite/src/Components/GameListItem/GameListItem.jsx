import * as React from 'react';
import Game from '../Game/Game';
import Results from '../Results/Results';
import { BrowserRouter,
  Route,
  Routes,
  useNavigate} from 'react-router-dom';
import BackendActor from '../BackendActor/backend-actor';
import GameSplashPage from '../GameSplashPage/GameSplashPage';

import { VStack, Heading, Flex, Center, Button, Text, Spinner} from '@chakra-ui/react';

export default function GameListItem(props) {
  const navigate = useNavigate();

  return  (
    <Flex w={'100%'} justify={'space-between'} align={'center'}>
      <Text mr={'5'}>{props.game.title} </Text>
      <Button 
        colorScheme={'gray'}
        variant={'outline'}
        onClick={() => {
        navigate(`/compete/${props.game.gameID}`);
      }}>
        Enter
      </Button>
    </Flex>
  )
}