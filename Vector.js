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

    static add(vec1, vec2) {
        return vec1.copy().add(vec2);
    }

    sub(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    static sub(vec1, vec2) {
        return vec1.copy().sub(vec2);
    }

    normalize() {
        let norm = this.magnitude();
        this.x /= norm;
        this.y /= norm;
        return this;
    }

    static normalize(vec) {
        return vec.copy().normalize();
    }

    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    mult(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }

    static mult(vec1, n) {
        return vec1.copy().mult(n);
    }

    div(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }

    static div(vec1, n) {
        return vec1.copy().div(n);
    }

    inverse() {
        this.x -= 1;
        this.y -= 1;
        return this;
    }

    static inverse(vec1) {
        return vec1.copy().inverse();
    }

    static dot(vec1, vec2) {
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }

    static dist(vec1, vec2) {
        return Vector.sub(vec1, vec2).magnitude();
    }

    copy() {
        return Object.assign(new Vector(0, 0), this);
    }

    static get Unit() {
        return {
            up: new Vector(0, -1),
            upleft: new Vector(-Math.SQRT1_2, -Math.SQRT1_2),
            left: new Vector(-1, 0),
            downleft: new Vector(-Math.SQRT1_2, Math.SQRT1_2),
            down: new Vector(0, 1),
            downright: new Vector(Math.SQRT1_2, Math.SQRT1_2),
            right: new Vector(1, 0),
            upright: new Vector(Math.SQRT1_2, -Math.SQRT1_2),
        };
    }
}
