import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CitySearchResult } from '../api';
import { getWeatherEmoji, countryCodeToFlagEmoji } from '@/lib/weatherIcons';

interface CityDetailsViewProps {
  city: CitySearchResult;
  onSave: (rating: number) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

export function CityDetailsView({
  city,
  onSave,
  onCancel,
  isSaving = false,
}: CityDetailsViewProps) {
  const [rating, setRating] = useState(city.touristRating);

  // Sync rating when city data changes
  useEffect(() => {
    setRating(city.touristRating);
  }, [city.touristRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(rating);
  };

  const flag = countryCodeToFlagEmoji(city.countryInfo?.cca2);
  const currencyCode = city.countryInfo
    ? Object.keys(city.countryInfo.currencies || {})[0]
    : undefined;
  const currencyObj = currencyCode ? city.countryInfo!.currencies[currencyCode] : undefined;
  const weatherEmoji = getWeatherEmoji(city.weather?.description);
  const temp = city.weather?.tempC != null ? Math.round(city.weather.tempC) : undefined;
  const feelsLike =
    city.weather?.feelsLikeC != null ? Math.round(city.weather.feelsLikeC) : undefined;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="overflow-visible rounded-2xl ring-1 ring-white/5 bg-gray-900/80 backdrop-blur-sm shadow-xl shadow-black/30">
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/20 px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden>
              {flag}
            </span>
            <div>
              <h2 className="text-xl font-semibold text-gray-100">{city.name}</h2>
              <p className="text-sm text-gray-400">{city.country}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Weather Section */}
          <div className="rounded-xl bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/30 p-5">
            <h3 className="text-base font-semibold text-gray-200 mb-3 flex items-center gap-2">
              <span className="text-xl">{weatherEmoji}</span>
              Current Weather
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-1">Temperature</p>
                <p className="text-2xl font-semibold text-gray-100">
                  {temp != null ? `${temp}°C` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Feels Like</p>
                <p className="text-2xl font-semibold text-gray-100">
                  {feelsLike != null ? `${feelsLike}°C` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Humidity</p>
                <p className="text-2xl font-semibold text-gray-100">
                  {city.weather?.humidity != null ? `${city.weather.humidity}%` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Conditions</p>
                <p className="text-base font-medium text-gray-200 capitalize">
                  {city.weather?.description || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Country Information Section */}
          {city.countryInfo && (
            <div className="rounded-xl bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30 p-5">
              <h3 className="text-base font-semibold text-gray-200 mb-3">Country Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {city.countryInfo.capital && city.countryInfo.capital.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Capital:</span>
                    <span className="text-gray-200 font-medium">{city.countryInfo.capital[0]}</span>
                  </div>
                )}
                {city.countryInfo.region && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Region:</span>
                    <span className="text-gray-200 font-medium">{city.countryInfo.region}</span>
                  </div>
                )}
                {city.countryInfo.population != null && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Population:</span>
                    <span className="text-gray-200 font-medium">
                      {city.countryInfo.population.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Country Codes:</span>
                  <span className="text-gray-200 font-medium">
                    {city.countryInfo.cca2} / {city.countryInfo.cca3}
                  </span>
                </div>
                {currencyCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Currency:</span>
                    <span className="text-gray-200 font-medium">
                      {currencyCode} {currencyObj?.symbol ? `(${currencyObj.symbol})` : ''}{' '}
                      {currencyObj?.name ? `— ${currencyObj.name}` : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Editable Tourist Rating Section */}
          <div className="rounded-xl bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-700/30 p-5">
            <h3 className="text-base font-semibold text-gray-200 mb-4">
              Tourist Rating
              {rating !== city.touristRating && (
                <span className="ml-2 text-xs text-amber-400">(unsaved changes)</span>
              )}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <label className="flex flex-col gap-2 flex-1">
                    <span className="text-sm text-gray-300">Rating (0-5)</span>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="rounded-lg border border-neutral-700 bg-neutral-900/95 px-3 py-2.5 text-[15px] text-gray-200 outline-none transition-all duration-200 ease-in-out focus:ring-2 focus:ring-amber-600/40 hover:border-neutral-600"
                    />
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSaving || rating === city.touristRating}
                    className="flex-1 rounded-lg bg-gradient-to-b from-blue-600 to-blue-500 text-white px-5 py-2.5 text-[15px] shadow ring-1 ring-white/10 hover:shadow-blue-500/20 hover:brightness-110 active:brightness-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 rounded-lg bg-neutral-800/80 text-gray-200 ring-1 ring-white/10 hover:bg-neutral-700/70 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
