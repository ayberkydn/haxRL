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

    copy() {
        return Object.assign(new Vector(0, 0), this);
    }
}