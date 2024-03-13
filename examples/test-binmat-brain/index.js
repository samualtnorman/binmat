import { simulateGame } from "binmat"

// the first argument is the defender's brain
// and the second is the attacker's brain
// in this case we are using the same brain for both
simulateGame(brain, brain, {
	timeLimit: 5000, // in milliseconds
	// console.log() prints its arguments, here we are printing the binlog
	onMove: (state, binlog) => console.log(binlog.join("\n"))
})

/** @type {import("binmat/simulateGame").BrainScript} */
function brain(context, args, xform) {
	// you should fill this function with your brain code

	// xform() is the equivalent of #fs.binmat.x()
	xform({ op: "--" })
}
