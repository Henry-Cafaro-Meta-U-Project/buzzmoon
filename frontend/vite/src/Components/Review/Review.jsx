import * as React from 'react';
import { useParams } from 'react-router-dom';
import {BackendActor} from '../../Server/BackendActor/backend-actor';
import ResultsEngine from '../../Logic/ResultsEngine';

import { Spinner, Center, Select, Heading, Flex, Icon,
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
  const [results, setResults] = React.useState([]);
  console.log("🚀 ~ file: Review.jsx ~ line 25 ~ Results ~ results", results)
  const [selectedQuestion, setSelectedQuestion] = React.useState(1);
  const [changes, setChanges] = React.useState([]);

  const addChange = (change) => {
    setChanges(changes.concat([change]));
  }


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
    <Flex mt={'20'} mx={'5%'} direction={'row'} wrap={'wrap'} justify={'space-between'}>
      <VStack align={'start'} width={{sm:"100%", md:"70%"}}>
        <VStack align={'start'}>
        <Heading>{gameData.title}</Heading>
        <Heading size={'sm'}>Review Answers</Heading>
        <HStack>
            <Text>Question:</Text>
            <Select
                value={selectedQuestion}
                onChange={(event) => {setSelectedQuestion(event.target.value);}}>
                  {gameData.questions.map((e) => (
                    <option key={e.questionNumber} value={e.questionNumber}>Question #{e.questionNumber}</option>
                  ))}
                
            </Select>
        </HStack>
        <AnswerReviewBoard 
          gameData={gameData} 
          questionNumber={parseInt(selectedQuestion)} 
          results={results}
          addChange={addChange}/>
        </VStack>
      </VStack>
      <VStack mt={{base:"0", sm:"10", md:"0"}} align={{sm:"start", md:"end"}} width={{sm:"100%", md:"30%"}}>
      <VStack align={'start'} bg={'gray.200'} padding={'10px'} >
        <Heading>Changes</Heading>
        {changes.length === 0 ? <Text>No changes so far.</Text> : null}
      </VStack>
      </VStack>
    </Flex>
  )
}


function AnswerReviewBoard(props) {
  const initialAnswers = props.gameData.questions[props.questionNumber-1].answers;
  const givenAnswers = props.results.map((res) => (res.answers.find((q) => (q.questionNumber === props.questionNumber))))
                                    .filter((e) => (e ? true : false))
                                    .sort((a,b) => {
                                      if(a.isFinal && !b.isFinal){
                                        return 1;
                                      }
                                      if(!a.isFinal && b.isFinal){
                                        return -1;
                                      }
                                      return 0;
                                    });

  const answersToReview = givenAnswers.filter((e) => (! e.isFinal));
  const finalAnwers = givenAnswers.filter((e) => (e.isFinal));

  return (
      <VStack 
        paddingTop={'10px'}
        marginTop={'10px'}
        borderTop={'1px solid gray'} 
        w={'100%'} align={'start'}>
        <Heading size={'md'}>Question #{props.questionNumber}</Heading>
        <Heading size={'sm'}>Initial Answers: {initialAnswers.join(", ")}</Heading>
        <Heading size={'xs'}>For Review</Heading>
        <VStack align={'start'} spacing={'10px'}>
          {answersToReview.map((a, idx) => (
            <VStack 
              key={idx}
              w={'100%'}
              align={'start'} 
              border={'1px solid black'}
              padding={'5px'}
              bg={'gray.200'}>
              <Heading size={'xs'}>Answer: "{truncateString(a.givenAnswer, 50)}"</Heading>
              <Heading size={'xs'}>Ruling: {a.isCorrect ? "Correct" : "Incorrect"}</Heading>
            </VStack>
          ))}

        </VStack>
        <Heading size={'xs'}>Finalized</Heading>
        <VStack align={'start'} spacing={'10px'}>
          {finalAnwers.map((a, idx) => (
            <VStack 
              key={idx}
              w={'100%'}
              align={'start'} 
              border={'1px solid black'}
              padding={'5px'}
              bg={'gray.200'}>
              <Heading size={'xs'}>Answer: "{truncateString(a.givenAnswer, 50)}"</Heading>
              <Heading size={'xs'}>Ruling: {a.isCorrect ? "Correct" : "Incorrect"}</Heading>
            </VStack>
          ))}

        </VStack>
      </VStack>
  );
}

function truncateString(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}