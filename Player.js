class Player extends CircularBody {
    constructor(initialLocationVec, radius, mass) {
        super(...arguments);
    }

    handleKeys() {

        //Handles pressed keys and applies corresponding forces

        let diagonal = (keys.ArrowUp ^ keys.ArrowDown) & (keys.ArrowLeft ^ keys.ArrowRight);
        if (keys.ArrowUp == true) {
            player.applyForce(new Vector(0, -1).mult(diagonal ? 1 / Math.SQRT2 : 1));
        }
        if (keys.ArrowDown == true) {
            player.applyForce(new Vector(0, 1).mult(diagonal ? 1 / Math.SQRT2 : 1));
        }
        if (keys.ArrowLeft == true) {
            player.applyForce(new Vector(-1, 0).mult(diagonal ? 1 / Math.SQRT2 : 1));
        }
        if (keys.ArrowRight == true) {
            player.applyForce(new Vector(1, 0).mult(diagonal ? 1 / Math.SQRT2 : 1));
        }
    }

    update() {
        this.handleKeys();
        super.update();
    }
}