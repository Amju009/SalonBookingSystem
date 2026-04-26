import { prisma } from '../../infrastructure/database/prismaClient';
import { CreateServiceDto } from '../dtos/serviceDto';
import { logger } from '../../infrastructure/logging/logger';

export class ServiceService {
  async createService(data: CreateServiceDto) {
    const service = await prisma.service.create({
      data: {
        name: data.name,
        description: data.description,
        durationMinutes: data.durationMinutes,
        price: data.price
      }
    });

    logger.info(`Service created: ${service.name}`);
    return service;
  }

  async getAllServices() {
    return prisma.service.findMany();
  }
}