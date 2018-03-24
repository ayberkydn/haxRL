class ExperienceReplay {
    constructor(capacity, minCap) {
        this.capacity = capacity;
        this.minCap = minCap;
        this.replay = [];
    }

    addExperience(siarssii) {

        this.replay.push(Object.assign({}, siarssii));
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
            iBatch: [],
            aBatch: [],
            ssBatch: [],
            iiBatch: [],
            rBatch: [],
        };
        for (let n = 0; n < batchSize; n++) {
            let randIndex = Math.floor(Math.random() * this.replay.length);
            batch.sBatch.push(this.replay[randIndex].s);
            batch.iBatch.push(this.replay[randIndex].i);
            batch.aBatch.push(this.replay[randIndex].a);
            batch.ssBatch.push(this.replay[randIndex].ss);
            batch.iiBatch.push(this.replay[randIndex].ii);
            batch.rBatch.push(this.replay[randIndex].r);
        }
        return batch;
    }
}