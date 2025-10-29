import { z } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { City } from '../api';

const CreateSchema = z.object({
  name: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
  touristRating: z.coerce.number().int().min(0, 'Min 0').max(5, 'Max 5').optional(),
});

const EditSchema = z.object({
  touristRating: z.coerce.number().int().min(0, 'Min 0').max(5, 'Max 5'),
});

export type CityFormValues = z.infer<typeof CreateSchema> | z.infer<typeof EditSchema>;

export function CityForm({
  defaultValues,
  onSubmit,
  mode,
}: {
  defaultValues?: Partial<City>;
  onSubmit: (values: any) => void;
  mode: 'create' | 'edit';
}) {
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(mode === 'create' ? CreateSchema : EditSchema),
    defaultValues: defaultValues as any,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues as any);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-0 space-y-6">
      {mode === 'create' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-300">City Name</span>
              <input
                className={`rounded-lg border bg-neutral-900/95 px-3 py-2.5 text-[15px] text-gray-200 placeholder:text-gray-500 outline-none transition-all duration-200 ease-in-out focus:ring-2 ring-offset-0 ${
                  formState.errors.name
                    ? 'border-red-500/40 focus:ring-red-500/40'
                    : 'border-neutral-700 hover:border-neutral-600 focus:ring-blue-600/40'
                }`}
                placeholder="e.g. Paris"
                {...register('name')}
              />
              {formState.errors.name && (
                <span className="text-[13px] text-red-300/90">
                  {String(formState.errors.name.message)}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-300">Country</span>
              <input
                className={`rounded-lg border bg-neutral-900/95 px-3 py-2.5 text-[15px] text-gray-200 placeholder:text-gray-500 outline-none transition-all duration-200 ease-in-out focus:ring-2 ring-offset-0 ${
                  formState.errors.country
                    ? 'border-red-500/40 focus:ring-red-500/40'
                    : 'border-neutral-700 hover:border-neutral-600 focus:ring-blue-600/40'
                }`}
                placeholder="e.g. France"
                {...register('country')}
              />
              {formState.errors.country && (
                <span className="text-[13px] text-red-300/90">
                  {String(formState.errors.country.message)}
                </span>
              )}
            </label>
          </div>
          <div className="w-full">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-300">Tourist Rating (0-5, optional)</span>
              <input
                type="number"
                min="0"
                max="5"
                className={`rounded-lg border bg-neutral-900/95 px-3 py-2.5 text-[15px] text-gray-200 placeholder:text-gray-500 outline-none transition-all duration-200 ease-in-out focus:ring-2 ring-offset-0 ${
                  formState.errors.touristRating
                    ? 'border-red-500/40 focus:ring-red-500/40'
                    : 'border-neutral-700 hover:border-neutral-600 focus:ring-blue-600/40'
                }`}
                placeholder="0-5 (leave empty for 0)"
                {...register('touristRating')}
              />
              {formState.errors.touristRating && (
                <span className="text-[13px] text-red-300/90">
                  {String(formState.errors.touristRating.message)}
                </span>
              )}
            </label>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-300">Tourist Rating (0-5)</span>
            <input
              type="number"
              min="0"
              max="5"
              className={`rounded-lg border bg-neutral-900/95 px-3 py-2.5 text-[15px] text-gray-200 placeholder:text-gray-500 outline-none transition-all duration-200 ease-in-out focus:ring-2 ring-offset-0 ${
                formState.errors.touristRating
                  ? 'border-red-500/40 focus:ring-red-500/40'
                  : 'border-neutral-700 hover:border-neutral-600 focus:ring-blue-600/40'
              }`}
              placeholder="0-5"
              {...register('touristRating')}
            />
            {formState.errors.touristRating && (
              <span className="text-[13px] text-red-300/90">
                {String(formState.errors.touristRating.message)}
              </span>
            )}
          </label>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          className="w-full mx-auto block rounded-lg bg-gradient-to-b from-blue-600 to-blue-500 text-white px-5 py-2.5 text-[15px] shadow ring-1 ring-white/10 hover:shadow-blue-500/20 hover:brightness-110 active:brightness-95 transition-all duration-200 ease-in-out hover:scale-[1.02]"
        >
          Save
        </button>
      </div>
    </form>
  );
}
