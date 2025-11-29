const request = require('supertest');
const express = require('express');

// Mock the Task model so tests run without a database
jest.mock('../models/Task');
const Task = require('../models/Task');

const tasksRouter = require('../routes/tasks');

const app = express();
app.use(express.json());
app.use('/api/tasks', tasksRouter);

beforeEach(() => {
  // reset mocked methods on the Task mock between tests
  Task.mockClear && Task.mockClear();
  Task.find = jest.fn();
  Task.findByIdAndUpdate = jest.fn();
  Task.findByIdAndDelete = jest.fn();
});

describe('Tasks routes', () => {
  test('GET /api/tasks should return list of tasks', async () => {
    const tasks = [{ _id: '1', title: 't1' }, { _id: '2', title: 't2' }];
    // Task.find().sort(...)
    Task.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(tasks) });

    const res = await request(app).get('/api/tasks');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(tasks);
    expect(Task.find).toHaveBeenCalled();
  });

  test('POST /api/tasks should create and return new task', async () => {
    // Mock Task constructor to return an object with save() method
    Task.mockImplementation(function (data) {
      this.save = jest.fn().mockResolvedValue({ _id: '42', ...data });
    });

    const payload = { title: 'New Task', description: 'desc' };

    const res = await request(app).post('/api/tasks').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(payload);
    // Task (constructor) was called with payload
    expect(Task).toHaveBeenCalledWith(payload);
  });

  test('PUT /api/tasks/:id should update and return task', async () => {
    const updated = { _id: 'abc', title: 'updated' };
    Task.findByIdAndUpdate.mockResolvedValue(updated);

    const res = await request(app).put('/api/tasks/abc').send({ title: 'updated' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
    expect(Task.findByIdAndUpdate).toHaveBeenCalledWith('abc', { title: 'updated' }, { new: true });
  });

  test('DELETE /api/tasks/:id should remove the task and return ok', async () => {
    Task.findByIdAndDelete.mockResolvedValue({});

    const res = await request(app).delete('/api/tasks/123');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(Task.findByIdAndDelete).toHaveBeenCalledWith('123');
  });
});
