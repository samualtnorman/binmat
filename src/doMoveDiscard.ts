import type { LaxPartial } from "@samual/lib"
import { shuffle as defaultShuffleFunction } from "@samual/lib/shuffle"
import type { CardString, CardStringFace, Lane, ShuffleFunction, State } from "./common"
import { AttackerDiscardPile, Role, StatusCode } from "./common"

export function doMoveDiscard(
	state: State,
	card: CardString | CardStringFace,
	discardPile: Lane | AttackerDiscardPile,
	{ shuffleFunction: shuffle = defaultShuffleFunction }: LaxPartial<{ shuffleFunction: ShuffleFunction }> = {}
): {
	status: StatusCode.Okay | StatusCode.DefenderWin
	cardDiscarded: CardString
	cardsDrawn: [ CardString, CardString ] | undefined
} | {
	status:
		StatusCode.MadeMoveOnFinishedGame |
		StatusCode.PlayedUnownedCard |
		StatusCode.DiscardedToOpponentDiscardPile |
		StatusCode.AttackerDiscardedToEmptyDiscardAndDeck
} {
	if (state.turn >= state.maxTurns)
		return { status: StatusCode.MadeMoveOnFinishedGame }

	const roleTurn: Role = (state.turn % 2) + 1
	let cardDiscarded
	let cardsDrawn: [ CardString, CardString ] | undefined

	if (roleTurn == Role.Defender) {
		const index = card.length == 2
			? state.defenderHand.indexOf(card)
			: state.defenderHand.findIndex(([ value ]) => value == card)

		if (index == -1)
			return { status: StatusCode.PlayedUnownedCard }

		if (discardPile == AttackerDiscardPile)
			return { status: StatusCode.DiscardedToOpponentDiscardPile }

		cardDiscarded = state.defenderHand.splice(index, 1)[0]!
		state.laneDiscardPiles[discardPile].push(cardDiscarded)
	} else /* attacker turn */ {
		const index = card.length == 2
			? state.attackerHand.indexOf(card)
			: state.attackerHand.findIndex(([ value ]) => value == card)

		if (index == -1)
			return { status: StatusCode.PlayedUnownedCard }

		if (discardPile != AttackerDiscardPile)
			return { status: StatusCode.DiscardedToOpponentDiscardPile }

		if (!state.attackerDiscardPile.length && !state.attackerDeck.length)
			return { status: StatusCode.AttackerDiscardedToEmptyDiscardAndDeck }

		cardDiscarded = state.attackerHand.splice(index, 1)[0]!
		state.attackerDiscardPile.push(cardDiscarded)

		if (state.attackerDeck.length == 1) {
			const firstCardDrawn = state.attackerDeck.pop()!

			state.attackerHand.push(firstCardDrawn)
			state.attackerDeck.push(...shuffle(state.attackerDiscardPile.splice(0)))
			cardsDrawn = [ firstCardDrawn, state.attackerDeck.pop()! ]
			state.attackerHand.push(cardsDrawn[1])
		} else {
			if (!state.attackerDeck.length)
				state.attackerDeck.push(...shuffle(state.attackerDiscardPile.splice(0)))

			cardsDrawn = [ state.attackerDeck.pop()!, state.attackerDeck.pop()! ]
			state.attackerHand.push(cardsDrawn[0], cardsDrawn[1])
		}
	}

	state.turn++

	if (roleTurn == Role.Defender)
		state.defenderPassedLastTurn = false
	else
		state.attackerPassedLastTurn = false

	if (state.turn == state.maxTurns)
		return { status: StatusCode.DefenderWin, cardDiscarded, cardsDrawn }

	return { status: StatusCode.Okay, cardDiscarded, cardsDrawn }
}
