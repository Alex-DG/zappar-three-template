# Zappar Three.js Template 🚀

A modular, scalable starter template for creating **WebAR** experiences using **Three.js** and the **Zappar Universal AR SDK**. It follows a class-based architecture to keep the code organized and maintainable.

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
