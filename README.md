<h1><span style="color: green;">Cadence </span><span style="color: orange;">Beats</span></h1>

_A Supabase Hackathon project_

## Overview

Cadence Beats is an innovative app designed for athletes who want to sync their workout cadence with their music. By integrating **Strava** and **Spotify**, the app helps users create playlists based on their average running or cycling cadence. This project was built for the Supabase Hackathon and uses Supabase's authentication and database features to store user data securely.

## Features

- **Login with Spotify**: Users can log in to the app using their Spotify account, with scopes allowing playlist creation.
- **Connect Strava**: Users can connect their Strava accounts to retrieve their recent activities.
- **Select Activities**: Users can select which activities they want to use to calculate their average cadence
- **Cadence Calculation**: The system automatically calculates the user’s average cadence from their latest Strava activities.
- **Genre Selection**: Users can pick up to 5 genres from Spotify's available genres.
- **Playlist Generation**: The app fetches songs based on the user’s selected genres and cadence and generates a custom playlist that syncs with their workout rhythm.
- **Add to Spotify**: With the click of a button, users can save the playlist directly to their Spotify account.

## Tech Stack

- **Next.js 14**: For the frontend with the new app router.
- **Supabase**: Authentication, API routing, and database storage.
- **Spotify API**: For fetching music tracks and creating playlists.
- **Strava API**: For retrieving user activities and calculating cadence.
- **TypeScript**: Ensuring type safety across the project.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/verduijnt/cadence-beats.git
   ```
2. Install dependencies:
   ```bash
   cd cadence-beats
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root of your project and add your API keys and secrets:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_STRAVA_CLIENT_ID=your-strava-client-id
   NEXT_PUBLIC_STRAVA_CLIENT_SECRET=your-strava-client-secret
   NEXT_PUBLIC_STRAVA_REDIRECT_URI=your-strava-callback-url
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Access the app at `http://localhost:3000`.

## How It Works

1. **Login with Spotify**: Users log in using Spotify OAuth, with scopes for creating playlists.
2. **Connect Strava**: After logging in, users connect their Strava account to retrieve recent activities.
3. **Select Activities**: Users can select which activities they want to use to calculate their average cadence
4. **Select Genres**: The user selects up to 5 music genres.
5. **Playlist Generation**: The system calculates the average cadence from the user’s activities and fetches songs based on their cadence and selected genres.
6. **Create Playlist**: The user can review the playlist and create it directly in their Spotify account.

## License

This project is licensed under the MIT License.
