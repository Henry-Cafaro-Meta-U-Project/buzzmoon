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

export default function CompeteView() {
  const [availableGames, setAvailableGames] = React.useState();
  const [gamesPlayed, setGamesPlayed] = React.useState();

  React.useEffect(() => {
    const fetchGames = async () => {
      const games = await BackendActor.getGames();
      setAvailableGames(games);

      setGamesPlayed([]); //placeholder
    }
    
    fetchGames();
  }, []);

  return (
    
      <Routes>
        <Route path="/" 
          element={
            <Center mt={'20'}>
              <Flex w={'60%'} direction={'row'} justify={'space-between'} wrap={'wrap'}>
                <VStack boxShadow={'xl'} bg={'gray.200'} p={'5'} spacing={'5'} mb={'5'} minW={'33%'} minH={'100%'}>
                  <Heading size="md" borderBottom={'2px solid black'}>Available Games</Heading>
                  <VStack spacing={'1px'}>
                    {availableGames ? 
                      availableGames.map((e) => (
                        <GameListItem key={e.gameID} game={e}/>
                      )) : <Spinner />}
                  </VStack>
                </VStack>
                <VStack boxShadow={'xl'} bg={'gray.200'} p={'5'} spacing={'5'} mb={'5'} minW={'33%'} minH={'100%'}>
                  <Heading size="md" borderBottom={'2px solid black'}>Games Played</Heading>
                  <VStack spacing={'1px'}>
                    {gamesPlayed ? 
                      gamesPlayed.map((e) => (
                        <GameListItem key={e.gameID} game={e}/>
                      )) : <Spinner />}
                  </VStack>
                </VStack>
              </Flex>
            </Center>}>
        </Route>
        <Route path="/:gameID" element={<GameSplashPage />}></Route>
        <Route path="/:gameID/play/:resultKey" element={<Game />}></Route>

        <Route path="/:gameID/results" element={<Results />}></Route>
      </Routes>
      
    
  );
}

function GameListItem(props) {
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
