export default class MemoryDataProvider {
    // ===================
    // Tasks
    // ===================
    
    constructor() {
        this.tasks = [];
        this.entries = {};
    }

    saveTask = (task) => {
        this.tasks.push(JSON.parse(JSON.stringify(task)));
    }

    getAllTasks = () => {
        return this.tasks.slice(0);
    }

    
    // ===================
    // Entries
    // ===================

    saveEntry = (entry) => {
        if (!(entry.day in this.entries)) {
            this.entries[entry.day] = [];
        }
        this.entries[entry.day].push(JSON.parse(JSON.stringify(entry)));
    }

    getEntriesForDay = (day) => {
        return day in this.entries ? this.entries[day].slice(0) : [];
    }
}