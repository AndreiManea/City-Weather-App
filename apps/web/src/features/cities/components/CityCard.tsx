import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CitySearchResult } from '../api';
import { getWeatherEmoji, countryCodeToFlagEmoji } from '@/lib/weatherIcons';
import { DeleteDialog } from './DeleteDialog';

export function CityCard({
  city,
  onDelete,
}: {
  city: CitySearchResult;
  onDelete: (id: string) => void;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const flag = countryCodeToFlagEmoji(city.countryInfo?.cca2);
  const currencyCode = city.countryInfo
    ? Object.keys(city.countryInfo.currencies || {})[0]
    : undefined;
  const currencyObj = currencyCode ? city.countryInfo!.currencies[currencyCode] : undefined;
  const weatherEmoji = getWeatherEmoji(city.weather?.description);
  const temp = city.weather?.tempC != null ? Math.round(city.weather.tempC) : undefined;

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteDialog(false);
    onDelete(city.id);
  };

  return (
    <div className="group bg-gradient-to-br from-neutral-900/60 to-neutral-800/40 backdrop-blur-xl border border-neutral-700 hover:border-blue-600/40 transition-all shadow-md rounded-2xl p-5 hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden>
              {flag}
            </span>
            <h3 className="text-lg font-semibold text-gray-100">{city.name}</h3>
          </div>
          <p className="text-sm text-gray-400 mt-1">{city.country}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-[15px] text-gray-300">
        <p className="text-gray-300 text-sm">
          {weatherEmoji} {temp != null ? `${temp}°C, ` : ''}
          {city.weather?.description || 'No weather data'}
        </p>

        <p>
          <span className="text-gray-400">Tourist Rating: </span>
          <span className="text-yellow-400">
            <span className="text-gray-600">{'⭐'.repeat(1 * city.touristRating)}</span>
          </span>
        </p>

        {city.countryInfo && (
          <>
            {city.countryInfo.capital && city.countryInfo.capital.length > 0 && (
              <p>
                <span className="text-gray-400">Capital: </span>
                <span>{city.countryInfo.capital[0]}</span>
              </p>
            )}
            {city.countryInfo.region && (
              <p>
                <span className="text-gray-400">Region: </span>
                <span>{city.countryInfo.region}</span>
              </p>
            )}
            {city.countryInfo.population != null && (
              <p>
                <span className="text-gray-400">Country Population: </span>
                <span>{city.countryInfo.population.toLocaleString()}</span>
              </p>
            )}
            <p>
              <span className="text-gray-400">Country Codes: </span>
              <span>
                {city.countryInfo.cca2} / {city.countryInfo.cca3}
              </span>
            </p>
            {currencyCode && (
              <p>
                <span className="text-gray-400">Currency: </span>
                <span>
                  {currencyCode} {currencyObj?.symbol ? `(${currencyObj.symbol})` : ''}{' '}
                  {currencyObj?.name ? `— ${currencyObj.name}` : ''}
                </span>
              </p>
            )}
          </>
        )}
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 ">
        <Link
          to={`/cities/${city.id}/edit`}
          className="px-3 py-1.5 rounded-lg bg-neutral-800/80 text-gray-200 ring-1 ring-white/10 hover:bg-neutral-700/70 transition-all duration-200"
        >
          Edit
        </Link>
        <button
          className="px-3 py-1.5 rounded-lg bg-gradient-to-b from-red-600 to-red-500 text-white ring-1 ring-white/10 hover:shadow-red-500/20 hover:brightness-110 active:brightness-95 transition-all duration-200"
          onClick={handleDeleteClick}
        >
          Delete
        </button>
      </div>

      <DeleteDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        cityName={`${city.name}, ${city.country}`}
      />
    </div>
  );
}
