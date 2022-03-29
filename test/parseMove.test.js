import parseMove from "../src/parseMove"
import { Action, AttackerDeck, AttackerDiscardPile } from "../src/shared"

test(`pass`, () =>
	expect(parseMove(`--`)).toEqual({ action: Action.Pass })
)

test(`draw from lane deck`, () =>
	expect(parseMove(`d0`)).toEqual({ action: Action.Draw, deck: 0 })
)

test(`draw from attacker deck`, () =>
	expect(parseMove(`da`)).toEqual({ action: Action.Draw, deck: AttackerDeck })
)

test(`initiate combat`, () =>
	expect(parseMove(`c0`)).toEqual({ action: Action.Combat, lane: 0 })
)

test(`play card (only face value)`, () =>
	expect(parseMove(`p80`)).toEqual({ action: Action.Play, card: `8`, lane: 0 })
)

test(`play card face up (only face value)`, () =>
	expect(parseMove(`u80`)).toEqual({ action: Action.PlayFaceUp, card: `8`, lane: 0 })
)

test(`play card (full card)`, () =>
	expect(parseMove(`p8&0`)).toEqual({ action: Action.Play, card: `8&`, lane: 0 })
)

test(`play card face up (full card)`, () =>
	expect(parseMove(`u8&0`)).toEqual({ action: Action.PlayFaceUp, card: `8&`, lane: 0 })
)

test(`play invalid card`, () =>
	expect(() => parseMove(`pX`)).toThrow()
)

test(`discard card (only face value) (assume attacker discard pile)`, () =>
	expect(parseMove(`x8`, true)).toEqual({ action: Action.Discard, card: `8`, discardPile: AttackerDiscardPile })
)

test(`discard card to attacker discard pile (only face value)`, () =>
	expect(parseMove(`x8a`)).toEqual({ action: Action.Discard, card: `8`, discardPile: AttackerDiscardPile })
)

test(`discard card (full card) (assume attacker discard pile)`, () =>
	expect(parseMove(`x8&`, true)).toEqual({ action: Action.Discard, card: `8&`, discardPile: AttackerDiscardPile })
)

test(`discard card to lane discard pile (only face value)`, () =>
	expect(parseMove(`x80`)).toEqual({ action: Action.Discard, card: `8`, discardPile: 0 })
)

test(`discard card to attacker discard pile (full card)`, () =>
	expect(parseMove(`x8&a`)).toEqual({ action: Action.Discard, card: `8&`, discardPile: AttackerDiscardPile })
)

test(`discard card to lane discard pile (full card)`, () =>
	expect(parseMove(`x8&0`)).toEqual({ action: Action.Discard, card: `8&`, discardPile: 0 })
)

test(`invalid discard`, () =>
	expect(() => parseMove(`x8`)).toThrow()
)

test(`invalid move`, () =>
	expect(() => parseMove(`XX`)).toThrow()
)
