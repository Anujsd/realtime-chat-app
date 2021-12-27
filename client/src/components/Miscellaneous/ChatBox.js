import React from 'react';
import { ChatState } from '../../context/chatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      d={{ base: selectedChat ? 'flex' : 'none', sm: 'flex' }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="#222831"
      color="white"
      w={{ base: '100%', sm: '70%' }}
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
