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

export const statusCodeMessages = [
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
	`tried to play card faced incorrectly`
] as Record<StatusCode, string>
