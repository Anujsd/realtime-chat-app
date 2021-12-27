const asyncHandler = require('express-async-handler');
const Chat = require('../models/chat');
const Message = require('../models/message');
const User = require('../models/user');

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log('Invalid content or chatId passed into request');
    return res.sendStatus(400);
  }
  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    let message = await Message.create(newMessage);
    message = await message.populate('sender', 'name pic');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email',
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(400);
    console.log(error);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name pic email')
      .populate('chat');
    res.status(200).json(messages);
  } catch (error) {
    res.status(400);
    console.log(error);
    throw new Error(error.message);
  }
});

const deleteAllMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.deleteMany({});
    res.status(200).send('all messages are deleted');
  } catch (error) {
    res.status(400);
    console.log(error);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages, deleteAllMessages };
