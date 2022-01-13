import { assert, isRecord } from "@samual/lib"
import createState, { Role, State } from "../src/createState"
import playMove, { Action, StatusCode } from "../src/playMove"
import parseMove from "../src/parseMove"

const StatusCodeMessages: Record<StatusCode, string> = {
	[StatusCode.Ok]: `ok`,
	[StatusCode.DefenderWin]: `defender won`,
	[StatusCode.AttackerWin]: `attacker won`,
	[StatusCode.MadeMoveOnFinishedGame]: `made move on finished game`,
	[StatusCode.DefenderDrewFromAttackerDeck]: `defender drew from attacker deck`,
	[StatusCode.AttackerDrewFromBlockedLane]: `attacker drew from blocked lane`,
	[StatusCode.PlayedUnownedCard]: `played unowned card`,
	[StatusCode.PlayedBreakToEmptyStack]: `played break to empty stack`,
	[StatusCode.DefenderInitiatedCombat]: `defender initiated combat`,
	[StatusCode.AttackerInitiatedCombatWithEmptyStack]: `attacker initiated combat with empty stack`,
	[StatusCode.DiscardedToOpponentDiscardPile]: `discarded to opponent discard pile`,
	[StatusCode.AttackerDiscardedToEmptyDiscardAndDeck]: `attacker discarded to empty discard and deck`
}

export default (context: Context, args: unknown) => {
	const currentGameID = $db.f({ _id: `binmat` }, { [`userToID/${context.caller}`]: true }).first()?.[`userToID/${context.caller}`] as string | undefined

	if (currentGameID) {
		const game = $db.f({ _id: `binmat` }, { [`IDToGame/${currentGameID}`]: true }).first()?.[`IDToGame/${currentGameID}`] as { defender: string, attacker: string, state: State }

		if (isRecord(args) && args.leave) {
			$db.us({ _id: `binmat` }, {
				$unset: {
					[`IDToGame/${currentGameID}`]: ``,
					[`userToID/${game.defender}`]: ``,
					[`userToID/${game.attacker}`]: ``
				}
			})

			return { ok: true }
		}

		const roleTurn: Role = (game.state.turn % 2) + 1

		if (context.caller == game.defender) {
			if (isRecord(args)) {
				if (typeof args.move == `string`) {
					if (roleTurn == Role.Attacker) {
						return {
							ok: false,
							msg: [
								`it is not yet your turn, you are the defender\nit is @${game.attacker}'s turn`,
								printStateForDefender(game.state)
							]
						}
					}

					const move = parseMove(args.move)
					const status = playMove(game.state, move)

					switch (status) {
						case StatusCode.Ok: {
							$db.us({ _id: `binmat` }, { $set: { [`IDToGame/${currentGameID}.state`]: game.state } })
							$fs.chats.tell({ to: game.attacker, msg: `@${context.caller} played ${move.action == Action.Play ? `pX${move.lane}` : args.move}` })

							return { ok: true, msg: printStateForDefender(game.state) }
						}

						case StatusCode.DefenderWin: {
							$db.us({ _id: `binmat` }, {
								$unset: {
									[`IDToGame/${currentGameID}`]: ``,
									[`userToID/${game.defender}`]: ``,
									[`userToID/${game.attacker}`]: ``
								}
							})

							return { ok: true, msg: [ `you won!\n`, printStateForDefender(game.state) ] }
						}

						case StatusCode.AttackerWin: {
							$db.us({ _id: `binmat` }, {
								$unset: {
									[`IDToGame/${currentGameID}`]: ``,
									[`userToID/${game.defender}`]: ``,
									[`userToID/${game.attacker}`]: ``
								}
							})

							return { ok: true, msg: [ `you lost :(\n`, printStateForDefender(game.state) ] }
						}

						default: {
							playMove(game.state, { action: Action.Pass })
							$db.us({ _id: `binmat` }, { $set: { [`IDToGame/${currentGameID}.state`]: game.state } })

							return { ok: false, msg: [ StatusCodeMessages[status], `passing\n`, printStateForDefender(game.state) ] }
						}
					}
				}

				if (args.inspect == `a`)
					return game.state.attackerDiscardPile.join(` `) || `empty`

				if (typeof args.inspect == `number`) {
					return `\
attacker stack ${args.inspect} has ${game.state.attackerStacks[args.inspect]?.length} cards

defender stack ${args.inspect}:
${game.state.defenderStacks[args.inspect]?.cards.join(` `) || `empty`}

lane deck ${args.inspect} has ${game.state.laneDecks[args.inspect]?.length} cards

lane discard ${args.inspect}:
${game.state.laneDiscardPiles[args.inspect]?.join(` `) || `empty`}`
				}
			}

			if (roleTurn == Role.Defender) {
				return [
					`you are the defender\nit is your turn`,
					printStateForDefender(game.state),
					`make a move with move: "d0"\ninspect a lane with inspect: 3\ninspect attacker discard pile with inspect: "a"`
				]
			}

			return [
				`you are the defender\nit is @${game.attacker}'s turn`,
				printStateForDefender(game.state),
				`make a move with move: "d0"\ninspect a lane with inspect: 3\ninspect attacker discard pile with inspect: "a"`
			]
		}

		/* caller is attacker */

		if (isRecord(args)) {
			if (typeof args.move == `string`) {
				if (roleTurn == Role.Defender) {
					return {
						ok: false,
						msg: [
							`it is not yet your turn, you are the attacker\nit is @${game.defender}'s turn`,
							printStateForAttacker(game.state)
						]
					}
				}

				const move = parseMove(args.move)
				const status = playMove(game.state, move)

				switch (status) {
					case StatusCode.Ok: {
						$db.us({ _id: `binmat` }, { $set: { [`IDToGame/${currentGameID}.state`]: game.state } })
						$fs.chats.tell({ to: game.defender, msg: `@${context.caller} played ${move.action == Action.Play ? `pX${move.lane}` : args.move}` })

						return { ok: true, msg: printStateForAttacker(game.state) }
					}

					case StatusCode.DefenderWin: {
						$db.us({ _id: `binmat` }, {
							$unset: {
								[`IDToGame/${currentGameID}`]: ``,
								[`userToID/${game.defender}`]: ``,
								[`userToID/${game.attacker}`]: ``
							}
						})

						return { ok: true, msg: [ `you lost :(\n`, printStateForAttacker(game.state) ] }
					}

					case StatusCode.AttackerWin: {
						$db.us({ _id: `binmat` }, {
							$unset: {
								[`IDToGame/${currentGameID}`]: ``,
								[`userToID/${game.defender}`]: ``,
								[`userToID/${game.attacker}`]: ``
							}
						})

						return { ok: true, msg: [ `you won!\n`, printStateForAttacker(game.state) ] }
					}

					default: {
						playMove(game.state, { action: Action.Pass })
						$db.us({ _id: `binmat` }, { $set: { [`IDToGame/${currentGameID}.state`]: game.state } })

						return { ok: false, msg: [ StatusCodeMessages[status], `passing\n`, printStateForAttacker(game.state) ] }
					}
				}
			}

			if (args.inspect == `a`)
				return game.state.attackerDiscardPile.join(` `) || `empty`

			if (typeof args.inspect == `number`) {
				return `\
attacker stack ${args.inspect}:
${game.state.attackerStacks[args.inspect]?.join(` `) || `empty`}

defender stack ${args.inspect}:
${game.state.defenderStacks[args.inspect]?.faceup ? game.state.defenderStacks[args.inspect]!.cards.join(` `) || `empty` : `defender stack ${args.inspect} has ${game.state.defenderStacks[args.inspect]?.cards.length} cards`}

lane deck ${args.inspect} has ${game.state.laneDecks[args.inspect]?.length} cards

lane discard ${args.inspect}:
${game.state.laneDiscardPiles[args.inspect]?.join(` `) || `empty`}`
			}
		}

		if (roleTurn == Role.Attacker) {
			return [
				`you are the attacker\nit is your turn`,
				printStateForAttacker(game.state),
				`make a move with move: "d0"\ninspect a lane with inspect: 3\ninspect attacker discard pile with inspect: "a"`
			]
		}

		return [
			`you are the attacker\nit is @${game.defender}'s turn`,
			printStateForAttacker(game.state),
			`make a move with move: "d0"\ninspect a lane with inspect: 3\ninspect attacker discard pile with inspect: "a"`
		]
	}

	const waitingUser = $db.f({ _id: `binmat` }, { waiting: true }).first()?.waiting as string | undefined

	if (waitingUser == context.caller)
		return `you are currently waiting for someone to join\nget someone else to run ${context.this_script} { new: true }`

	if (isRecord(args) && args.new) {
		if (waitingUser) {
			const id = Math.floor(Math.random() * (2 ** 51)).toString(36).padStart(10, `0`)
			const callerRole: Role = Math.round(Math.random()) + 1
			const state = createState()

			if (callerRole == Role.Defender) {
				$db.us({ _id: `binmat` }, {
					$unset: { waiting: `` },

					$set: {
						[`IDToGame/${id}`]: {
							defender: context.caller,
							attacker: waitingUser,
							state
						},

						[`userToID/${context.caller}`]: id,
						[`userToID/${waitingUser}`]: id
					}
				})

				return [ `created game with @${waitingUser}\nyou are the defender`, printStateForDefender(state) ]
			}

			/* attacker */

			$db.us({ _id: `binmat` }, {
				$unset: { waiting: `` },

				$set: {
					[`IDToGame/${id}`]: {
						defender: waitingUser,
						attacker: context.caller,
						state
					},

					[`userToID/${context.caller}`]: id,
					[`userToID/${waitingUser}`]: id
				}
			})

			return [ `created game with @${waitingUser}\nyou are the attacker`, printStateForAttacker(state) ]
		}

		$db.us({ _id: `binmat` }, { $set: { waiting: context.caller } })

		return `you are now waiting for someone else to join\nget someone else to run ${context.this_script} { new: true }`
	}

	if (waitingUser)
		return `@${waitingUser} is currently waiting for someone to join\nstart a new game with them with ${context.this_script} { new: true }`

	return `start a new game? new: true`
}

function printStateForDefender(state: State) {
	return `\
turn ${state.turn} / ${state.turns}

attacker has ${state.attackerHand.length == 1 ? `1 card` : `${state.attackerHand.length} card`}

attacker stacks:   attacker deck:
${state.attackerStacks.map(stack => stack.length ? `{}` : `\`C[]\``).join(` `)}  ${state.attackerDeck.length ? `{}` : `\`C[]\``}

defender stacks:   attacker discard pile:
${state.defenderStacks.map(stack => stack.cards.length ? (stack.faceup ? stack.cards[stack.cards.length - 1] : `{}`) : `\`C[]\``).join(` `)}  ${state.attackerDiscardPile.length ? state.attackerDiscardPile[state.attackerDiscardPile.length - 1] : `\`C[]\``}

lane decks:
${state.laneDecks[0].length ? `{}` : `\`C[]\``} ${state.laneDecks[1].length ? `{}` : `\`C[]\``} ${state.laneDecks[2].length ? `{}` : `\`C[]\``} ${state.laneDecks[3].length ? state.laneDecks[3][state.laneDecks[3].length - 1] : `\`C[]\``} ${state.laneDecks[4].length ? state.laneDecks[4][state.laneDecks[4].length - 1] : `\`C[]\``} ${state.laneDecks[5].length ? state.laneDecks[5][state.laneDecks[5].length - 1] : `\`C[]\``}

lane discards:
${state.laneDiscardPiles.map(discardPile => discardPile.length ? discardPile[discardPile.length - 1] : `\`C[]\``).join(` `)}

your hand:
${state.defenderHand.join(` `)}`
}

function printStateForAttacker(state: State) {
	return `\
turn ${state.turn} / ${state.turns}

your hand:
${state.attackerHand.join(` `)}

attacker stacks:   attacker deck:
${state.attackerStacks.map(stack => stack.length ? `{}` : `\`C[]\``).join(` `)}  ${state.attackerDeck.length ? `{}` : `\`C[]\``}

defender stacks:   attacker discard pile:
${state.defenderStacks.map(stack => stack.cards.length ? (stack.faceup ? stack.cards[stack.cards.length - 1] : `{}`) : `\`C[]\``).join(` `)}  ${state.attackerDiscardPile.length ? state.attackerDiscardPile[state.attackerDiscardPile.length - 1] : `\`C[]\``}

lane decks:
${state.laneDecks[0].length ? `{}` : `\`C[]\``} ${state.laneDecks[1].length ? `{}` : `\`C[]\``} ${state.laneDecks[2].length ? `{}` : `\`C[]\``} ${state.laneDecks[3].length ? state.laneDecks[3][state.laneDecks[3].length - 1] : `\`C[]\``} ${state.laneDecks[4].length ? state.laneDecks[4][state.laneDecks[4].length - 1] : `\`C[]\``} ${state.laneDecks[5].length ? state.laneDecks[5][state.laneDecks[5].length - 1] : `\`C[]\``}

lane discards:
${state.laneDiscardPiles.map(discardPile => discardPile.length ? discardPile[discardPile.length - 1] : `\`C[]\``).join(` `)}

defender has ${state.defenderHand.length == 1 ? `1 card` : `${state.defenderHand.length} card`}`
}
