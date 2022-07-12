/* eslint-disable react/prop-types */
import * as React from 'react';

import { VStack, Box, Heading, Text, Flex} from '@chakra-ui/react';


const formatConfig = {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
};

const formatter = new Intl.NumberFormat('en-US', formatConfig);

function pointsFromCelerity(celerity) {
  return 10 + Math.floor(Math.sqrt(celerity) / 0.1);
}

export default function QuestionResult(props) {
  return (
    <Flex direction={'column'} w={'400px'} bg={'gray.300'} px={'5'} py={'5'} align={'start'} shadow={'md'}>
      <Heading size={'md'} mb={'5'}>
        {'Result for Question #'}
        {props.results.question.attributes.questionNumber}
        {` : ${props.results.isCorrect ? "Correct" : "Incorrect"}`}
      </Heading>
      <Text>
        {'Celerity: '}
        {formatter.format(props.results.celerity)}
      </Text>
      <Text>
        {'Points: '}
        {props.results.points}
      </Text>
      <Text>
        {'Given Answer: '}
        {props.results.givenAnswer}
      </Text>
      <Text>
        {'Acceptable Answers: '}
      </Text>
      <Box ms={'10%'}>
        <Text>
          {props.results.question.attributes.answers.join(', ')}
        </Text>
      </Box>
      
    </Flex>
  )
}
