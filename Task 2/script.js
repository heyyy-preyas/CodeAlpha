// DOM Elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const tasksList = document.getElementById('tasks-list');
const clearAllBtn = document.getElementById('clear-all');
const filters = document.querySelectorAll('.filter');

// App Data
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let editingId = null;

// Initialize the app
function init() {
    renderTasks();
    addEventListeners();
}

// Add event listeners
function addEventListeners() {
    // Add task event
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Clear all tasks
    clearAllBtn.addEventListener('click', clearAllTasks);

    // Filter tasks
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            setFilter(filter.dataset.filter);
        });
    });

    // Task list event delegation
    tasksList.addEventListener('click', handleTaskAction);
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (!taskText) {
        showAlert('Please enter a task!');
        return;
    }

    if (editingId !== null) {
        // Update existing task
        const taskIndex = tasks.findIndex(task => task.id === editingId);
        if (taskIndex !== -1) {
            tasks[taskIndex].text = taskText;
            editingId = null;
            addBtn.textContent = 'Add Task';
        }
    } else {
        // Add new task
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date()
        };
        tasks.push(newTask);
    }

    // Save to localStorage and render
    saveTasks();
    renderTasks();
    
    // Clear input
    taskInput.value = '';
    taskInput.focus();
}

// Handle task actions (complete, edit, delete)
function handleTaskAction(e) {
    const target = e.target;
    const taskItem = target.closest('.task-item');
    
    if (!taskItem) return;
    
    const taskId = parseInt(taskItem.dataset.id);
    
    // Handle checkbox click
    if (target.classList.contains('task-checkbox')) {
        toggleTaskComplete(taskId);
    }
    
    // Handle edit button click
    if (target.classList.contains('edit-btn')) {
        editTask(taskId);
    }
    
    // Handle delete button click
    if (target.classList.contains('delete-btn')) {
        deleteTask(taskId);
    }
}

// Toggle task complete status
function toggleTaskComplete(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        renderTasks();
    }
}

// Edit a task
function editTask(taskId) {
    const task = tasks.find(task => task.id === taskId);
    
    if (task) {
        editingId = taskId;
        taskInput.value = task.text;
        taskInput.focus();
        addBtn.textContent = 'Update Task';
    }
}

// Delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    
    // If we were editing this task, reset the editing state
    if (editingId === taskId) {
        editingId = null;
        taskInput.value = '';
        addBtn.textContent = 'Add Task';
    }
    
    saveTasks();
    renderTasks();
}

// Clear all tasks
function clearAllTasks() {
    if (tasks.length === 0) return;
    
    if (confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

// Set active filter
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active filter UI
    filters.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderTasks();
}

// Filter tasks based on current filter
function getFilteredTasks() {
    switch (currentFilter) {
        case 'pending':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return [...tasks];
    }
}

// Render tasks to the DOM
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    // Sort tasks by creation date (newest first)
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Clear the tasks list
    tasksList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No tasks to display';
        tasksList.appendChild(emptyMessage);
        return;
    }
    
    // Create task items
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.id = task.id;
        
        taskItem.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${escapeHTML(task.text)}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn" title="Edit Task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" title="Delete Task">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        
        tasksList.appendChild(taskItem);
    });
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Helper function to escape HTML
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Show alert message
function showAlert(message) {
    // Check if alert already exists
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.textContent = message;
    
    // Add to DOM
    document.body.appendChild(alert);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 