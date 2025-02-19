import type { LaxPartial } from "@samual/lib"
import { shuffle as defaultShuffleFunction } from "@samual/lib/shuffle"
import type { CardString, Lane, ShuffleFunction, State } from "./common"
import { AttackerDeck, AttackerDiscardPile, Role, StatusCode } from "./common"

export function doMoveDraw(
	state: State,
	deckToDrawFrom: Lane | AttackerDeck,
	{ shuffleFunction: shuffle = defaultShuffleFunction }: LaxPartial<{ shuffleFunction: ShuffleFunction }> = {}
): {
	status: StatusCode.Okay | StatusCode.DefenderWin
	cardDrawn: CardString
} | {
	status:
		StatusCode.MadeMoveOnFinishedGame |
		StatusCode.DefenderDrewFromAttackerDeck |
		StatusCode.AttackerDrewFromBlockedLane |
		StatusCode.AttackerDrewFromEmptyDiscardAndDeck |
		StatusCode.AttackerWin
} {
	if (state.turn >= state.maxTurns)
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

	if (roleTurn == Role.Defender)
		state.defenderPassedLastTurn = false
	else
		state.attackerPassedLastTurn = false

	if (state.turn == state.maxTurns)
		return { status: StatusCode.DefenderWin, cardDrawn }

	return { status: StatusCode.Okay, cardDrawn }
}
