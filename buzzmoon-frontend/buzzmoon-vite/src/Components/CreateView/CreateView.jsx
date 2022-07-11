import * as React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import { VStack, Box, Heading, Spinner, Center, Button, Text} from '@chakra-ui/react';
import BackendActor from '../BackendActor/backend-actor';

import CreateGame from '../CreateGame/CreateGame';
import GameListItem from '../GameListItem/GameListItem';
import GameList from '../GameList/GameList';

export default  function CreateView(props) {
  const [availableGames, setAvailableGames] = React.useState();

  React.useEffect(() => {
    const fetchGames = async () => {
      const games = await BackendActor.getCreatedGames();
      setAvailableGames(games);
    }
    
    fetchGames();
  }, []);

  return (
      <Routes>
        <Route path="/" element={
          <Center>
            <Box mt={'10'}>
              <VStack spacing={'8'}>
                <GameList heading={'Created Games'} games={availableGames}></GameList>
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