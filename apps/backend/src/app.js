import { errorHandler } from '#modules/common/middleware/error-handler.js';
import sampleRoutes from '#modules/samples/routes.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import process from 'node:process';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('port', PORT);

// All Global middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // eslint-disable-next-line
      // @todo: Add your whitelisted URL here
      const whitelist = ['http://localhost:5173', 'https://yourproductionurl.com'];
      if (whitelist.indexOf(origin) === -1) {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      } else {
        callback(null, true);
      }
    },
  }),
);
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('combined'));

// Database connection
await db(process.env.DB_URI);

app.get('/ping', (req, res) => {
  res.status(200).json({
    message: 'PONG',
  });
});

// Sample route
app.use('/sample', sampleRoutes);

// Error handling middleware, MUST always be the last
app.use(errorHandler);

export default app;
