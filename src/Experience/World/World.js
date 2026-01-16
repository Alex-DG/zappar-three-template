import Experience from '../Experience.js'
import Environment from './Environment.js'
import ZapparTracking from './ZapparTracking.js'
import Floor from './Floor.js'
import Character from './Character.js'
import PlacementUI from '../UI/PlacementUI.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        // Setup
        this.zapparTracking = new ZapparTracking()
        this.environment = new Environment(this.zapparTracking)
        this.floor = new Floor(this.zapparTracking)
        this.character = new Character(this.zapparTracking)
        this.placementUI = new PlacementUI(this.zapparTracking, this.character)
    }

    update() {
        if (this.zapparTracking)
            this.zapparTracking.update()
        if (this.character)
            this.character.update()
    }
}
