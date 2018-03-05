class Box {
    constructor(xLeft, xRight, yUp, yDown, restitution) {
        let horizLength = xRight - xLeft;
        let vertLength = yDown - yUp;
        if (horizLength <= 0 || vertLength <= 0) {
            throw "Invalid box locations, check the parameters";
        }
        this.borders = {
            up: new HorizontalBorder((xLeft + xRight) / 2, yUp, horizLength, restitution),
            down: new HorizontalBorder((xLeft + xRight) / 2, yDown, horizLength, restitution),
            left: new VerticalBorder(xLeft, (yUp + yDown) / 2, vertLength, restitution),
            right: new VerticalBorder(xRight, (yUp + yDown) / 2, vertLength, restitution),
        };


    }

    draw() {
        for (let borderKey in this.borders) {
            this.borders[borderKey].draw();
        }
    }

    update() {}
}