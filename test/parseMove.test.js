import { expect, test } from "vitest"
import { parseMove } from "../src/parseMove"
import { AttackerDeck, AttackerDiscardPile, MoveTag } from "../src/common"

test("pass", () =>
	expect(parseMove("--")).toEqual({ tag: MoveTag.Pass })
)

test("draw from lane deck", () =>
	expect(parseMove("d0")).toEqual({ tag: MoveTag.Draw, deck: 0 })
)

test("draw from attacker deck", () =>
	expect(parseMove("da")).toEqual({ tag: MoveTag.Draw, deck: AttackerDeck })
)

test("initiate combat", () =>
	expect(parseMove("c0")).toEqual({ tag: MoveTag.Combat, lane: 0 })
)

test("play card (only face value)", () =>
	expect(parseMove("p80")).toEqual({ tag: MoveTag.Play, card: "8", lane: 0 })
)

test("play card face up (only face value)", () =>
	expect(parseMove("u80")).toEqual({ tag: MoveTag.PlayFaceUp, card: "8", lane: 0 })
)

test("play card (full card)", () =>
	expect(parseMove("p8&0")).toEqual({ tag: MoveTag.Play, card: "8&", lane: 0 })
)

test("play card face up (full card)", () =>
	expect(parseMove("u8&0")).toEqual({ tag: MoveTag.PlayFaceUp, card: "8&", lane: 0 })
)

test("play invalid card", () =>
	expect(() => parseMove("pX")).toThrow()
)

test("discard card (only face value) (assume attacker discard pile)", () =>
	expect(parseMove("x8", true)).toEqual({ tag: MoveTag.Discard, card: "8", discardPile: AttackerDiscardPile })
)

test("discard card to attacker discard pile (only face value)", () =>
	expect(parseMove("x8a")).toEqual({ tag: MoveTag.Discard, card: "8", discardPile: AttackerDiscardPile })
)

test("discard card (full card) (assume attacker discard pile)", () =>
	expect(parseMove("x8&", true)).toEqual({ tag: MoveTag.Discard, card: "8&", discardPile: AttackerDiscardPile })
)

test("discard card to lane discard pile (only face value)", () =>
	expect(parseMove("x80")).toEqual({ tag: MoveTag.Discard, card: "8", discardPile: 0 })
)

test("discard card to attacker discard pile (full card)", () =>
	expect(parseMove("x8&a")).toEqual({ tag: MoveTag.Discard, card: "8&", discardPile: AttackerDiscardPile })
)

test("discard card to lane discard pile (only face value)", () =>
	expect(parseMove("x80")).toEqual({ tag: MoveTag.Discard, card: "8", discardPile: 0 })
)

test("discard card to lane discard pile (full card)", () =>
	expect(parseMove("x8&0")).toEqual({ tag: MoveTag.Discard, card: "8&", discardPile: 0 })
)

test("invalid discard", () =>
	expect(() => parseMove("x8")).toThrow()
)

test("invalid move", () =>
	expect(() => parseMove("XX")).toThrow()
)
