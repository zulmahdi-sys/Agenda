# Website Agenda Kegiatan

Website single-page application untuk menampilkan dan mengelola agenda kegiatan dengan tampilan estetis dan dinamis.

## Fitur

- **Home Page**: Header visual dengan gambar dan judul, daftar agenda kegiatan
- **Login Admin**: Sistem autentikasi untuk administrator
- **Dashboard Admin**: Kelola agenda dengan operasi CRUD lengkap
- **Responsive Design**: Tampilan optimal di desktop dan mobile
- **Animasi Smooth**: Transisi dan animasi yang halus
- **Client-Side Routing**: Navigasi tanpa reload halaman

## Teknologi

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- Local Storage API

## Cara Menjalankan

1. Buka terminal di folder project
2. Jalankan local server:

```bash
# Menggunakan Python 3
python -m http.server 8000

# Atau menggunakan Node.js
npx http-server -p 8000

# Atau menggunakan PHP
php -S localhost:8000
```

3. Buka browser dan akses `http://localhost:8000`

## Login Admin

**Username**: `admin`  
**Password**: `admin321`

## Struktur File

```
/
├── index.html          # Entry point aplikasi
├── css/
│   ├── style.css       # Global styles
│   ├── home.css        # Home page styles
│   ├── login.css       # Login page styles
│   └── admin.css       # Admin dashboard styles
├── js/
│   ├── app.js          # Main application
│   ├── router.js       # Client-side routing
│   ├── auth.js         # Authentication
│   ├── agenda.js       # Agenda CRUD operations
│   └── ui.js           # UI rendering
└── assets/
    └── images/
        └── header-bg.jpg  # Header background
```

## Fitur Detail

### Home Page
- Header dengan background image dan gradient overlay
- Animasi zoom pada background
- Daftar agenda dalam bentuk card
- Responsive grid layout
- Empty state ketika belum ada agenda

### Login Page
- Form login dengan validasi
- Animasi shake pada error
- Ripple effect pada button
- Redirect otomatis jika sudah login

### Admin Dashboard
- Form tambah/edit agenda
- Tabel daftar agenda (desktop)
- Card layout untuk mobile
- Konfirmasi sebelum hapus
- Notifikasi success/error
- Session management (24 jam)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Catatan

Ini adalah aplikasi client-side only dengan autentikasi sederhana. Untuk production, implementasikan:
- Server-side authentication
- Database untuk persistensi data
- Enkripsi password
- HTTPS
- Input sanitization yang lebih ketat
