import { assert } from "@samual/lib/assert"
import type { CardString, CardStringFace, Lane, Move } from "./common"
import { AttackerDeck, AttackerDiscardPile, CardStringFaces, CardStringSuits, MoveTag } from "./common"

export function parseMove(move: string, extra = false): Move {
	assert(move.length > 1, `move must at least than 2 character, got ${move.length}`)

	if (move == `--`)
		return { tag: MoveTag.Pass }

	switch (move[0]) {
		case `d`: {
			assert(move.length == 2, `draw moves must always be 2 characters, got ${move.length}`)

			if (move[1] == `a`)
				return { tag: MoveTag.Draw, deck: AttackerDeck }

			const lane = Number(move[1])

			assert(lane >= 0 && lane < 6, `invalid lane number "${move[1]}" (expected 0 - 5 or "a")`)

			return { tag: MoveTag.Draw, deck: lane as Lane }
		}

		case `c`: {
			assert(move.length == 2, `combat moves must always be 2 characters, got ${move.length}`)

			const lane = Number(move[1])

			assert(lane >= 0 && lane < 6, `invalid lane number "${move[1]}" (expected 0 - 5)`)

			return { tag: MoveTag.Combat, lane: lane as Lane }
		}

		case `p`:
		case `u`: {
			if (move.length == 3) {
				assert(
					CardStringFaces.includes(move[1]!),
					`invalid card value "${move[1]}" (expected one of ${CardStringFaces.join(`, `)})`
				)

				const lane = Number(move[2])

				assert(lane >= 0 && lane < 6, `invalid lane number "${move[2]}" (expected 0 - 5)`)

				return {
					tag: move[0] == `p` ? MoveTag.Play : MoveTag.PlayFaceUp,
					card: move[1] as CardStringFace,
					lane: lane as Lane
				}
			}

			if (move.length == 4) {
				assert(
					CardStringFaces.includes(move[1]!),
					`invalid card value "${move[1]}" (expected one of ${CardStringFaces.join(`, `)})`
				)

				assert(
					CardStringSuits.includes(move[2]!),
					`invalid card suit "${move[2]}" (expected one of ${CardStringSuits.join(`, `)})`
				)

				const lane = Number(move[3])

				assert(lane >= 0 && lane < 6, `invalid lane number "${move[3]}" (expected 0 - 5)`)

				return {
					tag: move[0] == `p` ? MoveTag.Play : MoveTag.PlayFaceUp,
					card: move.slice(1, 3) as CardString,
					lane: lane as Lane
				}
			}

			throw Error(`play moves must be 3 or 4 characters, got ${move.length}`)
		}

		case `x`: {
			assert(
				CardStringFaces.includes(move[1]!),
				`invalid card value "${move[1]}" (expected one of ${CardStringFaces.join(`, `)})`
			)

			if (extra && move.length == 2)
				return { tag: MoveTag.Discard, card: move[1] as CardStringFace, discardPile: AttackerDiscardPile }

			if (move.length == 3) {
				if (move[2] == `a`)
					return { tag: MoveTag.Discard, card: move[1] as CardStringFace, discardPile: AttackerDiscardPile }

				if (extra && CardStringSuits.includes(move[2]!)) {
					return {
						tag: MoveTag.Discard,
						card: move.slice(1, 3) as CardString,
						discardPile: AttackerDiscardPile
					}
				}

				const lane = Number(move[2])

				assert(lane >= 0 && lane < 6, `invalid discard pile "${move[2]}" (expected 0 - 5 or "a")`)

				return { tag: MoveTag.Discard, card: move[1] as CardStringFace, discardPile: lane as Lane }
			}

			if (move.length == 4) {
				assert(
					CardStringSuits.includes(move[2]!),
					`invalid card suit "${move[2]}" (expected one of ${CardStringSuits.join(`, `)})`
				)

				if (move[3] == `a`) {
					return {
						tag: MoveTag.Discard,
						card: move.slice(1, 3) as CardString,
						discardPile: AttackerDiscardPile
					}
				}

				const lane = Number(move[3])

				assert(lane >= 0 && lane < 6, `invalid discard pile "${move[3]}" (expected 0 - 5 or "a")`)

				return { tag: MoveTag.Discard, card: move.slice(1, 3) as CardString, discardPile: lane as Lane }
			}

			throw Error(`discard moves must be 3 or 4 characters, got ${move.length}`)
		}

		default:
			throw Error(`Invalid move tag "${move[0]}" in "${move}"`)
	}
}
