import type { CombatData } from "./doCombat"
import { doCombat } from "./doCombat"
import type { Lane, State } from "./common"
import { Role, StatusCode } from "./common"

export function doMoveCombat(state: State, lane: Lane): (
	{ status: StatusCode.Okay | StatusCode.DefenderWin | StatusCode.AttackerWin } & CombatData
) | {
	status:
		StatusCode.MadeMoveOnFinishedGame |
		StatusCode.DefenderInitiatedCombat |
		StatusCode.AttackerInitiatedCombatWithEmptyStack
} {
	if (state.turn >= state.maxTurns)
		return { status: StatusCode.MadeMoveOnFinishedGame }

	const roleTurn: Role = (state.turn % 2) + 1

	if (roleTurn == Role.Defender)
		return { status: StatusCode.DefenderInitiatedCombat }

	if (!state.attackerStacks[lane].length)
		return { status: StatusCode.AttackerInitiatedCombatWithEmptyStack }

	const combatResult = doCombat(state, lane)

	if (combatResult.status == StatusCode.AttackerWin)
		return combatResult

	state.turn++

	if (state.turn == state.maxTurns)
		return { ...combatResult, status: StatusCode.DefenderWin }

	return combatResult
}
