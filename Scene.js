class Scene {
    constructor() {
        this.objects = [];
        this.collisions = [];
    }
    addObject(obj) {
        this.objects.push(obj);
    }
    checkCollisions() {
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = i + 1; j < this.objects.length; j++) {
                let colliding = this.objects[i].checkCollisionWith(this.objects[j]);
                if (colliding == true) {
                    this.collisions.push(new Collision(this.objects[i], this.objects[j]));
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
        this.checkCollisions();
        this.resolveCollisions();
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