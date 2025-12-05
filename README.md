# 📘 Short Term Memo

https://shorttermmemorization.web.app/

Short Term Memo is a lightweight memorization tool designed to help you **quickly memorize information for short-term use**. It leverages the principles of [spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition) to optimize recall speed and efficiency.

---

## ✨ Features

- 🧠 **Spaced Repetition Engine**  
  Uses rapid intervals to reinforce memory:
    - 5 seconds → 25 seconds → 2 minutes → 10 minutes → 1 hour → 5 hours → 1 day

- 🎴 **Digital Flashcards**
    - Each card has a **front (question)** and **back (answer)**.
    - Supports **text, images, and audio** for richer memorization.

- 🔔 **Smart Notifications**
    - The app **notifies you when a card is available to review**.
    - Keeps you on track with the spaced repetition schedule without needing to check manually.

- 🔄 **Adaptive Review Flow**
    - ✅ Correct answer → card reappears after the next interval.
    - ❌ Incorrect answer → card reappears after the previous interval.

- 📤 **Export Options**
    - Export decks as **SuperMemo XML** format.
    - Export decks as **Anki CSV** format.

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18)
- Vite
- Firebase (for hosting and storage)

### Installation
```bash
git clone https://github.com/mertserezli/ShortTermMemorization
cd short-term-memo
npm install
npm run dev
```

## 🧩 Usage
- Create flashcards with text, images, or audio.
- Start a memorization session.
- Answer prompts:
- ✅ Correct → next interval.
- ❌ Incorrect → previous interval.
- Get notified when a card is ready to review.
- Export your deck:
  - anki_cards.csv for Anki.
  - supermemoItems.xml for SuperMemo.

## 🛠 Tech Stack
- ⚛️ React + Vite
- 🔥 Firebase (storage + hosting)
- 📚 JSZip for export packaging
- 🎨 Material UI for interface design
- 🔔 Browser Notifications API for reminders

## 🙌 Contributing
Pull requests are welcome!
For major changes, please open an issue first to discuss what you’d like to change.
