class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    sub(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }
    normalize() {
        let norm = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        this.x /= norm;
        this.y /= norm;
        return this;
    }
    mult(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }
    div(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }
    copy() {
        return Object.assign(new Vector(0, 0), this);
    }
}
