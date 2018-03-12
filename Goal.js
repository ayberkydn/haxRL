class Goal {
    constructor(centerX, centerY, way, length) {
        this.center = new Vector(centerX, centerY);
        this.way = way;
        this.length = length;
        this.topPost = new Disc(centerX, centerY - this.length / 2, 6, Infinity, 0.2, 0).setColor(Color.border);
        this.bottomPost = new Disc(centerX, centerY + this.length / 2, 6, Infinity, 0.2, 0).setColor(Color.border);
        this.goalLine = new VerticalBorder(centerX, centerY, this.length, 1);
    }
    update() {}

    draw() {
        this.topPost.draw();
        this.bottomPost.draw();
        this.goalLine.draw();
    }

    checkGoal(ball) {
        if (!(ball instanceof Ball)) {
            return false;
        }
        if (this.way == Way.left) {
            if (ball.center.x < this.center.x && ball.center.y > this.topPost.center.y && ball.center.y < this.bottomPost.center.y) {
                new Audio("goalsound.mp3").play();
                return true;
            } else {
                return false;
            }
        } else if (this.way == Way.right) {
            if (ball.center.x > this.center.x && ball.center.y > this.topPost.center.y && ball.center.y < this.bottomPost.center.y) {
                new Audio("goalsound.mp3").play();
                return true;
            } else {
                return false;
            }
        }
    }
}