# Mr. Handyman Best Practices Checklist

This repository contains a single-page, self-contained HTML application that helps franchise teams verify Mr. Handyman call routing, time frame, and configuration requirements. The checklist persists progress in the browser so work can pause and resume without losing context.

## Deploy on GitHub Pages

1. Push this repository to GitHub.
2. Open the repository **Settings → Pages** configuration.
3. Choose the `main` branch and set the publishing source to the **root** directory.
4. Save the settings. GitHub Pages will publish the site at `https://<your-username>.github.io/<repository-name>/`.

Because the app is a standalone `index.html` file (with embedded CSS and JavaScript), no build step or additional assets are required for deployment.

## Preview locally

Open `index.html` in any modern browser. For example, on macOS you can run:

```bash
open index.html
```

Or serve it through a lightweight static server:

```bash
python -m http.server 8000
```

Then browse to [http://localhost:8000](http://localhost:8000).

## Features

- **Interactive checklist:** Track completion across best-practice sections, with progress saved locally.
- **AI suggestions:** Launch ChatGPT from each section for quick follow-up guidance.
- **Cross-check tools:** Highlight missing information and surface insight callouts while you work.
- **Environment preview:** Generate a read-only summary for sharing and verification reviews.
- **Shareable links:** Encode checklist progress into a URL so teammates can load the same state instantly.
- **Demo overlay:** Showcase a guided walkthrough without affecting saved progress.

## License

This project is provided for internal franchise enablement and does not include a specific open-source license.
