AOS.init();

// KONFIGURASI PTERODACTYL (PTLA)
const PTERO_URL = "https://panel.kamu.com";
const PTERO_KEY = "ptla_XXXXXXXXXXXX"; // Hati-hati: Key ini terlihat di browser!

// Inisialisasi Data dari LocalStorage
let products = JSON.parse(localStorage.getItem('products')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [{username: 'admin', pass: 'admin123', role: 'admin'}];
let currentUser = null;

// Routing Sederhana
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
}

// Register & Login
function register() {
    const u = document.getElementById('reg-user').value;
    const p = document.getElementById('reg-pass').value;
    const r = document.getElementById('reg-role').value;
    users.push({username: u, pass: p, role: r});
    localStorage.setItem('users', JSON.stringify(users));
    alert("Berhasil Daftar! Silahkan Login.");
    showPage('login');
}

function login() {
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;
    const user = users.find(x => x.username === u && x.pass === p);
    
    if(user) {
        currentUser = user;
        document.getElementById('auth-links').style.display = 'none';
        document.getElementById('user-links').style.display = 'block';
        if(user.role === 'admin') document.getElementById('admin-btn').style.display = 'inline';
        alert("Welcome " + u);
        showPage('home');
    } else {
        alert("User tidak ditemukan!");
    }
}

function logout() {
    currentUser = null;
    location.reload();
}

// Admin Logic
function addProduct() {
    const newP = {
        id: Date.now(),
        name: document.getElementById('p-name').value,
        price: document.getElementById('p-price').value,
        cpu: document.getElementById('p-cpu').value,
        ram: document.getElementById('p-ram').value,
        disk: document.getElementById('p-disk').value
    };
    products.push(newP);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    alert("Produk Berhasil Ditambah!");
}

function renderProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = products.map(p => `
        <div class="card">
            <h3>${p.name}</h3>
            <h2 style="color:#8e44ad">Rp ${Number(p.price).toLocaleString()}</h2>
            <p>CPU: ${p.cpu}% | RAM: ${p.ram}MB</p>
            <button class="btn-buy" onclick="checkout(${p.id})">Beli Sekarang</button>
        </div>
    `).join('');
}

// Payment & Create Panel Otomatis
async function checkout(prodId) {
    if(!currentUser) return alert("Silahkan login dulu!");
    const p = products.find(x => x.id === prodId);

    // Simulasi Pembayaran (Karena Midtrans butuh backend untuk keamanan)
    const konfirmasi = confirm(`Beli ${p.name} seharga Rp ${p.price}? (Simulasi Bayar Berhasil)`);
    
    if(konfirmasi) {
        // 1. Simpan Transaksi
        transactions.push({id: Date.now(), user: currentUser.username, product: p.name, status: 'Success'});
        localStorage.setItem('transactions', JSON.stringify(transactions));

        // 2. Trigger API Pterodactyl (PTLA)
        try {
            const res = await fetch(`${PTERO_URL}/api/application/servers`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${PTERO_KEY}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: "Killua-" + currentUser.username,
                    user: 1, 
                    egg: 15,
                    docker_image: "ghcr.io/pterodactyl/yolks:java_17",
                    startup: "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
                    limits: { memory: parseInt(p.ram), swap: 0, disk: parseInt(p.disk), io: 500, cpu: parseInt(p.cpu) },
                    feature_limits: { databases: 1, allocations: 1, backups: 1 },
                    deploy: { locations: [1], dedicated_ip: false, port_range: [] }
                })
            });
            
            if(res.ok) {
                alert("PEMBAYARAN BERHASIL! Server sedang dibuat, cek panel Anda.");
            } else {
                alert("Bayar berhasil, tapi gagal hubungi Panel Ptero. Cek API Key!");
            }
        } catch (e) {
            console.log(e);
            alert("Terjadi kesalahan sistem.");
        }
    }
}

// Load riwayat transaksi untuk admin
function renderAdmin() {
    const area = document.getElementById('transaction-history');
    area.innerHTML = transactions.map(t => `
        <div style="border-bottom:1px solid #444; padding:10px;">
            ${t.user} membelii ${t.product} - <b>${t.status}</b>
        </div>
    `).join('');
}

// Jalankan saat start
renderProducts();
renderAdmin();
