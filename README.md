# React & MERN Stack Interview Prep Guide 🚀

A comprehensive, dark-themed, and highly optimized interview preparation dashboard built with React and Vite. This application is designed specifically for Frontend and Full-Stack (MERN) Developers to master core concepts, architecture patterns, and system design optimizations.

## 🌟 Features

- **Personalized "My Prep" Dashboard**: Mark crucial questions as important/starred to revisit them easily before interviews.
- **Hidden "Ghost Mode"**: Publicly shareable Behavioral & HR section with generic answers, and also secured hidden DOB password lock to reveal my personalized answers.
- **Deep-Dive Concepts**:
  - React Core (Hooks, Reconciliation, Advanced Patterns).
  - Node.js & Express.js (Middleware, Authentication, Routing).
  - MongoDB (Commands, Database CLI, Aggregation).
  - WebSockets & Advanced System Design.
- **Modern UI/UX**: Fast, responsive, premium dark-mode focused UI with accessible code blocks, colored difficulty badges, and clean typography.
- **Intelligent Global Search**: Instant, fuzzy-search functionality across all available questions and topics.

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Pure Modern CSS (CSS Variables, Flexbox, Grid, Context-based UI)
- **Deployment**: GitHub Pages (via `gh-pages` module)
- **Code Highlighting**: `react-syntax-highlighter`

## 💻 Running Locally

To get the application up and running on your local machine:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Sriram-Dee/interview-prep-guide.git
   cd interview-prep-guide
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the Vite development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🚀 Deployment (GitHub Pages)

Deployment is pre-configured using the `gh-pages` package.

To deploy the application:

1. Ensure your remote GitHub repository is set.
2. Ensure the `homepage` URL in `package.json` is configured correctly (e.g., `https://Sriram-Dee.github.io/interview-prep-guide`).
3. Run the deployment command:
   ```bash
   npm run deploy
   ```

## 📂 Project Architecture

```text
interview-prep-guide/
├── src/
│   ├── components/
│   │   ├── layout/       # Sidebar, Hero, MobileNav
│   │   └── ui/           # QACard, TipCard, CodeBlock, SecretModal
│   ├── context/          # PersonalModeContext for hidden functionality
│   ├── data/             # Modularized question data (React, Node, Express, MongoDB)
│   ├── hooks/            # Custom hooks (useProgress, useImportant)
│   ├── styles/           # CSS Architecture (index.css)
│   ├── App.jsx           # Main application routing & logic
│   └── constants.js      # App configurations & navigation metadata
├── package.json
└── vite.config.js
```

---

_Built with ❤️ for cracking MERN Stack interviews._
