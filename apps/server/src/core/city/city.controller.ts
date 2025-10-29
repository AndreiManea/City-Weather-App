import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { CityCreateSchema, CityUpdateSchema } from './city.model';
import type { ICityService } from './city.service';

const SearchQuerySchema = z.object({ name: z.string().min(1) });

export function createCityController(service: ICityService) {
  return {
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const input = CityCreateSchema.parse(req.body);
        const created = await service.addCity(input);
        res.status(201).json(created);
      } catch (e) {
        next(e);
      }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params.id;
        const patch = CityUpdateSchema.parse(req.body);
        const updated = await service.updateCity(id, patch);
        res.json(updated);
      } catch (e) {
        next(e);
      }
    },

    remove: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params.id;
        await service.deleteCity(id);
        res.status(204).end();
      } catch (e) {
        next(e);
      }
    },

    search: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name } = SearchQuerySchema.parse(req.query);
        const results = await service.search(name);
        res.json({ results });
      } catch (e) {
        next(e);
      }
    },

    get: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const city = await service.getById(req.params.id);
        res.json(city);
      } catch (e) {
        next(e);
      }
    },
  };
}
