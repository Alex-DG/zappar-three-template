import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as ZapparThree from '@zappar/zappar-threejs'
import Experience from '../Experience.js'

export default class Character {
    constructor(zapparTracking) {
        this.experience = new Experience()
        this.zapparTracking = zapparTracking
        this.loadingManager = new ZapparThree.LoadingManager()

        this.setModel()
    }

    setModel() {
        const gltfLoader = new GLTFLoader(this.loadingManager)

        gltfLoader.load('models/waving.glb', (gltf) => {
            this.model = gltf.scene

            this.model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true
                    child.receiveShadow = false
                }
            })

            // Animation
            this.animation = {}
            this.animation.mixer = new THREE.AnimationMixer(this.model)

            // Play all animations
            gltf.animations.forEach((clip) => {
                const action = this.animation.mixer.clipAction(clip)
                action.play()
            })

            // Default to paused (timeScale 0) for placement mode
            this.animation.mixer.timeScale = 0

            // Add to the tracking group instead of the scene directly
            this.zapparTracking.instantTrackerGroup.add(this.model)
        }, undefined, () => {
            console.error('An error ocurred loading the GLTF model')
        })
    }

    update() {
        if (this.animation && this.animation.mixer) {
            this.animation.mixer.update(this.experience.time.delta * 0.001)
        }
    }

    playAnimation() {
        if (this.animation && this.animation.mixer) {
            this.animation.mixer.timeScale = 1
        }
    }

    pauseAnimation() {
        if (this.animation && this.animation.mixer) {
            this.animation.mixer.timeScale = 0
        }
    }
}
