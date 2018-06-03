export default class LocalStorageDataProvider {
    // ===================
    // Tasks
    // ===================

    saveTask(task) {
        task = JSON.parse(JSON.stringify(task));
        delete task.selected;
        localStorage.setItem('TASK_' + encodeURI(task.name), JSON.stringify(task));
    }

    getAllTasks() {
        return Object.keys(localStorage)
                .filter(key => key.startsWith('TASK_'))
                .map(key => JSON.parse(localStorage.getItem(key)));
    }

    
    // ===================
    // Entries
    // ===================

    saveEntry(entry) {
        localStorage.setItem('ENTRY_' + entry.date + '_' + (+ new Date()), JSON.stringify(entry));
    }

    updateEntry(entry) {

    }

    deleteEntry(id) {

    }

    getEntriesForDay(day) {
        return Object.keys(localStorage)
            .filter(key => key.startsWith('ENTRY_' + day + '_'))
            .sort((a, b) => a < b ? -1 : 1)
            .map(key => JSON.parse(localStorage.getItem(key)));
    }
}