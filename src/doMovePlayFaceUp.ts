import { assert } from "@samual/lib/assert"
import type { CombatData } from "./doCombat"
import { doCombat } from "./doCombat"
import {
	equal,
	getLaneStack,
	turnToRole,
	type card as Card,
	type cardFace as CardFace,
	type lane as Lane,
	type state as State
} from "./shared"

export function doMovePlayFaceUp(state: State, card: Card | CardFace, lane: Lane): {
	status: `Okay` | `DefenderWin` | `AttackerWin`
	cardPlayed: Card
	combat: CombatData | undefined
} | {
	status:
		`MadeMoveOnFinishedGame` |
		`PlayedUnownedCard` |
		`PlayedBreakToEmptyStack` |
		`PlayedCardFacedWrongWay` |
		`DefenderPlayedFaceUpBreakToStackWithBreak`
} {
	if (state.turn >= state.turns)
		return { status: `MadeMoveOnFinishedGame` }

	const roleTurn = turnToRole(state.turn)
	const face = typeof card == `string` ? card : card.face
	let cardPlayed
	let combat: CombatData | undefined

	if (roleTurn == `Defender`) {
		const index = state.defenderHand
		// eslint-disable-next-line unicorn/no-array-callback-reference
			.findIndex(typeof card == `string` ? ({ face }) => face == card : handCard => equal(handCard, card))

		if (index == -1)
			return { status: `PlayedUnownedCard` }

		if (face == `Break`) {
			if (!getLaneStack(state.defenderStacks, lane).cards.length)
				return { status: `PlayedBreakToEmptyStack` }

			if (getLaneStack(state.defenderStacks, lane).cards.some(card => card.face == `Break`))
				return { status: `DefenderPlayedFaceUpBreakToStackWithBreak` }

			cardPlayed = state.defenderHand.splice(index, 1)[0]!
			getLaneStack(state.defenderStacks, lane).cards.push(cardPlayed)

			let status

			({ status, ...combat } = doCombat(state, lane))

			if (status == `AttackerWin`)
				return { status, cardPlayed, combat }
		} else {
			if (!getLaneStack(state.defenderStacks, lane).isFaceUp)
				return { status: `PlayedCardFacedWrongWay` }

			cardPlayed = state.defenderHand.splice(index, 1)[0]!
			getLaneStack(state.defenderStacks, lane).cards.push(cardPlayed)
		}
	} else /* attacker turn */ {
		const index = state.attackerHand
		// eslint-disable-next-line unicorn/no-array-callback-reference
			.findIndex(typeof card == `string` ? ({ face }) => face == card : handCard => equal(handCard, card))

		if (index == -1)
			return { status: `PlayedUnownedCard` }

		if (face == `Break`) {
			if (!getLaneStack(state.attackerStacks, lane).length)
				return { status: `PlayedBreakToEmptyStack` }

			cardPlayed = state.attackerHand.splice(index, 1)[0]!
			getLaneStack(state.attackerStacks, lane).push(cardPlayed)

			let status

			({ status, ...combat } = doCombat(state, lane))

			if (status == `AttackerWin`)
				return { status, cardPlayed, combat }
		} else if (face == `Bounce`) {
			cardPlayed = state.attackerHand.splice(index, 1)[0]!
			getLaneStack(state.attackerStacks, lane).push(cardPlayed)

			let status

			({ status, ...combat } = doCombat(state, lane))
			assert(status != `AttackerWin`, `attacker won when playing a face up bounce`)
		} else
			return { status: `PlayedCardFacedWrongWay` }
	}

	// @ts-expect-error -- override rescript readonly
	state.turn++

	if (state.turn == state.turns)
		return { status: `DefenderWin`, cardPlayed, combat }

	return { status: `Okay`, cardPlayed, combat }
}
