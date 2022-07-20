import * as React from 'react';
import { useParams } from 'react-router-dom';
import BackendActor from '../BackendActor/backend-actor';

import { Spinner, Center, Flex, Heading, Table, Thead, Tbody, Tr, Th, Td, Icon, TabList, Tabs, Tab, TabPanels, TabPanel} from '@chakra-ui/react';
import {AiFillTrophy} from 'react-icons/ai'

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

  if (! gameData) {
    return (
      <Center mt={'20'}>
      <Spinner />
      </Center>
    )
  }

  return (
    <Center mt={'20'}>

      <Flex direction={'column'} align={'center'}>
        <Heading borderBottom={'1px solid black'} mb={'10'}>
        {`${gameData.title}`}
        </Heading>
        <Tabs size='md' variant='enclosed' colorScheme={'black'}>
        <TabList>
          <Tab>Standard</Tab>
          <Tab>Head 2 Head</Tab>
          <Tab>Best Buzzes</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <StandardTable table={standardTable}/>
          </TabPanel>
          <TabPanel>

          </TabPanel>
          <TabPanel>
            <BestBuzzesTable table={bestBuzzesTable} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      </Flex>
    </Center>
  )
}

function StandardTable(props) {
  return (
    <Table w={'100%'}variant={'striped'}>
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
            <Td><Center>{idx+1}{trophyIcon(idx+1)}</Center></Td>
            <Td>{e.name}</Td>
            <Td isNumeric>{e.points}</Td>
            <Td isNumeric>{e.numCorrect}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

function BestBuzzesTable(props) {
  return (
    <Table w={'100%'}variant={'striped'}>
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
            <Td><Center>{idx+1}{trophyIcon(idx+1)}</Center></Td>
            <Td>{e.name}</Td>
            <Td isNumeric>{e.points}</Td>
            <Td isNumeric>{e.numCorrect}</Td>
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
