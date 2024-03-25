/* eslint-disable unicorn/prevent-abbreviations */
import { abreviateMove } from "../dist/abreviateMove"
import { CardStringFaceModifier, CardStringFaces, CardStringSuit, CardStringSuits, Lanes, MoveTag, Role, StatusCode, StatusCodeMessages } from "../dist/common"
import { PowersOfTwo, doCombat } from "../dist/doCombat"
import { doMove } from "../dist/doMove"
import { doMoveCombat } from "../dist/doMoveCombat"
import { doMoveDiscard } from "../dist/doMoveDiscard"
import { doMoveDraw } from "../dist/doMoveDraw"
import { doMovePass } from "../dist/doMovePass"
import { doMovePlay } from "../dist/doMovePlay"
import { doMovePlayFaceUp } from "../dist/doMovePlayFaceUp"
import { generateArgs, generateArgsForAttacker, generateArgsForDefender } from "../dist/generateArgs"
import { isCard } from "../dist/isCard"
import { isCardStringFace } from "../dist/isCardStringFace"
import { isCardStringSuit } from "../dist/isCardStringSuit"
import { Cards, makeState } from "../dist/makeState"
import { parseBinlog } from "../dist/parseBinlog"
import { parseMove } from "../dist/parseMove"

export default (context: Context) => {
	const library = {
		abreviateMove,
		CardStringFaceModifier:
		// @ts-expect-error although it's a const enum, it's a real js runtime object
		CardStringFaceModifier,
		CardStringFaces,
		// @ts-expect-error although it's a const enum, it's a real js runtime object
		CardStringSuit,
		CardStringSuits,
		Lanes,
		// @ts-expect-error although it's a const enum, it's a real js runtime object
		MoveTag,
		// @ts-expect-error although it's a const enum, it's a real js runtime object
		Role,
		// @ts-expect-error although it's a const enum, it's a real js runtime object
		StatusCode,
		StatusCodeMessages,
		PowersOfTwo,
		doCombat,
		doMove,
		doMoveCombat,
		doMoveDiscard,
		doMoveDraw,
		doMovePass,
		doMovePlay,
		doMovePlayFaceUp,
		generateArgs,
		generateArgsForAttacker,
		generateArgsForDefender,
		isCard,
		isCardStringFace,
		isCardStringSuit,
		Cards,
		makeState,
		parseBinlog,
		parseMove
	}

	if (!(context.calling_script || `is_scriptor` in context)) {
		return `This is a library script. Use this library script in your script like so:\n\n\`Tconst\` \`A{\` ${
			Object.keys(library).sort().map(name => `\`N${name}\``).join(`\`A,\` `)
		} \`A}\` \`O=\` \`A#${`nlmhf`[_SECLEVEL]}s.\`\`C${_SCRIPT_USER}\`\`A.\`\`L${_SCRIPT_NAME}\`\`A()\`\n\nThe source code for this script can be found in this GitHub repository:\n\`Phttps://github\`\`P.com/samualtnorman/binmat\`\n\nThis returned values of this script does not yet have any documentation but maybe that could be an opportunity for you to contribute :).`
	}

	return library
}
