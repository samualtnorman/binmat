import { CardStringFaces, type CardStringFace } from "./common"

export const isCardStringFace =
	(face: string): face is CardStringFace => face.length == 1 && CardStringFaces.includes(face)
