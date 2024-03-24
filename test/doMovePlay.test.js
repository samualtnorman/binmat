import { expect, test } from "vitest"
import { doMovePlay } from "../src/doMovePlay"
import { StatusCode } from "../src/common"

test("finished game", () => {
	/** @type {import("../src/common").State} */
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
		defenderHand: [ "2!" ],
		turn: 110,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMovePlay(state, "2!", 0)).toEqual({ status: StatusCode.MadeMoveOnFinishedGame })

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [ "2!" ],
		turn: 110,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("wrong way (defender)", () => {
	/** @type {import("../src/common").State} */
	const state = {
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "3!" ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [ "3#" ],
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMovePlay(state, "3#", 0)).toEqual({ status: StatusCode.PlayedCardFacedWrongWay })

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "3!" ], isFaceUp: true },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [ "3#" ],
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("break to empty stack (defender)", () => {
	/** @type {import("../src/common").State} */
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
		defenderHand: [ ">!" ],
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMovePlay(state, ">!", 0)).toEqual({ status: StatusCode.PlayedBreakToEmptyStack })

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [ ">!" ],
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("unowned card (defender)", () => {
	/** @type {import("../src/common").State} */
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
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMovePlay(state, "3!", 0)).toEqual({ status: StatusCode.PlayedUnownedCard })

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("card face only (defender)", () => {
	/** @type {import("../src/common").State} */
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
		defenderHand: [ "3!" ],
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMovePlay(state, "3", 0)).toEqual({ status: StatusCode.Ok, cardPlayed: "3!" })

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "3!" ], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("break to stack as attacker is allowed", () => {
	/** @type {import("../src/common").State} */
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
		attackerHand: [ ">!" ],
		defenderHand: [],
		turn: 1,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMovePlay(state, ">!", 0)).toEqual({ status: StatusCode.Ok, cardPlayed: ">!" })

	expect(state).toEqual({
		attackerStacks: [ [ ">!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 2,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("unowned card (attacker)", () => {
	/** @type {import("../src/common").State} */
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
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMovePlay(state, "3!", 0)).toEqual({ status: StatusCode.PlayedUnownedCard })

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("card face only (attacker)", () => {
	/** @type {import("../src/common").State} */
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
		attackerHand: [ "3!" ],
		defenderHand: [],
		turn: 1,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMovePlay(state, "3", 0)).toEqual({ status: StatusCode.Ok, cardPlayed: "3!" })

	expect(state).toEqual({
		attackerStacks: [ [ "3!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 2,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("defender win", () => {
	/** @type {import("../src/common").State} */
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
		attackerHand: [ "3!" ],
		defenderHand: [],
		turn: 109,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMovePlay(state, "3!", 0)).toEqual({ status: StatusCode.DefenderWin, cardPlayed: "3!" })

	expect(state).toEqual({
		attackerStacks: [ [ "3!" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 110,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})
