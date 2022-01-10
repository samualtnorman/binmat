import { assert } from "@samual/lib"

export const enum CardModifier {
	Trap = "@",
	Wild = "*",
	Bounce = "?",
	Break = ">"
}

export type CardNumber = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a"
export type CardValue = CardNumber | CardModifier

export const enum CardSuit {
	Form = "&",
	Kin = "%",
	Data = "+",
	Chaos = "!",
	Void = "^",
	Choice = "#"
}

export type Card = `${CardValue}${CardSuit}`

export type DefenderStack = {
	cards: Card[]
	faceup: boolean
}

export enum Player {
	Defender,
	Attacker
}

export type State = {
	attackerStacks: [ Card[], Card[], Card[], Card[], Card[], Card[] ]
	defenderStacks: [ DefenderStack, DefenderStack, DefenderStack, DefenderStack, DefenderStack, DefenderStack ]
	laneDecks: [ Card[], Card[], Card[], Card[], Card[], Card[] ]
	laneDiscardPiles: [ Card[], Card[], Card[], Card[], Card[], Card[] ]
	attackerDeck: Card[]
	attackerDiscardPile: Card[]
	attackerHand: Card[]
	defenderHand: Card[]
	turn: number
	turns: number
	attackerPassedLastTurn: boolean
	defenderPassedLastTurn: boolean,
	won: Player | null
}

export const Cards: Card[] = [ "2&", "3&", "4&", "5&", "6&", "7&", "8&", "9&", "a&", "@&", "*&", "?&", ">&", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "a%", "@%", "*%", "?%", ">%", "2+", "3+", "4+", "5+", "6+", "7+", "8+", "9+", "a+", "@+", "*+", "?+", ">+", "2!", "3!", "4!", "5!", "6!", "7!", "8!", "9!", "a!", "@!", "*!", "?!", ">!", "2^", "3^", "4^", "5^", "6^", "7^", "8^", "9^", "a^", "@^", "*^", "?^", ">^", "2#", "3#", "4#", "5#", "6#", "7#", "8#", "9#", "a#", "@#", "*#", "?#", ">#" ]

export function newState(): State {
	const laneDecks: State["laneDecks"] = [
		new Array(13),
		new Array(13),
		new Array(13),
		new Array(13),
		new Array(13),
		new Array(13)
	]

	const cards = [ ...Cards ]

	for (let lane = 0; lane < 6; lane++) {
		for (let i = 13; i--;)
			laneDecks[lane][12 - i] = cards.splice(Math.floor(Math.random() * cards.length), 1)[0]
	}

	return {
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], faceup: false }, { cards: [], faceup: false }, { cards: [], faceup: false },
			{ cards: [], faceup: false }, { cards: [], faceup: false }, { cards: [], faceup: false }
		],
		laneDecks,
		laneDiscardPiles: [ [], [], [], [], [], [] ],
		attackerDeck: [],
		attackerDiscardPile: [],
		attackerHand: [],
		defenderHand: [],
		turn: 0,
		turns: 110,
		attackerPassedLastTurn: false,
		defenderPassedLastTurn: false,
		won: null
	}
}

export enum Action {
	Draw,
	Play,
	Combat,
	Discard,
	Pass
}

export const Lanes = [ 0, 1, 2, 3, 4, 5 ] as const
export type Lane = typeof Lanes[number]

export const AttackerDeck = 6
export type AttackerDeck = typeof AttackerDeck

export const AttackerDiscardPile = 6
export type AttackerDiscardPile = typeof AttackerDiscardPile

export type AbreviatedMoveDraw = `d${Lane | "a"}`
export type AbreviatedMoveCombat = `c${Lane}`
export type AbreviatedMovePlay = `p${Card | CardValue | "X"}${Lane}`
export type AbreviatedMovePlayFaceup = `u${Card | CardValue}${Lane}`
export type AbreviatedMoveDiscard = `x${Card | CardValue}${Lane | "a"}`
export type AbreviatedMovePass = "--"
export type AbreviatedMove = AbreviatedMoveDraw | AbreviatedMoveCombat | AbreviatedMovePlay | AbreviatedMovePlayFaceup | AbreviatedMoveDiscard | AbreviatedMovePass

export type Move = {
	action: Action.Draw
	deck: Lane | AttackerDeck
} | {
	action: Action.Play
	quantumCard: Card
	lane: Lane
	faceup: boolean
} | {
	action: Action.Combat
	lane: Lane
} | {
	action: Action.Discard
	quantumCard: Card
	discardPile: Lane | AttackerDiscardPile
} | { action: Action.Pass }

export function playMove(state: State, move: Move): State {
	assert(state.won == null, "cannot play move on won game")

	const playerTurn: Player = state.turn % 2

	if (playerTurn == Player.Defender) {
		if (move.action == Action.Pass) {
			if (state)
		}
	} else {

	}

	return state
}
