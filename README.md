# College Football Pick'em

A simple web app for making weekly college football picks. Users can sign up, submit predictions for each game, and track their standings over the course of the season.

## Tech Stack

- **React** with **Vite** for the frontend
- **Supabase** for the database and authentication
- Deployed to **GitHub Pages**

## Features

- Email/password authentication
- Weekly game list with pick submission
- Score tracking and leaderboards
- Yearly prediction support

## Local Development

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and provide your Supabase project credentials.
3. Start the dev server
   ```bash
   npm run dev
   ```

## Deployment (GitHub Pages)

1. In `vite.config.js`, set the `base` option to the repository name (e.g. `/Core10-Pickem/`).
2. Build the project
   ```bash
   npm run build
   ```
3. Deploy the contents of the `dist` directory to the `gh-pages` branch or configure a GitHub Action to publish the site.

## Project Structure

```
src/
  components/   reusable UI components
  pages/        route level pages (WeekGames, Leaderboard, YearlyPicks)
  functions/    Edge or server functions
  lib/          Supabase client and utilities
```

The `supabase/` folder contains the SQL schema used by this app.
