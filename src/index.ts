import createState, { Role } from "./createState"
import doMove from "./doMove"
import { Action, Move, StatusCode } from "./shared"

export { Role } from "./createState"
export { Action } from "./shared"
export type { Move } from "./shared"

export class BinmatGame {
	state = createState()
	winner: Role | undefined

	play(move: Move) {
		const result = doMove(this.state, move)

		switch (result.status) {
			case StatusCode.Ok:
				return result.binlog

			case StatusCode.AttackerWin: {
				this.winner = Role.Attacker

				return result.binlog
			}

			case StatusCode.DefenderWin: {
				this.winner = Role.Defender

				return result.binlog
			}

			default: {
				const result = doMove(this.state, { action: Action.Pass })

				switch (result.status) {
					case StatusCode.Ok:
						return result.binlog

					case StatusCode.AttackerWin: {
						this.winner = Role.Attacker

						return result.binlog
					}

					case StatusCode.DefenderWin: {
						this.winner = Role.Defender

						return result.binlog
					}

					default:
						throw new Error(`unexpected status code ${result.status}`)
				}
			}
		}
	}

	reset() {
		this.state = createState()
		this.winner = undefined
	}
}

export default BinmatGame
