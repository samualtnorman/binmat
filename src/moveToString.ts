import { AttackerDeck, AttackerDiscardPile, MoveTag, type Move, type MoveString } from "./common"

export function moveToString(move: Move): MoveString {
	switch (move.tag) {
		case MoveTag.Draw:
			return `d${move.deck == 6 ? `a` : move.deck}`

		case MoveTag.Combat:
			return `c${move.lane}`

		case MoveTag.Play:
			return `p${move.card}${move.lane}`

		case MoveTag.PlayFaceUp:
			return `u${move.card}${move.lane}`

		case MoveTag.Discard:
			return `x${move.card}${move.discardPile == 6 ? `a` : move.discardPile}`

		case MoveTag.Pass:
			return `--`
	}
}

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	test(`draw from lane`, () => expect(moveToString({ tag: MoveTag.Draw, deck: 2 })).toBe(`d2`))
	test(`draw from attacker deck`, () => expect(moveToString({ tag: MoveTag.Draw, deck: AttackerDeck })).toBe(`da`))
	test(`combat`, () => expect(moveToString({ tag: MoveTag.Combat, lane: 4 })).toBe(`c4`))
	test(`play card`, () => expect(moveToString({ tag: MoveTag.Play, card: `3^`, lane: 1 })).toBe(`p3^1`))
	test(`play face`, () => expect(moveToString({ tag: MoveTag.Play, card: `?`, lane: 3 })).toBe(`p?3`))
	test(`play face up card`, () => expect(moveToString({ tag: MoveTag.PlayFaceUp, card: `>!`, lane: 5 })).toBe(`u>!5`))
	test(`play face up face`, () => expect(moveToString({ tag: MoveTag.PlayFaceUp, card: `7`, lane: 4 })).toBe(`u74`))

	test(
		`discard card to lane`,
		() => expect(moveToString({ tag: MoveTag.Discard, card: `a!`, discardPile: 3 })).toBe(`xa!3`)
	)

	test(
		`discard face to lane`,
		() => expect(moveToString({ tag: MoveTag.Discard, card: `*`, discardPile: 2 })).toBe(`x*2`)
	)

	test(
		`discard card to attacker discard`,
		() => expect(moveToString({ tag: MoveTag.Discard, card: `7!`, discardPile: AttackerDiscardPile })).toBe(`x7!a`)
	)

	test(
		`discard face to attacker discard`,
		() => expect(moveToString({ tag: MoveTag.Discard, card: `9`, discardPile: AttackerDiscardPile })).toBe(`x9a`)
	)

	test(`pass`, () => expect(moveToString({ tag: MoveTag.Pass })).toBe(`--`))
}
