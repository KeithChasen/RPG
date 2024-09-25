class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = config.element.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.map = null;
    }

    startGameLoop() {
        const step = () => {

            this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

            //Establish camera person
            const cameraPerson = this.map.gameObjects.hero;

            // update all objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map
                });
            })

            this.map.drawLowerImage(this.ctx, cameraPerson);

            // draw all objects
            Object.values(this.map.gameObjects)
                // sort game objects so that
                // the more object down to the map
                // the more it on top
                .sort((a,b) => a.y - b.y )
                .forEach(object => {
                    object.sprite.draw(this.ctx, cameraPerson);
                })

            this.map.drawUpperImage(this.ctx, cameraPerson);

            requestAnimationFrame(() => {
                step()
            })
        }
        step();
    }

    init() {
        this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
        this.map.mountObjects();
        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.startGameLoop();

        this.map.startCutscene([
            { who: 'hero', type: "walk", direction: 'down' },
            { who: 'hero', type: "walk", direction: 'down' },
            
            { who: 'npcA', type: "walk", direction: 'left' },
            { who: 'npcA', type: "walk", direction: 'up' },
            { who: 'npcA', type: "stand", direction: 'left', time: 800 },

            { who: 'hero', type: "stand", direction: 'right', time: 800 },

        ])
        
    }
}