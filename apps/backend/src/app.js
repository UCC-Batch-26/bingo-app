import { errorHandler } from '#modules/common/middleware/error-handler.js';
import sampleRoutes from '#modules/samples/routes.js';
import roomRoutes from '#modules/room/routes.js';
import cardRoutes from '#modules/card/routes.js';
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

app.get('/ping', (_, res) => {
  res.status(200).json({
    message: 'PONG',
  });
});

// All Global middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const whitelist = ['http://localhost:5173', 'https://bit9o.com', 'https://www.bit9o.com'];

      if (!origin) {
        // 👉 Allow requests with no origin (browser direct, Postman, curl)
        return callback(null, true);
      }

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

// Sample route
app.use('/sample', sampleRoutes);
app.use('/v1/room', roomRoutes);
app.use('/v1/card', cardRoutes);

// Error handling middleware, MUST always be the last
app.use(errorHandler);

export default app;
