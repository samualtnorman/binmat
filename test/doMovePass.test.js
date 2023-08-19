import doMovePass from "../src/doMovePass"
import { StatusCode } from "../src/shared"

test("finished game", () => {
	/** @type {import("../src/shared").State} */
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
		turn: 110,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMovePass(state)).toEqual(StatusCode.MadeMoveOnFinishedGame)

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
		turn: 110,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("defender win", () => {
	/** @type {import("../src/shared").State} */
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
		turn: 109,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMovePass(state)).toEqual(StatusCode.DefenderWin)

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
		turn: 110,
		turns: 110,
		attackerPassedLastTurn: true,
		defenderPassedLastTurn: false
	})
})

test("normal pass", () => {
	/** @type {import("../src/shared").State} */
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
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMovePass(state)).toEqual(StatusCode.Ok)

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
		defenderPassedLastTurn: true
	})
})

test("defender pass twice", () => {
	/** @type {import("../src/shared").State} */
	const state = {
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [ "5!" ], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [ "3!", "3#", "3%", "3&", "3+", "3^" ],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: true
	}

	expect(doMovePass(state)).toEqual(StatusCode.Ok)

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [ "3!", "3^" ], [ "5!" ], [ "3#" ], [ "3%" ], [ "3&" ], [ "3+" ] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: true
	})
})

test("attacker pass twice", () => {
	/** @type {import("../src/shared").State} */
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
		attackerHand: [ "3!", "3#" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: true,
		defenderPassedLastTurn: false
	}

	expect(doMovePass(state)).toEqual(StatusCode.Ok)

	expect(state).toEqual({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [ "3!", "3#" ],
		attackerHand: [],
		defenderHand: [],
		turn: 2,
		turns: 110,
		attackerPassedLastTurn: true,
		defenderPassedLastTurn: false
	})
})
