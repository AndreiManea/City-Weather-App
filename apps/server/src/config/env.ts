import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z
    .string()
    .transform((v) => (v ? Number(v) : 4000))
    .pipe(z.number().int().positive())
    .default('4000'),
  OPENWEATHER_API_KEY: z.string().optional(),
});

const parsed = EnvSchema.safeParse(process.env as Record<string, string | undefined>);
if (!parsed.success) {
  // In tests, allow partial env; otherwise throw
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error('Invalid environment variables', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }
}

export const env = parsed.success
  ? { ...parsed.data, PORT: parsed.data.PORT as unknown as number }
  : {
      NODE_ENV: process.env.NODE_ENV || 'test',
      PORT: 0,
      OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    };
