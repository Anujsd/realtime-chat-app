import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getSender } from '../../config/ChatLogics';
import { ChatState } from '../../context/chatProvider';
import ChatLoading from './ChatLoading';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } =
    ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('/api/chat', config);
      setChats(data);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error Occured',
        description: 'Failed to load chats ',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? 'none' : 'flex', sm: 'flex' }}
      flexDirection="column"
      alignItems="center"
      bg="white"
      w={{ base: '100%', sm: '40%', md: '30%' }}
      borderWidth="1px"
    >
      <Box
        p={3}
        fontSize={{ base: '15px', sm: '20px' }}
        fontFamily="open sans"
        d="flex"
        w="100%"
        justifyContent="space-Between"
        alignItems="center"
        flexWrap="wrap"
      >
        <div style={{ padding: '2px' }}>My Chats</div>
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: '10px', sm: '15px' }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDirection="column"
        overflowY="hidden"
        bg="#f8f8f8"
        w="100%"
        h="100%"
      >
        {chats ? (
          <Stack overflowY="scroll" marginTop={0}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={4}
                key={chat._id}
                style={{ margin: '1px' }}
                _hover={{ background: '#BEBEBE' }}
              >
                <Text margin={0}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + '...'
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
