# **Guidelines for Junie – Static Web Application Project**

## 🌱 **Project Overview**
This project aims to build a clean, modern, and fully static web application. The focus is on simplicity, maintainability, and a smooth user experience. All assets will be client‑side only — no backend services.

The application is basically a web page that allows visitors to listen to audio files. It presents the recordings of the heavy metal band "Dozem".

Junie will be responsible for implementing features, maintaining code quality, and progressing through the defined milestones.

---


## **Application Description**

The web page presents a list of songs, which can be played through HTML5 audio playback controls.
Each song has a quadratic image (90x90 pixels) left of the song title. Next to the song title is a play button. Whenever a song is played, the song list item becomes selected and expands to display playback controls like pause, stop, a seek slider and volume controls. Only the currently playing song has this expanded view. When a song is played, the currently playing song is stopped.
When a song ends, the next song in the list is played automatically.
Songs are described in a single file containing a JSON structure, which contains the relative path of the song (under the directory "assets"), the song title, the relative path of the associated image (also under the directory "assets") and a song description.
This means that in order to add new songs, the developer only needs to put the audio file and image into the assets directory and update the songs.json file.

---

## **Visual Design**
- Light text on black background
- The Dozem logo should be at the center top
- Use a typewriter-like font and fall back to monospace
- The design should be very simplistic - only logo, song list and a footer with a link to the About page

---

## 🧭 **Core Principles**
- **Simplicity first** — avoid unnecessary complexity.
- **Consistency** — follow the same patterns across components and pages.
- **Accessibility** — ensure the app is usable for everyone.
- **Performance** — keep the bundle small and the UI fast.
- **Maintainability** — write code that future contributors can understand.

---

## 🛠️ **Tech Stack**
- **HTML5** for structure
- **CSS3 / Tailwind / SCSS** (choose one and stick to it)
- **JavaScript (ES6+)**
- **Bootstrap**

---

## 📁 **Project Structure**
```
/project-root
  /src
    /assets
    /components
    /styles
    /scripts
    /pages
  /dist
  index.html
  README.md
  guidelines.md
```

---

## 🧩 **Coding Guidelines**

### **HTML**
- Use semantic tags (`header`, `main`, `section`, `footer`).
- Keep markup minimal and meaningful.
- Ensure proper alt text for images.
- Use responsive design principles.

### **CSS**
- Use a consistent naming convention (BEM or utility-first).
- Keep styles modular.
- Avoid inline styles.

### **JavaScript**
- Prefer pure functions and modular code.
- Avoid global variables.
- Use `const` and `let` appropriately.
- Document complex logic with short comments.

---

## 🧪 **Testing & Quality**
- Manual testing across major browsers.
- Validate HTML and CSS.
- Use lightweight JS linting (ESLint recommended).
- Ensure no console errors or warnings.

---

## 🚀 **Milestones**

### **Milestone 1 — Project Setup**
- Initialize project structure
- Choose styling approach
- Set up build pipeline (if using SSG or bundler)
- Create base layout and global styles

### **Milestone 2 — Core Pages**
- Implement homepage featuring the song list. Make up 3 sample song titles and use an image placeholder. The song list does not need to be interactive.
- Implement secondary pages (About, Contact, etc.)
- Ensure responsive layout

### **Milestone 3 — Components**
- Build reusable UI components, especially a component to represent a song in the song list
- Build the JSON file that keeps the song index and build the song list from this index. Populate the initial JSON file with the files under the directory "assets". Pair the image with the audio tracks based on file names and insert dummy descriptions.
- Document components in a simple style guide
- Ensure accessibility (ARIA roles, keyboard navigation)

### **Milestone 4 — Interactivity**
- Add JavaScript interactions (menus, forms, animations)
- Implement the player logic, including the visual expansion of the currently playing song.

### **Milestone 5 — Polish & Deployment**
- Final UI refinements
- Cross-browser testing

---

## 📚 **Workflow Expectations**
- Work in small, incremental commits
- Write clear commit messages
- Keep branches focused on single tasks
- Request feedback early when unsure

---

## 🗣️ **Communication**
- Share progress updates at each milestone
- Ask questions when requirements are unclear
- Propose improvements when you see opportunities
