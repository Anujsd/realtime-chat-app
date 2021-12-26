const express = require('express');
const dotenv = require('dotenv');
const app = express();
const { chats } = require('./data/data');
const cors = require('cors');
const connectDB = require('./config/mongoDB');
const user = require('./routes/user');
const chat = require('./routes/chat');
const message = require('./routes/message');
const { notFound, errorHandler } = require('./middleware/errorHandlers');
const path = require('path');

dotenv.config();
connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/user', user);
app.use('/api/chat', chat);
app.use('/api/message', message);

//---------------------Deployment--------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, '/client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, 'client', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running successfully');
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`server is listening on port ${PORT} ...`)
);

//for real time sharing
const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  console.log('connected to socket.io');
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (roomId) => {
    socket.join(roomId);
    console.log('user joined room ' + roomId);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('newMessage', (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log('chat.users not defined');
    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit('message recieved', newMessageReceived);
    });
  });

  socket.off('setup', () => {
    console.log('disconnected');
    socket.leave(userData._id);
  });
});
