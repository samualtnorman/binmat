import { Card, CardModifier, CardValue, Role, State } from "./createState"
import { Lane, StatusCode } from "./shared"

export function doMovePlay(state: State, card: Card | CardValue, lane: Lane): {
	status: StatusCode.MadeMoveOnFinishedGame
		| StatusCode.PlayedCardFacedWrongWay
		| StatusCode.PlayedBreakToEmptyStack
		| StatusCode.PlayedUnownedCard
} | {
	status: StatusCode.Ok | StatusCode.DefenderWin
	cardPlayed: Card
} {
	if (state.turn >= state.turns)
		return { status: StatusCode.MadeMoveOnFinishedGame }

	const roleTurn: Role = (state.turn % 2) + 1
	let cardPlayed

	if (roleTurn == Role.Defender) {
		if (state.defenderStacks[lane].faceup)
			return { status: StatusCode.PlayedCardFacedWrongWay }

		if (card[0] == CardModifier.Break && !state.defenderStacks[lane].cards.length)
			return { status: StatusCode.PlayedBreakToEmptyStack }

		const index = card.length == 2 ? state.defenderHand.indexOf(card as Card) : state.defenderHand.findIndex(([ value ]) => value == card)

		if (index == -1)
			return { status: StatusCode.PlayedUnownedCard }

		cardPlayed = state.defenderHand.splice(index, 1)[0]!
		state.defenderStacks[lane].cards.push(cardPlayed)
	} else /* attacker turn */ {
		if (card[0] == CardModifier.Break && !state.attackerStacks[lane].length)
			return { status: StatusCode.PlayedBreakToEmptyStack }

		const index = card.length == 2 ? state.attackerHand.indexOf(card as Card) : state.attackerHand.findIndex(([ value ]) => value == card)

		if (index == -1)
			return { status: StatusCode.PlayedUnownedCard }

		cardPlayed = state.attackerHand.splice(index, 1)[0]!
		state.attackerStacks[lane].push(cardPlayed)
	}

	state.turn++

	if (state.turn == state.turns)
		return { status: StatusCode.DefenderWin, cardPlayed }

	return { status: StatusCode.Ok, cardPlayed }
}

export default doMovePlay