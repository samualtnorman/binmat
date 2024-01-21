type cardNumber = Two | Three | Four | Five | Six | Seven | Eight | Nine | Ten
type cardModifier = Trap | Wild | Bounce | Break
type cardFace = | ...cardNumber | ...cardModifier
type cardSuit = Form | Kin | Data | Chaos | Void | Choice
type card = {value: cardFace, suit: cardSuit}
type cards = array<card>
type defenderStack = {cards: cards, isFaceUp: bool}

type state = {
  attackerStacks: (cards, cards, cards, cards, cards, cards),
  defenderStacks: (
    defenderStack,
    defenderStack,
    defenderStack,
    defenderStack,
    defenderStack,
    defenderStack,
  ),
  laneDecks: (cards, cards, cards, cards, cards, cards),
  laneDiscardPiles: (cards, cards, cards, cards, cards, cards),
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

type cardOrCardFace = | ...card | ...cardFace

type lane = Zero | One | Two | Three | Four | Five

type laneOrAttackerDeck = | ...lane | AttackerDeck

type move =
  Draw({deck: laneOrAttackerDeck}) | Play({card: cardOrCardFace, lane: lane})

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

let getStatusMessage = (status: status) => switch status {
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
