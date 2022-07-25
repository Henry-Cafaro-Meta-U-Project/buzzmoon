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
  const [selectedQuestion, setSelectedQuestion] = React.useState(1);
  const [changes, setChanges] = React.useState([]);
  console.log("🚀 ~ file: Review.jsx ~ line 27 ~ Results ~ changes", changes)

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
        <VStack align={'start'} w={{sm:'100%', md:"80%"}}>
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
          changes={changes}
          gameData={gameData} 
          questionNumber={parseInt(selectedQuestion)} 
          results={results}
          addChange={addChange}/>
        </VStack>
      </VStack>
      <VStack mt={{base:"0", sm:"10", md:"0"}} align={{sm:"start", md:"end"}} width={{sm:"100%", md:"30%"}}>
      <VStack align={'start'} bg={'gray.200'} padding={'10px'} >
        <Heading>Changes</Heading>
        {changes.length === 0 ? <Text>No changes so far.</Text> : 
        (changes.map((e, idx) => (
          <VStack key={idx.toString() + e.questionNumber.toString() + e.answer.toString() + e.ruling}>
            <Text>
              Q{e.questionNumber} {' '} {e.answer} {' -> '} {e.ruling === "correct" ? "Correct" : "Incorrect"}
            </Text>
          </VStack>
        )))}
      </VStack>
      </VStack>
    </Flex>
  )
}


function AnswerReviewBoard(props) {
  console.log("🚀 ~ file: Review.jsx ~ line 96 ~ AnswerReviewBoard ~ props", props)
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
        <VStack align={'start'} spacing={'10px'} w={'100%'}>
          {answersToReview.map((a, idx) => (
            <Flex
              justify={'space-between'}
              key={idx}
              w={'100%'}
              border={'1px solid black'}
              padding={'5px'}
              bg={'gray.200'}>
              <VStack align={'start'}  maxW={'70%'}>
                <Text textOverflow={'clip'} maxW={'100%'} size={'xs'}>Answer: "{truncateString(a.givenAnswer, 50)}"</Text>
                <Text size={'xs'}>Automatic Ruling: {a.isCorrect ? "Correct" : "Incorrect"}</Text>
              </VStack>
              <Flex wrap={'wrap'} justify={'end'} align={'space-around'}> 
                <Button size={'xs'} colorScheme={'green'}
                isDisabled={(props.changes.find((e) => (e.answer === a.givenAnswer)) ? true : false)}
                onClick={() => {
                  props.addChange({questionNumber:props.questionNumber, 
                                  answer:a.givenAnswer, 
                                  ruling:"correct"});}}>
                  Mark As Correct</Button>
                <Button size={'xs'} colorScheme={'red'}
                isDisabled={(props.changes.find((e) => (e.answer === a.givenAnswer)) ? true : false)}
                onClick={() => {
                  props.addChange({questionNumber:props.questionNumber, 
                                  answer:a.givenAnswer, 
                                  ruling:"incorrect"});}}>Mark As Incorrect</Button>
              </Flex>
            </Flex>
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