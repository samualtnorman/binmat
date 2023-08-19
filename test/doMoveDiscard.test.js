import doMoveDiscard from "../src/doMoveDiscard"
import { AttackerDeck, AttackerDiscardPile, StatusCode } from "../src/shared"

jest.mock("@samual/lib", () => ({ ...jest.requireActual("@samual/lib"), shuffle: array => array }))

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
		defenderHand: [ "2!" ],
		turn: 110,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveDiscard(state, "2!", 0)).toEqual({ status: StatusCode.MadeMoveOnFinishedGame })

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
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("unowned card (defender)", () => {
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

	expect(doMoveDiscard(state, "2!", 0)).toEqual({ status: StatusCode.PlayedUnownedCard })

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
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("defender trying to discard to attacker's discard pile", () => {
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
		defenderHand: [ "2!" ],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveDiscard(state, "2!", AttackerDiscardPile))
		.toEqual({ status: StatusCode.DiscardedToOpponentDiscardPile })

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
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("normal play (defender)", () => {
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
		defenderHand: [ "2!" ],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveDiscard(state, "2!", 0)).toEqual({ status: StatusCode.Ok, cardDiscarded: "2!", cardsDrawn: undefined })

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
		laneDiscardPiles: [ [ "2!" ], [], [], [], [], [] ],
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

test("card face only (defender)", () => {
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
		defenderHand: [ "2!" ],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveDiscard(state, "2", 0)).toEqual({ status: StatusCode.Ok, cardDiscarded: "2!", cardsDrawn: undefined })

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
		laneDiscardPiles: [ [ "2!" ], [], [], [], [], [] ],
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

test("unowned card (attacker)", () => {
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
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveDiscard(state, "2!", AttackerDeck)).toEqual({ status: StatusCode.PlayedUnownedCard })

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
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("attacker trying to discard to lane discard pile", () => {
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
		attackerHand: [ "2!" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveDiscard(state, "2!", 0)).toEqual({ status: StatusCode.DiscardedToOpponentDiscardPile })

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
		attackerHand: [ "2!" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("attacker discarding when attacker stack is empty", () => {
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
		attackerHand: [ "2!" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveDiscard(state, "2!", AttackerDiscardPile))
		.toEqual({ status: StatusCode.AttackerDiscardedToEmptyDiscardAndDeck })

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
		attackerHand: [ "2!" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("attacker discarding with one card in attacker deck", () => {
	/** @type {import("../src/shared").State} */
	const state = {
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [ "3!" ],
		attackerDiscardPile: [],
		attackerHand: [ "2!" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveDiscard(state, "2!", AttackerDiscardPile))
		.toEqual({ status: StatusCode.Ok, cardDiscarded: "2!", cardsDrawn: [ "3!", "2!" ] })

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
		attackerHand: [ "3!", "2!" ],
		defenderHand: [],
		turn: 2,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("attacker discarding with one card in attacker discard pile", () => {
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
		attackerDiscardPile: [ "3!" ],
		attackerHand: [ "2!" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveDiscard(state, "2!", AttackerDiscardPile))
		.toEqual({ status: StatusCode.Ok, cardDiscarded: "2!", cardsDrawn: [ "2!", "3!" ] })

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
		attackerHand: [ "2!", "3!" ],
		defenderHand: [],
		turn: 2,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("card face only (attacker)", () => {
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
		attackerDiscardPile: [ "3!" ],
		attackerHand: [ "2!" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveDiscard(state, "2", AttackerDiscardPile))
		.toEqual({ status: StatusCode.Ok, cardDiscarded: "2!", cardsDrawn: [ "2!", "3!" ] })

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
		attackerHand: [ "2!", "3!" ],
		defenderHand: [],
		turn: 2,
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
		attackerDiscardPile: [ "3!" ],
		attackerHand: [ "2!" ],
		defenderHand: [],
		turn: 109,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveDiscard(state, "2!", AttackerDiscardPile))
		.toEqual({ status: StatusCode.DefenderWin, cardDiscarded: "2!", cardsDrawn: [ "2!", "3!" ] })

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
		attackerHand: [ "2!", "3!" ],
		defenderHand: [],
		turn: 110,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})

test("attacker discarding with more than one card in attacker deck", () => {
	/** @type {import("../src/shared").State} */
	const state = {
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [ [], [], [], [], [], [] ],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [ "3!", "3#" ],
		attackerDiscardPile: [],
		attackerHand: [ "2!" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}

	expect(doMoveDiscard(state, "2!", AttackerDiscardPile))
		.toEqual({ status: StatusCode.Ok, cardDiscarded: "2!", cardsDrawn: [ "3#", "3!" ] })

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
		attackerDiscardPile: [ "2!" ],
		attackerHand: [ "3#", "3!" ],
		defenderHand: [],
		turn: 2,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	})
})
