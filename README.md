# Mr. Handyman Verification Checklist

This project provides an interactive checklist to verify the Blue Star requirements for Mr. Handyman franchises. It captures routing, time frames, and configuration choices with local storage persistence, AI suggestions, cross-check tooling, and an environment preview summary.

## Getting started

You can run the checklist locally with any static file server. Two easy options are:

```bash
# Option 1: using Python (3.x)
python3 -m http.server 4173

# Option 2: using Node.js (via npx)
npx serve . -l 4173
```

Then open [http://localhost:4173/index.html](http://localhost:4173/index.html) in your browser.

## Environment preview

Select **Environment Preview** from the toolbar to review a read-only summary of the captured configuration. The preview aggregates task completion across sections and highlights items that still need attention, making it easy to share the current environment posture with stakeholders.
