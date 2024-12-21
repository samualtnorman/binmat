declare enum MoveTagEnum {
	Draw,
	Play,
	PlayFaceUp,
	Combat,
	Discard,
	Pass
}

export type MoveTag = MoveTagEnum
export type MoveTagName = keyof typeof MoveTagEnum

export namespace MoveTag {
	export type Draw = MoveTagEnum.Draw
	export type Play = MoveTagEnum.Play
	export type PlayFaceUp = MoveTagEnum.PlayFaceUp
	export type Combat = MoveTagEnum.Combat
	export type Discard = MoveTagEnum.Discard
	export type Pass = MoveTagEnum.Pass
}

export const MoveTag = {
	Draw: 1 as MoveTag.Draw,
	Play: 2 as MoveTag.Play,
	PlayFaceUp: 3 as MoveTag.PlayFaceUp,
	Combat: 4 as MoveTag.Combat,
	Discard: 5 as MoveTag.Discard,
	Pass: 6 as MoveTag.Pass,
} as const

export const MoveTagsToNames: Readonly<Record<number, string>> = {
	1: "Draw",
	2: "Play",
	3: "PlayFaceUp",
	4: "Combat",
	5: "Discard",
	6: "Pass",
}
