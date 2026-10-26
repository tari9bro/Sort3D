# Sort3D - 3D Sorting Algorithm Visualizer & Soundscape

An interactive 3D sorting algorithm visualizer with spatial Web Audio synthesis, step-by-step code execution, and algorithmic mechanics based on alg0.dev.

---

## 🚀 How to Deploy to GitHub Pages (Free Public Link)

This repository is already pre-configured for GitHub Pages with relative asset paths (`base: './'`), Jekyll bypass (`.nojekyll`), and automated GitHub Actions deployment.

### Method 1: Automatic Deployment with GitHub Actions (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Sort3D"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - On GitHub, go to your repository page.
   - Click **Settings** (tab at the top).
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment** > **Source**, select:
     👉 **GitHub Actions**
   - That's it! The pre-configured `.github/workflows/deploy.yml` workflow will automatically trigger, build the website, and publish it.

3. **Visit Your Public Website**:
   - Your public link will be live at:
     ```
     https://<your-username>.github.io/<your-repo-name>/
     ```
   - Any future `git push` to `main` will automatically build and update your live website within ~60 seconds!

---

### Method 2: Manual Build & Push (Alternative)

If you prefer building locally and deploying via the `gh-pages` branch:

1. Build the production files:
   ```bash
   npm install
   npm run build
   ```

2. Deploy the `dist` directory to the `gh-pages` branch:
   ```bash
   npx gh-pages -d dist
   ```

3. In GitHub Repository **Settings** > **Pages**, ensure the Source is set to **Deploy from a branch** and select `gh-pages` / `(root)`.

---

## ✨ Features Included
- **7 Sorting Algorithms**: Bubble Sort, Quick Sort, Merge Sort, Insertion Sort, Selection Sort, Heap Sort, Cocktail Shaker Sort.
- **3D Spatial Environment**: Three.js isometric perspective with procedural chamfered pillars, parabolic swap arcs, and smooth animations.
- **Polyphonic Web Audio Synthesizer**: Pentatonic, chromatic, and harmonic acoustic frequencies panned stereo left-to-right.
- **Code & Logic Inspector**: Real-time side-by-side JavaScript & Python source tracing with active line highlighting.
- **Preset & Custom Arrays**: Random, Reversed, Nearly Sorted, Few Unique, and Custom numbers input.
- **Full Offline PWA**: Installable to desktop/mobile devices and works completely offline without network connectivity.
