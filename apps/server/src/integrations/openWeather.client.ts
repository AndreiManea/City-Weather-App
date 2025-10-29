import type { AxiosInstance } from 'axios';

import { createHttpClient, httpWithRetry } from '../lib/http';
import type { WeatherInfo } from '../core/city/city.model';
import { env } from '../config/env';

export class OpenWeatherClient {
  private readonly http: AxiosInstance;
  private readonly apiKey?: string;

  constructor(http?: AxiosInstance, apiKey?: string) {
    this.http = http || createHttpClient('https://api.openweathermap.org');
    this.apiKey = env.OPENWEATHER_API_KEY || '8bb3098534f90f893bc9cce3392bb493';
  }

  async getByCityAndCountry(city: string, countryCode2?: string): Promise<WeatherInfo | null> {
    if (!this.apiKey || !countryCode2) return null;
    try {
      const data = await httpWithRetry<any>(this.http, {
        url: `/data/2.5/weather`,
        method: 'GET',
        params: {
          q: `${city},${countryCode2}`,
          units: 'metric',
          appid: this.apiKey,
        },
      });
      const weather: WeatherInfo = {
        tempC: data.main?.temp,
        feelsLikeC: data.main?.feels_like,
        humidity: data.main?.humidity,
        description: data.weather?.[0]?.description || '',
      };
      return weather;
    } catch {
      return null;
    }
  }
}
