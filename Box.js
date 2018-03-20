class Box {
    constructor(xLeft, xRight, yUp, yDown, r) {
        let horizLength = xRight - xLeft;
        let vertLength = yDown - yUp;
        if (horizLength <= 0 || vertLength <= 0) {
            throw "Invalid box locations, check the parameters";
        }
        this.borders = {
            up: new HorizontalBorder((xLeft + xRight) / 2, yUp, horizLength, r),

            down: new HorizontalBorder((xLeft + xRight) / 2, yDown, horizLength, r),

            left: new VerticalBorder(xLeft, (yUp + yDown) / 2, vertLength, r),

            right: new VerticalBorder(xRight, (yUp + yDown) / 2, vertLength, r),
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
