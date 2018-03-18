class QLearnerAgent extends Agent {
    constructor(JSONPath) {
        if (JSONPath) {
            console.log("Q-Learner loaded from", JSONPath);
            //TODO JSON LOAD 
        }
        super();
        this.experienceReplay = new ExperienceReplay(1);
        this.discount = 0.1;
        this.sars = {};
        this.actionRepeat = 5;
        this.lastAction = {
            aH: null,
            aV: null,
            aS: null,
        };
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

            var softmaxChoice = (scores) => {
                scores = Array.from(scores);
                let sum = 0;
                for (let n = 0; n < 3; n++) {
                    scores[n] = Math.exp(scores[n]);
                    sum += scores[n];
                }
                for (let n = 0; n < 3; n++) {
                    scores[n] /= sum;
                }
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

            let actionHIndex = softmaxChoice(aHScores);

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
        if (this.repeatCooldown == 0) { //means last repeated action is made

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

}