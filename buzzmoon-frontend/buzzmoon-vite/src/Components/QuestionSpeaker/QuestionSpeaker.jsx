import * as React from 'react';
import BackendActor from '../BackendActor/backend-actor';

import { Box, Button, Spinner, Icon, HStack, VStack, Progress} from '@chakra-ui/react';
import {AiFillSound} from 'react-icons/ai'


export default function QuestionSpeaker(props) {
  const [isLoading, setIsLoading] = React.useState("loading");
  const [audioProgressTicks, setAudioProgressTicks] = React.useState(0);
  
  const audioRef = React.useRef();

  React.useEffect(() => {
    const updateAudio = async () => {
      setIsLoading("loading");
      const audioURL = await BackendActor.getServerAudioURL(props.gameID, props.questionNumber);
      audioRef.current = await new Audio(audioURL);
      await audioRef.current.load();
      setIsLoading("ready");
    }

    updateAudio();
  }, [props.questionNumber]);


  const play = async () => {
    await audioRef.current.play();
    props.setBuzzTimings(
      { ...props.buzzTimings, duration: audioRef.current.duration, play: Date.now() },
    );
    const duration = audioRef.current.duration;
      for(let i = 1; i <= 20; i++){
        setTimeout(() => {setAudioProgressTicks(i)}, i * duration * 50);
      }
    props.setReadingMode('readactive');
  };

  const buzz = () => {
    audioRef.current.pause();
    audioRef.current.muted = true;
    props.setBuzzTimings(
      { ...props.buzzTimings, duration: audioRef.current.duration, buzz: Date.now() },
    );

    props.setReadingMode('waitforans');
    props.startBuzzTimer();
  };


  return (
    <Box>
      {(isLoading === "loading") && <Spinner />}
      {(props.readingMode === 'waitforstrt' && isLoading === "ready") && <Button onClick={play}>Play Question Audio</Button>}
      {(props.readingMode === 'readactive' && isLoading === "ready") && 
        <VStack align={'start'}>
          <HStack spacing={'5'}>
            <Button type="button" colorScheme={'red'} onClick={buzz}>Buzz</Button> 
            <Icon fontSize={'64'} as={AiFillSound}></Icon>
          </HStack>
          <Progress w={'400px'} min={0} max={20} value={audioProgressTicks} hasStripe/>
        </VStack>}
    </Box>
  );
}
