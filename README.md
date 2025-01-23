# Binmat
Simulator and utility functions for the card game [binmat](https://github.com/DrizzlyBear/binmat_rules) from the video game
[hackmud](https://hackmud.com/).<br>
If you need any help, you can `@samualn` in the [hackmud discord server](https://discord.gg/gxpEdwU8CC) or
[open an issue](https://github.com/samualtnorman/binmat/issues/new).

Supports Node.js 18, 20, and above.

## Using Binmat Simulator To Test Your Binmat Bot
0. Install [Node.js](https://nodejs.org/en/) and [Git](https://git-scm.com/downloads), make a new folder, and open a
   command window in that folder
1. Run `npx tiged samualtnorman/binmat/examples/test-binmat-brain`
1. Run `npm install`
1. Edit `index.js`
	```js
	import { simulateGame, Role } from "binmat"

	// the first argument is the defender's brain
	// and the second is the attacker's brain
	// in this case we are using the same brain for both
	const winner = simulateGame(brain, brain, {
		timeLimit: 5000, // in milliseconds
		// console.log() prints its arguments, here we are printing the binlog
		onMove: (state, binlog) => console.log(binlog.join("\n"))
	})

	if (winner == Role.Defender)
		console.log("The defender won!")
	else
		console.log("The attacker won!")

	/** @type {import("binmat/simulateGame").BrainScript} */
	function brain(context, args, xform) {
		// you should fill this function with your brain code

		// xform() is the equivalent of #fs.binmat.x()
		xform({ op: "--" })
	}
	```
1. Run `node index.js`

## Building Yourself
### Setup
Follow this first.

1. Install [Node.js](https://nodejs.org/en/), [PNPM](https://pnpm.io/installation), and
   [Git](https://git-scm.com/downloads)
2. [Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) this
   [repository](https://github.com/samualtnorman/binmat)
3. Open a command prompt `cd`'d into the cloned repository folder
4. Run `pnpm install`

### Compiling the hackmud Scripts
You can run `pnpm hsm push game-scripts` and the scripts will be pushed straight to your user's
`scripts` folders. Or you can run `pnpm hsm golf game-scripts/binmat.ts` and `pnpm hsm golf game-scripts/binmat_lib.ts`,
this will generate hackmud script files next to those source files.

### Building the package
Run `pnpm package`, the `dist` folder is then what gets published to [NPM](https://www.npmjs.com/package/binmat).

## Running the Tests
Run `pnpm test`.
