// Get references to DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

/**
 * Creates a new task list item element
 * @param {string} taskText - The text of the task
 */
function createTaskElement(taskText) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');

    const taskSpan = document.createElement('span');
    taskSpan.classList.add('task-text');
    taskSpan.textContent = taskText;

    // Date with Dayjs
    const dateSpan = document.createElement('span');
    dateSpan.style.marginLeft = '10px';
    dateSpan.style.fontSize = '0.8em';
    dateSpan.style.color = '#888';
    dateSpan.textContent = dayjs().format('YYYY-MM-DD HH:mm:ss'); // Date Format

    taskSpan.addEventListener('click', () => {
        taskItem.classList.toggle('completed');
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';

    deleteBtn.addEventListener('click', () => {
        taskList.removeChild(taskItem);
    });

    taskItem.appendChild(taskSpan);
    taskItem.appendChild(dateSpan);  // Add Date Here
    taskItem.appendChild(deleteBtn);

    return taskItem;
}

/**
 * Adds a new task to the list
 */
function addTask() {
    const taskText = taskInput.value.trim();

    // Validate task is not empty
    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    // Create and append the task element
    const taskElement = createTaskElement(taskText);
    taskList.appendChild(taskElement);

    // Clear input and focus it
    taskInput.value = '';
    taskInput.focus();
}

// Add click event to Add button
addTaskBtn.addEventListener('click', addTask);

// Allow adding task with Enter key
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

// --- Extra functionality: Save and load tasks with localStorage ---

/**
 * Save current tasks to localStorage for persistence
 */
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(taskItem => {
        tasks.push({
            text: taskItem.querySelector('.task-text').textContent,
            completed: taskItem.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Load tasks from localStorage and display them
 */
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (!tasks) return;

    tasks.forEach(task => {
        const taskElement = createTaskElement(task.text);
        if (task.completed) {
            taskElement.classList.add('completed');
        }
        taskList.appendChild(taskElement);
    });
}

// Save tasks whenever the list changes
taskList.addEventListener('DOMSubtreeModified', saveTasks);

// Load tasks when the page loads
window.addEventListener('load', loadTasks);
