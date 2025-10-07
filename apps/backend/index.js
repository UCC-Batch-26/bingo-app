import http from 'node:http';
import process from 'node:process';
import Pusher from 'pusher';
import app from '#src/app.js';
import { log } from '#utils/log.js';

// Initialize Pusher and attach to the express app so handlers can use it
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

app.set('pusher', pusher);
// Export the express app so serverless platforms (like Vercel) can use it.
export default app;

// If not running on Vercel, start a local HTTP server for development
if (!process.env.VERCEL) {
  // Local development: start a HTTP server as before
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
}
