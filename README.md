# Cuaca Jakarta

Aplikasi cuaca simple yang saya buat. Isinya prakiraan suhu Jakarta per jam, dengan data dari Open-Meteo dan tampilan yang saya rancang untuk layar HP.

Demo: https://simplepahrul.github.io/cuaca-jakarta/

## Apa yang bisa dilakukan aplikasi ini

Setelah tombol Ambil Data ditekan, aplikasi memuat prakiraan cuaca 7 hari ke depan, total 168 data per jam. Supaya tidak penuh, data saya tampilkan 10 per halaman dan bisa dibuka lewat tombol Prev dan Next di bagian bawah layar.

Tiap kartu berisi jam, tanggal, suhu dalam derajat Celsius, dan ikon kondisi cuaca seperti cerah, berawan, hujan, atau petir. Kartu untuk jam saat ini diberi warna kuning dan label SEKARANG, jadi langsung kelihatan tanpa perlu mencari. Di bagian atas ada ringkasan suhu terendah dan tertinggi dari seluruh data.

Kalau internet bermasalah, aplikasi menampilkan pesan error dan tidak berhenti begitu saja.

## Teknologi yang dipakai

Ionic Vue dengan TypeScript, Vite sebagai build tool, Axios untuk request ke API, serta GitHub Actions dan GitHub Pages untuk deploy.

## Sumber data

```
https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m,weather_code
```

Dari sini saya memakai tiga field: time, temperature_2m, dan weather_code. Dua yang pertama sesuai soal tugas. Field weather_code saya tambahkan sendiri supaya ikon cuacanya benar-benar sesuai kondisi, bukan sekadar tebakan dari angka suhu.

## Struktur kode

```
src/
├── services/AmbilCuaca/index.ts   class untuk request GET ke API
├── views/HomePage.vue             tampilan dan logika halaman
└── router/index.ts                pengaturan rute
```

Urusan mengambil data saya pisahkan ke service, sedangkan HomePage.vue hanya mengurus tampilan. Dengan begitu, kalau nanti ada halaman lain yang butuh data dari API, class yang sama bisa dipakai lagi.

## Menjalankan di laptop

Pastikan Node.js versi LTS dan Ionic CLI sudah terpasang, lalu jalankan:

```bash
npm install
ionic serve
```

Aplikasi terbuka di localhost:8100. Karena proyek ini memakai base path untuk GitHub Pages, kalau halamannya kosong coba buka localhost:8100/cuaca-jakarta/. Untuk membuat versi produksi, jalankan `npm run build`.

## Deploy

Setiap kali saya push ke branch main, GitHub Actions membangun aplikasi lalu menayangkannya ke GitHub Pages. Pengaturannya ada di `.github/workflows/deploy.yml`.

## Hal yang sempat bikin tersandung

- Waktu dari API memakai GMT, jadi awalnya jam di layar selisih tujuh jam dari jam di laptop. Sekarang sudah saya konversi ke WIB di dalam aplikasi.
- Awalnya ikon cuaca hanya mengikuti angka suhu, padahal data hujan dan petir tidak ada di URL bawaan soal. Solusinya menambahkan weather_code.
- Saat dipasang di GitHub Pages, base path harus sama persis dengan nama repo. Kalau beda, halaman jadi putih.

## Kesimpulan

Aplikasi ini sudah berjalan sesuai soal tugas: data cuaca Jakarta berhasil diambil dari API online dan ditampilkan dalam bentuk yang mudah dibaca. Dari proses pengerjaannya, saya jadi lebih paham alur memanggil RESTful API di Ionic Vue, mulai dari service, penyimpanan data di komponen, sampai tampil di layar. Saya juga belajar bahwa urusan kecil seperti zona waktu dan base path bisa memengaruhi hasil akhir, jadi perlu dicek sejak awal.
