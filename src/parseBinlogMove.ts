import { assert, AssertError } from "@samual/lib/assert"
import type { CardString, CardStringFace, Lane } from "./common"
import { AttackerDeck, AttackerDiscardPile, CardStringFaces, MoveTag } from "./common"
import { isCard } from "./isCard"

export type BinlogMoveDraw = { tag: MoveTag.Draw, deck: Lane | AttackerDeck }
export type BinlogMovePlay = { tag: MoveTag.Play, lane: Lane }
export type BinlogMovePlayFaceUp = { tag: MoveTag.PlayFaceUp, card: CardString | CardStringFace, lane: Lane }
export type BinlogMoveCombat = { tag: MoveTag.Combat, lane: Lane }

export type BinlogMoveDiscard = {
	tag: MoveTag.Discard
	card: CardString | CardStringFace
	discardPile: Lane | AttackerDiscardPile
}

export type BinlogMovePass = { tag: MoveTag.Pass }

export type BinlogMove =
	BinlogMoveDraw | BinlogMovePlay | BinlogMovePlayFaceUp | BinlogMoveCombat | BinlogMoveDiscard | BinlogMovePass

export function parseMove(move: string): BinlogMove {
	assert(move.length > 1, HERE)

	if (move == `\`n--\``)
		return { tag: MoveTag.Pass }

	// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
	switch (move[0]) {
		case `d`: {
			assert(move.length == 2, `${HERE} "${move}"`)

			if (move[1] == `a`)
				return { tag: MoveTag.Draw, deck: AttackerDeck }

			const lane = Number(move[1])

			assert(lane >= 0 && lane < 6, HERE)

			return { tag: MoveTag.Draw, deck: lane as Lane }
		}

		case `c`: {
			assert(move.length == 2, HERE)

			const lane = Number(move[1])

			assert(lane >= 0 && lane < 6, HERE)

			return { tag: MoveTag.Combat, lane: lane as Lane }
		}

		case `p`: {
			assert(move.length == 3, HERE)
			assert(move[1] == `X`, HERE)

			const lane = Number(move[2])

			assert(lane >= 0 && lane < 6, HERE)

			return { tag: MoveTag.Play, lane: lane as Lane }
		}

		case `u`: {
			if (move.length == 3) {
				assert(CardStringFaces.includes(move[1]!), HERE)

				const lane = Number(move[2])

				assert(lane >= 0 && lane < 6, HERE)

				return { tag: MoveTag.PlayFaceUp, card: move[1] as CardStringFace, lane: lane as Lane }
			}

			if (move.length == 4) {
				const card = move.slice(1, 3)

				assert(isCard(card), HERE)

				const lane = Number(move[3])

				assert(lane >= 0 && lane < 6, HERE)

				return { tag: MoveTag.PlayFaceUp, card, lane: lane as Lane }
			}

			break
		}

		case `x`: {
			if (move.length == 3) {
				assert(CardStringFaces.includes(move[1]!), HERE)

				if (move[2] == `a`)
					return { tag: MoveTag.Discard, card: move[1] as CardStringFace, discardPile: AttackerDiscardPile }

				const lane = Number(move[2])

				assert(lane >= 0 && lane < 6, HERE)

				return { tag: MoveTag.Discard, card: move[1] as CardStringFace, discardPile: lane as Lane }
			}

			if (move.length == 4) {
				const card = move.slice(1, 3)

				assert(isCard(card), HERE)

				if (move[3] == `a`)
					return { tag: MoveTag.Discard, card, discardPile: AttackerDiscardPile }

				const lane = Number(move[3])

				assert(lane >= 0 && lane < 6, HERE)

				return { tag: MoveTag.Discard, card, discardPile: lane as Lane }
			}
		}
	}

	throw new AssertError(`${HERE} "${move}"`)
}
