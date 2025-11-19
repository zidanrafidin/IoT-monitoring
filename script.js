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

    // --- FUNGSI SIMULASI DATA REAL-TIME ---
    function updateData() {
      let suhuServer = 23.9 + (Math.random() - 0.5) * 1;
      let lembabServer = 67.0 + (Math.random() - 0.5) * 2;
      let suhuMeeting = 27.4 + (Math.random() - 0.5) * 1;
      let lembabMeeting = 54.2 + (Math.random() - 0.5) * 2;
      let suhuGudang = 31.7 + (Math.random() - 0.5) * 1;
      let lembabGudang = 80.3 + (Math.random() - 0.5) * 2;
      let suhuLab = 19.7 + (Math.random() - 0.5) * 1;
      let lembabLab = 46.9 + (Math.random() - 0.5) * 2;

      document.getElementById("suhu-ruang-server").innerText =
        suhuServer.toFixed(1) + "°C";
      document.getElementById("lembab-ruang-server").innerText =
        lembabServer.toFixed(1) + "%";
      document.getElementById("suhu-ruang-meeting").innerText =
        suhuMeeting.toFixed(1) + "°C";
      document.getElementById("lembab-ruang-meeting").innerText =
        lembabMeeting.toFixed(1) + "%";
      document.getElementById("suhu-gudang").innerText =
        suhuGudang.toFixed(1) + "°C";
      document.getElementById("lembab-gudang").innerText =
        lembabGudang.toFixed(1) + "%";
      document.getElementById("suhu-lab-komputer").innerText =
        suhuLab.toFixed(1) + "°C";
      document.getElementById("lembab-lab-komputer").innerText =
        lembabLab.toFixed(1) + "%";

      dataSuhu.shift();
      dataKelembaban.shift();
      dataKategoriWaktu.shift();
      let dataSuhuBaru = parseFloat(suhuGudang.toFixed(1));
      let dataKelembabanBaru = parseFloat(lembabGudang.toFixed(1));
      let waktuSekarang = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      dataSuhu.push(dataSuhuBaru);
      dataKelembaban.push(dataKelembabanBaru);
      dataKategoriWaktu.push(waktuSekarang);
      chartSuhu.updateOptions({
        series: [{ data: dataSuhu }],
        xaxis: { categories: dataKategoriWaktu },
      });
      chartKelembaban.updateOptions({
        series: [{ data: dataKelembaban }],
        xaxis: { categories: dataKategoriWaktu },
      });
    }
    setInterval(updateData, 3000);
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
