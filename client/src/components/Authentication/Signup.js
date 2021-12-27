import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { VStack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Please fill all fields',
        status: 'Warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords are not equal',
        status: 'Warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/user',
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      toast({
        title: 'Registration Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
    } catch (error) {
      toast({
        title: 'Error Occured',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  const postImage = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: 'Please Select an image',
        status: 'Warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'chatapp');
      data.append('cloud_name', 'anujdube');

      fetch('https://api.cloudinary.com/v1_1/anujdube/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: 'Please Select an image',
        status: 'Warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
  };

  return (
    <VStack spacing="7px">
      <FormControl id="signup-name" isRequired>
        <FormLabel color="white">Name</FormLabel>
        <Input
          bg="#222831"
          placeholder="Enter your name"
          onChange={(e) => {
            let nm = e.target.value;
            nm = nm.charAt(0).toUpperCase() + nm.slice(1);
            setName(nm);
          }}
        ></Input>
      </FormControl>
      <FormControl id="signup-email" isRequired>
        <FormLabel color="white">Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          bg="#222831"
        ></Input>
      </FormControl>
      <FormControl id="signup-password" isRequired>
        <FormLabel color="white">Password</FormLabel>
        <InputGroup>
          <Input
            bg="#222831"
            type={show ? 'text' : 'password'}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShow(!show)}
              bg="#222831"
              _hover={{ bg: 'white', color: 'black' }}
            >
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="signup-confirm-password" isRequired>
        <FormLabel color="white">Confirm Password</FormLabel>
        <InputGroup>
          <Input
            bg="#222831"
            type={show ? 'text' : 'password'}
            placeholder="Enter your password again"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShow(!show)}
              bg="#222831"
              _hover={{ bg: 'white', color: 'black' }}
            >
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="signup-pic" color="white">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1}
          accept="image/*"
          onChange={(e) => {
            postImage(e.target.files[0]);
          }}
        />
      </FormControl>
      <Button
        colorScheme="facebook"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
