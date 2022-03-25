# Binmat Simulator
[![Test](/../../actions/workflows/publish.yml/badge.svg)](/../../actions/workflows/publish.yml)
[![Lint](/../../actions/workflows/lint.yml/badge.svg)](/../../actions/workflows/lint.yml)

If you need any help, [open an issue](/../../issues/new).

## How to Build for Hackmud

0. Install [Node.js](https://nodejs.org/en/), [clone this repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository), and open a command window in the newly cloned repo folder.
1. Run `npm install`.
1. Run `npm run push-script`.
    - This will print the number of characters needed to upload the script.
1. Open hackmud, pick a user, and run `#up binmat`.

## Using To Test Your Binmat Bot

0. Install [Node.js](https://nodejs.org/en/), create a new folder, and open a command window in that folder.
1. Run `npm init -y`.
1. Run `npm install binmat`.
1. Create an `index.js` file in that directory.
1. In that new file, paste in this template.
    ```js
    const { simulateGame } = require("binmat")

    // the first argument is the defender's brain
    // and the second is the attacker's brain
    // in this case we are using the same brain for both
    simulateGame(brain, brain, {
        timeLimit: 5000, // in milliseconds
        onMove: (state, binlog) => console.log(binlog.join("\n"))
    })

    function brain(context, args, xform) {
        // you should fill this function with your brain code

        // xform() is the equivalent of #fs.binmat.x()
        xform({ op: "--" })
    }
    ```
1. Run `node index.js`.
