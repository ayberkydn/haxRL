class Environment {
    constructor(render = true, sound = true, resetDelay = true, randomStart = true) {
        this.render = render;
        this.sound = sound;
        this.resetDelay = resetDelay;
        this.randomStart = randomStart;
        this.agents = [];
        this.episodeEnd = false;
        //this.episodeEndChecker = () => (this.scene.checkGoals() && !this.episodeEnd);
        this.episode = 1;
        this.episodeEndChecker = () => (this.scene.checkGoals() || this.step == 2000);
        this.step = 0;

        this.scene = new Scene();
        this.scene.addObject(new Box(0, cWidth, 0, cHeight - 0, 0));
        this.scene.addObject(new Disc(cWidth / 2, cHeight / 2, middleFieldRadius, 10, 1, 1).makeGhost().makeHollow().setOuterColor(Color.border));
        this.scene.addObject(new VerticalBorder(cWidth / 2, cHeight / 2, cHeight - 2 * topbottomMargin, null).makeGhost());


        this.scene.addObject(new HorizontalBorder(cWidth / 2, topbottomMargin, cWidth - 2 * leftrightMargin, borderRestitution).extendTo(Way.up).setCollisionMask([Ball]));
        this.scene.addObject(new HorizontalBorder(cWidth / 2, cHeight - topbottomMargin, cWidth - 2 * leftrightMargin, borderRestitution).extendTo(Way.down).setCollisionMask([Ball]));
        this.scene.addObject(new VerticalBorder(leftrightMargin, (cHeight / 2 - goalLength / 2 + topbottomMargin) / 2, cHeight / 2 - topbottomMargin - goalLength / 2, borderRestitution).extendTo(Way.left).setCollisionMask([Ball]));
        this.scene.addObject(new VerticalBorder(leftrightMargin, cHeight - (cHeight / 2 - goalLength / 2 + topbottomMargin) / 2, cHeight / 2 - topbottomMargin - goalLength / 2, borderRestitution).extendTo(Way.left).setCollisionMask([Ball]));
        this.scene.addObject(new VerticalBorder(cWidth - leftrightMargin, (cHeight / 2 - goalLength / 2 + topbottomMargin) / 2, cHeight / 2 - topbottomMargin - goalLength / 2, borderRestitution).extendTo(Way.right).setCollisionMask([Ball]));
        this.scene.addObject(new VerticalBorder(cWidth - leftrightMargin, cHeight - (cHeight / 2 - goalLength / 2 + topbottomMargin) / 2, cHeight / 2 - topbottomMargin - goalLength / 2, borderRestitution).extendTo(Way.right).setCollisionMask([Ball]));
        this.scene.addObject(new Goal(leftrightMargin, cHeight / 2, Way.left, goalLength));
        this.scene.addObject(new Goal(cWidth - leftrightMargin, cHeight / 2, Way.right, goalLength));
        this.scene.addObject(new Ball(cWidth / 2, cHeight / 2, ballRadius, ballMass, ballRestitution, ballDamping));
    }

    addAgent(agent, side) {
        agent.env = this;
        agent.setSide(side);
        this.agents.push(agent);
        this.scene.addObject(agent.player);
        agent.ball = this.scene.metaObjects.balls[0];
        if (this.agents.length == 2) {
            this.agents[0].opponent = this.agents[1];
            this.agents[1].opponent = this.agents[0];
        }
    }

    linkAgentsExperience() {
        if (this.agents[0] instanceof NNQLearnerAgent && this.agents[1] instanceof NNQLearnerAgent) {
            this.agents[0].experienceReplay = this.agents[1].experienceReplay;
            console.log("Experience linking successful.");
        } else {
            throw "Agents missing or incompatible for exp linking";
        }
    }

    resetScene() {
        this.scene.reset();
        this.episodeEnd = false;
        if (this.randomStart) {
            this.scene.metaObjects.balls[0].applyImpulse(new Vector(Math.random() - 0.5, Math.random() - 0.5).mult(20));
        }
        this.step = 0;
    }

    update() {

        for (let agent of this.agents) {
            agent.act();
        }

        this.scene.update();

        if (this.episodeEndChecker()) {
            this.episodeEnd = true;
            console.clear();
        }


        for (let agent of this.agents) {
            agent.learn();
        }

        if (this.episodeEnd == true) {
            if (this.resetDelay) {
                window.setTimeout(this.resetScene.bind(this), 2500);
            } else {
                this.resetScene();
            }
            if (this.sound == true) {
                new Audio("goalsound.mp3").play();
            }
        }

        this.step += 1;
    }

    draw() {
        if (this.render == true) {
            this.scene.draw();
        }
    }
}
