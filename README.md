
# Todo CLI App

A simple, fast, and minimal command-line To-Do application built with Node.js.

---

## Features

- Add and list tasks quickly
- Mark tasks as complete
- Remove individual tasks or clear all
- Aliases for faster typing
- Built using Node.js

---

## Installation

Make sure Node.js is installed.

```bash
git clone https://github.com/TASh7899/todo-cli-app.git
cd todo-cli-app
npm install
npm link  # Enables `todo` command globally
```
```
---
### Commands 

```
```
todo <command>
Commands:
  todo tasklist               print all task lists                 [aliases: tl]
  todo add <description>      adds a new task                       [aliases: a]
  todo list                   list all tasks                        [aliases: l]
  todo complete <identifier>  mark a task complete by number}       [aliases: c]
  todo remove <identifier>    remove task from list                [aliases: rm]
  todo clear                  remove all tasks                    [aliases: clr]

Options:
      --version  Show version number                                   [boolean]
  -l, --list     Name of the task file             [string] [default: "default"]
      --help     Show help                                             [boolean]
```
