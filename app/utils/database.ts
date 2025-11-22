import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Database,
  Deck,
  DeckInsert,
  DeckUpdate,
  Card,
  CardInsert,
  CardUpdate,
  SM2Quality,
  ReviewHistoryEntry,
} from '~/types/database'
import { calculateSM2 } from '~/utils/sm2'

/**
 * Deck operations
 */
export class DeckService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Get all decks for the current user
   */
  async getDecks() {
    const { data, error } = await this.supabase
      .from('decks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Deck[]
  }

  /**
   * Get a single deck by ID
   */
  async getDeck(id: string) {
    const { data, error } = await this.supabase
      .from('decks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Deck
  }

  /**
   * Create a new deck
   */
  async createDeck(deck: Omit<DeckInsert, 'user_id'>, userId: string) {
    const { data, error } = await this.supabase
      .from('decks')
      .insert({ ...deck, user_id: userId })
      .select()
      .single()

    if (error) throw error
    return data as Deck
  }

  /**
   * Update a deck
   */
  async updateDeck(id: string, updates: DeckUpdate) {
    const { data, error } = await this.supabase
      .from('decks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Deck
  }

  /**
   * Delete a deck (will cascade delete all cards)
   */
  async deleteDeck(id: string) {
    const { error } = await this.supabase.from('decks').delete().eq('id', id)

    if (error) throw error
  }

  /**
   * Get deck with card count
   */
  async getDeckWithStats(id: string) {
    const { data: deck, error: deckError } = await this.supabase
      .from('decks')
      .select('*')
      .eq('id', id)
      .single()

    if (deckError) throw deckError

    const { count, error: countError } = await this.supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('deck_id', id)

    if (countError) throw countError

    return {
      ...deck,
      card_count: count || 0,
    }
  }
}

/**
 * Card operations
 */
export class CardService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Get all cards for a deck
   */
  async getCards(deckId: string) {
    const { data, error } = await this.supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deckId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as unknown as Card[]
  }

  /**
   * Get cards due for review in a deck
   */
  async getDueCards(deckId: string) {
    const now = new Date().toISOString()
    const { data, error } = await this.supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deckId)
      .lte('next_review', now)
      .order('next_review', { ascending: true })

    if (error) throw error
    return data as unknown as Card[]
  }

  /**
   * Get a single card by ID
   */
  async getCard(id: string) {
    const { data, error } = await this.supabase
      .from('cards')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as unknown as Card
  }

  /**
   * Create a new card
   */
  async createCard(card: Omit<CardInsert, 'user_id'>, userId: string) {
    const { data, error } = await this.supabase
      .from('cards')
      .insert({ ...card, user_id: userId, history: card.history as any })
      .select()
      .single()

    if (error) throw error
    return data as unknown as Card
  }

  /**
   * Update a card
   */
  async updateCard(id: string, updates: CardUpdate) {
    const { data, error } = await this.supabase
      .from('cards')
      .update({ ...updates, history: updates.history as any })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as unknown as Card
  }

  /**
   * Delete a card
   */
  async deleteCard(id: string) {
    const { error } = await this.supabase.from('cards').delete().eq('id', id)

    if (error) throw error
  }

  /**
   * Review a card and update SM-2 values
   */
  async reviewCard(id: string, quality: SM2Quality) {
    // Get current card data
    const card = await this.getCard(id)

    // Calculate new SM-2 values
    const sm2Result = calculateSM2(
      quality,
      card.repetitions,
      card.interval,
      card.easiness_factor
    )

    // Add to history
    const historyEntry: ReviewHistoryEntry = {
      date: new Date().toISOString(),
      rating: quality,
      interval: sm2Result.interval,
      easiness_factor: sm2Result.easiness_factor,
    }

    const newHistory = [...card.history, historyEntry]
    // Keep only last 50 reviews
    if (newHistory.length > 50) {
      newHistory.shift()
    }

    // Update card with new values
    const updates: CardUpdate = {
      repetitions: sm2Result.repetitions,
      interval: sm2Result.interval,
      easiness_factor: sm2Result.easiness_factor,
      next_review: sm2Result.next_review.toISOString(),
      last_reviewed: new Date().toISOString(),
      history: newHistory,
    }

    return this.updateCard(id, updates)
  }

  /**
   * Get review statistics for a deck
   */
  async getDeckStats(deckId: string) {
    const cards = await this.getCards(deckId)
    const now = new Date()

    const stats = {
      total: cards.length,
      new: cards.filter((c) => c.repetitions === 0).length,
      learning: cards.filter((c) => c.repetitions > 0 && c.repetitions < 3)
        .length,
      review: cards.filter((c) => c.repetitions >= 3).length,
      due: cards.filter((c) => new Date(c.next_review) <= now).length,
    }

    return stats
  }
}
