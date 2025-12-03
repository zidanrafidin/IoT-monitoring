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
  // KODE UNTUK HALAMAN DASHBOARD (index.html)
  // Ini akan berjalan HANYA jika menemukan 'chart-suhu'
  if (document.getElementById("chart-suhu")) {
    let dataSuhu = [
      23.1, 23.5, 24.0, 23.8, 24.2, 25.0, 24.5, 24.8, 25.1, 24.9, 25.5, 25.3,
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

    // --- GRAFIK SUHU ---
    var optionsSuhu = {
      series: [{ name: "Suhu", data: dataSuhu }],
      chart: {
        height: 250,
        type: "line",
        zoom: { enabled: false },
        toolbar: { show: false },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      xaxis: { categories: dataKategoriWaktu },
      yaxis: { labels: { formatter: (val) => val.toFixed(1) + " °C" } },
      colors: ["#F44336"],
    };
    var chartSuhu = new ApexCharts(
      document.querySelector("#chart-suhu"),
      optionsSuhu
    );
    chartSuhu.render();

    // --- GRAFIK KELEMBABAN ---
    var optionsKelembaban = {
      series: [{ name: "Kelembaban", data: dataKelembaban }],
      chart: { height: 250, type: "area", toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      xaxis: { categories: dataKategoriWaktu },
      yaxis: { labels: { formatter: (val) => val.toFixed(0) + " %" } },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      colors: ["#0D6EFD"],
    };
    var chartKelembaban = new ApexCharts(
      document.querySelector("#chart-kelembaban"),
      optionsKelembaban
    );
    chartKelembaban.render();
  } // <-- AKHIR DARI BLOK HALAMAN DASHBOARD

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
