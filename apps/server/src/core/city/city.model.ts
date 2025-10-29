import { z } from 'zod';

export const CityCreateSchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  touristRating: z.number().int().min(0).max(5).optional(),
});

export type CityCreateInput = z.infer<typeof CityCreateSchema>;

export const CityUpdateSchema = z.object({
  touristRating: z.number().int().min(0).max(5),
});

export type CityUpdateInput = z.infer<typeof CityUpdateSchema>;

export type CountryInfo = {
  cca2: string;
  cca3: string;
  currencies: Record<string, { name: string; symbol?: string }>;
  capital?: string[];
  region?: string;
  population?: number;
};

export type WeatherInfo = {
  tempC: number;
  feelsLikeC: number;
  humidity: number;
  description: string;
};

export type CitySearchResult = {
  id: string;
  name: string;
  country: string;
  touristRating: number;
  countryInfo?: CountryInfo | null;
  weather?: WeatherInfo | null;
};

// Database entity shape used internally on the server side (matches Prisma model fields)
export type DBCity = {
  id: string;
  name: string;
  country: string;
  touristRating: number;
  createdAt: Date;
  updatedAt: Date;
};

export type NewCityRecord = Pick<DBCity, 'name' | 'country'> & { touristRating?: number };
