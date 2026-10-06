# MediScanAI – Automated Disease Detection & Multilingual Voice Diagnostic System

MediScanAI is an intelligent medical imaging diagnostic application built with deep learning explainability (Grad-CAM heatmaps), clinician review workflows, and a multilingual AI voice assistant supporting **Kannada (ಕನ್ನಡ)**, English, Hindi, Spanish, French, German, Mandarin, Portuguese, and Arabic.

---

## 🚀 Running in Visual Studio Code (VS Code)

This project is pre-configured for a frictionless **out-of-the-box experience in VS Code**.

### Prerequisites
- [Node.js](https://nodejs.org/) (version **18.x**, **20.x**, or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- [Visual Studio Code](https://code.visualstudio.com/)

---

### Step-by-Step VS Code Setup

#### 1. Open the project in VS Code
Open VS Code, choose **File > Open Folder...**, and select this project directory. Or from your terminal:
```bash
code .
```

#### 2. Install Dependencies
Open the VS Code integrated terminal (`Ctrl + \`` on Windows/Linux or `Cmd + \`` on macOS) and run:
```bash
npm install
```

#### 3. (Optional) Configure Environment Variables
Copy the example environment configuration:
- **macOS / Linux**:
  ```bash
  cp .env.example .env
  ```
- **Windows (PowerShell)**:
  ```powershell
  Copy-Item .env.example .env
  ```

> **Note**: MediScanAI contains a built-in diagnostic inference engine and synthetic fallback. You can run and test all features without an API key immediately. If you wish to enable live Gemini AI vision analysis and chat, simply add your key into `.env`:
> ```env
> GEMINI_API_KEY="your-gemini-api-key-here"
> PORT=3000
> ```

---

### 🎮 Running the Application in VS Code

You can run MediScanAI using either of the two methods below:

#### Method A: One-Click Debugging (F5) — Recommended
1. Switch to the **Run and Debug** view in VS Code (`Ctrl + Shift + D` or `Cmd + Shift + D`).
2. Select **"MediScanAI: Dev Server (npm run dev)"** or **"MediScanAI: Full-Stack (Server + Browser)"** from the dropdown.
3. Press `F5` (or click the green Play button).
4. Breakpoints set inside `server.ts` or `server/**/*.ts` will trigger automatically!

#### Method B: Integrated Terminal
1. Open the integrated terminal (`Ctrl + \`` or `Cmd + \``).
2. Run:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🛠️ Included VS Code Configurations

This repository comes with pre-configured `.vscode/` setup files:

| File | Purpose |
| :--- | :--- |
| **`.vscode/launch.json`** | Debugging configurations for Dev Server, tsx server debug, Chrome browser launch, and Full-Stack compound debugging. |
| **`.vscode/tasks.json`** | VS Code Tasks for `dev`, `build` (Default Build Task `Ctrl+Shift+B`), `lint`, and `install`. |
| **`.vscode/settings.json`** | Uses the workspace TypeScript compiler, auto-formats on save, enables Tailwind CSS IntelliSense, and organizes file nesting. |
| **`.vscode/extensions.json`** | Recommends Tailwind CSS IntelliSense, ESLint, Prettier, and JavaScript Debugger. |

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Express server with Vite middleware and Hot Module Replacement (HMR). |
| `npm run build` | Bundles the Vite frontend and compiles the Node.js server with esbuild for production. |
| `npm run start` | Serves the production build from `dist/`. |
| `npm run lint` | Runs TypeScript type-checking without emitting output files (`tsc --noEmit`). |
| `npm run typecheck` | Alias for `npm run lint`. |
| `npm run clean` | Cross-platform cleanup of build artifacts (`dist/` and `server.js`). |

---

## 🌍 Multilingual Voice Assistant & Kannada Support

MediScanAI supports native multilingual interfaces and speech:
- **Language Switcher**: Switch instantly between **English**, **Kannada (ಕನ್ನಡ)**, **Hindi (हिन्दी)**, **Spanish**, **French**, **German**, **Mandarin**, **Portuguese**, and **Arabic** from the top header navigation.
- **Audio Diagnostic Briefing**: Click the speaker button on any scan result to listen to a full synthetic vocal report in your selected language (including **Kannada**).
- **Voice Chatbot**: Tap the microphone button in the medical assistant drawer to dictate questions verbally via Web Speech Recognition (`kn-IN`), with text-to-speech audio responses.

---

## 📂 Project Structure

```
├── .vscode/               # VS Code configuration (debug, tasks, settings, extensions)
├── server/                # Backend API & AI logic
│   ├── db.ts              # In-memory medical database, clinical cases & audit logs
│   ├── gemini.ts          # Gemini Vision & Chatbot integration + synthetic fallback
│   └── models.ts          # AI modality architectures & model registry
├── src/                   # React frontend application
│   ├── components/        # UI components (Upload, ResultView, ChatbotDrawer, Heatmap, etc.)
│   ├── utils/             # i18n localization dictionary, speech utils & audio synthesis
│   ├── App.tsx            # Root application router and layout
│   └── index.css          # Tailwind CSS styles
├── server.ts              # Express + Vite full-stack entrypoint
├── vite.config.ts         # Vite bundler configuration
├── package.json           # Scripts and dependencies
└── .env.example           # Environment template
```

---

## ❓ Troubleshooting

- **Port 3000 already in use**:
  Set an alternative port via environment variable:
  ```bash
  PORT=3001 npm run dev
  ```
  Or change `PORT=3000` in your `.env` file.

- **Microphone / Speech Recognition in Chrome/Edge**:
  Speech-to-text requires microphone permissions. Allow microphone access when prompted by the browser at `http://localhost:3000`.
