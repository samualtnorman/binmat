import { CardStringSuits, type CardStringSuit } from "./common"

export const isCardStringSuit =
	(suit: string): suit is CardStringSuit => suit.length == 1 && CardStringSuits.includes(suit)
