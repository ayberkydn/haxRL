class Collision {
    constructor(object1, object2) {
        this.object1 = object1;
        this.object2 = object2;
    }

    resolve() {
        //TODO
        //Apply corresponding forces to colliding objects
        let delta = this.object1.location.copy().sub(this.object2.location);
        this.object1.applyForce(delta);
        this.object2.applyForce(delta.mult(-1));
        console.log(delta);

    }
}