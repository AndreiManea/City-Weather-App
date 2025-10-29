import { Link } from 'react-router-dom';
import type { CitySearchResult } from '../api';

export function CityTable({
  data,
  onDelete,
}: {
  data: CitySearchResult[];
  onDelete: (id: string) => void;
}) {
  if (!data || data.length === 0) {
    return <p className="text-gray-400">No results</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-[15px]">
        <thead>
          <tr className="text-left border-b border-white/5 text-gray-400">
            <th className="py-2 pr-3">City</th>
            <th className="py-2 pr-3">State</th>
            <th className="py-2 pr-3">Country</th>
            <th className="py-2 pr-3">Codes</th>
            <th className="py-2 pr-3">Weather</th>
            <th className="py-2 pr-3">Rating</th>
            <th className="py-2 pr-3">Population</th>
            <th className="py-2 pr-3"></th>
          </tr>
        </thead>
        <tbody className="text-gray-300">
          {data.map((c) => (
            <tr
              key={c.id}
              className="border-b border-white/5 odd:bg-neutral-900/40 even:bg-neutral-900/60 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_6px_20px_rgba(0,0,0,0.35)] transition-all duration-200 rounded-md"
            >
              <td className="py-2 pr-3 font-medium text-gray-200">{c.name}</td>
              <td className="py-2 pr-3">{c.state}</td>
              <td className="py-2 pr-3">{c.country}</td>
              <td className="py-2 pr-3 text-gray-400">
                {c.countryInfo ? `${c.countryInfo.cca2} / ${c.countryInfo.cca3}` : '-'}
              </td>
              <td className="py-2 pr-3 text-gray-400">
                {c.weather ? `${Math.round(c.weather.tempC)}°C, ${c.weather.description}` : '-'}
              </td>
              <td className="py-2 pr-3">{c.touristRating}</td>
              <td className="py-2 pr-3">{c.estimatedPopulation.toLocaleString()}</td>
              <td className="py-2 pr-3 text-right">
                <div className="flex gap-2 justify-end">
                  <Link
                    className="px-3 py-1 rounded-lg bg-neutral-800/80 text-gray-200 ring-1 ring-white/10 hover:bg-neutral-700/70 transition-all duration-200"
                    to={`/cities/${c.id}/edit`}
                  >
                    Edit
                  </Link>
                  <button
                    className="px-3 py-1 rounded-lg bg-gradient-to-b from-red-600 to-red-500 text-white ring-1 ring-white/10 hover:shadow-red-500/20 hover:brightness-110 active:brightness-95 transition-all duration-200"
                    onClick={() => onDelete(c.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
