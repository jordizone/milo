import type { SM2Quality, SM2Result } from '~/types/database'

/**
 * SM-2 Spaced Repetition Algorithm
 * 
 * This implementation is based on the SuperMemo SM-2 algorithm.
 * Reference: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 * 
 * @param quality - Quality of recall (0-5)
 *   0 - Complete blackout
 *   1 - Incorrect response; correct one remembered
 *   2 - Incorrect response; correct one seemed easy to recall
 *   3 - Correct response recalled with serious difficulty
 *   4 - Correct response after a hesitation
 *   5 - Perfect response
 * 
 * @param repetitions - Number of consecutive correct recalls
 * @param previousInterval - Previous interval in days
 * @param previousEF - Previous easiness factor
 * 
 * @returns SM2Result with updated values
 */
export function calculateSM2(
  quality: SM2Quality,
  repetitions: number = 0,
  previousInterval: number = 0,
  previousEF: number = 2.5
): SM2Result {
  let newRepetitions = repetitions
  let newInterval = previousInterval
  let newEF = previousEF

  // Calculate new easiness factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  newEF = previousEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  // Ensure EF doesn't go below 1.3
  if (newEF < 1.3) {
    newEF = 1.3
  }

  // If quality < 3, reset repetitions and interval
  if (quality < 3) {
    newRepetitions = 0
    newInterval = 1
  } else {
    // Increment repetitions
    newRepetitions = repetitions + 1

    // Calculate new interval based on repetitions
    if (newRepetitions === 1) {
      newInterval = 1
    } else if (newRepetitions === 2) {
      newInterval = 6
    } else {
      newInterval = Math.round(previousInterval * newEF)
    }
  }

  // Calculate next review date
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + newInterval)

  return {
    repetitions: newRepetitions,
    interval: newInterval,
    easiness_factor: Number(newEF.toFixed(2)),
    next_review: nextReview,
  }
}

/**
 * Get cards that are due for review
 * 
 * @param cards - Array of cards to filter
 * @returns Cards that are due for review (next_review <= now)
 */
export function getDueCards<T extends { next_review: string }>(cards: T[]): T[] {
  const now = new Date()
  return cards.filter((card) => new Date(card.next_review) <= now)
}

/**
 * Get the number of days until the next review
 * 
 * @param nextReview - ISO string of next review date
 * @returns Number of days until next review (negative if overdue)
 */
export function getDaysUntilReview(nextReview: string): number {
  const now = new Date()
  const reviewDate = new Date(nextReview)
  const diffTime = reviewDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Check if a card is due for review
 * 
 * @param nextReview - ISO string of next review date
 * @returns true if the card is due for review
 */
export function isCardDue(nextReview: string): boolean {
  return getDaysUntilReview(nextReview) <= 0
}
