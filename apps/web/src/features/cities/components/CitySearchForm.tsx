import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const Schema = z.object({ name: z.string().min(1, 'Enter a city name') });

type Values = z.infer<typeof Schema>;

export function CitySearchForm({
  onSearch,
  initialName = '',
}: {
  onSearch: (name: string) => void;
  initialName?: string;
}) {
  const { register, handleSubmit, formState, reset } = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { name: initialName },
  });

  // Sync form value when initialName changes (e.g., when restoring from sessionStorage)
  useEffect(() => {
    reset({ name: initialName });
  }, [initialName, reset]);

  return (
    <form
      onSubmit={handleSubmit((v) => onSearch(v.name))}
      className="rounded-2xl p-3 bg-gray-900/80 backdrop-blur-sm ring-1 ring-white/5 shadow-xl shadow-black/30"
    >
      <div className="w-full flex flex-col">
        <div className="flex gap-2 items-stretch sm:items-center">
          <input
            className={`flex-1 rounded-lg border bg-neutral-900/90 px-3 py-2 text-[15px] text-gray-200 placeholder:text-gray-500 outline-none transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500/50 ring-offset-0 ${
              formState.errors.name
                ? 'border-red-500/40 focus:ring-red-500/40'
                : 'border-neutral-800 hover:border-neutral-700'
            }`}
            placeholder="Search cities..."
            {...register('name')}
          />
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-b from-blue-600 to-blue-500 text-white px-4 py-2 text-[15px] shadow ring-1 ring-white/10 hover:shadow-blue-500/20 hover:brightness-110 active:brightness-95 transition-all duration-200 ease-in-out"
          >
            Search
          </button>
        </div>
        {formState.errors.name && (
          <p className="text-[13px] text-red-300/90 mt-2.5">{formState.errors.name.message}</p>
        )}
      </div>
    </form>
  );
}
