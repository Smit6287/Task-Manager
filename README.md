# Task Manager

## Project Objective
A Task Management System built with vanilla HTML, CSS, and JavaScript that lets a user create, read, update, and delete tasks, with data persisted in the browser's local storage and a priority-based filter/search to help organize tasks.

## Files
- `index.html` — page structure: the add/edit task form and the task list container
- `style.css` — styling for the form, task cards, and priority badges
- `script.js` — all application logic (CRUD, local storage, filtering)

## Features
1. **HTML structure** — form to add tasks (title, description, due date, priority) and a container for the dynamic task list.
2. **Adding tasks** — `addTask()` reads the form, validates that title and due date are filled in, and adds the task to the list.
3. **Displaying tasks** — `displayTasks()` renders each task's title, description, due date, and priority as a card.
4. **Local storage** — `loadTasks()` reads saved tasks on page load; `saveTasks()` writes the current task list to local storage after every add, edit, or delete.
5. **Editing tasks** — `editTask(id)` loads a task (found by its unique `id`) back into the form for editing; submitting the form then updates that task in place.
6. **Deleting tasks** — `deleteTask(id)` removes a task (after a confirm prompt) and re-renders the list.
7. **Priority filter + search** — a dropdown filters tasks by priority and a search box filters by title; both can be used together.
8. **User interaction** — the form clears itself after adding/updating a task, and switches into an "Edit Task" mode (with a Cancel option) when editing.

## How to Run
Open `index.html` directly in a browser. No build step or server is required.

## Notes
- Each task is given a unique `id` (based on a timestamp) when it's created, which is how editing and deleting target the correct task.
- Task data is stored under the `taskManagerTasks` key in `localStorage`, so tasks persist across page refreshes on the same browser.
