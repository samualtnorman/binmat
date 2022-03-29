import { Card, CardValue, State } from "./createState"
import { CombatData } from "./doCombat"
import doMoveCombat from "./doMoveCombat"
import doMoveDiscard from "./doMoveDiscard"
import doMoveDraw from "./doMoveDraw"
import doMovePass from "./doMovePass"
import doMovePlay from "./doMovePlay"
import doMovePlayFaceUp from "./doMovePlayFaceUp"
import { Action, AttackerDeck, AttackerDiscardPile, Lane, StatusCode } from "./shared"

export type Move = {
	action: Action.Draw
	deck: Lane | AttackerDeck
} | {
	action: Action.Play | Action.PlayFaceUp
	card: Card | CardValue
	lane: Lane
} | {
	action: Action.Combat
	lane: Lane
} | {
	action: Action.Discard
	card: Card | CardValue
	discardPile: Lane | AttackerDiscardPile
} | { action: Action.Pass }

export function doMove(state: State, move: Move): {
	status: Exclude<StatusCode, StatusCode.Ok | StatusCode.AttackerWin | StatusCode.DefenderWin>
} | {
	status: StatusCode.Ok | StatusCode.AttackerWin | StatusCode.DefenderWin
	binlog: string[]
} {
	const turn = String(state.turn).padStart(3, `0`)
	const roleTurn = state.turn % 2 ? `a` : `d`

	switch (move.action) {
		case Action.Draw: {
			const result = doMoveDraw(state, move.deck)
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

			if (result.status == StatusCode.Ok || result.status == StatusCode.DefenderWin) {
				const card = move.deck < 3 || move.deck == AttackerDeck ? `X` : result.cardDrawn

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

		case Action.Play: {
			const result = doMovePlay(state, move.card, move.lane)

			if (result.status == StatusCode.Ok || result.status == StatusCode.DefenderWin) {
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

		case Action.PlayFaceUp: {
			const result = doMovePlayFaceUp(state, move.card, move.lane)

			if (result.status == StatusCode.Ok || result.status == StatusCode.AttackerWin || result.status == StatusCode.DefenderWin) {
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

		case Action.Combat: {
			const result = doMoveCombat(state, move.lane)

			if (result.status == StatusCode.Ok || result.status == StatusCode.DefenderWin || result.status == StatusCode.AttackerWin) {
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

		case Action.Discard: {
			const result = doMoveDiscard(state, move.card, move.discardPile)

			if (result.status == StatusCode.Ok || result.status == StatusCode.DefenderWin) {
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

		case Action.Pass: {
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

		const attackerStackDiscarded = roleTurn == `a` && cardIsPlayedFaceUp && combatData.attackerStackDiscarded[combatData.attackerStackDiscarded.length - 1] == cardIsPlayedFaceUp
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
			binlog.push(`\`n--\` 0 0 0 / ${attackerStackDiscarded} x${lane}`)
		else
			binlog.push(`\`n--\` ${attackerAttackPower} ${defenderAttackPower} - / ${attackerStackDiscarded} x${lane}`)
	}
}

export default doMove
