import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CityService } from '../src/core/city/city.service';
import { AppError } from '../src/lib/http';

describe('CityService', () => {
  let service: CityService;
  let mockRepo: any;
  let mockRestCountries: any;
  let mockOpenWeather: any;

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      updatePartial: vi.fn(),
      deleteById: vi.fn(),
      searchByName: vi.fn(),
      findById: vi.fn(),
    };

    mockRestCountries = {
      getByNameFull: vi.fn(),
    };

    mockOpenWeather = {
      getByCityAndCountry: vi.fn(),
    };

    service = new CityService(mockRepo, mockRestCountries, mockOpenWeather);
  });

  describe('addCity', () => {
    it('should create a city when country and city exist', async () => {
      const input = { name: 'Paris', country: 'France', touristRating: 4 };
      const countryInfo = { cca2: 'FR', cca3: 'FRA', currencies: {} };
      const weather = { tempC: 20, feelsLikeC: 19, humidity: 50, description: 'clear' };

      mockRestCountries.getByNameFull.mockResolvedValue(countryInfo);
      mockOpenWeather.getByCityAndCountry.mockResolvedValue(weather);
      mockRepo.create.mockResolvedValue({
        id: '1',
        name: 'Paris',
        country: 'France',
        touristRating: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.addCity(input);

      expect(mockRestCountries.getByNameFull).toHaveBeenCalledWith('France');
      expect(mockOpenWeather.getByCityAndCountry).toHaveBeenCalledWith('Paris', 'FR');
      expect(mockRepo.create).toHaveBeenCalledWith({
        name: 'Paris',
        country: 'France',
        touristRating: 4,
      });
      expect(result.name).toBe('Paris');
    });

    it('should default rating to undefined when not provided', async () => {
      const input = { name: 'Paris', country: 'France' };
      mockRestCountries.getByNameFull.mockResolvedValue({
        cca2: 'FR',
        cca3: 'FRA',
        currencies: {},
      });
      mockOpenWeather.getByCityAndCountry.mockResolvedValue({ tempC: 20 });
      mockRepo.create.mockResolvedValue({
        id: '1',
        name: 'Paris',
        country: 'France',
        touristRating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await service.addCity(input);

      expect(mockRepo.create).toHaveBeenCalledWith({
        name: 'Paris',
        country: 'France',
        touristRating: undefined,
      });
    });

    it('should throw error when country does not exist', async () => {
      const input = { name: 'Paris', country: 'InvalidCountry' };
      mockRestCountries.getByNameFull.mockResolvedValue(null);

      await expect(service.addCity(input)).rejects.toThrow(AppError);
      await expect(service.addCity(input)).rejects.toThrow('Country "InvalidCountry" not found');
    });

    it('should throw error when city does not exist in country', async () => {
      const input = { name: 'InvalidCity', country: 'France' };
      mockRestCountries.getByNameFull.mockResolvedValue({
        cca2: 'FR',
        cca3: 'FRA',
        currencies: {},
      });
      mockOpenWeather.getByCityAndCountry.mockResolvedValue(null);

      await expect(service.addCity(input)).rejects.toThrow(AppError);
      await expect(service.addCity(input)).rejects.toThrow(
        'City "InvalidCity" not found in France',
      );
    });

    it('should throw error when city already exists (duplicate)', async () => {
      const input = { name: 'Paris', country: 'France' };
      mockRestCountries.getByNameFull.mockResolvedValue({
        cca2: 'FR',
        cca3: 'FRA',
        currencies: {},
      });
      mockOpenWeather.getByCityAndCountry.mockResolvedValue({ tempC: 20 });

      const duplicateError: any = new Error('Unique constraint violation');
      duplicateError.code = 'P2002';
      mockRepo.create.mockRejectedValue(duplicateError);

      await expect(service.addCity(input)).rejects.toThrow(AppError);
      await expect(service.addCity(input)).rejects.toThrow(
        'City "Paris" in France already exists in the database',
      );
    });
  });

  describe('updateCity', () => {
    it('should update city tourist rating', async () => {
      const patch = { touristRating: 5 };
      mockRepo.updatePartial.mockResolvedValue({
        id: '1',
        name: 'Paris',
        country: 'France',
        touristRating: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.updateCity('1', patch);

      expect(mockRepo.updatePartial).toHaveBeenCalledWith('1', patch);
      expect(result.touristRating).toBe(5);
    });

    it('should throw error when city does not exist', async () => {
      const patch = { touristRating: 5 };
      mockRepo.updatePartial.mockRejectedValue(new Error('Not found'));

      await expect(service.updateCity('invalid-id', patch)).rejects.toThrow(AppError);
      await expect(service.updateCity('invalid-id', patch)).rejects.toThrow('City not found');
    });
  });

  describe('search', () => {
    it('should return enriched city data with country info and weather', async () => {
      const cities = [
        {
          id: '1',
          name: 'Paris',
          country: 'France',
          touristRating: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const countryInfo = {
        cca2: 'FR',
        cca3: 'FRA',
        currencies: { EUR: { name: 'Euro', symbol: '€' } },
        capital: ['Paris'],
        region: 'Europe',
        population: 67000000,
      };

      const weather = { tempC: 20, feelsLikeC: 19, humidity: 50, description: 'clear sky' };

      mockRepo.searchByName.mockResolvedValue(cities);
      mockRestCountries.getByNameFull.mockResolvedValue(countryInfo);
      mockOpenWeather.getByCityAndCountry.mockResolvedValue(weather);

      const results = await service.search('Paris');

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Paris');
      expect(results[0].touristRating).toBe(4);
      expect(results[0].countryInfo?.cca2).toBe('FR');
      expect(results[0].weather?.tempC).toBe(20);
    });

    it('should return empty array when no cities found', async () => {
      mockRepo.searchByName.mockResolvedValue([]);

      const results = await service.search('NonExistent');

      expect(results).toEqual([]);
    });

    it('should cache country lookups per request', async () => {
      const cities = [
        {
          id: '1',
          name: 'Paris',
          country: 'France',
          touristRating: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Lyon',
          country: 'France',
          touristRating: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepo.searchByName.mockResolvedValue(cities);
      mockRestCountries.getByNameFull.mockResolvedValue({
        cca2: 'FR',
        cca3: 'FRA',
        currencies: {},
      });
      mockOpenWeather.getByCityAndCountry.mockResolvedValue({ tempC: 20 });

      await service.search('France');

      // Should only call REST Countries once for both cities from the same country
      expect(mockRestCountries.getByNameFull).toHaveBeenCalledTimes(1);
      expect(mockOpenWeather.getByCityAndCountry).toHaveBeenCalledTimes(2);
    });
  });

  describe('getById', () => {
    it('should return city when found', async () => {
      const city = {
        id: '1',
        name: 'Paris',
        country: 'France',
        touristRating: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepo.findById.mockResolvedValue(city);

      const result = await service.getById('1');

      expect(result).toEqual(city);
    });

    it('should throw error when city not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.getById('invalid-id')).rejects.toThrow(AppError);
      await expect(service.getById('invalid-id')).rejects.toThrow('City not found');
    });
  });
});
