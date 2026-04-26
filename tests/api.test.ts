import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/infrastructure/database/prismaClient';

describe('Salon Booking API Full Flow Tests', () => {
  let adminToken = '';
  let userToken = '';
  let serviceId = 1;
  let bookingId = 1;
  let guestBookingId = 2;

  const unique = Date.now();

  test('GET / should return API running message', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Salon Booking System API is running');
  });

  test('register normal user account', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Coverage User',
        email: `coverageuser${unique}@test.com`,
        password: 'Password123!'
      });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();

    userToken = response.body.token;
  });

  test('register admin account and update role in database', async () => {
    const email = `coverageadmin${unique}@test.com`;

    const register = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Coverage Admin',
        email,
        password: 'Password123!'
      });

    expect(register.status).toBe(201);

    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });

    const login = await request(app)
      .post('/api/auth/login')
      .send({
        email,
        password: 'Password123!'
      });

    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();

    adminToken = login.body.token;
  });

  test('login should return user token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: `coverageuser${unique}@test.com`,
        password: 'Password123!'
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();

    userToken = response.body.token;
  });

  test('login should fail with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@test.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });

  test('create service using admin token', async () => {
    const response = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Haircut ${unique}`,
        description: 'Test service',
        durationMinutes: 30,
        price: 20
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();

    serviceId = response.body.id;
  });

  test('get all services', async () => {
    const response = await request(app).get('/api/services');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('create registered user booking', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        serviceId,
        bookingDate: `2099-01-${String((unique % 20) + 1).padStart(2, '0')}`,
        startTime: '09:00',
        endTime: '09:30',
        notes: 'Coverage registered booking'
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();

    bookingId = response.body.id;
  });

  test('get my bookings', async () => {
    const response = await request(app)
      .get('/api/bookings/my')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('create guest booking', async () => {
    const response = await request(app)
      .post('/api/bookings/guest')
      .send({
        guestName: 'Coverage Guest',
        guestEmail: `guest${unique}@test.com`,
        serviceId,
        bookingDate: `2099-02-${String((unique % 20) + 1).padStart(2, '0')}`,
        startTime: '11:00',
        endTime: '11:30',
        notes: 'Coverage guest booking'
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();

    guestBookingId = response.body.id;
  });

  test('booking should fail without token', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .send({
        serviceId,
        bookingDate: '2099-03-01',
        startTime: '10:00',
        endTime: '10:30'
      });

    expect(response.status).toBe(401);
  });

  test('admin can view all bookings', async () => {
    const response = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('admin can approve booking', async () => {
    const response = await request(app)
      .put(`/api/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'APPROVED'
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('APPROVED');
  });

  test('admin can decline guest booking', async () => {
    const response = await request(app)
      .put(`/api/bookings/${guestBookingId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'DECLINED'
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('DECLINED');
  });

  test('admin can update booking details', async () => {
    const response = await request(app)
      .put(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        serviceId,
        bookingDate: `2099-04-${String((unique % 20) + 1).padStart(2, '0')}`,
        startTime: '12:00',
        endTime: '12:30',
        notes: 'Updated by admin test'
      });

    expect(response.status).toBe(200);
    expect(response.body.notes).toBe('Updated by admin test');
  });
});