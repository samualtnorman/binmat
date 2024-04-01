import type { CardString } from "./common"
import { isCardStringFace } from "./isCardStringFace"
import { isCardStringSuit } from "./isCardStringSuit"

export const isCard = (card: string): card is CardString =>
	card.length == 2 && isCardStringFace(card[0]!) && isCardStringSuit(card[1]!)

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	test(`too long`, () => expect(isCard(`5##`)).toBe(false))
	test(`too short`, () => expect(isCard(`3`)).toBe(false))
	test(`invalid face`, () => expect(isCard(`1`)).toBe(false))
	test(`invalid suit`, () => expect(isCard(`#`)).toBe(false))
	test(`valid`, () => expect(isCard(`a&`)).toBe(true))
}
