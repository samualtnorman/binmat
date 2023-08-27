import type { LaxPartial } from "@samual/lib"
import { shuffle as shuffle_ } from "@samual/lib/shuffle"
import type { Card, CardSuit, CardValue, InjectShuffleOptions, Lane, State } from "./shared"
import { CardModifier, Role, StatusCode } from "./shared"

export type CombatData = {
	attackerStack: Card[]
	defenderStack: Card[]
	attackerAttackPower: number
	defenderAttackPower: number
	damageValue: number
	cardsDrawn: Card[]
	attackerBouncesDiscarded: `?${CardSuit}`[]
	defenderBouncesDiscarded: `?${CardSuit}`[]
	attackerCardsTrapped: Card[]
	defenderCardsTrapped: Card[]
	attackerStackDiscarded: Card[]
	defenderStackWasFaceUp: boolean
	cardsDrawnToDiscard: Card[]
}

export const PowersOfTwo = [ 2, 4, 8, 16, 32, 64, 128, 256 ]

export function doCombat(
	state: State,
	lane: Lane,
	{ shuffle = shuffle_ }: LaxPartial<InjectShuffleOptions> = {}
): { status: StatusCode.Ok | StatusCode.AttackerWin } & CombatData {
	const roleTurn: Role = (state.turn % 2) + 1
	const laneDeck = state.laneDecks[lane]
	const laneDiscardPile = state.laneDiscardPiles[lane]
	const defenderStack = state.defenderStacks[lane].cards
	const attackerStack = state.attackerStacks[lane]
	const defenderStackWasFaceUp = state.defenderStacks[lane].isFaceUp
	const defenderStackBeforeCombat = [ ...defenderStack ]
	const attackerStackBeforeCombat = [ ...attackerStack ]
	const attackerCardsTrapped: Card[] = []
	const defenderCardsTrapped: Card[] = []

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
	let cardsDrawnToDiscard: Card[]

	const defenderBounceIndexes = []

	for (const [ index, card ] of defenderStack.entries()) {
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

	for (const [ index, card ] of attackerStack.entries()) {
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

	let attackerAttackPower = 0

	if (attackerWildCards) {
		while (attackerSum >= PowersOfTwo[attackerAttackPower]!)
			attackerAttackPower++

		attackerAttackPower += attackerWildCards
	} else
		attackerAttackPower = PowersOfTwo.indexOf(attackerSum) + 1

	let defenderAttackPower = 0

	if (defenderWildCards) {
		while (defenderSum >= PowersOfTwo[defenderAttackPower]!)
			defenderAttackPower++

		defenderAttackPower += defenderWildCards
	} else
		defenderAttackPower = PowersOfTwo.indexOf(defenderSum) + 1

	let cardsDrawn: Card[]
	let damageValue = 0
	let attackerStackDiscarded

	const defenderBouncesDiscarded: `?${CardSuit}`[] = []
	const attackerBouncesDiscarded: `?${CardSuit}`[] = []

	if (
		attackerBounceIndexes.length || defenderBounceIndexes.length || (!attackerAttackPower && !defenderAttackPower)
	) {
		for (const index of defenderBounceIndexes.reverse()) {
			const bounceDiscarded = defenderStack.splice(index, 1)[0]!

			defenderBouncesDiscarded.push(bounceDiscarded as `?${CardSuit}`)
			state.attackerDiscardPile.push(bounceDiscarded)
		}

		for (const index of attackerBounceIndexes.reverse()) {
			const bounceDiscarded = attackerStack.splice(index, 1)[0]!

			attackerBouncesDiscarded.push(bounceDiscarded as `?${CardSuit}`)
			laneDiscardPile.push(bounceDiscarded)
		}

		attackerStackDiscarded = [ ...attackerStack ]
		cardsDrawnToDiscard = []
		cardsDrawn = []
	} else if (defenderAttackPower > attackerAttackPower) {
		attackerStackDiscarded = [ ...attackerStack ]
		laneDiscardPile.push(...attackerStack.splice(0))
		cardsDrawnToDiscard = []
		cardsDrawn = []
	} else {
		attackerStackDiscarded = [ ...attackerStack ]

		damageValue = breakPresent
			? Math.max(attackerAttackPower, defenderStack.length)
			: attackerAttackPower - defenderAttackPower + 1

		if (damageValue > defenderStack.length) {
			const cardsToDraw = damageValue - defenderStack.length

			if (cardsToDraw > laneDeck.length + laneDiscardPile.length) {
				return {
					status: StatusCode.AttackerWin,
					attackerStack: attackerStackBeforeCombat,
					defenderStack: defenderStackBeforeCombat,
					attackerAttackPower,
					defenderAttackPower,
					damageValue,
					cardsDrawn: [ ...laneDeck, ...laneDiscardPile ],
					attackerCardsTrapped,
					defenderCardsTrapped,
					attackerBouncesDiscarded,
					defenderBouncesDiscarded,
					attackerStackDiscarded,
					defenderStackWasFaceUp,
					cardsDrawnToDiscard: [ ...defenderStack ].reverse()
				}
			}

			cardsDrawnToDiscard = defenderStack.splice(0).reverse()
			state.attackerDiscardPile.push(...cardsDrawnToDiscard)

			if (cardsToDraw > laneDeck.length)
				laneDeck.push(...shuffle(laneDiscardPile.splice(0)))

			cardsDrawn = laneDeck.splice(-cardsToDraw)
			state.attackerHand.push(...cardsDrawn)
		} else {
			cardsDrawnToDiscard = defenderStack.splice(-damageValue).reverse()
			state.attackerDiscardPile.push(...cardsDrawnToDiscard)
			cardsDrawn = []
		}
	}

	state.attackerDiscardPile.push(...attackerStack.splice(0))
	state.defenderStacks[lane].isFaceUp = Boolean(defenderStack.length)

	return {
		status: StatusCode.Ok,
		attackerStack: attackerStackBeforeCombat,
		defenderStack: defenderStackBeforeCombat,
		attackerAttackPower,
		defenderAttackPower,
		damageValue,
		cardsDrawn,
		attackerBouncesDiscarded,
		attackerCardsTrapped,
		attackerStackDiscarded,
		defenderBouncesDiscarded,
		defenderCardsTrapped,
		defenderStackWasFaceUp,
		cardsDrawnToDiscard
	}

	function flipDefenderStack() {
		if (state.defenderStacks[lane].isFaceUp)
			return

		for (const card of defenderStack) {
			if (!attackerStack.length)
				break

			if (card[0] != CardModifier.Trap)
				continue

			const trappedCard = attackerStack.pop()!

			attackerCardsTrapped.push(trappedCard)
			laneDiscardPile.push(trappedCard)
		}
	}

	function flipAttackerStack() {
		for (const card of attackerStack) {
			if (!defenderStack.length)
				break

			if (card[0] != CardModifier.Trap)
				continue

			const trappedCard = defenderStack.pop()!

			defenderCardsTrapped.push(trappedCard)
			state.attackerDiscardPile.push(trappedCard)
		}
	}
}
