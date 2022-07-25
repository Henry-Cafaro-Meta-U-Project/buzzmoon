import * as React from 'react';
import { 
  useNavigate} from 'react-router-dom';

import GlobalFormatter from '../../Logic/GlobalFormatter';

import { VStack, IconButton, Flex, Icon, Text, Tooltip, Box} from '@chakra-ui/react';
import { BsHourglassSplit } from "react-icons/bs";
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
        <Flex>
          <Text fontWeight={'bold'}>{props.game.title} </Text>
          {props.game.endDate && <Tooltip 
            label={GlobalFormatter.gameEndDateBlurb(props.game.endDate)}
            bg='gray.300' color='black'>
            <Box ml={'2'} as={'span'}><Icon as={BsHourglassSplit}></Icon></Box>
          </Tooltip>}
        </Flex>
        <Text mr={'5'}>{props.game.authorName} </Text>
      </VStack>
      <VStack align={'end'}>
        <IconButton
          colorScheme={'white'}
          color={'black'}
          onClick={() => {
            navigate(`/compete/${props.game.gameID}`);}}
          icon={<Icon fontSize={'24px'} as={IoEnterOutline}></Icon>} />
        
      </VStack>
    </Flex>
    </VStack>
  )
}
