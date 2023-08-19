import doMovePlayFaceUp from "../src/doMovePlayFaceUp"
import { CardModifier, StatusCode } from "../src/shared"

test("regular card (defender)", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4%" ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [ "6#" ],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, "6#", 0)).toEqual({ status: StatusCode.Ok, cardPlayed: "6#", combat: undefined })
})

test("finished game", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4%" ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [ "6#" ],
		turn: 110,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, "6#", 0)).toEqual({ status: StatusCode.MadeMoveOnFinishedGame })
})

test("face value only (defender)", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4%" ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [ "6#" ],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, "6", 0)).toEqual({ status: StatusCode.Ok, cardPlayed: "6#", combat: undefined })
})

test("unowned card (defender)", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4%" ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [ "6#" ],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, "4#", 0)).toEqual({ status: StatusCode.PlayedUnownedCard })
})

test("break to empty stack (defender)", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [ ">!" ],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, ">!", 0)).toEqual({ status: StatusCode.PlayedBreakToEmptyStack })
})

test("break to stack with break (defender)", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ ">+" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [ ">!" ],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, ">!", 0)).toEqual({ status: StatusCode.DefenderPlayedFaceUpBreakToStackWithBreak })
})

test("combat (defender)", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4#" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [ ">!" ],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, ">!", 0)).toEqual({
		status: StatusCode.Ok,
		cardPlayed: ">!",
		combat: {
			attackerStack: [],
			defenderStack: [ "4#", ">!" ],
			attackerAttackPower: 0,
			defenderAttackPower: 2,
			damageValue: 0,
			cardsDrawn: [],
			attackerBouncesDiscarded: [],
			attackerCardsTrapped: [],
			attackerStackDiscarded: [],
			defenderBouncesDiscarded: [],
			defenderCardsTrapped: [],
			defenderStackWasFaceUp: false,
			cardsDrawnToDiscard: []
		}
	})
})

test("attacker win (defender's turn)", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [ "8%" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4#" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [ "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
		defenderHand: [ ">!" ],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, ">!", 0)).toEqual({
		status: StatusCode.AttackerWin,
		cardPlayed: ">!",
		combat: {
			attackerStack: [ "8%" ],
			defenderStack: [ "4#", ">!" ],
			attackerAttackPower: 3,
			defenderAttackPower: 2,
			damageValue: 3,
			cardsDrawn: [],
			attackerCardsTrapped: [],
			defenderCardsTrapped: [],
			attackerBouncesDiscarded: [],
			defenderBouncesDiscarded: [],
			attackerStackDiscarded: [ "8%" ],
			defenderStackWasFaceUp: false,
			cardsDrawnToDiscard: [ ">!", "4#" ]
		}
	})
})

test("played wrong way (defender)", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [ "4%" ],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, "4%", 0)).toEqual({ status: StatusCode.PlayedCardFacedWrongWay })
})

test("played wrong way (attacker)", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4%" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [ "6#" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, "6#", 0)).toEqual({ status: StatusCode.PlayedCardFacedWrongWay })
})

test("face value only (attacker)", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [ "?+" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, CardModifier.Bounce, 0)).toEqual({
		status: 0,
		cardPlayed: "?+",
		combat: {
			attackerStack: [ "?+" ],
			defenderStack: [],
			attackerAttackPower: 0,
			defenderAttackPower: 0,
			damageValue: 0,
			cardsDrawn: [],
			attackerBouncesDiscarded: [ "?+" ],
			attackerCardsTrapped: [],
			attackerStackDiscarded: [ "?+" ],
			defenderBouncesDiscarded: [],
			defenderCardsTrapped: [],
			defenderStackWasFaceUp: false,
			cardsDrawnToDiscard: []
		}
	})
})

test("unowned card (attacker)", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4%" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [ "6#" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, "4#", 0)).toEqual({ status: StatusCode.PlayedUnownedCard })
})

test("break to empty stack (attacker)", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [ ">!" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, ">!", 0)).toEqual({ status: StatusCode.PlayedBreakToEmptyStack })
})

test("break to stack with break as attacker is allowed", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [ ">+" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [ ">!" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, ">!", 0)).toEqual({
		status: StatusCode.Ok,
		cardPlayed: ">!",
		combat: {
			attackerStack: [ ">+", ">!" ],
			defenderStack: [],
			attackerAttackPower: 0,
			defenderAttackPower: 0,
			damageValue: 0,
			cardsDrawn: [],
			attackerBouncesDiscarded: [],
			attackerCardsTrapped: [],
			attackerStackDiscarded: [ ">+", ">!" ],
			defenderBouncesDiscarded: [],
			defenderCardsTrapped: [],
			defenderStackWasFaceUp: false,
			cardsDrawnToDiscard: []
		}
	})
})

test("combat (attacker)", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [ "4#" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [ ">!" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, ">!", 0)).toEqual({
		status: StatusCode.Ok,
		cardPlayed: ">!",
		combat: {
			attackerStack: [ "4#", ">!" ],
			defenderStack: [],
			attackerAttackPower: 2,
			defenderAttackPower: 0,
			damageValue: 2,
			cardsDrawn: [ "3+", "4%" ],
			attackerBouncesDiscarded: [],
			attackerCardsTrapped: [],
			attackerStackDiscarded: [ "4#", ">!" ],
			defenderBouncesDiscarded: [],
			defenderCardsTrapped: [],
			defenderStackWasFaceUp: false,
			cardsDrawnToDiscard: []
		}
	})
})

test("attacker win (attacker's turn)", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [ "4#" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [ ">!" ],
		defenderHand: [ "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, ">!", 0)).toEqual({
		status: StatusCode.AttackerWin,
		cardPlayed: ">!",
		combat: {
			attackerStack: [ "4#", ">!" ],
			defenderStack: [],
			attackerAttackPower: 2,
			defenderAttackPower: 0,
			damageValue: 2,
			cardsDrawn: [],
			attackerCardsTrapped: [],
			defenderCardsTrapped: [],
			attackerBouncesDiscarded: [],
			defenderBouncesDiscarded: [],
			attackerStackDiscarded: [ "4#", ">!" ],
			defenderStackWasFaceUp: false,
			cardsDrawnToDiscard: []
		}
	})
})

test("bounce", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4%" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [ "?+" ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, "?+", 0)).toEqual({
		status: StatusCode.Ok,
		cardPlayed: "?+",
		combat: {
			attackerStack: [ "?+" ],
			defenderStack: [ "4%" ],
			attackerAttackPower: 0,
			defenderAttackPower: 2,
			damageValue: 0,
			cardsDrawn: [],
			attackerBouncesDiscarded: [ "?+" ],
			attackerCardsTrapped: [],
			attackerStackDiscarded: [ "?+" ],
			defenderBouncesDiscarded: [],
			defenderCardsTrapped: [],
			defenderStackWasFaceUp: false,
			cardsDrawnToDiscard: []
		}
	})
})

test("defender win", () => {
	expect(doMovePlayFaceUp({
		attackerStacks: [ [ "4%" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [ ">!" ],
		defenderHand: [],
		turn: 109,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, ">!", 0)).toEqual({
		status: StatusCode.DefenderWin,
		cardPlayed: ">!",
		combat: {
			attackerStack: [ "4%", ">!" ],
			defenderStack: [],
			attackerAttackPower: 2,
			defenderAttackPower: 0,
			damageValue: 2,
			cardsDrawn: [ "3!", "3+" ],
			attackerBouncesDiscarded: [],
			attackerCardsTrapped: [],
			attackerStackDiscarded: [ "4%", ">!" ],
			defenderBouncesDiscarded: [],
			defenderCardsTrapped: [],
			defenderStackWasFaceUp: false,
			cardsDrawnToDiscard: []
		}
	})
})
