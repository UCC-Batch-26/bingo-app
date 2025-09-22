import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';

export function createTestApp() {
  const app = express();
  app.use(bodyParser.json());

  return app;
}

export function createTestServer(route, handler) {
  const app = createTestApp();
  app[route.method?.toLowerCase() ?? 'post'](route.path, handler);

  return request(app);
}
