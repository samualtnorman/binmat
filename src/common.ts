import { MoveTag } from "./MoveTag"
import { StatusCode } from "./StatusCode"

export const Lanes = [ 0, 1, 2, 3, 4, 5 ] as const
export type Lane = typeof Lanes[any]
export type CardStringFaceNumber = `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `a`

export const CardStringFaceModifier = { Trap: `@`, Wild: `*`, Bounce: `?`, Break: `>` } as const

export namespace CardStringFaceModifier {
	export type Trap = typeof CardStringFaceModifier.Trap
	export type Wild = typeof CardStringFaceModifier.Wild
	export type Bounce = typeof CardStringFaceModifier.Bounce
	export type Break = typeof CardStringFaceModifier.Break
}

export type CardStringFaceModifier = CardStringFaceModifier.Trap | CardStringFaceModifier.Wild |
	CardStringFaceModifier.Bounce | CardStringFaceModifier.Break

export type CardStringFace = CardStringFaceNumber | `${CardStringFaceModifier}`
export const CardStringSuit = { Form: `&`, Kin: `%`, Data: `+`, Chaos: `!`, Void: `^`, Choice: `#` } as const

export namespace CardStringSuit {
	export type Form = typeof CardStringSuit.Form
	export type Kin = typeof CardStringSuit.Kin
	export type Data = typeof CardStringSuit.Data
	export type Chaos = typeof CardStringSuit.Chaos
	export type Void = typeof CardStringSuit.Void
	export type Choice = typeof CardStringSuit.Choice
}

export type CardStringSuit = CardStringSuit.Form | CardStringSuit.Kin |
	CardStringSuit.Data | CardStringSuit.Chaos | CardStringSuit.Void |
	CardStringSuit.Choice

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


export type Move =
	{ tag: MoveTag.Draw, deck: Lane | AttackerDeck } |
	{ tag: MoveTag.Play | MoveTag.PlayFaceUp, card: CardString | CardStringFace, lane: Lane } |
	{ tag: MoveTag.Combat, lane: Lane } |
	{ tag: MoveTag.Discard, card: CardString | CardStringFace, discardPile: Lane | AttackerDiscardPile } |
	{ tag: MoveTag.Pass }

export const StatusCodeMessages: Record<StatusCode, string> = [
	``,
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

export type ShuffleFunction = (cards: CardString[]) => CardString[]

export { MoveTag } from "./MoveTag"
export { Role } from "./Role"
export { StatusCode } from "./StatusCode"
