class Box {
    constructor(xLeft, xRight, yUp, yDown, r) {
        let horizLength = xRight - xLeft;
        let vertLength = yDown - yUp;
        if (horizLength <= 0 || vertLength <= 0) {
            throw "Invalid box locations, check the parameters";
        }
        this.borders = {
            up: new HorizontalBorder(
                centerX = (xLeft + xRight) / 2,
                centerY = yUp,
                length = horizLength,
                restitution = r),

            down: new HorizontalBorder(
                centerX = (xLeft + xRight) / 2,
                centerY = yDown,
                length = horizLength,
                restitution = r),

            left: new VerticalBorder(
                centerX = xLeft,
                centerY = (yUp + yDown) / 2,
                length = vertLength,
                restitution = r),

            right: new VerticalBorder(
                centerX = xRight,
                centerY = (yUp + yDown) / 2,
                length = vertLength,
                restitution = r),
        };

        this.borders.up.extendTo(Way.up);
        this.borders.down.extendTo(Way.down);
        this.borders.left.extendTo(Way.left);
        this.borders.right.extendTo(Way.right);

    }

    draw() {
        for (let borderKey in this.borders) {
            this.borders[borderKey].draw();
        }
    }

    update() {}
}