// Client-Side Router using History API

class Router {
    constructor() {
        this.routes = {
            '/': this.renderHome,
            '/login': this.renderLogin,
            '/admin': this.renderAdmin
        };
        this.uiController = new UIController();
    }

    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.loadRoute();
        });

        // Load initial route
        this.loadRoute();
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.loadRoute();
    }

    getCurrentPath() {
        return window.location.pathname;
    }

    loadRoute() {
        const path = this.getCurrentPath();
        const route = this.routes[path] || this.routes['/'];
        
        // Update active navigation
        updateActiveNav(path);
        
        // Render the route
        route.call(this);
    }

    renderHome() {
        this.uiController.renderHome();
    }

    renderLogin() {
        const authManager = new AuthManager();
        
        // Redirect to admin if already authenticated
        if (authManager.isAuthenticated()) {
            this.navigate('/admin');
            return;
        }
        
        this.uiController.renderLogin();
    }

    renderAdmin() {
        const authManager = new AuthManager();
        
        // Redirect to login if not authenticated
        if (!authManager.isAuthenticated()) {
            this.uiController.showNotification('Silakan login terlebih dahulu', 'error');
            this.navigate('/login');
            return;
        }
        
        this.uiController.renderAdmin();
    }
}
