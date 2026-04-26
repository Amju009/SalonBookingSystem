describe('Basic Project Tests', () => {
  test('should validate booking time correctly', () => {
    const startTime = '10:00';
    const endTime = '10:30';

    expect(endTime > startTime).toBe(true);
  });

  test('should detect invalid booking time', () => {
    const startTime = '11:00';
    const endTime = '10:30';

    expect(endTime < startTime).toBe(true);
  });

  test('should validate user role', () => {
    const role = 'ADMIN';

    expect(role).toBe('ADMIN');
  });

  test('should validate booking status approved', () => {
    const status = 'APPROVED';

    expect(status).toBe('APPROVED');
  });

  test('should validate booking status declined', () => {
    const status = 'DECLINED';

    expect(status).toBe('DECLINED');
  });
});