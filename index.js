#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yargs from "yargs";
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import { argv } from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const taskDir = path.join(__dirname, 'lists');

if (!fs.existsSync(taskDir)) {
  fs.mkdirSync(taskDir);
}

const getDataFile = (listname) => {
  const sanitized = listname.replace(/[^a-z0-9_\-]/gi, '_');
  return path.join(taskDir, `${sanitized}.json`);
};

const loadTasks = (listname) => {
  try {
    const dataFile = getDataFile(listname)
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveTasks = (tasks, listname) => {
  const dataFile = getDataFile(listname);
  fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2), 'utf-8');
};

yargs(hideBin(process.argv))
  .option('list', {
    alias: 'l',
    describe: 'Name of the task file',
    type: 'string',
    default: 'default'
  })
  .command({
    command: 'lists',
    aliases: ['tl'],
    describe: 'print all task lists',
    builder: () => {},
    handler: () => {
      const files = fs.readdirSync(path.join(__dirname, 'lists'));
      const jsonFiles = files.filter((file) => file.endsWith('.json'));

      if (jsonFiles.length === 0) {
        console.log(chalk.red('No task lists exit'));
      } else {
        console.log(chalk.green('Task Files:'));
        jsonFiles.forEach((file, i) => {
          const filename = file.replace(/\.json$/, '');
          console.log(`${i + 1}. ${filename}`);
        });
      }
    }
  })
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
      const tasks = loadTasks(argv.list);
      tasks.push({ description: argv.description, completed: false});
      saveTasks(tasks, argv.list);
      console.log(chalk.green(`task added to ${argv.list} `) + ':', argv.description);
    }
  })
  .command({
    command: 'list',
    aliases: ['l'],
    describe: 'list all tasks',
    builder: (argv) => {},
    handler: (argv) => {
      const tasks = loadTasks(argv.list);
      if (!tasks.length) {
        console.log(chalk.yellow(`No task were found in ${argv.list}`));
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
      const tasks = loadTasks(argv.list);
      const index = argv.identifier - 1;
      if (index < 0 || index >= tasks.length) {
        console.log (chalk.red("task not found"));
        return;
      }
      tasks[index].completed = true;
      saveTasks(tasks, argv.list);
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
      const tasks = loadTasks(argv.list);
      const index = argv.identifier - 1;

      if (index < 0 || index >= tasks.length) {
        console.log(chalk.red("task not found"));
        return;
      }
      const removed = tasks.splice(index, 1);
      saveTasks(tasks, argv.list);
      console.log(chalk.green("task was removed"), removed[0].description);
    }
  })
  .command({
    command: "clear",
    describe: "remove all tasks",
    aliases: ['clr'],
    builder: () => {},
    handler: (argv) => {
      saveTasks([], argv.list);
      console.log(chalk.green(`all task removed from ${argv.list}`));
    }
  })
  .demandCommand()
  .help()
  .argv;

