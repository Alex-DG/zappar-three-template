import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment {
    constructor(zapparTracking) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.zapparTracking = zapparTracking

        this.setSunLight()
    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 1.2)
        this.sunLight.position.set(4, 8, 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 50
        this.sunLight.shadow.mapSize.set(2048, 2048)
        this.sunLight.shadow.normalBias = 0.05

        // Shadow camera bounds optimized for the character size
        this.sunLight.shadow.camera.top = 2
        this.sunLight.shadow.camera.bottom = -2
        this.sunLight.shadow.camera.left = -2
        this.sunLight.shadow.camera.right = 2
        this.sunLight.shadow.radius = 4 // Blur radius for softer edges

        this.ambientLight = new THREE.AmbientLight('#ffffff', 0.5)

        // Add DirectionalLight to the tracker group so shadows stay consistent with the object
        // We get the tracker group from the world's zapparTracking instance
        // Note: Environment is created BEFORE ZapparTracking in World.js currently.
        // We must ensure ZapparTracking is created FIRST in World.js, then Environment.
        // OR we can't access it here in constructor if it's not created yet.

        // Add DirectionalLight to the tracker group so shadows stay consistent with the object
        if (this.zapparTracking) {
            this.zapparTracking.instantTrackerGroup.add(this.sunLight)
            this.zapparTracking.instantTrackerGroup.add(this.sunLight.target)
        } else {
            this.scene.add(this.sunLight)
        }

        this.scene.add(this.ambientLight)
    }
}
