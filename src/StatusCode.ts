declare enum StatusCodeEnum {
	Okay,
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

export type StatusCode = StatusCodeEnum
export type StatusCodeName = keyof typeof StatusCodeEnum

export namespace StatusCode {
	export type Okay = StatusCodeEnum.Okay
	export type DefenderWin = StatusCodeEnum.DefenderWin
	export type AttackerWin = StatusCodeEnum.AttackerWin
	export type MadeMoveOnFinishedGame = StatusCodeEnum.MadeMoveOnFinishedGame
	export type DefenderDrewFromAttackerDeck = StatusCodeEnum.DefenderDrewFromAttackerDeck
	export type AttackerDrewFromBlockedLane = StatusCodeEnum.AttackerDrewFromBlockedLane
	export type PlayedUnownedCard = StatusCodeEnum.PlayedUnownedCard
	export type PlayedBreakToEmptyStack = StatusCodeEnum.PlayedBreakToEmptyStack
	export type DefenderInitiatedCombat = StatusCodeEnum.DefenderInitiatedCombat
	export type AttackerInitiatedCombatWithEmptyStack = StatusCodeEnum.AttackerInitiatedCombatWithEmptyStack
	export type DiscardedToOpponentDiscardPile = StatusCodeEnum.DiscardedToOpponentDiscardPile
	export type AttackerDiscardedToEmptyDiscardAndDeck = StatusCodeEnum.AttackerDiscardedToEmptyDiscardAndDeck
	export type AttackerDrewFromEmptyDiscardAndDeck = StatusCodeEnum.AttackerDrewFromEmptyDiscardAndDeck
	export type PlayedCardFacedWrongWay = StatusCodeEnum.PlayedCardFacedWrongWay
	export type DefenderPlayedFaceUpBreakToStackWithBreak = StatusCodeEnum.DefenderPlayedFaceUpBreakToStackWithBreak
}

export const StatusCode = {
	Okay: 1 as StatusCode.Okay,
	DefenderWin: 2 as StatusCode.DefenderWin,
	AttackerWin: 3 as StatusCode.AttackerWin,
	MadeMoveOnFinishedGame: 4 as StatusCode.MadeMoveOnFinishedGame,
	DefenderDrewFromAttackerDeck: 5 as StatusCode.DefenderDrewFromAttackerDeck,
	AttackerDrewFromBlockedLane: 6 as StatusCode.AttackerDrewFromBlockedLane,
	PlayedUnownedCard: 7 as StatusCode.PlayedUnownedCard,
	PlayedBreakToEmptyStack: 8 as StatusCode.PlayedBreakToEmptyStack,
	DefenderInitiatedCombat: 9 as StatusCode.DefenderInitiatedCombat,
	AttackerInitiatedCombatWithEmptyStack: 10 as StatusCode.AttackerInitiatedCombatWithEmptyStack,
	DiscardedToOpponentDiscardPile: 11 as StatusCode.DiscardedToOpponentDiscardPile,
	AttackerDiscardedToEmptyDiscardAndDeck: 12 as StatusCode.AttackerDiscardedToEmptyDiscardAndDeck,
	AttackerDrewFromEmptyDiscardAndDeck: 13 as StatusCode.AttackerDrewFromEmptyDiscardAndDeck,
	PlayedCardFacedWrongWay: 14 as StatusCode.PlayedCardFacedWrongWay,
	DefenderPlayedFaceUpBreakToStackWithBreak: 15 as StatusCode.DefenderPlayedFaceUpBreakToStackWithBreak,
} as const

export const StatusCodesToNames: Readonly<Record<number, string>> = {
	1: "Okay",
	2: "DefenderWin",
	3: "AttackerWin",
	4: "MadeMoveOnFinishedGame",
	5: "DefenderDrewFromAttackerDeck",
	6: "AttackerDrewFromBlockedLane",
	7: "PlayedUnownedCard",
	8: "PlayedBreakToEmptyStack",
	9: "DefenderInitiatedCombat",
	10: "AttackerInitiatedCombatWithEmptyStack",
	11: "DiscardedToOpponentDiscardPile",
	12: "AttackerDiscardedToEmptyDiscardAndDeck",
	13: "AttackerDrewFromEmptyDiscardAndDeck",
	14: "PlayedCardFacedWrongWay",
	15: "DefenderPlayedFaceUpBreakToStackWithBreak",
}
