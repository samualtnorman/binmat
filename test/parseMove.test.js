import parseMove from "../src/parseMove"
import { Action, AttackerDeck, AttackerDiscardPile } from "../src/shared"

it(`works`, () => {
	expect(parseMove(`--`)).toEqual({ action: Action.Pass })
	expect(parseMove(`d0`)).toEqual({ action: Action.Draw, deck: 0 })
	expect(parseMove(`da`)).toEqual({ action: Action.Draw, deck: AttackerDeck })
	expect(parseMove(`c0`)).toEqual({ action: Action.Combat, lane: 0 })
	expect(parseMove(`p80`)).toEqual({ action: Action.Play, card: `8`, lane: 0 })
	expect(parseMove(`u80`)).toEqual({ action: Action.PlayFaceup, card: `8`, lane: 0 })
	expect(parseMove(`p8&0`)).toEqual({ action: Action.Play, card: `8&`, lane: 0 })
	expect(parseMove(`u8&0`)).toEqual({ action: Action.PlayFaceup, card: `8&`, lane: 0 })
	expect(() => parseMove(`pX`)).toThrow()
	expect(parseMove(`x8`, true)).toEqual({ action: Action.Discard, card: `8`, discardPile: AttackerDiscardPile })
	expect(parseMove(`x8a`)).toEqual({ action: Action.Discard, card: `8`, discardPile: AttackerDiscardPile })
	expect(parseMove(`x8&`, true)).toEqual({ action: Action.Discard, card: `8&`, discardPile: AttackerDiscardPile })
	expect(parseMove(`x80`)).toEqual({ action: Action.Discard, card: `8`, discardPile: 0 })
	expect(parseMove(`x8&a`)).toEqual({ action: Action.Discard, card: `8&`, discardPile: AttackerDiscardPile })
	expect(parseMove(`x8&0`)).toEqual({ action: Action.Discard, card: `8&`, discardPile: 0 })
	expect(() => parseMove(`x8`)).toThrow()
	expect(() => parseMove(`XX`)).toThrow()
})
