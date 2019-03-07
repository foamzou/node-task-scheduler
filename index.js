module.exports = class {
    constructor() {
        this.maxTaskNum = 1;
        this.taskLength = 0;
        this.scanInterval = 1000;
    }
    
    async run(taskList) {
        for (let task of taskList) {
            this.increaseTask();
            while(true) {
                if (this.isFullLoad()) {
                    await this.sleep(this.scanInterval);
                }
                else {
                    break;
                }
            }
            task().then(() => {
                this.decreaseTask();
            });
        }
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