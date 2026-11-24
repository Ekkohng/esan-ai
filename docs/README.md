# Esan AI website

The project website: the story of Esan AI (vision, goals, progress), esantop, and a "Talk to Esan AI" chat box.
Plain HTML, CSS and JavaScript with no build step, served by GitHub Pages from this `docs/` folder at
**https://ekkohng.github.io/esan-ai/**.

| File | What it is |
|---|---|
| `index.html` | The page (styles inline) |
| `app.js` | Theme switch, phone menu, scroll story, chat |
| `config.js` | **Settings:** the chat API URL |
| `favicon.svg` | Tab icon |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

## Turn on GitHub Pages (once)

Repository → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder: **`/docs`** → Save.
After a minute or two the site is live at https://ekkohng.github.io/esan-ai/.

## Turn on the live chat

Until `config.js` has a URL, the chat answers in **preview** mode with sample answers.

1. Deploy the Esan AI chat Azure Function (see its README).
2. In the Function App settings, set `ALLOWED_ORIGINS=https://ekkohng.github.io`. That's the origin only, with no `/esan-ai` path.
3. In `docs/config.js`, set `window.ESAN_CHAT_API = "https://<your-function-app>.azurewebsites.net/api/chat";`
4. Commit to `main`. The chat bar switches from "preview" to "live".

## Editing

- Update the **Progress** list in `index.html` (`<ol class="plist">`) as milestones land.
- The chat's preview answers are in `app.js` (`previewReply`).
- Light/dark theme follows the visitor's device and remembers their choice. Scroll scenes switch off when "reduce motion" is on.
