# Breaking the Cycle Through Conscious Choice

An interactive, scenario-based learning website that helps young people in Nepal practice **conscious decision‑making** around corruption, social conformity, fatalism, and civic responsibility.

This repository contains the JSON‑driven site with **70 scenarios across 7 interconnected modules** (10 scenarios per module).

---

## Table of Contents

- [Overview](#overview)
- [Key Learning Goals](#key-learning-goals)
- [Features](#features)
- [Site Architecture](#site-architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Getting Started (Local Development)](#getting-started-local-development)
- [Data & Content Model](#data--content-model)
- [Interaction & Accessibility](#interaction--accessibility)
- [Deployment (GitHub Pages)](#deployment-github-pages)
- [Author](#author)
- [Acknowledgements](#acknowledgements)
- [License](#license)

---

## Overview

> **Breaking the Cycle Through Conscious Choice** is a web-based educational game designed as a Signature Work project at Duke Kunshan University.

Each module presents realistic Nepali scenarios where the user chooses how to respond, receives immediate feedback, and sees curated resources (articles, papers, videos) to go deeper.

The 7 modules cover:

1. Critical Thinking & Decision Making  
2. Governance & Civic Responsibility  
3. Self‑Reliance & Achievement Orientation  
4. Social Conformity & Individual Agency  
5. Ethics & Integrity  
6. Cultural Balance & Open‑mindedness  
7. Personal Development & Well‑being

---

## Key Learning Goals

The site aims to help learners in Nepal:

- Recognize how **everyday choices** sustain or disrupt systems like chakari, clientelism, and normalization of corruption.
- Practice **critical thinking** under social pressure, misinformation, and authority influence.
- Build **agency and self‑reliance**, countering fatalistic narratives (“ke garne” mindsets).
- Strengthen **ethical reflexes** in gray‑area situations (nepotism, bribes, shortcuts).
- Balance **cultural identity** with openness to pluralism, diversity, and change.

---

## Features

- **70 scenario-based questions** across 7 thematic modules (10 per module), each with:
  - A realistic, Nepal‑specific scenario.
  - 4 answer options with clearly labeled “best answer” and constructive feedback for all options.
  - “Learn More” links to credible sources (research articles, opinion pieces, institutional resources).

- **Modern single‑page module flow**
  - One generic `module.html` powers all 7 modules, selected via `?id=1..7`.
  - Progress bar and “Question X of Y” indicator.

- **Randomized answer options**
  - Options are shuffled on each page load, so learners must read and think, not memorize positions.

- **Immediate feedback**
  - Clicking an option reveals tailored feedback explaining why it is or isn’t the best response.

- **Accessibility‑aware interactions**
  - Keyboard navigation for options (arrows + Enter/Space).
  - Nudge alerts if a learner clicks “Next Question” or “Complete Module” without selecting an option.

- **Strong visual identity**
  - Color palette inspired by the **Nepali flag** (red and blue) plus gold highlights.
  - Consistent typography and layout for homepage and modules.

---

## Site Architecture

The new site uses a **data‑driven architecture**:

- `index.html`  
  - Static shell for the homepage (hero, philosophy, modules list, about, footer).  
  - All content injected via JavaScript from `data/site.json` and `data/module*.json`.

- `module.html`  
  - Single template for all seven modules, selected by URL parameter `?id=N`.  
  - JavaScript loads `data/moduleN.json` and renders all questions for that module.

- `script.js`  
  - Detects whether it’s on `index.html` or `module.html`.  
  - On `index.html`:
    - Loads `data/site.json` and all `data/module*.json` to populate the hero, philosophy cards, module cards, about section, and footer.
  - On `module.html`:
    - Reads `id` from the URL.
    - Loads the corresponding JSON module file.
    - Renders questions, options, feedback, resources, navigation buttons, and completion card.
    - Manages progress and accessibility behavior.

- `styles.css`  
  - Shared stylesheet for homepage and modules with Nepali‑inspired color system and responsive layout.

---

## Project Structure

A typical layout for this repo:

```text
.
├── index.html
├── module.html
├── styles.css
├── script.js
└── data/
    ├── site.json
    ├── module1.json
    ├── module2.json
    ├── module3.json
    ├── module4.json
    ├── module5.json
    ├── module6.json
    └── module7.json
```

- **`index.html`** – Homepage shell; all text filled in by `script.js` using `site.json` and module JSONs.
- **`module.html`** – Generic module view; content depends on `?id=N`.
- **`data/site.json`** – Site‑wide text:
  - Site name, hero text, philosophy cards, about paragraphs, and footer text.
- **`data/moduleN.json`** – Content for each module:
  - Module title, subtitle, description.
  - Completion message and key learnings.
  - Array of 10 questions with scenario, options, feedback, and resources.

---

## Technology Stack

- **HTML5** – Semantic structure for pages and modules.
- **CSS3** – Custom responsive design; no external frameworks.
- **Vanilla JavaScript (ES6)** –  
  - Dynamic content loading from JSON.  
  - Option randomization and feedback logic.  
  - Keyboard navigation and simple ARIA attributes.
- **No backend** – The site is fully static and can be hosted via GitHub Pages or any static file host.

---

## Getting Started (Local Development)

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari).
- Any static file server:
  - **Recommended**: VS Code + “Live Server” extension.
  - Alternatives: `npx serve`, Python `http.server`, etc.

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd <your-repo>
   ```

2. **Run a local server**

   Using VS Code + Live Server:
   - Open the folder in VS Code.
   - Right‑click `index.html` → “Open with Live Server”.

   Or using Node’s `serve`:

   ```bash
   npx serve
   ```

3. **Open the site**

   - Visit the URL provided by your server (often `http://localhost:5500` or `http://localhost:3000`).
   - The homepage should load with real text instead of “Loading…”.
   - Click a module card to go to `module.html?id=1` (or another ID).

---

## Data & Content Model

### `site.json`

Holds all homepage and global text, for example:

- `hero` – title, tagline, paragraphs, and CTA text/link.  
- `philosophy` – section title and 3–4 cards explaining the purpose.  
- `modules` – overview text shown above the module grid.  
- `about` – paragraphs describing the Signature Work project and meta lines (content count, format, resources).  
- `footer` – footer text.

### `moduleN.json`

Each module file typically includes:

- `id` – module number (1–7).
- `title`, `subtitle`, `description`.
- `completionMessage` – text for the completion card.
- `questions` – an array of 10 questions; each question includes:
  - `title` – short label (e.g., “The Viral Health Claim”).
  - `scenario` – 1–3 paragraphs describing the situation.
  - `question` – direct question (e.g., “What is your best approach?”).
  - `options` – array of answer choices:
    - `text` – visible answer text.
    - `correct` – boolean.
    - `feedback` – explanation for that specific choice.
  - `resources` – array of `{ "title": "...", "url": "..." }` links.

The JavaScript shuffles the `options` per question, then labels them visually as A/B/C/D according to display order, not hard‑coded letters.

---

## Interaction & Accessibility

Key interaction and accessibility features:

- **Click‑to‑reveal feedback**
  - Clicking an option highlights it, shows its feedback block, and visually distinguishes correct vs. incorrect responses.

- **Progress tracking**
  - Progress bar grows as the learner advances through questions.
  - “Question X of Y” updates dynamically.

- **Validation nudge**
  - If the learner clicks “Next Question” or “Complete Module” without selecting an option:
    - A small alert appears (“You haven’t selected anything yet…”), preventing accidental skipping.

- **Keyboard support**
  - **Tab** navigates between links, buttons, and options.
  - When an option is focused:
    - Arrow Up/Left: move to previous option.
    - Arrow Down/Right: move to next option.
    - Enter or Space: select the option (same behavior as click).
  - When a new question is shown, the first option is auto‑focused to support keyboard users.

- **Completion card**
  - After the final question with a valid selection, the module hides questions, fills the progress bar, and shows a completion card summarizing key learnings and linking to the next module or back to modules.

---

## Deployment (GitHub Pages)

You can host this site directly from GitHub Pages:

1. Push this repository to GitHub.
2. In your GitHub repository settings:
   - Go to **Settings → Pages**.
   - Set **Source** to `main` branch and `/ (root)` folder.
3. Save and wait for GitHub Pages to build.
4. Your site will be available at:

   ```text
   https://<your-username>.github.io/<your-repo>/
   ```

Because everything is static and uses relative paths (`data/...`), no additional configuration is needed.

---

## Author

**Rabin Mahatara**  
- Undergraduate student at Duke Kunshan University.  
- This website is my **Signature Work** project, focusing on behavioral and civic transformation in Nepal through scenario‑based learning.

If you’re an educator, researcher, or student interested in adapting or extending this project (for other countries, topics, or age groups), feel free to reach out via:

- GitHub issues (for technical questions or bugs)
- Email: rabin.mahatara@duke.edu


---

## Acknowledgements

- **Professor Benjamin Bacon, other faculty mentors and reviewers** at Duke Kunshan University who provided guidance on civic education, behavioral design, and project framing.
- **Authors and organizations** whose articles and reports are linked as “Learn More” resources throughout the modules.
- The broader communities in Nepal whose lived experiences inform the scenarios and dilemmas presented here.

---

## License

  ```text
  © 2026 Rabin Mahatara. All rights reserved.
  ```
