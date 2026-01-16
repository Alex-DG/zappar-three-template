import * as ZapparThree from '@zappar/zappar-threejs'
import Experience from './Experience.js'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
    }

    setInstance() {
        // Browser compatibility check
        if (ZapparThree.browserIncompatible()) {
            ZapparThree.browserIncompatibleUI()
            throw new Error('Unsupported browser')
        }

        // Create Zappar Camera
        this.instance = new ZapparThree.Camera()

        // Permissions
        ZapparThree.permissionRequestUI().then((granted) => {
            if (granted) this.instance.start()
            else ZapparThree.permissionDeniedUI()
        })

        // Set background
        this.scene.background = this.instance.backgroundTexture
    }

    resize() {
        // Zappar camera handles projection matrix internally generally, but we might want to ensure aspect or other props if needed.
        // Usually primarily the renderer that needs resize mainly for Zappar full screen AR.
    }

    update() {
        if (this.experience.renderer.instance)
            this.instance.updateFrame(this.experience.renderer.instance)
    }
}
