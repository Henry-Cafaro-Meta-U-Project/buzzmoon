import * as React from 'react';


import {
  Flex,
  Heading,
  Center,
  HStack,
  IconButton,
  Show,
  Text
} from '@chakra-ui/react';

export default function Footer(props) {

  return (
    <Center w={'100%'} h={'4rem'} right={'0rem'} >
      <Flex color={'white'} bg={'black'} w={'96%'} h={'80%'} top="0rem" right="0rem" align="center" shadow={'md'} px={'5'}>
        <Flex minW={'100%'} direction={'row'} justify={'end'} align={'center'}>
            <Text size={'md'}>For issues or bugs, contact: hjcafaro@uchicago.edu</Text>
        </Flex>
      </Flex>
    </Center>
  )
}
