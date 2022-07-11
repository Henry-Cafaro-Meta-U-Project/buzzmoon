import * as React from 'react';
import QuestionResult from '../QuestionResult/QuestionResult';
import QuestionSpeaker from '../QuestionSpeaker/QuestionSpeaker';
import { Navigate, useNavigate, useParams, useLocation} from 'react-router-dom';
import BackendActor from '../BackendActor/backend-actor';
import { VStack, Box, Heading, Flex, Center, Button, Input, HStack, Progress} from '@chakra-ui/react';

const gameConfig = {
  timeAfterBuzz: 6
}

export default function Game(props) {
  const {gameID, resultKey} = useParams();
  const navigate = useNavigate();
  const path = useLocation();

  const [gameData, setGameData] = React.useState({});
  const [questionNumber, setQuestionNumber] = React.useState(1);
  const [prevQuestionDetails, setPrevQuestionDetails] = React.useState(null);
  const [cumulativeScore, setCumulativeScore] = React.useState(0);

  const [buzzTimer, setBuzzTimer] = React.useState(0);
  const [buzzTimeout, setBuzzTimeout] = React.useState();

  const [answerInputText, setAnswerInputText] = React.useState('');
  const [buzzTimings, setBuzzTimings] = React.useState({ play: 0, buzz: 0, duration: 0 });

  const [readingMode, setReadingMode] = React.useState('waitforstrt');
  // modes are waitfornxt: wait for next question to be navigated to
  //           readactive: question audio is being read
  //           waitforstrt: wait for question audio to be read
  //           submitans: used to trigger answer submission
  //           waitforans: wait for user to type answer to question

  const processAnswer = async () => {
    let questionResults = await BackendActor.getQuestionResults(gameID, resultKey, questionNumber, answerInputText, buzzTimings);
    setCumulativeScore(cumulativeScore + questionResults.points);
    setPrevQuestionDetails(questionResults);
  };

  const handleAnswerSubmit = () => {
    setReadingMode("submitans");
  }

  const startBuzzTimer = () => {
    setBuzzTimer(0);
    const {timeAfterBuzz} = gameConfig;
    for(let i = 1; i <= timeAfterBuzz; i++){
      setTimeout(() => {setBuzzTimer(i)}, i*1000);
    }
    setBuzzTimeout(setTimeout(handleAnswerSubmit, timeAfterBuzz*1000));
  }

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

  React.useEffect(() => {
    if(readingMode === "submitans"){
      if(buzzTimeout){
        clearTimeout(buzzTimeout);
        setBuzzTimeout(0);
      }
      processAnswer();
      setAnswerInputText('');
      setReadingMode('waitfornxt');
    }
  }, [readingMode])

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
          <VStack align={'start'} mb={'20'} minW={'40%'}>
            <Box width={'400px'}></Box>
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
          {(readingMode === 'waitforstrt' || readingMode === 'readactive') && (
            <QuestionSpeaker
              gameID={gameID}
              questionNumber={questionNumber}
              buzzTimings={buzzTimings}
              setBuzzTimings={setBuzzTimings}
              readingMode={readingMode}
              setReadingMode={setReadingMode}
              startBuzzTimer={startBuzzTimer}
            />
            )}
          {(readingMode === 'waitforans')
                && (
                    <VStack ml={'0'} spacing={'5'} align={'start'}>
                    <HStack ms={'0'}>
                      <Input w={'100%'}
                        autoComplete={'off'}
                        id='answer-input'
                        placeholder={'answer'}
                        value={answerInputText}
                        onChange={(event) => {
                          setAnswerInputText(event.target.value);
                        }}
                        onKeyDown={(event) => {
                          if(event.key === 'Enter'){
                            handleAnswerSubmit();
                          }
                        }}/>
                      <Button 
                        onClick={handleAnswerSubmit} 
                        >Submit</Button>
                    </HStack>
                    <Progress colorScheme={'red'} value={buzzTimer} min={0} max={gameConfig.timeAfterBuzz} w={'400px'} hasStripe/>
                    </VStack>
                )}
          </VStack>
          {prevQuestionDetails && <QuestionResult results={prevQuestionDetails} />}
        </Flex>
      </VStack>
    </Center>
  )
}
