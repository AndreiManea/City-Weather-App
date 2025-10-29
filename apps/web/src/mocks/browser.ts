import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:4000/api/cities/search', ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    if (name === 'Paris') {
      return HttpResponse.json({
        results: [
          {
            id: '1',
            name: 'Paris',
            country: 'France',
            touristRating: 5,
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
        ],
      });
    }
    return HttpResponse.json({ results: [] });
  }),
];
