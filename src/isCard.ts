import { CardStringFaces, CardStringSuits, type CardString } from "./common"

export const isCard = (card: string): card is CardString =>
	card.length == 2 && CardStringFaces.includes(card[0]!) && CardStringSuits.includes(card[1]!)
