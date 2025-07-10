#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yargs from "yargs";
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFile = path.join(__dirname, 'tasks.json');

const loadTasks = () => {
  try {
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveTasks = (tasks) => {
  fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2), 'utf-8');
};

yargs(hideBin(process.argv))
  .command({
    command: 'add <description>',
    aliases: ['a'],
    describe: 'adds a new task',
    builder: (yargs) => {
      yargs.positional('description', {
        describe: 'task description',
        type: 'string'
      });
    },
    handler: (argv) => {
      const tasks = loadTasks();
      tasks.push({ description: argv.description, completed: false});
      saveTasks(tasks);
      console.log(chalk.green('task added'), argv.description);
    }
  })
  .command({
    command: 'list',
    aliases: ['l'],
    describe: 'list all tasks',
    builder: () => {},
    handler: () => {
      const tasks = loadTasks();
      if (!tasks.length) {
        console.log(chalk.yellow('No tasks found'));
        return;
      }
      tasks.forEach((task, index) => {
        const symbol = task.completed ? chalk.green('✔') : chalk.gray('○');
        const desc = task.completed ? chalk.strikethrough(task.description) : task.description;
        console.log(`${symbol} ${index + 1}. ${desc}`);
      });
    }
  })
  .command({
    command: 'complete <identifier>',
    describe: 'mark a task complete by number}',
    aliases: ['c'],
    builder: (yargs) => {
      yargs.positional('identifier', {
        describe: 'task number',
        type: 'number'
      });
    },
    handler: (argv) => {
      const tasks = loadTasks();
      const index = argv.identifier - 1;
      if (index < 0 || index >= tasks.length) {
        console.log (chalk.red("task not found"));
        return;
      }
      tasks[index].completed = true;
      saveTasks(tasks);
      console.log(chalk.green("task was marked complete: "), tasks[index].description);
    }
  })
  .command({
    command: "remove <identifier>",
    describe: "remove task from list",
    aliases: ['rm'],
    builder: (yargs) => {
      yargs.positional('identifier', {
        describe: "task number",
        type: "number"
      });
    },
    handler: (argv) => {
      const tasks = loadTasks();
      const index = argv.identifier - 1;

      if (index < 0 || index >= tasks.length) {
        console.log(chalk.red("task not found"));
        return;
      }
      const removed = tasks.splice(index, 1);
      saveTasks(tasks);
      console.log(chalk.green("task was removed"), removed[0].description);
    }
  })
  .command({
    command: "clear",
    describe: "remove all tasks",
    aliases: ['clr'],
    builder: () => {},
    handler: () => {
      saveTasks([]);
      console.log(chalk.green("all task were removed"));
    }
  })
  .demandCommand()
  .help()
  .argv;

if (!fs.existsSync(dataFile)) {
  saveTasks([]);
}
