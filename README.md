# ASSIST UTPAL 2X

Mobile-first 4-page AI assistant website.

## Pages
- `/` — Home
- `/chat.html` — AI Assistant + voice
- `/study.html` — Study Hub
- `/about.html` — About

## Run locally
1. Install Node.js 18+.
2. Run `npm install`
3. Copy `.env.example` to `.env`.
4. Put your API key in `.env`:
   `OPENAI_API_KEY=...`
5. Run `npm start`
6. Open `http://localhost:3000`

## Deploy
Use a Node.js hosting service that supports environment variables. Add `OPENAI_API_KEY` in the host's environment settings; do NOT commit `.env`.
