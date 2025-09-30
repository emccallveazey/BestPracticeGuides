# Mr. Handyman Best Practices Checklist

This project provides an interactive checklist to document Mr. Handyman best practices for franchise call flows. It captures routing, time frames, and configuration choices with local storage persistence, AI suggestions, cross-check tooling, and an environment preview summary.

## Getting started

The project now runs as a desktop application powered by Electron so franchise teams can launch the checklist locally without a browser or additional hosting.

```bash
npm install
npm start
```

`npm start` opens the desktop window and automatically serves the interactive checklist inside a bundled Chromium runtime.

For web-based development or quick previews you can still use the lightweight development server:

```bash
npm run dev
```

This spins up `lite-server` on [http://localhost:4173](http://localhost:4173) and automatically reloads the page when you make edits to the files inside the `public/` directory.

## Environment preview

Select **Environment Preview** from the toolbar to review a read-only summary of the captured configuration. The preview aggregates task completion across sections and highlights items that still need attention, making it easy to share the current environment posture with stakeholders.
