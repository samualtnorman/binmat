import { shuffle } from "@samual/lib"
import { Card, Role, State } from "./createState"
import { AttackerDeck, AttackerDiscardPile, Lane, StatusCode } from "./shared"

export function doMoveDraw(state: State, deckToDrawFrom: Lane | AttackerDeck): {
	status: StatusCode.MadeMoveOnFinishedGame
		| StatusCode.DefenderDrewFromAttackerDeck
		| StatusCode.AttackerDrewFromBlockedLane
		| StatusCode.AttackerDrewFromEmptyDiscardAndDeck
		| StatusCode.AttackerWin
} | {
	status: StatusCode.DefenderWin | StatusCode.Ok
	cardDrawn: Card
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

export default doMoveDraw
