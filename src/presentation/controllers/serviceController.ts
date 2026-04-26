import { Request, Response } from 'express';
import { ServiceService } from '../../application/services/serviceService';

const serviceService = new ServiceService();

export class ServiceController {
  async create(req: Request, res: Response) {
    try {
      const service = await serviceService.createService(req.body);
      return res.status(201).json(service);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const services = await serviceService.getAllServices();
      return res.status(200).json(services);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}