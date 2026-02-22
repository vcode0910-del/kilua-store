// Inisialisasi Animasi AOS
AOS.init({
    duration: 1000,
    once: true
});

// Fungsi Trigger Pembayaran
async function bayarOtomatis(paketId) {
    const btn = event.target;
    const initialText = btn.innerHTML;
    
    // Animasi Loading pada Tombol
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.style.pointerEvents = 'none';

    try {
        // 1. Minta Token Pembayaran ke Backend (PHP)
        const response = await fetch('checkout.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan: paketId })
        });
        
        const data = await response.json();

        // 2. Munculkan Popup Midtrans
        window.snap.pay(data.snap_token, {
            onSuccess: function(result) {
                alert("Pembayaran Berhasil! Panel sedang dibuat...");
                cekStatusPembayaran(result.order_id);
            },
            onPending: function(result) {
                alert("Selesaikan pembayaran Anda segera.");
            },
            onError: function(result) {
                alert("Pembayaran Gagal.");
            },
            onClose: function() {
                btn.innerHTML = initialText;
                btn.style.pointerEvents = 'auto';
            }
        });
    } catch (error) {
        console.error("Error:", error);
        btn.innerHTML = initialText;
        btn.style.pointerEvents = 'auto';
    }
}
