import { Card, CardValue } from "./createState"

export const enum Action {
	Draw,
	Play,
	PlayFaceup,
	Combat,
	Discard,
	Pass
}

export const Lanes = [ 0, 1, 2, 3, 4, 5 ] as const
export type Lane = typeof Lanes[number]

export const AttackerDeck = 6
export type AttackerDeck = typeof AttackerDeck

export const AttackerDiscardPile = 6
export type AttackerDiscardPile = typeof AttackerDiscardPile

export type Move = {
	action: Action.Draw
	deck: Lane | AttackerDeck
} | {
	action: Action.Play | Action.PlayFaceup
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
	PlayedCardFacedWrongWay
}
