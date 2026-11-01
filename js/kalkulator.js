/**
 * NapasBumi — Carbon Footprint Calculator
 * Emission factors based on: IPCC AR6, PLN 2023, KLHK, FAO
 * Output: kg CO₂e per month
 */

'use strict';

// ── Emission Factors ──────────────────────────────────────────────────────────
const EF = {
  car: {
    bensin:  0.21,   // kg CO₂/km  (KLHK)
    solar:   0.27,   // kg CO₂/km
    listrik: 0.072,  // kg CO₂/km (EV + PLN grid)
  },
  motor:       0.11,    // kg CO₂/km
  flightDom:   255,     // kg CO₂/hour (ICAO domestic avg)
  flightInt:   295,     // kg CO₂/hour (ICAO international avg)
  electricity: 0.724,   // kg CO₂/kWh (PLN 2023 grid intensity)
  lpg:         3.0,     // kg CO₂e/kg LPG (IPCC)
  diet: {
    omnivore:   250,    // kg CO₂e/month
    'less-meat': 160,
    vegetarian:  90,
    vegan:       60,
  },
  clothes:     8.5,     // kg CO₂e/item (fashion industry average)
  waste:       0.5,     // kg CO₂e/kg (landfill TPA)
  internet:    0.036,   // kg CO₂/hour (IEA streaming)
};

// Chart instance
let pieChart  = null;
let barChart  = null;

// ── Calculate emissions ───────────────────────────────────────────────────────
function calculateEmissions() {
  const get = (id) => parseFloat(document.getElementById(id)?.value) || 0;
  const getVal = (id) => document.getElementById(id)?.value || '';

  const fuelType = getVal('fuel-type') || 'bensin';
  const dietType = getVal('diet-type') || 'less-meat';

  const breakdown = {
    transport: 0,
    energy:    0,
    diet:      0,
    lifestyle: 0,
  };

  // Transport
  const carKm    = get('km-car');
  const motorKm  = get('km-motor');
  const flightD  = get('hr-flight-dom');
  const flightI  = get('hr-flight-int');

  breakdown.transport =
    carKm   * (EF.car[fuelType] || EF.car.bensin) +
    motorKm * EF.motor +
    flightD * EF.flightDom +
    flightI * EF.flightInt;

  // Energy
  const kwh = get('kwh-electric');
  const lpg = get('kg-lpg');
  breakdown.energy = kwh * EF.electricity + lpg * EF.lpg;

  // Diet (per month)
  breakdown.diet = EF.diet[dietType] || EF.diet['less-meat'];

  // Lifestyle
  const clothes  = get('clothes-items');
  const wasteKg  = get('waste-kg');
  const internet = get('hr-internet');
  breakdown.lifestyle =
    clothes  * EF.clothes +
    wasteKg  * EF.waste * 4 +   // weeks → month
    internet * EF.internet * 30; // days → month

  return breakdown;
}

// ── Render Results ────────────────────────────────────────────────────────────
function renderResults(breakdown) {
  const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
  const totalRounded = Math.round(total);
  const annualTons   = (total * 12 / 1000).toFixed(2);

  // Hero numbers
  document.getElementById('result-total').textContent   = totalRounded.toLocaleString('id-ID');
  document.getElementById('result-annual').textContent  = annualTons + ' ton CO₂e / tahun';

  // Comparison text
  const avgIndonesia = 2300 / 12; // ~192 kg/month
  const diff = totalRounded - avgIndonesia;
  const comp = document.getElementById('result-comparison');
  if (diff > 50) {
    comp.innerHTML = `<span class="text-red-600 font-semibold">⬆️ ${Math.round(diff)} kg lebih tinggi</span> dari rata-rata warga Indonesia (~192 kg/bulan). Perlu upaya pengurangan.`;
  } else if (diff < -50) {
    comp.innerHTML = `<span class="text-green-600 font-semibold">⬇️ ${Math.round(Math.abs(diff))} kg lebih rendah</span> dari rata-rata warga Indonesia (~192 kg/bulan). Pertahankan gaya hidup hijau!`;
  } else {
    comp.innerHTML = `<span class="text-yellow-600 font-semibold">➡️ Setara</span> dengan rata-rata warga Indonesia (~192 kg/bulan).`;
  }

  // Level badge
  const badge = document.getElementById('result-level-badge');
  if (totalRounded < 100) {
    badge.textContent = '🌿 Jejak Sangat Rendah — Luar Biasa!';
    badge.style.cssText = 'background:#d1fae5;color:#065f46';
  } else if (totalRounded < 200) {
    badge.textContent = '✅ Jejak Rendah — Bagus!';
    badge.style.cssText = 'background:#dcfce7;color:#166534';
  } else if (totalRounded < 350) {
    badge.textContent = '⚠️ Jejak Sedang — Bisa Ditingkatkan';
    badge.style.cssText = 'background:#fef9c3;color:#713f12';
  } else if (totalRounded < 600) {
    badge.textContent = '🔴 Jejak Tinggi — Perlu Tindakan';
    badge.style.cssText = 'background:#fee2e2;color:#991b1b';
  } else {
    badge.textContent = '🚨 Jejak Sangat Tinggi — Urgent!';
    badge.style.cssText = 'background:#fce7f3;color:#9d174d';
  }

  // Breakdown list
  const cats = [
    { key: 'transport', label: '🚗 Transportasi',          color: '#0ea5e9' },
    { key: 'energy',    label: '⚡ Energi Rumah Tangga',   color: '#eab308' },
    { key: 'diet',      label: '🍽️ Konsumsi Makanan',      color: '#22c55e' },
    { key: 'lifestyle', label: '🛒 Gaya Hidup & Konsumsi', color: '#a855f7' },
  ];

  const breakdownContainer = document.getElementById('breakdown-list');
  breakdownContainer.innerHTML = cats.map(c => {
    const val  = Math.round(breakdown[c.key]);
    const pct  = total > 0 ? ((breakdown[c.key] / total) * 100).toFixed(1) : 0;
    return `
      <div>
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium text-gray-700">${c.label}</span>
          <span class="text-sm font-bold" style="color:${c.color}">${val.toLocaleString('id-ID')} kg (${pct}%)</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%;background:${c.color}"></div>
        </div>
      </div>
    `;
  }).join('');

  // Pie chart
  buildPieChart(breakdown, cats);
  buildBarChart(breakdown, cats);

  // Recommendations
  renderRecommendations(breakdown, total);

  // Show results
  document.getElementById('results-section').classList.remove('hidden');
  document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Charts ────────────────────────────────────────────────────────────────────
function buildPieChart(breakdown, cats) {
  const ctx = document.getElementById('chart-pie');
  if (!ctx) return;
  if (pieChart) pieChart.destroy();

  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: cats.map(c => c.label),
      datasets: [{
        data: cats.map(c => Math.round(breakdown[c.key])),
        backgroundColor: cats.map(c => c.color),
        borderWidth: 2,
        borderColor: 'white',
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.raw} kg (${((ctx.raw / Object.values(breakdown).reduce((a,b)=>a+b,0))*100).toFixed(1)}%)`
          }
        }
      }
    }
  });
}

function buildBarChart(breakdown, cats) {
  const ctx = document.getElementById('chart-breakdown-bar');
  if (!ctx) return;
  if (barChart) barChart.destroy();

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: cats.map(c => c.label),
      datasets: [{
        label: 'kg CO₂e / bulan',
        data: cats.map(c => Math.round(breakdown[c.key])),
        backgroundColor: cats.map(c => c.color + 'cc'),
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: '#f0fdf4' }, title: { display: true, text: 'kg CO₂e' } },
        y: { grid: { color: '#f0fdf4' } }
      }
    }
  });
}

// ── Recommendations ───────────────────────────────────────────────────────────
function renderRecommendations(breakdown, total) {
  const container = document.getElementById('recommendations-list');
  if (!container) return;

  const recs = [];

  if (breakdown.transport > 100) {
    recs.push({
      icon: '🚌',
      title: 'Beralih ke Transportasi Umum',
      desc: `Transportasi menyumbang ${Math.round((breakdown.transport/total)*100)}% emisi Anda. Gunakan KRL, BRT, atau MRT untuk perjalanan rutin.`,
      saving: Math.round(breakdown.transport * 0.3),
    });
  }
  if (breakdown.transport > 50) {
    recs.push({
      icon: '🚲',
      title: 'Gunakan Sepeda atau Jalan Kaki',
      desc: 'Untuk perjalanan < 5 km, sepeda atau berjalan kaki menghasilkan nol emisi dan meningkatkan kesehatan.',
      saving: Math.round(breakdown.transport * 0.15),
    });
  }
  if (breakdown.energy > 80) {
    recs.push({
      icon: '💡',
      title: 'Hemat Energi Listrik',
      desc: `Energi menyumbang ${Math.round((breakdown.energy/total)*100)}% emisi. Matikan perangkat yang tidak digunakan, gunakan lampu LED, dan atur AC di 24°C.`,
      saving: Math.round(breakdown.energy * 0.25),
    });
  }
  if (breakdown.diet > 150) {
    recs.push({
      icon: '🥗',
      title: 'Kurangi Konsumsi Daging',
      desc: 'Produksi daging sapi menghasilkan 27 kg CO₂e/kg. Mengganti 2 porsi daging/minggu dengan protein nabati dapat mengurangi emisi diet hingga 30%.',
      saving: Math.round(breakdown.diet * 0.3),
    });
  }
  if (breakdown.lifestyle > 50) {
    recs.push({
      icon: '♻️',
      title: 'Kurangi dan Pisahkan Sampah',
      desc: 'Pisahkan sampah organik dan daur ulang. Kompos sampah dapur mengurangi emisi methana dari TPA dan menghasilkan pupuk alami.',
      saving: Math.round(breakdown.lifestyle * 0.2),
    });
  }

  // Always show these
  recs.push({
    icon: '🌳',
    title: 'Tanam Pohon',
    desc: 'Satu pohon menyerap ~21 kg CO₂/tahun. Menanam 3 pohon dapat mengimbangi ~63 kg emisi Anda per tahun.',
    saving: 5,
  });
  recs.push({
    icon: '☀️',
    title: 'Pertimbangkan Panel Surya',
    desc: 'Instalasi panel surya 2 kWp dapat mengurangi emisi listrik rumah tangga hingga 1.2 ton CO₂/tahun.',
    saving: 100,
  });

  container.innerHTML = recs.slice(0, 5).map(r => `
    <div class="flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-green-50" style="border:1.5px solid #e8f5ee">
      <span class="text-3xl">${r.icon}</span>
      <div class="flex-1">
        <div class="font-semibold text-gray-800">${r.title}</div>
        <div class="text-gray-500 text-sm mt-0.5">${r.desc}</div>
      </div>
      <div class="text-center min-w-[80px]">
        <div class="text-lg font-bold text-green-600">-${r.saving}</div>
        <div class="text-xs text-gray-400">kg CO₂e/bln</div>
      </div>
    </div>
  `).join('');
}

// ── Save to history ───────────────────────────────────────────────────────────
function saveToHistory(breakdown) {
  const { Storage, STORAGE_KEYS, showToast } = window.NapasBumi;
  const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
  const record = {
    id: Date.now(),
    date: new Date().toISOString(),
    total: Math.round(total),
    breakdown: {
      transport: Math.round(breakdown.transport),
      energy:    Math.round(breakdown.energy),
      diet:      Math.round(breakdown.diet),
      lifestyle: Math.round(breakdown.lifestyle),
    }
  };

  Storage.update(STORAGE_KEYS.CARBON_HISTORY, (history) => {
    const arr = Array.isArray(history) ? history : [];
    return [record, ...arr].slice(0, 20); // keep last 20
  }, []);

  showToast('Hasil perhitungan disimpan ke riwayat!', 'success');
}

// ── Form handling ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('carbon-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const breakdown = calculateEmissions();
      renderResults(breakdown);

      // Store latest breakdown for save button
      window._lastBreakdown = breakdown;
    });
  }

  const resetBtn = document.getElementById('reset-form-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.getElementById('carbon-form').reset();
      document.getElementById('results-section').classList.add('hidden');
    });
  }

  const saveBtn = document.getElementById('save-result-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (window._lastBreakdown) {
        saveToHistory(window._lastBreakdown);
      } else {
        window.NapasBumi?.showToast('Hitung dulu jejak karbon Anda!', 'warning');
      }
    });
  }
});
