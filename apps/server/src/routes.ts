import { Router } from 'express';

import { CityRepository } from './core/city/city.repo';
import { CityService } from './core/city/city.service';
import { createCityRouter } from './core/city/city.routes';
import { RestCountriesClient } from './integrations/restCountries.client';
import { OpenWeatherClient } from './integrations/openWeather.client';

export function buildRoutes() {
  const router = Router();

  const repo = new CityRepository();
  const countries = new RestCountriesClient();
  const weather = new OpenWeatherClient();
  const service = new CityService(repo, countries, weather);

  router.use(createCityRouter(service));

  return router;
}
