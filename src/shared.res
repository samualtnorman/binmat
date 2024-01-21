@genType type cardNumber = Two | Three | Four | Five | Six | Seven | Eight | Nine | Ten
@genType type cardModifier = Trap | Wild | Bounce | Break
@genType type cardFace = | ...cardNumber | ...cardModifier
@genType type cardSuit = Form | Kin | Data | Chaos | Void | Choice
@genType type card = {face: cardFace, suit: cardSuit}
@genType type cards = array<card>
@genType type defenderStack = {cards: cards, isFaceUp: bool}

@genType type laneStacks = (cards, cards, cards, cards, cards, cards)

@genType
type state = {
  attackerStacks: laneStacks,
  defenderStacks: (
    defenderStack,
    defenderStack,
    defenderStack,
    defenderStack,
    defenderStack,
    defenderStack,
  ),
  laneDecks: laneStacks,
  laneDiscardPiles: laneStacks,
  attackerDeck: cards,
  attackerDiscardPile: cards,
  attackerHand: cards,
  defenderHand: cards,
  turn: int,
  // TODO think about renaming or removing `turns`
  turns: int,
  attackerPassedLastTurn: bool,
  defenderPassedLastTurn: bool,
}

@genType type cardOrCardFace = | ...card | ...cardFace

@genType type lane = Zero | One | Two | Three | Four | Five

@genType type laneOrAttackerDeck = | ...lane | AttackerDeck

@genType type move = Draw({deck: laneOrAttackerDeck}) | Play({card: cardOrCardFace, lane: lane})

@genType
type status =
  | Okay
  | DefenderWin
  | AttackerWin
  | MadeMoveOnFinishedGame
  | DefenderDrewFromAttackerDeck
  | AttackerDrewFromBlockedLane
  | PlayedUnownedCard
  | PlayedBreakToEmptyStack
  | DefenderInitiatedCombat
  | AttackerInitiatedCombatWithEmptyStack
  | DiscardedToOpponentDiscardPile
  | AttackerDiscardedToEmptyDiscardAndDeck
  | AttackerDrewFromEmptyDiscardAndDeck
  | PlayedCardFacedWrongWay
  | DefenderPlayedFaceUpBreakToStackWithBreak

@genType
let getStatusMessage = status =>
  switch status {
  | Okay => `Okay`
  | DefenderWin => `Defender won`
  | AttackerWin => `attacker won`
  | MadeMoveOnFinishedGame => `tried to make a move on a finished game`
  | DefenderDrewFromAttackerDeck => `the defender tried to draw from the attacker's deck`
  | AttackerDrewFromBlockedLane => `the attacker tried to drawn from a blocked lane deck`
  | PlayedUnownedCard => `tried to play a card not in hand`
  | PlayedBreakToEmptyStack => `tried to play a break card to an empty stack`
  | DefenderInitiatedCombat => `the defender tried to initiate combat`
  | AttackerInitiatedCombatWithEmptyStack => `the attacker tried to initiate combat with an empty attacker stack`
  | DiscardedToOpponentDiscardPile => `tried to discard to opponent's discard pile`
  | AttackerDiscardedToEmptyDiscardAndDeck => `attacker tried to discard when the attacker discard pile and attacker deck are empty`
  | AttackerDrewFromEmptyDiscardAndDeck => `attacker tried to draw from attacker deck when it and the attacker discard pile are empty`
  | PlayedCardFacedWrongWay => `tried to play card faced incorrectly`
  | DefenderPlayedFaceUpBreakToStackWithBreak => `the defender tried to play a face up break to a stack that already contains a break card`
  }

@genType type role = Defender | Attacker

@genType
let turnToRole = turn =>
  if mod(turn, 2) == 0 {
    Defender
  } else {
    Attacker
  }

@genType
let getLaneStack = (stacks, lane: lane) => {
  let (zero, one, two, three, four, five) = stacks

  switch lane {
  | Zero => zero
  | One => one
  | Two => two
  | Three => three
  | Four => four
  | Five => five
  }
}

@genType
let cardNumberToInt = (number: cardNumber) =>
  switch number {
  | Two => 2
  | Three => 3
  | Four => 4
  | Five => 5
  | Six => 6
  | Seven => 7
  | Eight => 8
  | Nine => 9
  | Ten => 10
  }
