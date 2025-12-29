const steps = [
  {
    selector: '[data-tour="add-card"]',
    content:
      'Click here to create a new flashcard and begin building your study deck.',
  },
  {
    selector: '[data-tour="card-front"]',
    content:
      'Write the question or prompt on the front side, and the answer on the back side.',
    highlightedSelectors: [
      '[data-tour="card-front"]',
      '[data-tour="card-back"]',
    ],
  },
  {
    selector: '[data-tour="card-image"]',
    content:
      'Enhance your card by adding an image or audio clip for better recall.',
    highlightedSelectors: [
      '[data-tour="card-image"]',
      '[data-tour="card-audio"]',
    ],
  },
  {
    selector: '[data-tour="add-card-modal"]',
    content: 'Click here to save and add the flashcard to your deck.',
  },
  {
    selector: '[data-tour="display"]',
    content: 'Your card will appear here when it’s time to review.',
  },
  {
    selector: '[data-tour="card-show"]',
    content: 'Click to reveal the answer side of the card.',
  },
  {
    selector: '[data-tour="card-again"]',
    content:
      "Choose 'Again' if you couldn’t recall the answer. The card will repeat sooner, restarting the review cycle.",
  },
  {
    selector: '[data-tour="card-good"]',
    content:
      "Choose 'Good' if you remembered correctly. The card will reappear later, following spaced repetition (5s → 25s → 2m → 10m → 1h → 5h → 1d).",
  },
  {
    selector: '[data-tour="toggle-notifications"]',
    content:
      'Enable notifications to get reminders when new cards are ready for review.',
  },
  {
    selector: '[data-tour="view-cards"]',
    content:
      'Browse all the flashcards you’ve added and track your progress here.',
  },
  {
    selector: '[data-tour="view-cards"]', // dummy step
    content:
      'Browse all the flashcards you’ve added and track your progress here.',
  },
  {
    selector: '[data-tour="card-remove"]',
    content: 'Remove cards you no longer need from your deck.',
  },
  {
    selector: '[data-tour="export"]',
    content: 'Export your cards to Anki or SuperMemo for long-term retention.',
  },
];

export default steps;
