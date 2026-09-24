console.log("JavaScript is connected!");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const validationMessage = document.getElementById("validationMessage");
const filterButtons = document.querySelectorAll(".filter-btn");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function displayTasks() {
    taskList.innerHTML = "";
    let filteredTasks = tasks;
    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }
    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }
    if (filteredTasks.length === 0) {
        taskList.innerHTML = "<p>No tasks found.</p>";
        return;
    }
    filteredTasks.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");
        if (task.completed) {
            taskItem.classList.add("completed");
        }
        taskItem.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn" data-id="${task.id}">
                    ${task.completed ? "Undo" : "Complete"}
                </button>
                <button class="edit-btn" data-id="${task.id}">
                    Edit
                </button>
                <button class="delete-btn" data-id="${task.id}">
                    Delete
                </button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        validationMessage.textContent = "Please enter a task.";
        validationMessage.style.color = "#c62828";
        return;
    }
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    displayTasks();
    taskInput.value = "";
    validationMessage.textContent = "Task added successfully!";
    validationMessage.style.color = "#2e7d32";
});
taskList.addEventListener("click", function(event) {
    const button = event.target;
    if (!button.dataset.id) {
        return;
    }
    const taskId = Number(button.dataset.id);
    if (button.classList.contains("complete-btn")) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    completed: !task.completed
                };
            }
            return task;
        });
    }
    if (button.classList.contains("delete-btn")) {
        tasks = tasks.filter(task => task.id !== taskId);
    }
    if (button.classList.contains("edit-btn")) {
        const task = tasks.find(task => task.id === taskId);
        const updatedText = prompt("Edit your task:", task.text);
        if (updatedText === null) {
            return;
        }
        const newText = updatedText.trim();
        if (newText === "") {
            alert("Task cannot be empty.");
            return;
        }
        task.text = newText;
    }
    saveTasks();
    displayTasks();
});
filterButtons.forEach(button => {
    button.addEventListener("click", function() {
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });
        this.classList.add("active");
        currentFilter = this.dataset.filter;
        displayTasks();
    });
});
displayTasks();
