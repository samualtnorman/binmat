import type { CardString, State } from "./common"

export type Attacker = `a${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | `a` | `b` | `c` | `d` | `e` | `f`}`
export type Defender = `d${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | `a` | `b` | `c` | `d` | `e` | `f`}`

export type BinmatArgs = {
	/** player role */
	plr: Defender

	/** state */
	s: {
		/** turn number */
		turns: number

		/** lane deck 0 */
		l0?: { c: number, t: `X` }

		/** lane deck 1 */
		l1?: { c: number, t: `X` }

		/** lane deck 2 */
		l2?: { c: number, t: `X` }

		/** lane deck 3 */
		l3?: { c: number, t: CardString }

		/** lane deck 4 */
		l4?: { c: number, t: CardString }

		/** lane deck 5 */
		l5?: { c: number, t: CardString }

		/** lane discard pile 0 */
		x0?: `${CardString}u`[]

		/** lane discard pile 1 */
		x1?: `${CardString}u`[]

		/** lane discard pile 2 */
		x2?: `${CardString}u`[]

		/** lane discard pile 3 */
		x3?: `${CardString}u`[]

		/** lane discard pile 4 */
		x4?: `${CardString}u`[]

		/** lane discard pile 5 */
		x5?: `${CardString}u`[]

		/** attacker discard pile */
		xa?: CardString[]

		/** attacker deck */
		a?: { c: number, t: `X` }

		/** turn order */
		ord: number

		/** attacker stack 0 */
		a0?: `X`[]

		/** attacker stack 1 */
		a1?: `X`[]

		/** attacker stack 2 */
		a2?: `X`[]

		/** attacker stack 3 */
		a3?: `X`[]

		/** attacker stack 4 */
		a4?: `X`[]

		/** attacker stack 5 */
		a5?: `X`[]

		/** defender stack 0 */
		d0?: (CardString | `${CardString}u`)[]

		/** defender stack 1 */
		d1?: (CardString | `${CardString}u`)[]

		/** defender stack 2 */
		d2?: (CardString | `${CardString}u`)[]

		/** defender stack 3 */
		d3?: (CardString | `${CardString}u`)[]

		/** defender stack 4 */
		d4?: (CardString | `${CardString}u`)[]

		/** defender stack 5 */
		d5?: (CardString | `${CardString}u`)[]

		/** attacker 0 hand */
		ha0?: number

		/** attacker 1 hand */
		ha1?: number

		/** attacker 2 hand */
		ha2?: number

		/** attacker 3 hand */
		ha3?: number

		/** attacker 4 hand */
		ha4?: number

		/** attacker 5 hand */
		ha5?: number

		/** attacker 6 hand */
		ha6?: number

		/** attacker 7 hand */
		ha7?: number

		/** attacker 8 hand */
		ha8?: number

		/** attacker 9 hand */
		ha9?: number

		/** attacker 10 hand */
		haa?: number

		/** attacker 11 hand */
		hab?: number

		/** attacker 12 hand */
		hac?: number

		/** attacker 13 hand */
		had?: number

		/** attacker 14 hand */
		hae?: number

		/** attacker 15 hand */
		haf?: number

		/** defender 0 hand */
		hd0?: CardString[]

		/** defender 1 hand */
		hd1?: CardString[]

		/** defender 2 hand */
		hd2?: CardString[]

		/** defender 3 hand */
		hd3?: CardString[]

		/** defender 4 hand */
		hd4?: CardString[]

		/** defender 5 hand */
		hd5?: CardString[]

		/** defender 6 hand */
		hd6?: CardString[]

		/** defender 7 hand */
		hd7?: CardString[]

		/** defender 8 hand */
		hd8?: CardString[]

		/** defender 9 hand */
		hd9?: CardString[]

		/** defender 10 hand */
		hda?: CardString[]

		/** defender 11 hand */
		hdb?: CardString[]

		/** defender 12 hand */
		hdc?: CardString[]

		/** defender 13 hand */
		hdd?: CardString[]

		/** defender 14 hand */
		hde?: CardString[]

		/** defender 15 hand */
		hdf?: CardString[]
	}

	/** player list */
	plrs: [ role: Defender | Attacker, userName: string ][]

	/** binlog */
	ops: string[]
} | {
	/** player role */
	plr: Attacker

	/** state */
	s: {
		/** turn number */
		turns: number

		/** lane deck 0 */
		l0?: { c: number, t: `X` }

		/** lane deck 1 */
		l1?: { c: number, t: `X` }

		/** lane deck 2 */
		l2?: { c: number, t: `X` }

		/** lane deck 3 */
		l3?: { c: number, t: CardString }

		/** lane deck 4 */
		l4?: { c: number, t: CardString }

		/** lane deck 5 */
		l5?: { c: number, t: CardString }

		/** lane discard pile 0 */
		x0?: `${CardString}u`[]

		/** lane discard pile 1 */
		x1?: `${CardString}u`[]

		/** lane discard pile 2 */
		x2?: `${CardString}u`[]

		/** lane discard pile 3 */
		x3?: `${CardString}u`[]

		/** lane discard pile 4 */
		x4?: `${CardString}u`[]

		/** lane discard pile 5 */
		x5?: `${CardString}u`[]

		/** attacker discard pile */
		xa?: CardString[]

		/** attacker deck */
		a?: { c: number, t: `X` }

		/** turn order */
		ord: number

		/** attacker stack 0 */
		a0?: CardString[]

		/** attacker stack 1 */
		a1?: CardString[]

		/** attacker stack 2 */
		a2?: CardString[]

		/** attacker stack 3 */
		a3?: CardString[]

		/** attacker stack 4 */
		a4?: CardString[]

		/** attacker stack 5 */
		a5?: CardString[]

		/** defender stack 0 */
		d0?: `${CardString}u`[] | `X`[]

		/** defender stack 1 */
		d1?: `${CardString}u`[] | `X`[]

		/** defender stack 2 */
		d2?: `${CardString}u`[] | `X`[]

		/** defender stack 3 */
		d3?: `${CardString}u`[] | `X`[]

		/** defender stack 4 */
		d4?: `${CardString}u`[] | `X`[]

		/** defender stack 5 */
		d5?: `${CardString}u`[] | `X`[]

		/** attacker 0 hand */
		ha0?: CardString[]

		/** attacker 1 hand */
		ha1?: CardString[]

		/** attacker 2 hand */
		ha2?: CardString[]

		/** attacker 3 hand */
		ha3?: CardString[]

		/** attacker 4 hand */
		ha4?: CardString[]

		/** attacker 5 hand */
		ha5?: CardString[]

		/** attacker 6 hand */
		ha6?: CardString[]

		/** attacker 7 hand */
		ha7?: CardString[]

		/** attacker 8 hand */
		ha8?: CardString[]

		/** attacker 9 hand */
		ha9?: CardString[]

		/** attacker 10 hand */
		haa?: CardString[]

		/** attacker 11 hand */
		hab?: CardString[]

		/** attacker 12 hand */
		hac?: CardString[]

		/** attacker 13 hand */
		had?: CardString[]

		/** attacker 14 hand */
		hae?: CardString[]

		/** attacker 15 hand */
		haf?: CardString[]

		/** defender 0 hand */
		hd0?: number

		/** defender 1 hand */
		hd1?: number

		/** defender 2 hand */
		hd2?: number

		/** defender 3 hand */
		hd3?: number

		/** defender 4 hand */
		hd4?: number

		/** defender 5 hand */
		hd5?: number

		/** defender 6 hand */
		hd6?: number

		/** defender 7 hand */
		hd7?: number

		/** defender 8 hand */
		hd8?: number

		/** defender 9 hand */
		hd9?: number

		/** defender 10 hand */
		hda?: number

		/** defender 11 hand */
		hdb?: number

		/** defender 12 hand */
		hdc?: number

		/** defender 13 hand */
		hdd?: number

		/** defender 14 hand */
		hde?: number

		/** defender 15 hand */
		hdf?: number
	}

	/** player list */
	plrs: [ role: Defender | Attacker, userName: string ][]

	/** binlog */
	ops: string[]
}

export function generateArgs(state: State, defender: string, attacker: string, binlog: string[]) {
	return state.turn % 2
		? generateArgsForAttacker(state, defender, attacker, binlog)
		: generateArgsForDefender(state, defender, attacker, binlog)
}

export function generateArgsForDefender(state: State, defender: string, attacker: string, binlog: string[]) {
	const args: BinmatArgs = {
		plr: `d0`,
		s: {
			turns: state.turn,
			ord: 0
		},
		plrs: [
			[ `d0`, defender ],
			[ `a0`, attacker ]
		],
		ops: binlog
	}

	if (state.laneDecks[0].length)
		args.s.l0 = { c: state.laneDecks[0].length, t: `X` }

	if (state.laneDecks[1].length)
		args.s.l1 = { c: state.laneDecks[1].length, t: `X` }

	if (state.laneDecks[2].length)
		args.s.l2 = { c: state.laneDecks[2].length, t: `X` }

	if (state.laneDecks[3].length)
		args.s.l3 = { c: state.laneDecks[3].length, t: state.laneDecks[3].at(-1)! }

	if (state.laneDecks[4].length)
		args.s.l4 = { c: state.laneDecks[4].length, t: state.laneDecks[4].at(-1)! }

	if (state.laneDecks[5].length)
		args.s.l5 = { c: state.laneDecks[5].length, t: state.laneDecks[5].at(-1)! }

	if (state.laneDiscardPiles[0].length)
		args.s.x0 = state.laneDiscardPiles[0].map(card => `${card}u` as const)

	if (state.laneDiscardPiles[1].length)
		args.s.x1 = state.laneDiscardPiles[1].map(card => `${card}u` as const)

	if (state.laneDiscardPiles[2].length)
		args.s.x2 = state.laneDiscardPiles[2].map(card => `${card}u` as const)

	if (state.laneDiscardPiles[3].length)
		args.s.x3 = state.laneDiscardPiles[3].map(card => `${card}u` as const)

	if (state.laneDiscardPiles[4].length)
		args.s.x4 = state.laneDiscardPiles[4].map(card => `${card}u` as const)

	if (state.laneDiscardPiles[5].length)
		args.s.x5 = state.laneDiscardPiles[5].map(card => `${card}u` as const)

	if (state.attackerDiscardPile.length)
		args.s.xa = [ ...state.attackerDiscardPile ]

	if (state.attackerDeck.length)
		args.s.a = { c: state.attackerDeck.length, t: `X` }

	if (state.attackerStacks[0].length)
		args.s.a0 = state.attackerStacks[0].map(() => `X`)

	if (state.attackerStacks[1].length)
		args.s.a1 = state.attackerStacks[1].map(() => `X`)

	if (state.attackerStacks[2].length)
		args.s.a2 = state.attackerStacks[2].map(() => `X`)

	if (state.attackerStacks[3].length)
		args.s.a3 = state.attackerStacks[3].map(() => `X`)

	if (state.attackerStacks[4].length)
		args.s.a4 = state.attackerStacks[4].map(() => `X`)

	if (state.attackerStacks[5].length)
		args.s.a5 = state.attackerStacks[5].map(() => `X`)

	if (state.defenderStacks[0].cards.length) {
		args.s.d0 = state.defenderStacks[0].isFaceUp
			? state.defenderStacks[0].cards.map(card => `${card}u` as const)
			: [ ...state.defenderStacks[0].cards ]
	}

	if (state.defenderStacks[1].cards.length) {
		args.s.d1 = state.defenderStacks[1].isFaceUp
			? state.defenderStacks[1].cards.map(card => `${card}u` as const)
			: [ ...state.defenderStacks[1].cards ]
	}

	if (state.defenderStacks[2].cards.length) {
		args.s.d2 = state.defenderStacks[2].isFaceUp
			? state.defenderStacks[2].cards.map(card => `${card}u` as const)
			: [ ...state.defenderStacks[2].cards ]
	}

	if (state.defenderStacks[3].cards.length) {
		args.s.d3 = state.defenderStacks[3].isFaceUp
			? state.defenderStacks[3].cards.map(card => `${card}u` as const)
			: [ ...state.defenderStacks[3].cards ]
	}

	if (state.defenderStacks[4].cards.length) {
		args.s.d4 = state.defenderStacks[4].isFaceUp
			? state.defenderStacks[4].cards.map(card => `${card}u` as const)
			: [ ...state.defenderStacks[4].cards ]
	}

	if (state.defenderStacks[5].cards.length) {
		args.s.d5 = state.defenderStacks[5].isFaceUp
			? state.defenderStacks[5].cards.map(card => `${card}u` as const)
			: [ ...state.defenderStacks[5].cards ]
	}

	if (state.attackerHand.length)
		args.s.ha0 = state.attackerHand.length

	if (state.defenderHand.length)
		args.s.hd0 = [ ...state.defenderHand ]

	return args
}

export function generateArgsForAttacker(state: State, defender: string, attacker: string, binlog: string[]) {
	const args: BinmatArgs = {
		plr: `a0`,
		s: {
			turns: state.turn,
			ord: 0
		},
		plrs: [
			[ `d0`, defender ],
			[ `a0`, attacker ]
		],
		ops: binlog
	}

	if (state.laneDecks[0].length)
		args.s.l0 = { c: state.laneDecks[0].length, t: `X` }

	if (state.laneDecks[1].length)
		args.s.l1 = { c: state.laneDecks[1].length, t: `X` }

	if (state.laneDecks[2].length)
		args.s.l2 = { c: state.laneDecks[2].length, t: `X` }

	if (state.laneDecks[3].length)
		args.s.l3 = { c: state.laneDecks[3].length, t: state.laneDecks[3].at(-1)! }

	if (state.laneDecks[4].length)
		args.s.l4 = { c: state.laneDecks[4].length, t: state.laneDecks[4].at(-1)! }

	if (state.laneDecks[5].length)
		args.s.l5 = { c: state.laneDecks[5].length, t: state.laneDecks[5].at(-1)! }

	if (state.laneDiscardPiles[0].length)
		args.s.x0 = state.laneDiscardPiles[0].map(card => `${card}u` as const)

	if (state.laneDiscardPiles[1].length)
		args.s.x1 = state.laneDiscardPiles[1].map(card => `${card}u` as const)

	if (state.laneDiscardPiles[2].length)
		args.s.x2 = state.laneDiscardPiles[2].map(card => `${card}u` as const)

	if (state.laneDiscardPiles[3].length)
		args.s.x3 = state.laneDiscardPiles[3].map(card => `${card}u` as const)

	if (state.laneDiscardPiles[4].length)
		args.s.x4 = state.laneDiscardPiles[4].map(card => `${card}u` as const)

	if (state.laneDiscardPiles[5].length)
		args.s.x5 = state.laneDiscardPiles[5].map(card => `${card}u` as const)

	if (state.attackerDiscardPile.length)
		args.s.xa = [ ...state.attackerDiscardPile ]

	if (state.attackerDeck.length)
		args.s.a = { c: state.attackerDeck.length, t: `X` }

	if (state.attackerStacks[0].length)
		args.s.a0 = [ ...state.attackerStacks[0] ]

	if (state.attackerStacks[1].length)
		args.s.a1 = [ ...state.attackerStacks[1] ]

	if (state.attackerStacks[2].length)
		args.s.a2 = [ ...state.attackerStacks[2] ]

	if (state.attackerStacks[3].length)
		args.s.a3 = [ ...state.attackerStacks[3] ]

	if (state.attackerStacks[4].length)
		args.s.a4 = [ ...state.attackerStacks[4] ]

	if (state.attackerStacks[5].length)
		args.s.a5 = [ ...state.attackerStacks[5] ]

	if (state.defenderStacks[0].cards.length) {
		args.s.d0 = state.defenderStacks[0].isFaceUp
			? state.defenderStacks[0].cards.map(card => `${card}u` as const)
			: state.defenderStacks[0].cards.map(() => `X`)
	}

	if (state.defenderStacks[1].cards.length) {
		args.s.d1 = state.defenderStacks[1].isFaceUp
			? state.defenderStacks[1].cards.map(card => `${card}u` as const)
			: state.defenderStacks[1].cards.map(() => `X`)
	}

	if (state.defenderStacks[2].cards.length) {
		args.s.d2 = state.defenderStacks[2].isFaceUp
			? state.defenderStacks[2].cards.map(card => `${card}u` as const)
			: state.defenderStacks[2].cards.map(() => `X`)
	}

	if (state.defenderStacks[3].cards.length) {
		args.s.d3 = state.defenderStacks[3].isFaceUp
			? state.defenderStacks[3].cards.map(card => `${card}u` as const)
			: state.defenderStacks[3].cards.map(() => `X`)
	}

	if (state.defenderStacks[4].cards.length) {
		args.s.d4 = state.defenderStacks[4].isFaceUp
			? state.defenderStacks[4].cards.map(card => `${card}u` as const)
			: state.defenderStacks[4].cards.map(() => `X`)
	}

	if (state.defenderStacks[5].cards.length) {
		args.s.d5 = state.defenderStacks[5].isFaceUp
			? state.defenderStacks[5].cards.map(card => `${card}u` as const)
			: state.defenderStacks[5].cards.map(() => `X`)
	}

	if (state.attackerHand.length)
		args.s.ha0 = [ ...state.attackerHand ]

	if (state.defenderHand.length)
		args.s.hd0 = state.defenderHand.length

	return args
}
