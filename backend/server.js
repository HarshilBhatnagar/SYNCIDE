// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { submitCode, getSubmissionResult } = require('./Judge0');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('code-change', (code) => {
    console.log('Code change received:', code);
    socket.broadcast.emit('code-change', code);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.post('/compile', async (req, res) => {
  const { code, language } = req.body;
  try {
    const submission = await submitCode(code, language);
    const result = await getSubmissionResult(submission.token);
    res.json(result);
    io.emit('compile-result', result); // Emit compile result to all clients
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
