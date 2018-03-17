class Environment {
    constructor() {
        this.agents = [];

        this.state = {
            goal: false,
        };

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

    addAgent(agent) {
        agent.game = this;
        this.agents.push(agent);
        this.scene.addObject(agent.player);
    }

    addScene(scene) {

    }

    resetScene() {
        this.scene.reset();
        this.state.goal = false;
    }

    update() {
        for (let agent of this.agents) {
            agent.act();
        }

        this.scene.update();
        if (this.scene.checkGoals() && !this.state.goal) {
            this.state.goal = true;
            window.setTimeout(this.resetScene.bind(this), 2500);
            new Audio("goalsound.mp3").play();
        }

        for (let agent of this.agents) {
            agent.learn();
        }
    }

    draw() {
        this.scene.draw();
    }
}