import http from 'node:http';
import process from 'node:process';
import { Server } from 'socket.io';
import app from '#src/app.js';
import { log } from '#utils/log.js';

function normalizePort(portValue) {
  const port = parseInt(portValue, 10);

  if (isNaN(port)) {
    // named pipe
    return portValue;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Socket.io connection handling
io.on('connection', (socket) => {
  log('socket', `User connected: ${socket.id}`);

  // Join room
  socket.on('join-room', (roomCode) => {
    socket.join(roomCode);
    log('socket', `User ${socket.id} joined room ${roomCode}`);
  });

  // Leave room
  socket.on('leave-room', (roomCode) => {
    socket.leave(roomCode);
    log('socket', `User ${socket.id} left room ${roomCode}`);
  });

  // Handle player win event
  socket.on('player-won', (data) => {
    log('socket', `Player won: ${data.playerName} in room ${data.roomCode}`);
    // Broadcast the win to all players in the room
    socket.to(data.roomCode).emit('player-won', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    log('socket', `User disconnected: ${socket.id}`);
  });
});

// Make io available globally
app.set('io', io);

server.listen(port);
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;

    default:
      throw error;
  }
});

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

  log('server', `Listening on ${bind}`);
});
