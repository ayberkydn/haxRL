class Scene {
    constructor() {
        this.objects = [];
        this.collisions = [];
    }
    addObject(obj) {
        this.objects.push(obj);
    }
    getCollisions() {
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = i + 1; j < this.objects.length; j++) {
                let collision = Collision.getCollision(this.objects[i], this.objects[j]);
                if (collision) {
                    this.collisions.push(collision);
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

    update() {
        //Iterate 20 times for collisions
        for (let i = 0; i < 20; i++) {
            this.getCollisions();
            this.resolveCollisions();
        }
        for (let object of this.objects) {
            object.update();
        }
    }
    draw() {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let object of this.objects) {
            object.draw();
        }
    }
}