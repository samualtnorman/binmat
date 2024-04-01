import { CardStringFaces, CardStringSuits, type CardString } from "./common"

export const isCard = (card: string): card is CardString =>
	card.length == 2 && CardStringFaces.includes(card[0]!) && CardStringSuits.includes(card[1]!)

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	test(`too long`, () => expect(isCard(`5##`)).toBe(false))
	test(`too short`, () => expect(isCard(`3`)).toBe(false))
	test(`invalid face`, () => expect(isCard(`1`)).toBe(false))
	test(`invalid suit`, () => expect(isCard(`#`)).toBe(false))
	test(`valid`, () => expect(isCard(`a&`)).toBe(true))
}
