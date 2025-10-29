import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { CityForm, type CityFormValues } from '../components/CityForm';
import { CityDetailsView } from '../components/CityDetailsView';
import { useCreateCity, useUpdateCity, useGetCity, useSearchCities } from '../hooks';

export function CityEditPage({ mode }: { mode: 'create' | 'edit' }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const create = useCreateCity();
  const update = useUpdateCity();
  const cityQuery = useGetCity(mode === 'edit' ? id : undefined);

  // Fetch enriched city data (weather + country info) for edit mode
  const searchQuery = useSearchCities(cityQuery.data?.name || '');
  const enrichedCity =
    mode === 'edit' && searchQuery.data
      ? searchQuery.data.find(
          (c) =>
            c.id === id ||
            (c.name === cityQuery.data?.name && c.country === cityQuery.data?.country),
        )
      : null;

  const handleSaveRating = async (rating: number) => {
    if (!id) return;
    try {
      await update.mutateAsync({ id, patch: { touristRating: rating } });
      toast.success('City updated');
      navigate('/');
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message || 'Failed to save');
      throw e; // Re-throw so the component can handle it
    }
  };

  const handleCreateCity = async (values: CityFormValues) => {
    try {
      await create.mutateAsync(values as any);
      toast.success('City created');
      navigate('/');
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message || 'Failed to save');
    }
  };

  // Show rich details view for edit mode when data is loaded
  if (mode === 'edit' && enrichedCity) {
    return (
      <CityDetailsView
        city={enrichedCity}
        onSave={handleSaveRating}
        onCancel={() => navigate('/')}
        isSaving={update.isPending}
      />
    );
  }

  // Fallback for create mode or while loading
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="overflow-visible rounded-2xl ring-1 ring-white/5 bg-gray-900/80 backdrop-blur-sm shadow-xl shadow-black/30">
        <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/30 px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-gray-100">
            {mode === 'create'
              ? 'Add City'
              : cityQuery.isLoading
                ? 'Loading...'
                : `Edit City | ${cityQuery.data?.name} | ${cityQuery.data?.country}`}
          </h2>
        </div>
        <div className="p-6">
          {mode === 'edit' && (cityQuery.isLoading || searchQuery.isFetching) ? (
            <p className="text-gray-300">Loading city information...</p>
          ) : (
            <CityForm
              mode={mode}
              onSubmit={handleCreateCity}
              defaultValues={mode === 'edit' && cityQuery.data ? cityQuery.data : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
