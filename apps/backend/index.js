import http from 'node:http';
import process from 'node:process';
import Pusher from 'pusher';
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

// Log Pusher configuration (mask sensitive values)
const pusherConfig = {
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
};

log('pusher', 'Initializing Pusher with config:', {
  appId: pusherConfig.appId,
  key: pusherConfig.key,
  secret: pusherConfig.secret,
  cluster: pusherConfig.cluster,
  useTLS: pusherConfig.useTLS,
});

// Check for missing environment variables
const missingVars = [];
if (!process.env.PUSHER_APP_ID) missingVars.push('PUSHER_APP_ID');
if (!process.env.PUSHER_KEY) missingVars.push('PUSHER_KEY');
if (!process.env.PUSHER_SECRET) missingVars.push('PUSHER_SECRET');
if (!process.env.PUSHER_CLUSTER) missingVars.push('PUSHER_CLUSTER');

if (missingVars.length > 0) {
  log('pusher', 'ERROR: Missing required Pusher environment variables:', missingVars);
  log('pusher', 'Pusher will not work properly. Please set these environment variables.');
} else {
  log('pusher', 'All required Pusher environment variables are set');
}

let pusher = null;
try {
  pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
  });

  log('pusher', 'Pusher instance created successfully');

  // Test Pusher connection by triggering a test event
  pusher
    .trigger('test-channel', 'test-event', { message: 'Pusher connection test' })
    .then(() => {
      log('pusher', 'Pusher connection test successful');
    })
    .catch((error) => {
      log('pusher', 'ERROR: Pusher connection test failed:', error.message);
    });
} catch (error) {
  log('pusher', 'ERROR: Failed to create Pusher instance:', error.message);
  log('pusher', 'Pusher will not be available for real-time features');
}

app.set('pusher', pusher);

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
