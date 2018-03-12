class Scene {
    constructor() {
        this.objects = {
            borders: [],
            discs: [],
        };

        this.metaObjects = {
            boxes: [],
            goals: [],
            balls: [],
            players: [],
        };

        this.collisions = [];
    }

    addObject(obj) {
        if (obj instanceof Disc) {
            this.objects.discs.push(obj);

        }
        if (obj instanceof Player) {
            this.objects.discs.push(obj.kicker);
            this.metaObjects.players.push(obj);
        } else if (obj instanceof Ball) {
            this.metaObjects.balls.push(obj);
        } else if (obj instanceof Border) {
            this.objects.borders.push(obj);
        } else if (obj instanceof Box) {
            this.metaObjects.boxes.push(obj);
            for (let borderKey in obj.borders) {
                this.objects.borders.push(obj.borders[borderKey]);
            }
        } else if (obj instanceof Goal) {
            this.metaObjects.goals.push(obj);
            this.objects.borders.push(obj.goalLine);
            this.objects.borders.push(obj.netTop);
            this.objects.borders.push(obj.netBottom);
            this.objects.borders.push(obj.netBack);
            this.objects.discs.push(obj.topPost);
            this.objects.discs.push(obj.bottomPost);

        }
        obj.scene = this;
    }

    getCollisions() {

        // Disc-Border collisions
        for (let disc of this.objects.discs) {
            for (let border of this.objects.borders) {
                let cls = Collision.getCollision(disc, border);
                if (cls) {
                    this.collisions.push(cls);
                }
            }
        }

        //Disc-Disc collisions
        for (let i = 0; i < this.objects.discs.length; i++) {
            for (let j = i + 1; j < this.objects.discs.length; j++) {
                let disc1 = this.objects.discs[i];
                let disc2 = this.objects.discs[j];
                let cls = Collision.getCollision(disc1, disc2);
                if (cls) {
                    this.collisions.push(cls);
                }
            }
        }
    }


    resolveCollisions() {
        while (this.collisions.length > 0) {
            let collision = this.collisions.pop();
            collision.resolve();
        }
    }

    checkGoals() {
        for (let goal of this.metaObjects.goals) {
            for (let ball of this.objects.discs) {
                if (goal.checkGoal(ball)) {
                    return true;
                }
            }
        }
        return false;
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

    reset() {
        this.redStartX = 100;
        this.blueStartX = 700;
        this.metaObjects.players[0].center.x = this.redStartX;
        this.metaObjects.players[0].center.y = canvas.height / 2;
        this.metaObjects.players[0].velocity.mult(0);
        this.metaObjects.players[1].center.x = this.blueStartX;
        this.metaObjects.players[1].center.y = canvas.height / 2;
        this.metaObjects.players[1].velocity.mult(0);
        this.metaObjects.balls[0].center.x = canvas.width / 2;
        this.metaObjects.balls[0].center.y = canvas.height / 2;
        this.metaObjects.balls[0].velocity.mult(0);
    }
}