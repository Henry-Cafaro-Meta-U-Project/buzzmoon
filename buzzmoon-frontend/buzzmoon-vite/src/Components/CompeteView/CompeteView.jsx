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

import { VStack, Input, Flex, Center, Icon, IconButton, useBreakpointValue, HStack, Spinner, Heading} from '@chakra-ui/react';
import {AiOutlineSearch} from "react-icons/ai"

export default function CompeteRouter() {
  return (

      <Routes>
        <Route path="/"
          element={<CompeteView></CompeteView>}>
        </Route>
        <Route path="/:gameID" element={<GameSplashPage />}></Route>
        <Route path="/:gameID/play/:resultKey" element={<Game />}></Route>

        <Route path="/:gameID/results" element={<Results />}></Route>
      </Routes>
  );
}

function CompeteView() {
  const [availableGames, setAvailableGames] = React.useState();
  const [gamesPlayed, setGamesPlayed] = React.useState();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResultsGames, setSearchResultsGames] = React.useState([]);
  const [searchMode, setSearchMode] = React.useState("none");

  const performSearch = async () => {
    setSearchMode("searching");
    const games = await BackendActor.searchGames(searchTerm);
    setSearchResultsGames(games);
    setSearchMode("done");
  }

  React.useEffect(() => {
    const fetchGames = async () => {
      const games = await BackendActor.getGames();
      setAvailableGames(games);

      const playedGames = await BackendActor.getPlayedGames();
      setGamesPlayed(playedGames) //placeholder
    }

    fetchGames();
  }, []);

  return (
    <ResponsiveCenteredFlex>
      <VStack spacing={'6'}>
        <HStack boxShadow={'lg'} padding={'5'}>
          <Input value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value)}}>
            </Input>
          <IconButton
            variant={'outline'}
            color={'black'}
            icon={<Icon fontSize={'auto'} as={AiOutlineSearch}></Icon>}
            onClick={performSearch}/>
        </HStack>
        {searchMode === "searching" && <Spinner />}
        {searchMode === "done" &&
          (searchResultsGames.length > 0 ?
            <GameList heading={'Results'} games={searchResultsGames}></GameList> :
            <Heading size={'sm'}>No Games Found</Heading>)}


      </VStack>
      <GameList heading={"Play Now"} games={availableGames}></GameList>
      <GameList heading={"Games Played"} games={gamesPlayed}></GameList>
    </ResponsiveCenteredFlex>
  );
}

function ResponsiveCenteredFlex(props) {
  const screenType = useBreakpointValue({base:"mobile", md:"desktop"});

  return (
    <Center my={{base:'4', md:'20'}}>
      {screenType === "mobile" ?
        <VStack>
          {props.children}
        </VStack> :
        <Flex w={{base:'90%', md:'70%'}} direction={'row'} justify={'space-between'} wrap={'wrap'}>
        {props.children}
        </Flex>}
    </Center>
  );
}
