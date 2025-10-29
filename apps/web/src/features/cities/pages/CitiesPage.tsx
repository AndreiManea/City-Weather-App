import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { CitySearchForm } from '../components/CitySearchForm';
import { CityCard } from '../components/CityCard';
import { useDeleteCity, useSearchCities, useSessionStorage } from '../hooks';

const SEARCH_STORAGE_KEY = 'cityWeather:lastSearch';

export function CitiesPage() {
  // Persist search term across page refreshes and navigation within the session
  const [term, setTerm] = useSessionStorage(SEARCH_STORAGE_KEY, '');
  const { data, isFetching, error, isLoading } = useSearchCities(term);
  const del = useDeleteCity();

  const onDelete = async (id: string) => {
    try {
      await del.mutateAsync(id);
      toast.success('City deleted');
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message || 'Failed to delete');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="rounded-2xl ring-1 ring-white/5 bg-gray-900/80 backdrop-blur-sm shadow-xl shadow-black/30">
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/20 px-6 py-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-100">Search Cities</h2>
            <Link
              to="/cities/new"
              className="rounded-lg bg-gradient-to-b from-emerald-600 to-emerald-500 text-white px-4 py-2 text-[15px] shadow ring-1 ring-white/10 hover:shadow-emerald-500/20 hover:brightness-110 active:brightness-95 transition-all duration-200 ease-in-out"
            >
              Add City
            </Link>
          </div>
        </div>
        <div className="p-6">
          <CitySearchForm onSearch={setTerm} initialName={term} />
        </div>
      </div>

      <div className="rounded-2xl ring-1 ring-white/5 bg-gray-900/80 backdrop-blur-sm shadow-xl shadow-black/30">
        <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/30 px-6 py-3 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-200">Results</h3>
            {isFetching && !isLoading && (
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                Updating...
              </span>
            )}
          </div>
        </div>
        <div className="p-6">
          {isLoading && <p className="text-gray-300">Loading...</p>}
          {error && <p className="text-red-400">Failed to load cities</p>}
          {!isLoading && !error && data && data.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((c) => (
                <CityCard key={c.id} city={c} onDelete={onDelete} />
              ))}
            </div>
          )}
          {!isLoading && !error && data && data.length === 0 && (
            <p className="text-gray-400">No cities found matching "{term}"</p>
          )}
          {!isLoading && !error && !data && !term && (
            <p className="text-gray-400">Enter a city name to start searching...</p>
          )}

          <div className="mt-8 text-sm text-gray-500">
            <span className="mr-2">Weather:</span>
            <span className="mr-3">☀️ Clear</span>
            <span className="mr-3">🌧️ Rain</span>
            <span className="mr-3">☁️ Clouds</span>
            <span className="mr-3">❄️ Snow</span>
            <span className="mr-3">🌫️ Fog</span>
          </div>
        </div>
      </div>
    </div>
  );
}
