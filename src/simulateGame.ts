import { LaxPartial } from "@samual/lib"
import "../game-scripts/hackmud.d"
import createState, { Role } from "./createState"
import doMove from "./doMove"
import { BinmatArgs, generateArgsForAttacker, generateArgsForDefender } from "./generateArgs"
import parseMove from "./parseMove"
import { Action, StatusCode, statusCodeMessages } from "./shared"

export type SimulateGameOptions = {
	timeLimit: number
	defenderUserName: string
	attackerUserName: string
	noThrow: boolean
}

export type TransformScript = (args: { op: string }) => { ok: boolean }

/**
 *
 * @param defenderBrain defender brain script but with extra `xform` parameter to replace `#fs.binmat.x()` subscript
 * @param attackerBrain attacker brain script but with extra `xform` parameter to replace `#fs.binmat.x()` subscript
 * @param options {@link SimulateGameOptions details}
 * @returns who won
 */
export function simulateGame(
	defenderBrain: (context: CLIContext, args: BinmatArgs, xform: TransformScript) => void,
	attackerBrain: (context: CLIContext, args: BinmatArgs, xform: TransformScript) => void,
	{
		timeLimit = 5000,
		defenderUserName = `defender`,
		attackerUserName = `attacker`,
		noThrow = false
	}: LaxPartial<SimulateGameOptions> = {}
) {
	const state = createState()
	const endTime = Date.now() + timeLimit
	let winner: Role | undefined
	let defenderBinlog: string[] = []
	let attackerBinlog: string[] = []
	let madeMove: boolean

	while (true) {
		madeMove = false

		defenderBrain(
			{
				caller: defenderUserName,
				this_script: `${defenderUserName}.binmat_brain`,
				cols: 0,
				rows: 0,
				// eslint-disable-next-line unicorn/no-null
				calling_script: null
			},
			generateArgsForDefender(state, defenderUserName, attackerUserName, [ ...defenderBinlog, ...attackerBinlog ]),
			xform
		)

		if (!madeMove as boolean) {
			if (noThrow)
				doDefaultMove()
			else
				throw new Error(`defender brain did not attempt to make a move`)
		}

		if (winner)
			return winner

		madeMove = false

		attackerBrain(
			{
				caller: attackerUserName,
				this_script: `${attackerUserName}.binmat_brain`,
				cols: 0,
				rows: 0,
				// eslint-disable-next-line unicorn/no-null
				calling_script: null
			},
			generateArgsForAttacker(state, defenderUserName, attackerUserName, [ ...attackerBinlog, ...defenderBinlog ]),
			xform
		)

		if (!madeMove as boolean) {
			if (noThrow)
				doDefaultMove()
			else
				throw new Error(`defender brain did not attempt to make a move`)
		}

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (winner)
			return winner
	}

	function xform({ op }: { op: string }) {
		if (madeMove) {
			if (noThrow)
				return { ok: false }

			throw new Error(`only 1 move per turn`)
		}

		madeMove = true

		if (Date.now() > endTime) {
			if (noThrow)
				return doDefaultMove()

			throw new Error(`made move too late`)
		}

		let move

		try {
			move = parseMove(op)
		} catch (error) {
			if (noThrow)
				return doDefaultMove()

			throw error
		}

		const result = doMove(state, move)

		switch (result.status) {
			case StatusCode.Ok: break

			case StatusCode.AttackerWin: {
				winner = Role.Attacker
			} break

			case StatusCode.DefenderWin: {
				winner = Role.Defender
			} break

			default: {
				if (noThrow)
					return doDefaultMove()

				throw new Error(statusCodeMessages[result.status])
			}
		}

		if (state.turn % 2) /* now attacker turn */
			defenderBinlog = result.binlog
		else /* now defender turn */
			attackerBinlog = result.binlog

		return { ok: true }
	}

	function doDefaultMove() {
		const result = doMove(state, { action: Action.Pass })

		switch (result.status) {
			case StatusCode.Ok: break

			case StatusCode.DefenderWin: {
				winner = Role.Defender
			} break

			default:
				throw new Error(`unexpected status code ${result.status}`)
		}

		if (state.turn % 2) /* now attacker turn */
			defenderBinlog = result.binlog
		else /* now defender turn */
			attackerBinlog = result.binlog

		return { ok: false }
	}
}

export default simulateGame
