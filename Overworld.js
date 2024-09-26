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

    bindActionInput() {
        new KeyPressListener('Enter', () => {
            //is there a person to talk to?
            this.map.checkForActionCutscene();
        })
    }

    bindHeroPositionCheck() {
        document.addEventListener('PersonWalkingComplete', e => {
            if (e.detail.whoId === 'hero') {
                console.log('new hero coords')
                // hero's position changed
                this.map.checkForFootstepCutscene();
            }
        })
    }

    startMap(mapConfig) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();
    }

    init() {
        this.startMap(window.OverworldMaps.Kitchen);

        this.bindActionInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.startGameLoop();

        this.map.startCutscene([
        //     { who: 'hero', type: "walk", direction: 'down' },
        //     { who: 'hero', type: "walk", direction: 'down' },
            
        //     { who: 'npcA', type: "walk", direction: 'left' },
        //     { who: 'npcA', type: "walk", direction: 'up' },
        //     { who: 'npcA', type: "stand", direction: 'left', time: 800 },

        //     { who: 'hero', type: "stand", direction: 'right', time: 800 },

        //     { type: 'textMessage', text: 'Keith: Hello, Julie' },
        //     { type: 'textMessage', text: 'Julie: Hi there, Keith' },

            { type: 'textMessage', text: "Wow! What's this place? I guess I'm gonna find a lot of stuff here..." },
        ])
        
    }
}