# AI Feedback Studio

A beautifully crafted AI-powered writing feedback tool. Paste any text — email, product copy, resume, UX copy — and receive structured inline annotations with actionable suggestions.

## Features

- **Inline annotations** — highlights specific passages with color-coded severity
- **Progressive reveal** — annotations appear one by one as analysis completes
- **Accessibility-first** — full keyboard navigation, ARIA live regions, focus management
- **Confidence indicators** — each annotation shows AI confidence level
- **Design system** — components documented in Storybook

## Tech Stack

- React + TypeScript + Vite
- Framer Motion (animations)
- Node.js + Express
- Groq API (llama-3.1-8b-instant)
- Storybook 8

## Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env   # add your GROQ_API_KEY
npm run dev            # http://localhost:3002
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # http://localhost:5174
```

### Storybook
```bash
cd frontend
npm run storybook      # http://localhost:6006
```
