# Easy task scheduler
> Async task scheduler

## Install
`npm install easy-task-scheduler` 

## Usage
```
const TaskScheduler = require('easy-task-scheduler');
const MAX_TASK = 6;

const print = (m) => console.log(m)
const sleep = (time) => {
    return new Promise((r) => setTimeout(r, time));
}

// define your task
const task = (id) => {
    return async () => {
        print(`length of task is ${taskScheduler.getLength()}`);
        print(`${id} start`);
        await sleep(id * 100);
        print(`${id} finished`);
    }
}

const taskScheduler = new TaskScheduler();
taskScheduler.setMaxTaskNum(MAX_TASK);// set max num allowed to run at the same time

let taskList = [];
for (let i=0; i<=100; ++i) {
    taskList.push(task(i));
}

taskScheduler.run(taskList);
```
