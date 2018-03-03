class Border extends Body {
    constructor(centerX, centerY, restitution) {
        super(...arguments);
        this.center = new Vector(centerX, centerY);
        this.mass = Infinity;
        this.invMass = 0;
        this.color = "#C7E6BD";
    }
    update() {}

}

class ArcBorder extends Border {
    constructor(centerX, centerY, startAngle, endAngle, radius) {
        super(centerX, centerY);
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.radius = radius;
    }
}

class HorizontalBorder extends Border {
    constructor(centerX, centerY, length, restitution) {
        super(centerX, centerY, restitution);
        this.length = length;
    }

    draw() {
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

class VerticalBorder extends Border {
    constructor(centerX, centerY, length, restitution) {
        super(centerX, centerY, restitution);
        this.length = length;
    }

    draw() {
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