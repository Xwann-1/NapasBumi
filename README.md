# 🌿 NapasBumi — Breathe Better, Live Better

> Platform digital pemantauan kualitas udara, monitoring karhutla, kalkulator jejak karbon, dan aksi nyata lingkungan untuk Indonesia.

---

## 📋 Daftar Isi

- [Deskripsi](#deskripsi)
- [Fitur Utama](#fitur-utama)
- [Struktur Folder](#struktur-folder)
- [Cara Menjalankan](#cara-menjalankan)
- [Teknologi](#teknologi)
- [Sumber Data & API](#sumber-data--api)
- [Faktor Emisi Kalkulator](#faktor-emisi-kalkulator)
- [Panduan Pengembangan Lanjutan](#panduan-pengembangan-lanjutan)

---

## 📖 Deskripsi

**NapasBumi** adalah platform web interaktif yang bertujuan meningkatkan kesadaran masyarakat terhadap permasalahan emisi karbon, polusi udara, dan kebakaran hutan dan lahan (karhutla) di Indonesia. Website ini menyediakan:

- Dashboard pemantauan kualitas udara berbasis data
- Peta persebaran titik panas karhutla
- Kalkulator jejak karbon personal yang akurat
- Program aksi nyata gamifikasi (Eco Action)
- Konten edukasi lingkungan berbasis sains
- Sistem pelaporan kondisi lingkungan oleh masyarakat

> ⚠️ **Catatan:** Data saat ini menggunakan **simulasi realistis** berdasarkan pola data nyata dari BMKG, KLHK, dan NASA FIRMS. Website ini belum terhubung ke API live. Lihat bagian [Panduan Pengembangan Lanjutan](#panduan-pengembangan-lanjutan) untuk menghubungkan ke backend dan API nyata.

---

## ✨ Fitur Utama

### 1. 📊 Dashboard Kualitas Udara (`dashboard.html`)
- Menampilkan AQI, PM2.5, PM10, CO₂, NO₂ untuk 10 kota Indonesia
- Grafik tren AQI 24 jam dan bulanan (Chart.js)
- Peta interaktif dengan marker AQI berwarna (Leaflet.js + OpenStreetMap)
- Tabel perbandingan kualitas udara semua lokasi dengan pencarian
- Rekomendasi kesehatan dinamis berdasarkan nilai AQI
- Selector lokasi untuk berganti kota

### 2. 🔥 Monitoring Karhutla (`karhutla.html`)
- Peta titik panas (hotspot) seluruh Indonesia dengan marker warna berdasarkan confidence
- Statistik hotspot per provinsi dengan progress bar
- Tabel hotspot dengan filter confidence dan provinsi
- Grafik tren harian dan bulanan hotspot
- Informasi edukasi karhutla, dampak, dan langkah pencegahan
- Kontak darurat BNPB, Manggala Agni, NASA FIRMS

### 3. 🧮 Kalkulator Jejak Karbon (`kalkulator.html`)
- Input aktivitas: kendaraan pribadi (bensin/solar/listrik), motor, penerbangan
- Input energi: konsumsi listrik (kWh), gas LPG
- Input gaya hidup: pola makan, pakaian, sampah, internet
- Hasil dalam kg CO₂e/bulan dan ton CO₂e/tahun
- Perbandingan dengan rata-rata Indonesia (~2.3 ton/tahun)
- Grafik donut dan bar rincian per kategori
- Rekomendasi personal berdasarkan kategori tertinggi
- Simpan riwayat ke localStorage

### 4. 🌱 Eco Action (`eco-action.html`)
- 28 aksi lingkungan dalam 6 kategori
- Sistem poin dan 5 level (Pemula → Duta Bumi)
- 10 achievement badge (terkunci/terbuka)
- Filter per kategori
- Grafik estimasi dampak CO₂ per kategori
- Progres tersimpan di localStorage

### 5. 📚 Edukasi Lingkungan (`edukasi.html`)
- 8 artikel informatif dengan konten berbasis sains
- Kategori: Emisi Karbon, Karhutla, Polusi Udara, Perubahan Iklim, Tips Hijau
- Pencarian artikel real-time
- Modal baca artikel lengkap
- Fakta cepat lingkungan Indonesia

### 6. 📋 Laporan Masyarakat (`laporan.html`)
- Form laporan dengan validasi: kategori, lokasi, tanggal, tingkat keparahan, deskripsi
- Pencegahan XSS dengan sanitasi input
- Status laporan: Pending / Reviewed / Resolved
- Filter laporan berdasarkan status
- Daftar kontak darurat lingkungan

### 7. 👤 Profil Pengguna (`profil.html`)
- Informasi profil dengan edit langsung
- Statistik: poin, aksi selesai, kalkulator, laporan
- Riwayat jejak karbon dengan grafik tren
- Daftar aksi Eco Action yang diselesaikan
- Estimasi total kontribusi lingkungan

---

## 📁 Struktur Folder

```
NapasBumi/
├── index.html              # Landing page
├── dashboard.html          # Dashboard kualitas udara
├── karhutla.html           # Monitoring karhutla
├── kalkulator.html         # Kalkulator jejak karbon
├── eco-action.html         # Eco Action
├── edukasi.html            # Edukasi lingkungan
├── laporan.html            # Laporan masyarakat
├── profil.html             # Profil pengguna
│
├── css/
│   └── style.css           # Stylesheet global (custom + Tailwind override)
│
├── js/
│   ├── app.js              # Core: navigation, localStorage, toast, utilities
│   ├── dashboard.js        # Dashboard: AQI, charts, map
│   ├── karhutla.js         # Karhutla: hotspot map, charts, table
│   ├── kalkulator.js       # Calculator: emission factors, computation, charts
│   ├── eco-action.js       # Eco Action: actions, points, achievements
│   ├── edukasi.js          # Education: articles, search, modal
│   ├── laporan.js          # Reports: form, validation, CRUD
│   └── profil.js           # Profile: display, edit, history charts
│
├── data/
│   ├── aqi-data.js         # Simulated AQI/air quality data
│   └── hotspot-data.js     # Simulated hotspot/karhutla data
│
└── README.md               # Dokumentasi ini
```

---

## 🚀 Cara Menjalankan

### Cara 1 — Buka Langsung (Paling Mudah)
Cukup buka file `index.html` di browser modern (Chrome, Firefox, Edge, Safari).

```
Klik dua kali pada index.html
```

> **Catatan:** Beberapa browser memblokir JavaScript dari file lokal. Jika terjadi masalah, gunakan Cara 2.

### Cara 2 — Live Server (Direkomendasikan)

**Menggunakan VS Code:**
1. Install ekstensi **Live Server** di VS Code
2. Klik kanan `index.html` → **Open with Live Server**
3. Buka `http://127.0.0.1:5500/`

**Menggunakan Python:**
```bash
# Python 3
python -m http.server 8080
# Buka: http://localhost:8080
```

**Menggunakan Node.js:**
```bash
npx serve .
# atau
npx http-server .
```

### Tidak Memerlukan
- Instalasi Node.js/npm
- Build process
- Database
- Server backend

---

## 🛠️ Teknologi

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| HTML5 | — | Struktur semantik |
| Tailwind CSS | CDN v3 | Styling utility-first |
| CSS Custom | — | Komponen, animasi, variabel |
| Vanilla JavaScript | ES2020+ | Logika, interaksi, storage |
| Chart.js | 4.4.0 | Grafik & visualisasi data |
| Leaflet.js | 1.9.4 | Peta interaktif |
| OpenStreetMap | — | Tile peta (via Leaflet) |
| localStorage | Browser API | Persistensi data pengguna |

---

## 📡 Sumber Data & API

### Data Saat Ini (Simulasi)
Semua data saat ini adalah **simulasi realistis** berdasarkan pola data aktual:

| Data | File | Referensi |
|------|------|-----------|
| AQI, PM2.5, PM10 | `data/aqi-data.js` | BMKG, OpenAQ, KLHK |
| Hotspot karhutla | `data/hotspot-data.js` | NASA FIRMS, SiPongi KLHK |

### API Rekomendasi untuk Integrasi Nyata

#### 1. Kualitas Udara — OpenAQ
```
https://api.openaq.org/v2/latest?limit=10&country=ID
Authorization: Bearer YOUR_API_KEY
```
Dokumentasi: `https://docs.openaq.org/`

#### 2. Hotspot Karhutla — NASA FIRMS
```
https://firms.modaps.eosdis.nasa.gov/api/area/csv/YOUR_MAP_KEY/VIIRS_SNPP_NRT/world/1
```
Dokumentasi: `https://firms.modaps.eosdis.nasa.gov/api/`

#### 3. Cuaca & Iklim — BMKG Open Data
```
https://data.bmkg.go.id/api/Prakiraan/Cuaca/
```
Dokumentasi: `https://data.bmkg.go.id/`

#### 4. Data Karhutla — SiPongi KLHK
Website: `http://sipongi.menlhk.go.id/`

---

## 🧮 Faktor Emisi Kalkulator

Semua faktor emisi berbasis sumber ilmiah yang dapat dikutip:

| Aktivitas | Faktor Emisi | Sumber |
|-----------|-------------|--------|
| Mobil bensin | 0.21 kg CO₂/km | KLHK 2023 |
| Mobil solar | 0.27 kg CO₂/km | KLHK 2023 |
| Kendaraan listrik | 0.072 kg CO₂/km | KLHK + PLN grid |
| Motor | 0.11 kg CO₂/km | KLHK 2023 |
| Penerbangan domestik | 255 kg CO₂/jam | ICAO |
| Penerbangan internasional | 295 kg CO₂/jam | ICAO |
| Listrik PLN | 0.724 kg CO₂/kWh | PLN 2023 |
| Gas LPG | 3.0 kg CO₂e/kg | IPCC AR6 |
| Diet omnivora | 250 kg CO₂e/bulan | FAO |
| Diet vegetarian | 90 kg CO₂e/bulan | FAO |
| Pakaian baru | 8.5 kg CO₂e/item | Industry avg |
| Sampah TPA | 0.5 kg CO₂e/kg | IPCC |
| Streaming/internet | 0.036 kg CO₂/jam | IEA |

---

## 🔧 Panduan Pengembangan Lanjutan

### Menghubungkan ke Backend & Database

#### 1. Arsitektur yang Direkomendasikan

```
Frontend (NapasBumi) ←→ REST API (Node.js/Django/Laravel)
                                  ↕
                         Database (PostgreSQL/MongoDB)
                                  ↕
                    External APIs (OpenAQ, NASA FIRMS, BMKG)
```

#### 2. Mengganti Data Simulasi dengan API Nyata

**Di `data/aqi-data.js`, tambahkan fungsi fetch:**
```javascript
async function fetchLiveAQI(city) {
  const response = await fetch(
    `https://api.openaq.org/v2/latest?city=${city}&country=ID`,
    { headers: { 'X-API-Key': 'YOUR_KEY' } }
  );
  const data = await response.json();
  return transformOpenAQData(data);
}
```

**Di `data/hotspot-data.js`, integrasikan NASA FIRMS:**
```javascript
async function fetchHotspots() {
  const response = await fetch(
    'https://firms.modaps.eosdis.nasa.gov/api/area/csv/MAP_KEY/VIIRS_SNPP_NRT/world/1'
  );
  const csvText = await response.text();
  return parseCSVHotspots(csvText);
}
```

#### 3. Backend API Endpoints yang Diperlukan

```
GET  /api/aqi?location={city}        → Data kualitas udara terbaru
GET  /api/hotspots?date={date}       → Data titik panas
POST /api/reports                    → Kirim laporan lingkungan
GET  /api/reports?userId={id}        → Ambil laporan pengguna
POST /api/users/register             → Registrasi pengguna
POST /api/users/login                → Login pengguna
GET  /api/users/{id}/profile         → Data profil
PUT  /api/users/{id}/eco-actions     → Update aksi lingkungan
```

#### 4. Migrasi dari localStorage ke Database

Ganti semua `localStorage` calls di [`js/app.js`](js/app.js) dengan fungsi API:
```javascript
// Ganti Storage.set() dengan:
async function saveToServer(key, data) {
  await fetch('/api/user-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ key, data }),
  });
}
```

#### 5. Autentikasi

Implementasikan JWT atau session-based auth:
- Register/login modal di navbar
- Token disimpan di `sessionStorage` (bukan localStorage untuk keamanan)
- Protected routes untuk halaman profil dan laporan

#### 6. PWA (Progressive Web App)

Tambahkan `manifest.json` dan Service Worker untuk:
- Install ke home screen (Android/iOS)
- Offline mode dengan cached data
- Push notification untuk peringatan karhutla darurat

---

## 📝 Catatan Penting

1. **Data Simulasi:** Semua data diberi label "⚠️ Simulasi" dan tidak boleh digunakan untuk keputusan medis atau operasional darurat.
2. **CO₂ vs Ozon:** Website ini secara sadar membedakan CO₂ (gas rumah kaca → pemanasan global) dari penipisan ozon (disebabkan CFC/HCFC, bukan CO₂).
3. **Estimasi Dampak:** Angka estimasi di Eco Action adalah potensi pengurangan, bukan pengurangan emisi aktual yang terverifikasi.
4. **Keamanan:** Input pengguna di-sanitasi untuk mencegah XSS. Untuk deployment produksi, tambahkan header `Content-Security-Policy`.
5. **Privasi:** Data pengguna hanya tersimpan di localStorage browser lokal. Tidak ada data yang dikirim ke server manapun.

---

## 📜 Lisensi

Proyek ini dibuat sebagai **Capstone Project** pendidikan. Data simulasi hanya untuk tujuan demonstrasi dan pembelajaran.

---

**© 2026 NapasBumi — Breathe Better, Live Better** 🌿
