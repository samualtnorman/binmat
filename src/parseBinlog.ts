import { assert } from "@samual/lib/assert"
import { readdir as readDirectory, readFile } from "fs/promises"
import * as Path from "path"
import type { AttackerDeck, AttackerDiscardPile, CardString, Lane } from "./common"
import { MoveTag, Role } from "./common"
import { isCard } from "./isCard"
import { parseMove } from "./parseBinlogMove"

export type BinlogEntry = {
	role: Role
	order: number
	tag: MoveTag.Pass
	turn: number
} | {
	role: Role
	order: number
	cardDrawn: undefined
	tag: MoveTag.Draw
	deck: 0 | 1 | 2 | AttackerDeck
	turn: number
} | {
	role: Role
	order: number
	cardDrawn: CardString | undefined
	tag: MoveTag.Draw
	deck: 3 | 4 | 5
	turn: number
} | {
	role: Role
	order: number
	card: CardString
	tag: MoveTag.Discard
	discardPile: Lane | AttackerDiscardPile
	turn: number
} | {
	role: Role
	order: number
	attackerStack: CardString[]
	defenderStack: CardString[]
	attackerAttackPower: number
	defenderAttackPower: number
	cardsDrawn: number
	tag: MoveTag.Combat
	lane: 0 | 1 | 2
	turn: number
} | {
	role: Role
	order: number
	attackerStack: CardString[]
	defenderStack: CardString[]
	attackerAttackPower: number
	defenderAttackPower: number
	cardsDrawn: CardString[]
	tag: MoveTag.Combat
	lane: 3 | 4 | 5
	turn: number
} | {
	role: Role
	order: number
	tag: MoveTag.Play
	lane: Lane
	turn: number
} | {
	role: Role
	order: number
	card: CardString
	attackerStack: CardString[]
	defenderStack: CardString[]
	attackerAttackPower: number
	defenderAttackPower: number
	cardsDrawn: number
	tag: MoveTag.PlayFaceUp
	lane: 0 | 1 | 2
	turn: number
} | {
	role: Role
	order: number
	card: CardString
	attackerStack: CardString[]
	defenderStack: CardString[]
	attackerAttackPower: number
	defenderAttackPower: number
	cardsDrawn: CardString[]
	tag: MoveTag.PlayFaceUp
	lane: 3 | 4 | 5
	turn: number
} | {
	role: Role
	order: number
	card: CardString
	tag: MoveTag.PlayFaceUp
	lane: Lane
	turn: number
}

export function* parseBinlog(binlog: string[]): Generator<BinlogEntry, void, undefined> {
	while (binlog.length) {
		assert(binlog[0], HERE)
		assert(/^`V\d{3}` `n-{6}`$/.test(binlog[0]), () => `${HERE} ${JSON.stringify(binlog[0])}`)

		const turn = Number(binlog[0].slice(2, 5))

		binlog.shift()

		if (!binlog[0])
			break

		if (binlog[0][1] == `V`)
			continue

		assert(
			/^[da][\da-f] (?:`n--`|d[0-5a] \/ (?:X|[2-9a@*?>][&%+!^#]) h[da][\da-f] |c[0-5]|pX[0-5] \/ X [da][0-5]|u[2-9a@*?>][&%+!^#]?[0-5] \/ [2-9a@*?>][&%+!^#] [da][0-5]|x[2-9a@*?>][&%+!^#]?(?:[0-5] \/ [2-9a@*?>][&%+!^#] x[0-5]|a \/ [2-9a@*?>][&%+!^#] xa(?: \/ X X ha[\da-f] )?))$/
				.test(binlog[0]),
			() => `${HERE} ${JSON.stringify(binlog[0])}`
		)

		const role = binlog[0][0] == `d` ? Role.Defender : Role.Attacker
		const order = parseInt(binlog[0][1]!, 16)
		let moveEndIndex = binlog[0].indexOf(` `, 5)

		if (moveEndIndex == -1)
			moveEndIndex = binlog[0].length

		const move = parseMove(binlog[0].slice(3, moveEndIndex))

		switch (move.tag) {
			case MoveTag.Pass: {
				yield { turn, ...move, order, role }
				binlog.shift()

				break
			}

			case MoveTag.Draw: {
				if (binlog[0][8] == `X`)
					yield { turn, ...move, cardDrawn: undefined, deck: move.deck, order, role }
				else {
					const cardDrawn = binlog[0].slice(8, 10)

					assert(isCard(cardDrawn), HERE)
					assert(move.deck == 3 || move.deck == 4 || move.deck == 5, HERE)
					yield { turn, ...move, cardDrawn, deck: move.deck, order, role }
				}

				binlog.shift()

				break
			}

			case MoveTag.Discard: {
				let card

				if (move.card.length == 2)
					card = move.card as CardString
				else {
					card = binlog[0].slice(9, 11)
					assert(isCard(card), HERE)
				}

				yield { turn, ...move, card, order, role }
				binlog.shift()

				break
			}

			case MoveTag.Combat: {
				binlog.shift()
				assert(binlog[0], HERE)

				assert(
					/^`n--` c[0-5] \/ (?: |(?:[2-9a@*?>][&%+!^#]u? )+)\/(?: $| [2-9a@*?>][&%+!^#]u?$|(?: [2-9a@*?>][&%+!^#]u?)+$)/
						.test(binlog[0]),
					() => `${HERE} ${JSON.stringify(binlog[0])}`
				)

				const [ attackerStack, defenderStack ] = binlog[0].slice(11).split(` / `) as [ string, string ]

				binlog.shift()

				for (let times = 2; times--;) {
					if (binlog[0][7] == `@`) {
						assert(
							/^`n--` [ad]@ \/ (?:[2-9a@*?>][&%+!^#] )+x[a0-5]$/.test(binlog[0]),
							() => `${HERE} ${JSON.stringify(binlog[0])}`
						)

						binlog.shift()
						assert(binlog[0], HERE)
					}
				}

				for (let times = 2; times--;) {
					if (binlog[0][7] == `?`) {
						assert(
							/^`n--` [ad]\? \/ (?:\?[&%+!^#] )+x[a0-5]$/.test(binlog[0]),
							() => `${HERE} ${JSON.stringify(binlog[0])}`
						)

						binlog.shift()
						assert(binlog[0], HERE)
					}
				}

				assert(
					/^`n--` \d+ \d+ (?:\d+|-) \/ (?:(?:[2-9a@*?>][&%+!^#]u? )+| )x[0-5a](?: \/ (?:[2-9a@*?>][&%+!^#] )+xa)?(?: \/ (?:X )*(?:[2-9a@*?>][&%+!^#] )*)?(?:ha[\da-f] )?$/
						.test(binlog[0]),
					() => `${HERE} ${JSON.stringify(binlog[0])}`
				)

				let [ attackerAttackPower, defenderAttackPower, cardsDrawn ] = binlog[0]
					.slice(6, binlog[0].indexOf(`/`, 12) - 1).split(` `).map(Number) as [ number, number, number ]

				// might be "-" which becomes NaN (luckily NaN is falsey)
				cardsDrawn ||= 0

				yield move.lane == 3 || move.lane == 4 || move.lane == 5 ? {
					turn,
					...move,
					attackerAttackPower,
					attackerStack: attackerStack.split(` `).map(card => card.slice(0, 2)) as CardString[],
					cardsDrawn: binlog[0].slice(binlog[0].lastIndexOf(`/`) + 2, -5).split(` `) as CardString[],
					defenderAttackPower,
					defenderStack: defenderStack ? defenderStack.split(` `).map(card => card.slice(0, 2)) as CardString[] : [],
					lane: move.lane,
					order,
					role
				} : {
					turn,
					...move,
					attackerAttackPower,
					attackerStack: attackerStack.split(` `).map(card => card.slice(0, 2)) as CardString[],
					cardsDrawn,
					defenderAttackPower,
					defenderStack: defenderStack ? defenderStack.split(` `).map(card => card.slice(0, 2)) as CardString[] : [],
					lane: move.lane,
					order,
					role
				}

				binlog.shift()

				break
			}

			case MoveTag.Play: {
				binlog.shift()
				yield { turn, ...move, order, role }

				break
			}

			case MoveTag.PlayFaceUp: {
				const card = (move.card.length == 2 ? move.card : binlog[0].slice(9, 11)) as CardString

				binlog.shift()

				if (binlog[0] && binlog[0][1] == `n`) {
					assert(
						/^`n--` c[0-5] \/ (?:[2-9a@*?>][&%+!^#]u? )+\/(?: $|(?: [2-9a@*?>][&%+!^#]u?)+$)/.test(binlog[0]),
						HERE
					)

					const [ attackerStack, defenderStack ] = binlog[0].slice(11).split(` / `) as [ string, string ]

					binlog.shift()
					assert(binlog[0], HERE)

					for (let times = 2; times--;) {
						if (binlog[0][7] == `@`) {
							assert(
								/^`n--` [ad]@ \/ (?:[2-9a@*?>][&%+!^#] )+x[a0-5]$/.test(binlog[0]),
								() => `${HERE} ${JSON.stringify(binlog[0])}`
							)

							binlog.shift()
							assert(binlog[0], HERE)
						}
					}

					for (let times = 2; times--;) {
						if (binlog[0][7] == `?`) {
							assert(
								/^`n--` [ad]\? \/ (?:\?[&%+!^#] )+x[a0-5]$/.test(binlog[0]),
								() => `${HERE} ${JSON.stringify(binlog[0])}`
							)

							binlog.shift()
							assert(binlog[0], HERE)
						}
					}

					assert(
						/^`n--` \d+ \d+ (?:\d+|-) \/ (?: |(?:[2-9a@*?>][&%+!^#]u? )+)x[0-5a](?: \/ (?:[2-9a@*?>][&%+!^#] )+xa)?(?: \/ (?:(?:[2-9a@*?>][&%+!^#] )+|(?:X )+)ha[\da-f] )?$/.test(binlog[0]),
						() => `${HERE} ${JSON.stringify(binlog[0])}`
					)

					let [ attackerAttackPower, defenderAttackPower, cardsDrawn ] = binlog[0]
						.slice(6, binlog[0].indexOf(`/`, 12) - 1).split(` `).map(Number) as [ number, number, number ]

					cardsDrawn ||= 0

					yield move.lane == 3 || move.lane == 4 || move.lane == 5 ? {
						turn,
						...move,
						attackerAttackPower,
						attackerStack: attackerStack.split(` `).map(card => card.slice(0, 2)) as CardString[],
						card,
						cardsDrawn: binlog[0].slice(binlog[0].lastIndexOf(`/`) + 2, -5).split(` `) as CardString[],
						defenderAttackPower,
						defenderStack: defenderStack ? defenderStack.split(` `).map(card => card.slice(0, 2)) as CardString[] : [],
						lane: move.lane,
						order,
						role
					} : {
						turn,
						...move,
						attackerAttackPower,
						attackerStack: attackerStack.split(` `).map(card => card.slice(0, 2)) as CardString[],
						card,
						cardsDrawn,
						defenderAttackPower,
						defenderStack: defenderStack ? defenderStack.split(` `).map(card => card.slice(0, 2)) as CardString[] : [],
						lane: move.lane,
						order,
						role
					}

					binlog.shift()
				} else
					yield { turn, ...move, card, order, role }
			}
		}
	}
}

if (import.meta.vitest) {
	const { describe, test } = import.meta.vitest

	const binlogs = await Promise.all((await readDirectory(`test/binmat-games`)).map(async fileName => ({
		name: fileName,
		gameData: JSON.parse(await readFile(Path.resolve(`test/binmat-games`, fileName), { encoding: `utf8` })) as any[]
	})))

	for (const { name, gameData } of binlogs) {
		describe(name, () => {
			for (const { s: { turns }, ops } of gameData)
				test(`turn ${turns}`, () => [ ...parseBinlog(ops) ])
		})
	}
}
