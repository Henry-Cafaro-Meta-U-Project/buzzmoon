import * as React from 'react';
import { useParams } from 'react-router-dom';
import BackendActor from '../BackendActor/backend-actor';

import { Spinner, Center, Tooltip, Heading, Table, Thead, Tbody, Tr, Th, Td, Icon,
        TabList, Tabs, Tab, TabPanels, TabPanel, VStack, Box, HStack, Text, Button,
        Popover, PopoverBody, PopoverContent, PopoverTrigger, PopoverArrow,
        PopoverHeader, PopoverCloseButton} from '@chakra-ui/react';
import {AiFillTrophy, AiOutlineQuestionCircle, AiOutlineCheck, AiOutlineClose, AiOutlineDash} from 'react-icons/ai'

import { TiEquals } from "react-icons/ti";

const formatConfig = {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
};

const formatter = new Intl.NumberFormat('en-US', formatConfig);

export default function Results(props) {
  const {gameID} = useParams();
  const [gameData, setGameData] = React.useState();
  const [results, setResults] = React.useState([]);


  React.useEffect(() => {
    const updateGameData = async () => {
      const fetchedGameData = await BackendActor.getGameMetadata(gameID);
      setGameData(fetchedGameData);


      // here we should validate if the user has played the game, or if they should be kicked from results page

      const playerResults = await BackendActor.fetchGameResults(gameID);
      setResults(playerResults);
    }

    updateGameData();
  }, []);

  const standardTable = BackendActor.resultsToStandardTable(results);
  const bestBuzzesTable = BackendActor.resultsToBestBuzzesTable(results);
  const headToHeadTable = BackendActor.resultsToHeadToHeadTable(results);

  if (! gameData) {
    return (
      <Center mt={'20'}>
      <Spinner />
      </Center>
    )
  }

  return (
    <Center mt={'20'}>

      <VStack w={{sm:"95vw", md: "75vw", lg:"60vw"}} align={'center'} overflowX={'auto'}>
        <Heading borderBottom={'1px solid black'} mb={'10'}>
        {`${gameData.title}`}
        </Heading>
        <Tabs w={{base:"95vw", sm: "95vw", md:"100%"}} size='md' variant='enclosed' colorScheme={'black'}>
        <TabList>
          <Tab>
          <HStack align={'start'}>
            <Text>Standard</Text>
            <Tooltip hasArrow
              label='Players are ranked by points scored'
              bg='gray.300' color='black'>
              <Box ml={'2'} as={'span'}><Icon as={AiOutlineQuestionCircle}></Icon></Box>
            </Tooltip>
          </HStack>
        </Tab>
        <Tab>
          <HStack align={'start'}>
            <Text>Head to Head</Text>
            <Tooltip hasArrow
              label='Players are ranked by the results of simulated games against each other'
              bg='gray.300' color='black'>
              <Box ml={'2'} as={'span'}><Icon as={AiOutlineQuestionCircle}></Icon></Box>
            </Tooltip>
          </HStack>
        </Tab>
        <Tab>
          <HStack align={'start'}>
            <Text>Best Buzzes</Text>
            <Tooltip hasArrow
              label='View the fastest buzzes for each question'
              bg='gray.300' color='black'>
              <Box ml={'2'} as={'span'}><Icon as={AiOutlineQuestionCircle}></Icon></Box>
            </Tooltip>
          </HStack>
        </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <StandardTable table={standardTable}/>
          </TabPanel>
          <TabPanel>
            <HeadToHeadTable table={headToHeadTable}/>
          </TabPanel>
          <TabPanel>
            <BestBuzzesTable table={bestBuzzesTable} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      </VStack>
    </Center>
  )
}

function StandardTable(props) {
  return (
    <Table variant={'striped'} maxW={'min(600px, 100%)'}>
      <Thead>
        <Tr>
          <Th>Rank</Th>
          <Th>Name</Th>
          <Th>Points</Th>
          <Th># Correct</Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.table.map((e, idx) => (
          <Tr key={idx}>
            <Td><Center>{trophyIcon(idx+1)}{idx+1}</Center></Td>
            <Td>{e.name}</Td>
            <Td isNumeric>{e.points}</Td>
            <Td isNumeric>{e.numCorrect}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

function HeadToHeadTable(props) {
  return (
    <Table w={'100%'} variant={'simple'} maxW={'600px'}>
      <Thead>
        <Tr>
          <Th>Player</Th>
          <Th>Record</Th>
          <Th>Win %</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.table.map((e, idx) => (
          <Tr key={idx} backgroundColor={((1+idx%2)) === 1 ? "gray.100" : "white"}>
            <Td>{trophyIcon(idx+1)} {e.name} </Td>
            <Td>{`${e.w}-${e.l}-${e.t}`}</Td>
            <Td isNumeric>{formatter.format(e.percentage)}</Td>
            <Td>
              <Popover >
                <PopoverTrigger>
                  <Button colorScheme={'blue'}>Details</Button>
                </PopoverTrigger>
                <PopoverContent w={'fit-content'}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Table variant={'unstyled'} key={e.name}>
                      <Thead>
                        <Tr bg={'white'}>
                          <Th></Th>
                          <Th>Opponent</Th>
                          <Th>Score</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {e.outcomes.map((o, idx) => (
                          <Tr key={Math.random() + e.name + idx + o.oppName}>
                            <Td>
                              {o.res === "win" &&
                                <Icon color={'green'} fontWeight={'2xl'} as={AiOutlineCheck}></Icon>}
                              {o.res === "loss" &&
                                <Icon color={'red'} fontWeight={'2xl'} as={AiOutlineClose}></Icon>}
                              {o.res === "tie" &&
                                <Icon fontWeight={'2xl'}  as={TiEquals}></Icon>}

                            </Td>
                            <Td>{o.oppName}</Td>
                            <Td whiteSpace={'no-wrap'}>{`${o.score}-${o.oscore}`}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Td>
          </Tr>)
        )}
      </Tbody>
    </Table>
  );
}

function BestBuzzesTable(props) {
  return (
    <Table w={'100%'}variant={'striped'} maxW={'800px'}>
      <Thead>
        <Tr>
          <Th>#</Th>
          <Th>Answer</Th>
          <Th>Player</Th>
          <Th>Points</Th>
          <Th>Celerity</Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.table.map((e, idx) => (e ?
          (<Tr key={idx}>
            <Td>{idx+1}</Td>
            <Td>{e.givenAnswer}</Td>
            <Td>{e.player}</Td>
            <Td isNumeric>{e.points}</Td>
            <Td isNumeric>{formatter.format(e.celerity)}</Td>
          </Tr>) :
          <Tr key={idx}>
            <Td>{idx+1}</Td>
            <Td>No Answers</Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

function trophyIcon(rank) {
  if(rank == 1){
    return <Icon mx={'2'} fontSize={'xl'} color={'gold'} as={AiFillTrophy}></Icon>
  }
  if(rank == 2){
    return <Icon mx={'2'} fontSize={'xl'} color={'silver'} as={AiFillTrophy}></Icon>
  }
  if(rank == 3){
    return <Icon mx={'2'} fontSize={'xl'} color={'orange.500'} as={AiFillTrophy}></Icon>
  }
}
