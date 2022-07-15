import { Role } from "../src/shared"
import simulateGame from "../src/simulateGame"

test(`throw when brain doesn't make a move (defender)`, () =>
	expect(() => simulateGame(() => {}, () => {})).toThrow()
)

test(`pass when brain doesn't make a move and configured not to throw`, () =>
	expect(simulateGame(() => {}, () => {}, { noThrow: true })).toBe(Role.Defender)
)

test(`throw when brain doesn't make a move (attacker)`, () =>
	expect(() => simulateGame(
		(_context, _args, xform) => expect(xform({ op: `--` })).toEqual({ ok: true }),
		() => {}
	)).toThrow()
)

test(`throw when trying to make multiple moves per turn`, () =>
	expect(() => simulateGame(
		(_context, _args, xform) => {
			expect(xform({ op: `d0` })).toEqual({ ok: true })
			xform({ op: `d0` })
		},
		() => {}
	)).toThrow()
)

test(`xform() returns failure when trying to make multiple moves per turn and configured not to throw`, () =>
	expect(simulateGame(
		(_context, _args, xform) => {
			expect(xform({ op: `d0` })).toEqual({ ok: true })
			expect(xform({ op: `d0` })).toEqual({ ok: false })
		},
		() => {}, { noThrow: true }
	)).toBe(Role.Attacker)
)

test(`xform() returns failure when trying to make a move too late and configured not to throw`, () =>
	expect(simulateGame(
		(_context, _args, xform) => expect(xform({ op: `d0` })).toEqual({ ok: false }),
		() => {},
		{ noThrow: true, timeLimit: -1 }
	)).toBe(Role.Defender)
)

test(`throw when trying to make a move too late`, () =>
	expect(() => simulateGame(
		(_context, _args, xform) => xform({ op: `d0` }),
		() => {},
		{ timeLimit: -1 }
	)).toThrow()
)

test(`pass when op is invalid and configured not to throw`, () =>
	expect(simulateGame(
		(_context, _args, xform) => expect(xform({ op: `X` })).toEqual({ ok: false }),
		() => {},
		{ noThrow: true }
	)).toBe(Role.Defender)
)

test(`throw when op is invalid`, () =>
	expect(() => simulateGame(
		(_context, _args, xform) => xform({ op: `X` }),
		() => {}
	)).toThrow()
)

test(`normal defender win`, () =>
	expect(simulateGame(
		(_context, _args, xform) => expect(xform({ op: `--` })).toEqual({ ok: true }),
		(_context, _args, xform) => expect(xform({ op: `--` })).toEqual({ ok: true })
	)).toBe(Role.Defender)
)

test(`xform() returns failure when move is invalid and configured not to throw`, () =>
	expect(simulateGame(
		(_context, _args, xform) => expect(xform({ op: `p80` })).toEqual({ ok: false }),
		() => {},
		{ noThrow: true }
	)).toBe(Role.Defender)
)

test(`throw when move is invalid`, () =>
	expect(() => simulateGame(
		(_context, _args, xform) => xform({ op: `p80` }),
		() => {}
	)).toThrow()
)
