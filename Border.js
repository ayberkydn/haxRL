class Border extends Body {
    constructor(centerX, centerY, restitution, extendsTo, visible = true) {
        super(...arguments);
        this.center = new Vector(centerX, centerY);
        this.mass = Infinity;
        this.invMass = 0;
        this.color = Color.goal;
        this.visible = visible;
        this.extendsTo = null;
    }
    update() {}

    extendUp() {
        this.extendsTo = Way.up;
    }
    extendDown() {
        this.extendsTo = Way.down;
    }
    extendLeft() {
        this.extendsTo = Way.left;
    }
    extendRight() {
        this.extendsTo = Way.right;
    }

}

class HorizontalBorder extends Border {
    constructor(centerX, centerY, length, restitution, extendsTo, visible) {
        super(centerX, centerY, restitution, extendsTo, visible);
        this.length = length;
    }

    draw() {
        if (this.visible) {
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            let startX = this.center.x - this.length / 2;
            let startY = this.center.y;
            let endX = this.center.x + this.length / 2;
            let endY = startY;
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }


}

class VerticalBorder extends Border {
    constructor(centerX, centerY, length, restitution, extendsTo, visible) {
        super(centerX, centerY, restitution, extendsTo, visible);
        this.length = length;
    }

    draw() {
        if (this.visible) {
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            let startX = this.center.x;
            let startY = this.center.y - this.length / 2;
            let endX = startX;
            let endY = this.center.y + this.length / 2;
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
}