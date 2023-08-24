import { expect, test, vi } from "vitest"
import { doCombat } from "../src/doCombat"
import { StatusCode } from "../src/shared"

vi.mock("@samual/lib/shuffle", () =>
	/** @satisfies {typeof import("@samual/lib/shuffle")} */ ({ shuffle: array => array })
)

test("trap (defender)", () => {
	/** @type {import("../src/shared").State} */
	const state = {
		attackerStacks: [ [ "8!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "@!", "@#" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
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

	expect(doCombat(state, 0)).toEqual({
		status: StatusCode.Ok,
		attackerStack: [ "8!" ],
		defenderStack: [ "@!", "@#" ],
		attackerAttackPower: 0,
		defenderAttackPower: 0,
		damageValue: 0,
		cardsDrawn: [],
		attackerBouncesDiscarded: [],
		attackerCardsTrapped: [ "8!" ],
		attackerStackDiscarded: [],
		defenderBouncesDiscarded: [],
		defenderCardsTrapped: [],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: []
	})

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "@!", "@#" ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [ "8!" ], [], [], [], [], [] ],
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

test("wild (defender)", () => {
	/** @type {import("../src/shared").State} */
	const state = {
		attackerStacks: [ [ "8!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "5!", "*!" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
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

	expect(doCombat(state, 0)).toEqual({
		status: StatusCode.Ok,
		attackerStack: [ "8!" ],
		defenderStack: [ "5!", "*!" ],
		attackerAttackPower: 3,
		defenderAttackPower: 3,
		damageValue: 1,
		cardsDrawn: [],
		attackerBouncesDiscarded: [],
		attackerCardsTrapped: [],
		attackerStackDiscarded: [ "8!" ],
		defenderBouncesDiscarded: [],
		defenderCardsTrapped: [],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: [ "*!" ]
	})

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "5!" ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [ "*!", "8!" ],
		attackerHand: [],
		defenderHand: [],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("bounce (defender)", () => {
	/** @type {import("../src/shared").State} */
	const state = {
		attackerStacks: [ [ "8!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "?!" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
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

	expect(doCombat(state, 0)).toEqual({
		status: StatusCode.Ok,
		attackerStack: [ "8!" ],
		defenderStack: [ "?!" ],
		attackerAttackPower: 3,
		defenderAttackPower: 0,
		damageValue: 0,
		cardsDrawn: [],
		attackerBouncesDiscarded: [],
		attackerCardsTrapped: [],
		attackerStackDiscarded: [ "8!" ],
		defenderBouncesDiscarded: [ "?!" ],
		defenderCardsTrapped: [],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: []
	})

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [ "?!", "8!" ],
		attackerHand: [],
		defenderHand: [],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("break (defender)", () => {
	/** @type {import("../src/shared").State} */
	const state = {
		attackerStacks: [ [ "2!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "3!", "3#", ">!" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
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

	expect(doCombat(state, 0)).toEqual({
		status: StatusCode.Ok,
		attackerStack: [ "2!" ],
		defenderStack: [ "3!", "3#", ">!" ],
		attackerAttackPower: 1,
		defenderAttackPower: 0,
		damageValue: 3,
		cardsDrawn: [],
		attackerBouncesDiscarded: [],
		attackerCardsTrapped: [],
		attackerStackDiscarded: [ "2!" ],
		defenderBouncesDiscarded: [],
		defenderCardsTrapped: [],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: [ ">!", "3#", "3!" ]
	})

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [ ">!", "3#", "3!", "2!" ],
		attackerHand: [],
		defenderHand: [],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("10 (defender)", () => {
	/** @type {import("../src/shared").State} */
	const state = {
		attackerStacks: [ [ "8!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "a!", "6!" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
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

	expect(doCombat(state, 0)).toEqual({
		status: StatusCode.Ok,
		attackerStack: [ "8!" ],
		defenderStack: [ "a!", "6!" ],
		attackerAttackPower: 3,
		defenderAttackPower: 4,
		damageValue: 0,
		cardsDrawn: [],
		attackerBouncesDiscarded: [],
		attackerCardsTrapped: [],
		attackerStackDiscarded: [ "8!" ],
		defenderBouncesDiscarded: [],
		defenderCardsTrapped: [],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: []
	})

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "a!", "6!" ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [ "8!" ], [], [], [], [], [] ],
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

test("trap (attacker)", () => {
	/** @type {import("../src/shared").State} */
	const state = {
		attackerStacks: [ [ "@!", "8!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "?!" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
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

	expect(doCombat(state, 0)).toEqual({
		status: StatusCode.AttackerWin,
		attackerStack: [ "@!", "8!" ],
		defenderStack: [ "?!" ],
		attackerAttackPower: 3,
		defenderAttackPower: 0,
		damageValue: 4,
		cardsDrawn: [],
		attackerCardsTrapped: [],
		defenderCardsTrapped: [ "?!" ],
		attackerBouncesDiscarded: [],
		defenderBouncesDiscarded: [],
		attackerStackDiscarded: [ "@!", "8!" ],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: []
	})

	expect(state).toEqual({
		attackerStacks: [ [ "@!", "8!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [ "?!" ],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("wild (attacker)", () => {
	/** @type {import("../src/shared").State} */
	const state = {
		attackerStacks: [ [ "5!", "*!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4!" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
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

	expect(doCombat(state, 0)).toEqual({
		status: StatusCode.AttackerWin,
		attackerStack: [ "5!", "*!" ],
		defenderStack: [ "4!" ],
		attackerAttackPower: 3,
		defenderAttackPower: 2,
		damageValue: 2,
		cardsDrawn: [],
		attackerCardsTrapped: [],
		defenderCardsTrapped: [],
		attackerBouncesDiscarded: [],
		defenderBouncesDiscarded: [],
		attackerStackDiscarded: [ "5!", "*!" ],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: [ "4!" ]
	})

	expect(state).toEqual({
		attackerStacks: [ [ "5!", "*!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4!" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
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

test("bounce (attacker)", () => {
	/** @type {import("../src/shared").State} */
	const state = {
		attackerStacks: [ [ "?!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4!" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
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

	expect(doCombat(state, 0)).toEqual({
		status: StatusCode.Ok,
		attackerStack: [ "?!" ],
		defenderStack: [ "4!" ],
		attackerAttackPower: 0,
		defenderAttackPower: 2,
		damageValue: 0,
		cardsDrawn: [],
		attackerBouncesDiscarded: [ "?!" ],
		attackerCardsTrapped: [],
		attackerStackDiscarded: [],
		defenderBouncesDiscarded: [],
		defenderCardsTrapped: [],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: []
	})

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4!" ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [ "?!" ], [], [], [], [], [] ],
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

test("break (attacker)", () => {
	/** @type {import("../src/shared").State} */
	const state = {
		attackerStacks: [ [ "2!", ">!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "3!", "3#", "3%" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
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

	expect(doCombat(state, 0)).toEqual({
		status: StatusCode.Ok,
		attackerStack: [ "2!", ">!" ],
		defenderStack: [ "3!", "3#", "3%" ],
		attackerAttackPower: 1,
		defenderAttackPower: 0,
		damageValue: 3,
		cardsDrawn: [],
		attackerBouncesDiscarded: [],
		attackerCardsTrapped: [],
		attackerStackDiscarded: [ "2!", ">!" ],
		defenderBouncesDiscarded: [],
		defenderCardsTrapped: [],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: [ "3%", "3#", "3!" ]
	})

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [ "3%", "3#", "3!", "2!", ">!" ],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("10 (attacker)", () => {
	/** @type {import("../src/shared").State} */
	const state = {
		attackerStacks: [ [ "a!", "6!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "8!" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
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

	expect(doCombat(state, 0)).toEqual({
		status: StatusCode.AttackerWin,
		attackerStack: [ "a!", "6!" ],
		defenderStack: [ "8!" ],
		attackerAttackPower: 4,
		defenderAttackPower: 3,
		damageValue: 2,
		cardsDrawn: [],
		attackerCardsTrapped: [],
		defenderCardsTrapped: [],
		attackerBouncesDiscarded: [],
		defenderBouncesDiscarded: [],
		attackerStackDiscarded: [ "a!", "6!" ],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: [ "8!" ]
	})

	expect(state).toEqual({
		attackerStacks: [ [ "a!", "6!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "8!" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
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

test("shuffling lane discard pile into lane deck", () => {
	/** @type {import("../src/shared").State} */
	const state = {
		attackerStacks: [ [ "8!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [ "3!" ], [], [], [], [], [] ],
		laneDiscardPiles: [ [ "3#", "3%", "3&", "3+", "3^" ], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doCombat(state, 0)).toEqual({
		status: StatusCode.Ok,
		attackerStack: [ "8!" ],
		defenderStack: [],
		attackerAttackPower: 3,
		defenderAttackPower: 0,
		damageValue: 4,
		attackerBouncesDiscarded: [],
		attackerCardsTrapped: [],
		attackerStackDiscarded: [ "8!" ],
		cardsDrawn: [ "3%", "3&", "3+", "3^" ],
		defenderBouncesDiscarded: [],
		defenderCardsTrapped: [],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: []
	})

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [ "3!", "3#" ], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [ "8!" ],
		attackerHand: [ "3%", "3&", "3+", "3^" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("defender stack already face up", () => {
	/** @type {import("../src/shared").State} */
	const state = {
		attackerStacks: [ [ "8!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "@!" ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
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

	expect(doCombat(state, 0)).toEqual({
		status: StatusCode.AttackerWin,
		attackerStack: [ "8!" ],
		defenderStack: [ "@!" ],
		attackerAttackPower: 3,
		defenderAttackPower: 0,
		damageValue: 4,
		cardsDrawn: [],
		attackerCardsTrapped: [],
		defenderCardsTrapped: [],
		attackerBouncesDiscarded: [],
		defenderBouncesDiscarded: [],
		attackerStackDiscarded: [ "8!" ],
		defenderStackWasFaceUp: true,
		cardsDrawnToDiscard: [ "@!" ]
	})

	expect(state).toEqual({
		attackerStacks: [ [ "8!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "@!" ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
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
