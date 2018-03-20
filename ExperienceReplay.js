class ExperienceReplay {
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
}
