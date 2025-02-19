import type { LaxPartial } from "@samual/lib"
import type { Lane, ShuffleFunction, State } from "./common"
import { Role, StatusCode } from "./common"
import type { CombatData } from "./doCombat"
import { doCombat } from "./doCombat"

export function doMoveCombat(state: State, lane: Lane, options?: LaxPartial<{ shuffleFunction: ShuffleFunction }>): (
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

	const combatResult = doCombat(state, lane, options)

	if (combatResult.status == StatusCode.AttackerWin)
		return combatResult

	state.turn++
	state.attackerPassedLastTurn = false

	if (state.turn == state.maxTurns)
		return { ...combatResult, status: StatusCode.DefenderWin }

	return combatResult
}
