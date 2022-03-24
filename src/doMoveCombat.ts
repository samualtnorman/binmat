import { Role, State } from "./createState"
import doCombat, { CombatData } from "./doCombat"
import { Lane, StatusCode } from "./shared"

export function doMoveCombat(state: State, lane: Lane): {
	status: StatusCode.MadeMoveOnFinishedGame | StatusCode.DefenderInitiatedCombat | StatusCode.AttackerInitiatedCombatWithEmptyStack
} | (
	CombatData & { status: StatusCode.Ok | StatusCode.DefenderWin | StatusCode.AttackerWin }
) {
	if (state.turn >= state.turns)
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

	if (state.turn == state.turns)
		return { ...combatResult, status: StatusCode.DefenderWin }

	return combatResult
}

export default doMoveCombat