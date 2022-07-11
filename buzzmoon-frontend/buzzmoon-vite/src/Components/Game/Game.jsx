import * as React from 'react';
import QuestionResult from '../QuestionResult/QuestionResult';
import QuestionSpeaker from '../QuestionSpeaker/QuestionSpeaker';
import { Navigate, useNavigate, useParams, useLocation} from 'react-router-dom';
import BackendActor from '../BackendActor/backend-actor';
import { VStack, Box, Heading, Flex, Center, Button, Input, HStack, Icon} from '@chakra-ui/react';
import {AiFillSound} from 'react-icons/ai'

export default function Game(props) {
  const {gameID, resultKey} = useParams();
  const navigate = useNavigate();
  const path = useLocation();

  const [gameData, setGameData] = React.useState({});
  const [questionNumber, setQuestionNumber] = React.useState(1);
  const [prevQuestionDetails, setPrevQuestionDetails] = React.useState(null);
  const [cumulativeScore, setCumulativeScore] = React.useState(0);
  const [cumulativeResults, setCumulativeResults] = React.useState([]);
  const [buzzTimings, setBuzzTimings] = React.useState({ play: 0, buzz: 0, duration: 0 });
  const [answerInputText, setAnswerInputText] = React.useState('');
  const [readingMode, setReadingMode] = React.useState('waitforstrt');
  // modes are waitfornxt: wait for next question to be navigated to
  //           readactive: question audio is being read
  //           waitforstrt: wait for question audio to be read
  //           waitforans: wait for user to type answer to question

  const processAnswer = async () => {
    let questionResults = await BackendActor.getQuestionResults(gameID, resultKey, questionNumber, answerInputText, buzzTimings);
    setCumulativeScore(cumulativeScore + questionResults.points);
    setPrevQuestionDetails(questionResults);
  };

  React.useEffect(() => {
    const updateGameData = async () => {
      const fetchedGameData = await BackendActor.getGameMetadata(gameID);
      setGameData(fetchedGameData);
    }

    updateGameData();
  }, []);

  React.useEffect(() => {
    if(readingMode === 'waitforans'){
      document.getElementById('answer-input').focus();
    }
  }, [readingMode]);

  return (
    <Center>
      <VStack w={'80%'} spacing={'50px'} mt={'50px'}>
        <VStack w={'100%'} spacing={'20px'}>
          <Heading size={'2xl'}>{gameData.title}</Heading>
          <Flex w={'100%'} justify={'space-between'}>
            <Heading size={'xl'}>{`Question #${questionNumber}`}</Heading>
            <Heading size={'xl'}>{`Score: ${cumulativeScore}`}</Heading>
          </Flex>
        </VStack>
        <Flex w={'100%'} justify={'space-between'} wrap={'wrap'}>
          <HStack spacing={'14'} mb={'20'} minW={'40%'}>
          {(readingMode === 'waitfornxt') && (
            <Button
              onClick={() => {
                if(questionNumber == gameData.numQuestions){
                  navigate(`../${gameID}/results`);
                } else {
                  setQuestionNumber(questionNumber + 1);
                  setReadingMode('waitforstrt');
                }
              }}>
              Next
            </Button>
            )}
          {(readingMode !== 'waitfornxt') && (
            <QuestionSpeaker
              gameID={gameID}
              questionNumber={questionNumber}
              buzzTimings={buzzTimings}
              setBuzzTimings={setBuzzTimings}
              readingMode={readingMode}
              setReadingMode={setReadingMode}
            />
            )}
          {readingMode === 'readactive' && <Icon fontSize={'64'} as={AiFillSound}></Icon>}
          {(readingMode === 'waitforans')
                && (
                  <form style={{marginLeft: 0}}
                  autoComplete="off"
                  onSubmit={() => {
                    processAnswer();
                    setAnswerInputText('');
                    setReadingMode('waitfornxt');
                  }}>
                    <HStack ms={'0'}>
                      <Input w={'100%'}
                        id='answer-input'
                        placeholder={'answer'}
                        value={answerInputText}
                        onChange={(event) => {
                          setAnswerInputText(event.target.value);
                        }}
                      />
                      <Button type="submit">Submit</Button>
                    </HStack>
                  </form>
                )}
          </HStack>
          {prevQuestionDetails && <QuestionResult results={prevQuestionDetails} />}
        </Flex>
      </VStack>
    </Center>
  )
}
