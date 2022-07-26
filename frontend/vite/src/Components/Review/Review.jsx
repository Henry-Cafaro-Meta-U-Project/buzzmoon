import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [isUploading, setIsUploading] = React.useState(false);

  const navigate = useNavigate();

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
      <VStack align={'start'} bg={'gray.200'} padding={'10px'} spacing={'5'}>
        <VStack spacing={'5'} align={'start'}>
        <Heading>Changes</Heading>
        {(changes.length === 0 && !isUploading) ? null : (
          <Button colorScheme={'blue'} size={'xs'}
            onClick={async () => {
              setIsUploading(true);
              await BackendActor.pushAuthorChanges(gameID, changes);
              navigate(0)}}>Push Changes</Button>
        )}
        {isUploading && <Spinner />}
        </VStack>
        {changes.length === 0 ? <Text>No changes so far.</Text> : 
        (changes.map((e, idx) => (
          <VStack align={'end'} w={'100%'}
            key={idx.toString() + e.questionNumber.toString() + e.answer.toString() + e.ruling}>
            <VStack w={'100%'} align={'start'}>
              <Text>
              Q{e.questionNumber} {' given answer: '} {truncateString(e.answer, 20)} 
              </Text> 
              <Flex w={'100%'} justify={'space-between'}>
                <Text>{"new ruling: "} {e.ruling === "correct" ? "Correct" : "Incorrect"} </Text>
                  <Button size={'xs'} color={'white'} bg={'black'} _hover={{color:"black", bg: "white"}}
                  onClick={() => {
                    setChanges(changes.filter((x) => (x !== e)));
                  }}>
                  Remove
                </Button>
              </Flex>
            </VStack>
            
          </VStack>
        )))}
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
  let finalAnswers = givenAnswers.filter((e) => (e.isFinal))
  finalAnswers = finalAnswers.filter((e, idx) => (idx === finalAnswers.findIndex((x) => (x.givenAnswer === e.givenAnswer))));

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
          {finalAnswers.map((a, idx) => (
            <VStack align={'start'}  w={'100%'} key={idx}
              border={'1px solid black'}
              padding={'5px'}
              bg={'gray.200'}>
            <Text textOverflow={'clip'} maxW={'100%'} size={'xs'}>Answer: "{truncateString(a.givenAnswer, 50)}"</Text>
            <Text size={'xs'}>Final Ruling: {a.isCorrect ? "Correct" : "Incorrect"}</Text>
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