import * as React from 'react';
import { useParams } from 'react-router-dom';
import {BackendActor} from '../../Server/BackendActor/backend-actor';
import ResultsEngine from '../../Logic/ResultsEngine';

import { Spinner, Center, Select, Heading, Table, Thead, Tbody, Tr, Th, Td, Icon,
        TabList, Tabs, Tab, TabPanels, TabPanel, VStack, Box, HStack, Text, Button,
        Popover, PopoverBody, PopoverContent, PopoverTrigger, PopoverArrow,
         PopoverCloseButton} from '@chakra-ui/react';
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
  console.log("🚀 ~ file: Review.jsx ~ line 24 ~ Results ~ gameData", gameData)
  const [results, setResults] = React.useState([]);
  console.log("🚀 ~ file: Review.jsx ~ line 25 ~ Results ~ results", results)
  const [selectedQuestion, setSelectedQuestion] = React.useState(1);


  React.useEffect(() => {
    const updateGameData = async () => {
      const fetchedGameData = await BackendActor.fetchAuthorGameData(gameID);
      setGameData(fetchedGameData);

      const playerResults = await BackendActor.fetchAuthorResults(gameID);
      setResults(playerResults);
    }

    updateGameData();
  }, []);

  if (! results || ! gameData) {
    return (
      <Center mt={'20'}>
      <Spinner />
      </Center>
    )
  }

  return (
    <VStack mt={'20'} mx={'5%'} align={'start'}>
        <VStack align={'start'}>
        <Heading>{gameData.title}</Heading>
        <Heading size={'sm'}>Review Answers</Heading>
        <HStack>
            <Text>Question:</Text>
            <Select
                placeholder="Select Question"
                value={selectedQuestion}
                onChange={(event) => {setSelectedQuestion(event.target.value);}}>
                  {gameData.questions.map((e) => (
                    <option key={e.questionNumber} value={e.questionNumber}>Question #{e.questionNumber}</option>
                  ))}
                
            </Select>
        </HStack>
        </VStack>
      </VStack>
  )
}


