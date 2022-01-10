import createState, { Role } from "./createState"
import playMove, { Action, Move, StatusCode } from "./playMove"

export { Role } from "./createState"
export { Action } from "./playMove"
export type { Move } from "./playMove"

export class BinmatGame {
	state = createState()
	winner: Role | undefined

	play(move: Move) {
		const status = playMove(this.state, move)

		switch (status) {
			case StatusCode.Ok: break

			case StatusCode.AttackerWin: {
				this.winner = Role.Attacker
			} break

			case StatusCode.DefenderWin: {
				this.winner = Role.Defender
			} break

			default:
				playMove(this.state, { action: Action.Pass })
		}
	}

	reset() {
		this.state = createState()
	}
}

export default BinmatGame
