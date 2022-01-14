import { shuffle } from "@samual/lib"
import { Card, CardModifier, CardValue, Role, State } from "./createState"

export const enum Action {
	Draw,
	Play,
	PlayFaceup,
	Combat,
	Discard,
	Pass
}

export const Lanes = [ 0, 1, 2, 3, 4, 5 ] as const
export type Lane = typeof Lanes[number]

export const AttackerDeck = 6
export type AttackerDeck = typeof AttackerDeck

export const AttackerDiscardPile = 6
export type AttackerDiscardPile = typeof AttackerDiscardPile

export type Move = {
	action: Action.Draw
	deck: Lane | AttackerDeck
} | {
	action: Action.Play | Action.PlayFaceup
	card: Card | CardValue
	lane: Lane
} | {
	action: Action.Combat
	lane: Lane
} | {
	action: Action.Discard
	card: Card | CardValue
	discardPile: Lane | AttackerDiscardPile
} | { action: Action.Pass }

export const enum StatusCode {
	Ok,
	DefenderWin,
	AttackerWin,
	MadeMoveOnFinishedGame,
	DefenderDrewFromAttackerDeck,
	AttackerDrewFromBlockedLane,
	PlayedUnownedCard,
	PlayedBreakToEmptyStack,
	DefenderInitiatedCombat,
	AttackerInitiatedCombatWithEmptyStack,
	DiscardedToOpponentDiscardPile,
	AttackerDiscardedToEmptyDiscardAndDeck,
	AttackerDrewFromEmptyDiscardAndDeck,
	PlayedCardFacedWrongWay
}

const PowersOfTwo = [ 2, 4, 8, 16, 32, 64, 128, 256 ]

// TODO support more than 1 player on a team

export function playMove(state: State, move: Move): StatusCode {
	if (state.turn >= state.turns)
		return StatusCode.MadeMoveOnFinishedGame

	const roleTurn: Role = (state.turn % 2) + 1

	if (move.action == Action.Pass) {
		if (roleTurn == Role.Defender) {
			if (state.defenderPassedLastTurn) {
				for (const card of state.defenderHand.splice(0)) {
					let smallestDiscardPile = state.laneDiscardPiles[0]

					for (const discardPile of state.laneDiscardPiles.slice(1)) {
						if (discardPile.length < smallestDiscardPile.length)
							smallestDiscardPile = discardPile
					}

					smallestDiscardPile.push(card)
				}
			} else
				state.defenderPassedLastTurn = true
		} else /* attacker turn */ if (state.attackerPassedLastTurn)
			state.attackerDiscardPile.push(...state.attackerHand.splice(0))
		else
			state.attackerPassedLastTurn = true
	} else {
		switch (move.action) {
			case Action.Draw: {
				if (roleTurn == Role.Defender) {
					if (move.deck == AttackerDeck)
						return StatusCode.DefenderDrewFromAttackerDeck
				} else /* attacker turn */ if (move.deck != AttackerDeck && state.defenderStacks[move.deck].cards.length)
					return StatusCode.AttackerDrewFromBlockedLane

				const deck = getDeck(move.deck)

				if (!deck.length) {
					const discardPile = getDiscardPile(move.deck)

					if (!discardPile.length) {
						if (move.deck == AttackerDeck)
							return StatusCode.AttackerDrewFromEmptyDiscardAndDeck

						return StatusCode.AttackerWin
					}

					deck.push(...shuffle(discardPile.splice(0)))
				}

				if (roleTurn == Role.Defender)
					state.defenderHand.push(deck.pop()!)
				else /* attacker turn */
					state.attackerHand.push(deck.pop()!)
			} break

			case Action.Play: {
				if (roleTurn == Role.Defender) {
					if (state.defenderStacks[move.lane].faceup)
						return StatusCode.PlayedCardFacedWrongWay

					if (move.card[0] == CardModifier.Break && !state.defenderStacks[move.lane].cards.length)
						return StatusCode.PlayedBreakToEmptyStack

					const index = getDefenderHandCardIndex(move.card)

					if (index == -1)
						return StatusCode.PlayedUnownedCard

					state.defenderStacks[move.lane].cards.push(state.defenderHand.splice(index, 1)[0]!)
				} else {
					if (move.card[0] == CardModifier.Break && !state.attackerStacks[move.lane].length)
						return StatusCode.PlayedBreakToEmptyStack

					const index = getAttackerHandCardIndex(move.card)

					if (index == -1)
						return StatusCode.PlayedUnownedCard

					state.attackerStacks[move.lane].push(state.attackerHand.splice(index, 1)[0]!)
				}
			} break

			case Action.PlayFaceup: {
				if (roleTurn == Role.Defender) {
					const index = getDefenderHandCardIndex(move.card)

					if (index == -1)
						return StatusCode.PlayedUnownedCard

					if (move.card[0] == CardModifier.Break) {
						if (!state.defenderStacks[move.lane].cards.length)
							return StatusCode.PlayedBreakToEmptyStack

						state.defenderStacks[move.lane].cards.push(state.defenderHand.splice(index, 1)[0]!)

						if (doCombat(move.lane))
							return StatusCode.AttackerWin
					} else {
						if (!state.defenderStacks[move.lane].faceup)
							return StatusCode.PlayedCardFacedWrongWay

						state.defenderStacks[move.lane].cards.push(state.defenderHand.splice(index, 1)[0]!)
					}
				} else /* attacker turn */ {
					const index = getAttackerHandCardIndex(move.card)

					if (index == -1)
						return StatusCode.PlayedUnownedCard

					if (move.card[0] == CardModifier.Break) {
						if (!state.attackerStacks[move.lane].length)
							return StatusCode.PlayedBreakToEmptyStack

						state.attackerStacks[move.lane].push(state.attackerHand.splice(index, 1)[0]!)

						if (doCombat(move.lane))
							return StatusCode.AttackerWin
					} else if (move.card[0] == CardModifier.Bounce) {
						state.attackerStacks[move.lane].push(state.attackerHand.splice(index, 1)[0]!)

						if (doCombat(move.lane))
							return StatusCode.AttackerWin
					} else
						return StatusCode.PlayedCardFacedWrongWay
				}
			} break

			case Action.Combat: {
				if (roleTurn == Role.Defender)
					return StatusCode.DefenderInitiatedCombat

				if (!state.attackerStacks[move.lane].length)
					return StatusCode.AttackerInitiatedCombatWithEmptyStack

				if (doCombat(move.lane))
					return StatusCode.AttackerWin
			} break

			case Action.Discard: {
				if (roleTurn == Role.Defender) {
					const index = getDefenderHandCardIndex(move.card)

					if (index == -1)
						return StatusCode.PlayedUnownedCard

					if (move.discardPile == AttackerDiscardPile)
						return StatusCode.DiscardedToOpponentDiscardPile

					state.laneDiscardPiles[move.discardPile].push(state.defenderHand.splice(index, 1)[0]!)
				} else /* attacker turn */ {
					const index = getAttackerHandCardIndex(move.card)

					if (index == -1)
						return StatusCode.PlayedUnownedCard

					if (move.discardPile != AttackerDiscardPile)
						return StatusCode.DiscardedToOpponentDiscardPile

					if (!state.attackerDiscardPile.length && !state.attackerDeck.length)
						return StatusCode.AttackerDiscardedToEmptyDiscardAndDeck

					state.attackerDiscardPile.push(state.attackerHand.splice(index, 1)[0]!)

					if (!state.attackerDeck.length) {
						state.attackerDeck.push(...shuffle(state.attackerDiscardPile.splice(0)))
						state.attackerHand.push(state.attackerDeck.pop()!, state.attackerDeck.pop()!)
					} else if (state.attackerDeck.length == 1) {
						state.attackerHand.push(state.attackerDeck.pop()!)
						state.attackerDeck.push(...shuffle(state.attackerDiscardPile.splice(0)))
						state.attackerHand.push(state.attackerDeck.pop()!)
					} else
						state.attackerHand.push(state.attackerDeck.pop()!, state.attackerDeck.pop()!)
				}
			} break
		}

		if (roleTurn == Role.Defender)
			state.defenderPassedLastTurn = false
		else /* attacker turn */
			state.attackerPassedLastTurn = false
	}

	state.turn++

	if (state.turn == state.turns)
		return StatusCode.DefenderWin

	return StatusCode.Ok

	function getDefenderHandCardIndex(card: any) {
		if (card.length == 2)
			return state.defenderHand.indexOf(card)

		return state.defenderHand.findIndex(([ value ]) => value == card)
	}

	function getAttackerHandCardIndex(card: any) {
		if (card.length == 2)
			return state.attackerHand.indexOf(card)

		return state.attackerHand.findIndex(([ value ]) => value == card)
	}

	function getDeck(deck: Lane | AttackerDeck) {
		if (deck == AttackerDeck)
			return state.attackerDeck

		return state.laneDecks[deck]
	}

	function getDiscardPile(deck: Lane | AttackerDiscardPile) {
		if (deck == AttackerDiscardPile)
			return state.attackerDiscardPile

		return state.laneDiscardPiles[deck]
	}

	/** @returns whether the attacker won combat */
	function doCombat(lane: Lane) {
		if (roleTurn == Role.Defender) {
			flipDefenderStack()
			flipAttackerStack()
		} else /* attacker turn */ {
			flipAttackerStack()
			flipDefenderStack()
		}

		let defenderSum = 0
		let defenderWildCards = 0
		let breakPresent = false

		const defenderBounceIndexes = []

		for (const [ index, card ] of state.defenderStacks[lane].cards.entries()) {
			switch (card[0] as CardValue) {
				case CardModifier.Trap: break

				case CardModifier.Wild: {
					defenderWildCards++
				} break

				case CardModifier.Bounce: {
					defenderBounceIndexes.push(index)
				} break

				case CardModifier.Break: {
					breakPresent = true
				} break

				case `a`: {
					defenderSum += 10
				} break

				default:
					defenderSum += Number(card[0])
			}
		}

		const attackerBounceIndexes = []
		let attackerSum = 0
		let attackerWildCards = 0

		for (const [ index, card ] of state.attackerStacks[lane].entries()) {
			switch (card[0] as CardValue) {
				case CardModifier.Trap: break

				case CardModifier.Wild: {
					attackerWildCards++
				} break

				case CardModifier.Bounce: {
					attackerBounceIndexes.push(index)
				} break

				case CardModifier.Break: {
					breakPresent = true
				} break

				case `a`: {
					attackerSum += 10
				} break

				default:
					attackerSum += Number(card[0])
			}
		}

		let attackerAttackPower

		if (attackerWildCards) {
			attackerAttackPower = 0

			while (PowersOfTwo[attackerAttackPower]! <= attackerSum)
				attackerAttackPower++

			attackerAttackPower += attackerWildCards
		} else
			attackerAttackPower = PowersOfTwo.indexOf(attackerSum) + 1

		let defenderAttackPower

		if (defenderWildCards) {
			defenderAttackPower = 0

			while (PowersOfTwo[defenderAttackPower]! <= defenderSum)
				defenderAttackPower++

			defenderAttackPower += defenderWildCards
		} else
			defenderAttackPower = PowersOfTwo.indexOf(defenderSum) + 1

		const laneDeck = state.laneDecks[lane]

		if (attackerBounceIndexes.length || defenderBounceIndexes.length || (!attackerAttackPower && !defenderAttackPower)) {
			for (const index of defenderBounceIndexes.reverse())
				state.attackerDiscardPile.push(state.defenderStacks[lane].cards.splice(index, 1)[0]!)

			for (const index of attackerBounceIndexes.reverse())
				state.laneDiscardPiles[lane].push(state.attackerStacks[lane].splice(index, 1)[0]!)
		} else if (attackerAttackPower < defenderAttackPower)
			state.laneDiscardPiles[lane].push(...state.attackerStacks[lane].splice(0))
		else if (breakPresent) {
			const cardsToDraw = attackerAttackPower - state.defenderStacks[lane].cards.length

			state.attackerDiscardPile.push(...state.defenderStacks[lane].cards.splice(0))

			if (cardsToDraw > laneDeck.length + state.laneDiscardPiles[lane].length)
				return true

			state.attackerDiscardPile.push(...state.defenderStacks[lane].cards.splice(0))

			if (cardsToDraw) {
				if (laneDeck.length < cardsToDraw) {
					const cardsLeftToDraw = cardsToDraw - laneDeck.length

					state.attackerHand.push(...laneDeck.splice(0))
					laneDeck.push(...shuffle(state.laneDiscardPiles[lane].splice(0)))
					state.attackerHand.push(...laneDeck.splice(0, cardsLeftToDraw))
				} else
					state.attackerHand.push(...laneDeck.splice(0, cardsToDraw))
			}
		} else {
			const damageValue = attackerAttackPower - defenderAttackPower + 1

			if (damageValue > state.defenderStacks[lane].cards.length) {
				const cardsToDraw = damageValue - state.defenderStacks[lane].cards.length

				if (cardsToDraw > laneDeck.length + state.laneDiscardPiles[lane].length)
					return true

				state.attackerDiscardPile.push(...state.defenderStacks[lane].cards.splice(0))

				if (cardsToDraw) {
					if (laneDeck.length < cardsToDraw) {
						const cardsLeftToDraw = cardsToDraw - laneDeck.length

						state.attackerHand.push(...laneDeck.splice(0))
						laneDeck.push(...shuffle(state.laneDiscardPiles[lane].splice(0)))
						state.attackerHand.push(...laneDeck.splice(0, cardsLeftToDraw))
					} else
						state.attackerHand.push(...laneDeck.splice(0, cardsToDraw))
				}
			} else
				state.attackerDiscardPile.push(...state.defenderStacks[lane].cards.splice(state.defenderStacks[lane].cards.length - damageValue, damageValue))
		}

		state.attackerDiscardPile.push(...state.attackerStacks[lane].splice(0))
		state.defenderStacks[lane].faceup = Boolean(state.defenderStacks[lane].cards.length)

		return false

		function flipDefenderStack() {
			if (state.defenderStacks[lane].faceup)
				return

			for (const card of state.defenderStacks[lane].cards) {
				if (card[0] != CardModifier.Trap)
					continue

				if (!state.attackerStacks[lane].length)
					break

				state.laneDiscardPiles[lane].push(state.attackerStacks[lane].pop()!)
			}
		}

		function flipAttackerStack() {
			for (const card of state.attackerStacks[lane]) {
				if (card[0] != CardModifier.Trap)
					continue

				if (!state.defenderStacks[lane].cards.length)
					break

				state.attackerDiscardPile.push(state.defenderStacks[lane].cards.pop()!)
			}
		}
	}
}

export default playMove
