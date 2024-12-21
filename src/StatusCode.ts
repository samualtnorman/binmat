declare enum StatusCodeEnum {
	AttackerDiscardedToEmptyDiscardAndDeck,
	AttackerDrewFromBlockedLane,
	AttackerDrewFromEmptyDiscardAndDeck,
	AttackerInitiatedCombatWithEmptyStack,
	AttackerWin,
	DefenderDrewFromAttackerDeck,
	DefenderInitiatedCombat,
	DefenderPlayedFaceUpBreakToStackWithBreak,
	DefenderWin,
	DiscardedToOpponentDiscardPile,
	MadeMoveOnFinishedGame,
	Okay,
	PlayedBreakToEmptyStack,
	PlayedCardFacedWrongWay,
	PlayedUnownedCard
}

export type StatusCode = StatusCodeEnum
export type StatusCodeName = keyof typeof StatusCodeEnum

export namespace StatusCode {
	export type AttackerDiscardedToEmptyDiscardAndDeck = StatusCodeEnum.AttackerDiscardedToEmptyDiscardAndDeck
	export type AttackerDrewFromBlockedLane = StatusCodeEnum.AttackerDrewFromBlockedLane
	export type AttackerDrewFromEmptyDiscardAndDeck = StatusCodeEnum.AttackerDrewFromEmptyDiscardAndDeck
	export type AttackerInitiatedCombatWithEmptyStack = StatusCodeEnum.AttackerInitiatedCombatWithEmptyStack
	export type AttackerWin = StatusCodeEnum.AttackerWin
	export type DefenderDrewFromAttackerDeck = StatusCodeEnum.DefenderDrewFromAttackerDeck
	export type DefenderInitiatedCombat = StatusCodeEnum.DefenderInitiatedCombat
	export type DefenderPlayedFaceUpBreakToStackWithBreak = StatusCodeEnum.DefenderPlayedFaceUpBreakToStackWithBreak
	export type DefenderWin = StatusCodeEnum.DefenderWin
	export type DiscardedToOpponentDiscardPile = StatusCodeEnum.DiscardedToOpponentDiscardPile
	export type MadeMoveOnFinishedGame = StatusCodeEnum.MadeMoveOnFinishedGame
	export type Okay = StatusCodeEnum.Okay
	export type PlayedBreakToEmptyStack = StatusCodeEnum.PlayedBreakToEmptyStack
	export type PlayedCardFacedWrongWay = StatusCodeEnum.PlayedCardFacedWrongWay
	export type PlayedUnownedCard = StatusCodeEnum.PlayedUnownedCard
}

export const StatusCode = {
	AttackerDiscardedToEmptyDiscardAndDeck: 1 as StatusCode.AttackerDiscardedToEmptyDiscardAndDeck,
	AttackerDrewFromBlockedLane: 2 as StatusCode.AttackerDrewFromBlockedLane,
	AttackerDrewFromEmptyDiscardAndDeck: 3 as StatusCode.AttackerDrewFromEmptyDiscardAndDeck,
	AttackerInitiatedCombatWithEmptyStack: 4 as StatusCode.AttackerInitiatedCombatWithEmptyStack,
	AttackerWin: 5 as StatusCode.AttackerWin,
	DefenderDrewFromAttackerDeck: 6 as StatusCode.DefenderDrewFromAttackerDeck,
	DefenderInitiatedCombat: 7 as StatusCode.DefenderInitiatedCombat,
	DefenderPlayedFaceUpBreakToStackWithBreak: 8 as StatusCode.DefenderPlayedFaceUpBreakToStackWithBreak,
	DefenderWin: 9 as StatusCode.DefenderWin,
	DiscardedToOpponentDiscardPile: 10 as StatusCode.DiscardedToOpponentDiscardPile,
	MadeMoveOnFinishedGame: 11 as StatusCode.MadeMoveOnFinishedGame,
	Okay: 12 as StatusCode.Okay,
	PlayedBreakToEmptyStack: 13 as StatusCode.PlayedBreakToEmptyStack,
	PlayedCardFacedWrongWay: 14 as StatusCode.PlayedCardFacedWrongWay,
	PlayedUnownedCard: 15 as StatusCode.PlayedUnownedCard,
} as const

export const StatusCodesToNames: Readonly<Record<number, string>> = {
	1: "AttackerDiscardedToEmptyDiscardAndDeck",
	2: "AttackerDrewFromBlockedLane",
	3: "AttackerDrewFromEmptyDiscardAndDeck",
	4: "AttackerInitiatedCombatWithEmptyStack",
	5: "AttackerWin",
	6: "DefenderDrewFromAttackerDeck",
	7: "DefenderInitiatedCombat",
	8: "DefenderPlayedFaceUpBreakToStackWithBreak",
	9: "DefenderWin",
	10: "DiscardedToOpponentDiscardPile",
	11: "MadeMoveOnFinishedGame",
	12: "Okay",
	13: "PlayedBreakToEmptyStack",
	14: "PlayedCardFacedWrongWay",
	15: "PlayedUnownedCard",
}
