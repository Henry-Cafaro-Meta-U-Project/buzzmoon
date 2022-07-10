import * as React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import BackendActor from '../BackendActor/backend-actor';

import { VStack, Box, Heading, Flex, Center, Button, Text, Spinner} from '@chakra-ui/react';

export default function GameSplashPage() {
  const {gameID} = useParams();
  const navigate = useNavigate();

  const [enterMode, setEnterMode] = React.useState("loading");
  const [gameData, setGameData] = React.useState();

  React.useEffect(() => {
    const checkEntryMode= async () => {
      const response = await BackendActor.checkEntryMode(gameID);
      setEnterMode(response.mode);
    }

    const getGameData = async () => {
      const gameData = await BackendActor.getGame(gameID);
      console.log("🚀 ~ file: GameSplashPage.jsx ~ line 22 ~ getGameData ~ gameData", gameData)
      setGameData(gameData);
    }

    checkEntryMode();
    getGameData();
  }, []);

  return (
    <Center>
      <Box mt={'20'}>
        {enterMode === "loading" && <Spinner />}
        {enterMode === "play" && 
          <Button 
            onClick={async () => {
              try {
                const response = await BackendActor.registerGameEntry(gameID);
                navigate(`./play/${response.resultKey}`);
              } catch (error) {
                alert(error);
              }}}>
                Enter
          </Button>}
        {enterMode === "results" && 
          <Button 
            onClick={() => {
              navigate("./results");}}>
            Results
          </Button>}
      </Box>
    </Center>
  )
}
