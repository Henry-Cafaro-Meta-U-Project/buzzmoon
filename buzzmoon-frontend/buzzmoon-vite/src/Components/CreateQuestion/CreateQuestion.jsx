import * as React from 'react';

import { Box, IconButton, Text, VStack, Flex, Icon, Center, Textarea, HStack} from '@chakra-ui/react';
import {AiOutlineClose} from 'react-icons/ai'


export default function CreateQuestion(props) {
  console.log("🚀 ~ file: CreateQuestion.jsx ~ line 8 ~ CreateQuestion ~ props", props)
  const [questionAudio, setQuestionAudio] = React.useState();
  const [playingMode, setPlayingMode] = React.useState('no audio');
  // options are "no audio", "playing", "paused"

  React.useEffect(() => {
    if (props.question.audioFile) {
      const newAudio = new Audio(URL.createObjectURL(props.question.audioFile));
      newAudio.onended = () => { setPlayingMode('paused'); };
      setQuestionAudio(newAudio);
    }
  }, [props.question.audioFile]);

  const handleUploadFile = (e) => {
    setPlayingMode('paused');
    props.modifyQuestion(
      props.question.number,
      { ...props.question, audioFile: (e.target.files[0]) },
    );
  };

  return (
    <VStack w={'100%'}
      bg={'gray.50'}
      shadow={'md'}
      spacing={'5'}
      padding={'3'}
      border={'1px solid black'}
      borderRadius={'md'} >
      <Flex w={'100%'} justify={'space-between'} align={'center'}>
        <Text fontWeight={'bold'} >Question #
          {props.question.number}
        </Text>
        <HStack spacing={'0'} maxW={'50%'}>
          {questionAudio
                && (playingMode === 'paused'
                  ? (
                    <IconButton
                      fontSize={'lg'}
                      variant={'outline'}
                      onClick={() => {
                        setPlayingMode('playing');
                        questionAudio.play();
                      }}
                      icon={<i className="fa-solid fa-play"/>} />
                  )
                  : (
                    <IconButton
                      fontSize={'lg'}
                      variant={'outline'}
                      onClick={() => {
                        setPlayingMode('paused');
                        questionAudio.pause();
                      }}
                      icon={<i className="fa-solid fa-pause"/>} />
                  )
                )}
        <input type="file" name="audio-file" accept=".mp3, .m4a" onChange={handleUploadFile} title="Choose an .mp3 or .m4a" />
        </HStack>
        <IconButton
          variant={'ghost'}
          type="button"
          name="delete-question-button"
          onClick={() => {
            props.deleteQuestion(props.question.number);
          }}
          icon={<Icon fontSize={'32'} as={AiOutlineClose}></Icon>}/>
      </Flex>
      <Textarea
          borderColor={'gray.500'}
          placeholder="Enter answers as a comma separated list, i.e: gold, aurum, pyrite"
          value={props.question.answers}
          onChange={(e) => {
            props.modifyQuestion(
              props.question.number,
              { ...props.question, answers: (e.target.value) },
            );
          }}
        />
    </VStack>
  )
}
