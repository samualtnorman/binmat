declare enum MoveTagEnum {
	Combat,
	Discard,
	Draw,
	Pass,
	Play,
	PlayFaceUp
}

export type MoveTag = MoveTagEnum
export type MoveTagName = keyof typeof MoveTagEnum

export namespace MoveTag {
	export type Combat = MoveTagEnum.Combat
	export type Discard = MoveTagEnum.Discard
	export type Draw = MoveTagEnum.Draw
	export type Pass = MoveTagEnum.Pass
	export type Play = MoveTagEnum.Play
	export type PlayFaceUp = MoveTagEnum.PlayFaceUp
}

export const MoveTag = {
	Combat: 1 as MoveTag.Combat,
	Discard: 2 as MoveTag.Discard,
	Draw: 3 as MoveTag.Draw,
	Pass: 4 as MoveTag.Pass,
	Play: 5 as MoveTag.Play,
	PlayFaceUp: 6 as MoveTag.PlayFaceUp,
} as const

export const MoveTagsToNames: Readonly<Record<number, string>> = {
	1: "Combat",
	2: "Discard",
	3: "Draw",
	4: "Pass",
	5: "Play",
	6: "PlayFaceUp",
}
