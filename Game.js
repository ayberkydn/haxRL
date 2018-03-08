class Game {
    constructor() {
        this.scene = new Scene();
        let ball = new Ball(canvas.width / 2, canvas.height / 2, ballRadius, ballMass, ballRestitution, ballDamping);
        let outerBox = new Box(0, canvas.width, 0, canvas.height - 0, 0);
        let topBorder = new HorizontalBorder(canvas.width / 2, topbottomMargin, canvas.width - 2 * leftrightMargin, borderRestitution);
        topBorder.extendTo(Way.up);
        let bottomBorder = new HorizontalBorder(canvas.width / 2, canvas.height - topbottomMargin, canvas.width - 2 * leftrightMargin, borderRestitution);
        bottomBorder.extendTo(Way.down);
        let leftBorderUp = new VerticalBorder(leftrightMargin, (canvas.height / 2 - goalLength / 2 + topbottomMargin) / 2, canvas.height / 2 - topbottomMargin - goalLength / 2, borderRestitution);
        leftBorderUp.extendTo(Way.left);
        let leftBorderDown = new VerticalBorder(leftrightMargin, canvas.height - (canvas.height / 2 - goalLength / 2 + topbottomMargin) / 2, canvas.height / 2 - topbottomMargin - goalLength / 2, borderRestitution);
        leftBorderDown.extendTo(Way.left);
        let rightBorderUp = new VerticalBorder(canvas.width - leftrightMargin, (canvas.height / 2 - goalLength / 2 + topbottomMargin) / 2, canvas.height / 2 - topbottomMargin - goalLength / 2, borderRestitution);
        rightBorderUp.extendTo(Way.right);
        let rightBorderDown = new VerticalBorder(canvas.width - leftrightMargin, canvas.height - (canvas.height / 2 - goalLength / 2 + topbottomMargin) / 2, canvas.height / 2 - topbottomMargin - goalLength / 2, borderRestitution);
        rightBorderDown.extendTo(Way.right);
        this.scene.addObject(ball);
        this.scene.addObject(player1);
        this.scene.addObject(player2);
        this.scene.addObject(outerBox);
        this.scene.addObject(topBorder);
        this.scene.addObject(bottomBorder);
        this.scene.addObject(leftBorderUp);
        this.scene.addObject(leftBorderDown);
        this.scene.addObject(rightBorderUp);
        this.scene.addObject(rightBorderDown);
        this.scene.addObject(new Goal(leftrightMargin, canvas.height / 2, Way.left, goalLength));
        this.scene.addObject(new Goal(canvas.width - leftrightMargin, canvas.height / 2, Way.right, goalLength));

        this.agents = {
            red: null,
            blue: null,
        }
    }

    addAgent(side, agent) {

    }

    reset() {

    }

    update() {
        this.scene.update();
    }

    draw() {
        this.scene.draw();
    }
}