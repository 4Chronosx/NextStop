# NextStop

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<div align="center">
	<img src="src/assets/Logo.png" alt="NextStop Logo" width="160" />
	<p>
		A smart travel itinerary planner that combines manual trip building, AI-assisted planning,
		and map-based route visualization in one workflow.
	</p>
	<p>
		<a href="#"><img alt="Status" src="https://img.shields.io/badge/status-Beta-yellow?style=flat" /></a>
		<a href="https://github.com/4Chronosx/NextStop/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/4Chronosx/NextStop?style=flat" /></a>
	</p>
	<p>
		<a href="https://github.com/4Chronosx/NextStop/issues/new?labels=bug">Report Bug</a>
		&middot;
		<a href="https://github.com/4Chronosx/NextStop/issues/new?labels=enhancement">Request Feature</a>
	</p>
</div>

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Documentation](#documentation)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Contributing](#contributing)
7. [License](#license)

---

## Project Overview

**NextStop** is a React + TypeScript web app for planning trips from idea to execution.

It supports both:

- **Manual itinerary planning** with calendar-based day ranges and activity management.
- **AI itinerary generation** through a guided chat flow that returns structured multi-day plans.

### Why NextStop?

Most travel planners split planning across many tools. NextStop centralizes the flow:

- Build or edit itineraries by day.
- Generate plans with AI when you want a faster starting point.
- Review activities in timeline cards.
- Visualize stops and routes on Google Maps with travel mode options.

### Core Features

- **Manual Itinerary Builder:** Create trip title, date range, and day-by-day activities.
- **AI Planner Chat:** Gather preferences and generate itinerary JSON that can be saved and viewed.
- **Route and Map View:** Render markers/routes, switch travel modes, and inspect route details.
- **Saved Itinerary Experience:** Persist itineraries in browser storage and quickly search/view from the navbar.

---

## Tech Stack

<p align="left">
	<a href="https://react.dev/"><img alt="React" src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=222222&style=flat" /></a>
	<a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat" /></a>
	<a href="https://vitejs.dev/"><img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=flat" /></a>
	<a href="https://reactrouter.com/"><img alt="React Router" src="https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white&style=flat" /></a>
	<a href="https://developers.google.com/maps"><img alt="Google Maps API" src="https://img.shields.io/badge/Google_Maps_API-4285F4?logo=googlemaps&logoColor=white&style=flat" /></a>
	<a href="https://platform.openai.com/docs/"><img alt="OpenAI API" src="https://img.shields.io/badge/OpenAI_API-412991?logo=openai&logoColor=white&style=flat" /></a>
	<a href="https://mui.com/"><img alt="Material UI" src="https://img.shields.io/badge/Material_UI-007FFF?logo=mui&logoColor=white&style=flat" /></a>
	<a href="https://getbootstrap.com/"><img alt="Bootstrap" src="https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white&style=flat" /></a>
</p>

---

## Documentation

The project currently keeps implementation documentation close to source files. Useful entry points:

- `src/App.tsx` - Route definitions and Google Maps script bootstrap.
- `src/components/Pages/create-itinerary/page.tsx` - Manual itinerary creation/edit flow.
- `src/components/ui/Chatbox.tsx` - AI chat workflow and itinerary extraction.
- `src/components/google-maps/maps.tsx` - Map rendering, routing, and route details.
- `src/api/config.ts` - Runtime environment variable checks and API host/key wiring.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Clone the repository

```sh
git clone https://github.com/4Chronosx/NextStop.git
cd NextStop
```

2. Install dependencies

```sh
npm install
```

3. Configure environment variables

Create a `.env.local` file in the project root:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_OPENAI_BASE_URL=https://api.openai.com/v1/chat/completions
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Run the Application

```sh
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

- `npm run dev` - Start the Vite development server.
- `npm run build` - Type-check and build production assets.
- `npm run preview` - Preview the production build locally.
- `npm run lint` - Run ESLint checks.

---

## Project Structure

```text
nextStop/
|- public/                     # Static assets
|- src/
|  |- api/                     # API wrappers and Google Maps utilities
|  |- app/                     # IndexedDB helpers
|  |- components/
|  |  |- Pages/                # Route-level pages (home, create, AI, view)
|  |  |- google-maps/          # Map, nearby places, route details
|  |  |- ui/                   # Reusable UI building blocks
|  |- App.tsx                  # Main routing and app bootstrap
|  |- main.tsx                 # React entrypoint
|- package.json
|- vite.config.ts
```

---

## Contributing

Contributions are welcome.

1. Fork the project.
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m "Add some AmazingFeature"`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a pull request.

---

## License

No license file is currently included in this repository.
If you plan to distribute or accept external contributions, add a `LICENSE` file (for example MIT).

---

[contributors-shield]: https://img.shields.io/github/contributors/4Chronosx/NextStop.svg?style=for-the-badge
[contributors-url]: https://github.com/4Chronosx/NextStop/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/4Chronosx/NextStop.svg?style=for-the-badge
[forks-url]: https://github.com/4Chronosx/NextStop/network/members
[stars-shield]: https://img.shields.io/github/stars/4Chronosx/NextStop.svg?style=for-the-badge
[stars-url]: https://github.com/4Chronosx/NextStop/stargazers
[issues-shield]: https://img.shields.io/github/issues/4Chronosx/NextStop.svg?style=for-the-badge
[issues-url]: https://github.com/4Chronosx/NextStop/issues
