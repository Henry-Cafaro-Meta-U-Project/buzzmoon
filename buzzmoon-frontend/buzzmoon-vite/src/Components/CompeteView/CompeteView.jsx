import * as React from 'react';
import Game from '../Game/Game';
import GameListItem from '../GameListItem/GameListItem';
import Results from '../Results/Results';
import { BrowserRouter,
  Route,
  Routes,
  useNavigate} from 'react-router-dom';
import BackendActor from '../BackendActor/backend-actor';
import GameSplashPage from '../GameSplashPage/GameSplashPage';
import GameList from '../GameList/GameList';

import { VStack, Heading, Flex, Center, Button, Text, Spinner, useBreakpointValue} from '@chakra-ui/react';

export default function CompeteView() {
  const [availableGames, setAvailableGames] = React.useState();
  const [gamesPlayed, setGamesPlayed] = React.useState();

  React.useEffect(() => {
    const fetchGames = async () => {
      const games = await BackendActor.getGames();
      setAvailableGames(games);

      const playedGames = await BackendActor.getPlayedGames();
      setGamesPlayed(playedGames) //placeholder
    }

    fetchGames();
  }, []);

  const screenType = useBreakpointValue({base:"mobile", md:"desktop"});

  return (

      <Routes>
        <Route path="/"
          element={
            <Center my={{base:'4', md:'20'}}>
              {screenType === "mobile" ?
                <VStack>
                  <GameList heading={"Play Now"} games={availableGames}></GameList>
                  <GameList heading={"Games Played"} games={gamesPlayed}></GameList>
                </VStack> :
                <Flex w={{base:'90%', md:'70%'}} direction={'row'} justify={'space-between'} wrap={'wrap'}>
                <GameList heading={"Play Now"} games={availableGames}></GameList>
                <GameList heading={"Games Played"} games={gamesPlayed}></GameList>
              </Flex>}

            </Center>}>
        </Route>
        <Route path="/:gameID" element={<GameSplashPage />}></Route>
        <Route path="/:gameID/play/:resultKey" element={<Game />}></Route>

        <Route path="/:gameID/results" element={<Results />}></Route>
      </Routes>


  );
}
