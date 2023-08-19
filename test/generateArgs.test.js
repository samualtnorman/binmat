import { generateArgs } from "../src/generateArgs"

it("works", () => {
	expect(generateArgs({
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
	}, "defender", "attacker", [])).toEqual({
		plr: "d0",
		s: { turns: 0, ord: 0 },
		plrs: [ [ "d0", "defender" ], [ "a0", "attacker" ] ],
		ops: []
	})

	expect(generateArgs({
		attackerStacks: [ [ "9&" ], [ "6&" ], [ "6!" ], [ "2+" ], [ "3!" ], [ "8%" ] ],
		defenderStacks: [
			{ cards: [ "8#" ], isFaceUp: false }, { cards: [ "*&" ], isFaceUp: false }, { cards: [ "a#" ], isFaceUp: false },
			{ cards: [ "2#" ], isFaceUp: false }, { cards: [ "4!" ], isFaceUp: false }, { cards: [ "a%" ], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%" ]
		],
		laneDiscardPiles: [ [ "4%" ], [ "?+" ], [ "6#" ], [ "4#" ], [ "@%" ], [ "9%" ] ],
		attackerDeck: [ "7+" ],
		attackerDiscardPile: [ "3+" ],
		attackerHand: [ "9+" ],
		defenderHand: [ "?#" ],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, "defender", "attacker", [])).toEqual({
		plr: "d0",
		s: {
			turns: 0,
			ord: 0,
			l0: { c: 9, t: "X" },
			l1: { c: 9, t: "X" },
			l2: { c: 9, t: "X" },
			l3: { c: 9, t: "a&" },
			l4: { c: 10, t: "2!" },
			l5: { c: 10, t: "?%" },
			x0: [ "4%u" ],
			x1: [ "?+u" ],
			x2: [ "6#u" ],
			x3: [ "4#u" ],
			x4: [ "@%u" ],
			x5: [ "9%u" ],
			xa: [ "3+" ],
			a: { c: 1, t: "X" },
			a0: [ "X" ],
			a1: [ "X" ],
			a2: [ "X" ],
			a3: [ "X" ],
			a4: [ "X" ],
			a5: [ "X" ],
			d0: [ "8#" ],
			d1: [ "*&" ],
			d2: [ "a#" ],
			d3: [ "2#" ],
			d4: [ "4!" ],
			d5: [ "a%" ],
			ha0: 1,
			hd0: [ "?#" ]
		},
		plrs: [ [ "d0", "defender" ], [ "a0", "attacker" ] ],
		ops: []
	})

	expect(generateArgs({
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
	}, "defender", "attacker", [])).toEqual({
		plr: "a0",
		s: { turns: 1, ord: 0 },
		plrs: [ [ "d0", "defender" ], [ "a0", "attacker" ] ],
		ops: []
	})

	expect(generateArgs({
		attackerStacks: [ [ "9&" ], [ "6&" ], [ "6!" ], [ "2+" ], [ "3!" ], [ "8%" ] ],
		defenderStacks: [
			{ cards: [ "8#" ], isFaceUp: false }, { cards: [ "*&" ], isFaceUp: false }, { cards: [ "a#" ], isFaceUp: false },
			{ cards: [ "2#" ], isFaceUp: false }, { cards: [ "4!" ], isFaceUp: false }, { cards: [ "a%" ], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%" ]
		],
		laneDiscardPiles: [ [ "4%" ], [ "?+" ], [ "6#" ], [ "4#" ], [ "@%" ], [ "9%" ] ],
		attackerDeck: [ "7+" ],
		attackerDiscardPile: [ "3+" ],
		attackerHand: [ "9+" ],
		defenderHand: [ "?#" ],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, "defender", "attacker", [])).toEqual({
		plr: "a0",
		s: {
			turns: 1,
			ord: 0,
			l0: { c: 9, t: "X" },
			l1: { c: 9, t: "X" },
			l2: { c: 9, t: "X" },
			l3: { c: 9, t: "a&" },
			l4: { c: 10, t: "2!" },
			l5: { c: 10, t: "?%" },
			x0: [ "4%u" ],
			x1: [ "?+u" ],
			x2: [ "6#u" ],
			x3: [ "4#u" ],
			x4: [ "@%u" ],
			x5: [ "9%u" ],
			xa: [ "3+" ],
			a: { c: 1, t: "X" },
			a0: [ "9&" ],
			a1: [ "6&" ],
			a2: [ "6!" ],
			a3: [ "2+" ],
			a4: [ "3!" ],
			a5: [ "8%" ],
			d0: [ "X" ],
			d1: [ "X" ],
			d2: [ "X" ],
			d3: [ "X" ],
			d4: [ "X" ],
			d5: [ "X" ],
			ha0: [ "9+" ],
			hd0: 1
		},
		plrs: [ [ "d0", "defender" ], [ "a0", "attacker" ] ],
		ops: []
	})

	expect(generateArgs({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4%" ], isFaceUp: true }, { cards: [ "?+" ], isFaceUp: true }, { cards: [ "6#" ], isFaceUp: true },
			{ cards: [ "4#" ], isFaceUp: true }, { cards: [ "@%" ], isFaceUp: true }, { cards: [ "9%" ], isFaceUp: true }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, "defender", "attacker", [])).toEqual({
		plr: "a0",
		s: {
			turns: 1,
			ord: 0,
			l0: { c: 12, t: "X" },
			l1: { c: 12, t: "X" },
			l2: { c: 12, t: "X" },
			l3: { c: 12, t: "6&" },
			l4: { c: 12, t: "6!" },
			l5: { c: 12, t: "2+" },
			d0: [ "4%" ],
			d1: [ "?+" ],
			d2: [ "6#" ],
			d3: [ "4#" ],
			d4: [ "@%" ],
			d5: [ "9%" ]
		},
		plrs: [ [ "d0", "defender" ], [ "a0", "attacker" ] ],
		ops: []
	})
})
