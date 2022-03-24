import { Card, CardModifier, CardValue, Role, State } from "./createState"
import doCombat, { CombatData } from "./doCombat"
import { Lane, StatusCode } from "./shared"

export function doMovePlayFaceup(state: State, card: Card | CardValue, lane: Lane): {
	status: StatusCode.MadeMoveOnFinishedGame
		| StatusCode.PlayedUnownedCard
		| StatusCode.PlayedBreakToEmptyStack
		| StatusCode.PlayedCardFacedWrongWay
} | {
	status: StatusCode.Ok | StatusCode.DefenderWin | StatusCode.AttackerWin
	cardPlayed: Card

	combat: CombatData | undefined
} {
	if (state.turn >= state.turns)
		return { status: StatusCode.MadeMoveOnFinishedGame }

	const roleTurn: Role = (state.turn % 2) + 1
	let cardPlayed
	let combat: CombatData | undefined

	if (roleTurn == Role.Defender) {
		const index = card.length == 2 ? state.defenderHand.indexOf(card as Card) : state.defenderHand.findIndex(([ value ]) => value == card)

		if (index == -1)
			return { status: StatusCode.PlayedUnownedCard }

		if (card[0] == CardModifier.Break) {
			if (!state.defenderStacks[lane].cards.length)
				return { status: StatusCode.PlayedBreakToEmptyStack }

			cardPlayed = state.defenderHand.splice(index, 1)[0]!
			state.defenderStacks[lane].cards.push(cardPlayed)

			let status

			({ status, ...combat } = doCombat(state, lane))

			if (status == StatusCode.AttackerWin)
				return { status, cardPlayed, combat }
		} else {
			if (!state.defenderStacks[lane].faceup)
				return { status: StatusCode.PlayedCardFacedWrongWay }

			cardPlayed = state.defenderHand.splice(index, 1)[0]!
			state.defenderStacks[lane].cards.push(cardPlayed)
		}
	} else /* attacker turn */ {
		const index = card.length == 2 ? state.attackerHand.indexOf(card as Card) : state.attackerHand.findIndex(([ value ]) => value == card)

		if (index == -1)
			return { status: StatusCode.PlayedUnownedCard }

		if (card[0] == CardModifier.Break) {
			if (!state.attackerStacks[lane].length)
				return { status: StatusCode.PlayedBreakToEmptyStack }

			cardPlayed = state.attackerHand.splice(index, 1)[0]!
			state.attackerStacks[lane].push(cardPlayed)

			let status

			({ status, ...combat } = doCombat(state, lane))

			if (status == StatusCode.AttackerWin)
				return { status, cardPlayed, combat }
		} else if (card[0] == CardModifier.Bounce) {
			cardPlayed = state.attackerHand.splice(index, 1)[0]!
			state.attackerStacks[lane].push(cardPlayed)

			let status

			({ status, ...combat } = doCombat(state, lane))

			if (status == StatusCode.AttackerWin)
				return { status, cardPlayed, combat }
		} else
			return { status: StatusCode.PlayedCardFacedWrongWay }
	}

	state.turn++

	if (state.turn == state.turns)
		return { status: StatusCode.DefenderWin, cardPlayed, combat }

	return { status: StatusCode.Ok, cardPlayed, combat }
}

export default doMovePlayFaceup