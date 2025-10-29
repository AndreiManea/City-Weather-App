import type { AxiosInstance } from 'axios';

import { createHttpClient, httpWithRetry } from '../lib/http';
import type { CountryInfo } from '../core/city/city.model';

export class RestCountriesClient {
  private readonly http: AxiosInstance;
  private readonly cache = new Map<string, CountryInfo>();

  constructor(http?: AxiosInstance) {
    this.http = http || createHttpClient('https://restcountries.com');
  }

  async getByNameFull(name: string): Promise<CountryInfo | null> {
    const key = name.trim().toLowerCase();
    if (this.cache.has(key)) return this.cache.get(key) || null;

    try {
      const data = await httpWithRetry<any[]>(this.http, {
        url: `/v3.1/name/${encodeURIComponent(name)}?fullText=true`,
        method: 'GET',
      });
      if (!Array.isArray(data) || data.length === 0) return null;
      const first = data[0];
      const country: CountryInfo = {
        cca2: first.cca2,
        cca3: first.cca3,
        currencies: first.currencies || {},
        capital: first.capital,
        region: first.region,
        population: first.population,
      };
      this.cache.set(key, country);
      return country;
    } catch {
      return null;
    }
  }
}
