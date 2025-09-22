import { getAllSamples } from '#modules/samples/controllers/get-all-samples.js';
import { Sample } from '#modules/samples/models/sample.js';
import { createTestServer } from '#tests/test-utils.js';
import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';

describe('getAllSamples Controller', () => {
  const ROUTE = {
    path: '/samples',
    method: 'GET',
  };

  it('should display all samples', async () => {
    await Sample.create([
      { name: faker.lorem.sentence() },
      { name: faker.lorem.sentence() },
      { name: faker.lorem.sentence() },
    ]);

    const response = await createTestServer(ROUTE, getAllSamples).get(ROUTE.path);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(3);
  });

  it('should display atleast 1 sample', async () => {
    await Sample.create({ name: faker.lorem.sentence() });
    const response = await createTestServer(ROUTE, getAllSamples).get(ROUTE.path);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });

  it('should display an empty sample', async () => {
    const response = await createTestServer(ROUTE, getAllSamples).get(ROUTE.path);

    expect(response.status).toBe(200);
    expect(response.body.data).toStrictEqual([]);
  });
});
