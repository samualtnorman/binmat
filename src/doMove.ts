import type { CombatData } from "./doCombat"
import { doMoveCombat } from "./doMoveCombat"
import { doMoveDiscard } from "./doMoveDiscard"
import { doMoveDraw } from "./doMoveDraw"
import { doMovePass } from "./doMovePass"
import { doMovePlay } from "./doMovePlay"
import { doMovePlayFaceUp } from "./doMovePlayFaceUp"
import {
	cardFaceToString,
	cardToString,
	getLaneStack,
	laneIsOfFirstThree,
	laneToString,
	type card as Card,
	type lane as Lane,
	type move as Move,
	type state as State,
	type status as Status
} from "./shared"

export function doMove(state: State, move: Move): {
	status: `Okay` | `AttackerWin` | `DefenderWin`
	binlog: string[]
} | { status: Exclude<Status, `Okay` | `AttackerWin` | `DefenderWin`> } {
	const turn = String(state.turn).padStart(3, `0`)
	const roleTurn = state.turn % 2 ? `a` : `d`

	switch (move.TAG) {
		case `Draw`: {
			const deckIsEmpty = !(move.deck == `Attacker` ? state.attackerDeck : getLaneStack(state.laneDecks, move.deck)).length
			const result = doMoveDraw(state, move.deck)
			const deck = move.deck == `Attacker` ? `a` : laneToString(move.deck)

			if (result.status == `AttackerWin`) {
				return {
					status: `AttackerWin`,
					binlog: [
						`\`V${turn}\` \`n------\``,
						`${roleTurn}0 d${deck}`
					]
				}
			}

			if (result.status == `Okay` || result.status == `DefenderWin`) {
				const card = laneIsOfFirstThree(move.deck) || move.deck == `Attacker` || deckIsEmpty
					? `X`
					: cardToString(result.cardDrawn)

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

		case `Play`: {
			const result = doMovePlay(state, move.card, move.lane)

			if (result.status == `Okay` || result.status == `DefenderWin`) {
				return {
					status: result.status,
					binlog: [
						`\`V${turn}\` \`n------\``,
						`${roleTurn}0 pX${laneToString(move.lane)} / X ${roleTurn}${laneToString(move.lane)}`
					]
				}
			}

			return { status: result.status }
		}

		case `PlayFaceUp`: {
			const result = doMovePlayFaceUp(state, move.card, move.lane)

			if (result.status == `Okay` || result.status == `AttackerWin` || result.status == `DefenderWin`) {
				const binlog = [
					`\`V${turn}\` \`n------\``,
					`${roleTurn}0 u${cardFaceToString(result.cardPlayed.face)}${move.lane} / ${cardToString(result.cardPlayed)} ${roleTurn}${laneToString(move.lane)}`
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

		case `Combat`: {
			const result = doMoveCombat(state, move.lane)

			if (result.status == `Okay` || result.status == `DefenderWin` || result.status == `AttackerWin`) {
				const binlog = [
					`\`V${turn}\` \`n------\``,
					`${roleTurn}0 c${laneToString(move.lane)}`
				]

				pushCombatBinlog(binlog, result, move.lane)

				return {
					status: result.status,
					binlog
				}
			}

			return { status: result.status }
		}

		case `Discard`: {
			const result = doMoveDiscard(state, move.card, move.discardPile)

			if (result.status == `Okay` || result.status == `DefenderWin`) {
				const discardPile = move.discardPile == `Attacker` ? `a` : move.discardPile

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

		case `Pass`: {
			const status = doMovePass(state)

			if (status == `MadeMoveOnFinishedGame`)
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

	function pushCombatBinlog(binlog: string[], combatData: CombatData, lane: Lane, cardIsPlayedFaceUp?: Card) {
		const {
			attackerAttackPower, attackerStack, defenderAttackPower, defenderStack, attackerCardsTrapped,
			defenderCardsTrapped, attackerBouncesDiscarded, defenderBouncesDiscarded, damageValue,
			defenderStackWasFaceUp
		} = combatData

		const attackerSide = roleTurn == `a` && cardIsPlayedFaceUp && attackerStack.length
			? `${attackerStack.join(` `)}u`
			: attackerStack.join(` `)

		const defenderSide = defenderStackWasFaceUp
			? defenderStack.map(card => `${cardToString(card)}u`).join(` `)
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
			roleTurn == `a` && cardIsPlayedFaceUp && combatData.attackerStackDiscarded.at(-1) == cardIsPlayedFaceUp
				? `${combatData.attackerStackDiscarded.join(` `)}u`
				: combatData.attackerStackDiscarded.join(` `)

		if (damageValue) {
			const cardsDrawnToDiscard = combatData.cardsDrawnToDiscard.length
				? ` / ${combatData.cardsDrawnToDiscard.join(` `)} xa`
				: ``

			let cardsDrawn

			if (combatData.cardsDrawn.length) {
				cardsDrawn = laneIsOfFirstThree(lane)
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
