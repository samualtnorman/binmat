# Binmat Simulator
[![Test](https://github.com/samualtnorman/binmat/actions/workflows/test.yml/badge.svg)](https://github.com/samualtnorman/binmat/actions/workflows/test.yml)
[![Lint](https://github.com/samualtnorman/binmat/actions/workflows/lint.yml/badge.svg)](https://github.com/samualtnorman/binmat/actions/workflows/lint.yml)
[![Publish](https://github.com/samualtnorman/binmat/actions/workflows/publish.yml/badge.svg)](https://github.com/samualtnorman/binmat/actions/workflows/publish.yml)

If you need any help, [open an issue](https://github.com/samualtnorman/binmat/issues/new).

## Using To Test Your Binmat Bot

0. Install [Node.js](https://nodejs.org/en/), make a new folder, and open a command window in that folder
1. Run `npx tiged samualtnorman/binmat/examples/test-binmat-brain`
1. Run `npm install`
1. Edit `index.js`
    ```js
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
    ```
1. Run `node index.js`

## How to Build for Hackmud

0. Install [Node.js](https://nodejs.org/en/), [clone this repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository), and open a command window in the newly cloned repo folder.
1. Run `npm install`.
1. Run `npm run push-script`.
    - This will print the number of characters needed to upload the script.
1. Open hackmud, pick a user, and run `#up binmat`.
