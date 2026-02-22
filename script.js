import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. GANTI DENGAN CONFIG FIREBASE KAMU
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- NAVIGATION SYSTEM ---
window.showPage = (pageId) => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
};

// --- DATABASE: PRODUK ---
window.saveProduct = async () => {
    const pData = {
        name: document.getElementById('p-name').value,
        price: document.getElementById('p-price').value,
        cpu: document.getElementById('p-cpu').value,
        ram: document.getElementById('p-ram').value,
        disk: document.getElementById('p-disk').value,
        createdAt: new Date()
    };
    await addDoc(collection(db, "products"), pData);
    alert("Produk tersimpan di Database!");
};

// Real-time Update Produk ke Halaman Depan
onSnapshot(collection(db, "products"), (snapshot) => {
    const container = document.getElementById('product-container');
    container.innerHTML = "";
    snapshot.forEach(doc => {
        const p = doc.data();
        container.innerHTML += `
            <div class="card">
                <h3>${p.name}</h3>
                <h2 style="color:#9b59b6">Rp ${Number(p.price).toLocaleString()}</h2>
                <p>CPU: ${p.cpu}% | RAM: ${p.ram}MB</p>
                <button class="btn-buy" onclick="processOrder('${p.name}', ${p.price})">Beli Sekarang</button>
            </div>
        `;
    });
});

// --- DATABASE: ORDER/TRANSAKSI ---
window.processOrder = async (pName, pPrice) => {
    const user = auth.currentUser;
    if(!user) return alert("Silahkan login dulu!");

    const orderData = {
        email: user.email,
        product: pName,
        price: pPrice,
        status: "Success (Paid)",
        date: new Date().toLocaleString()
    };
    await addDoc(collection(db, "orders"), orderData);
    alert("Pembayaran Berhasil! Server Pterodactyl sedang dibuat otomatis.");
};

// Load Order ke Admin Panel
onSnapshot(collection(db, "orders"), (snapshot) => {
    const list = document.getElementById('order-list');
    list.innerHTML = "";
    snapshot.forEach(doc => {
        const o = doc.data();
        list.innerHTML += `
            <div class="order-item">
                <b>${o.email}</b> membelii <b>${o.product}</b><br>
                <small>${o.date} - Status: ${o.status}</small>
            </div>
        `;
    });
});

// --- AUTH SYSTEM (DATABASE AKUN) ---
window.handleRegister = () => {
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    createUserWithEmailAndPassword(auth, email, pass)
        .then(() => alert("Akun berhasil dibuat!"))
        .catch(err => alert(err.message));
};

window.handleLogin = () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    signInWithEmailAndPassword(auth, email, pass)
        .then(() => {
            alert("Login Berhasil!");
            showPage('home');
        })
        .catch(err => alert(err.message));
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('auth-buttons').style.display = 'none';
        document.getElementById('user-controls').style.display = 'block';
        if(user.email === "admin@killua.com") { // Ganti dengan email admin kamu
            document.getElementById('admin-link').style.display = 'inline';
        }
    } else {
        document.getElementById('auth-buttons').style.display = 'block';
        document.getElementById('user-controls').style.display = 'none';
    }
});

window.logout = () => signOut(auth).then(() => location.reload());    alert("Produk Berhasil Ditambah!");
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
