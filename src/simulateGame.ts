import type { LaxPartial } from "@samual/lib"
import "../game-scripts/hackmud.d"
import { doMove } from "./doMove"
import type { BinmatArgs } from "./generateArgs"
import { generateArgsForAttacker, generateArgsForDefender } from "./generateArgs"
import { makeState } from "./makeState"
import { parseMove } from "./parseMove"
import type { State } from "./shared"
import { MoveKind, Role, StatusCode, StatusCodeMessages } from "./shared"

export type SimulateGameOptions = {
	timeLimit: number
	defenderUserName: string
	attackerUserName: string
	noThrow: boolean
	onMove: (state: State, binlog: string[]) => void
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
		onMove
	}: LaxPartial<SimulateGameOptions> = {}
) {
	const state = makeState()
	let endTime: number
	let winner: Role | undefined
	let lastLastBinlog: string[] = []
	let lastBinlog: string[] = []
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
				[ ...lastLastBinlog, ...lastBinlog ]
			),
			xform
		)

		if (!madeMove as boolean) {
			if (noThrow)
				doDefaultMove()
			else
				throw new Error(`defender brain did not attempt to make a move`)
		}

		onMove?.(state, lastBinlog)

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
				[ ...lastLastBinlog, ...lastBinlog ]
			),
			xform
		)

		if (!madeMove as boolean) {
			if (noThrow)
				doDefaultMove()
			else
				throw new Error(`attacker brain did not attempt to make a move`)
		}

		onMove?.(state, lastBinlog)

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

				throw new Error(StatusCodeMessages[result.status])
			}
		}

		lastLastBinlog = lastBinlog
		lastBinlog = result.binlog

		return { ok: true }
	}

	function doDefaultMove() {
		const result = doMove(state, { kind: MoveKind.Pass })

		switch (result.status) {
			case StatusCode.Ok: break

			case StatusCode.DefenderWin: {
				winner = Role.Defender
			} break

			default:
				throw new Error(`unexpected status code ${result.status}`)
		}

		lastLastBinlog = lastBinlog
		lastBinlog = result.binlog

		return { ok: false }
	}
}
