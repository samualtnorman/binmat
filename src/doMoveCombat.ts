import type { CombatData } from "./doCombat"
import { doCombat } from "./doCombat"
import { type state as State, type lane as Lane, turnToRole, getLaneStack } from "./shared"

export function doMoveCombat(state: State, lane: Lane): (
	{ status: `Okay` | `DefenderWin` | `AttackerWin` } & CombatData
) | {
	status:
		`MadeMoveOnFinishedGame` |
		`DefenderInitiatedCombat` |
		`AttackerInitiatedCombatWithEmptyStack`
} {
	if (state.turn >= state.turns)
		return { status: `MadeMoveOnFinishedGame` }

	const roleTurn = turnToRole(state.turn)

	if (roleTurn == `Defender`)
		return { status: `DefenderInitiatedCombat` }

	if (!getLaneStack(state.attackerStacks, lane).length)
		return { status: `AttackerInitiatedCombatWithEmptyStack` }

	const combatResult = doCombat(state, lane)

	if (combatResult.status == `AttackerWin`)
		return combatResult

	// @ts-expect-error -- rescript
	state.turn++

	if (state.turn == state.turns)
		return { ...combatResult, status: `DefenderWin` }

	return combatResult
}
