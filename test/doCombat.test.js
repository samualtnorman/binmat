import doCombat from "../src/doCombat"
import { StatusCode } from "../src/shared"

it(`works`, () => {
	expect(doCombat({
		attackerStacks: [ [ `8%`, `@#`, `*!`, `?!`, `>#`, `a&`, `3+` ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ `4%`, `@%`, `*%`, `?+`, `>+`, `a!`, `3!` ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ `>!`, `9!`, `4+`, `8^`, `*#`, `5!`, `2&`, `3&`, `?&`, `4!` ],
			[ `7#`, `5&`, `*+`, `6+`, `@+`, `8&`, `8+`, `a%`, `7+` ],
			[ `7%`, `2^`, `>&`, `9#`, `*^`, `9^`, `6%`, `?^`, `9+`, `8#`, `9&`, `6#` ],
			[ `3#`, `>^`, `5%`, `7&`, `>%`, `8!`, `a^`, `?#`, `*&`, `6&`, `4#` ],
			[ `a+`, `5+`, `3%`, `@^`, `@&`, `5#`, `7^`, `3^`, `2!`, `a#`, `6!` ],
			[ `@!`, `4&`, `7!`, `5^`, `2%`, `4^`, `6^`, `?%`, `2#`, `2+`, `9%` ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, 0)).toEqual({
		status: StatusCode.Ok,
		attackerStack: [ `8%`, `@#`, `*!`, `?!`, `>#`, `a&`, `3+` ],
		defenderStack: [ `4%`, `@%`, `*%`, `?+`, `>+`, `a!`, `3!` ],
		attackerAttackPower: 5,
		defenderAttackPower: 4,
		damageValue: 0,
		cardsDrawn: [],
		attackerBouncesDiscarded: [ `?!` ],
		defenderBouncesDiscarded: [ `?+` ],
		attackerCardsTrapped: [ `3+` ],
		defenderCardsTrapped: [ `3!` ],
		attackerStackDiscarded: [ `8%`, `@#`, `*!`, `?!`, `>#`, `a&` ],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: []
	})

	expect(doCombat({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ `4%` ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ `>!`, `9!`, `4+`, `8^`, `*#`, `5!`, `2&`, `3&`, `?&`, `4!`, `3!`, `3+` ],
			[ `7#`, `*!`, `5&`, `*+`, `a!`, `6+`, `@+`, `8&`, `8+`, `a%`, `8%`, `7+`, `?+` ],
			[ `7%`, `2^`, `>&`, `9#`, `*^`, `9^`, `6%`, `?^`, `>+`, `9+`, `8#`, `9&`, `6#` ],
			[ `3#`, `>^`, `5%`, `7&`, `>%`, `8!`, `a^`, `@#`, `a&`, `?#`, `*&`, `6&`, `4#` ],
			[ `a+`, `5+`, `3%`, `@^`, `@&`, `>#`, `5#`, `7^`, `3^`, `2!`, `a#`, `6!`, `@%` ],
			[ `*%`, `@!`, `?!`, `4&`, `7!`, `5^`, `2%`, `4^`, `6^`, `?%`, `2#`, `2+`, `9%` ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, 0)).toEqual({
		status: StatusCode.Ok,
		attackerStack: [],
		defenderStack: [ `4%` ],
		attackerAttackPower: 0,
		defenderAttackPower: 2,
		damageValue: 0,
		cardsDrawn: [],
		attackerBouncesDiscarded: [],
		defenderBouncesDiscarded: [],
		attackerCardsTrapped: [],
		defenderCardsTrapped: [],
		attackerStackDiscarded: [],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: []
	})

	expect(doCombat({
		attackerStacks: [ [ `4%`, `>+` ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[],
			[ `7#`, `*!`, `5&`, `*+`, `a!`, `6+`, `@+`, `8&`, `8+`, `a%`, `8%`, `7+`, `?+` ],
			[ `7%`, `2^`, `>&`, `9#`, `*^`, `9^`, `6%`, `?^`, `9+`, `8#`, `9&`, `6#` ],
			[ `3#`, `>^`, `5%`, `7&`, `>%`, `8!`, `a^`, `@#`, `a&`, `?#`, `*&`, `6&`, `4#` ],
			[ `a+`, `5+`, `3%`, `@^`, `@&`, `>#`, `5#`, `7^`, `3^`, `2!`, `a#`, `6!`, `@%` ],
			[ `*%`, `@!`, `?!`, `4&`, `7!`, `5^`, `2%`, `4^`, `6^`, `?%`, `2#`, `2+`, `9%` ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [ `>!`, `9!`, `4+`, `8^`, `*#`, `5!`, `2&`, `3&`, `?&`, `4!`, `3!`, `3+` ],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, 0)).toEqual({
		status: StatusCode.AttackerWin,
		attackerStack: [ `4%`, `>+` ],
		defenderStack: [],
		attackerAttackPower: 2,
		defenderAttackPower: 0,
		damageValue: 2,
		cardsDrawn: [],
		attackerBouncesDiscarded: [],
		defenderBouncesDiscarded: [],
		attackerCardsTrapped: [],
		defenderCardsTrapped: [],
		attackerStackDiscarded: [ `4%`, `>+` ],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: []
	})

	expect(doCombat({
		attackerStacks: [ [ `4%` ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[],
			[ `7#`, `*!`, `5&`, `*+`, `a!`, `6+`, `@+`, `8&`, `8+`, `a%`, `8%`, `7+`, `?+` ],
			[ `7%`, `2^`, `>&`, `9#`, `*^`, `9^`, `6%`, `?^`, `>+`, `9+`, `8#`, `9&`, `6#` ],
			[ `3#`, `>^`, `5%`, `7&`, `>%`, `8!`, `a^`, `@#`, `a&`, `?#`, `*&`, `6&`, `4#` ],
			[ `a+`, `5+`, `3%`, `@^`, `@&`, `>#`, `5#`, `7^`, `3^`, `2!`, `a#`, `6!`, `@%` ],
			[ `*%`, `@!`, `?!`, `4&`, `7!`, `5^`, `2%`, `4^`, `6^`, `?%`, `2#`, `2+`, `9%` ]
		],
		laneDiscardPiles: [ [ `>!`, `9!`, `4+`, `8^`, `*#`, `5!`, `2&`, `3&`, `?&`, `4!`, `3!`, `3+` ], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, 0)).toMatchObject({
		status: StatusCode.Ok,
		attackerStack: [ `4%` ],
		defenderStack: [],
		attackerAttackPower: 2,
		defenderAttackPower: 0,
		damageValue: 3,
		attackerBouncesDiscarded: [],
		defenderBouncesDiscarded: [],
		attackerCardsTrapped: [],
		defenderCardsTrapped: [],
		attackerStackDiscarded: [ `4%` ],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: []
	})

	expect(doCombat({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ `4%` ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ `>!`, `9!`, `4+`, `8^`, `*#`, `5!`, `2&`, `3&`, `?&`, `4!`, `3!`, `3+` ],
			[ `7#`, `*!`, `5&`, `*+`, `a!`, `6+`, `@+`, `8&`, `8+`, `a%`, `8%`, `7+`, `?+` ],
			[ `7%`, `2^`, `>&`, `9#`, `*^`, `9^`, `6%`, `?^`, `>+`, `9+`, `8#`, `9&`, `6#` ],
			[ `3#`, `>^`, `5%`, `7&`, `>%`, `8!`, `a^`, `@#`, `a&`, `?#`, `*&`, `6&`, `4#` ],
			[ `a+`, `5+`, `3%`, `@^`, `@&`, `>#`, `5#`, `7^`, `3^`, `2!`, `a#`, `6!`, `@%` ],
			[ `*%`, `@!`, `?!`, `4&`, `7!`, `5^`, `2%`, `4^`, `6^`, `?%`, `2#`, `2+`, `9%` ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, 0)).toEqual({
		status: StatusCode.Ok,
		attackerStack: [],
		defenderStack: [ `4%` ],
		attackerAttackPower: 0,
		defenderAttackPower: 2,
		damageValue: 0,
		cardsDrawn: [],
		attackerBouncesDiscarded: [],
		defenderBouncesDiscarded: [],
		attackerCardsTrapped: [],
		defenderCardsTrapped: [],
		attackerStackDiscarded: [],
		defenderStackWasFaceUp: true,
		cardsDrawnToDiscard: []
	})

	expect(doCombat({
		attackerStacks: [ [ `4%` ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ `4!`, `3!`, `3+` ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ `>!`, `9!`, `4+`, `8^`, `*#`, `5!`, `2&`, `3&`, `?&` ],
			[ `7#`, `*!`, `5&`, `*+`, `a!`, `6+`, `@+`, `8&`, `8+`, `a%`, `8%`, `7+`, `?+` ],
			[ `7%`, `2^`, `>&`, `9#`, `*^`, `9^`, `6%`, `?^`, `>+`, `9+`, `8#`, `9&`, `6#` ],
			[ `3#`, `>^`, `5%`, `7&`, `>%`, `8!`, `a^`, `@#`, `a&`, `?#`, `*&`, `6&`, `4#` ],
			[ `a+`, `5+`, `3%`, `@^`, `@&`, `>#`, `5#`, `7^`, `3^`, `2!`, `a#`, `6!`, `@%` ],
			[ `*%`, `@!`, `?!`, `4&`, `7!`, `5^`, `2%`, `4^`, `6^`, `?%`, `2#`, `2+`, `9%` ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, 0)).toEqual({
		status: StatusCode.Ok,
		attackerStack: [ `4%` ],
		defenderStack: [ `4!`, `3!`, `3+` ],
		attackerAttackPower: 2,
		defenderAttackPower: 0,
		damageValue: 3,
		cardsDrawn: [],
		attackerBouncesDiscarded: [],
		defenderBouncesDiscarded: [],
		attackerCardsTrapped: [],
		defenderCardsTrapped: [],
		attackerStackDiscarded: [ `4%` ],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: [ `3+`, `3!`, `4!` ]
	})

	expect(doCombat({
		attackerStacks: [ [ `4%` ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ `>!`, `9!`, `4+`, `8^`, `*#`, `5!`, `2&`, `3&`, `?&`, `4!`, `3!`, `3+` ],
			[ `7#`, `*!`, `5&`, `*+`, `a!`, `6+`, `@+`, `8&`, `8+`, `a%`, `8%`, `7+`, `?+` ],
			[ `7%`, `2^`, `>&`, `9#`, `*^`, `9^`, `6%`, `?^`, `>+`, `9+`, `8#`, `9&`, `6#` ],
			[ `3#`, `>^`, `5%`, `7&`, `>%`, `8!`, `a^`, `@#`, `a&`, `?#`, `*&`, `6&`, `4#` ],
			[ `a+`, `5+`, `3%`, `@^`, `@&`, `>#`, `5#`, `7^`, `3^`, `2!`, `a#`, `6!`, `@%` ],
			[ `*%`, `@!`, `?!`, `4&`, `7!`, `5^`, `2%`, `4^`, `6^`, `?%`, `2#`, `2+`, `9%` ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, 0)).toMatchObject({
		status: StatusCode.Ok,
		attackerStack: [ `4%` ],
		defenderStack: [],
		attackerAttackPower: 2,
		defenderAttackPower: 0,
		damageValue: 3,
		attackerBouncesDiscarded: [],
		defenderBouncesDiscarded: [],
		attackerCardsTrapped: [],
		defenderCardsTrapped: [],
		attackerStackDiscarded: [ `4%` ],
		defenderStackWasFaceUp: false,
		cardsDrawnToDiscard: []
	})
})
