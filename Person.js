class Person extends GameObject {
    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;
        this.isStanding = false;

        this.isPlayerControlled = config.isPlayerControlled || false;

        this.directionUpdate = {
            'up': ['y', -1],
            'down': ['y', 1],
            'left': ['x', -1],
            'right': ['x', 1],
        }
    }

    update(state) {
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
            //Case: we're keyboard ready and have an arrow pressed
            // and no cut scene is playing
            if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
                this.startBehavior(state, {
                    type: 'walk',
                    direction: state.arrow
                })
            }
            this.updateSprite();
        }
    }

    startBehavior(state, behavior) {
        // set character direction to whatever behavior has
        this.direction = behavior.direction;
        if (behavior.type === 'walk') {
            //stop here if space is not free
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
                // if we have retry option and some object is blocking behaviour 
                // retry later when obstacle is possibly gone
                behavior.retry && setTimeout(() => {
                    this.startBehavior(state, behavior);
                }, 10);
                return;
            }
            // ready to walk
            state.map.moveWall(this.x, this.y, this.direction);
            this.movingProgressRemaining = 16;
            this.updateSprite();
        }

        if (behavior.type === 'stand') {
            this.isStanding = true;
            setTimeout(() => {
                utils.emitEvent("PersonStandComplete", { whoId: this.id });
                this.isStanding = false;
            }, behavior.time)
        }
    }

    updatePosition() {
        // fetching [y, -1]                             // up
        const [property, change] = this.directionUpdate[this.direction];
        //this.y            -1
        this[property] += change;
        this.movingProgressRemaining -= 1;

        if (this.movingProgressRemaining === 0) {
            // we finished the walk
            utils.emitEvent('PersonWalkingComplete', {
                whoId: this.id
            })
        }
    }

    updateSprite() {
        // if there is still remaining value to walk
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation('walk-'+this.direction);
            return;
        }

        this.sprite.setAnimation('idle-'+this.direction); // by default idle
    }
}