# Zappar Three.js Template 🚀

A modular, scalable starter template for creating **WebAR** experiences using **Three.js** and the **Zappar Universal AR SDK**. It follows a class-based architecture to keep the code organized and maintainable.

<p align="center">
  <img width="300" alt="Demo" src="https://github.com/user-attachments/assets/b2b666f6-e5cb-4010-ad37-f41f63ab6b28" />
  <img width="300" height="300" alt="Zappar_Three_Template-QR_Code" src="https://github.com/user-attachments/assets/5ddce0fb-a0a5-4686-945a-ba87c9cb8c46" />
</p>


## Setup

Run the following commands:

```bash
# Install dependencies
yarn

# Run the local server (with HTTPS)
yarn dev

# Build for production
yarn build
```

## 🏗 Project Structure

The project is organized into a modular structure where each responsibility is separated into its own class.

```
src/
├── public/
│   └── models/        # 3D assets (GLTF/GLB)
├── Experience/
│   ├── Utils/
│   │   ├── EventEmitter.js    # Base class for event handling
│   │   ├── Sizes.js           # Handles window resize events
│   │   └── Time.js            # Handles the requestAnimationFrame loop
│   ├── World/
│   │   ├── Character.js       # GLTF Model with Animation logic
│   │   ├── Environment.js     # Lights and Shadows
│   │   ├── Floor.js           # Shadow-receiving plane
│   │   ├── ZapparTracking.js  # Instant World Tracker & Anchor Group
│   │   └── World.js           # Scene manager (orchestrator)
│   ├── UI/
│   │   └── PlacementUI.js     # Handles valid placement UI logic
│   ├── Camera.js              # Zappar Camera & Permissions
│   ├── Experience.js          # Main Singleton & Coordinator
│   └── Renderer.js            # Three.js WebGLRenderer (with Zappar context)
├── main.js                    # Entry point
├── style.css                  # Global styles
└── index.html
```

## 🧠 Architecture Overview

### Core Concept: The Singleton
The `Experience.js` class acts as a **Singleton**. This means it can be instantiated once, and subsequent instantiations or imports will refer to that same instance. This allows deep components (like `Character.js`) to easily access global resources (like `experience.time` or `experience.camera`) without passing parameters down a long chain.

### 1. The Utilities (`src/Experience/Utils/`)
Helper classes that handle the "plumbing" of the web app.
*   **`EventEmitter.js`**: A base class that allows other classes to trigger and listen for events.
*   **`Sizes.js`**: Listens for window resize events.
*   **`Time.js`**: Handles the main animation loop (`requestAnimationFrame`). Triggers a `'tick'` event every frame.

### 2. The Experience (`src/Experience/Experience.js`)
The main orchestrator. It:
1.  Setups the Canvas
2.  Initializes all other components (`Sizes`, `Time`, `Camera`, `Renderer`, `World`)
3.  Listens to `Sizes` to resize the camera and renderer
4.  Listens to `Time` to update the world, camera, and renderer every frame

### 3. The World (`src/Experience/World/`)
Everything that is **inside** the 3D scene.
*   **`World.js`**: The **orchestrator** of the scene. It instantiates all objects (`ZapparTracking`, `Environment`, `Floor`, `Character`).
*   **`ZapparTracking.js`**: Manages the `InstantWorldTracker` and `InstantWorldAnchorGroup`.
*   **`Character.js`**: Handles the 3D model loading and animation. It retrieves the anchor group from `ZapparTracking` to place the model in AR space.
*   **`Environment.js`**: Manages lighting (Ambient, Directional) and shadows.
*   **`Floor.js`**: A transparent shadow-receiving plane.

### 4. The View
*   **`Camera.js`**: Sets up the `ZapparThree.Camera`, handles browser compatibility checks, and manages camera permission UI.
*   **`Renderer.js`**: Sets up the `WebGLRenderer`, configures it for Zappar (`glContextSet`), and handles color encoding / tone mapping.

### 5. The UI (`src/Experience/UI/`)
*   **`PlacementUI.js`**: Manages the "Tap to place" button. It toggles the placement mode in `ZapparTracking` and plays/pauses animations in `Character`.

## 🔄 Adding New Features

To add a new object:
1.  Create a class in `src/Experience/World/`.
2.  Instantiate it in `World.js`.
3.  If it needs to be tracked, ensure it adds itself to `experience.world.zapparTracking.instantTrackerGroup` instead of `scene`.
4.  If it needs animation, give it an `update()` method and call it from `World.update()`.

## ⚙️ Vite Configuration

You might notice some specific configuration in `vite.config.js` under `optimizeDeps`. Here's why it's there:

```javascript
optimizeDeps: {
    exclude: ['@zappar/zappar-threejs', '@zappar/zappar-cv'],
    include: ['ua-parser-js'],
},
```

### Why exclude Zappar?
Zappar's libraries use internal Workers and WebAssembly (WASM) files. Vite's dependency optimizer (esbuild) can sometimes bundle these files incorrectly or mess up the relative paths required to load the worker/WASM files at runtime.
*   **Error if removed**: `The file does not exist at .../worker?worker_file&type=module`.
*   **Fix**: Excluding them forces Vite to leave the Zappar packages as-is, allowing the browser to load the worker files correctly from their node_modules location.

### Why include `ua-parser-js`?
The Zappar library depends on `ua-parser-js`. When we exclude Zappar from optimization, Vite skips processing its dependencies too. However, `ua-parser-js` is often distributed as a CommonJS module, which browsers can't understand natively without bundling.
*   **Error if removed**: `SyntaxError: Importing binding name 'UAParser' is not found.` (Vite fails to convert the CommonJS export to an ESM import).
*   **Fix**: Explicitly including it forces Vite to pre-bundle `ua-parser-js` into an ESM-compatible module that Zappar can import without issues.

