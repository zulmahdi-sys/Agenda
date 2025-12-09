// Main Application Entry Point

// Initialize default data on first load
function initializeApp() {
    // Initialize default admin user if not exists
    if (!localStorage.getItem('agenda_users')) {
        const defaultUser = {
            username: 'admin',
            password: 'admin321',
            role: 'admin'
        };
        localStorage.setItem('agenda_users', JSON.stringify([defaultUser]));
    }

    // Initialize empty agenda array if not exists
    if (!localStorage.getItem('agenda_items')) {
        localStorage.setItem('agenda_items', JSON.stringify([]));
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    
    // Initialize router
    const router = new Router();
    router.init();
    
    // Setup navigation click handlers
    document.querySelectorAll('.nav-link[data-route]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = e.target.getAttribute('data-route');
            router.navigate(path);
        });
    });
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const authManager = new AuthManager();
            authManager.logout();
            router.navigate('/');
        });
    }
    
    // Update navigation based on auth status
    updateNavigation();
});

// Update navigation visibility based on authentication
function updateNavigation() {
    const authManager = new AuthManager();
    const isAuth = authManager.isAuthenticated();
    const adminOnlyItems = document.querySelectorAll('.admin-only');
    
    adminOnlyItems.forEach(item => {
        if (isAuth) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

// Update active navigation link
function updateActiveNav(path) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-route') === path) {
            link.classList.add('active');
        }
    });
}
