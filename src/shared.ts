export type State = {
	attackerStacks: [ Card[], Card[], Card[], Card[], Card[], Card[] ]
	defenderStacks: [ DefenderStack, DefenderStack, DefenderStack, DefenderStack, DefenderStack, DefenderStack ]
	laneDecks: [ Card[], Card[], Card[], Card[], Card[], Card[] ]
	laneDiscardPiles: [ Card[], Card[], Card[], Card[], Card[], Card[] ]
	attackerDeck: Card[]
	attackerDiscardPile: Card[]
	attackerHand: Card[]
	defenderHand: Card[]
	turn: number
	turns: number
	attackerPassedLastTurn: boolean
	defenderPassedLastTurn: boolean
}

export type Card = `${CardValue}${CardSuit}`
export type CardValue = CardNumber | CardModifier
export type CardNumber = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a"

export const enum CardModifier {
	Trap = `@`,
	Wild = `*`,
	Bounce = `?`,
	Break = `>`
}

export const enum CardSuit {
	Form = `&`,
	Kin = `%`,
	Data = `+`,
	Chaos = `!`,
	Void = `^`,
	Choice = `#`
}

export type DefenderStack = {
	cards: Card[]
	isFaceUp: boolean
}

export type Move = {
	kind: MoveKind.Draw
	deck: Lane | AttackerDeck
} | {
	kind: MoveKind.Play | MoveKind.PlayFaceUp
	card: Card | CardValue
	lane: Lane
} | {
	kind: MoveKind.Combat
	lane: Lane
} | {
	kind: MoveKind.Discard
	card: Card | CardValue
	discardPile: Lane | AttackerDiscardPile
} | { kind: MoveKind.Pass }

export const enum MoveKind {
	Draw,
	Play,
	PlayFaceUp,
	Combat,
	Discard,
	Pass
}

export type Lane = 0 | 2 | 1 | 3 | 4 | 5

export const AttackerDeck = 6
export type AttackerDeck = typeof AttackerDeck

export const AttackerDiscardPile = 6
export type AttackerDiscardPile = typeof AttackerDiscardPile

export const enum StatusCode {
	Ok,
	DefenderWin,
	AttackerWin,
	MadeMoveOnFinishedGame,
	DefenderDrewFromAttackerDeck,
	AttackerDrewFromBlockedLane,
	PlayedUnownedCard,
	PlayedBreakToEmptyStack,
	DefenderInitiatedCombat,
	AttackerInitiatedCombatWithEmptyStack,
	DiscardedToOpponentDiscardPile,
	AttackerDiscardedToEmptyDiscardAndDeck,
	AttackerDrewFromEmptyDiscardAndDeck,
	PlayedCardFacedWrongWay,
	DefenderPlayedFaceUpBreakToStackWithBreak
}

export const StatusCodeMessages = [
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
] as Record<StatusCode, string>

export const enum Role {
	Defender = 1,
	Attacker
}
