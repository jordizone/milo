# Database Migration Instructions

This directory contains SQL migrations for the Milo flashcard application.

## Migration: Create Decks and Cards Tables

**File:** `20250122_create_decks_and_cards.sql`

This migration creates the core database schema for the flashcard application with:

### Tables

#### `decks`

- Stores flashcard decks for each user
- Fields: `id`, `user_id`, `name`, `description`, `is_public`, `created_at`, `updated_at`
- Includes RLS policies so users can only access their own decks (or public ones)

#### `cards`

- Stores individual flashcards with SM-2 spaced repetition data
- Fields: `id`, `deck_id`, `user_id`, `front`, `back`, `created_at`, `updated_at`
- **SM-2 Algorithm fields:**
  - `repetitions` - Number of consecutive correct reviews
  - `interval` - Current interval in days
  - `easiness_factor` - EF value (starts at 2.5)
  - `next_review` - When the card is next due
  - `last_reviewed` - Last review timestamp
  - `history` - JSONB array of review history

### Features

- **Row Level Security (RLS):** Each user can only see and modify their own data
- **Indexes:** Optimized for querying due cards and deck-based queries
- **Auto-updating timestamps:** `updated_at` automatically updates on record changes
- **Cascade deletes:** Deleting a deck removes all its cards

## How to Apply the Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `20250122_create_decks_and_cards.sql`
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed and linked to your project:

```bash
# Make sure you're in the project root
cd /home/jordi/Documents/dev/personal/milo

# Link to your Supabase project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Apply the migration
supabase db push
```

### Option 3: Manual SQL Execution

You can also connect to your Supabase database using any PostgreSQL client and execute the SQL file directly.

## Verification

After running the migration, verify it was successful:

1. Check that the tables exist:

   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('decks', 'cards');
   ```

2. Verify RLS is enabled:

   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public'
   AND tablename IN ('decks', 'cards');
   ```

3. Check indexes:
   ```sql
   SELECT indexname, tablename
   FROM pg_indexes
   WHERE schemaname = 'public'
   AND tablename IN ('decks', 'cards');
   ```

## TypeScript Types

The corresponding TypeScript types are available in:

- `app/types/database.ts` - Database table types and interfaces

## SM-2 Algorithm

The SM-2 spaced repetition algorithm implementation is in:

- `app/utils/sm2.ts` - Functions for calculating review intervals

## Next Steps

After applying the migration:

1. Update your Supabase client to use the new types
2. Create API routes for CRUD operations on decks and cards
3. Implement the review system using the SM-2 algorithm
4. Build UI components for deck and card management
