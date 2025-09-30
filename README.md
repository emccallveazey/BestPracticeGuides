# Mr. Handyman Best Practices Checklist

This repository contains an interactive checklist that guides franchise teams through the Mr. Handyman best practices for call routing, time frames, and required configuration. The app ships as static HTML, CSS, and JavaScript so it can run entirely in the browser while persisting progress locally.

## Run it from GitHub Pages

1. Commit this repository to GitHub.
2. Open the repository **Settings → Pages** configuration.
3. Choose the `main` branch and set the publishing source to the `/docs` folder.
4. Save the settings. GitHub Pages will build and host the interactive checklist at `https://<your-username>.github.io/<repository-name>/`.

The `docs/` directory already includes the fully interactive experience—once Pages is enabled, stakeholders can visit the published URL and start using the checklist immediately.

## Run on Replit

You can deploy the checklist to a free [Replit](https://replit.com/) workspace for teams that prefer a hosted, always-on preview:

1. Create a new Replit project and import this GitHub repository.
2. Replit will detect the included `.replit`, `replit.nix`, and `package.json` files and automatically install Node.js plus the dependencies the first time it runs.
3. When the install finishes, the repl launches `http-server` on port 3000 and exposes the interactive checklist at the public Replit URL.

Any time you push new commits, use Replit’s **Pull latest** button to refresh the deployment.

## Preview locally

You can also open the checklist directly from the filesystem or serve it through any static web server. For example, with Python installed:

```bash
python -m http.server --directory docs 8000
```

Then browse to [http://localhost:8000](http://localhost:8000) to use the checklist.

## Environment preview

Select **Environment Preview** inside the app to review a read-only summary of the captured configuration. The preview aggregates task completion across sections and highlights items that still need attention, making it easy to share the current environment posture with stakeholders.

## Share a saved checklist

When you’re ready to hand progress to another teammate, choose **Share Progress Link**. The app will generate a unique URL that captures the current checklist selections. Copy or share the link so others can load the same state instantly—once opened, the shared progress is stored locally on their device so they can continue working.

## AI guidance and walkthrough

Each section’s **AI Suggestions** link opens ChatGPT in a new tab so you can ask follow-up questions or craft implementation notes. The **Mr.Handyman Best Practies Checklist** button loads a guided walkthrough with sample data so you can highlight progress tracking, cross-checks, sharing, and previews during live presentations. End the demo at any time to return to your saved progress.
