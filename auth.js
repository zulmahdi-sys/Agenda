// Authentication Manager

class AuthManager {
    constructor() {
        this.sessionKey = 'agenda_session';
        this.usersKey = 'agenda_users';
        this.sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    }

    login(username, password) {
        // Get users from storage
        const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
        
        // Find matching user
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Create session
            const session = {
                username: user.username,
                loginTime: new Date().toISOString(),
                expiresAt: new Date(Date.now() + this.sessionDuration).toISOString()
            };
            
            localStorage.setItem(this.sessionKey, JSON.stringify(session));
            return true;
        }
        
        return false;
    }

    logout() {
        localStorage.removeItem(this.sessionKey);
        updateNavigation();
    }

    isAuthenticated() {
        const sessionData = localStorage.getItem(this.sessionKey);
        
        if (!sessionData) {
            return false;
        }
        
        try {
            const session = JSON.parse(sessionData);
            const now = new Date();
            const expiresAt = new Date(session.expiresAt);
            
            // Check if session is expired
            if (now > expiresAt) {
                this.logout();
                return false;
            }
            
            return true;
        } catch (error) {
            this.logout();
            return false;
        }
    }

    getCurrentUser() {
        if (!this.isAuthenticated()) {
            return null;
        }
        
        const sessionData = localStorage.getItem(this.sessionKey);
        const session = JSON.parse(sessionData);
        return { username: session.username };
    }
}
