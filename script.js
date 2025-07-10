// Get references to DOM elements
const taskInput = document.getElementById('taskInput'); // Input field for new tasks
const addTaskBtn = document.getElementById('addTaskBtn'); // "Add" button
const taskList = document.getElementById('taskList'); // <ul> element to display tasks

/**
 Creates a new task list item element
 @param {string} taskText - The text of the task
 @returns {HTMLElement} - The complete task <li> element
 */
function createTaskElement(taskText) {
    // Create list item container
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');

    // Create span for task text
    const taskSpan = document.createElement('span');
    taskSpan.classList.add('task-text');
    taskSpan.textContent = taskText;

    // Create timestamp using dayjs
    const dateSpan = document.createElement('span');
    dateSpan.style.marginLeft = '10px';
    dateSpan.style.fontSize = '0.8em';
    dateSpan.style.color = '#888';
    dateSpan.textContent = dayjs().format('YYYY-MM-DD HH:mm:ss');

    // Toggle "completed" class when task is clicked
    taskSpan.addEventListener('click', () => {
        taskItem.classList.toggle('completed');
    });

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';

    // Remove task when delete button is clicked
    deleteBtn.addEventListener('click', () => {
        taskList.removeChild(taskItem);
    });

    // Append all parts to the task item
    taskItem.appendChild(taskSpan);
    taskItem.appendChild(dateSpan);
    taskItem.appendChild(deleteBtn);

    return taskItem;
}

//Adds a new task to the list
 
function addTask() {
    const taskText = taskInput.value.trim(); // Get text and remove extra spaces

    if (taskText === '') {
        alert('Please enter a task.'); // Show warning if input is empty
        return;
    }

    const taskElement = createTaskElement(taskText); // Create task element
    taskList.appendChild(taskElement); // Add it to the list

    taskInput.value = ''; // Clear input field
    taskInput.focus(); // Focus input again
}

// Add task when "Add" button is clicked
addTaskBtn.addEventListener('click', addTask);

// Add task when Enter key is pressed
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

//Save current tasks for persistence
 
function saveTasks() {
    const tasks = [];

    // Loop through all tasks and collect their text and completed status
    document.querySelectorAll('.task-item').forEach(taskItem => {
        tasks.push({
            text: taskItem.querySelector('.task-text').textContent,
            completed: taskItem.classList.contains('completed')
        });
    });

    // Save tasks as JSON
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
/**
 * Recursively load tasks from array
 * @param {Array} tasks - Array of task objects
 * @param {number} index - Current index to load
 */
function loadTaskRecursively(tasks, index = 0) {
    if (index >= tasks.length) return; // Stop condition for recursion

    const task = tasks[index];
    const taskElement = createTaskElement(task.text);

    // Mark task as completed if necessary
    if (task.completed) {
        taskElement.classList.add('completed');
    }

    taskList.appendChild(taskElement);

    // Recursively load next task
    loadTaskRecursively(tasks, index + 1);
}

//Load tasks from localStorage and display them using recursion
 
function loadTasks() {
    try {
        const tasksJSON = localStorage.getItem('tasks');
        if (!tasksJSON) return; // No tasks found

        const tasks = JSON.parse(tasksJSON);

        // Check that parsed data is an array
        if (!Array.isArray(tasks)) {
            throw new Error("Invalid tasks format.");
        }

        // Load tasks using recursion
        loadTaskRecursively(tasks);
    } catch (error) {
        console.error("Error loading tasks:", error);
        alert("There was an error loading your tasks."); // Notify user of error
    }
}

// Save tasks whenever the task list changes
taskList.addEventListener('DOMSubtreeModified', saveTasks);

// Load tasks when the page loads
window.addEventListener('load', loadTasks);
