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