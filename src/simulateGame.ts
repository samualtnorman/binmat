import type { LaxPartial } from "@samual/lib"
import { doMove } from "./doMove"
import type { BinmatArgs } from "./generateArgs"
import { generateArgsForAttacker, generateArgsForDefender } from "./generateArgs"
import { makeState } from "./makeState"
import { parseMove } from "./parseMove"
import type { State } from "./common"
import { MoveTag, Role, StatusCode, StatusCodeMessages } from "./common"

export type SimulateGameOptions = {
	/** How many milliseconds the brain is allowed @default 5000 */ timeLimit: number
	/** @default "defender" */ defenderUserName: string
	/** @default "attacker" */ attackerUserName: string

	/** Pass instead of throwing when brain acts incorrectly (too slow, making move twice, etc) @default false */
	noThrow: boolean

	/** Callback that is called after every move */ onMove: (state: State, binlog: string[]) => void
	/** Initial state of the game */ state: State

	/** Intial state of binlog from defender's last turn (should be even numbered turn) @default [] */
	defenderBinlog: string[]

	/** Intial state of binlog from attacker's last turn (should be odd numbered turn) @default [] */
	attackerBinlog: string[]
}

export type CLIContext = {
	/** The name of the user who is calling the script (i.e. n00b) */ caller: string
	/** The name of this script */ this_script: string
	/** The number of columns in the caller’s terminal, if reported by the client */ cols: number
	/** The number of rows in the caller’s terminal, if reported by the client */ rows: number

	/** The name of the script that directly called this script, or null if called on the command line or as a
	  * scriptor */
	calling_script: null
}

export type TransformScript = (args: { op: string }) => { ok: boolean }
export type BrainScript = (context: CLIContext, args: BinmatArgs, xform: TransformScript) => void

/**
 * @param defenderBrain defender brain script but with extra `xform` parameter to replace `#fs.binmat.x()` subscript
 * @param attackerBrain attacker brain script but with extra `xform` parameter to replace `#fs.binmat.x()` subscript
 * @param options {@link SimulateGameOptions details}
 * @returns who won
 */
export function simulateGame(
	defenderBrain: BrainScript,
	attackerBrain: BrainScript,
	{
		timeLimit = 5000,
		defenderUserName = `defender`,
		attackerUserName = `attacker`,
		noThrow = false,
		onMove,
		state = makeState(),
		defenderBinlog = [],
		attackerBinlog = []
	}: LaxPartial<SimulateGameOptions> = {}
) {
	let endTime: number
	let winner: Role | undefined
	let madeMove: boolean

	while (true) {
		madeMove = false
		endTime = Date.now() + timeLimit

		defenderBrain(
			{
				caller: defenderUserName,
				this_script: `${defenderUserName}.binmat_brain`,
				cols: 0,
				rows: 0,
				// eslint-disable-next-line unicorn/no-null
				calling_script: null
			},
			generateArgsForDefender(
				state,
				defenderUserName,
				attackerUserName,
				[ ...defenderBinlog, ...attackerBinlog ]
			),
			xform
		)

		if (!madeMove as boolean) {
			if (noThrow)
				doDefaultMove()
			else
				throw Error(`defender brain did not attempt to make a move`)
		}

		onMove?.(state, defenderBinlog)

		if (winner)
			return winner

		madeMove = false
		endTime = Date.now() + timeLimit

		attackerBrain(
			{
				caller: attackerUserName,
				this_script: `${attackerUserName}.binmat_brain`,
				cols: 0,
				rows: 0,
				// eslint-disable-next-line unicorn/no-null
				calling_script: null
			},
			generateArgsForAttacker(
				state,
				defenderUserName,
				attackerUserName,
				[ ...attackerBinlog, ...defenderBinlog ]
			),
			xform
		)

		if (!madeMove as boolean) {
			if (noThrow)
				doDefaultMove()
			else
				throw Error(`attacker brain did not attempt to make a move`)
		}

		onMove?.(state, attackerBinlog)

		if (winner)
			return winner
	}

	function xform({ op }: { op: string }) {
		if (madeMove) {
			if (noThrow)
				return { ok: false }

			throw Error(`only 1 move per turn`)
		}

		madeMove = true

		if (Date.now() > endTime) {
			if (noThrow)
				return doDefaultMove()

			throw Error(`made move too late`)
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
			case StatusCode.Okay: break

			case StatusCode.AttackerWin: {
				winner = Role.Attacker
			} break

			case StatusCode.DefenderWin: {
				winner = Role.Defender
			} break

			default: {
				if (noThrow)
					return doDefaultMove()

				throw Error(StatusCodeMessages[result.status])
			}
		}

		if ((state.turn % 2) + 1 == Role.Defender)
			attackerBinlog = result.binlog
		else
			defenderBinlog = result.binlog

		return { ok: true }
	}

	function doDefaultMove() {
		const result = doMove(state, { tag: MoveTag.Pass })

		switch (result.status) {
			case StatusCode.Okay: break

			case StatusCode.DefenderWin: {
				winner = Role.Defender
			} break

			default:
				throw Error(`unexpected status code ${result.status}`)
		}

		if ((state.turn % 2) + 1 == Role.Defender)
			attackerBinlog = result.binlog
		else
			defenderBinlog = result.binlog

		return { ok: false }
	}
}
