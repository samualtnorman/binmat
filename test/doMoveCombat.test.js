import doMoveCombat from "../src/doMoveCombat"
import { StatusCode } from "../src/shared"

test(`finished game`, () => {
	/** @type {import("../src/createState").State} */
	const state = {
		attackerStacks: [ [ `8!` ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 110,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveCombat(state, 0)).toEqual({ status: StatusCode.MadeMoveOnFinishedGame })

	expect(state).toEqual({
		attackerStacks: [ [ `8!` ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 110,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test(`defender trying to initiate combat`, () => {
	/** @type {import("../src/createState").State} */
	const state = {
		attackerStacks: [ [ `8!` ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveCombat(state, 0)).toEqual({ status: StatusCode.DefenderInitiatedCombat })

	expect(state).toEqual({
		attackerStacks: [ [ `8!` ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test(`attacker trying to initiate combat with empty stack`, () => {
	/** @type {import("../src/createState").State} */
	const state = {
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveCombat(state, 0)).toEqual({ status: StatusCode.AttackerInitiatedCombatWithEmptyStack })

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test(`normal combat`, () => {
	/** @type {import("../src/createState").State} */
	const state = {
		attackerStacks: [ [ `8!` ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ `3!`, `3#`, `3%`, `3&`, `3+` ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveCombat(state, 0)).toEqual({
		status: StatusCode.Ok,
		attackerStack: [ `8!` ],
		defenderStack: [ `3!`, `3#`, `3%`, `3&`, `3+` ],
		attackerAttackPower: 3,
		defenderAttackPower: 0,
		damageValue: 4,
		cardsDrawn: [],
		attackerCardsTrapped: [],
		defenderCardsTrapped: [],
		attackerBouncesDiscarded: [],
		defenderBouncesDiscarded: [],
		attackerStackDiscarded: [ `8!` ],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: [ `3+`, `3&`, `3%`, `3#` ]
	})

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ `3!` ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [ `3+`, `3&`, `3%`, `3#`, `8!` ],
		attackerHand: [],
		defenderHand: [],
		turn: 2,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test(`attacker win`, () => {
	/** @type {import("../src/createState").State} */
	const state = {
		attackerStacks: [ [ `8!` ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveCombat(state, 0)).toEqual({
		status: StatusCode.AttackerWin,
		attackerStack: [ `8!` ],
		defenderStack: [],
		attackerAttackPower: 3,
		defenderAttackPower: 0,
		damageValue: 4,
		cardsDrawn: [],
		attackerCardsTrapped: [],
		defenderCardsTrapped: [],
		attackerBouncesDiscarded: [],
		defenderBouncesDiscarded: [],
		attackerStackDiscarded: [ `8!` ],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: []
	})

	expect(state).toEqual({
		attackerStacks: [ [ `8!` ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test(`defender win`, () => {
	/** @type {import("../src/createState").State} */
	const state = {
		attackerStacks: [ [ `8!` ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ `3!`, `3#`, `3%`, `3&`, `3+` ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 109,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveCombat(state, 0)).toEqual({
		status: StatusCode.DefenderWin,
		attackerStack: [ `8!` ],
		defenderStack: [ `3!`, `3#`, `3%`, `3&`, `3+` ],
		attackerAttackPower: 3,
		defenderAttackPower: 0,
		damageValue: 4,
		cardsDrawn: [],
		attackerCardsTrapped: [],
		defenderCardsTrapped: [],
		attackerBouncesDiscarded: [],
		defenderBouncesDiscarded: [],
		attackerStackDiscarded: [ `8!` ],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: [ `3+`, `3&`, `3%`, `3#` ]
	})

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ `3!` ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [ `3+`, `3&`, `3%`, `3#`, `8!` ],
		attackerHand: [],
		defenderHand: [],
		turn: 110,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})
