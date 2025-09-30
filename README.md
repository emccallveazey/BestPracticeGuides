# Mr. Handyman Best Practices Checklist

This repository contains an interactive checklist that guides franchise teams through the Mr. Handyman best practices for call routing, time frames, and required configuration. The app ships as static HTML, CSS, and JavaScript so it can run entirely in the browser while persisting progress locally.

## Run it from GitHub Pages

1. Commit this repository to GitHub.
2. Open the repository **Settings → Pages** configuration.
3. Choose the `main` branch and set the publishing source to the `/docs` folder.
4. Save the settings. GitHub Pages will build and host the interactive checklist at `https://<your-username>.github.io/<repository-name>/`.

The `docs/` directory already includes the fully interactive experience—once Pages is enabled, stakeholders can visit the published URL and start using the checklist immediately.

## Preview locally

You can also open the checklist directly from the filesystem or serve it through any static web server. For example, with Python installed:

```bash
python -m http.server --directory docs 8000
```

Then browse to [http://localhost:8000](http://localhost:8000) to use the checklist.

## Environment preview

Select **Environment Preview** inside the app to review a read-only summary of the captured configuration. The preview aggregates task completion across sections and highlights items that still need attention, making it easy to share the current environment posture with stakeholders.

## Closing checklist responses

The **User 300 Routing** section now includes a structured closing checklist so you can record installation sign-off answers (Yes / N/A / No) along with notes about why items are still pending. These responses are saved locally, reflected in the live preview, and included when you generate a shareable link.

## Share a saved checklist

When you’re ready to hand progress to another teammate, choose **Share Progress Link**. The app will generate a unique URL that captures the current checklist selections. Copy or share the link so others can load the same state instantly—once opened, the shared progress is stored locally on their device so they can continue working.

## AI guidance and interactive demo

Each section’s **AI Suggestions** link opens ChatGPT in a new tab so you can ask follow-up questions or craft implementation notes. The **Interactive Demo** control launches a fresh copy of the checklist in another tab so you can share the experience or reset quickly for training sessions.
