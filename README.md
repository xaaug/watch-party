# Watch Party - Synchronized YouTube Web Player

A web app that allows users to watch YouTube videos in sync with others (watch party) or across multiple devices. The project supports multi-user interactions with real-time video control, including play, pause, seek, and full-screen modes. The app syncs the video playback and enables users to enjoy synchronized experiences whether they’re in the same room or connected remotely.

## Features

- Watch Party: Watch YouTube videos together with friends in real-time.
- Multi-Device Sync: Sync video playback across multiple devices.
- Real-Time Controls: Pause, play, seek, and change the full-screen mode for all participants.
- Video Information: Fetch video title, description, and metadata using YouTube API.
- WebSocket Synchronization: Uses WebSockets to synchronize video states like play/pause and seek time across users.


## Technologies Used
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Express, WebSockets
- Database: Firebase
- Authentication: Firebase Auth
- APIs: YouTube Data API (for fetching video data)
- Real-Time Sync: Socket.IO (for real-time communication)