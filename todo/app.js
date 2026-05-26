// TodoApp class to manage all todo functionality
class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.storageKey = 'todoAppData';
        this.initializeElements();
        this.loadTodosFromStorage();
        this.setupEventListeners();
        this.render();
    }

    // Initialize DOM elements
    initializeElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.clearAllBtn = document.getElementById('clearAll');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.totalCount = document.getElementById('totalCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
    }

    // Setup event listeners
    setupEventListeners() {
        // Add todo on button click or Enter key
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Clear buttons
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());

        // Focus input on page load
        this.todoInput.focus();
    }

    // Add a new todo
    addTodo() {
        const text = this.todoInput.value.trim();
        
        if (text === '') {
            this.showNotification('Please enter a task!');
            return;
        }

        if (text.length > 200) {
            this.showNotification('Task is too long! Max 200 characters.');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: 'medium',
            createdAt: new Date().toLocaleString()
        };

        this.todos.unshift(todo);
        this.saveTodosToStorage();
        this.todoInput.value = '';
        this.todoInput.focus();
        this.render();
        this.showNotification('✓ Task added successfully!');
    }

    // Toggle todo completion
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodosToStorage();
            this.render();
        }
    }

    // Delete a todo
    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveTodosToStorage();
            this.render();
            this.showNotification('✓ Task deleted!');
        }
    }

    // Set priority of a todo
    setPriority(id, priority) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.priority = priority;
            this.saveTodosToStorage();
            this.render();
        }
    }

    // Clear all completed todos
    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount === 0) {
            this.showNotification('No completed tasks to clear!');
            return;
        }

        if (confirm(`Are you sure you want to clear ${completedCount} completed task(s)?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveTodosToStorage();
            this.render();
            this.showNotification('✓ Completed tasks cleared!');
        }
    }

    // Clear all todos
    clearAll() {
        if (this.todos.length === 0) {
            this.showNotification('No tasks to clear!');
            return;
        }

        if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone!')) {
            this.todos = [];
            this.saveTodosToStorage();
            this.render();
            this.showNotification('✓ All tasks cleared!');
        }
    }

    // Set filter
    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        this.render();
    }

    // Get filtered todos
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    // Get statistics
    getStats() {
        return {
            total: this.todos.length,
            completed: this.todos.filter(t => t.completed).length,
            active: this.todos.filter(t => !t.completed).length
        };
    }

    // Update statistics display
    updateStats() {
        const stats = this.getStats();
        this.totalCount.textContent = stats.total;
        this.activeCount.textContent = stats.active;
        this.completedCount.textContent = stats.completed;
    }

    // Render the todo list
    render() {
        const filteredTodos = this.getFilteredTodos();

        // Clear the list
        this.todoList.innerHTML = '';

        // Show empty state if no todos
        if (filteredTodos.length === 0) {
            this.emptyState.classList.add('show');
        } else {
            this.emptyState.classList.remove('show');
        }

        // Render each todo
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="app.toggleTodo(${todo.id})"
                >
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <span class="todo-priority priority-${todo.priority}">${todo.priority}</span>
                <button 
                    class="delete-btn" 
                    onclick="app.deleteTodo(${todo.id})"
                >
                    🗑️ Delete
                </button>
            `;
            this.todoList.appendChild(li);
        });

        // Update statistics
        this.updateStats();
    }

    // Save todos to local storage
    saveTodosToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
        } catch (e) {
            console.error('Failed to save todos to storage:', e);
            this.showNotification('Error saving data!');
        }
    }

    // Load todos from local storage
    loadTodosFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            this.todos = data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to load todos from storage:', e);
            this.todos = [];
        }
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Show notification (simple feedback)
    showNotification(message) {
        // You can enhance this with a toast notification library
        console.log(message);
    }

    // Export todos as JSON
    exportTodos() {
        const dataStr = JSON.stringify(this.todos, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `todos-${new Date().getTime()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    // Import todos from JSON file
    importTodos(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data)) {
                    this.todos = data;
                    this.saveTodosToStorage();
                    this.render();
                    this.showNotification('✓ Todos imported successfully!');
                } else {
                    this.showNotification('Invalid file format!');
                }
            } catch (error) {
                console.error('Error importing file:', error);
                this.showNotification('Error importing file!');
            }
        };
        reader.readAsText(file);
    }

    // Get todos by priority
    getTodosByPriority(priority) {
        return this.todos.filter(t => t.priority === priority);
    }

    // Get completed percentage
    getCompletionPercentage() {
        if (this.todos.length === 0) return 0;
        return Math.round((this.getStats().completed / this.todos.length) * 100);
    }

    // Search todos
    searchTodos(query) {
        return this.todos.filter(t => 
            t.text.toLowerCase().includes(query.toLowerCase())
        );
    }
}

// Initialize the app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
});
