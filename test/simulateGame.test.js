import { Role } from "../src/createState"
import simulateGame from "../src/simulateGame"

it(`works`, () => {
	expect(() => simulateGame(() => {}, () => {})).toThrow()
	expect(simulateGame(() => {}, () => {}, { noThrow: true })).toBe(Role.Defender)

	expect(() => simulateGame(
		(_context, _args, xform) => expect(xform({ op: `--` })).toEqual({ ok: true }),
		() => {}
	)).toThrow()

	expect(() => simulateGame(
		(_context, _args, xform) => {
			expect(xform({ op: `d0` })).toEqual({ ok: true })
			xform({ op: `d0` })
		},
		() => {}
	)).toThrow()

	expect(simulateGame(
		(_context, _args, xform) => {
			expect(xform({ op: `d0` })).toEqual({ ok: true })
			expect(xform({ op: `d0` })).toEqual({ ok: false })
		},
		() => {}, { noThrow: true }
	)).toBe(Role.Attacker)

	expect(simulateGame(
		(_context, _args, xform) => expect(xform({ op: `d0` })).toEqual({ ok: false }),
		() => {},
		{ noThrow: true, timeLimit: -1 }
	)).toBe(Role.Defender)

	expect(() => simulateGame(
		(_context, _args, xform) => xform({ op: `d0` }),
		() => {},
		{ timeLimit: -1 }
	)).toThrow()

	expect(simulateGame(
		(_context, _args, xform) => expect(xform({ op: `X` })).toEqual({ ok: false }),
		() => {},
		{ noThrow: true }
	)).toBe(Role.Defender)

	expect(() => simulateGame(
		(_context, _args, xform) => xform({ op: `X` }),
		() => {}
	)).toThrow()

	expect(simulateGame(
		(_context, _args, xform) => expect(xform({ op: `--` })).toEqual({ ok: true }),
		(_context, _args, xform) => expect(xform({ op: `--` })).toEqual({ ok: true })
	)).toBe(Role.Defender)

	expect(simulateGame(
		(_context, _args, xform) => expect(xform({ op: `p80` })).toEqual({ ok: false }),
		() => {},
		{ noThrow: true }
	)).toBe(Role.Defender)

	expect(() => simulateGame(
		(_context, _args, xform) => xform({ op: `p80` }),
		() => {}
	)).toThrow()
})
