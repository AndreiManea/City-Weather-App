import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { createCityRouter } from '../src/core/city/city.routes';

function buildTestApp(mockService: any) {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use('/api', createCityRouter(mockService));
  return app;
}

describe('city routes', () => {
  it('GET /api/cities/search merges and returns results', async () => {
    const mockService = {
      async search(name: string) {
        expect(name).toBe('Paris');
        return [
          {
            id: '1',
            name: 'Paris',
            country: 'France',
            countryInfo: {
              cca2: 'FR',
              cca3: 'FRA',
              currencies: { EUR: { name: 'Euro', symbol: '€' } },
              capital: ['Paris'],
              region: 'Europe',
              population: 67391582,
            },
            weather: { tempC: 20, feelsLikeC: 19, humidity: 50, description: 'clear sky' },
          },
        ];
      },
    };

    const app = buildTestApp(mockService);
    const res = await request(app).get('/api/cities/search').query({ name: 'Paris' });
    expect(res.status).toBe(200);
    expect(res.body.results).toHaveLength(1);
    expect(res.body.results[0].countryInfo.cca2).toBe('FR');
  });
});
