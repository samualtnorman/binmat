# Binmat
Simulator and utility functions for the card game [binmat](https://github.com/DrizzlyBear/binmat_rules) from the video game
[hackmud](https://hackmud.com/).<br>
If you need any help, you can `@samualn` in the [hackmud discord server](https://discord.gg/gxpEdwU8CC) or
[open an issue](https://github.com/samualtnorman/binmat/issues/new).

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
Setup:
1. Install [Node.js](https://nodejs.org/en/), [PNPM](https://pnpm.io/installation), and [Git](https://git-scm.com/downloads)
2. [Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) this
   [repository](https://github.com/samualtnorman/binmat)
3. Open a command prompt `cd`'d into the cloned repository folder
4. Run `pnpm install`
5. **(OPTIONAL)** Tell the script manager where the hackmud directory is with
   `pnpm hsm config set hackmudPath <hackmud directory>`
   - Replace `<hackmud directory>` with the path to the hackmud directory
   - You can find your hackmud directory by running `#dir` in hackmud and going up two directories

### Compiling the hackmud Scripts
If you did step 5 of the Setup, run `pnpm hsm push game-scripts` and the scripts will be pushed straight to your user's
`scripts` folders.<br>
If you did not do step 5, run `pnpm hsm golf game-scripts/binmat.ts` and `pnpm hsm golf game-scripts/binmat_lib.ts`,
this will generate hackmud script files next to those source files.

### Building the package
Run `pnpm package`, the `dist` folder is then what gets published to [NPM](https://www.npmjs.com/package/binmat).

## Running the Tests
Run `pnpm test`.
