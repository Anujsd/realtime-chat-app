import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Spinner,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Search2Icon, ChevronDownIcon, BellIcon } from '@chakra-ui/icons';
import { ChatState } from '../../context/chatProvider';
import ProfileModal from './profileModal';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/toast';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge, { Effect } from 'react-notification-badge';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please Enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: 'Error Occured',
        description: 'failed to load search results',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      return;
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        '/api/chat',
        {
          userId,
        },
        config
      );
      if (!chats.find((c) => c._id === data._id)) {
        setChats([...chats, data]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Error Occured',
        description: 'failed to load search results',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      console.log(error);
      return;
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#393E46"
        w="100%"
        p="5px 10px 5px 10px"
        color="white"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="facebook" onClick={onOpen} p={2}>
            <Search2Icon />
            <Text d={{ base: 'none', sm: 'flex' }} px={2}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="4xl" fontFamily="open sans" fontWeight="bold">
          Chat App
        </Text>
        <div>
          <Menu>
            <MenuButton>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="xl" color="white" mt={1} size="sm" />
            </MenuButton>
            <MenuList bg="#222831">
              {!notification.length && (
                <MenuItem
                  _hover={{ bg: 'white', color: 'black' }}
                  _focus={{ bg: 'white', color: 'black' }}
                >
                  No New Messages
                </MenuItem>
              )}
              {notification.map((noti, i) => (
                <MenuItem
                  key={noti._id}
                  _hover={{ bg: 'white', color: 'black' }}
                  _focus={{ bg: 'white', color: 'black' }}
                  onClick={() => {
                    setSelectedChat(noti.chat);
                    setNotification(notification.filter((n) => n !== noti));
                  }}
                >
                  {noti.chat.isGroupChat
                    ? `New Message in ${noti.chat.chatName}`
                    : `New Message from ${getSender(user, noti.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton ml="10px">
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList bg="#222831" color="white">
              <ProfileModal user={user}>
                <MenuItem
                  _hover={{ bg: 'white', color: 'black' }}
                  _focus={{ bg: 'white', color: 'black' }}
                >
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                onClick={logoutHandler}
                _hover={{ bg: 'white', color: 'black' }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="#393E46">
          <DrawerCloseButton
            style={{ outline: 'none', boxShadow: 'none' }}
            color="white"
            _hover={{ bg: 'white', color: 'black' }}
          />
          <DrawerHeader color="white">Search Users</DrawerHeader>

          <DrawerBody>
            <Box d="flex" pb="2">
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                color="black"
                bg="white"
              />
              <Button onClick={handleSearch} colorScheme="facebook">
                <Search2Icon />
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
          </DrawerBody>
          {loadingChat && <Spinner ml="auto" d="flex" />}
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
