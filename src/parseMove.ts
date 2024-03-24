import { assert } from "@samual/lib/assert"
import type { Card, CardValue, Lane, Move } from "./common"
import { AttackerDeck, AttackerDiscardPile, CardModifier, CardSuit, MoveTag } from "./common"

export const CardValues: CardValue[] = [
	`2`,
	`3`,
	`4`,
	`5`,
	`6`,
	`7`,
	`8`,
	`9`,
	`a`,
	CardModifier.Trap,
	CardModifier.Wild,
	CardModifier.Bounce,
	CardModifier.Break
]

export const CardSuits: CardSuit[] = [
	CardSuit.Form,
	CardSuit.Kin,
	CardSuit.Data,
	CardSuit.Chaos,
	CardSuit.Void,
	CardSuit.Choice
]

export function parseMove(move: string, extra = false): Move {
	assert(move.length > 1, `move must at least than 2 character, got ${move.length}`)

	if (move == `--`)
		return { tag: MoveTag.Pass }

	switch (move[0]) {
		case `d`: {
			assert(move.length == 2, `draw moves must always be 2 characters, got ${move.length}`)

			if (move[1] == `a`) {
				return {
					tag: MoveTag.Draw,
					deck: AttackerDeck
				}
			}

			const lane = Number(move[1])

			assert(lane >= 0 && lane < 6, `invalid lane number "${move[1]}" (expected 0 - 5 or "a")`)

			return {
				tag: MoveTag.Draw,
				deck: lane as Lane
			}
		}

		case `c`: {
			assert(move.length == 2, `combat moves must always be 2 characters, got ${move.length}`)

			const lane = Number(move[1])

			assert(lane >= 0 && lane < 6, `invalid lane number "${move[1]}" (expected 0 - 5)`)

			return {
				tag: MoveTag.Combat,
				lane: lane as Lane
			}
		}

		case `p`:
		case `u`: {
			if (move.length == 3) {
				assert(
					CardValues.includes(move[1] as any),
					`invalid card value "${move[1]}" (expected one of ${CardValues.join(`, `)})`
				)

				const lane = Number(move[2])

				assert(lane >= 0 && lane < 6, `invalid lane number "${move[2]}" (expected 0 - 5)`)

				return {
					tag: move[0] == `p` ? MoveTag.Play : MoveTag.PlayFaceUp,
					card: move[1] as CardValue,
					lane: lane as Lane
				}
			}

			if (move.length == 4) {
				assert(
					CardValues.includes(move[1] as any),
					`invalid card value "${move[1]}" (expected one of ${CardValues.join(`, `)})`
				)

				assert(
					CardSuits.includes(move[2] as any),
					`invalid card suit "${move[2]}" (expected one of ${CardSuits.join(`, `)})`
				)

				const lane = Number(move[3])

				assert(lane >= 0 && lane < 6, `invalid lane number "${move[3]}" (expected 0 - 5)`)

				return {
					tag: move[0] == `p` ? MoveTag.Play : MoveTag.PlayFaceUp,
					card: move.slice(1, 3) as Card,
					lane: lane as Lane
				}
			}

			throw new Error(`play moves must be 3 or 4 characters, got ${move.length}`)
		}

		case `x`: {
			assert(
				CardValues.includes(move[1] as any),
				`invalid card value "${move[1]}" (expected one of ${CardValues.join(`, `)})`
			)

			if (extra && move.length == 2) {
				return {
					tag: MoveTag.Discard,
					card: move[1] as CardValue,
					discardPile: AttackerDiscardPile
				}
			}

			if (move.length == 3) {
				if (move[2] == `a`) {
					return {
						tag: MoveTag.Discard,
						card: move[1] as CardValue,
						discardPile: AttackerDiscardPile
					}
				}

				if (extra && CardSuits.includes(move[2] as any)) {
					return {
						tag: MoveTag.Discard,
						card: move.slice(1, 3) as Card,
						discardPile: AttackerDiscardPile
					}
				}

				const lane = Number(move[2])

				assert(lane >= 0 && lane < 6, `invalid discard pile "${move[2]}" (expected 0 - 5 or "a")`)

				return {
					tag: MoveTag.Discard,
					card: move[1] as CardValue,
					discardPile: lane as Lane
				}
			}

			if (move.length == 4) {
				assert(
					CardSuits.includes(move[2] as any),
					`invalid card suit "${move[2]}" (expected one of ${CardSuits.join(`, `)})`
				)

				if (move[3] == `a`) {
					return {
						tag: MoveTag.Discard,
						card: move.slice(1, 3) as Card,
						discardPile: AttackerDiscardPile
					}
				}

				const lane = Number(move[3])

				assert(lane >= 0 && lane < 6, `invalid discard pile "${move[3]}" (expected 0 - 5 or "a")`)

				return {
					tag: MoveTag.Discard,
					card: move.slice(1, 3) as Card,
					discardPile: lane as Lane
				}
			}

			throw new Error(`discard moves must be 3 or 4 characters, got ${move.length}`)
		}

		default:
			throw new Error(`Invalid move tag "${move[0]}" in "${move}"`)
	}
}
