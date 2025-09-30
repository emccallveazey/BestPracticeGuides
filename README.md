# Mr. Handyman Verification Checklist

This project provides an interactive checklist to verify the Blue Star requirements for Mr. Handyman franchises. It captures routing, time frames, and configuration choices with local storage persistence, AI suggestions, cross-check tooling, and an environment preview summary.

## Getting started

You can now run the checklist locally with a single command thanks to the included development server.

```bash
npm install
npm start
```

This spins up `lite-server` on [http://localhost:4173](http://localhost:4173) and automatically reloads the page when you make edits
to the files inside the `public/` directory.

If you prefer not to install dependencies, any static file server pointed at `public/` will work as well.

## Environment preview

Select **Environment Preview** from the toolbar to review a read-only summary of the captured configuration. The preview aggregates task completion across sections and highlights items that still need attention, making it easy to share the current environment posture with stakeholders.
