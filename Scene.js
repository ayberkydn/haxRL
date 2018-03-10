class Scene {
    constructor() {
        this.objects = {
            players: [],
            kickers: [],
            balls: [],
            borders: [],
            posts: [],
        };

        this.metaObjects = {
            boxes: [],
            goals: [],
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
        } else if (obj instanceof Box) {
            this.metaObjects.boxes.push(obj);
            for (let borderKey in obj.borders) {
                this.objects.borders.push(obj.borders[borderKey]);
            }
        } else if (obj instanceof Goal) {
            this.metaObjects.goals.push(obj);
            this.objects.borders.push(obj.goalLine);
            this.objects.posts.push(obj.topPost);
            this.objects.posts.push(obj.bottomPost);
        }
        obj.scene = this;
    }

    getCollisions(group1, group2) {
        for (let obj1 of group1) {
            for (let obj2 of group2) {
                let cls = Collision.getCollision(obj1, obj2);
                if (cls)
                    this.collisions.push(cls);
            }
        }
    }


    getAllCollisions() {
        this.getCollisions(this.objects.players, this.objects.players);
        this.getCollisions(this.objects.players, this.objects.balls);
        this.getCollisions(this.objects.players, this.objects.borders);
        this.getCollisions(this.objects.players, this.objects.posts);

        this.getCollisions(this.objects.balls, this.objects.kickers);
        this.getCollisions(this.objects.balls, this.objects.borders);
        this.getCollisions(this.objects.balls, this.objects.posts);



    }

    resolveCollisions() {
        while (this.collisions.length > 0) {
            let collision = this.collisions.pop();
            collision.resolve();
        }
    }

    checkGoals() {
        for (let goal of this.metaObjects.goals) {
            for (let ball of this.objects.balls) {
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
            this.getAllCollisions();
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
        this.objects = this.startingStateObjects;
    }
}