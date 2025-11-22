/**
 * Database types for Milo flashcard application
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      decks: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          is_public?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      cards: {
        Row: {
          id: string
          deck_id: string
          user_id: string
          front: string
          back: string
          repetitions: number
          interval: number
          easiness_factor: number
          next_review: string
          last_reviewed: string | null
          history: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deck_id: string
          user_id: string
          front: string
          back: string
          repetitions?: number
          interval?: number
          easiness_factor?: number
          next_review?: string
          last_reviewed?: string | null
          history?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          front?: string
          back?: string
          repetitions?: number
          interval?: number
          easiness_factor?: number
          next_review?: string
          last_reviewed?: string | null
          history?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}


/**
 * Deck - A collection of flashcards
 */
export type Deck = Database['public']['Tables']['decks']['Row']
export type DeckInsert = Database['public']['Tables']['decks']['Insert']
export type DeckUpdate = Database['public']['Tables']['decks']['Update']

/**
 * Review history entry for SM-2 algorithm
 */
export interface ReviewHistoryEntry {
  date: string
  rating: number // 0-5 quality rating
  interval: number
  easiness_factor: number
}

/**
 * Card - Individual flashcard with SM-2 spaced repetition data
 */
export type Card = Omit<Database['public']['Tables']['cards']['Row'], 'history'> & {
  history: ReviewHistoryEntry[]
}

export type CardInsert = Omit<Database['public']['Tables']['cards']['Insert'], 'history'> & {
  history?: ReviewHistoryEntry[]
}

export type CardUpdate = Omit<Database['public']['Tables']['cards']['Update'], 'history'> & {
  history?: ReviewHistoryEntry[]
}

/**
 * SM-2 Algorithm Quality Ratings
 * 0 - Complete blackout
 * 1 - Incorrect response; correct one remembered
 * 2 - Incorrect response; correct one seemed easy to recall
 * 3 - Correct response recalled with serious difficulty
 * 4 - Correct response after a hesitation
 * 5 - Perfect response
 */
export type SM2Quality = 0 | 1 | 2 | 3 | 4 | 5

/**
 * Result of SM-2 algorithm calculation
 */
export interface SM2Result {
  repetitions: number
  interval: number
  easiness_factor: number
  next_review: Date
}
