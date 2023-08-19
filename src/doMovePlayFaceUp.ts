import { assert } from "@samual/lib/assert"
import type { CombatData } from "./doCombat"
import doCombat from "./doCombat"
import type { Card, CardValue, Lane, State } from "./shared"
import { CardModifier, Role, StatusCode } from "./shared"

export function doMovePlayFaceUp(state: State, card: Card | CardValue, lane: Lane): {
	status: StatusCode.Ok | StatusCode.DefenderWin | StatusCode.AttackerWin
	cardPlayed: Card
	combat: CombatData | undefined
} | {
	status:
		StatusCode.MadeMoveOnFinishedGame |
		StatusCode.PlayedUnownedCard |
		StatusCode.PlayedBreakToEmptyStack |
		StatusCode.PlayedCardFacedWrongWay |
		StatusCode.DefenderPlayedFaceUpBreakToStackWithBreak
} {
	if (state.turn >= state.turns)
		return { status: StatusCode.MadeMoveOnFinishedGame }

	const roleTurn: Role = (state.turn % 2) + 1
	let cardPlayed
	let combat: CombatData | undefined

	if (roleTurn == Role.Defender) {
		const index = card.length == 2
			? state.defenderHand.indexOf(card as Card)
			: state.defenderHand.findIndex(([ value ]) => value == card)

		if (index == -1)
			return { status: StatusCode.PlayedUnownedCard }

		if (card[0] == CardModifier.Break) {
			if (!state.defenderStacks[lane].cards.length)
				return { status: StatusCode.PlayedBreakToEmptyStack }

			if (state.defenderStacks[lane].cards.some(card => card[0] == CardModifier.Break))
				return { status: StatusCode.DefenderPlayedFaceUpBreakToStackWithBreak }

			cardPlayed = state.defenderHand.splice(index, 1)[0]!
			state.defenderStacks[lane].cards.push(cardPlayed)

			let status

			({ status, ...combat } = doCombat(state, lane))

			if (status == StatusCode.AttackerWin)
				return { status, cardPlayed, combat }
		} else {
			if (!state.defenderStacks[lane].isFaceUp)
				return { status: StatusCode.PlayedCardFacedWrongWay }

			cardPlayed = state.defenderHand.splice(index, 1)[0]!
			state.defenderStacks[lane].cards.push(cardPlayed)
		}
	} else /* attacker turn */ {
		const index = card.length == 2
			? state.attackerHand.indexOf(card as Card)
			: state.attackerHand.findIndex(([ value ]) => value == card)

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
			assert(status != StatusCode.AttackerWin, `attacker won when playing a face up bounce`)
		} else
			return { status: StatusCode.PlayedCardFacedWrongWay }
	}

	state.turn++

	if (state.turn == state.turns)
		return { status: StatusCode.DefenderWin, cardPlayed, combat }

	return { status: StatusCode.Ok, cardPlayed, combat }
}

export default doMovePlayFaceUp
