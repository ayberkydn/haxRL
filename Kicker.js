class Kicker extends Body {
    constructor(player, kickPower) {
        super(player.centerX, player.centerY, 0);
        this.outerColor = Color.white;
        this.hollow = true;
        this.color = Color.black;
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
        this.color = Color.white;
    }

    deactivate() {
        this.active = false;
        this.color = Color.black;
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