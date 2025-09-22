import { getSample } from '#modules/samples/controllers/get-sample.js';
import { Sample } from '#modules/samples/models/sample.js';
import { createTestServer } from '#tests/test-utils.js';
import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';

describe('getSample Controller', () => {
  const ROUTE = {
    path: '/samples/:id',
    method: 'GET',
  };

  it('should display the specific sample', async () => {
    const sample = await Sample.create({ name: faker.lorem.sentence() });
    const createdSampleId = sample._id.toString();
    const response = await createTestServer(ROUTE, getSample).get(ROUTE.path.replace(':id', createdSampleId));

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(createdSampleId);
    expect(response.body.name).toBe(sample.name);
  });

  it('should return 404 when not found', async () => {
    const response = await createTestServer(ROUTE, getSample).get(
      ROUTE.path.replace(':id', faker.database.mongodbObjectId()),
    );

    expect(response.status).toBe(404);
  });

  it('should return 400 when invalid ID', async () => {
    const response = await createTestServer(ROUTE, getSample).get(ROUTE.path.replace(':id', faker.string.uuid()));

    expect(response.status).toBe(400);
  });
});
