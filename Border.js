class Border extends Body {
    constructor(centerX, centerY, restitution, visible = true) {
        super(...arguments);
        this.center = new Vector(centerX, centerY);
        this.mass = Infinity;
        this.invMass = 0;
        this.color = Color.border;
        this.visible = visible;
        this.extendsTo = null;
    }
    update() {}

    extendTo(way) {
        this.extendsTo = way;
    }

    setColor(color) {
        this.color = color;
    }
}

class HorizontalBorder extends Border {
    constructor(centerX, centerY, length, restitution, visible) {
        super(centerX, centerY, restitution, visible);
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
    constructor(centerX, centerY, length, restitution, visible) {
        super(centerX, centerY, restitution, visible);
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