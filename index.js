module.exports = class {
    constructor() {
        this.maxTaskNum = 1;
        this.taskLength = 0;
        this.scanInterval = 100;

        // for calc ETA
        this.taskTotalCount = 0;
        this.finishedCount = 0;
        this.recentTaskCostTimes = [];
        this.disableShowETAValue = false;
        this.ETA = 'Enable ETA to see the remaining time.';

        // create a timer to show the ETA
        setInterval(() => {
            if (this.taskTotalCount === 0 || this.disableShowETAValue) {
                return;
            }
            console.log(`ETA: ${this.ETA}`);
        }, 1000);
    }

    // Compatible: typo function name. Please use finish() instead of finsh()
    async finsh() {
        this.finish();
    }

    async finish() {
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
        (() => {
            let startTime = Date.now();
            promiseTask().then(() => {
                const costTime = Date.now() - startTime;
                this.triggrtOneTaskFinishedEvent(costTime)
            });
        })();
        
    }

    setMaxTaskNum(num) {
        this.maxTaskNum = num;
    }

    setScanInterval(ms) {
        this.scanInterval = ms;
    }

    disableShowETA() {
        this.disableShowETAValue = true;
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

    triggrtOneTaskFinishedEvent(costTime) {
        this.decreaseTask();
        this.countFinishedTask(costTime);
    }

    enableETA(taskTotalCount) {
        this.taskTotalCount = taskTotalCount;
    }

    countFinishedTask(costTime) {
        this.finishedCount++;
        this.pushCostTime(costTime);
        this.calcETA();
    }

    calcETA() {
        if (this.taskTotalCount === 0) {
            return;
        }
        
        const averageCostTime = this.recentTaskCostTimes.reduce((sum, timeEvent) => sum + timeEvent.costTime, 0) / this.recentTaskCostTimes.length;
        const remainingTasks = this.taskTotalCount - this.finishedCount;
        const estimatedTime = averageCostTime * remainingTasks;
        
        this.ETA = this.formatTime(estimatedTime);
    }

    formatTime(time) {
        const s = time / 1000;
        if (s < 60) {
            return `${s}s`;
        }
        const m = s / 60;
        if (m < 60) {
            return `${Math.floor(m)}m ${Math.floor(s % 60)}s`;
        }
        const h = m / 60;
        if (h < 24) {
            return `${Math.floor(h)}h ${Math.floor(m % 60)}m`;
        }
        const d = h / 24;
        return `${Math.floor(d)}d ${Math.floor(h % 24)}h`;
    }

    // Push the cost time of a task to the recentTaskCostTimes array
    // and remove the expired samples
    pushCostTime(costTime) {
        const currentTime = Date.now();
        const expiredTime = currentTime - (3 * 60 * 1000); // 3 minutes in milliseconds
        
        this.recentTaskCostTimes.push({ costTime, timestamp: currentTime });
        
        // Remove expired samples
        this.recentTaskCostTimes = this.recentTaskCostTimes.filter(sample => sample.timestamp >= expiredTime);
        
        // Keep the sample size limited to 100
        if (this.recentTaskCostTimes.length > 100) {
            this.recentTaskCostTimes.shift();
        }
    }
};