var dl = require("deeplearn");
var math = require("mathjs");
var cHeight = 600;
var cWidth = 800;
var tensorToMatrix = a => math.matrix(Array.from(a.dataSync())).reshape(a.shape);
var tensorToArray = a => math.matrix(Array.from(a.dataSync())).reshape(a.shape)._data;
var matrixToTensor = a => dl.tensor(a._data);


class NeuralNetwork {
    constructor(nIn, nHidden, nOut) {
        this.nIn = nIn;
        this.nHidden = nHidden;
        this.nOut = nOut;
        this.lossFunc = function () {
            throw "loss function not implemented";
        };

        this.optimizer = dl.train.sgd(0.001);

        this.W1 = dl.variable(dl.randomNormal([nIn, nHidden]).mul(dl.scalar(2 / (nIn + nHidden))));
        this.b1 = dl.variable(dl.zeros([nHidden]));
        this.W2 = dl.variable(dl.randomNormal([nHidden, nOut]).mul(dl.scalar(2 / (nHidden + nOut))));
        this.b2 = dl.variable(dl.zeros([nOut]));

    }


    copyWeightsFrom(nn2) {
        this.W1 = nn2.W1.clone();
        this.b1 = nn2.b1.clone();
        this.W2 = nn2.W2.clone();
        this.b2 = nn2.b2.clone();
    }


    setLoss(lossFunc) {
        if (lossFunc == "mse") {
            this.lossFunc = (logits, labels) => {
                let mse = dl.mean(dl.square(dl.sub(logits, labels)));
                return mse;
            };
        } else if (lossFunc == "softmaxcrossentropy") {
            this.lossFunc = (logits, labels) => {
                let xEntropy = dl.losses.softmaxCrossEntropy(logits, labels);
                return xEntropy.mean();
            };
        }
        return this;
    }

    setOptimizer(optimizer) {
        this.optimizer = optimizer;
        return this;
    }

    predict(inputMatrix, returnScore = false) {

        return dl.tidy(() => {
            let out = this._forward(inputMatrix);
            if (returnScore) {
                return tensorToArray(dl.max(out, 1));
            } else {
                return tensorToArray(dl.argMax(out, 1));
            }

        });
    }


    _forward(inputMatrix) {
        return dl.tidy(() => {
            let x = dl.tensor(inputMatrix);
            x = (x.rank == 1 ? x.expandDims(0) : x);
            let hiddenOut = x.matMul(this.W1).add(this.b1);
            hiddenOut = dl.tanh(hiddenOut);
            let out = hiddenOut.matMul(this.W2);
            return out;
        });
    }

    forward(inputMatrix) {
        return dl.tidy(() => {
            let out = this._forward(inputMatrix);
            return tensorToArray(out);
        });
    }


    _loss(inputMatrix, labelsArray) {
        return dl.tidy(() => {
            let logits = this._forward(inputMatrix);
            let labels = dl.tensor(labelsArray);
            let loss = this.lossFunc(labels, logits);
            return loss;
        });
    }

    loss(inputMatrix, labelsArray) {
        return dl.tidy(() => {
            let loss = this._loss(inputMatrix, labelsArray);
            return loss.dataSync()[0];
        });
    }

    trainStep(X, y) {
        this.optimizer.minimize(() => this._loss(X, y));
    }

}class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    static add(vec1, vec2) {
        return vec1.copy().add(vec2);
    }

    sub(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    static sub(vec1, vec2) {
        return vec1.copy().sub(vec2);
    }

    normalize() {
        let norm = this.magnitude();
        this.x /= norm;
        this.y /= norm;
        return this;
    }

    static normalize(vec) {
        return vec.copy().normalize();
    }

    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    mult(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }

    static mult(vec1, n) {
        return vec1.copy().mult(n);
    }

    div(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }

    static div(vec1, n) {
        return vec1.copy().div(n);
    }

    inverse() {
        this.x -= 1;
        this.y -= 1;
        return this;
    }

    static inverse(vec1) {
        return vec1.copy().inverse();
    }

    static dot(vec1, vec2) {
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }

    static dist(vec1, vec2) {
        return Vector.sub(vec1, vec2).magnitude();
    }

    copy() {
        return Object.assign(new Vector(0, 0), this);
    }

    static get Unit() {
        return {
            up: new Vector(0, -1),
            upleft: new Vector(-Math.SQRT1_2, -Math.SQRT1_2),
            left: new Vector(-1, 0),
            downleft: new Vector(-Math.SQRT1_2, Math.SQRT1_2),
            down: new Vector(0, 1),
            downright: new Vector(Math.SQRT1_2, Math.SQRT1_2),
            right: new Vector(1, 0),
            upright: new Vector(Math.SQRT1_2, -Math.SQRT1_2),
        };
    }
}
var Action = {
    up: "ACTION_UP",
    upleft: "ACTION_UP_LEFT",
    left: "ACTION_LEFT",
    downleft: "ACTION_DOWN_LEFT",
    down: "ACTION_DOWN",
    downright: "ACTION_DOWN_RIGHT",
    right: "ACTION_RIGHT",
    upright: "ACTION_UP_RIGHT",
    nomove: "ACTION_NOMOVE",
    upshoot: "ACTION_UP_SHOOT",
    upleftshoot: "ACTION_UP_LEFT_SHOOT",
    leftshoot: "ACTION_LEFT_SHOOT",
    downleftshoot: "ACTION_DOWN_LEFT_SHOOT",
    downshoot: "ACTION_DOWN_SHOOT",
    downrightshoot: "ACTION_DOWN_RIGHT_SHOOT",
    rightshoot: "ACTION_RIGHT_SHOOT",
    uprightshoot: "ACTION_UP_RIGHT_SHOOT",
    nomoveshoot: "ACTION_NOMOVE_SHOOT",
};

var ActionV = {
    up: "ACTION_VERTICAL_UP",
    down: "ACTION_VERTICAL_DOWN",
    nomove: "ACTION_VERTICAL_NOMOVE"
};

var ActionH = {
    forward: "ACTION_HORIZONTAL_FORWARD",
    backward: "ACTION_HORIZONTAL_BACKWARD",
    nomove: "ACTION_HORIZONTAL_NOMOVE"
};

var ActionS = {
    shoot: "ACTION_SHOOT_TRUE",
    nomove: "ACTION_SHOOT_FALSE",
};var Side = {
    red: "SIDE_RED",
    blue: "SIDE_BLUE",
};

var Color = {
    red: "#E56E56",
    blue: "#5689E5",
    green: "#688F56",
    black: "#000000",
    white: "#FFFFFF",
    border: "#C7E6BD",
};
var Way = {
    up: "WAY_UP",
    down: "WAY_DOWN",
    left: "WAY_LEFT",
    right: "WAY_RIGHT",
};
class Body {
    constructor(centerX, centerY, restitution) {
        this.center = new Vector(centerX, centerY);
        this.restitution = restitution;
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.collisionMask = [Body];
    }

    applyForce() {
        throw "applyForce not implemented";
    }
    applyImpulse() {
        throw "applyImpulse not implemented";
    }
    update() {
        throw "update not implemented";
    }
    draw() {
        throw "draw not implemented";
    }

    setCollisionMask(maskArray) {
        this.collisionMask = maskArray;
        return this;
    }

    makeGhost() {
        this.collisionMask = [];
        return this;
    }

    setColor(color) {
        this.color = color;
        return this;
    }

    setOuterColor(color) {
        this.outerColor = color;
        return this;
    }


}
class Disc extends Body {
    constructor(centerX, centerY, radius, mass, restitution, damping, color) {
        super(centerX, centerY, restitution);
        this.radius = radius;
        this.mass = mass;
        this.invMass = 1 / this.mass;
        this.color = color;
        this.damping = damping;
        this.hollow = false;
        this.outerColor = Color.black;
    }

    makeHollow() {
        this.hollow = true;
        return this;
    }


    applyForce(forceVec) {
        let accelerationDelta = Vector.div(forceVec, this.mass);
        this.acceleration.add(accelerationDelta);
    }

    applyImpulse(impulseVec) {
        let velocityDelta = Vector.div(impulseVec, this.mass);
        this.velocity.add(velocityDelta);
    }

    update() {
        this.center.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.mult(this.damping);
        this.acceleration.mult(0);
    }

    draw() {
        if (this.hollow == false) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.strokeStyle = this.outerColor;
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
class Ball extends Disc {
    constructor(initialX, initialY, radius, mass) {
        super(...arguments, Color.white);
    }
}
class Player extends Disc {
    constructor(centerX, centerY, radius, mass, restitution, damping, kickDamping, kickPower, color) {
        super(centerX, centerY, radius, mass, restitution, damping, color);
        this.agent = null;
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.nonkickDamping = damping;
        this.kickDamping = kickDamping;
        this.kicker = new Kicker(this, kickPower);
    }

    applyAction(action) {
        if (action == Action.up) {
            this.applyForce(Vector.Unit.up);
            this.kicker.active = false;
        } else if (action == Action.upleft) {
            this.applyForce(Vector.Unit.upleft);
            this.kicker.active = false;
        } else if (action == Action.left) {
            this.applyForce(Vector.Unit.left);
            this.kicker.active = false;
        } else if (action == Action.downleft) {
            this.applyForce(Vector.Unit.downleft);
            this.kicker.active = false;
        } else if (action == Action.down) {
            this.applyForce(Vector.Unit.down);
            this.kicker.active = false;
        } else if (action == Action.downright) {
            this.applyForce(Vector.Unit.downright);
            this.kicker.active = false;
        } else if (action == Action.right) {
            this.applyForce(Vector.Unit.right);
            this.kicker.active = false;
        } else if (action == Action.upright) {
            this.applyForce(Vector.Unit.upright);
            this.kicker.active = false;
        } else if (action == Action.upshoot) {
            this.applyForce(Vector.Unit.up);
            this.kicker.active = true;
        } else if (action == Action.upleftshoot) {
            this.applyForce(Vector.Unit.upleft);
            this.kicker.active = true;
        } else if (action == Action.leftshoot) {
            this.applyForce(Vector.Unit.left);
            this.kicker.active = true;
        } else if (action == Action.downleftshoot) {
            this.applyForce(Vector.Unit.downleft);
            this.kicker.active = true;
        } else if (action == Action.downshoot) {
            this.applyForce(Vector.Unit.down);
            this.kicker.active = true;
        } else if (action == Action.downrightshoot) {
            this.applyForce(Vector.Unit.downright);
            this.kicker.active = true;
        } else if (action == Action.rightshoot) {
            this.applyForce(Vector.Unit.right);
            this.kicker.active = true;
        } else if (action == Action.uprightshoot) {
            this.applyForce(Vector.Unit.upright);
            this.kicker.active = true;
        } else if (action == Action.nomove) {
            this.kicker.active = false;
        } else if (action == Action.nomoveshoot) {
            this.kicker.active = true;
        }

    }



    applyActionHVS(actionH, actionV, actionS) {
        // TODO
        // HVS sirasında degilse exception yolla
        let diagonal = (actionH != ActionH.nomove) && (actionV != ActionV.nomove);
        let diagonalScale = diagonal ? Math.SQRT1_2 : 1;
        let shoot = (actionS == ActionS.shoot);

        if (actionH == ActionH.forward) {
            let forwardVec = this.agent.side == Side.red ? Vector.Unit.right : Vector.Unit.left;
            this.applyForce(Vector.mult(forwardVec, diagonalScale));
        } else if (actionH == ActionH.backward) {
            let backwardVec = this.agent.side == Side.red ? Vector.Unit.left : Vector.Unit.right;
            this.applyForce(Vector.mult(backwardVec, diagonalScale));
        }

        if (actionV == ActionV.up) {
            this.applyForce(Vector.mult(Vector.Unit.up, diagonalScale));
        } else if (actionV == ActionV.down) {
            this.applyForce(Vector.mult(Vector.Unit.down, diagonalScale));
        }

        if (actionS == ActionS.shoot) {
            this.kicker.activate();
        } else if (actionS == ActionS.nomove) {
            this.kicker.deactivate();
        }










    }


    update() {
        if (this.kicker.active) {
            this.damping = this.kickDamping;
        } else {
            this.damping = this.nonkickDamping;
        }
        super.update();
    }

    draw() {
        super.draw();
        this.kicker.draw();
    }
}class Kicker extends Body {
    constructor(player, kickPower) {
        super();
        this.outerColor = Color.white;
        this.hollow = true;
        this.color = Color.black;
        this.player = player;
        this.active = false;
        this.kickPower = kickPower;
        this.radius = player.radius + 3.5;
        this.center = player.center;
    }

    update() {
        this.center = this.player.center;
    }

    activate() {
        this.active = true;
        this.color = Color.white;
    }

    deactivate() {
        this.active = false;
        this.color = Color.black;
    }

    draw() {
        if (this.active) {
            ctx.strokeStyle = Color.white;
            ctx.beginPath();
            ctx.arc(this.player.center.x, this.player.center.y, this.player.radius, 0, 2 * Math.PI);
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }


}
class Border extends Body {
    constructor(centerX, centerY, restitution, visible = true, ghost = false) {
        super(...arguments);
        this.center = new Vector(centerX, centerY);
        this.mass = Infinity;
        this.invMass = 0;
        this.color = Color.border;
        this.visible = visible;
        this.extendsTo = null;
        this.collisionMask = [Disc];
    }
    update() { //do nothing
    }
    applyImpulse() { //do nothing
    }

    extendTo(way) {
        this.extendsTo = way;
        return this;
    }
}
class HorizontalBorder extends Border {
    constructor(centerX, centerY, length, restitution, visible) {
        super(centerX, centerY, restitution, visible);
        this.length = length;
    }

    draw() {
        if (this.visible) {
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            let startX = this.center.x - this.length / 2;
            let startY = this.center.y;
            let endX = this.center.x + this.length / 2;
            let endY = startY;
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }


}
class VerticalBorder extends Border {
    constructor(centerX, centerY, length, restitution, visible) {
        super(centerX, centerY, restitution, visible);
        this.length = length;
    }

    draw() {
        if (this.visible) {
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            let startX = this.center.x;
            let startY = this.center.y - this.length / 2;
            let endX = startX;
            let endY = this.center.y + this.length / 2;
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
}
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
}class Collision {
    constructor(body1, body2) {
        this.body1 = body1;
        this.body2 = body2;
        this.restitution = Math.min(this.body1.restitution, this.body2.restitution);
    }


    resolve() {
        //Apply corresponding forces/impulses to colliding objects

        this.resolveImpulse();
        this.resolvePenetration();

    }

    resolveImpulse() {
        // //https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
        // Don't handle collision if objects aren't actually colliding
        if (this.velocityAlongNormal > 0)
            return;

        let j = -(1 + this.restitution) * this.velocityAlongNormal;
        j /= this.body1.invMass + this.body2.invMass;

        let impulse = Vector.mult(this.collisionNormal, j);

        this.body1.applyImpulse(impulse);
        this.body2.applyImpulse(impulse.mult(-1));

    }

    resolvePenetration() {
        // //https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
        let percent = 1; //0.2 - 0.8 arasi imis
        let slop = 0.1; //0.01 - 0.1
        let correction = Vector.mult(this.collisionNormal, percent * Math.max(this.penetrationDepth - slop, 0) / (this.body1.invMass + this.body2.invMass));
        this.body1.center.add(Vector.mult(correction, this.body1.invMass));
        this.body2.center.sub(Vector.mult(correction, this.body2.invMass));
    }

    static getCollision(body1, body2) {
        // Returns collision of corresponding type with body1 and body2, if any. 
        // else returns undefined

        if (body1 === body2) {
            return null;
        }

        let body1_in_body2CollisionMask = false;
        let body2_in_body1CollisionMask = false;
        for (let objClass of body1.collisionMask) {

            if (body2 instanceof objClass) {
                body2_in_body1CollisionMask = true;
                break;
            }
        }
        for (let objClass of body2.collisionMask) {


            if (body1 instanceof objClass) {
                body1_in_body2CollisionMask = true;
                break;
            }
        }
        if ((body1_in_body2CollisionMask && body2_in_body1CollisionMask) != true) {
            return null;
        }


        if (body1 instanceof Border && body2 instanceof Disc) {
            // Disc-Border is allowed, Border-Disc is not.
            return Collision.getCollision(body2, body1);



        } else if (body1 instanceof Disc && body2 instanceof HorizontalBorder) {
            if (body2.center.x + body2.length / 2 > body1.center.x && body2.center.x - body2.length / 2 < body1.center.x) {
                if (body1.center.y - body2.center.y < body1.radius && body2.extendsTo == Way.up) {
                    return new DHBCollision(body1, body2);
                } else if (body2.center.y - body1.center.y < body1.radius && body2.extendsTo == Way.down) {
                    return new DHBCollision(body1, body2);
                }
            }




        } else if (body1 instanceof Disc && body2 instanceof VerticalBorder) {
            if (body2.center.y + body2.length / 2 > body1.center.y && body2.center.y - body2.length / 2 < body1.center.y) {

                if (body1.center.x - body2.center.x < body1.radius && body2.extendsTo == Way.left) {
                    return new DVBCollision(body1, body2);
                } else if (body2.center.x - body1.center.x < body1.radius && body2.extendsTo == Way.right) {
                    return new DVBCollision(body1, body2);
                }
            }




        } else if (body1 instanceof Disc && body2 instanceof Disc) {
            if (Vector.sub(body1.center, body2.center).magnitude() <= body1.radius + body2.radius) {
                return new DDCollision(body1, body2);
            }




        } else if (body1 instanceof Kicker && body2 instanceof Ball) {
            return Collision.getCollision(body2, body1);




        } else if (body1 instanceof Ball && body2 instanceof Kicker) {
            if (Vector.sub(body1.center, body2.center).magnitude() <= body1.radius + body2.radius) {
                return new KickCollision(body1, body2);
            }
        }
    }
}
class DDCollision extends Collision {
    //Disc-Disc collision
    constructor(body1, body2) {
        if (!(body1 instanceof Disc && body2 instanceof Disc)) {
            throw `Wrong collision type: Not a Disk-Disk collision`;
        } else {
            super(body1, body2);
            this.collisionNormal = Vector.sub(this.body1.center, this.body2.center).normalize();
            this.relativeVelocity = Vector.sub(this.body1.velocity, this.body2.velocity);
            this.velocityAlongNormal = Vector.dot(this.collisionNormal, this.relativeVelocity);
            this.penetrationDepth = Math.abs(this.body1.radius + this.body2.radius - Vector.sub(this.body1.center, this.body2.center).magnitude());
        }
    }
}
class DVBCollision extends Collision {
    //Disc-VerticalBorder collision
    constructor(body1, body2) {
        if (!(body1 instanceof Disc && body2 instanceof VerticalBorder)) {
            throw `Wrong collision type: Not a Disk-VB collision`;
        } else {
            super(body1, body2);
            if (body2.extendsTo == Way.left) {
                this.collisionNormal = new Vector(1, 0);
            } else if (body2.extendsTo == Way.right) {
                this.collisionNormal = new Vector(-1, 0);
            } else {
                this.collisionNormal = body1.center.x > body2.center.x ? new Vector(1, 0) : new Vector(-1, 0);
            }
            this.relativeVelocity = Vector.sub(this.body1.velocity, this.body2.velocity);
            this.velocityAlongNormal = Vector.dot(this.collisionNormal, this.relativeVelocity);
            this.penetrationDepth = this.body1.radius - Math.abs(this.body1.center.x - this.body2.center.x);
        }
    }
}
class DHBCollision extends Collision {
    //Disc-HorizontalBorder collision
    constructor(body1, body2) {
        if (!(body1 instanceof Disc && body2 instanceof HorizontalBorder)) {
            throw `Wrong collision type: Not a Disk-HB collision`;
        } else {
            super(body1, body2);
            if (body2.extendsTo == Way.up) {
                this.collisionNormal = new Vector(0, 1);
            } else if (body2.extendsTo == Way.down) {
                this.collisionNormal = new Vector(0, -1);
            } else {
                this.collisionNormal = body1.center.y > body2.center.y ? new Vector(0, 1) : new Vector(0, -1);
            }

            this.relativeVelocity = Vector.sub(this.body1.velocity, this.body2.velocity);
            this.velocityAlongNormal = Vector.dot(this.collisionNormal, this.relativeVelocity);
            this.penetrationDepth = this.body1.radius - Math.abs(this.body1.center.y - this.body2.center.y);
        }
    }
}
class KickCollision extends Collision {
    constructor(body1, body2) {
        if (!(body1 instanceof Ball && body2 instanceof Kicker)) {
            throw `Wrong collision type: Not a Ball-Kicker collision`;
        } else {
            super(body1, body2);
            this.collisionNormal = Vector.sub(this.body1.center, this.body2.center).normalize();
        }
    }

    resolve() {
        if (this.body2.active) {
            this.body2.deactivate();
            this.body1.applyImpulse(this.collisionNormal.mult(this.body2.kickPower));
            new Audio("kicksound.mp3").play();
        }
    }
}
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
class Scene {
    constructor() {
        this.objects = {
            borders: [],
            discs: [],
        };

        this.metaObjects = {
            boxes: [],
            goals: [],
            balls: [],
            players: [],
        };

        this.collisions = [];
    }

    addObject(obj) {
        if (obj instanceof Disc) {
            this.objects.discs.push(obj);

        }
        if (obj instanceof Player) {
            this.objects.discs.push(obj.kicker);
            this.metaObjects.players.push(obj);
        } else if (obj instanceof Ball) {
            this.metaObjects.balls.push(obj);
        } else if (obj instanceof Border) {
            this.objects.borders.push(obj);
        } else if (obj instanceof Box) {
            this.metaObjects.boxes.push(obj);
            for (let borderKey in obj.borders) {
                this.objects.borders.push(obj.borders[borderKey]);
            }
        } else if (obj instanceof Goal) {
            this.metaObjects.goals.push(obj);
            this.objects.borders.push(obj.goalLine);
            this.objects.borders.push(obj.netTop);
            this.objects.borders.push(obj.netBottom);
            this.objects.borders.push(obj.netBack);
            this.objects.discs.push(obj.topPost);
            this.objects.discs.push(obj.bottomPost);

        }
        obj.scene = this;
    }

    getCollisions() {

        // Disc-Border collisions
        for (let disc of this.objects.discs) {
            for (let border of this.objects.borders) {
                let cls = Collision.getCollision(disc, border);
                if (cls) {
                    this.collisions.push(cls);
                }
            }
        }

        //Disc-Disc collisions
        for (let i = 0; i < this.objects.discs.length; i++) {
            for (let j = i + 1; j < this.objects.discs.length; j++) {
                let disc1 = this.objects.discs[i];
                let disc2 = this.objects.discs[j];
                let cls = Collision.getCollision(disc1, disc2);
                if (cls) {
                    this.collisions.push(cls);
                }
            }
        }
    }


    resolveCollisions() {
        while (this.collisions.length > 0) {
            let collision = this.collisions.pop();
            collision.resolve();
        }
    }

    checkGoals() {
        for (let goal of this.metaObjects.goals) {
            for (let ball of this.objects.discs) {
                if (goal.checkGoal(ball)) {
                    return true;
                }
            }
        }
        return false;
    }
    update() {
        for (let objectKey in this.objects) {
            let objectList = this.objects[objectKey];
            for (let object of objectList) {
                object.update();
            }
        }

        //Iterate 20 times for collisions
        for (let i = 0; i < 20; i++) {
            this.getCollisions();
            this.resolveCollisions();
        }

    }
    draw() {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, cWidth, cHeight);
        for (let objectKey in this.objects) {
            let objectList = this.objects[objectKey];
            for (let object of objectList) {
                object.draw();
            }
        }
    }

    reset() {
        this.redStartX = 100;
        this.blueStartX = 700;
        this.metaObjects.players[0].center.x = this.redStartX;
        this.metaObjects.players[0].center.y = cHeight / 2;
        this.metaObjects.players[0].velocity.mult(0);
        this.metaObjects.players[1].center.x = this.blueStartX;
        this.metaObjects.players[1].center.y = cHeight / 2;
        this.metaObjects.players[1].velocity.mult(0);
        this.metaObjects.balls[0].center.x = cWidth / 2;
        this.metaObjects.balls[0].center.y = cHeight / 2;
        this.metaObjects.balls[0].velocity.mult(0);
    }
}
class Agent {
    constructor() {
        this.side = null;
        this.env = null;
        this.goal = null;
        this.ball = null;
        this.player = null;
        this.opponent = null;
    }

    setSide(side) {
        this.side = side;
        let startX = (side == Side.red) ? 120 : cWidth - 120;
        let color = (side == Side.red) ? Color.red : Color.blue;
        this.player = new Player(startX, cHeight / 2, playerRadius, playerMass, playerRestitution, playerDamping, playerkickDamping, playerkickPower, color);
        this.player.agent = this;
    }

    act() {}
    learn() {}
}class ExperienceReplay {
    constructor(capacity, minCap) {
        this.capacity = capacity;
        this.minCap = minCap;
        this.replay = [];
    }

    addExperience(sars) {

        this.replay.push(Object.assign({}, sars));
        if (this.replay.length > this.capacity) {
            this.replay.shift();
        }
    }

    sampleExperience(batchSize = 1) {
        if (this.replay.length < this.minCap) {
            return null;
        }

        let batch = {
            sBatch: [],
            aBatch: [],
            rBatch: [],
            ssBatch: [],
            tBatch: [],
        };
        for (let n = 0; n < batchSize; n++) {
            let randIndex = Math.floor(Math.random() * this.replay.length);
            batch.sBatch.push(this.replay[randIndex].s);
            batch.aBatch.push(this.replay[randIndex].a);
            batch.rBatch.push(this.replay[randIndex].r);
            batch.ssBatch.push(this.replay[randIndex].ss);
            batch.tBatch.push(this.replay[randIndex].t);
        }
        return batch;
    }
}class QLearnerAgent extends Agent {
    constructor(JSONPath) {
        if (JSONPath) {
            console.log("Q-Learner loaded from", JSONPath);
            //TODO JSON LOAD 
        }
        super();
        this.experienceReplay = new ExperienceReplay(1);
        this.discount = 0.2;
        this.sars = {};

        this.QTable = {};
        for (let n = 0; n < 80; n++) {
            for (let i = 0; i < 80; i++) {
                for (let a = 0; a < 3; a++) {
                    this.QTable[[n, i, a]] = 0;
                }
            }
        }

    }


    act() {
        if (this.repeatCooldown > 0) {
            this.repeatCooldown--;
            this.player.applyActionHVS(this.lastAction.aH, this.lastAction.aV, this.lastAction.aS);
        } else {
            this.repeatCooldown = this.actionRepeat;
            this.sars.s = this.getStateInfo();
            let aHScores = [0, 0, 0];
            for (let n = 0; n < 3; n++) {
                aHScores[n] = this.QTable[this.sars.s.concat(n)];
            }

            var softmax = (scores) => {
                scores = Array.from(scores);
                let sum = 0;
                for (let n = 0; n < 3; n++) {
                    scores[n] = Math.exp(scores[n]);
                    sum += scores[n];
                }
                for (let n = 0; n < 3; n++) {
                    scores[n] /= sum;
                }

                return scores;
            };

            var choice = (probs) => {
                for (let n = 1; n < 3; n++) {
                    scores[n] += scores[n - 1];
                }
                let rand = Math.random();
                if (rand < scores[0]) {
                    return 0;
                } else if (rand < scores[1]) {
                    return 1;
                } else {
                    return 2;
                }
            };

            let actionHIndex = choice(softmax(aHScores));
            let actionH = Object.values(ActionH)[actionHIndex];

            let actionVIndex = 2;
            let actionV = Object.values(ActionV)[actionVIndex];

            let actionSIndex = 1;
            let actionS = Object.values(ActionS)[actionSIndex];
            this.sars.a = {
                aH: actionHIndex,
                aV: actionVIndex,
                aS: actionSIndex
            };
            this.player.applyActionHVS(actionH, actionV, actionS);
            this.lastAction = {
                aH: actionH,
                aV: actionV,
                aS: actionS,
            };
        }

    }

    saveJSON() {

    }

    getStateInfo() {
        return ([
            Math.floor(this.ball.center.x / 10),
            Math.floor(this.player.center.x / 10),
        ]);
    }

    getReward(s, a, ss) {
        let sDist = Math.abs(s[0] - s[1]);
        let ssDist = Math.abs(ss[0] - ss[1]);
        let soClose = ssDist < 6;
        let getCloser = ssDist < sDist;
        if (getCloser) {
            console.log("closing");
        }
        if (soClose) {
            console.log("close");
        }

        return (soClose || getCloser ? 100 : -100);



    }

    learn() {
        if (this.repeatCooldown == 0) { //means its time to make a new action

            this.sars.ss = this.getStateInfo();
            this.sars.r = this.getReward(this.sars.s, this.sars.a, this.sars.ss);

            this.experienceReplay.addExperience(this.sars);
            let exp = this.experienceReplay.sampleExperience();
            let {
                s,
                a,
                r,
                ss
            } = exp;

            let {
                aH,
                aV,
                aS,
            } = a;

            let maxQ = -Infinity;
            for (let n = 0; n < 3; n++) {
                if (this.QTable[ss.concat([n])] > maxQ) {
                    maxQ = this.QTable[ss.concat([n])];
                }
            }

            let yH = r + this.discount * maxQ;

            if (this.env.state.episodeEnd) {
                console.log("episodeend");
                yH = r;
            }

            this.QTable[s.concat([a.aH])] = yH;
            this.saveJSON();
        }
    }

}class NNQLearnerAgent extends Agent {
    constructor() {
        super();
        this.experienceReplay = new ExperienceReplay(100000, 100);
        let stateDim = 4;
        let hiddenSize = 200;
        this.brain = new NeuralNetwork(stateDim, hiddenSize, 9).setLoss("mse");
        this.targetBrain = new NeuralNetwork(stateDim, hiddenSize, 9).setLoss("mse");
        this.targetBrain.copyWeightsFrom(this.brain);

        this.discount = 0.995;
        this.lastSARST = {};
        this.actionRepeat = 5;
        this.targetUpdateFreq = 100;
        this.epsilon = 0.1;

        this.repeatCooldown = 0;
        this.targetUpdateCooldown = 0;
        this.lastAction = null;

    }


    act() {
        if (this.repeatCooldown > 0) { //repeat action
            this.repeatCooldown--;
            this.player.applyAction(this.lastAction);
        } else { //select new action
            this.repeatCooldown = this.actionRepeat;
            this.lastSARST.s = this.getStateInfo();

            let actionIndex;
            if (Math.random() < this.epsilon) {
                actionIndex = Math.floor(Math.random() * 9);
            } else {
                actionIndex = this.brain.predict(this.lastSARST.s)[0];
            }
            let action = Object.values(Action)[actionIndex];
            this.lastSARST.a = actionIndex;
            this.player.applyAction(action);
            this.lastAction = action;
        }
    }

    getStateInfo() {
        return ([
            this.ball.center.x,
            this.ball.center.y,
            this.player.center.x,
            this.player.center.y,
        ]);
    }

    isTerminated() {
        return this.env.step < this.actionRepeat;
    }

    getReward(s, a, ss) {
        let sBallPos = new Vector(s[0], s[1]);
        let sPlayerPos = new Vector(s[2], s[3]);

        let ssBallPos = new Vector(ss[0], ss[1]);
        let ssPlayerPos = new Vector(ss[2], ss[3]);

        let sDist = Vector.dist(sPlayerPos, sBallPos);
        let ssDist = Vector.dist(ssPlayerPos, ssBallPos);

        let ballVelocity = -Vector.sub(ssBallPos, sBallPos).x;
        let ballToLeft = ballVelocity > 0.5;
        let closing = ssDist < sDist - 0.5;
        let close = ssDist < 100;
        let reward = close ? 1 : -1;

        return reward;


    }

    learn() {
        if (this.repeatCooldown == 0) { //means new action to be made
            this.lastSARST.ss = this.getStateInfo();
            this.lastSARST.t = this.isTerminated();
            this.lastSARST.r = this.getReward(this.lastSARST.s, this.lastSARST.a, this.lastSARST.ss);
            this.experienceReplay.addExperience(this.lastSARST);
            let batchSize = 64;
            let expBatch = this.experienceReplay.sampleExperience(batchSize);

            if (expBatch) {
                let {
                    sBatch,
                    aBatch,
                    rBatch,
                    ssBatch,
                    tBatch,
                } = expBatch;
                let ssMaxQBatch = this.targetBrain.predict(ssBatch, true);

                let yBatch = Object.assign([], rBatch);
                for (let n = 0; n < aBatch.length; n++) {
                    if (tBatch[n] == false) { //Nonterminal state
                        yBatch[n] += this.discount * ssMaxQBatch[n];
                    }
                }

                let targetBatch = this.brain.forward(sBatch);

                for (let n = 0; n < aBatch.length; n++) {
                    targetBatch[n][aBatch[n]] = yBatch[n];
                }

                let prev = this.brain.W1.clone();
                this.brain.trainStep(sBatch, targetBatch);
                let after = this.brain.W1.clone();

                if (this.targetUpdateCooldown == 0) {
                    this.targetBrain.copyWeightsFrom(this.brain);
                    this.targetUpdateCooldown = this.targetUpdateFreq;
                } else {
                    this.targetUpdateCooldown--;
                }
            }
        }
    }
}class RandomAgent extends Agent {
    constructor() {
        super();
    }

    act() {

        let actionHIndex = Math.floor(Object.keys(ActionH).length * Math.random());
        let actionH = Object.values(ActionH)[actionHIndex];

        let actionVIndex = Math.floor(Object.keys(ActionV).length * Math.random());
        let actionV = Object.values(ActionV)[actionVIndex];

        let actionSIndex = Math.floor(Object.keys(ActionS).length * Math.random());
        let actionS = Object.values(ActionS)[actionSIndex];

        this.player.applyActionHVS(actionH, actionV, actionS);

    }

}
class HumanAgent extends Agent {
    constructor(upKey, downKey, leftKey, rightKey, shootKey) {
        super();
        this.upKey = upKey;
        this.downKey = downKey;
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        this.shootKey = shootKey;
    }

    act() {

        let up = (keys[this.upKey]) ? true : false;
        let down = (keys[this.downKey]) ? true : false;
        let left = (keys[this.leftKey]) ? true : false;
        let right = (keys[this.rightKey]) ? true : false;
        let shoot = (keys[this.shootKey]) ? true : false;
        this.shoot = shoot & !this.pastShoot;

        let actionH = ActionH.nomove;
        if (left) {
            actionH = this.side == Side.red ? ActionH.backward : ActionH.forward;
        } else if (right) {
            actionH = this.side == Side.red ? ActionH.forward : ActionH.backward;
        }

        let actionV = ActionV.nomove;
        if (up) {
            actionV = ActionV.up;
        } else if (down) {
            actionV = ActionV.down;
        }

        let actionS = ActionS.nomove;
        if (this.shoot) {
            actionS = ActionS.shoot;
        }

        this.player.applyActionHVS(actionH, actionV, actionS);
        this.pastShoot = shoot;

        /*
        if (shoot) {
            if (up) {
                if (left) {
                    this.player.applyAction(Action.upleftshoot);
                } else if (right) {
                    this.player.applyAction(Action.uprightshoot);
                } else {
                    this.player.applyAction(Action.upshoot);
                }
            } else if (down) {
                if (left) {
                    this.player.applyAction(Action.downleftshoot);
                } else if (right) {
                    this.player.applyAction(Action.downrightshoot);
                } else {
                    this.player.applyAction(Action.downshoot);
                }
            } else {
                if (left) {
                    this.player.applyAction(Action.leftshoot);
                } else if (right) {
                    this.player.applyAction(Action.rightshoot);
                } else {
                    this.player.applyAction(Action.nomoveshoot);
                }
            }
        } else {
            if (up) {
                if (left) {
                    this.player.applyAction(Action.upleft);
                } else if (right) {
                    this.player.applyAction(Action.upright);
                } else {
                    this.player.applyAction(Action.up);
                }
            } else if (down) {
                if (left) {
                    this.player.applyAction(Action.downleft);
                } else if (right) {
                    this.player.applyAction(Action.downright);
                } else {
                    this.player.applyAction(Action.down);
                }
            } else {
                if (left) {
                    this.player.applyAction(Action.left);
                } else if (right) {
                    this.player.applyAction(Action.right);
                } else {
                    this.player.applyAction(Action.nomove);
                }
            }
        }
*/
    }


}
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
        //this.episodeEndChecker = () => (this.scene.checkGoals() && !this.state.episodeEnd);
        this.episode = 1;
        this.episodeEndChecker = () => (this.step == 200);
        this.step = 0;

        this.scene = new Scene();
        this.scene.addObject(new Box(0, cWidth, 0, cHeight - 0, 0));
        this.scene.addObject(new Disc(cWidth / 2, cHeight / 2, 80, 10, 1, 1).makeGhost().makeHollow().setOuterColor(Color.border));
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

    resetScene() {
        this.scene.reset();
        this.state.episodeEnd = false;
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
            this.state.episodeEnd = true;
            if (this.resetDelay) {
                window.setTimeout(this.resetScene.bind(this), 2500);
            } else {
                this.resetScene();
            }
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
}//TODO 
//Direkten bazen hayvan gibi dönme şeysini düzelt
//Borderları start end diye refactor et

//Epsilon annealing gibi son algoritma tricklerini implement et, parametreleri guzellestir
//Jsona yazıp okumayı implement et
//Neural network eklelayer? conv?

dl.setBackend("webgl");



// Gets the handles for rendering
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');
ctx.scale(1, 1);
// Init keypress events
var keys = {};
window.onkeydown = function (evt) {
    keys[evt.key] = true;
};
window.onkeyup = function (evt) {
    keys[evt.key] = false;
};

// Parameters
var bgColor = Color.green;
var redColor = Color.red;
var blueColor = Color.blue;
var playerMass = 3;
var ballMass = 2;
var playerRestitution = 0.45;
var borderRestitution = 1;
var ballRestitution = 0.45;
var playerDamping = 0.93;
var playerkickDamping = 0.87;
var playerkickPower = 15;
var playerRadius = 16;
var ballRadius = 9;
var ballDamping = 0.98;
var topbottomMargin = 80;
var leftrightMargin = 60;
var goalLength = 140;
//
var env = new Environment( /*render*/ true, /*sound*/ false, /*resetDelay*/ false, /*randomStart*/ false);
//env.addAgent(new HumanAgent(Side.blue, "w", "s", "a", "d", "q"));
env.addAgent(new HumanAgent("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "x"), Side.red);
env.addAgent(new NNQLearnerAgent(), Side.blue);




episode = 0;
window.setInterval(() => {
    env.update();
    env.draw();
    if (env.state.episodeEnd) {
        episode++;
    }
}, 3);

/*
window.setInterval(() => {
    env.update();
    env.draw();
}, 0);
window.setTimeout(() => {
    console.log(3000 / env.step, "ms per step total");
}, 3000);
*/

/*
var t0 = performance.now();
for (let n = 0; n < 500; n++) {
    env.update();
    env.draw();
}
var t1 = performance.now();
console.log((t1 - t0) / 500, "per step total")

var t0 = performance.now();
for (let n = 0; n < 500; n++) {
    env.update();
}
var t1 = performance.now();
console.log((t1 - t0) / 500, "per step update")

var t0 = performance.now();
for (let n = 0; n < 500; n++) {
    env.draw();
}
var t1 = performance.now();
console.log((t1 - t0) / 500, "per step draw")
*/

/*
for (let n = 0; n < 200000; n++) {
    game.update();
    if (n % 1000 == 0) {
        game.draw();
    }
}
*/
