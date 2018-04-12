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
