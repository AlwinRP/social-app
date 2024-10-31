const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');
const http = require('http');
const { Server } = require('socket.io');
const authMiddleware = require('./middleware/auth');
require('dotenv').config();
const path = require('path');


const app = express();
const port = process.env.PORT || 5000;

mongoose.connect("mongodb://localhost:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error: ', err));

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/posts', authMiddleware, postRoutes);
app.use('/users', userRoutes);
app.use('/comments', commentRoutes);




const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
