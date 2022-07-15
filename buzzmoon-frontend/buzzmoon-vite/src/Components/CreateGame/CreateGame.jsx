import * as React from 'react';
import BackendActor from '../BackendActor/backend-actor';
import CreateQuestion from '../CreateQuestion/CreateQuestion';
import { useNavigate } from "react-router-dom";

import { VStack, Text, Heading, Input, Flex, Button, Center, Textarea, Icon, Spinner} from '@chakra-ui/react';
import {AiOutlineUpload} from 'react-icons/ai'


let uniqueQuestions = 0;

// this function used for the purpose of giving each question box a unique key
// so React preserves state correctly
const getUniqueKey = () => {
  uniqueQuestions += 1;
  return uniqueQuestions;
};

export default function CreateGame() {
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [questions, setQuestions] = React.useState([]);
  const [isUploading, setIsUploading] = React.useState(false);

  const navigate = useNavigate();

  const deleteQuestion = (questionNumber) => {
    setQuestions(questions.filter((e) => (e.number !== questionNumber))
      .map((e, idx) => ({ ...e, number: idx + 1 })));
  };

  const modifyQuestion = (questionNumber, newQuestion) => {
    setQuestions(questions.filter((e) => (e.number !== questionNumber))
      .concat([newQuestion])
      .sort((a, b) => (a.number < b.number ? -1 : 1)));
  };

  return (
    <Center mb={'10'}>
    <VStack w={{base:"95%", md:'80%'}} mt={{base:'4', md:'20'}} spacing={'10'}>
      <VStack w={{base:"90%", md:'60%'}} spacing={'5'}>
        <Heading mb={'5'}>
          New Game
        </Heading>
        <VStack w={'100%'} >
          <Flex w={'100%'} direction={'row'} align={'center'}>
            <Text fontSize={'lg'} w={'auto'} mr={'5'}>
              Title:
            </Text>
            <Input
              borderColor={'gray.500'}
              maxW={'50%'}
              placeholder="Enter Title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); }}></Input>
          </Flex>
          <VStack w={'100%'} align={'start'}>
            <Text fontSize={'lg'}>Description:</Text>
            <Textarea
              borderColor={'gray.500'}
              name="description"
              placeholder="Enter Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}/>
          </VStack>
        </VStack>
      </VStack>
      <VStack w={{base:"90%", md:'60%'}} spacing={'8'}>
        <Flex w={'100%'}><Heading size={'lg'}>Questions</Heading></Flex>
        {questions.map((q) => (
            <CreateQuestion
              key={q.id}
              question={q}
              questions={questions}
              setQuestions={setQuestions}
              deleteQuestion={deleteQuestion}
              modifyQuestion={modifyQuestion}
            />
          ))}
          <Button
            leftIcon={<i className="fa-solid fa-plus"></i>}
            size={'lg'}
            onClick={() => {
              setQuestions(questions.concat(
                [{
                    id: getUniqueKey(),
                    number: questions.length + 1,
                    answers: '',
                    audioFile: null,
                  },],));
              }}>
            Add Question
          </Button>
      </VStack>
      {isUploading ? <Spinner /> :
        <Button
          leftIcon={<Icon fontSize={'24'} as={AiOutlineUpload}></Icon>}
          size={'lg'}
          colorScheme={'blue'}
          onClick={async () => {
            setIsUploading(true);
            const message = await BackendActor.uploadGame(BackendActor.prepareGameData(title, desc, questions));
            if(message === "Success"){
              navigate("/compete");
            }
            setIsUploading(false);
          }}>
        Upload to Server
      </Button>}
    </VStack>
    </Center>
  );
}
