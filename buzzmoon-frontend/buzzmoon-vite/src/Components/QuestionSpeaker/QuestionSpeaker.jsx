import * as React from 'react';
import BackendActor from '../BackendActor/backend-actor';

import { Box, Button, Spinner, Icon, HStack} from '@chakra-ui/react';
import {AiFillSound} from 'react-icons/ai'


export default function QuestionSpeaker(props) {
  let [isLoading, setIsLoading] = React.useState("loading");
  
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
        <HStack spacing={'5'}>
          <Button type="button" colorScheme={'red'} onClick={buzz}>Buzz</Button> 
          <Icon fontSize={'64'} as={AiFillSound}></Icon></HStack>}
    </Box>
  );
}
