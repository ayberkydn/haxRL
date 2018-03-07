class Kicker {
    constructor(player, kickPower) {
        this.player = player;
        this.active = false;
        this.kickPower = kickPower;
        this.radius = player.radius + 3.5;
        this.center = player.center;
    }

    update() {
        this.center = this.player.center;
    }

    activate() {
        this.active = true;
    }

    deactivate() {
        this.active = false;
    }

    draw() {
        if (this.active) {
            ctx.strokeStyle = Color.white;
            ctx.beginPath();
            ctx.arc(this.player.center.x, this.player.center.y, this.player.radius, 0, 2 * Math.PI);
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }


}