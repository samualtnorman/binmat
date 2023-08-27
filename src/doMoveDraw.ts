import type { LaxPartial } from "@samual/lib"
import { shuffle as shuffle_ } from "@samual/lib/shuffle"
import type { Card, InjectShuffleOptions, Lane, State } from "./shared"
import { AttackerDeck, AttackerDiscardPile, Role, StatusCode } from "./shared"

export function doMoveDraw(
	state: State,
	deckToDrawFrom: Lane | AttackerDeck,
	{ shuffle = shuffle_ }: LaxPartial<InjectShuffleOptions> = {}
): { status: StatusCode.Ok | StatusCode.DefenderWin, cardDrawn: Card } | {
	status: StatusCode.MadeMoveOnFinishedGame | StatusCode.DefenderDrewFromAttackerDeck |
		StatusCode.AttackerDrewFromBlockedLane | StatusCode.AttackerDrewFromEmptyDiscardAndDeck | StatusCode.AttackerWin
} {
	if (state.turn >= state.turns)
		return { status: StatusCode.MadeMoveOnFinishedGame }

	const roleTurn: Role = (state.turn % 2) + 1

	if (roleTurn == Role.Defender) {
		if (deckToDrawFrom == AttackerDeck)
			return { status: StatusCode.DefenderDrewFromAttackerDeck }
	} else /* attacker turn */ if (deckToDrawFrom != AttackerDeck && state.defenderStacks[deckToDrawFrom].cards.length)
		return { status: StatusCode.AttackerDrewFromBlockedLane }

	const deck = deckToDrawFrom == AttackerDeck ? state.attackerDeck : state.laneDecks[deckToDrawFrom]

	if (!deck.length) {
		const discardPile = deckToDrawFrom == AttackerDiscardPile
			? state.attackerDiscardPile
			: state.laneDiscardPiles[deckToDrawFrom]

		if (!discardPile.length) {
			if (deckToDrawFrom == AttackerDeck)
				return { status: StatusCode.AttackerDrewFromEmptyDiscardAndDeck }

			return { status: StatusCode.AttackerWin }
		}

		deck.push(...shuffle(discardPile.splice(0)))
	}

	const cardDrawn = deck.pop()!

	if (roleTurn == Role.Defender)
		state.defenderHand.push(cardDrawn)
	else /* attacker turn */
		state.attackerHand.push(cardDrawn)

	state.turn++

	if (state.turn == state.turns)
		return { status: StatusCode.DefenderWin, cardDrawn }

	return { status: StatusCode.Ok, cardDrawn }
}
