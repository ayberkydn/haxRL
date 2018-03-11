class Game {
    constructor() {
        this.agents = [];
        this.scene = new Scene();
        this.scene.addObject(new Ball(canvas.width / 2, canvas.height / 2, ballRadius, ballMass, ballRestitution, ballDamping));
        this.scene.addObject(new Box(0, canvas.width, 0, canvas.height - 0, 0));
        this.scene.addObject(new HorizontalBorder(canvas.width / 2, topbottomMargin, canvas.width - 2 * leftrightMargin, borderRestitution).extendTo(Way.up));
        this.scene.addObject(new HorizontalBorder(canvas.width / 2, canvas.height - topbottomMargin, canvas.width - 2 * leftrightMargin, borderRestitution).extendTo(Way.down));
        this.scene.addObject(new VerticalBorder(leftrightMargin, (canvas.height / 2 - goalLength / 2 + topbottomMargin) / 2, canvas.height / 2 - topbottomMargin - goalLength / 2, borderRestitution).extendTo(Way.left));
        this.scene.addObject(new VerticalBorder(leftrightMargin, canvas.height - (canvas.height / 2 - goalLength / 2 + topbottomMargin) / 2, canvas.height / 2 - topbottomMargin - goalLength / 2, borderRestitution).extendTo(Way.left));
        this.scene.addObject(new VerticalBorder(canvas.width - leftrightMargin, (canvas.height / 2 - goalLength / 2 + topbottomMargin) / 2, canvas.height / 2 - topbottomMargin - goalLength / 2, borderRestitution).extendTo(Way.right));
        this.scene.addObject(new VerticalBorder(canvas.width - leftrightMargin, canvas.height - (canvas.height / 2 - goalLength / 2 + topbottomMargin) / 2, canvas.height / 2 - topbottomMargin - goalLength / 2, borderRestitution).extendTo(Way.right));
        this.scene.addObject(new Goal(leftrightMargin, canvas.height / 2, Way.left, goalLength));
        this.scene.addObject(new Goal(canvas.width - leftrightMargin, canvas.height / 2, Way.right, goalLength));
        this.redStartX = 100;
        this.blueStartX = 700;
    }

    addAgent(agent) {
        agent.game = this;
        this.agents.push(agent);
        this.scene.addObject(agent.player);
    }

    reset() {
        this.scene.objects.players[0].center.x = this.redStartX;
        this.scene.objects.players[0].center.y = canvas.height / 2;
        this.scene.objects.players[0].velocity.mult(0);
        this.scene.objects.players[1].center.x = this.blueStartX;
        this.scene.objects.players[1].center.y = canvas.height / 2;
        this.scene.objects.players[1].velocity.mult(0);
        this.scene.objects.balls[0].center.x = canvas.width / 2;
        this.scene.objects.balls[0].center.y = canvas.height / 2;
        this.scene.objects.balls[0].velocity.mult(0);
    }

    update() {
        for (let agent of this.agents) {
            agent.act();
            agent.learn();
        }
        this.scene.update();
        if (this.scene.checkGoals() == true) {
            this.reset();

        }
    }

    draw() {
        this.scene.draw();
    }
}