# Codemitra Quiz UI

A minimal, accessible, responsive quiz app for students. No frameworks, no build step—just open `index.html` in your browser.

## How to run locally

1. **Clone or download this repo.**
2. **Open `index.html` in your browser.**
   - No server required. All data is loaded from static files.
   - For best results, use Chrome, Firefox, or Edge.

## Project structure

- `index.html` — Main entry point
- `style.css` — App styles (Coded with Codemitra palette)
- `script.js` — App logic (modular, accessible, no frameworks)
- `data/` — Place your module and quiz JSON files here
  - `modules.json` — List of available modules
  - `module_quiz-*.json` — Quiz data for each module
- `images/` — Place images for options or use the provided `placeholder.png`

## Adding modules/quizzes

1. Add your quiz JSON (see format below) to `data/module_quiz-2.json`, etc.
2. Add an entry to `data/modules.json`:
   ```json
   {
     "id": "module2",
     "title": "Your Module Title",
     "description": "Short description.",
     "quiz_url": "/data/module_quiz-2.json"
   }
   ```
3. Optionally, add images to `images/` and reference them in your quiz JSON as `option_images`.

## Quiz JSON format

Each quiz file must have:
```json
{
  "multiple_choice": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "explanation": "...",
      "option_images": ["/images/optionA.png", ...] // optional
    }
  ],
  "true_false": [
    {
      "question": "...",
      "options": ["True", "False"],
      "answer": "True",
      "explanation": "..."
    }
  ]
}
```

## Switching to a real backend

- In `script.js`, change:
  ```js
  const apiBase = 'http://localhost:5000';
  ```
- Replace the `generateOptionImageStub` function with a real API call:
  ```js
  async function generateOptionImage(optionText) {
    const res = await fetch(apiBase + '/api/generate_option_image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionText, student: testStudent })
    });
    const data = await res.json();
    return data.image_url;
  }
  ```
- Sample request:
  ```json
  { "optionText": "Paris", "student": { "grade": "middle", "locale": "en-IN" } }
  ```
- Sample response:
  ```json
  { "image_url": "/images/generated/paris.png" }
  ```

## Caching & rate-limiting

- The app caches generated option images in `localStorage` (keyed by module, question, and option text).
- If using a real backend, ensure you implement rate-limiting and cache results on the server to avoid excessive image generation requests.

## Accessibility & keyboard support

- All interactive elements are keyboard accessible.
- Options use `role="radiogroup"` and `role="radio"`.
- Progress bar uses `role="progressbar"` and ARIA attributes.
- Focus is managed for smooth navigation.

---

For any issues or suggestions, please open an issue or PR.
