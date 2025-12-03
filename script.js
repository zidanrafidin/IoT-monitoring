// Menunggu sampai semua konten HTML selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  // RESPONSIVE SIDEBAR TOGGLE
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.querySelector(".sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  // Fungsi buka/tutup sidebar
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("mobile-show");
      sidebarOverlay.classList.toggle("active");
    });
  }

  // Tutup sidebar jika overlay diklik (klik di luar menu)
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", function () {
      sidebar.classList.remove("mobile-show");
      sidebarOverlay.classList.remove("active");
    });
  }
  // ===============================================
  // KODE UNTUK HALAMAN DASHBOARD (index.html) - VERSI CHART.JS
  // ===============================================

  // Cek apakah kita sedang di halaman dashboard (cari elemen canvas)
  const chartSuhuCanvas = document.getElementById("chart-suhu");

  if (chartSuhuCanvas) {
    // 1. DATA STATIS (Angka yang akan ditampilkan)
    let dataSuhu = [
      23.1, 23.5, 24.0, 23.8, 24.2, 25.5, 24.5, 24.8, 25.1, 24.9, 25.3, 25.1,
    ];
    let dataKelembaban = [67, 68, 66, 69, 70, 72, 71, 70, 69, 73, 75, 74];
    let dataKategoriWaktu = [
      "13:00",
      "13:05",
      "13:10",
      "13:15",
      "13:20",
      "13:25",
      "13:30",
      "13:35",
      "13:40",
      "13:45",
      "13:50",
      "13:55",
    ];

    // 2. Konfigurasi Desain Umum (Supaya rapi)
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false, // Agar grafik menyesuaikan tinggi container (250px)
      plugins: {
        legend: { display: false }, // Sembunyikan kotak keterangan (Legend)
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        x: {
          grid: { display: false }, // Hilangkan garis kotak-kotak vertikal
          ticks: { maxTicksLimit: 6 }, // Batasi jumlah jam yang muncul biar gak penuh
        },
        y: {
          beginAtZero: false, // Agar grafik fokus di angka data, bukan dari 0
          grid: { color: "#f0f0f0" }, // Garis horizontal tipis
        },
      },
      elements: {
        point: { radius: 0, hitRadius: 10 }, // Hilangkan titik bulat (biar clean seperti gambar)
      },
    };

    // --- RENDER GRAFIK SUHU (Chart.js) ---
    new Chart(chartSuhuCanvas, {
      type: "line",
      data: {
        labels: dataKategoriWaktu,
        datasets: [
          {
            label: "Suhu",
            data: dataSuhu,
            borderColor: "#F44336", // Warna Merah
            borderWidth: 2,
            tension: 0.1, // Nilai rendah = garis lebih kaku/tajam
            fill: false, // Tidak ada warna di bawah garis
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          y: {
            ...commonOptions.scales.y,
            ticks: {
              callback: function (val) {
                return val + " °C";
              },
            },
          },
        },
      },
    });

    // --- RENDER GRAFIK KELEMBABAN (Chart.js) ---
    const chartKelembabanCanvas = document.getElementById("chart-kelembaban");
    new Chart(chartKelembabanCanvas, {
      type: "line",
      data: {
        labels: dataKategoriWaktu,
        datasets: [
          {
            label: "Kelembaban",
            data: dataKelembaban,
            borderColor: "#0D6EFD", // Warna Biru
            backgroundColor: "rgba(13, 110, 253, 0.2)", // Warna isian transparan (Biru muda)
            borderWidth: 2,
            tension: 0.4, // Nilai tinggi = garis melengkung halus (Wave)
            fill: true, // Aktifkan warna di bawah garis
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          y: {
            ...commonOptions.scales.y,
            ticks: {
              callback: function (val) {
                return val + " %";
              },
            },
          },
        },
      },
    });
  }
  // <-- AKHIR DARI BLOK HALAMAN DASHBOARD

  // KODE BARU UNTUK HALAMAN ADMIN (admin.html)
  if (document.querySelector(".admin-tabs")) {
    // --- FUNGSI HAPUS SENSOR ---
    window.hapusSensor = function (buttonEl) {
      if (confirm("Apakah Anda yakin ingin menghapus sensor ini?")) {
        // 'buttonEl' adalah tombol <button> yang diklik
        // .closest('tr') akan mencari <tr> terdekat (yaitu baris tabelnya)
        // .remove() akan menghapus elemen itu dari halaman
        buttonEl.closest("tr").remove();
      }
    };

    // --- PENGATURAN MODAL (POPUP) ---
    const sensorModalEl = document.getElementById("sensorModal");
    const modalTitle = document.getElementById("modalSensorTitle");
    const sensorForm = document.getElementById("sensorForm");
    sensorModalEl.addEventListener("show.bs.modal", function (event) {
      // 'event.relatedTarget' adalah tombol yang diklik (Tambah atau Edit)
      const button = event.relatedTarget;
      const mode = button.getAttribute("data-mode");

      if (mode === "tambah") {
        // Jika mode 'tambah', ubah judul dan kosongkan form
        modalTitle.innerText = "Tambah Sensor Baru";
        sensorForm.reset();
      } else if (mode === "edit") {
        // Jika mode 'edit', ubah judul dan isi form
        modalTitle.innerText = "Edit Sensor";

        // Ambil data dari baris tabel
        const row = button.closest("tr");
        const namaSensor = row.cells[1].innerText;
        const lokasiSensor = row.cells[2].innerText;
        // (Kita bisa tambahkan data lain di sini jika perlu)

        // Masukkan data ke dalam form
        sensorForm.querySelector("#namaSensor").value = namaSensor;
        sensorForm.querySelector("#lokasiSensor").value = lokasiSensor;
        // (Isi field Suhu & Kelembaban jika kamu menyimpannya)
        sensorForm.querySelector("#suhuMin").value = "18"; // Contoh
        sensorForm.querySelector("#suhuMax").value = "25"; // Contoh
        sensorForm.querySelector("#kelembabanMin").value = "40"; // Contoh
        sensorForm.querySelector("#kelembabanMax").value = "70"; // Contoh
      }
    });

    // Saat ini tombol Simpan belum melakukan apa-apa
    const btnSimpan = sensorModalEl.querySelector(".btn-simpan");
    btnSimpan.addEventListener("click", function () {
      alert("Tombol Simpan diklik! (ini masih dummy)");

      // Tutup modal setelah disimpan
      const modalInstance = bootstrap.Modal.getInstance(sensorModalEl);
      modalInstance.hide();
    });
  }
});
// Tambahkan fungsi ini di script.js
function logout() {
  localStorage.removeItem("role");
  // Link href di HTML sudah mengarah ke login.html,
  // jadi fungsi ini hanya untuk bersih-bersih data sesi.
}

// Cek Keamanan Sederhana (Opsional - Taruh di paling atas script.js)
// Ini mencegah User masuk ke Admin page lewat URL, dan sebaliknya.
document.addEventListener("DOMContentLoaded", function () {
  const role = localStorage.getItem("role");
  const path = window.location.pathname;

  // Jika belum login, lempar ke login page (kecuali sedang di login page)
  if (!role && !path.includes("login.html")) {
    window.location.href = "login.html";
  }

  // Jika User mencoba akses halaman Admin
  if (
    role === "user" &&
    (path.includes("admin.html") || path.includes("admin-"))
  ) {
    alert("Akses Ditolak! Anda bukan Admin.");
    window.location.href = "index.html";
  }

  // Jika Admin mencoba akses Dashboard (Opsional, kalau admin boleh lihat dashboard, hapus blok ini)
  if (role === "admin" && path.includes("index.html")) {
    // Biasanya admin boleh lihat dashboard, tapi sesuai request kamu admin ga ada menu dashboard:
    // window.location.href = 'admin.html';
  }
});
