class Scene {
    constructor() {
        this.objects = [];
    }
    addObject(obj) {
        this.objects.push(obj);
    }
    checkCollision() {
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = i + 1; j < this.objects.length; j++) {
                objects[i].checkCollisionWith(objects[j]);
            }
        }
    }
    update() {
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