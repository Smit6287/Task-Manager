// ---------- State ----------

let tasks = [];          
let editId = null;       

const STORAGE_KEY = "taskManagerTasks";

// ---------- DOM references ----------

const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("titleInput");
const descriptionInput = document.getElementById("descriptionInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const formHeading = document.getElementById("formHeading");
const formError = document.getElementById("formError");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const searchInput = document.getElementById("searchInput");
const priorityFilter = document.getElementById("priorityFilter");

const taskListEl = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

// ---------- Local storage ----------

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  tasks = stored ? JSON.parse(stored) : [];
  displayTasks(tasks);
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ---------- Add / Update ----------

function addTask(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  if (!title || !dueDate) {
    formError.textContent = "Title and due date are required.";
    formError.classList.remove("hidden");
    return;
  }
  formError.classList.add("hidden");

  if (editId === null) {
    const newTask = {
      id: Date.now(),
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priority
    };
    tasks.push(newTask);
  } else {
    const task = tasks.find(t => t.id === editId);
    if (task) {
      task.title = title;
      task.description = description;
      task.dueDate = dueDate;
      task.priority = priority;
    }
    exitEditMode();
  }

  saveTasks();
  applyFilters();
  taskForm.reset();
  priorityInput.value = "medium";
}

// ---------- Display ----------

function displayTasks(list) {
  taskListEl.innerHTML = "";

  if (list.length === 0) {
    emptyMessage.classList.remove("hidden");
    return;
  }
  emptyMessage.classList.add("hidden");

  list.forEach(task => {
    const card = document.createElement("div");
    card.className = "task-card priority-" + task.priority;

    card.innerHTML = `
      <div class="task-main">
        <p class="task-title">${escapeHtml(task.title)}</p>
        ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ""}
        <div class="task-meta">
          <span>Due: ${task.dueDate}</span>
          <span class="priority-badge ${task.priority}">${task.priority}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    card.querySelector(".edit-btn").addEventListener("click", () => editTask(task.id));
    card.querySelector(".delete-btn").addEventListener("click", () => deleteTask(task.id));

    taskListEl.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// --- Edit ---

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  titleInput.value = task.title;
  descriptionInput.value = task.description;
  dueDateInput.value = task.dueDate;
  priorityInput.value = task.priority;

  editId = id;
  formHeading.textContent = "Edit Task";
  submitBtn.textContent = "Update Task";
  cancelEditBtn.classList.remove("hidden");

  taskForm.scrollIntoView({ behavior: "smooth" });
}

function exitEditMode() {
  editId = null;
  formHeading.textContent = "Add a Task";
  submitBtn.textContent = "Add Task";
  cancelEditBtn.classList.add("hidden");
}

cancelEditBtn.addEventListener("click", () => {
  exitEditMode();
  taskForm.reset();
  priorityInput.value = "medium";
  formError.classList.add("hidden");
});

// ---------- Delete ----------

function deleteTask(id) {
  const confirmed = confirm("Delete this task?");
  if (!confirmed) return;

  tasks = tasks.filter(t => t.id !== id);

  // If the task being deleted was mid-edit, reset the form
  if (editId === id) {
    exitEditMode();
    taskForm.reset();
    priorityInput.value = "medium";
  }

  saveTasks();
  applyFilters();
}

// ---------- Filter + search ----------

function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedPriority = priorityFilter.value;

  let filtered = tasks;

  if (selectedPriority !== "all") {
    filtered = filtered.filter(t => t.priority === selectedPriority);
  }

  if (searchTerm) {
    filtered = filtered.filter(t => t.title.toLowerCase().includes(searchTerm));
  }

  displayTasks(filtered);
}

searchInput.addEventListener("input", applyFilters);
priorityFilter.addEventListener("change", applyFilters);

// ---------- Init ----------

taskForm.addEventListener("submit", addTask);

window.addEventListener("DOMContentLoaded", loadTasks);
