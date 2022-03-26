import { shuffle } from "@samual/lib"

export const enum CardModifier {
	Trap = `@`,
	Wild = `*`,
	Bounce = `?`,
	Break = `>`
}

export type CardNumber = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a"
export type CardValue = CardNumber | CardModifier

export const enum CardSuit {
	Form = `&`,
	Kin = `%`,
	Data = `+`,
	Chaos = `!`,
	Void = `^`,
	Choice = `#`
}

export type Card = `${CardValue}${CardSuit}`

export type DefenderStack = {
	cards: Card[]
	faceup: boolean
}

export const enum Role {
	Defender = 1,
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
	defenderPassedLastTurn: boolean
}

export const Cards: Card[] = [
	`2&`, `3&`, `4&`, `5&`, `6&`, `7&`, `8&`, `9&`, `a&`, `@&`, `*&`, `?&`, `>&`,
	`2%`, `3%`, `4%`, `5%`, `6%`, `7%`, `8%`, `9%`, `a%`, `@%`, `*%`, `?%`, `>%`,
	`2+`, `3+`, `4+`, `5+`, `6+`, `7+`, `8+`, `9+`, `a+`, `@+`, `*+`, `?+`, `>+`,
	`2!`, `3!`, `4!`, `5!`, `6!`, `7!`, `8!`, `9!`, `a!`, `@!`, `*!`, `?!`, `>!`,
	`2^`, `3^`, `4^`, `5^`, `6^`, `7^`, `8^`, `9^`, `a^`, `@^`, `*^`, `?^`, `>^`,
	`2#`, `3#`, `4#`, `5#`, `6#`, `7#`, `8#`, `9#`, `a#`, `@#`, `*#`, `?#`, `>#`
]

export function createState(deck = shuffle([ ...Cards ])): State {
	return {
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], faceup: false }, { cards: [], faceup: false }, { cards: [], faceup: false },
			{ cards: [], faceup: false }, { cards: [], faceup: false }, { cards: [], faceup: false }
		],
		laneDecks: [
			deck.slice(0, 13),
			deck.slice(13, 26),
			deck.slice(26, 39),
			deck.slice(39, 52),
			deck.slice(52, 65),
			deck.slice(65)
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
	}
}

export default createState
