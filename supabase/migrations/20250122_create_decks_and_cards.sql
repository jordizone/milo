-- Create decks table
CREATE TABLE IF NOT EXISTS public.decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cards table with SM-2 spaced repetition fields
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  
  -- SM-2 Algorithm fields for spaced repetition
  repetitions INTEGER DEFAULT 0,
  interval INTEGER DEFAULT 0,
  easiness_factor FLOAT DEFAULT 2.5,
  next_review TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed TIMESTAMPTZ,
  history JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_decks_user_id ON public.decks(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON public.cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON public.cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_next_review ON public.cards(next_review);
CREATE INDEX IF NOT EXISTS idx_cards_deck_next_review ON public.cards(deck_id, next_review);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to auto-update updated_at
CREATE TRIGGER update_decks_updated_at
  BEFORE UPDATE ON public.decks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON public.cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for decks table
-- Users can view their own decks or public decks
CREATE POLICY "Users can view own decks"
  ON public.decks
  FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

-- Users can insert their own decks
CREATE POLICY "Users can insert own decks"
  ON public.decks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own decks
CREATE POLICY "Users can update own decks"
  ON public.decks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own decks
CREATE POLICY "Users can delete own decks"
  ON public.decks
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for cards table
-- Users can view their own cards
CREATE POLICY "Users can view own cards"
  ON public.cards
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own cards
CREATE POLICY "Users can insert own cards"
  ON public.cards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cards
CREATE POLICY "Users can update own cards"
  ON public.cards
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own cards
CREATE POLICY "Users can delete own cards"
  ON public.cards
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE public.decks IS 'Stores flashcard decks for each user';
COMMENT ON TABLE public.cards IS 'Stores individual flashcards with SM-2 spaced repetition data';
COMMENT ON COLUMN public.cards.repetitions IS 'Number of consecutive correct reviews';
COMMENT ON COLUMN public.cards.interval IS 'Current interval in days until next review';
COMMENT ON COLUMN public.cards.easiness_factor IS 'SM-2 easiness factor (EF), typically starts at 2.5';
COMMENT ON COLUMN public.cards.next_review IS 'Timestamp when the card is next due for review';
COMMENT ON COLUMN public.cards.last_reviewed IS 'Timestamp of the last review';
COMMENT ON COLUMN public.cards.history IS 'JSON array of review history with ratings and dates';
