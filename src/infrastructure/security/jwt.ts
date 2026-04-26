import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'salon_booking_secret_key';

export function generateToken(userId: number, email: string, role: string): string {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}