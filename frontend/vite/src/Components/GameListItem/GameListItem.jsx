import * as React from 'react';
import { 
  useNavigate} from 'react-router-dom';


import { VStack, IconButton, Flex, Icon, Text} from '@chakra-ui/react';

import {IoEnterOutline} from "react-icons/io5"

export default function GameListItem(props) {
  const navigate = useNavigate();

  return  (
    <VStack
      p={'2'}
      w={'100%'}
      border={'1px solid black'}
      borderRadius={'xl'}
      boxShadow={'sm'}>
    <Flex w={'100%'} justify={'space-between'} align={'start'} >
      <VStack align={'start'} spacing={'4px'}>
        <VStack align={'start'} spacing={'0'}>
        <Text mr={'5'} fontWeight={'bold'}>{props.game.title} </Text>
        {props.game.endDate && <Text fontSize={'xs'}>ending {props.game.endDate.toLocaleString()}</Text>}
        </VStack>
        <Text mr={'5'}>{props.game.authorName} </Text>
      </VStack>
      <Flex justify={'end'}>
      <IconButton
        colorScheme={'white'}
        color={'black'}
        onClick={() => {
          navigate(`/compete/${props.game.gameID}`);}}
        icon={<Icon fontSize={'24px'} as={IoEnterOutline}></Icon>} />
      </Flex>
    </Flex>
    </VStack>
  )
}
