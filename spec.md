# Web Frontend Specification — Lemon Leaf Disease Diagnosis

**Scope:** This document covers only the web frontend. The backend, model, and data pipeline are specified separately. The frontend is built and shipped against a mocked API first, then wired to the real backend once it exists.

---

## 1. Goal

A responsive web app where a farmer can photograph a lemon leaf with their phone and get back, in a few seconds, a likely disease, a confidence score, the full probability distribution, and clear treatment advice — or a friendly "try again" if the image isn't usable.

**Primary device:** Android smartphones on 4G, held one-handed in bright outdoor light.
**Primary user:** smallholder lemon/lime farmers in Thailand. Reads Thai by default. May not be technically confident.

---

## 2. Pages and screens

The app is a single-page application with four main screens. Navigation is linear; back is always available.

### 2.1 Home

- App title and one-line tagline
- Big primary button: **"Diagnose a leaf"**
- Secondary button: **"History"** (disabled if empty)
- Language toggle (TH / EN) in the top corner
- A short "How it works" strip below the fold: three icons — *Snap a leaf · Get a diagnosis · Follow the steps*

### 2.2 Capture

- Live camera preview filling most of the screen
- Capture button (large, centered, thumb-reachable)
- "Upload from gallery" as a secondary action
- A faint leaf-shaped guide overlay so users know to frame a single leaf
- Tip text: *"Good light. One leaf. Plain background."*
- Cancel button returns to Home

### 2.3 Result

Three possible states, driven by `decision` from the API:

**Confident** (`decision = "confident"`)
- Thumbnail of the submitted image
- Predicted class as a headline (e.g. *Citrus Canker*)
- Confidence as a large percentage
- Probability bar chart showing all four classes, sorted descending
- Treatment card with: summary · immediate steps · treatment agents (agent / rate / interval) · when to escalate · safety notes
- Buttons: **Save to history** (default-on toggle), **Diagnose another**, **Share** (Web Share API where available)

**Uncertain** (`decision = "uncertain"`)
- Thumbnail
- Headline: *"We're not sure."*
- Show the full probability distribution so the user sees why
- Tips for a better photo (light, angle, single leaf, plain background)
- Buttons: **Retake**, **Diagnose another**
- No treatment card. This is intentional — confident-wrong is worse than honest-unsure.

**Invalid input** (`decision = "invalid_input"`)
- Headline: *"This doesn't look like a lemon leaf."*
- Sample-photo guide (3 small example images: good, too blurry, wrong subject)
- Buttons: **Retake**, **Back to home**

### 2.4 History

- List of past diagnoses, newest first, each row showing: thumbnail, date, predicted class, confidence
- Tap a row to open the original result screen with full treatment card
- Each row has a small delete (trash) action with a confirm step
- Empty state: friendly illustration + *"Your past diagnoses will appear here."*
- Header action: **Clear all** (with confirm)

History is stored locally in IndexedDB. No account, no cloud sync, no upload of historical images.

---

## 3. Component inventory

Build these as reusable components:

- `LanguageToggle` — TH/EN, persists choice in localStorage
- `PrimaryButton`, `SecondaryButton`, `IconButton`
- `CameraCapture` — wraps `getUserMedia`; falls back to a hidden `<input type="file" accept="image/*" capture="environment">`
- `LoadingState` — shown while the request is in flight; includes a "warming up" variant for cold-start backends
- `ResultCard` — renders any of the three result states based on a discriminated union prop
- `ProbabilityBars` — horizontal bar chart, one row per class, percentage labels
- `TreatmentCard` — structured rendering of the treatment object (§5.2)
- `HistoryList`, `HistoryRow`, `EmptyState`
- `ConfirmDialog` — used for delete and clear-all
- `ErrorBoundary` — top-level fallback for unexpected runtime errors
- `Toast` — success/error toasts (e.g. *"Saved to history"*)

---

## 4. User flows

**Happy path:** Home → Capture → loading → Result (confident) → Save → Home.

**Uncertain path:** Home → Capture → loading → Result (uncertain) → Retake → Capture → Result.

**Invalid path:** Home → Capture (or upload) → loading → Result (invalid) → Retake.

**History review:** Home → History → tap row → Result screen rendered from saved data → back to History.

**Network failure:** request fails or times out → toast: *"Couldn't reach the server. Check your connection and try again."* → user stays on Capture with the image preserved so they can retry without re-shooting.

---

## 5. API contract (frontend's view)

The frontend treats the backend as a single endpoint and codes against this contract. A mock implementation lives in the repo so the UI can be built and tested without the real backend.

### 5.1 Request

`POST /api/v1/diagnose`
- Content-Type: `multipart/form-data`
- Field: `image` — JPEG or PNG, max 8 MB

### 5.2 Response (200 OK)

```json
{
  "decision": "confident",
  "predicted_class": "citrus_canker",
  "confidence": 0.91,
  "distribution": {
    "citrus_canker": 0.91,
    "leaf_miner": 0.05,
    "nutrient_deficiency": 0.03,
    "healthy": 0.01
  },
  "treatment": {
    "class": "citrus_canker",
    "summary_th": "...",
    "summary_en": "Bacterial infection. Acts fast in warm, wet weather.",
    "immediate_steps": ["...", "..."],
    "treatment": [
      {
        "agent": "Copper hydroxide",
        "rate": "1.5–2.0 g/L (follow label)",
        "interval": "every 10–14 days during wet season",
        "notes": "Avoid spraying in midday sun."
      }
    ],
    "when_to_escalate": "...",
    "safety": ["...", "..."]
  },
  "model_version": "v1.0.0",
  "timestamp": "2026-05-06T09:12:33Z"
}
```

When `decision` is `"uncertain"` or `"invalid_input"`, the `treatment` field is `null` and the UI must not render a treatment card.

### 5.3 Error responses

- `400` — bad image (wrong type, too large, corrupt). UI shows a specific message.
- `429` — rate limited. UI shows: *"Too many requests. Please wait a moment."*
- `5xx` — generic server error. UI shows: *"Something went wrong on our side. Please try again."*

All errors include a JSON body `{ "error": "code", "message": "human readable" }`.

---

## 6. State management

- **Server state:** TanStack Query manages the diagnose request, its loading/error states, and retries.
- **UI state:** Zustand store for current image, current result, and language preference.
- **Persistent state:** IndexedDB (via `idb` library) for history; localStorage for language choice.

History record shape:

```ts
type HistoryRecord = {
  id: string;            // uuid
  createdAt: string;     // ISO timestamp
  thumbnailDataUrl: string;  // small JPEG, ~200px
  result: DiagnoseResponse;  // exactly the API response above
};
```

Thumbnails are downscaled client-side before saving to keep IndexedDB small. Original full-size images are never stored.

---

## 7. Internationalization

- Two locales at launch: **Thai (default)** and **English**.
- All user-visible strings live in `src/i18n/{th,en}.json`. No hardcoded strings in components.
- Treatment content (`summary_*`, `immediate_steps`, etc.) is returned by the API in both languages where applicable; the UI picks the active locale.
- Date/number formatting uses `Intl` with the active locale.
- Language toggle is reachable from every screen via the top bar.

---

## 8. Visual design direction

The aesthetic is calm, grounded, and trustworthy — not slick startup, not playful gamified. Think extension office signage rather than fintech dashboard.

- **Palette:** off-white background, deep leaf green as primary, warm earth brown as secondary, a single muted amber for warnings, a desaturated red reserved for high-severity results. No purple gradients.
- **Type:** a humanist sans for body (something with good Thai support — *IBM Plex Sans Thai Looped* or *Sarabun*) paired with a slightly more characterful display face for headlines.
- **Density:** generous padding, large tap targets (min 44×44 px), readable type sizes (16 px body floor on mobile).
- **Motion:** restrained. A soft fade-in on result, a subtle progress shimmer during inference. Respect `prefers-reduced-motion`.
- **Imagery:** if illustrations are used, prefer simple line drawings over stock photography.

---

## 9. Accessibility

Target: WCAG 2.1 AA.

- All interactive elements are keyboard-reachable with visible focus rings.
- Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text.
- Probability bars include text labels, not color alone.
- Image upload has a labeled file input fallback for users without camera permission.
- All icons that act as buttons have `aria-label`.
- Result screens use semantic headings so screen readers can navigate them.

---

## 10. Performance budget

- First Contentful Paint ≤ 1.8 s on a 4G connection
- Time to Interactive ≤ 3.0 s on a 4G connection
- JS bundle (gzipped) ≤ 200 KB for the initial route
- Largest image asset ≤ 100 KB
- Lighthouse mobile score ≥ 90 for Performance and Accessibility

To hit these: code-split the History route, lazy-load Recharts, compress images at build time, use system fonts as a fallback while the web fonts load.

---

## 11. PWA behavior

- Installable on Android (manifest + 192/512 icons + maskable variants)
- Service worker caches the app shell so the Home and History screens open offline
- Past diagnoses in History are fully viewable offline (data is local)
- Running a new diagnosis offline is **not** supported in v1; the Capture screen detects offline state and shows a clear message: *"You need an internet connection to diagnose a new leaf."*

---

## 12. Tech stack

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** for styling
- **TanStack Query** for the diagnose request
- **Zustand** for UI state
- **idb** for IndexedDB access
- **Recharts** for the probability bars (lazy-loaded)
- **react-i18next** for translations
- **vite-plugin-pwa** for the service worker and manifest
- **Vitest** + **React Testing Library** for unit/component tests
- **Playwright** for one happy-path end-to-end test

---

## 13. Project structure

```
src/
  app/
    routes.tsx
    providers.tsx           // QueryClient, i18n, ErrorBoundary
  pages/
    Home.tsx
    Capture.tsx
    Result.tsx
    History.tsx
  components/
    CameraCapture.tsx
    ResultCard.tsx
    ProbabilityBars.tsx
    TreatmentCard.tsx
    HistoryList.tsx
    LanguageToggle.tsx
    ui/                     // PrimaryButton, IconButton, Toast, ConfirmDialog
  api/
    diagnose.ts             // typed client
    mock.ts                 // mock implementation for dev
    types.ts                // DiagnoseResponse, HistoryRecord, etc.
  store/
    ui.ts                   // Zustand
  history/
    db.ts                   // idb wrapper
  i18n/
    index.ts
    th.json
    en.json
  styles/
    index.css               // Tailwind layers + CSS variables
  main.tsx
public/
  icon-192.png
  icon-512.png
  manifest.webmanifest
```

---

## 14. Build order (suggested, ~2–3 weeks)

1. Project scaffold (Vite + TS + Tailwind + routes + providers).
2. Mock API client returning each of the three `decision` states on demand.
3. Home and Capture screens with the camera + upload fallback wired up.
4. Result screen for all three states, driven by the mock API.
5. ProbabilityBars and TreatmentCard.
6. IndexedDB history + History screen.
7. i18n pass — extract every string, add Thai translations.
8. PWA manifest, service worker, install prompt.
9. Performance pass — bundle audit, lazy-loading, Lighthouse run.
10. Accessibility pass — keyboard, screen reader, contrast.
11. Wire to real backend once available; remove mock from production build.
12. One Playwright happy-path test, deploy preview to Vercel.

---

## 15. Definition of done

- All three result states render correctly from the mock API.
- The full happy path works on a real Android phone in a real outdoor setting.
- All visible strings exist in both `th.json` and `en.json`.
- Lighthouse mobile ≥ 90 on Performance and Accessibility.
- App is installable as a PWA and the Home/History screens load offline.
- One Playwright test covers Home → Capture → Result (mocked) → Save → History.
- README documents how to run with the mock and how to point at the real backend.