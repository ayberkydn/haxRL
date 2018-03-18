class Environment {
    constructor(render = true, sound = true, resetDelay = true, randomStart = true) {
        this.render = render;
        this.sound = sound;
        this.resetDelay = resetDelay;
        this.randomStart = randomStart;
        this.agents = [];
        this.state = {
            episodeEnd: false,
        };
        this.episodeEndChecker = () => (this.scene.checkGoals() && !this.state.episodeEnd);
        this.step = 0;

        this.scene = new Scene();
        this.scene.addObject(new Box(0, canvas.width, 0, canvas.height - 0, 0));
        this.scene.addObject(new Disc(canvas.width / 2, canvas.height / 2, 80, 10, 1, 1).makeGhost().makeHollow().setOuterColor(Color.border));
        this.scene.addObject(new VerticalBorder(canvas.width / 2, canvas.height / 2, canvas.height - 2 * topbottomMargin, null).makeGhost());


        this.scene.addObject(new HorizontalBorder(canvas.width / 2, topbottomMargin, canvas.width - 2 * leftrightMargin, borderRestitution).extendTo(Way.up).setCollisionMask([Ball]));
        this.scene.addObject(new HorizontalBorder(canvas.width / 2, canvas.height - topbottomMargin, canvas.width - 2 * leftrightMargin, borderRestitution).extendTo(Way.down).setCollisionMask([Ball]));
        this.scene.addObject(new VerticalBorder(leftrightMargin, (canvas.height / 2 - goalLength / 2 + topbottomMargin) / 2, canvas.height / 2 - topbottomMargin - goalLength / 2, borderRestitution).extendTo(Way.left).setCollisionMask([Ball]));
        this.scene.addObject(new VerticalBorder(leftrightMargin, canvas.height - (canvas.height / 2 - goalLength / 2 + topbottomMargin) / 2, canvas.height / 2 - topbottomMargin - goalLength / 2, borderRestitution).extendTo(Way.left).setCollisionMask([Ball]));
        this.scene.addObject(new VerticalBorder(canvas.width - leftrightMargin, (canvas.height / 2 - goalLength / 2 + topbottomMargin) / 2, canvas.height / 2 - topbottomMargin - goalLength / 2, borderRestitution).extendTo(Way.right).setCollisionMask([Ball]));
        this.scene.addObject(new VerticalBorder(canvas.width - leftrightMargin, canvas.height - (canvas.height / 2 - goalLength / 2 + topbottomMargin) / 2, canvas.height / 2 - topbottomMargin - goalLength / 2, borderRestitution).extendTo(Way.right).setCollisionMask([Ball]));
        this.scene.addObject(new Goal(leftrightMargin, canvas.height / 2, Way.left, goalLength));
        this.scene.addObject(new Goal(canvas.width - leftrightMargin, canvas.height / 2, Way.right, goalLength));
        this.scene.addObject(new Ball(canvas.width / 2, canvas.height / 2, ballRadius, ballMass, ballRestitution, ballDamping));
    }

    addAgent(agent, side) {
        agent.game = this;
        agent.setSide(side);
        this.agents.push(agent);
        this.scene.addObject(agent.player);
    }

    resetScene() {
        this.scene.reset();
        this.state.episodeEnd = false;
        if (this.randomStart) {
            this.scene.metaObjects.balls[0].applyImpulse(new Vector(Math.random() - 0.5, Math.random() - 0.5).mult(20));
        }
    }

    update() {
        for (let agent of this.agents) {
            agent.act();
        }

        this.scene.update();
        if (this.episodeEndChecker()) {
            this.state.episodeEnd = true;
            window.setTimeout(this.resetScene.bind(this), this.resetDelay ? 2500 : 0);
            if (this.sound == true) {
                new Audio("goalsound.mp3").play();
            }
        }

        for (let agent of this.agents) {
            agent.learn();
        }
        this.step += 1;
    }

    draw() {
        if (this.render == true) {
            this.scene.draw();
        }
    }
}
