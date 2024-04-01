import { CardStringSuits, type CardStringSuit } from "./common"

export const isCardStringSuit = (suit: string): suit is CardStringSuit => CardStringSuits.includes(suit)

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	test(`invalid`, () => expect(isCardStringSuit(`*`)).toBe(false))
	test(`valid`, () => expect(isCardStringSuit(`+`)).toBe(true))
}
