import bcrypt from 'bcrypt';
import { prisma } from '../../infrastructure/database/prismaClient';
import { generateToken } from '../../infrastructure/security/jwt';
import { logger } from '../../infrastructure/logging/logger';
import { LoginDto, RegisterDto } from '../dtos/authDtos';

export class AuthService {
  async register(data: RegisterDto) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        passwordHash: hashedPassword,
        role: 'USER'
      }
    });

    logger.info(`New user registered: ${user.email}`);

    const token = generateToken(user.id, user.email, user.role);

    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    };
  }

  async login(data: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!passwordValid) {
      throw new Error('Invalid email or password');
    }

    logger.info(`User logged in: ${user.email}`);

    const token = generateToken(user.id, user.email, user.role);

    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    };
  }
}