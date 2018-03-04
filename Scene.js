class Scene {
    constructor() {
        this.objects = {
            players: [],
            kickers: [],
            balls: [],
            borders: [],
        };

        this.collisions = [];
    }

    addObject(obj) {
        if (obj instanceof Player) {
            this.objects.players.push(obj);
            this.objects.kickers.push(obj.kicker);
        } else if (obj instanceof Ball) {
            this.objects.balls.push(obj);
        } else if (obj instanceof Border) {
            this.objects.borders.push(obj);
        }
        obj.scene = this;
    }

    getCollisions() {
        // get disc-disc collisions
        // // // get player-ball collisions
        for (let player of this.objects.players) {
            for (let ball of this.objects.balls) {
                let cls = Collision.getCollision(player, ball);
                if (cls) this.collisions.push(cls);
            }

        }

        // // // get player-player collisions
        for (let player of this.objects.players) {
            for (let player2 of this.objects.players) {
                let cls = Collision.getCollision(player, player2);
                if (cls) this.collisions.push(cls);
            }

        }

        // get disc-border collisions
        for (let disc of this.objects.players.concat(this.objects.balls)) {
            for (let border of this.objects.borders) {
                let cls = Collision.getCollision(disc, border);
                if (cls) this.collisions.push(cls);
            }
        }

        // get ball-kicker collisions

        for (let ball of this.objects.balls) {
            for (let kicker of this.objects.kickers) {
                let cls = Collision.getCollision(ball, kicker);
                if (cls) this.collisions.push(cls);
            }
        }
    }

    resolveCollisions() {
        while (this.collisions.length > 0) {
            let collision = this.collisions.pop();
            collision.resolve();
        }

    }

    update() {
        for (let objectKey in this.objects) {
            let objectList = this.objects[objectKey];
            for (let object of objectList) {
                object.update();
            }
        }

        //Iterate 20 times for collisions
        for (let i = 0; i < 20; i++) {
            this.getCollisions();
            this.resolveCollisions();
        }


    }
    draw() {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let objectKey in this.objects) {
            let objectList = this.objects[objectKey];
            for (let object of objectList) {
                object.draw();
            }
        }
    }
}