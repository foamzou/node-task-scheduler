# Easy task scheduler
> Async task scheduler

## Install
`npm install easy-task-scheduler` 

## Usage
```
const TaskScheduler = require('easy-task-scheduler');
const MAX_TASK = 10;

const print = (m) => console.log(m)
const sleep = (time) => {
    return new Promise((r) => setTimeout(r, time));
}

const taskScheduler = new TaskScheduler(); // New instance

// Define your async task
const task = (id) => {
    return async () => {
        print(`Length of task is ${taskScheduler.getLength()}`);
        print(`${id} start`);
        await sleep(id * 100);
        print(`${id} finished`);
    }
}

const main = async () => {
    taskScheduler.setMaxTaskNum(MAX_TASK); // Set max num allowed to run at the same time
    
    for (let i=0; i<=20; ++i) {
        await taskScheduler.push(task(i)); // Push task to scheduler, it will control the task length to a specified threshold
    }

    await taskScheduler.finsh(); // Ensure that all async tasks are completed
};

main().then(_ => {
    print('Task have been finished!');
});

```
