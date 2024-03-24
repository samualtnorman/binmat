import type { State } from "./common"
import { Role, StatusCode } from "./common"

export function doMovePass(state: State) {
	if (state.turn >= state.maxTurns)
		return StatusCode.MadeMoveOnFinishedGame

	const roleTurn: Role = (state.turn % 2) + 1

	if (roleTurn == Role.Defender) {
		if (state.defenderPassedLastTurn) {
			for (const card of state.defenderHand.splice(0)) {
				let smallestDiscardPile = state.laneDiscardPiles[0]

				for (const discardPile of state.laneDiscardPiles.slice(1)) {
					if (discardPile.length < smallestDiscardPile.length)
						smallestDiscardPile = discardPile
				}

				smallestDiscardPile.push(card)
			}
		} else
			state.defenderPassedLastTurn = true
	} else /* attacker turn */ if (state.attackerPassedLastTurn)
		state.attackerDiscardPile.push(...state.attackerHand.splice(0))
	else
		state.attackerPassedLastTurn = true

	state.turn++

	if (state.turn == state.maxTurns)
		return StatusCode.DefenderWin

	return StatusCode.Okay
}
