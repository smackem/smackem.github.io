# **Guidelines for Junie – Static Web Application Project**

## 🌱 **Project Overview**
This project aims to build a clean, modern, and fully static web application. The focus is on simplicity, maintainability, and a smooth user experience. All assets will be client‑side only — no backend services.

Junie will be responsible for implementing features, maintaining code quality, and progressing through the defined milestones.

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
- Implement homepage
- Implement secondary pages (About, Contact, etc.)
- Add navigation and footer
- Ensure responsive layout

### **Milestone 3 — Components**
- Build reusable UI components (buttons, cards, modals)
- Document components in a simple style guide
- Ensure accessibility (ARIA roles, keyboard navigation)

### **Milestone 4 — Interactivity**
- Add JavaScript interactions (menus, forms, animations)
- Validate forms client-side
- Optimize for performance

### **Milestone 5 — Polish & Deployment**
- Final UI refinements
- Cross-browser testing
- Minify assets
- Deploy to static hosting (Netlify, GitHub Pages, Vercel)

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
