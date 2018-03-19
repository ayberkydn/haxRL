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
        let batch = {
            sBatch: [],
            aBatch: [],
            rBatch: [],
            ssBatch: [],
        };
        for (let n = 0; n < batchSize; n++) {
            let randIndex = Math.floor(Math.random() * this.replay.length);
            batch.sBatch.push(this.replay[randIndex].s);
            batch.aBatch.push(this.replay[randIndex].a);
            batch.rBatch.push(this.replay[randIndex].r);
            batch.ssBatch.push(this.replay[randIndex].ss);
        }
        return batch;
    }
}