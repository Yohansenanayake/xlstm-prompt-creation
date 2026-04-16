# TOKEN_PROMPT — Music Prompt Extraction Tool

A web app for extracting REMIGEN token prompts from bar-delimited token files, using human-composed MIDI files as a reference for bar selection.

---

## Workflow

### Step 1 — Add Your Files

Place your files in two separate folders at the repo root:

- **MIDI files** → `midi_v3/` (`.mid` files, for listening and bar reference)
- **REMIGEN token files** → `tokens_v3/` (`.mid.txt` files, one per MIDI file)

Each token file should correspond to the MIDI file of the same name.

### Step 2 — Identify the Bar Range

1. Open the MIDI file in any MIDI player (e.g. GarageBand, MuseScore, FL Studio).
2. Listen and identify the portion you want to extract as a prompt.
3. Note the **left bar** (start) and **right bar** (end) positions.

### Step 3 — Extract the Prompt

1. Open the app in your browser at `http://localhost:3000`.
2. Browse to the token file corresponding to your MIDI file.
3. Enter the **left bar** and **right bar** positions.
4. Give the extracted prompt a name (e.g. `verse_intro.txt`).
5. Choose an output directory (e.g. `prompts_new/`).
6. Click **Extract** — the prompt file will be saved to your chosen directory.

---

## Starting the App

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)

### Install dependencies

```bash
cd music-prompt-app
npm install
```

### Run the server

```bash
npm start
```

The app will be available at `http://localhost:3000`.

---

## Repo Structure

```
TOKEN_PROMPT/
├── music-prompt-app/     # Web app (Node.js + Express)
│   ├── server.js
│   └── public/
├── midi_v1/              # MIDI files (batch 1)
├── midi_v2/              # MIDI files (batch 2)
├── tokens_v1/            # Token files (batch 1)
├── tokens_v2/            # Token files (batch 2)
└── prompts_new/          # Extracted prompts output
```

Add new batches as `midi_v3/`, `tokens_v3/`, etc.
