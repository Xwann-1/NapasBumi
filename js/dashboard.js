/**
 * NapasBumi — Dashboard Module
 * Handles: AQI display, Chart.js charts, Leaflet map, location selector
 */

'use strict';

// Chart instances — kept for cleanup
let chartHourlyAQI  = null;
let chartHourlyPM25 = null;
let chartMonthly    = null;

// ── Location Selector ────────────────────────────────────────────────────────
function populateLocationSelect() {
  const sel = document.getElementById('location-select');
  if (!sel) return;
  AQI_DATA.locations.forEach(loc => {
    const opt = document.createElement('option');
    opt.value = loc.id;
    opt.textContent = loc.name;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', () => updateDashboard(sel.value));
}

// ── Update AQI Hero Card ──────────────────────────────────────────────────────
function updateAQIHero(loc) {
  const cat = getAQICategory(loc.aqi);

  document.getElementById('aqi-gauge-value').textContent = loc.aqi;
  document.getElementById('aqi-gauge-value').style.color = cat.color;
  document.getElementById('aqi-gauge-label').textContent = cat.label;
  document.getElementById('aqi-gauge-label').style.background = cat.color + '22';
  document.getElementById('aqi-gauge-label').style.color = cat.textColor;
  document.getElementById('aqi-location-name').textContent = loc.name;
  document.getElementById('aqi-description').textContent = loc.description;

  document.getElementById('val-pm25').textContent = loc.pm25;
  document.getElementById('val-pm10').textContent = loc.pm10;
  document.getElementById('val-co2').textContent = loc.co2;
  document.getElementById('val-no2').textContent = loc.no2;
  document.getElementById('val-temp').textContent = loc.temp + '°C';
  document.getElementById('val-humidity').textContent = '💧 ' + loc.humidity + '%';
  document.getElementById('val-wind').textContent = '🌬️ ' + loc.windSpeed + ' km/h';

  // Move AQI scale indicator (0–500 mapped to 0–100%)
  const pct = Math.min((loc.aqi / 500) * 100, 98);
  const indicator = document.getElementById('aqi-indicator');
  if (indicator) indicator.style.left = `calc(${pct}% - 6px)`;

  updateHealthRecommendations(loc.aqi, cat);
}

// ── Health Recommendations ────────────────────────────────────────────────────
function updateHealthRecommendations(aqi, cat) {
  const container = document.getElementById('health-recommendations');
  if (!container) return;

  const recs = getHealthRecs(aqi);
  container.innerHTML = recs.map(r => `
    <div class="flex items-start gap-3 p-3 rounded-xl" style="background:${r.bg}">
      <span class="text-2xl">${r.icon}</span>
      <div>
        <div class="font-semibold text-sm" style="color:${r.color}">${r.title}</div>
        <div class="text-gray-600 text-xs mt-0.5">${r.desc}</div>
      </div>
    </div>
  `).join('');
}

function getHealthRecs(aqi) {
  if (aqi <= 50) return [
    { icon:'😊', title:'Aktivitas Bebas',         desc:'Udara bersih. Semua aktivitas luar ruangan aman.', bg:'#d1fae5', color:'#065f46' },
    { icon:'🏃', title:'Olahraga di Luar Rumah',  desc:'Kondisi ideal untuk berolahraga di taman atau jalur hijau.', bg:'#d1fae5', color:'#065f46' },
    { icon:'🪟', title:'Buka Jendela',             desc:'Ventilasi alami sangat baik. Buka jendela untuk sirkulasi udara segar.', bg:'#d1fae5', color:'#065f46' },
    { icon:'🌱', title:'Waktu Berkualitas di Alam', desc:'Kunjungi taman atau ruang hijau untuk meningkatkan kesehatan mental.', bg:'#d1fae5', color:'#065f46' },
  ];
  if (aqi <= 100) return [
    { icon:'⚠️', title:'Pertimbangkan Aktivitas', desc:'Kelompok sensitif sebaiknya batasi aktivitas luar berkepanjangan.', bg:'#fef9c3', color:'#713f12' },
    { icon:'😷', title:'Gunakan Masker (Opsional)',desc:'Tidak wajib, namun masker N95 disarankan untuk jalan sibuk.', bg:'#fef9c3', color:'#713f12' },
    { icon:'💧', title:'Minum Air Cukup',          desc:'Hidrasi membantu tubuh mengurangi dampak polutan.', bg:'#fef9c3', color:'#713f12' },
    { icon:'🏠', title:'Ventilasi Terkontrol',     desc:'Buka jendela saat pagi dan kurangi saat lalu lintas puncak.', bg:'#fef9c3', color:'#713f12' },
  ];
  if (aqi <= 150) return [
    { icon:'😷', title:'Wajib Masker di Luar',     desc:'Gunakan masker N95/KN95 saat beraktivitas di luar ruangan.', bg:'#ffedd5', color:'#9a3412' },
    { icon:'🚗', title:'Batasi Perjalanan',         desc:'Kurangi perjalanan yang tidak perlu, terutama di jam sibuk.', bg:'#ffedd5', color:'#9a3412' },
    { icon:'🪟', title:'Tutup Jendela',             desc:'Gunakan AC dengan filter atau air purifier di dalam ruangan.', bg:'#ffedd5', color:'#9a3412' },
    { icon:'👶', title:'Lindungi Anak & Lansia',    desc:'Kelompok rentan sebaiknya tetap di dalam ruangan.', bg:'#ffedd5', color:'#9a3412' },
  ];
  if (aqi <= 200) return [
    { icon:'🚨', title:'Hindari Aktivitas Luar',   desc:'Semua orang sebaiknya menghindari aktivitas luar ruangan.', bg:'#fee2e2', color:'#991b1b' },
    { icon:'😷', title:'Masker N95 Wajib',          desc:'Gunakan masker N95 atau respirator jika harus keluar.', bg:'#fee2e2', color:'#991b1b' },
    { icon:'🏥', title:'Konsultasi Dokter',         desc:'Penderita asma/PPOK segera konsultasikan kondisi kesehatan.', bg:'#fee2e2', color:'#991b1b' },
    { icon:'💨', title:'Air Purifier',              desc:'Gunakan air purifier dengan filter HEPA di dalam ruangan.', bg:'#fee2e2', color:'#991b1b' },
  ];
  return [
    { icon:'🔴', title:'KONDISI DARURAT',           desc:'Tetap di dalam ruangan. Hubungi 119 jika ada gejala sesak napas.', bg:'#fce7f3', color:'#9d174d' },
    { icon:'😷', title:'Masker Wajib Ganda',        desc:'Gunakan masker N95 ditambah masker kain sebagai lapisan tambahan.', bg:'#fce7f3', color:'#9d174d' },
    { icon:'📞', title:'Pantau Siaran Resmi',       desc:'Ikuti arahan dari BNPB dan Dinas Kesehatan setempat.', bg:'#fce7f3', color:'#9d174d' },
    { icon:'🚑', title:'Evakuasi Jika Diperlukan',  desc:'Siapkan tas darurat dan ikuti jalur evakuasi jika ada instruksi.', bg:'#fce7f3', color:'#9d174d' },
  ];
}

// ── Populate Locations Table ───────────────────────────────────────────────────
function populateLocationsTable(filter = '') {
  const tbody = document.getElementById('locations-table-body');
  if (!tbody) return;

  const locs = AQI_DATA.locations.filter(l =>
    l.name.toLowerCase().includes(filter.toLowerCase())
  );

  tbody.innerHTML = locs.map(loc => {
    const cat = getAQICategory(loc.aqi);
    return `
      <tr class="border-b hover:bg-green-50 cursor-pointer transition-colors"
          style="border-color:#f0fdf4"
          onclick="selectLocation('${loc.id}')">
        <td class="py-2.5 px-3 font-medium text-gray-700">${loc.name}</td>
        <td class="py-2.5 px-3 text-center">
          <span class="font-bold text-lg" style="color:${cat.color}">${loc.aqi}</span>
        </td>
        <td class="py-2.5 px-3 text-center">
          <span class="px-2 py-0.5 rounded-full text-xs font-semibold"
                style="background:${cat.color}22;color:${cat.textColor}">${cat.label}</span>
        </td>
        <td class="py-2.5 px-3 text-center text-gray-600">${loc.pm25}</td>
        <td class="py-2.5 px-3 text-center text-gray-600">${loc.pm10}</td>
        <td class="py-2.5 px-3 text-center text-gray-600">${loc.temp}°C</td>
        <td class="py-2.5 px-3 text-center">
          <button onclick="event.stopPropagation();selectLocation('${loc.id}')"
                  class="text-xs px-2 py-1 rounded-lg font-semibold"
                  style="background:#f0fdf4;color:#1a6b3c">Detail</button>
        </td>
      </tr>
    `;
  }).join('');

  if (!locs.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-gray-400">Lokasi tidak ditemukan</td></tr>`;
  }
}

function selectLocation(id) {
  const sel = document.getElementById('location-select');
  if (sel) sel.value = id;
  updateDashboard(id);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Charts ────────────────────────────────────────────────────────────────────
const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: { legend: { position: 'top', labels: { font: { size: 12 }, usePointStyle: true } } },
  scales: {
    x: { grid: { color: '#f0fdf4' }, ticks: { font: { size: 11 } } },
    y: { grid: { color: '#f0fdf4' }, ticks: { font: { size: 11 } } },
  },
};

function buildHourlyAQIChart(locationId) {
  const ctx = document.getElementById('chart-hourly-aqi');
  if (!ctx) return;
  const data = AQI_DATA.hourlyData.datasets[locationId] || AQI_DATA.hourlyData.datasets.jakarta;
  if (chartHourlyAQI) chartHourlyAQI.destroy();

  chartHourlyAQI = new Chart(ctx, {
    type: 'line',
    data: {
      labels: AQI_DATA.hourlyData.labels,
      datasets: [{
        label: 'AQI',
        data: data,
        borderColor: '#1a6b3c',
        backgroundColor: 'rgba(26,107,60,0.08)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: '#1a6b3c',
      }]
    },
    options: {
      ...CHART_DEFAULTS,
      plugins: {
        ...CHART_DEFAULTS.plugins,
        annotation: undefined,
        tooltip: {
          callbacks: {
            afterLabel: (ctx) => {
              const val = ctx.raw;
              return `Status: ${getAQICategory(val).label}`;
            }
          }
        }
      },
      scales: {
        ...CHART_DEFAULTS.scales,
        y: { ...CHART_DEFAULTS.scales.y, min: 0, max: 300, title: { display: true, text: 'Nilai AQI' } }
      }
    }
  });
}

function buildHourlyPM25Chart(locationId) {
  const ctx = document.getElementById('chart-hourly-pm25');
  if (!ctx) return;
  const data = locationId === 'jakarta'
    ? AQI_DATA.hourlyData.datasets.jakarta_pm25
    : AQI_DATA.hourlyData.datasets.jakarta_pm25.map(v => parseFloat((v * 0.6 + Math.random() * 5).toFixed(1)));

  if (chartHourlyPM25) chartHourlyPM25.destroy();

  chartHourlyPM25 = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: AQI_DATA.hourlyData.labels,
      datasets: [{
        label: 'PM2.5 (µg/m³)',
        data: data,
        backgroundColor: data.map(v => v > 35 ? 'rgba(239,68,68,0.7)' : v > 12 ? 'rgba(234,179,8,0.7)' : 'rgba(34,197,94,0.7)'),
        borderRadius: 4,
      }]
    },
    options: {
      ...CHART_DEFAULTS,
      scales: {
        ...CHART_DEFAULTS.scales,
        y: { ...CHART_DEFAULTS.scales.y, min: 0, title: { display: true, text: 'µg/m³' } }
      }
    }
  });
}

function buildMonthlyChart() {
  const ctx = document.getElementById('chart-monthly');
  if (!ctx) return;
  if (chartMonthly) chartMonthly.destroy();

  chartMonthly = new Chart(ctx, {
    type: 'line',
    data: {
      labels: AQI_DATA.monthlyData.labels,
      datasets: [
        {
          label: 'Jakarta',
          data: AQI_DATA.monthlyData.jakarta,
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14,165,233,0.06)',
          borderWidth: 2, fill: true, tension: 0.4, pointRadius: 3,
        },
        {
          label: 'Pekanbaru (Musim Karhutla)',
          data: AQI_DATA.monthlyData.pekanbaru,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249,115,22,0.06)',
          borderWidth: 2, fill: true, tension: 0.4, pointRadius: 3,
        }
      ]
    },
    options: {
      ...CHART_DEFAULTS,
      scales: {
        ...CHART_DEFAULTS.scales,
        y: { ...CHART_DEFAULTS.scales.y, min: 0, title: { display: true, text: 'Rata-rata AQI Bulanan' } }
      }
    }
  });
}

// ── Leaflet Map ───────────────────────────────────────────────────────────────
let mapInstance = null;

function buildMap() {
  const mapEl = document.getElementById('mini-map');
  if (!mapEl || mapInstance) return;

  mapInstance = L.map('mini-map', { zoomControl: true }).setView([-2.5, 118], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 12,
  }).addTo(mapInstance);

  AQI_DATA.locations.forEach(loc => {
    const cat = getAQICategory(loc.aqi);
    const marker = L.circleMarker([loc.lat, loc.lng], {
      radius: 16,
      fillColor: cat.color,
      color: 'white',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85,
    }).addTo(mapInstance);

    marker.bindPopup(`
      <div style="font-family:Inter,sans-serif;min-width:180px">
        <div style="font-weight:700;font-size:0.95rem;margin-bottom:4px">${loc.name}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span style="font-size:1.8rem;font-weight:900;color:${cat.color}">${loc.aqi}</span>
          <span style="background:${cat.color}22;color:${cat.textColor};padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600">${cat.label}</span>
        </div>
        <div style="font-size:0.8rem;color:#4b5563">PM2.5: <b>${loc.pm25}</b> µg/m³ &nbsp;|&nbsp; PM10: <b>${loc.pm10}</b> µg/m³</div>
        <div style="font-size:0.8rem;color:#4b5563">CO₂: <b>${loc.co2}</b> ppm &nbsp;|&nbsp; Suhu: <b>${loc.temp}°C</b></div>
        <div style="font-size:0.75rem;color:#9ca3af;margin-top:6px">${loc.description}</div>
      </div>
    `, { maxWidth: 240 });
  });
}

// ── Main Update ───────────────────────────────────────────────────────────────
function updateDashboard(locationId) {
  const loc = getLocationById(locationId);
  if (!loc) return;

  updateAQIHero(loc);
  buildHourlyAQIChart(locationId);
  buildHourlyPM25Chart(locationId);
  populateLocationsTable(document.getElementById('search-location')?.value || '');

  document.getElementById('last-updated').textContent =
    new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  populateLocationSelect();
  buildMonthlyChart();
  buildMap();
  updateDashboard('jakarta');

  // Search
  const searchInput = document.getElementById('search-location');
  if (searchInput) {
    searchInput.addEventListener('input', () => populateLocationsTable(searchInput.value));
  }

  // Refresh button
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      const sel = document.getElementById('location-select');
      updateDashboard(sel ? sel.value : 'jakarta');
      window.NapasBumi?.showToast('Data berhasil diperbarui! (Simulasi)', 'success');
    });
  }
});
