import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Floor {
    constructor(zapparTracking) {
        this.experience = new Experience()
        this.zapparTracking = zapparTracking

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(1000, 1000)
    }

    setMaterial() {
        this.material = new THREE.ShadowMaterial({
            opacity: 0.4,
            transparent: true
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = -Math.PI * 0.5
        this.mesh.position.y = -0.01 // Slight offset to avoid z-fighting if needed, though usually 0 is fine
        this.mesh.receiveShadow = true

        this.zapparTracking.instantTrackerGroup.add(this.mesh)
    }
}
