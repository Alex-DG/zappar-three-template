import Experience from '../Experience.js'

export default class PlacementUI {
    constructor(zapparTracking, character) {
        this.experience = new Experience()
        this.zapparTracking = zapparTracking
        this.character = character

        this.setUI()
    }

    setUI() {
        this.ui = document.getElementById('zappar-placement-ui')

        if (!this.ui) {
            console.warn('Placement UI button not found')
            return
        }

        // Initial state
        this.updateText()

        this.ui.addEventListener('click', () => {
            this.togglePlacement()
        })
    }

    togglePlacement() {
        // Toggle mode in tracker
        const newMode = !this.zapparTracking.placementMode
        this.zapparTracking.setPlacementMode(newMode)

        // Handle animation state
        if (this.character) {
            if (newMode) {
                // Placing: pause animation
                this.character.pauseAnimation()
            } else {
                // Placed: play animation
                this.character.playAnimation()
            }
        }

        // Update UI text
        this.updateText()
    }

    updateText() {
        if (this.zapparTracking.placementMode) {
            this.ui.textContent = 'Tap here to place the object'
        } else {
            this.ui.textContent = 'Tap here to lift the object'
        }
    }
}
