import * as React from 'react';
import { useParams } from 'react-router-dom';
import {BackendActor} from '../../Server/BackendActor/backend-actor';
import ResultsEngine from '../../Logic/ResultsEngine';

import { Spinner, Center, Tooltip, Heading, Table, Thead, Tbody, Tr, Th, Td, Icon,
        TabList, Tabs, Tab, TabPanels, TabPanel, VStack, Box, HStack, Text, Button,
        Popover, PopoverBody, PopoverContent, PopoverTrigger, PopoverArrow,
         PopoverCloseButton} from '@chakra-ui/react';
import {AiFillTrophy, AiOutlineQuestionCircle, AiOutlineCheck, AiOutlineClose, AiOutlineDash} from 'react-icons/ai'

import { TiEquals } from "react-icons/ti";

const formatConfig = {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
};

const formatter = new Intl.NumberFormat('en-US', formatConfig);

export default function Results(props) {
  const {gameID} = useParams();
  const [gameData, setGameData] = React.useState();
  console.log("🚀 ~ file: Review.jsx ~ line 24 ~ Results ~ gameData", gameData)
  const [results, setResults] = React.useState([]);
  console.log("🚀 ~ file: Review.jsx ~ line 25 ~ Results ~ results", results)


  React.useEffect(() => {
    const updateGameData = async () => {
      const fetchedGameData = await BackendActor.getGameMetadata(gameID);
      setGameData(fetchedGameData);


      // here we should validate if the user has played the game, or if they should be kicked from results page

      const playerResults = await BackendActor.fetchAuthorResults(gameID);
      setResults(playerResults);
    }

    updateGameData();
  }, []);

  if (! gameData) {
    return (
      <Center mt={'20'}>
      <Spinner />
      </Center>
    )
  }

  return (
    <Center mt={'20'}>

      
    </Center>
  )
}


