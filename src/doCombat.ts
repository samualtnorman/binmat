import { shuffle } from "@samual/lib/shuffle"
import {
	cardNumberToInt,
	getLaneStack,
	turnToRole,
	type card as Card,
	type cardSuit as CardSuit,
	type lane as Lane,
	type state as State
} from "./shared"

export type CombatData = {
	attackerStack: Card[]
	defenderStack: Card[]
	attackerAttackPower: number
	defenderAttackPower: number
	damageValue: number
	cardsDrawn: Card[]
	attackerBouncesDiscarded: { face: "Bounce", suit: CardSuit }[]
	defenderBouncesDiscarded: { face: "Bounce", suit: CardSuit }[]
	attackerCardsTrapped: Card[]
	defenderCardsTrapped: Card[]
	attackerStackDiscarded: Card[]
	defenderStackWasFaceUp: boolean
	cardsDrawnToDiscard: Card[]
}

export const PowersOfTwo = [ 2, 4, 8, 16, 32, 64, 128, 256 ]

export function doCombat(state: State, lane: Lane): { status: "Okay" | "AttackerWin" } & CombatData {
	const roleTurn = turnToRole(state.turn)
	const laneDeck = getLaneStack(state.laneDecks, lane)
	const laneDiscardPile = getLaneStack(state.laneDiscardPiles, lane)
	const defenderStack = getLaneStack(state.defenderStacks, lane).cards
	const attackerStack = getLaneStack(state.attackerStacks, lane)
	const defenderStackWasFaceUp = getLaneStack(state.defenderStacks, lane).isFaceUp
	const defenderStackBeforeCombat = [ ...defenderStack ]
	const attackerStackBeforeCombat = [ ...attackerStack ]
	const attackerCardsTrapped: Card[] = []
	const defenderCardsTrapped: Card[] = []

	if (roleTurn == `Defender`) {
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
		switch (card.face) {
			case `Trap`: break

			case `Wild`: {
				defenderWildCards++
			} break

			case `Bounce`: {
				defenderBounceIndexes.push(index)
			} break

			case `Break`: {
				breakPresent = true
			} break

			default:
				defenderSum += cardNumberToInt(card.face)
		}
	}

	const attackerBounceIndexes = []
	let attackerSum = 0
	let attackerWildCards = 0

	for (const [ index, card ] of attackerStack.entries()) {
		switch (card.face) {
			case `Trap`: break

			case `Wild`: {
				attackerWildCards++
			} break

			case `Bounce`: {
				attackerBounceIndexes.push(index)
			} break

			case `Break`: {
				breakPresent = true
			} break

			default:
				attackerSum += cardNumberToInt(card.face)
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

	const defenderBouncesDiscarded: { face: "Bounce", suit: CardSuit }[] = []
	const attackerBouncesDiscarded: { face: "Bounce", suit: CardSuit }[] = []

	if (
		attackerBounceIndexes.length || defenderBounceIndexes.length || (!attackerAttackPower && !defenderAttackPower)
	) {
		for (const index of defenderBounceIndexes.reverse()) {
			const bounceDiscarded = defenderStack.splice(index, 1)[0]!

			defenderBouncesDiscarded.push(bounceDiscarded as { face: "Bounce", suit: CardSuit })
			state.attackerDiscardPile.push(bounceDiscarded)
		}

		for (const index of attackerBounceIndexes.reverse()) {
			const bounceDiscarded = attackerStack.splice(index, 1)[0]!

			attackerBouncesDiscarded.push(bounceDiscarded as { face: "Bounce", suit: CardSuit })
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
					status: `AttackerWin`,
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
	// @ts-expect-error -- gotta override the pure functional programming readonly pureness
	getLaneStack(state.defenderStacks, lane).isFaceUp = Boolean(defenderStack.length)

	return {
		status: `Okay`,
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
		if (getLaneStack(state.defenderStacks, lane).isFaceUp)
			return

		for (const card of defenderStack) {
			if (!attackerStack.length)
				break

			if (card.face != `Trap`)
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

			if (card.face != `Trap`)
				continue

			const trappedCard = defenderStack.pop()!

			defenderCardsTrapped.push(trappedCard)
			state.attackerDiscardPile.push(trappedCard)
		}
	}
}
