// Agenda Manager - CRUD Operations

class AgendaManager {
    constructor() {
        this.storageKey = 'agenda_items';
    }

    // Generate unique ID
    generateId() {
        return 'agenda_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Get all agenda items
    getAll() {
        try {
            const items = localStorage.getItem(this.storageKey);
            return items ? JSON.parse(items) : [];
        } catch (error) {
            console.error('Error reading agenda items:', error);
            return [];
        }
    }

    // Get agenda by ID
    getById(id) {
        const items = this.getAll();
        return items.find(item => item.id === id) || null;
    }

    // Create new agenda
    create(agendaData) {
        // Validate data
        if (!this.validate(agendaData)) {
            return null;
        }

        const items = this.getAll();
        const now = new Date().toISOString();
        
        const newAgenda = {
            id: this.generateId(),
            title: agendaData.title.trim(),
            date: agendaData.date,
            time: agendaData.time,
            description: agendaData.description.trim(),
            createdAt: now,
            updatedAt: now
        };

        items.push(newAgenda);
        this.save(items);
        
        return newAgenda;
    }

    // Update existing agenda
    update(id, agendaData) {
        // Validate data
        if (!this.validate(agendaData)) {
            return null;
        }

        const items = this.getAll();
        const index = items.findIndex(item => item.id === id);
        
        if (index === -1) {
            return null;
        }

        items[index] = {
            ...items[index],
            title: agendaData.title.trim(),
            date: agendaData.date,
            time: agendaData.time,
            description: agendaData.description.trim(),
            updatedAt: new Date().toISOString()
        };

        this.save(items);
        
        return items[index];
    }

    // Delete agenda
    delete(id) {
        const items = this.getAll();
        const filteredItems = items.filter(item => item.id !== id);
        
        if (filteredItems.length === items.length) {
            return false; // Item not found
        }

        this.save(filteredItems);
        return true;
    }

    // Validate agenda data
    validate(data) {
        if (!data.title || data.title.trim().length === 0 || data.title.length > 100) {
            return false;
        }
        
        if (!data.date || !this.isValidDate(data.date)) {
            return false;
        }
        
        if (!data.time || !this.isValidTime(data.time)) {
            return false;
        }
        
        if (!data.description || data.description.trim().length === 0 || data.description.length > 500) {
            return false;
        }
        
        return true;
    }

    // Validate date format (YYYY-MM-DD)
    isValidDate(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) {
            return false;
        }
        
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    // Validate time format (HH:MM)
    isValidTime(timeString) {
        const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return regex.test(timeString);
    }

    // Save items to localStorage
    save(items) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(items));
            return true;
        } catch (error) {
            console.error('Error saving agenda items:', error);
            return false;
        }
    }

    // Get agenda items sorted by date
    getAllSorted() {
        const items = this.getAll();
        return items.sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateA - dateB;
        });
    }
}
