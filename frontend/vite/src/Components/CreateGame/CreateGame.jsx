import * as React from 'react';
import {BackendActor} from '../../Server/BackendActor/backend-actor';
import CreateQuestion from '../CreateQuestion/CreateQuestion';
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";



import { VStack, Text, Heading, Input, Flex, Button, Center, Textarea, Icon, Spinner, Switch, Box, Tooltip} from '@chakra-ui/react';
import {AiOutlineUpload, AiOutlineQuestionCircle} from 'react-icons/ai'


import {usePrompt} from '../../Hooks/routerBlocks.js'

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
  const [isNavigationOK, setIsNavigationOK] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [isDatepicker, setIsDatepicker] = React.useState(false);

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

  usePrompt("If you leave the page, your data will not be saved", !isNavigationOK);

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
          <VStack align={'start'} w={'100%'}>
          <Flex w={'100%'} direction={'row'} align={'center'}>
            
            <Text fontSize={'lg'} w={'auto'} mr={'5'}>
              Deadline:
            </Text>
            <Switch onChange={(event) => {
              setIsDatepicker(event.target.checked);
              }}></Switch>
            <Tooltip hasArrow
              label='The game will be open until midnight PST on the date selected'
              bg='gray.300' color='black'>
              <Box ml={'2'} as={'span'}><Icon as={AiOutlineQuestionCircle}></Icon></Box>
            </Tooltip>
          </Flex>
          {isDatepicker && <Box 
            borderColor={'gray.500'}
            borderWidth={'1px'}
            borderRadius={'md'}
            p={'2px'}>
            <DatePicker border={'1px solid black'} selected={startDate} onChange={(date) => setStartDate(date)} />
          </Box>}
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
            const message = await BackendActor.uploadGame(
                                    BackendActor.prepareGameData(title, desc, questions, (isDatepicker ? startDate : null)));

            if(message === "Success"){
              await setIsNavigationOK(true);
              await new Promise(r => setTimeout(r, 500));
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
