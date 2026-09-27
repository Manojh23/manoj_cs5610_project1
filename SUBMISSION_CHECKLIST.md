# Project 1 — Submission Checklist

Items marked **manual** cannot be verified from source only.

## Design document

- [x] `design/design.md` includes project description.
- [x] `design/design.md` includes user personas.
- [x] `design/design.md` includes user stories.
- [x] `design/design.md` includes design mockups.

## Homepage & content

- [x] Homepage introduces me and includes meaningful education, coding activity, and skills information.
- [x] Original component that differentiates the page (typing hero animation + live GitHub/LeetCode calendars with year selector).

## Pages

- [x] Three HTML pages: `index.html`, `projects.html`, `explore.html`.
- [x] Each page has distinct URL and consistent navigation.

## Structure & assets

- [x] CSS, JavaScript, and images live in separate folders (`css/`, `js/`, `assets/images/`).
- [x] Every image has an `alt` attribute.
- [x] Every page has `<meta name="author">`, `<meta name="description">`, and a favicon link.
- [x] Only real semantic HTML elements are used for interactive controls (`<button>`, `<a>`).
- [x] `package.json` sets `"type": "module"` and every script tag uses `type="module"`.

## Style & code quality

- [x] Original vanilla JS features longer than five lines (typing animation, GitHub calendar renderer, LeetCode calendar renderer, research constellation, thought-experiments navigator, idea generator).
- [x] CSS uses Grid and Flexbox.
- [x] No `!important` in any stylesheet.
- [x] Classes are used to identify elements.
- [x] Formatted with Prettier (`npm run format`).
- [x] Passes ESLint (`npm run lint`) using the class-provided `eslint.config.js`.

## Repository files

- [x] `package.json` lists all dev dependencies.
- [x] MIT `LICENSE` file present.
- [x] README includes author, class link placeholder, project objective, screenshot, and run instructions.
- [x] README contains a GenAI disclosure section.

## Manual (do before submitting)

- [ ] Deploy to a public GitHub Pages URL.
- [ ] Validate every deployed page at <https://validator.w3.org/>.
- [ ] Record and publish the narrated demo video, add URL to README.
- [ ] Replace the class-link placeholder in README with the real URL.
- [ ] Take a fresh homepage screenshot and replace `assets/images/homepage-screenshot.png`.
- [ ] Complete the Google Form (public site URL + video URL + thumbnail).
- [ ] Complete the course code-review process.

## Final local commands

```bash
npm install
npm run format
npm run check
```
