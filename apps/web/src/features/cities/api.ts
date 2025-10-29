import { api } from '@/lib/api';

export type City = {
  id: string;
  name: string;
  country: string;
  touristRating: number;
};

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

export type CitySearchResult = City & {
  countryInfo?: CountryInfo | null;
  weather?: WeatherInfo | null;
};

export async function searchCities(name: string) {
  const res = await api.get<{ results: CitySearchResult[] }>(`/cities/search`, {
    params: { name },
  });
  return res.data.results;
}

// hooks moved to ../hooks

export async function createCity(input: { name: string; country: string; touristRating?: number }) {
  const res = await api.post<City>(`/cities`, input);
  return res.data;
}

export async function updateCity(id: string, patch: { touristRating: number }) {
  const res = await api.patch<City>(`/cities/${id}`, patch);
  return res.data;
}

export async function deleteCity(id: string) {
  await api.delete(`/cities/${id}`);
}

// hooks moved to ../hooks

export async function getCityById(id: string) {
  const res = await api.get<City>(`/cities/${id}`);
  return res.data;
}

// hooks moved to ../hooks
