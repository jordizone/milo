# Milo Database Schema

## Overview

The Milo flashcard application uses two main tables with Row Level Security (RLS) to ensure users can only access their own data.

## Tables

### `decks`

Stores flashcard decks for each user.

| Column        | Type        | Description                          |
| ------------- | ----------- | ------------------------------------ |
| `id`          | UUID        | Primary key                          |
| `user_id`     | UUID        | Foreign key to `auth.users`          |
| `name`        | TEXT        | Deck name                            |
| `description` | TEXT        | Optional deck description            |
| `is_public`   | BOOLEAN     | Whether the deck is publicly visible |
| `created_at`  | TIMESTAMPTZ | Creation timestamp                   |
| `updated_at`  | TIMESTAMPTZ | Last update timestamp (auto-updated) |

**Indexes:**

- `idx_decks_user_id` on `user_id`

**RLS Policies:**

- Users can view their own decks or public decks
- Users can insert/update/delete only their own decks

---

### `cards`

Stores individual flashcards with SM-2 spaced repetition data.

| Column            | Type        | Description                                        |
| ----------------- | ----------- | -------------------------------------------------- |
| `id`              | UUID        | Primary key                                        |
| `deck_id`         | UUID        | Foreign key to `decks`                             |
| `user_id`         | UUID        | Foreign key to `auth.users`                        |
| `front`           | TEXT        | Front of the flashcard                             |
| `back`            | TEXT        | Back of the flashcard                              |
| **SM-2 Fields**   |             |                                                    |
| `repetitions`     | INTEGER     | Number of consecutive correct reviews (default: 0) |
| `interval`        | INTEGER     | Current interval in days (default: 0)              |
| `easiness_factor` | FLOAT       | SM-2 easiness factor (default: 2.5)                |
| `next_review`     | TIMESTAMPTZ | When the card is next due for review               |
| `last_reviewed`   | TIMESTAMPTZ | Last review timestamp                              |
| `history`         | JSONB       | Array of review history entries                    |
| **Timestamps**    |             |                                                    |
| `created_at`      | TIMESTAMPTZ | Creation timestamp                                 |
| `updated_at`      | TIMESTAMPTZ | Last update timestamp (auto-updated)               |

**Indexes:**

- `idx_cards_deck_id` on `deck_id`
- `idx_cards_user_id` on `user_id`
- `idx_cards_next_review` on `next_review` (for efficient due card queries)
- `idx_cards_deck_next_review` on `(deck_id, next_review)`

**RLS Policies:**

- Users can view/insert/update/delete only their own cards

---

## SM-2 Spaced Repetition Algorithm

The SM-2 algorithm determines when a card should be reviewed next based on how well you remembered it.

### Quality Ratings (0-5)

- **0** - Complete blackout
- **1** - Incorrect response; correct one remembered
- **2** - Incorrect response; correct one seemed easy to recall
- **3** - Correct response recalled with serious difficulty
- **4** - Correct response after a hesitation
- **5** - Perfect response

### How It Works

1. **Initial State**: New cards start with:
   - `repetitions = 0`
   - `interval = 0`
   - `easiness_factor = 2.5`
   - `next_review = now`

2. **After Review**: Based on quality rating:
   - If quality < 3: Reset to beginning (interval = 1 day)
   - If quality ≥ 3: Increase interval based on easiness factor
3. **Interval Progression**:
   - 1st correct review: 1 day
   - 2nd correct review: 6 days
   - 3rd+ correct review: previous interval × easiness factor

4. **Easiness Factor**: Adjusted based on quality (stays ≥ 1.3)

### Review History

Each review is stored in the `history` JSONB field:

```json
[
  {
    "date": "2025-01-22T15:30:00Z",
    "rating": 4,
    "interval": 6,
    "easiness_factor": 2.5
  }
]
```

---

## Usage Examples

### Using the Service Classes

```typescript
import { createClient } from '~/utils/supabase/server'
import { DeckService, CardService } from '~/utils/database'

// In a loader or action
export async function loader({ request }: Route.LoaderArgs) {
  const supabase = createClient(request)
  const deckService = new DeckService(supabase)

  // Get all decks
  const decks = await deckService.getDecks()

  return { decks }
}
```

### Creating a Deck

```typescript
const deckService = new DeckService(supabase)
const deck = await deckService.createDeck(
  {
    name: 'Spanish Vocabulary',
    description: 'Common Spanish words and phrases',
  },
  userId,
)
```

### Creating a Card

```typescript
const cardService = new CardService(supabase)
const card = await cardService.createCard(
  {
    deck_id: deckId,
    front: 'Hello',
    back: 'Hola',
  },
  userId,
)
```

### Reviewing a Card

```typescript
const cardService = new CardService(supabase)

// User rated the card as "4" (correct after hesitation)
const updatedCard = await cardService.reviewCard(cardId, 4)

// The card's next_review, interval, and other SM-2 fields are automatically updated
```

### Getting Due Cards

```typescript
const cardService = new CardService(supabase)
const dueCards = await cardService.getDueCards(deckId)

// Returns only cards where next_review <= now
```

### Getting Deck Statistics

```typescript
const cardService = new CardService(supabase)
const stats = await cardService.getDeckStats(deckId)

// Returns:
// {
//   total: 100,
//   new: 20,      // repetitions === 0
//   learning: 30, // 0 < repetitions < 3
//   review: 50,   // repetitions >= 3
//   due: 15       // next_review <= now
// }
```

---

## Direct Supabase Queries

If you prefer not to use the service classes:

```typescript
// Get all decks
const { data: decks } = await supabase
  .from('decks')
  .select('*')
  .order('created_at', { ascending: false })

// Get due cards for a deck
const now = new Date().toISOString()
const { data: dueCards } = await supabase
  .from('cards')
  .select('*')
  .eq('deck_id', deckId)
  .lte('next_review', now)
  .order('next_review', { ascending: true })
```

---

## Files Reference

- **Migration**: `supabase/migrations/20250122_create_decks_and_cards.sql`
- **Types**: `app/types/database.ts`
- **SM-2 Algorithm**: `app/utils/sm2.ts`
- **Database Services**: `app/utils/database.ts`
