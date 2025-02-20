import type { LaxPartial } from "@samual/lib"
import { assert, ensure } from "@samual/lib/assert"
import { ARC4RNG, Random } from "random"
import type { CardString, Lane, Move, MoveString, ShuffleFunction, State } from "./common"
import { AttackerDeck, MoveTag, StatusCode } from "./common"
import type { CombatData } from "./doCombat"
import { doMoveCombat } from "./doMoveCombat"
import { doMoveDiscard } from "./doMoveDiscard"
import { doMoveDraw } from "./doMoveDraw"
import { doMovePass } from "./doMovePass"
import { doMovePlay } from "./doMovePlay"
import { doMovePlayFaceUp } from "./doMovePlayFaceUp"
import { Cards, makeState } from "./makeState"
import { parseMove } from "./parseMove"
import { StatusCodesToNames } from "./StatusCode"

export function doMove(state: State, move: Move, options?: LaxPartial<{ shuffleFunction: ShuffleFunction }>): {
	status: StatusCode.Okay | StatusCode.AttackerWin | StatusCode.DefenderWin
	binlog: string[]
} | { status: Exclude<StatusCode, StatusCode.Okay | StatusCode.AttackerWin | StatusCode.DefenderWin> } {
	const turn = String(state.turn).padStart(3, `0`)
	const roleTurn = state.turn % 2 ? `a` : `d`

	switch (move.tag) {
		case MoveTag.Draw: {
			const deckIsEmpty = !(move.deck == AttackerDeck ? state.attackerDeck : state.laneDecks[move.deck]).length
			const result = doMoveDraw(state, move.deck, options)
			const deck = move.deck == AttackerDeck ? `a` : move.deck

			if (result.status == StatusCode.AttackerWin) {
				return {
					status: StatusCode.AttackerWin,
					binlog: [
						`\`V${turn}\` \`n------\``,
						`${roleTurn}0 d${deck}`
					]
				}
			}

			if (result.status == StatusCode.Okay || result.status == StatusCode.DefenderWin) {
				const card = move.deck < 3 || move.deck == AttackerDeck || deckIsEmpty ? `X` : result.cardDrawn

				return {
					status: result.status,
					binlog: [
						`\`V${turn}\` \`n------\``,
						`${roleTurn}0 d${deck} / ${card} h${roleTurn}0 `
					]
				}
			}

			return { status: result.status }
		}

		case MoveTag.Play: {
			const result = doMovePlay(state, move.card, move.lane)

			if (result.status == StatusCode.Okay || result.status == StatusCode.DefenderWin) {
				return {
					status: result.status,
					binlog: [
						`\`V${turn}\` \`n------\``,
						`${roleTurn}0 pX${move.lane} / X ${roleTurn}${move.lane}`
					]
				}
			}

			return { status: result.status }
		}

		case MoveTag.PlayFaceUp: {
			const result = doMovePlayFaceUp(state, move.card, move.lane, options)

			if (result.status == StatusCode.Okay || result.status == StatusCode.AttackerWin || result.status == StatusCode.DefenderWin) {
				const binlog = [
					`\`V${turn}\` \`n------\``,
					`${roleTurn}0 u${result.cardPlayed[0]}${move.lane} / ${result.cardPlayed} ${roleTurn}${move.lane}`
				]

				if (result.combat)
					pushCombatBinlog(binlog, result.combat, move.lane, result.cardPlayed)

				return {
					status: result.status,
					binlog
				}
			}

			return { status: result.status }
		}

		case MoveTag.Combat: {
			const result = doMoveCombat(state, move.lane, options)

			if (result.status == StatusCode.Okay || result.status == StatusCode.DefenderWin || result.status == StatusCode.AttackerWin) {
				const binlog = [
					`\`V${turn}\` \`n------\``,
					`${roleTurn}0 c${move.lane}`
				]

				pushCombatBinlog(binlog, result, move.lane)

				return {
					status: result.status,
					binlog
				}
			}

			return { status: result.status }
		}

		case MoveTag.Discard: {
			const result = doMoveDiscard(state, move.card, move.discardPile, options)

			if (result.status == StatusCode.Okay || result.status == StatusCode.DefenderWin) {
				const discardPile = move.discardPile == AttackerDeck ? `a` : move.discardPile

				return {
					status: result.status,
					binlog: [
						`\`V${turn}\` \`n------\``,
						`${roleTurn}0 x${result.cardDiscarded[0]}${discardPile} / ${result.cardDiscarded} x${discardPile}`
					]
				}
			}

			return { status: result.status }
		}

		case MoveTag.Pass: {
			const status = doMovePass(state)

			if (status == StatusCode.MadeMoveOnFinishedGame)
				return { status }

			return {
				status,
				binlog: [
					`\`V${turn}\` \`n------\``,
					`${roleTurn}0 \`n--\``
				]
			}
		}
	}

	function pushCombatBinlog(binlog: string[], combatData: CombatData, lane: Lane, cardIsPlayedFaceUp?: CardString) {
		const {
			attackerAttackPower, attackerStack, defenderAttackPower, defenderStack, attackerCardsTrapped,
			defenderCardsTrapped, attackerBouncesDiscarded, defenderBouncesDiscarded, damageValue,
			defenderStackWasFaceUp
		} = combatData

		const attackerSide = roleTurn == `a` && cardIsPlayedFaceUp && attackerStack.length
			? `${attackerStack.join(` `)}u`
			: attackerStack.join(` `)

		const defenderSide = defenderStackWasFaceUp
			? defenderStack.map(card => `${card}u`).join(` `)
			: defenderStack.join(` `)

		binlog.push(`\`n--\` c${lane} / ${attackerSide} / ${defenderSide}`)

		if (roleTurn == `d`) {
			if (attackerCardsTrapped.length)
				binlog.push(`\`n--\` d@ / ${attackerCardsTrapped.join(` `)} x${lane}`)

			if (defenderCardsTrapped.length)
				binlog.push(`\`n--\` a@ / ${defenderCardsTrapped.join(` `)} xa`)
		} else /* attacker turn */ {
			if (defenderCardsTrapped.length)
				binlog.push(`\`n--\` a@ / ${defenderCardsTrapped.join(` `)} xa`)

			if (attackerCardsTrapped.length)
				binlog.push(`\`n--\` d@ / ${attackerCardsTrapped.join(` `)} x${lane}`)
		}

		if (attackerBouncesDiscarded.length)
			binlog.push(`\`n--\` a? / ${attackerBouncesDiscarded.join(` `)} x${lane}`)

		if (defenderBouncesDiscarded.length)
			binlog.push(`\`n--\` d? / ${defenderBouncesDiscarded.join(` `)} xa`)

		const attackerStackDiscarded =
			roleTurn == `a` && cardIsPlayedFaceUp && combatData.attackerStackDiscarded[combatData.attackerStackDiscarded.length - 1] == cardIsPlayedFaceUp
				? `${combatData.attackerStackDiscarded.join(` `)}u`
				: combatData.attackerStackDiscarded.join(` `)

		if (damageValue) {
			const cardsDrawnToDiscard = combatData.cardsDrawnToDiscard.length
				? ` / ${combatData.cardsDrawnToDiscard.join(` `)} xa`
				: ``

			let cardsDrawn

			if (combatData.cardsDrawn.length) {
				cardsDrawn = lane < 3
					? ` / ${`X `.repeat(combatData.cardsDrawn.length)}ha0 `
					: ` / ${combatData.cardsDrawn.join(` `)} ha0 `
			} else
				cardsDrawn = ``

			binlog.push(`\`n--\` ${attackerAttackPower} ${defenderAttackPower} ${damageValue} / ${attackerStackDiscarded} xa${cardsDrawnToDiscard}${cardsDrawn}`)
		} else if (!attackerAttackPower && !defenderAttackPower)
			binlog.push(`\`n--\` 0 0 0 / ${attackerStackDiscarded} xa`)
		else
			binlog.push(`\`n--\` ${attackerAttackPower} ${defenderAttackPower} - / ${attackerStackDiscarded} x${lane}`)
	}
}

if (import.meta.vitest) {
	const { test, expect,  } = import.meta.vitest

	const setup = (shuffles?: CardString[][]) => {
		const shuffle: (cards: CardString[]) => CardString[] = shuffles
			? () => ensure(shuffles.shift(), HERE)
			: (() => {
				const rng = new ARC4RNG(0)

				rng.S = Buffer.from(`LfquhbRQoTNR5vi0FN8i6XbgemiAFlKKwn-WQOI6YHvofmZFyHi4Yjq2g1lvPhsZkfEEQzzJxWfReesVkb1-p_xEsVyACz8vyLw4LY64m8DFJOoMqQEUm6jwvkyJwATjzuTq1CM-hovag_f0ykV8U1g9T1QdWajDPS08k1hjvz2Z-_qPjvw2ROMyk55uHLne2KXTLOvNzQklbAZA4_p1PEbCVHhAVkq_UCz2IFMAYoJozC_BcF0kBLCUA_Z1CQ_BoOtsS9R0BmjV-aucD9MXsgABX7mn2tWWfBf1rk5qfcncaD7boRcDFETdYJ4PHpaylZNhTvEYN4ITKc7T0LRJyQ`, `base64url`) as any
				rng.i = 0
				rng.j = 0

				const random = new Random(rng)

				return <T>(array: T[]): T[] => {
					let index = array.length

					while (index) {
						const randomIndex = random.int(0, index - 1)
						const randomItem = array[randomIndex]!

						index--
						array[randomIndex]=array[index]!
						array[index] = randomItem
					}

					return array
				}
			})()

		const state = makeState(shuffle([ ...Cards ]))

		return { state, moves }

		function moves(...moveStrings: MoveString[]) {
			const lastMoveString = ensure(moveStrings.pop(), HERE)

			for (const moveString of moveStrings) {
				const result = doMove(state, parseMove(moveString), { shuffleFunction: shuffle })

				assert(result.status == StatusCode.Okay, () =>
					`${HERE} status: ${StatusCodesToNames[result.status]}, turn: ${state.turn}, move: ${moveString}`
				)

				expect(result.binlog.join(`\n`)).toMatchSnapshot()
				expect(state).toMatchSnapshot()
			}

			const result = doMove(state, parseMove(lastMoveString), { shuffleFunction: shuffle })

			assert(result.status == StatusCode.Okay, () =>
				`${HERE} status: ${StatusCodesToNames[result.status]}, turn: ${state.turn}, move: ${lastMoveString}`
			)

			expect(result.binlog.join(`\n`)).toMatchSnapshot()
		}
	}

	test(`reset defenderPassedLastTurn on draw`, () => {
		const { state, moves } = setup()

		moves(`--`, `--`, `d0`)
		expect(state.defenderPassedLastTurn).toBe(false)
		expect(state).toMatchSnapshot()
	})

	test(`reset attackerPassedLastTurn on draw`, () => {
		const { state, moves } = setup()

		moves(`--`, `--`, `--`, `d0`)
		expect(state.attackerPassedLastTurn).toBe(false)
		expect(state).toMatchSnapshot()
	})

	test(`reset defenderPassedLastTurn on play`, () => {
		const { state, moves } = setup()

		moves(`d0`, `--`, `--`, `--`, `p30`)
		expect(state.defenderPassedLastTurn).toBe(false)
		expect(state).toMatchSnapshot()
	})

	test(`reset attackerPassedLastTurn on play`, () => {
		const { state, moves } = setup()

		moves(`--`, `d0`, `--`, `--`, `--`, `p30`)
		expect(state.attackerPassedLastTurn).toBe(false)
		expect(state).toMatchSnapshot()
	})

	test(`reset defenderPassedLastTurn on play face-up`, () => {
		const { state, moves } = setup()

		moves(`d3`, `d3`, `d3`, `--`, `p20`, `p70`, `--`, `--`, `u>0`)
		expect(state.defenderPassedLastTurn).toBe(false)
		expect(state).toMatchSnapshot()
	})

	test(`reset attackerPassedLastTurn on play face-up`, () => {
		const { state, moves } = setup()

		moves(`d3`, `d5`, `p20`, `d4`, `--`, `p20`, `--`, `--`, `--`, `u>0`)
		expect(state.attackerPassedLastTurn).toBe(false)
		expect(state).toMatchSnapshot()
	})

	test(`reset attackerPassedLastTurn on combat`, () => {
		const { state, moves } = setup()

		moves(`d3`, `d2`, `p20`, `p80`, `--`, `--`, `--`, `c0`)
		expect(state.attackerPassedLastTurn).toBe(false)
		expect(state).toMatchSnapshot()
	})

	test(`reset defenderPassedLastTurn on discard`, () => {
		const { state, moves } = setup()

		moves(`d3`, `--`, `--`, `--`, `x20`)
		expect(state.defenderPassedLastTurn).toBe(false)
		expect(state).toMatchSnapshot()
	})

	test(`reset attackerPassedLastTurn on discard`, () => {
		const { state, moves } = setup()

		moves(`--`, `d3`, `--`, `p23`, `--`, `c3`, `--`, `--`, `--`, `x>a`)
		expect(state.attackerPassedLastTurn).toBe(false)
		expect(state).toMatchSnapshot()
	})

	test(`combat draws lane deck cards correctly when discard shuffled into lane deck`, () => {
		const { state, moves } = setup([
			["a!","*#","*&","@^","2&","8&",">^","?+","a^","6%","2%","*%","9&","7&","4%","8#",">%","*!","4^","2#","5!","5^","4+","6#","2^","9+","9!","?^","@#","6+","6&","6^","?%","4!","*^","3#",">&","a#","7!","8%","9^","8!","6!","a&","?#","8+","2+","5+","@+",">#","2!","*+",">!","a%","@&","4#","5&","5#",">+","7+","9%","5%","8^","?!","3^","7#","9#","@%","7^","@!","3%","?&","7%","3+","3&","3!","4&","a+"],
			["7!","*+","2!","?#"],
			["3^",">&","4+"]
		])

		moves("--","d3","d4","p*+3","x3^3","d3","d1","d2","x9+1","p2!3","d2","p7!4","xa#5","d0","d2","d1","d3","c4","x>&3","d4","x>#5","d3","d4","p9&5","p8^4","u?!2","d3","d1","d1","p6#2","d5","p@+4","p5+2","c3","pa+1","x?#a","d3","--","x4+3","p2+2","d4","d0","pa&3","p?#2","x5%5","p2^2","d2","p8+3","x3#5","p2!5","d3","d0","p6!0","p*%3","--","p2%3","--","c5","d0","c2","x6%2","--","d0","--","xa^5","c4","d0","c3")
		expect(state.attackerHand).toMatchObject<CardString[]>([ `8%`, `9^`, `8!`, `4+` ])
		expect(state.laneDecks[3]).toMatchObject<CardString[]>([ `3^`, `>&` ])
		expect(state).toMatchSnapshot()
	})
}
