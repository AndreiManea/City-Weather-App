import { useMutation, useQuery, useQueryClient, QueryKey } from '@tanstack/react-query';
import { createCity, deleteCity, getCityById, searchCities, updateCity } from '../api';
import type { CitySearchResult } from '../api';

import { useEffect, useState } from 'react';

/**
 * Custom hook to persist state in sessionStorage.
 * Automatically syncs state changes to sessionStorage and initializes from it.
 */
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail if sessionStorage is unavailable (e.g., incognito mode)
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export function useSearchCities(name: string) {
  return useQuery({
    queryKey: ['cities', 'search', name],
    queryFn: () => searchCities(name),
    enabled: name.trim().length > 0,
  });
}

export function useCreateCity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCity,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cities'] }),
  });
}

export function useUpdateCity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: { touristRating: number } }) =>
      updateCity(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cities'] }),
  });
}

export function useDeleteCity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCity,
    onMutate: async (deletedId: string) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await qc.cancelQueries({ queryKey: ['cities'] });

      // Snapshot the previous values
      const previousSearches = new Map<QueryKey, CitySearchResult[]>();

      // Update all search query caches by removing the deleted city
      qc.getQueriesData<CitySearchResult[]>({ queryKey: ['cities', 'search'] }).forEach(
        ([key, data]) => {
          if (data && Array.isArray(data)) {
            previousSearches.set(key, data);
            const filtered = data.filter((city) => city.id !== deletedId);
            qc.setQueryData(key, filtered);
          }
        },
      );

      return { previousSearches };
    },
    onError: (err, deletedId, context) => {
      // Rollback on error
      if (context?.previousSearches) {
        context.previousSearches.forEach((data, key) => {
          qc.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      // Refetch in the background to sync with server
      qc.invalidateQueries({ queryKey: ['cities'] });
    },
  });
}

export function useGetCity(id?: string) {
  return useQuery({
    queryKey: ['cities', 'by-id', id],
    queryFn: () => getCityById(id as string),
    enabled: Boolean(id),
  });
}
