class ExperienceReplay {
    constructor(capacity) {
        this.capacity = capacity;
        this.replay = [];
    }

    addExperience(sars) {

        this.replay.push(Object.assign({}, sars));
        if (this.replay.length > this.capacity) {
            this.replay.shift();
        }
    }

    sampleExperience() {
        let randIndex = Math.floor(Math.random() * this.replay.length);
        return this.replay[randIndex];
    }
}
