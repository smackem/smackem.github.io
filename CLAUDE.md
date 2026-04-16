# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for Dozem, a heavy metal music project. It's a single-page audio player application built with vanilla JavaScript, Bootstrap 5, and no build system. The site is hosted on GitHub Pages.

**Design Philosophy**: Simplicity first, with light text on black background, Dozem logo at center top, and typewriter-like font (fallback to monospace). The design is intentionally minimalistic featuring only logo, song list, and footer.

## Architecture

### Core Structure

- **index.html**: Main entry point with Bootstrap 5 CDN and custom styling
- **scripts/index.js**: All application logic - song loading, audio player controls, UI state management
- **songs.json**: Data source containing song metadata (id, title, audio path, image, description)
- **styles/main.css**: Dark theme styling with typewriter-like fonts
- **assets/**: Contains all audio files (MP3) and cover images (JPG/PNG)

### Key Components

**Audio Player System** (scripts/index.js):
- Single global `Audio` object handles playback for all songs
- Song list dynamically generated from songs.json via fetch
- Songs expand on play to show controls (seek, next, stop)
- Global spacebar listener for play/pause
- Auto-advance to next song on track end
- URL hash routing (#song-id) for deep linking to songs
- Volume control with localStorage persistence (hidden on iOS due to API restrictions)

**UI States**:
- `.song-item.selected`: Currently playing song (expanded controls)
- Play/pause buttons toggle icons based on audio state
- Footer shows current song info and global volume control
- Smooth CSS transitions for expanding/collapsing controls

**iOS Detection**: Modern logic checks for iPad/iPhone/iPod and handles iPadOS 13+ (which identifies as Mac) by checking `maxTouchPoints > 1`

## Development Commands

This is a static site with no build process. Simply open `index.html` in a browser or use a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server
```

## Adding New Songs

1. Add audio file to `assets/` directory
2. Add cover image to `assets/` directory
3. Add entry to `songs.json` with:
   - `id`: Kebab-case identifier (used in URLs)
   - `title`: Display name
   - `audio`: Path to MP3 file
   - `image`: Path to cover image
   - `description`: Brief song description

The song will automatically appear on next page load.

## File Organization

- Static HTML/CSS/JS only - no transpilation or bundling
- Bootstrap 5 loaded via CDN (CSS + JS bundle)
- Bootstrap Icons loaded via CDN
- All song assets stored in `assets/` (images use lazy loading attribute)

## Core Principles

- **Simplicity first** — avoid unnecessary complexity
- **Consistency** — follow the same patterns across components and pages
- **Accessibility** — ensure the app is usable for everyone (semantic HTML, alt text, keyboard navigation)
- **Performance** — keep the bundle small and the UI fast
- **Maintainability** — write code that future contributors can understand

## Coding Guidelines

### HTML
- Use semantic tags (`header`, `main`, `section`, `footer`)
- Keep markup minimal and meaningful
- Ensure proper alt text for images
- Use responsive design principles

### CSS
- Keep styles modular
- Avoid inline styles
- Use consistent naming conventions

### JavaScript
- Prefer pure functions and modular code
- Avoid global variables where possible
- Use `const` and `let` appropriately
- Document complex logic with short comments

## Quality Standards

- Manual testing across major browsers
- Validate HTML and CSS
- Ensure no console errors or warnings
- Work in small, incremental commits with clear commit messages

## Core Principles

- **Simplicity first** — avoid unnecessary complexity
- **Consistency** — follow the same patterns across components and pages
- **Accessibility** — ensure the app is usable for everyone (semantic HTML, alt text, keyboard navigation)
- **Performance** — keep the bundle small and the UI fast
- **Maintainability** — write code that future contributors can understand

## Coding Guidelines

### HTML
- Use semantic tags (`header`, `main`, `section`, `footer`)
- Keep markup minimal and meaningful
- Ensure proper alt text for images
- Use responsive design principles

### CSS
- Keep styles modular
- Avoid inline styles
- Use consistent naming conventions

### JavaScript
- Prefer pure functions and modular code
- Avoid global variables where possible
- Use `const` and `let` appropriately
- Document complex logic with short comments

## Quality Standards

- Manual testing across major browsers
- Validate HTML and CSS
- Ensure no console errors or warnings
- Work in small, incremental commits with clear commit messages
