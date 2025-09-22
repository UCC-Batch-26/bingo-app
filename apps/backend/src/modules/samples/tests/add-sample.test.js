import { addSample } from '#modules/samples/controllers/add-sample.js';
import { Sample } from '#modules/samples/models/sample.js';
import { createTestServer } from '#tests/test-utils.js';
import { faker } from '@faker-js/faker';
import { isValidObjectId } from 'mongoose';
import { describe, expect, it } from 'vitest';

describe('addSample Controller', () => {
  const ROUTE = {
    path: '/samples',
    method: 'POST',
  };

  it('should create a new sample successfully', async () => {
    const sampleData = { name: faker.lorem.sentence() };
    const response = await createTestServer(ROUTE, addSample).post(ROUTE.path).send(sampleData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Successfully created sample');
    expect(response.body.data.name).toBe(sampleData.name);

    const responseSampleId = response.body.data._id;
    expect(isValidObjectId(responseSampleId)).toBeTruthy();

    // Verify integration
    const createdSample = await Sample.findById(responseSampleId);
    expect(createdSample).toBeTruthy();
    expect(createdSample.name).toBe(sampleData.name);
  });

  it('should return 400 when name is missing', async () => {
    const response = await createTestServer(ROUTE, addSample).post(ROUTE.path).send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBeTruthy();
  });
});
