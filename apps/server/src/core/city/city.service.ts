import type {
  CityCreateInput,
  CityUpdateInput,
  CitySearchResult,
  DBCity,
  NewCityRecord,
} from './city.model';
import { CityUpdateSchema } from './city.model';
import { AppError } from '../../lib/http';
import type { CityRepository } from './city.repo';
import type { RestCountriesClient } from '../../integrations/restCountries.client';
import type { OpenWeatherClient } from '../../integrations/openWeather.client';

export class CityService {
  constructor(
    private readonly repo: CityRepository,
    private readonly restCountries: RestCountriesClient,
    private readonly openWeather: OpenWeatherClient,
  ) {}

  async addCity(input: CityCreateInput): Promise<DBCity> {
    // 1. Validate country exists via REST Countries API
    const countryInfo = await this.restCountries.getByNameFull(input.country);
    if (!countryInfo) {
      throw new AppError(
        `Country "${input.country}" not found. Please check the country name.`,
        400,
        'INVALID_COUNTRY',
      );
    }

    // 2. Validate city exists in that country via OpenWeather API
    const weather = await this.openWeather.getByCityAndCountry(input.name, countryInfo.cca2);
    if (!weather) {
      throw new AppError(
        `City "${input.name}" not found in ${input.country}. Please verify the city name.`,
        400,
        'CITY_NOT_FOUND_IN_COUNTRY',
      );
    }

    // 3. Create the city record (unique constraint will handle duplicates at DB level)
    const toCreate: NewCityRecord = {
      name: input.name,
      country: input.country,
      touristRating: input.touristRating,
    };

    try {
      return await this.repo.create(toCreate);
    } catch (e: any) {
      // Handle unique constraint violation
      if (e.code === 'P2002' || e.message?.includes('Unique constraint')) {
        throw new AppError(
          `City "${input.name}" in ${input.country} already exists in the database.`,
          409,
          'DUPLICATE_CITY',
        );
      }
      throw e;
    }
  }

  async updateCity(id: string, patch: CityUpdateInput): Promise<DBCity> {
    const parsed = CityUpdateSchema.parse(patch);
    try {
      return await this.repo.updatePartial(id, parsed);
    } catch (e) {
      throw new AppError('City not found', 404, 'NOT_FOUND');
    }
  }

  async deleteCity(id: string): Promise<void> {
    try {
      await this.repo.deleteById(id);
    } catch (e) {
      throw new AppError('City not found', 404, 'NOT_FOUND');
    }
  }

  async search(name: string): Promise<CitySearchResult[]> {
    const locals = await this.repo.searchByName(name);
    if (locals.length === 0) return [];

    // Cache country lookups per request as well to limit external calls
    const perRequestCountryCache = new Map<
      string,
      Awaited<ReturnType<RestCountriesClient['getByNameFull']>>
    >();

    const results: CitySearchResult[] = [];
    for (const c of locals) {
      const countryKey = c.country.toLowerCase();
      let countryInfo = perRequestCountryCache.get(countryKey) ?? null;
      if (!perRequestCountryCache.has(countryKey)) {
        countryInfo = await this.restCountries.getByNameFull(c.country);
        perRequestCountryCache.set(countryKey, countryInfo);
      }
      const weather = await this.openWeather.getByCityAndCountry(c.name, countryInfo?.cca2);

      results.push({
        id: c.id,
        name: c.name,
        country: c.country,
        touristRating: c.touristRating,
        countryInfo,
        weather,
      });
    }
    return results;
  }

  async getById(id: string): Promise<DBCity> {
    const found = await this.repo.findById(id);
    if (!found) {
      throw new AppError('City not found', 404, 'NOT_FOUND');
    }
    return found;
  }
}

export type ICityService = Pick<
  CityService,
  'addCity' | 'updateCity' | 'deleteCity' | 'search' | 'getById'
>;
