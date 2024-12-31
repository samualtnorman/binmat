import type { LaxPartial } from "@samual/lib"
import { shuffle as defaultShuffleFunction } from "@samual/lib/shuffle"
import type { CardString, CardStringFace, CardStringSuit, Lane, ShuffleFunction, State } from "./common"
import { CardStringFaceModifier, Role, StatusCode } from "./common"

export type CombatData = {
	attackerStack: CardString[]
	defenderStack: CardString[]
	attackerAttackPower: number
	defenderAttackPower: number
	damageValue: number
	cardsDrawn: CardString[]
	attackerBouncesDiscarded: `?${CardStringSuit}`[]
	defenderBouncesDiscarded: `?${CardStringSuit}`[]
	attackerCardsTrapped: CardString[]
	defenderCardsTrapped: CardString[]
	attackerStackDiscarded: CardString[]
	defenderStackWasFaceUp: boolean
	cardsDrawnToDiscard: CardString[]
}

export const PowersOfTwo = [ 2, 4, 8, 16, 32, 64, 128, 256 ]

export function doCombat(
	state: State,
	lane: Lane,
	{ shuffleFunction: shuffle = defaultShuffleFunction }: LaxPartial<{ shuffleFunction: ShuffleFunction }> = {}
): { status: StatusCode.Okay | StatusCode.AttackerWin } & CombatData {
	const roleTurn: Role = (state.turn % 2) + 1
	const laneDeck = state.laneDecks[lane]
	const laneDiscardPile = state.laneDiscardPiles[lane]
	const defenderStack = state.defenderStacks[lane].cards
	const attackerStack = state.attackerStacks[lane]
	const defenderStackWasFaceUp = state.defenderStacks[lane].isFaceUp
	const defenderStackBeforeCombat = [ ...defenderStack ]
	const attackerStackBeforeCombat = [ ...attackerStack ]
	const attackerCardsTrapped: CardString[] = []
	const defenderCardsTrapped: CardString[] = []

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
	let cardsDrawnToDiscard: CardString[]

	const defenderBounceIndexes = []

	for (const [ index, card ] of defenderStack.entries()) {
		switch (card[0] as CardStringFace) {
			case CardStringFaceModifier.Trap: break

			case CardStringFaceModifier.Wild: {
				defenderWildCards++
			} break

			case CardStringFaceModifier.Bounce: {
				defenderBounceIndexes.push(index)
			} break

			case CardStringFaceModifier.Break: {
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
		switch (card[0] as CardStringFace) {
			case CardStringFaceModifier.Trap: break

			case CardStringFaceModifier.Wild: {
				attackerWildCards++
			} break

			case CardStringFaceModifier.Bounce: {
				attackerBounceIndexes.push(index)
			} break

			case CardStringFaceModifier.Break: {
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

	let cardsDrawn: CardString[]
	let damageValue = 0
	let attackerStackDiscarded

	const defenderBouncesDiscarded: `?${CardStringSuit}`[] = []
	const attackerBouncesDiscarded: `?${CardStringSuit}`[] = []

	if (
		attackerBounceIndexes.length || defenderBounceIndexes.length || !(attackerAttackPower || defenderAttackPower)
	) {
		for (const index of defenderBounceIndexes.reverse()) {
			const bounceDiscarded = defenderStack.splice(index, 1)[0]!

			defenderBouncesDiscarded.push(bounceDiscarded as `?${CardStringSuit}`)
			state.attackerDiscardPile.push(bounceDiscarded)
		}

		for (const index of attackerBounceIndexes.reverse()) {
			const bounceDiscarded = attackerStack.splice(index, 1)[0]!

			attackerBouncesDiscarded.push(bounceDiscarded as `?${CardStringSuit}`)
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
		status: StatusCode.Okay,
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

			if (card[0] != CardStringFaceModifier.Trap)
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

			if (card[0] != CardStringFaceModifier.Trap)
				continue

			const trappedCard = defenderStack.pop()!

			defenderCardsTrapped.push(trappedCard)
			state.attackerDiscardPile.push(trappedCard)
		}
	}
}
