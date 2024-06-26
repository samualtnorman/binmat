export const Lanes = [ 0, 1, 2, 3, 4, 5 ] as const
export type Lane = typeof Lanes[any]
export type CardStringFaceNumber = `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `a`
export const enum CardStringFaceModifier { Trap = `@`, Wild = `*`, Bounce = `?`, Break = `>` }
export type CardStringFace = CardStringFaceNumber | `${CardStringFaceModifier}`
export const enum CardStringSuit { Form = `&`, Kin = `%`, Data = `+`, Chaos = `!`, Void = `^`, Choice = `#` }
export type CardString = `${CardStringFace}${CardStringSuit}`
export const AttackerDeck = 6
export type AttackerDeck = 6
export const AttackerDiscardPile = 6
export type AttackerDiscardPile = 6
export const AttackerDeckString = `a`
export type AttackerDeckString = `a`
export type MoveStringDraw = `d${Lane | AttackerDeckString}`
export type MoveStringCombat = `c${Lane}`
export type MoveStringPlay = `p${CardString | CardStringFace}${Lane}`
export type MoveStringPlayFaceup = `u${CardString | CardStringFace}${Lane}`
export type MoveStringDiscard = `x${CardString | CardStringFace}${Lane | `a`}`
export type MoveStringPass = "--"

export type MoveString =
	MoveStringDraw | MoveStringCombat | MoveStringPlay | MoveStringPlayFaceup | MoveStringDiscard | MoveStringPass

export const enum MoveTag { Draw = 1, Play, PlayFaceUp, Combat, Discard, Pass }

export type Move =
	{ tag: MoveTag.Draw, deck: Lane | AttackerDeck } |
	{ tag: MoveTag.Play | MoveTag.PlayFaceUp, card: CardString | CardStringFace, lane: Lane } |
	{ tag: MoveTag.Combat, lane: Lane } |
	{ tag: MoveTag.Discard, card: CardString | CardStringFace, discardPile: Lane | AttackerDiscardPile } |
	{ tag: MoveTag.Pass }

export const enum StatusCode {
	Okay, DefenderWin, AttackerWin, MadeMoveOnFinishedGame, DefenderDrewFromAttackerDeck, AttackerDrewFromBlockedLane,
	PlayedUnownedCard, PlayedBreakToEmptyStack, DefenderInitiatedCombat, AttackerInitiatedCombatWithEmptyStack,
	DiscardedToOpponentDiscardPile, AttackerDiscardedToEmptyDiscardAndDeck, AttackerDrewFromEmptyDiscardAndDeck,
	PlayedCardFacedWrongWay, DefenderPlayedFaceUpBreakToStackWithBreak
}

export const StatusCodeMessages: Record<StatusCode, string> = [
	`okay`,
	`defender won`,
	`attacker won`,
	`tried to make a move on a finished game`,
	`the defender tried to draw from the attacker's deck`,
	`the attacker tried to drawn from a blocked lane deck`,
	`tried to play a card not in hand`,
	`tried to play a break card to an empty stack`,
	`the defender tried to initiate combat`,
	`the attacker tried to initiate combat with an empty attacker stack`,
	`tried to discard to opponent's discard pile`,
	`attacker tried to discard when the attacker discard pile and attacker deck are empty`,
	`attacker tried to draw from attacker deck when it and the attacker discard pile are empty`,
	`tried to play card faced incorrectly`,
	`the defender tried to play a face up break to a stack that already contains a break card`
]

export const enum Role { Defender = 1, Attacker }
export type DefenderStack = { cards: CardString[], isFaceUp: boolean }

export type State = {
	attackerStacks: [ CardString[], CardString[], CardString[], CardString[], CardString[], CardString[] ]
	defenderStacks: [ DefenderStack, DefenderStack, DefenderStack, DefenderStack, DefenderStack, DefenderStack ]
	laneDecks: [ CardString[], CardString[], CardString[], CardString[], CardString[], CardString[] ]
	laneDiscardPiles: [ CardString[], CardString[], CardString[], CardString[], CardString[], CardString[] ]
	attackerDeck: CardString[]
	attackerDiscardPile: CardString[]
	attackerHand: CardString[]
	defenderHand: CardString[]
	turn: number
	// TODO think about removing `maxTurns`
	maxTurns: number
	attackerPassedLastTurn: boolean
	defenderPassedLastTurn: boolean
}

export const CardStringFaces: CardStringFace[] = [
	`2`,
	`3`,
	`4`,
	`5`,
	`6`,
	`7`,
	`8`,
	`9`,
	`a`,
	CardStringFaceModifier.Trap,
	CardStringFaceModifier.Wild,
	CardStringFaceModifier.Bounce,
	CardStringFaceModifier.Break
]

export const CardStringSuits: CardStringSuit[] = [
	CardStringSuit.Form,
	CardStringSuit.Kin,
	CardStringSuit.Data,
	CardStringSuit.Chaos,
	CardStringSuit.Void,
	CardStringSuit.Choice
]
