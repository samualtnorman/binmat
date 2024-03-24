import { expect, it } from "vitest"
import { doMove } from "../src/doMove"
import { AttackerDeck, AttackerDiscardPile, MoveTag, StatusCode } from "../src/common"

it("works", () => {
	expect(doMove({
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
		attackerDeck: [ "4%" ],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Draw, deck: AttackerDeck })).toEqual({
		status: StatusCode.Ok,
		binlog: [ "`V001` `n------`", "a0 da / X ha0 " ]
	})

	expect(doMove({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
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
		defenderHand: [],
		turn: 109,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Draw, deck: 5 })).toEqual({
		status: StatusCode.DefenderWin,
		binlog: [ "`V109` `n------`", "a0 d5 / 9% ha0 " ]
	})

	expect(doMove({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
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
		defenderHand: [],
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Draw, deck: AttackerDeck })).toEqual({ status: StatusCode.DefenderDrewFromAttackerDeck })

	expect(doMove({
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
		turn: 109,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.PlayFaceUp, card: "?+", lane: 0 })).toEqual({
		status: StatusCode.DefenderWin,
		binlog: [
			"`V109` `n------`",
			"a0 u?0 / ?+ a0",
			"`n--` c0 / ?+u / ",
			"`n--` a? / ?+ x0",
			"`n--` 0 0 0 /  xa"
		]
	})

	expect(doMove({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4%" ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!" ],
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
		defenderHand: [ "3+" ],
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.PlayFaceUp, card: "3+", lane: 0 })).toEqual({
		status: StatusCode.Ok,
		binlog: [ "`V000` `n------`", "d0 u30 / 3+ d0" ]
	})

	expect(doMove({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
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
		defenderHand: [],
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.PlayFaceUp, card: "4%", lane: 0 })).toEqual({ status: StatusCode.PlayedUnownedCard })

	expect(doMove({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
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
		defenderHand: [],
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Combat, lane: 0 })).toEqual({ status: StatusCode.DefenderInitiatedCombat })

	expect(doMove({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [ "4%" ],
		attackerHand: [ "3+" ],
		defenderHand: [],
		turn: 109,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Discard, card: "3+", discardPile: AttackerDiscardPile })).toEqual({
		status: StatusCode.DefenderWin,
		binlog: [ "`V109` `n------`", "a0 x3a / 3+ xa" ]
	})

	expect(doMove({
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
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Discard, card: "4%", discardPile: 0 })).toEqual({
		status: StatusCode.Ok,
		binlog: [ "`V000` `n------`", "d0 x40 / 4% x0" ]
	})

	expect(doMove({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
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
		defenderHand: [],
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Discard, card: "4%", discardPile: 0 })).toEqual({ status: StatusCode.PlayedUnownedCard })

	expect(doMove({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
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
		defenderHand: [],
		turn: 110,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Pass })).toEqual({ status: StatusCode.MadeMoveOnFinishedGame })

	expect(doMove({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4%" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
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
		attackerHand: [],
		defenderHand: [ ">!" ],
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.PlayFaceUp, card: ">!", lane: 0 })).toEqual({
		status: StatusCode.Ok,
		binlog: [
			"`V000` `n------`",
			"d0 u>0 / >! d0",
			"`n--` c0 /  / 4% >!",
			"`n--` 0 2 - /  x0"
		]
	})

	expect(doMove({
		attackerStacks: [ [ "@%", "3+" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4%", "@#" ], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [ ">!" ],
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.PlayFaceUp, card: ">!", lane: 0 })).toEqual({
		status: StatusCode.Ok,
		binlog: [
			"`V000` `n------`",
			"d0 u>0 / >! d0",
			"`n--` c0 / @% 3+ / 4% @# >!",
			"`n--` d@ / 3+ x0",
			"`n--` a@ / >! xa",
			"`n--` 0 2 - / @% x0"
		]
	})

	expect(doMove({
		attackerStacks: [ [ "@%" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "?+", "4%", "@#", "3+" ], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Combat, lane: 0 })).toEqual({
		status: StatusCode.Ok,
		binlog: [
			"`V001` `n------`",
			"a0 c0",
			"`n--` c0 / @% / ?+ 4% @# 3+",
			"`n--` a@ / 3+ xa",
			"`n--` d@ / @% x0",
			"`n--` d? / ?+ xa",
			"`n--` 0 2 - /  x0"
		]
	})

	expect(doMove({
		attackerStacks: [ [], [], [], [], [], [ "4%" ] ],
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
		defenderHand: [],
		turn: 1,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Combat, lane: 5 })).toEqual({
		status: StatusCode.Ok,
		binlog: [
			"`V001` `n------`",
			"a0 c5",
			"`n--` c5 / 4% / ",
			"`n--` 2 0 3 / 4% xa / 2# 2+ 9% ha0 "
		]
	})

	expect(doMove({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8&", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
		defenderHand: [],
		turn: 1,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Draw, deck: 0 })).toEqual({
		status: StatusCode.AttackerWin,
		binlog: [ "`V001` `n------`", "a0 d0" ]
	})

	expect(doMove({
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
		attackerHand: [ "4%" ],
		defenderHand: [],
		turn: 109,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Play, card: "4%", lane: 0 })).toEqual({
		status: StatusCode.DefenderWin,
		binlog: [ "`V109` `n------`", "a0 pX0 / X a0" ]
	})

	expect(doMove({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
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
		defenderHand: [],
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Play, card: "4%", lane: 0 })).toEqual({ status: StatusCode.PlayedUnownedCard })

	expect(doMove({
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+", "4%" ],
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
		defenderHand: [],
		turn: 0,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Pass })).toEqual({ status: StatusCode.Ok, binlog: [ "`V000` `n------`", "d0 `n--`" ] })

	expect(doMove({
		attackerStacks: [ [ "8&" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4%" ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&", "4!", "3!", "3+" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Combat, lane: 0 })).toEqual({
		status: StatusCode.Ok,
		binlog: [
			"`V001` `n------`",
			"a0 c0",
			"`n--` c0 / 8& / 4%u",
			"`n--` 3 2 2 / 8& xa / 4% xa / X ha0 "
		]
	})

	expect(doMove({
		attackerStacks: [ [ "4%" ], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [ "4!", "3!", "3+", "8&" ], isFaceUp: true }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
		],
		laneDecks: [
			[ ">!", "9!", "4+", "8^", "*#", "5!", "2&", "3&", "?&" ],
			[ "7#", "*!", "5&", "*+", "a!", "6+", "@+", "8+", "a%", "8%", "7+", "?+" ],
			[ "7%", "2^", ">&", "9#", "*^", "9^", "6%", "?^", ">+", "9+", "8#", "9&", "6#" ],
			[ "3#", ">^", "5%", "7&", ">%", "8!", "a^", "@#", "a&", "?#", "*&", "6&", "4#" ],
			[ "a+", "5+", "3%", "@^", "@&", ">#", "5#", "7^", "3^", "2!", "a#", "6!", "@%" ],
			[ "*%", "@!", "?!", "4&", "7!", "5^", "2%", "4^", "6^", "?%", "2#", "2+", "9%" ]
		],
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 1,
		maxTurns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false
	}, { tag: MoveTag.Combat, lane: 0 })).toEqual({
		status: StatusCode.Ok,
		binlog: [
			"`V001` `n------`",
			"a0 c0",
			"`n--` c0 / 4% / 4!u 3!u 3+u 8&u",
			"`n--` 2 0 3 / 4% xa / 8& 3+ 3! xa"
		]
	})
})
