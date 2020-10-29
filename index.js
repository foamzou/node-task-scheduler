module.exports = class {
    constructor() {
        this.maxTaskNum = 1;
        this.taskLength = 0;
        this.scanInterval = 1000;
    }

    async finsh() {
        while (true) {
            if (this.getLength() <= 0) {
                return;
            }
            await this.sleep(200);
        }
    }

    async push(promiseTask) {
        this.increaseTask();
        while (true) {
            if (!this.isFullLoad()) {
                break;
            }
            await this.sleep(this.scanInterval);
        }
        promiseTask().then(() => {
            this.decreaseTask();
        });
    }

    setMaxTaskNum(num) {
        this.maxTaskNum = num;
    }

    setScanInterval(ms) {
        this.scanInterval(ms);
    }

    increaseTask() {
        this.taskLength++;
    }

    decreaseTask() {
        this.taskLength--;
    }

    isFullLoad() {
        return this.taskLength >= this.maxTaskNum;
    }

    getLength() {
        return this.taskLength;
    }

    sleep(time) {
        return new Promise((r) => setTimeout(r, time));
    }
};