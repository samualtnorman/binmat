import { shuffle } from "@samual/lib/shuffle"
import type { Card, State } from "./common"

export const Cards: Card[] = [
	`2&`, `3&`, `4&`, `5&`, `6&`, `7&`, `8&`, `9&`, `a&`, `@&`, `*&`, `?&`, `>&`,
	`2%`, `3%`, `4%`, `5%`, `6%`, `7%`, `8%`, `9%`, `a%`, `@%`, `*%`, `?%`, `>%`,
	`2+`, `3+`, `4+`, `5+`, `6+`, `7+`, `8+`, `9+`, `a+`, `@+`, `*+`, `?+`, `>+`,
	`2!`, `3!`, `4!`, `5!`, `6!`, `7!`, `8!`, `9!`, `a!`, `@!`, `*!`, `?!`, `>!`,
	`2^`, `3^`, `4^`, `5^`, `6^`, `7^`, `8^`, `9^`, `a^`, `@^`, `*^`, `?^`, `>^`,
	`2#`, `3#`, `4#`, `5#`, `6#`, `7#`, `8#`, `9#`, `a#`, `@#`, `*#`, `?#`, `>#`
]

export function makeState(deck = shuffle([ ...Cards ])): State {
	return {
		attackerStacks: [ [], [], [], [], [], [] ],
		defenderStacks: [
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false },
			{ cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }, { cards: [], isFaceUp: false }
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
