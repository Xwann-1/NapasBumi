/**
 * NapasBumi — Karhutla (Forest Fire) Module
 * Handles: Leaflet hotspot map, charts, province filter, hotspot table
 */

'use strict';

let karhutlaMap = null;
let chartDailyHotspot  = null;
let chartMonthlyHotspot = null;

// ── Color by confidence ───────────────────────────────────────────────────────
function getHotspotColor(confidence) {
  return confidence === 'high' ? '#ef4444' : confidence === 'medium' ? '#f97316' : '#eab308';
}

// ── Build Leaflet map ─────────────────────────────────────────────────────────
function buildKarhutlaMap() {
  const mapEl = document.getElementById('map-karhutla');
  if (!mapEl || karhutlaMap) return;

  karhutlaMap = L.map('map-karhutla').setView([-2.5, 118], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 13,
  }).addTo(karhutlaMap);

  const hotspots = (typeof getLiveHotspots === 'function') ? getLiveHotspots() : HOTSPOT_DATA.hotspots;
  hotspots.forEach(h => {
    const color = getHotspotColor(h.confidence);
    const marker = L.circleMarker([h.lat, h.lng], {
      radius: h.confidence === 'high' ? 12 : h.confidence === 'medium' ? 9 : 7,
      fillColor: color,
      color: 'white',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85,
    }).addTo(karhutlaMap);

    const confLabel = h.confidence === 'high' ? 'Tinggi' : h.confidence === 'medium' ? 'Sedang' : 'Rendah';
    marker.bindPopup(`
      <div style="font-family:Inter,sans-serif;min-width:180px">
        <div style="font-weight:700;margin-bottom:4px">🔥 Titik Panas #${h.id}</div>
        <div style="font-size:0.85rem;color:#4b5563;margin-bottom:6px">${h.province}</div>
        <div style="font-size:0.8rem;color:#374151">
          Koordinat: ${h.lat.toFixed(4)}, ${h.lng.toFixed(4)}<br/>
          Tipe: <b>${h.type === 'lahan' ? 'Lahan' : 'Hutan'}</b><br/>
          Kepercayaan: <b style="color:${color}">${confLabel}</b><br/>
          FRP: <b>${h.frp} MW</b><br/>
          Tanggal: ${h.date}
        </div>
      </div>
    `);
  });
}

// ── Province list ─────────────────────────────────────────────────────────────
function renderProvinceList() {
  const container = document.getElementById('province-list');
  if (!container) return;
  const sorted = [...HOTSPOT_DATA.provinceSummary].sort((a, b) => b.total - a.total);
  container.innerHTML = sorted.map(p => {
    const trendIcon = p.trend === 'up' ? '↑' : p.trend === 'down' ? '↓' : '→';
    const trendColor = p.trend === 'up' ? '#ef4444' : p.trend === 'down' ? '#22c55e' : '#94a3b8';
    const barPct = Math.min((p.total / 5) * 100, 100);
    return `
      <div>
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium text-gray-700">${p.province}</span>
          <span class="flex items-center gap-1">
            <span class="font-bold text-orange-700">${p.total}</span>
            <span class="text-xs font-bold" style="color:${trendColor}">${trendIcon}</span>
          </span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${barPct}%;background:linear-gradient(90deg,#f97316,#ef4444)"></div>
        </div>
        <div class="flex gap-3 text-xs text-gray-400 mt-1">
          <span>🔴 ${p.high} tinggi</span>
          <span>🟠 ${p.medium} sedang</span>
          <span>🟡 ${p.low} rendah</span>
        </div>
      </div>
    `;
  }).join('');
}

// ── Populate province filter ──────────────────────────────────────────────────
function populateProvinceFilter() {
  const sel = document.getElementById('filter-province');
  if (!sel) return;
  const hotspots = (typeof getLiveHotspots === 'function') ? getLiveHotspots() : HOTSPOT_DATA.hotspots;
  const provinces = [...new Set(hotspots.map(h => h.province))].sort();
  provinces.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    sel.appendChild(opt);
  });
}

// ── Hotspot table ─────────────────────────────────────────────────────────────
function renderHotspotTable(confidenceFilter = 'all', provinceFilter = 'all') {
  const tbody = document.getElementById('hotspot-table-body');
  if (!tbody) return;

  const allHotspots = (typeof getLiveHotspots === 'function') ? getLiveHotspots() : HOTSPOT_DATA.hotspots;
  const filtered = allHotspots.filter(h => {
    const confOk = confidenceFilter === 'all' || h.confidence === confidenceFilter;
    const provOk = provinceFilter === 'all' || h.province === provinceFilter;
    return confOk && provOk;
  });

  tbody.innerHTML = filtered.map(h => {
    const color = getHotspotColor(h.confidence);
    const confLabel = h.confidence === 'high' ? 'Tinggi' : h.confidence === 'medium' ? 'Sedang' : 'Rendah';
    return `
      <tr class="border-b hover:bg-orange-50 transition-colors" style="border-color:#fff7ed">
        <td class="py-2 px-3 text-gray-500">#${h.id}</td>
        <td class="py-2 px-3 font-medium text-gray-700">${h.province}</td>
        <td class="py-2 px-3 text-center text-xs text-gray-500">${h.lat.toFixed(4)}, ${h.lng.toFixed(4)}</td>
        <td class="py-2 px-3 text-center">
          <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                style="background:#fef9c3;color:#713f12">${h.type === 'lahan' ? '🌾 Lahan' : '🌳 Hutan'}</span>
        </td>
        <td class="py-2 px-3 text-center">
          <span class="px-2 py-0.5 rounded-full text-xs font-bold"
                style="background:${color}22;color:${color}">${confLabel}</span>
        </td>
        <td class="py-2 px-3 text-center font-semibold" style="color:${color}">${h.frp != null ? h.frp : '—'}</td>
        <td class="py-2 px-3 text-center text-gray-500 text-xs">${h.date}${h.source ? ' <span class="text-green-600">●</span>' : ''}</td>
      </tr>
    `;
  }).join('');

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-gray-400">Tidak ada titik panas dengan filter ini</td></tr>`;
  }
}

// ── Charts ────────────────────────────────────────────────────────────────────
function buildDailyHotspotChart() {
  const ctx = document.getElementById('chart-daily-hotspot');
  if (!ctx) return;
  if (chartDailyHotspot) chartDailyHotspot.destroy();

  chartDailyHotspot = new Chart(ctx, {
    type: 'line',
    data: {
      labels: HOTSPOT_DATA.dailyTrend.labels,
      datasets: [{
        label: 'Total Hotspot Nasional',
        data: HOTSPOT_DATA.dailyTrend.total,
        borderColor: '#f97316',
        backgroundColor: 'rgba(249,115,22,0.1)',
        borderWidth: 2, fill: true, tension: 0.4,
        pointRadius: 4, pointBackgroundColor: '#f97316',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { grid: { color: '#fff7ed' }, ticks: { font: { size: 10 }, maxRotation: 45 } },
        y: { grid: { color: '#fff7ed' }, min: 0, title: { display: true, text: 'Jumlah Titik Panas' } }
      }
    }
  });
}

function buildMonthlyHotspotChart() {
  const ctx = document.getElementById('chart-monthly-hotspot');
  if (!ctx) return;
  if (chartMonthlyHotspot) chartMonthlyHotspot.destroy();

  chartMonthlyHotspot = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: HOTSPOT_DATA.monthlyHistory.labels,
      datasets: [
        {
          label: 'Kalimantan',
          data: HOTSPOT_DATA.monthlyHistory.kalimantan,
          backgroundColor: 'rgba(249,115,22,0.75)',
          borderRadius: 4,
        },
        {
          label: 'Sumatera',
          data: HOTSPOT_DATA.monthlyHistory.sumatera,
          backgroundColor: 'rgba(239,68,68,0.75)',
          borderRadius: 4,
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { grid: { color: '#fff7ed' }, stacked: false },
        y: { grid: { color: '#fff7ed' }, min: 0, title: { display: true, text: 'Jumlah Hotspot' } }
      }
    }
  });
}

// ── Rebuild map markers with live hotspots ────────────────────────────────────
function rebuildHotspotMarkers() {
  if (!karhutlaMap) return;
  karhutlaMap.eachLayer(layer => {
    if (layer instanceof L.CircleMarker) karhutlaMap.removeLayer(layer);
  });

  const hotspots = (typeof getLiveHotspots === 'function') ? getLiveHotspots() : HOTSPOT_DATA.hotspots;
  hotspots.forEach(h => {
    const color     = getHotspotColor(h.confidence);
    const confLabel = h.confidence === 'high' ? 'Tinggi' : h.confidence === 'medium' ? 'Sedang' : 'Rendah';
    const isLive    = !!h.source;
    const marker    = L.circleMarker([h.lat, h.lng], {
      radius:      h.confidence === 'high' ? 12 : h.confidence === 'medium' ? 9 : 7,
      fillColor:   color,
      color:       isLive ? '#fff' : '#d1d5db',
      weight:      isLive ? 2.5 : 1.5,
      opacity:     1,
      fillOpacity: 0.85,
    }).addTo(karhutlaMap);

    const liveTag = isLive
      ? `<span style="color:#22c55e;font-size:0.72rem;font-weight:700">● NASA EONET Live</span>`
      : `<span style="color:#9ca3af;font-size:0.72rem">⚠️ Simulasi</span>`;

    marker.bindPopup(`
      <div style="font-family:Inter,sans-serif;min-width:180px">
        <div style="font-weight:700;margin-bottom:2px">🔥 ${isLive ? h.title || 'Wildfire' : `Titik Panas #${h.id}`}</div>
        <div style="margin-bottom:6px">${liveTag}</div>
        <div style="font-size:0.85rem;color:#4b5563;margin-bottom:4px">${h.province}</div>
        <div style="font-size:0.8rem;color:#374151">
          Koordinat: ${h.lat.toFixed(4)}, ${h.lng.toFixed(4)}<br/>
          Kepercayaan: <b style="color:${color}">${confLabel}</b><br/>
          ${h.frp != null ? `FRP: <b>${h.frp} MW</b><br/>` : ''}
          Tanggal: ${h.date}
        </div>
      </div>
    `);
  });

  // Update live stats banner
  const totalEl = document.getElementById('stat-total-hotspot');
  if (totalEl) totalEl.textContent = hotspots.length;
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildKarhutlaMap();
  renderProvinceList();
  populateProvinceFilter();
  renderHotspotTable();
  buildDailyHotspotChart();
  buildMonthlyHotspotChart();

  // Register live-data callback
  if (typeof LiveData !== 'undefined') {
    LiveData.onUpdate(() => {
      rebuildHotspotMarkers();
      const confFilter = document.getElementById('filter-confidence');
      const provFilter = document.getElementById('filter-province');
      renderHotspotTable(
        confFilter ? confFilter.value : 'all',
        provFilter ? provFilter.value : 'all'
      );
    });
  }

  // Filters
  const confFilter = document.getElementById('filter-confidence');
  const provFilter = document.getElementById('filter-province');
  function applyFilters() {
    renderHotspotTable(
      confFilter ? confFilter.value : 'all',
      provFilter ? provFilter.value : 'all'
    );
  }
  if (confFilter) confFilter.addEventListener('change', applyFilters);
  if (provFilter) provFilter.addEventListener('change', applyFilters);
});
