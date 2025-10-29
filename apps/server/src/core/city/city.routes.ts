import { Router } from 'express';

import { createCityController } from './city.controller';
import type { ICityService } from './city.service';

export function createCityRouter(service: ICityService) {
  const r = Router();
  const controller = createCityController(service);

  r.post('/cities', controller.create);
  r.patch('/cities/:id', controller.update);
  r.delete('/cities/:id', controller.remove);
  r.get('/cities/search', controller.search);
  r.get('/cities/:id', controller.get);

  return r;
}
