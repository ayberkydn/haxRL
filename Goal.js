class Goal {
    constructor(centerX, centerY, way, length) {
        this.center = new Vector(centerX, centerY);
        this.way = way;
        this.length = length;
        this.depth = 30;

        if (this.way == Way.left) {
            this.depthMargin = this.depth;
        } else if (this.way == Way.right) {
            this.depthMargin = -this.depth;
        }

        this.topPost = new Disc(centerX, centerY - this.length / 2, 7, Infinity, 0.2, 0).setColor(Color.border);
        this.bottomPost = new Disc(centerX, centerY + this.length / 2, 7, Infinity, 0.2, 0).setColor(Color.border);
        this.goalLine = new VerticalBorder(centerX, centerY, this.length, 1);

        this.netBack = new VerticalBorder(centerX - this.depthMargin, centerY, this.length, 0).setColor(Color.black).setCollisionMask([Ball]).extendTo(this.way);
        this.netTop = new HorizontalBorder(centerX - this.depthMargin / 2, centerY - this.length / 2, this.depth, 0).setColor(Color.black).setCollisionMask([Ball]).extendTo(Way.up);
        this.netBottom = new HorizontalBorder(centerX - this.depthMargin / 2, centerY + this.length / 2, this.depth, 0).setColor(Color.black).setCollisionMask([Ball]).extendTo(Way.down);

    }

    checkGoal(ball) {
        if (!(ball instanceof Ball)) {
            return false;
        }
        if (this.way == Way.left) {
            if (ball.center.x < this.center.x && ball.center.y > this.topPost.center.y && ball.center.y < this.bottomPost.center.y) {
                return true;
            } else {
                return false;
            }
        } else if (this.way == Way.right) {
            if (ball.center.x > this.center.x && ball.center.y > this.topPost.center.y && ball.center.y < this.bottomPost.center.y) {
                return true;
            } else {
                return false;
            }
        }
    }
}
