import { shuffle } from "@samual/lib/shuffle"
import {
	getLaneStack,
	turnToRole,
	type card as Card,
	type laneOrAttacker as LaneOrAttacker,
	type state as State
} from "./shared"

export function doMoveDraw(state: State, deckToDrawFrom: LaneOrAttacker): {
	status: `Okay` | `DefenderWin`
	cardDrawn: Card
} | {
	status:
		`MadeMoveOnFinishedGame` |
		`DefenderDrewFromAttackerDeck` |
		`AttackerDrewFromBlockedLane` |
		`AttackerDrewFromEmptyDiscardAndDeck` |
		`AttackerWin`
} {
	if (state.turn >= state.turns)
		return { status: `MadeMoveOnFinishedGame` }

	const roleTurn = turnToRole(state.turn)

	if (roleTurn == `Defender`) {
		if (deckToDrawFrom == `Attacker`)
			return { status: `DefenderDrewFromAttackerDeck` }
	} else /* attacker turn */ if (deckToDrawFrom != `Attacker` && getLaneStack(state.defenderStacks, deckToDrawFrom).cards.length)
		return { status: `AttackerDrewFromBlockedLane` }

	const deck = deckToDrawFrom == `Attacker` ? state.attackerDeck : getLaneStack(state.laneDecks, deckToDrawFrom)

	if (!deck.length) {
		const discardPile = deckToDrawFrom == `Attacker`
			? state.attackerDiscardPile
			: getLaneStack(state.laneDiscardPiles, deckToDrawFrom)

		if (!discardPile.length) {
			if (deckToDrawFrom == `Attacker`)
				return { status: `AttackerDrewFromEmptyDiscardAndDeck` }

			return { status: `AttackerWin` }
		}

		deck.push(...shuffle(discardPile.splice(0)))
	}

	const cardDrawn = deck.pop()!

	if (roleTurn == `Defender`)
		state.defenderHand.push(cardDrawn)
	else /* attacker turn */
		state.attackerHand.push(cardDrawn)

	// @ts-expect-error rescript
	state.turn++

	if (state.turn == state.turns)
		return { status: `DefenderWin`, cardDrawn }

	return { status: `Okay`, cardDrawn }
}
