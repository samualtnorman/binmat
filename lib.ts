export function shuffle<T>(array: T[]): T[] {
	if (array.length) {
		for (let i = array.length - 1; i--;)
			array.push(array.splice(Math.floor(Math.random() * i) + 2, 1)[0])
	}

	return array
}

export function assert(value: any, message = "assertion failed"): asserts value {
	if (!value)
		throw new Error(message)
}
