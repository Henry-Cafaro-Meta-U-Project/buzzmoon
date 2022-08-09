import * as React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {BackendActor} from '../../Server/BackendActor/backend-actor';
import GlobalFormatter from '../../Logic/GlobalFormatter';


import { VStack, Box, Heading, Flex, Center, Button, Text, Spinner} from '@chakra-ui/react';

export default function GameSplashPage() {
  const {gameID} = useParams();
  const navigate = useNavigate();

  const [enterModes, setEnterModes] = React.useState([]);
  const [gameData, setGameData] = React.useState(undefined);

  React.useEffect(() => {
    const checkEntryMode= async () => {
      const response = await BackendActor.checkEntryMode(gameID);
      setEnterModes(response.modes);
    }

    const getGameData = async () => {
      const gameData = await BackendActor.getGame(gameID);
      setGameData(gameData);
    }

    checkEntryMode();
    getGameData();
  }, []);

  return (
    <Center mt={{base:'20', md:'20'}}>
        <VStack spacing={{base:'60px', md:'60px'}}>
        {!gameData ? <Spinner/ > :
        <VStack spacing={'8'} bg={'gray.200'} p={'5'} borderRadius={'md'} shadow={'md'} maxW={'96%'}>
          <Center>
            <Heading size={'xl'} borderBottom={'1px solid black'} mx={{base: '0', md: '20'}}>{gameData.title}</Heading>
          </Center>
          <Flex w={'100%'} direction={'row'} justify={'space-between'}>
            <VStack spacing={'2'} align={'start'}>
              <Heading size={'sm'}>Created by {gameData.authorName}</Heading>
              <Heading size={'sm'}>{gameData.createdAt.toLocaleDateString("en-US")}</Heading>
              {gameData.endDate &&
                <Heading size={'sm'}>{GlobalFormatter.gameEndDateBlurb(gameData.endDate)}</Heading>
              }
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
        <Flex w={{base:"100%", md:"90%"}} justifyContent={'space-around'}>
          {enterModes.length === 0 && <Spinner />}
          {enterModes.includes("play") &&
            <Button
              width={{base:"30%", md:'25%'}}
              onClick={async () => {
                try {
                  const response = await BackendActor.registerGameEntry(gameID);
                  navigate(`./play/${response.resultKey}`);
                } catch (error) {
                  alert(error);
                }}}>
                  <Text fontSize={{base:'xs', md:'sm'}}>Enter</Text>
            </Button>}
          {enterModes.includes("results") &&
            <Button
              width={{base:"30%", md:'25%'}}
              onClick={() => {
                navigate("./results");}}>
              <Text fontSize={{base:'xs', md:'sm'}}>Results</Text>
            </Button>}
          {enterModes.includes("review") &&
            <Button
              width={{base:"30%", md:'25%'}}
              onClick={() => {
                navigate("./review");}}>
              <Text fontSize={{base:'xs', md:'sm'}}>Review Answers</Text>
            </Button>}
        </Flex>
        
        </VStack>
    </Center>
  )
}
