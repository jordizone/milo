# Supabase Setup

This project uses Supabase for authentication and database functionality.

## Installation

Supabase has been installed with the following packages:

- `@supabase/supabase-js` - Main Supabase client library
- `@supabase/ssr` - Server-side rendering utilities

## Configuration

1. Create a `.env` file in the root directory (use `.env.example` as a template):

   ```bash
   cp .env.example .env
   ```

2. Add your Supabase credentials to `.env`:

   ```
   SUPABASE_URL=your-project-url.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

   You can find these values in your [Supabase Dashboard](https://app.supabase.com) under Project Settings > API.

## Usage

### Client-side (Browser)

```typescript
import { createClient } from '~/utils/supabase/client'

// In a component
const supabase = createClient()
const { data, error } = await supabase.from('table_name').select('*')
```

### Server-side (Loaders/Actions)

```typescript
import { createClient } from '~/utils/supabase/server'

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createClient(request)

  const { data, error } = await supabase.from('table_name').select('*')

  return json({ data }, { headers })
}
```

## Files Created

- `app/utils/supabase/client.ts` - Browser client
- `app/utils/supabase/server.ts` - Server client with cookie handling
- `app/env.d.ts` - TypeScript declarations for environment variables
- `.env.example` - Environment variables template

## Next Steps

1. Set up your Supabase project at https://supabase.com
2. Configure authentication providers in Supabase Dashboard
3. Create database tables and set up Row Level Security (RLS)
4. Implement authentication in your login route
