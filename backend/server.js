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
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  // Handle code change events and broadcast to all clients
  socket.on('code-change', (code) => {
    console.log('Code change received from', socket.id, ':', code);
    io.emit('code-change', code); // Emit code change to all clients
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });

  // Optional: Handle socket errors
  socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });
});

// Endpoint to compile code
app.post('/compile', async (req, res) => {
  const { code, language } = req.body;
  try {
    const submission = await submitCode(code, language);
    const result = await getSubmissionResult(submission.token);
    res.json(result);
    io.emit('compile-result', result); // Emit compile result to all clients
  } catch (error) {
    console.error('Error during compilation:', error);
    res.status(500).send(error.toString());
  }
});

// Test endpoint to manually emit messages
app.get('/test', (req, res) => {
  const testMessage = 'Test message to all clients';
  io.emit('test-message', testMessage); // Emit test message to all clients
  res.send('Test message emitted to all clients');
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
