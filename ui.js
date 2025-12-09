// UI Controller - Rendering and UI Utilities

class UIController {
    constructor() {
        this.appContainer = document.getElementById('app');
        this.agendaManager = new AgendaManager();
        this.authManager = new AuthManager();
        this.currentEditId = null;
    }

    // Render Home Page
    renderHome() {
        const agendas = this.agendaManager.getAllSorted();
        
        const html = `
            <div class="home-page">
                <header class="hero-header">
                    <div class="hero-content">
                        <h1 class="hero-title">Agenda Kegiatan</h1>
                        <p class="hero-subtitle">Temukan dan ikuti berbagai kegiatan menarik</p>
                    </div>
                </header>
                
                <section class="agenda-section">
                    <h2 class="section-title">Kegiatan Mendatang</h2>
                    ${agendas.length > 0 ? this.renderAgendaGrid(agendas) : this.renderEmptyState()}
                </section>
            </div>
        `;
        
        this.appContainer.innerHTML = html;
    }

    // Render agenda grid
    renderAgendaGrid(agendas) {
        const cards = agendas.map(agenda => this.renderAgendaCard(agenda)).join('');
        return `<div class="agenda-grid">${cards}</div>`;
    }

    // Render single agenda card
    renderAgendaCard(agenda) {
        const formattedDate = this.formatDate(agenda.date);
        
        return `
            <div class="agenda-card">
                <div class="agenda-date">${formattedDate}</div>
                <h3 class="agenda-title">${this.escapeHtml(agenda.title)}</h3>
                <div class="agenda-time">${agenda.time}</div>
                <p class="agenda-description">${this.escapeHtml(agenda.description)}</p>
            </div>
        `;
    }

    // Render empty state
    renderEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <h3 class="empty-state-title">Belum Ada Agenda</h3>
                <p class="empty-state-text">Saat ini belum ada agenda kegiatan yang tersedia.</p>
            </div>
        `;
    }

    // Render Login Page
    renderLogin() {
        const html = `
            <div class="login-page">
                <div class="login-container">
                    <div class="login-header">
                        <div class="login-icon">🔐</div>
                        <h2 class="login-title">Login Admin</h2>
                        <p class="login-subtitle">Masuk untuk mengelola agenda kegiatan</p>
                    </div>
                    
                    <div id="loginError" class="login-error"></div>
                    
                    <form id="loginForm" class="login-form">
                        <div class="form-group">
                            <label for="username" class="form-label">Username</label>
                            <div class="input-icon">👤</div>
                            <input 
                                type="text" 
                                id="username" 
                                class="form-input" 
                                placeholder="Masukkan username"
                                autocomplete="username"
                                required
                            >
                            <div class="form-error" id="usernameError">Username harus diisi</div>
                        </div>
                        
                        <div class="form-group">
                            <label for="password" class="form-label">Password</label>
                            <div class="input-icon">🔒</div>
                            <input 
                                type="password" 
                                id="password" 
                                class="form-input" 
                                placeholder="Masukkan password"
                                autocomplete="current-password"
                                required
                            >
                            <div class="form-error" id="passwordError">Password harus diisi</div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary login-btn">Masuk</button>
                    </form>
                    
                    <div class="login-footer">
                        <p class="login-footer-text">
                            <a href="/" class="login-footer-link" data-route="/">Kembali ke Home</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        this.appContainer.innerHTML = html;
        this.setupLoginHandlers();
    }

    // Setup login form handlers
    setupLoginHandlers() {
        const form = document.getElementById('loginForm');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        // Setup navigation link
        const homeLink = document.querySelector('.login-footer-link[data-route]');
        if (homeLink) {
            homeLink.addEventListener('click', (e) => {
                e.preventDefault();
                const router = new Router();
                router.navigate('/');
            });
        }
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const loginError = document.getElementById('loginError');
            const submitBtn = form.querySelector('button[type="submit"]');
            
            // Reset errors
            loginError.classList.remove('show');
            usernameInput.classList.remove('error');
            passwordInput.classList.remove('error');
            
            // Validate empty fields
            let hasError = false;
            
            if (!username) {
                usernameInput.classList.add('error');
                document.getElementById('usernameError').classList.add('show');
                hasError = true;
            }
            
            if (!password) {
                passwordInput.classList.add('error');
                document.getElementById('passwordError').classList.add('show');
                hasError = true;
            }
            
            if (hasError) {
                loginError.textContent = 'Username dan password harus diisi';
                loginError.classList.add('show');
                return;
            }
            
            // Disable button to prevent double submission
            submitBtn.disabled = true;
            
            // Attempt login
            if (this.authManager.login(username, password)) {
                this.showNotification('Login berhasil!', 'success');
                updateNavigation();
                const router = new Router();
                router.navigate('/admin');
            } else {
                loginError.textContent = 'Username atau password salah';
                loginError.classList.add('show');
                submitBtn.disabled = false;
            }
        });
        
        // Clear error on input
        usernameInput.addEventListener('input', () => {
            usernameInput.classList.remove('error');
            document.getElementById('usernameError').classList.remove('show');
        });
        
        passwordInput.addEventListener('input', () => {
            passwordInput.classList.remove('error');
            document.getElementById('passwordError').classList.remove('show');
        });
    }

    // Render Admin Dashboard
    renderAdmin() {
        const agendas = this.agendaManager.getAllSorted();
        const user = this.authManager.getCurrentUser();
        
        const html = `
            <div class="admin-page">
                <div class="admin-header">
                    <div class="admin-header-content">
                        <h1 class="admin-title">Dashboard Admin</h1>
                        <p>Selamat datang, ${user.username}!</p>
                    </div>
                </div>
                
                <div class="admin-container">
                    <!-- Form Section -->
                    <div class="admin-form-section">
                        <h2 class="form-section-title" id="formTitle">Tambah Agenda Baru</h2>
                        <form id="agendaForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="agendaTitle" class="form-label">Judul Kegiatan *</label>
                                    <input 
                                        type="text" 
                                        id="agendaTitle" 
                                        class="form-input" 
                                        placeholder="Masukkan judul kegiatan"
                                        maxlength="100"
                                        required
                                    >
                                    <div class="form-error" id="titleError">Judul harus diisi (max 100 karakter)</div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="agendaDate" class="form-label">Tanggal *</label>
                                    <input 
                                        type="date" 
                                        id="agendaDate" 
                                        class="form-input"
                                        required
                                    >
                                    <div class="form-error" id="dateError">Tanggal harus diisi</div>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="agendaTime" class="form-label">Waktu *</label>
                                    <input 
                                        type="time" 
                                        id="agendaTime" 
                                        class="form-input"
                                        required
                                    >
                                    <div class="form-error" id="timeError">Waktu harus diisi</div>
                                </div>
                                
                                <div class="form-group"></div>
                            </div>
                            
                            <div class="form-group">
                                <label for="agendaDescription" class="form-label">Deskripsi *</label>
                                <textarea 
                                    id="agendaDescription" 
                                    class="form-textarea" 
                                    placeholder="Masukkan deskripsi kegiatan"
                                    maxlength="500"
                                    required
                                ></textarea>
                                <div class="form-error" id="descriptionError">Deskripsi harus diisi (max 500 karakter)</div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary" id="submitBtn">Tambah Agenda</button>
                                <button type="button" class="btn btn-secondary" id="cancelBtn">Batal</button>
                            </div>
                        </form>
                    </div>
                    
                    <!-- List Section -->
                    <div class="admin-list-section">
                        <h2 class="list-section-title">Daftar Agenda</h2>
                        ${agendas.length > 0 ? this.renderAgendaTable(agendas) : this.renderAdminEmptyState()}
                    </div>
                </div>
            </div>
        `;
        
        this.appContainer.innerHTML = html;
        this.setupAdminHandlers();
    }

    // Render agenda table
    renderAgendaTable(agendas) {
        const rows = agendas.map(agenda => `
            <tr>
                <td>
                    <div class="table-date">${this.formatDate(agenda.date)}</div>
                    <div class="table-time">${agenda.time}</div>
                </td>
                <td><strong>${this.escapeHtml(agenda.title)}</strong></td>
                <td><div class="table-description">${this.escapeHtml(agenda.description)}</div></td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-secondary edit-btn" data-id="${agenda.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${agenda.id}">Hapus</button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        const cards = agendas.map(agenda => `
            <div class="agenda-admin-card">
                <div class="admin-card-header">
                    <div>
                        <h3 class="admin-card-title">${this.escapeHtml(agenda.title)}</h3>
                        <div class="admin-card-date">${this.formatDate(agenda.date)}</div>
                    </div>
                </div>
                <div class="admin-card-time">🕐 ${agenda.time}</div>
                <p class="admin-card-description">${this.escapeHtml(agenda.description)}</p>
                <div class="admin-card-actions">
                    <button class="btn btn-sm btn-secondary edit-btn" data-id="${agenda.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${agenda.id}">Hapus</button>
                </div>
            </div>
        `).join('');
        
        return `
            <table class="agenda-table">
                <thead>
                    <tr>
                        <th>Tanggal & Waktu</th>
                        <th>Judul</th>
                        <th>Deskripsi</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
            <div class="agenda-admin-cards">
                ${cards}
            </div>
        `;
    }

    // Render admin empty state
    renderAdminEmptyState() {
        return `
            <div class="admin-empty-state">
                <div class="admin-empty-state-icon">📋</div>
                <p>Belum ada agenda. Tambahkan agenda baru menggunakan form di atas.</p>
            </div>
        `;
    }

    // Setup admin form handlers
    setupAdminHandlers() {
        const form = document.getElementById('agendaForm');
        const cancelBtn = document.getElementById('cancelBtn');
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAgendaSubmit();
        });
        
        // Cancel button
        cancelBtn.addEventListener('click', () => {
            this.resetForm();
        });
        
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.handleEdit(id);
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.handleDelete(id);
            });
        });
        
        // Clear errors on input
        ['agendaTitle', 'agendaDate', 'agendaTime', 'agendaDescription'].forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('input', () => {
                input.classList.remove('error');
                document.getElementById(id.replace('agenda', '').toLowerCase() + 'Error').classList.remove('show');
            });
        });
    }

    // Handle agenda form submission
    handleAgendaSubmit() {
        const title = document.getElementById('agendaTitle').value.trim();
        const date = document.getElementById('agendaDate').value;
        const time = document.getElementById('agendaTime').value;
        const description = document.getElementById('agendaDescription').value.trim();
        
        // Validate
        let hasError = false;
        
        if (!title || title.length > 100) {
            document.getElementById('agendaTitle').classList.add('error');
            document.getElementById('titleError').classList.add('show');
            hasError = true;
        }
        
        if (!date) {
            document.getElementById('agendaDate').classList.add('error');
            document.getElementById('dateError').classList.add('show');
            hasError = true;
        }
        
        if (!time) {
            document.getElementById('agendaTime').classList.add('error');
            document.getElementById('timeError').classList.add('show');
            hasError = true;
        }
        
        if (!description || description.length > 500) {
            document.getElementById('agendaDescription').classList.add('error');
            document.getElementById('descriptionError').classList.add('show');
            hasError = true;
        }
        
        if (hasError) {
            return;
        }
        
        const agendaData = { title, date, time, description };
        
        if (this.currentEditId) {
            // Update existing
            const result = this.agendaManager.update(this.currentEditId, agendaData);
            if (result) {
                this.showNotification('Agenda berhasil diperbarui!', 'success');
                this.renderAdmin();
            } else {
                this.showNotification('Gagal memperbarui agenda', 'error');
            }
        } else {
            // Create new
            const result = this.agendaManager.create(agendaData);
            if (result) {
                this.showNotification('Agenda berhasil ditambahkan!', 'success');
                this.renderAdmin();
            } else {
                this.showNotification('Gagal menambahkan agenda', 'error');
            }
        }
    }

    // Handle edit
    handleEdit(id) {
        const agenda = this.agendaManager.getById(id);
        if (!agenda) return;
        
        this.currentEditId = id;
        
        // Populate form
        document.getElementById('agendaTitle').value = agenda.title;
        document.getElementById('agendaDate').value = agenda.date;
        document.getElementById('agendaTime').value = agenda.time;
        document.getElementById('agendaDescription').value = agenda.description;
        
        // Update UI
        document.getElementById('formTitle').textContent = 'Edit Agenda';
        document.getElementById('submitBtn').textContent = 'Update Agenda';
        document.getElementById('cancelBtn').classList.add('show');
        
        // Scroll to form
        document.querySelector('.admin-form-section').scrollIntoView({ behavior: 'smooth' });
    }

    // Handle delete
    async handleDelete(id) {
        const agenda = this.agendaManager.getById(id);
        if (!agenda) return;
        
        const confirmed = await this.showConfirmDialog(`Apakah Anda yakin ingin menghapus agenda "${agenda.title}"?`);
        
        if (confirmed) {
            const result = this.agendaManager.delete(id);
            if (result) {
                this.showNotification('Agenda berhasil dihapus!', 'success');
                this.renderAdmin();
            } else {
                this.showNotification('Gagal menghapus agenda', 'error');
            }
        }
    }

    // Reset form
    resetForm() {
        this.currentEditId = null;
        document.getElementById('agendaForm').reset();
        document.getElementById('formTitle').textContent = 'Tambah Agenda Baru';
        document.getElementById('submitBtn').textContent = 'Tambah Agenda';
        document.getElementById('cancelBtn').classList.remove('show');
        
        // Clear errors
        document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
            input.classList.remove('error');
        });
        document.querySelectorAll('.form-error').forEach(error => {
            error.classList.remove('show');
        });
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }

    // Show confirmation dialog
    showConfirmDialog(message) {
        return new Promise((resolve) => {
            const dialog = document.getElementById('confirmDialog');
            const messageEl = document.getElementById('confirmMessage');
            const yesBtn = document.getElementById('confirmYes');
            const noBtn = document.getElementById('confirmNo');
            
            messageEl.textContent = message;
            dialog.classList.remove('hidden');
            
            const handleYes = () => {
                dialog.classList.add('hidden');
                cleanup();
                resolve(true);
            };
            
            const handleNo = () => {
                dialog.classList.add('hidden');
                cleanup();
                resolve(false);
            };
            
            const cleanup = () => {
                yesBtn.removeEventListener('click', handleYes);
                noBtn.removeEventListener('click', handleNo);
            };
            
            yesBtn.addEventListener('click', handleYes);
            noBtn.addEventListener('click', handleNo);
        });
    }

    // Format date to Indonesian
    formatDate(dateString) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
