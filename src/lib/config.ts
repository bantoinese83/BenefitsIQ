import { z } from 'zod'

/**
 * Environment configuration schema.
 * Defines the contract between the environment and the application.
 */
const configSchema = z.object({
  supabase: z.object({
    url: z.string().url(),
    anonKey: z.string().min(1),
  }),
  claude: z.object({
    apiKey: z.string().optional(),
  }),
  isDev: z.boolean(),
  isProd: z.boolean(),
})

const rawConfig = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  claude: {
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
  },
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}

const parsedConfig = configSchema.safeParse(rawConfig)

if (!parsedConfig.success) {
  console.error('❌ Invalid environment configuration:', parsedConfig.error.format())
  throw new Error('Invalid environment configuration. Check your .env file.')
}

export const config = parsedConfig.data
