import * as THREE from 'three'
import * as ZapparThree from '@zappar/zappar-threejs'
import Experience from '../Experience.js'

export default class ZapparTracking {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance

        // State
        this.placementMode = true

        this.setTracker()
    }

    setTracker() {
        this.instantTracker = new ZapparThree.InstantWorldTracker()
        this.instantTrackerGroup = new ZapparThree.InstantWorldAnchorGroup(this.camera, this.instantTracker)
        this.scene.add(this.instantTrackerGroup)
    }

    setPlacementMode(value) {
        this.placementMode = value
    }

    update() {
        // Update anchor pose if in placement mode
        if (this.placementMode) {
            this.instantTracker.setAnchorPoseFromCameraOffset(0, 0, -5)
        }
    }
}
