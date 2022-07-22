import * as React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import BackendActor from '../../Server/BackendActor/backend-actor';

import { VStack, Box, Heading, Flex, Center, Button, Text, Spinner} from '@chakra-ui/react';

export default function GameSplashPage() {
  const {gameID} = useParams();
  const navigate = useNavigate();

  const [enterMode, setEnterMode] = React.useState("loading");
  const [gameData, setGameData] = React.useState(undefined);

  React.useEffect(() => {
    const checkEntryMode= async () => {
      const response = await BackendActor.checkEntryMode(gameID);
      setEnterMode(response.mode);
    }

    const getGameData = async () => {
      const gameData = await BackendActor.getGame(gameID);
      setGameData(gameData);
    }

    checkEntryMode();
    getGameData();
  }, []);

  return (
    <Center mt={{base:'20', md:'20'}} minW={'400px'}>
        <VStack spacing={{base:'60px', md:'60px'}}>
        {!gameData ? <Spinner/ > :
        <VStack spacing={'8'} bg={'gray.200'} p={'5'} borderRadius={'md'} shadow={'md'}>
          <Center>
            <Heading size={'xl'} borderBottom={'1px solid black'} mx={{base: '0', md: '20'}}>{gameData.title}</Heading>
          </Center>
          <Flex w={'100%'} direction={'row'} justify={'space-between'}>
            <VStack spacing={'2'} align={'start'}>
              <Heading size={'sm'}>Created by {gameData.authorName}</Heading>
              <Heading size={'sm'}>{gameData.createdAt.toLocaleDateString("en-US")}</Heading>
            </VStack>
            <VStack spacing={'2'} align={'end'}>
              <Heading size={'sm'}>{gameData.numQuestions} Questions</Heading>
            </VStack>
          </Flex>
          <Text width={'100%'} align={'left'}>
            {gameData.description}
          </Text>
        </VStack>
        }
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
          </VStack>
    </Center>
  )
}
