import { assert, isRecord } from "@samual/lib"
import createState, { Card, CardSuit, Role, State } from "../src/createState"
import parseMove from "../src/parseMove"
import doMove from "../src/doMove"
import { Action, StatusCode } from "../src/shared"

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
	[StatusCode.AttackerDiscardedToEmptyDiscardAndDeck]: `attacker discarded to empty discard and deck`,
	[StatusCode.AttackerDrewFromEmptyDiscardAndDeck]: `attacker drew from empty discard and deck`,
	[StatusCode.PlayedCardFacedWrongWay]: `played card faced wrong way`
}

const SuitToColourCode = {
	[CardSuit.Form]: `l`,
	[CardSuit.Kin]: `N`,
	[CardSuit.Data]: `q`,
	[CardSuit.Chaos]: `D`,
	[CardSuit.Void]: `I`,
	[CardSuit.Choice]: `F`
} as const

export default (context: Context, args: unknown) => $(context, args)

function $(context: Context, args: unknown) {
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
								`it is not yet your turn, you are the defender\nit is @${game.attacker}'s turn\n`,
								printStateForDefender(game.state)
							]
						}
					}

					let move

					try {
						move = parseMove(args.move, true)
					} catch (error) {
						assert(error instanceof Error)
						doMove(game.state, { action: Action.Pass })
						$db.us({ _id: `binmat` }, { $set: { [`IDToGame/${currentGameID}.state`]: game.state } })
						$fs.chats.tell({ to: game.attacker, msg: `@${context.caller} played --` })

						return { ok: false, msg: [ error.message, `passing\n`, printStateForDefender(game.state) ] }
					}

					const result = doMove(game.state, move)

					switch (result.status) {
						case StatusCode.Ok: {
							$db.us({ _id: `binmat` }, { $set: { [`IDToGame/${currentGameID}.state`]: game.state } })
							$fs.chats.tell({ to: game.attacker, msg: `@${context.caller} played ${move.action == Action.Play && !game.state.defenderStacks[move.lane].faceup ? `pX${move.lane}` : args.move}` })

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

							$fs.chats.tell({ to: game.attacker, msg: `@${context.caller} played ${args.move} and won` })

							return [ `you won!\n`, printStateForDefender(game.state), `\`zLOCK_ERROR\`` ]
						}

						case StatusCode.AttackerWin: {
							$db.us({ _id: `binmat` }, {
								$unset: {
									[`IDToGame/${currentGameID}`]: ``,
									[`userToID/${game.defender}`]: ``,
									[`userToID/${game.attacker}`]: ``
								}
							})

							$fs.chats.tell({ to: game.attacker, msg: `@${context.caller} played ${args.move} and lost` })

							return [ `you lost :(\n`, printStateForDefender(game.state), `\`zLOCK_UNLOCKED\`` ]
						}

						default: {
							doMove(game.state, { action: Action.Pass })
							$db.us({ _id: `binmat` }, { $set: { [`IDToGame/${currentGameID}.state`]: game.state } })
							$fs.chats.tell({ to: game.attacker, msg: `@${context.caller} played --` })

							return { ok: false, msg: [ StatusCodeMessages[result.status], `passing\n`, printStateForDefender(game.state) ] }
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
					`you are the defender\nit is your turn\n`,
					printStateForDefender(game.state),
					`\nmake a move with move: "d0"\ninspect a lane with inspect: 3\ninspect attacker discard pile with inspect: "a"`
				]
			}

			return [
				`you are the defender\nit is @${game.attacker}'s turn\n`,
				printStateForDefender(game.state),
				`\ninspect a lane with inspect: 3\ninspect attacker discard pile with inspect: "a"`
			]
		}

		/* caller is attacker */

		if (isRecord(args)) {
			if (typeof args.move == `string`) {
				if (roleTurn == Role.Defender) {
					return {
						ok: false,
						msg: [
							`it is not yet your turn, you are the attacker\nit is @${game.defender}'s turn\n`,
							printStateForAttacker(game.state)
						]
					}
				}

				let move

				try {
					move = parseMove(args.move, true)
				} catch (error) {
					assert(error instanceof Error)
					doMove(game.state, { action: Action.Pass })
					$db.us({ _id: `binmat` }, { $set: { [`IDToGame/${currentGameID}.state`]: game.state } })
					$fs.chats.tell({ to: game.defender, msg: `@${context.caller} played --` })

					return { ok: false, msg: [ error.message, `passing\n`, printStateForDefender(game.state) ] }
				}

				const result = doMove(game.state, move)

				switch (result.status) {
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

						$fs.chats.tell({ to: game.defender, msg: `@${context.caller} played ${args.move} and lost` })

						return [ `you lost :(\n`, printStateForAttacker(game.state), `\`zLOCK_ERROR\`` ]
					}

					case StatusCode.AttackerWin: {
						$db.us({ _id: `binmat` }, {
							$unset: {
								[`IDToGame/${currentGameID}`]: ``,
								[`userToID/${game.defender}`]: ``,
								[`userToID/${game.attacker}`]: ``
							}
						})

						$fs.chats.tell({ to: game.defender, msg: `@${context.caller} played ${args.move} and won` })

						return [ `you won!\n`, printStateForAttacker(game.state), `\`zLOCK_UNLOCKED\`` ]
					}

					default: {
						doMove(game.state, { action: Action.Pass })
						$db.us({ _id: `binmat` }, { $set: { [`IDToGame/${currentGameID}.state`]: game.state } })
						$fs.chats.tell({ to: game.defender, msg: `@${context.caller} played --` })

						return { ok: false, msg: [ StatusCodeMessages[result.status], `passing\n`, printStateForAttacker(game.state) ] }
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
				`you are the attacker\nit is your turn\n`,
				printStateForAttacker(game.state),
				`\nmake a move with move: "d0"\ninspect a lane with inspect: 3\ninspect attacker discard pile with inspect: "a"`
			]
		}

		return [
			`you are the attacker\nit is @${game.defender}'s turn\n`,
			printStateForAttacker(game.state),
			`\ninspect a lane with inspect: 3\ninspect attacker discard pile with inspect: "a"`
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

				$fs.chats.tell({ to: waitingUser, msg: `@${context.caller} has started a game of binmat with you in ${context.this_script}\nyou are the attacker` })

				return [
					`created game with @${waitingUser}\nyou are the defender\nit is your turn\n`,
					printStateForDefender(state),
					`\nmake a move with move: "d0"\ninspect a lane with inspect: 3\ninspect attacker discard pile with inspect: "a"`
				]
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

			$fs.chats.tell({ to: waitingUser, msg: `@${context.caller} has started a game of binmat with you in ${context.this_script}\nyou are the defender, it is your turn` })

			return [
				`created game with @${waitingUser}\nyou are the attacker\nit is @${waitingUser}'s turn\n`,
				printStateForAttacker(state),
				`\ninspect a lane with inspect: 3\ninspect attacker discard pile with inspect: "a"`
			]
		}

		$db.us({ _id: `binmat` }, { $set: { waiting: context.caller } })

		return `you are now waiting for someone else to join\nget someone else to run ${context.this_script} { new: true }`
	}

	if (waitingUser)
		return `@${waitingUser} is currently waiting for someone to join\nstart a new game with them with ${context.this_script} { new: true }`

	return `start a new game? new: true`
}

function printStateForDefender(state: State) {
	const attackerHand = state.attackerHand.length
		? (state.attackerHand.length == 1
			? `1 card`
			: `${state.attackerHand.length} cards`
		) : `empty`

	const attackerStacks = state.attackerStacks
		.map(cards =>
			cards.length
				? `{${`\`b${String(cards.length).padStart(2, `0`)}\``}}`
				: `\`C[\`\`b00\`\`C]\``
		).join(` `)

	const defenderStacks = state.defenderStacks
		.map(({ cards, faceup }) =>
			cards.length
				? (faceup
					? `\`b${cards.length.toString(36).toUpperCase()} \`${colourCard(cards[cards.length - 1]!)}`
					: `{${`\`b${String(cards.length).padStart(2, `0`)}\``}}`
				) : `\`C[\`\`b00\`\`C]\``
		).join(` `)

	const laneDecks012 = state.laneDecks
		.slice(0, 3)
		.map(cards =>
			cards.length
				? `{${`\`b${String(cards.length).padStart(2, `0`)}\``}}`
				: `\`C[\`\`b00\`\`C]\``
		).join(` `)

	const laneDecks345 = state.laneDecks
		.slice(3)
		.map(cards =>
			cards.length
				? `\`b${cards.length.toString(36).toUpperCase()} \`${colourCard(cards[cards.length - 1]!)}`
				: `\`C[\`\`b00\`\`C]\``
		).join(` `)

	return `\
turn ${state.turn} / ${state.turns}

ha0:
${attackerHand}

 a0   a1   a2   a3   a4   a5     a
${attackerStacks}   ${state.attackerDeck.length ? `{${`\`b${String(state.attackerDeck.length).padStart(2, `0`)}\``}}` : `\`C[\`\`b00\`\`C]\``}

 d0   d1   d2   d3   d4   d5     xa
${defenderStacks}   ${state.attackerDiscardPile.length ? `\`b${state.attackerDiscardPile.length.toString(36).toUpperCase()} \`${colourCard(state.attackerDiscardPile[state.attackerDiscardPile.length - 1]!)}` : `\`C[\`\`b00\`\`C]\``}

 l0   l1   l2   l3   l4   l5
${laneDecks012} ${laneDecks345}

 x0   x1   x2   x3   x4   x5
${state.laneDiscardPiles.map(cards => cards.length ? `\`b${cards.length.toString(36).toUpperCase()} \`${colourCard(cards[cards.length - 1]!)}` : `\`C[\`\`b00\`\`C]\``).join(` `)}

hd0:
${state.defenderHand.map(card => colourCard(card)).join(` `) || `empty`}`
}

function printStateForAttacker(state: State) {
	const attackerStacks = state.attackerStacks
		.map(cards =>
			cards.length
				? `\`b${cards.length.toString(36).toUpperCase()} \`${colourCard(cards[cards.length - 1]!)}`
				: `\`C[\`\`b00\`\`C]\``
		).join(` `)

	const defenderStacks = state.defenderStacks
		.map(({ cards, faceup }) =>
			cards.length
				? (faceup
					? `\`b${cards.length.toString(36).toUpperCase()} \`${colourCard(cards[cards.length - 1]!)}`
					: `\`D{\`${`\`b${String(cards.length).padStart(2, `0`)}\``}\`D}\``
				) : `\`C[\`\`b00\`\`C]\``
		).join(` `)

	const laneDecks012 = state.laneDecks
		.slice(0, 3)
		.map(cards =>
			cards.length
				? `{${`\`b${String(cards.length).padStart(2, `0`)}\``}}`
				: `\`C[\`\`b00\`\`C]\``
		).join(` `)

	const laneDecks345 = state.laneDecks
		.slice(3)
		.map(cards =>
			cards.length
				? `\`b${cards.length.toString(36).toUpperCase()} \`${colourCard(cards[cards.length - 1]!)}`
				: `\`C[\`\`b00\`\`C]\``
		).join(` `)

	const defenderHand = state.attackerHand.length
		? (state.defenderHand.length == 1
			? `1 card`
			: `${state.defenderHand.length} cards`
		) : `empty`

	return `\
turn ${state.turn} / ${state.turns}

ha0:
${state.attackerHand.map(card => colourCard(card)).join(` `) || `empty`}

 a0   a1   a2   a3   a4   a5     a
${attackerStacks}   ${state.attackerDeck.length ? `{${`\`b${String(state.attackerDeck.length).padStart(2, `0`)}\``}}` : `\`C[\`\`b00\`\`C]\``}

 d0   d1   d2   d3   d4   d5     xa
${defenderStacks}   ${state.attackerDiscardPile.length ? `\`b${state.attackerDiscardPile.length.toString(36).toUpperCase()} \`${colourCard(state.attackerDiscardPile[state.attackerDiscardPile.length - 1]!)}` : `\`C[\`\`b00\`\`C]\``}

 l0   l1   l2   l3   l4   l5
${laneDecks012} ${laneDecks345}

 x0   x1   x2   x3   x4   x5
${state.laneDiscardPiles.map(cards => cards.length ? `\`b${cards.length.toString(36).toUpperCase()} \`${colourCard(cards[cards.length - 1]!)}` : `\`C[\`\`b00\`\`C]\``).join(` `)}

hd0:
${defenderHand}`
}

function colourCard(card: Card) {
	return `\`${SuitToColourCode[card[1] as CardSuit]}${card}\``
}
