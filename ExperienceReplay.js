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

    sampleExperience(batchSize = 1) {
        let batch = [];
        for (let n = 0; n < batchSize; n++) {
            let randIndex = Math.floor(Math.random() * this.replay.length);
            batch.push(this.replay[randIndex]);
        }
        return batch;
    }
}