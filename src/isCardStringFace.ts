import { CardStringFaces, type CardStringFace } from "./common"

export const isCardStringFace = (face: string): face is CardStringFace => CardStringFaces.includes(face)

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	test(`invalid`, () => expect(isCardStringFace(`1`)).toBe(false))
	test(`valid`, () => expect(isCardStringFace(`7`)).toBe(true))
}
