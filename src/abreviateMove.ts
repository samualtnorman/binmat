import { MoveTag, type Move, type MoveString } from "./common"

export function abreviateMove(move: Move): MoveString {
	switch (move.tag) {
		case MoveTag.Draw:
			return `d${move.deck == 6 ? `a` : move.deck}`

		case MoveTag.Combat:
			return `c${move.lane}`

		case MoveTag.Play:
			return `p${move.card}${move.lane}`

		case MoveTag.PlayFaceUp:
			return `u${move.card}${move.lane}`

		case MoveTag.Discard:
			return `x${move.card}${move.discardPile == 6 ? `a` : move.discardPile}`

		case MoveTag.Pass:
			return `--`
	}
}
