/**
 * NapasBumi — Profile Module
 * Handles: user profile display/edit, carbon history, eco-action history, reports
 */

'use strict';

// Eco action definitions (mirrors eco-action.js — lightweight import)
const ACTION_REGISTRY = {
  t1:{icon:'🚌',title:'Gunakan Transportasi Umum'},
  t2:{icon:'🚲',title:'Bersepeda atau Jalan Kaki'},
  t3:{icon:'🚗',title:'Carpooling'},
  t4:{icon:'🛵',title:'Matikan Mesin saat Berhenti'},
  t5:{icon:'⚡',title:'Kendaraan Listrik'},
  e1:{icon:'💡',title:'Matikan Lampu'},
  e2:{icon:'❄️',title:'Atur AC 24-26°C'},
  e3:{icon:'🔌',title:'Cabut Perangkat Standby'},
  e4:{icon:'☀️',title:'Jemur Pakaian'},
  e5:{icon:'🔆',title:'Ganti ke Lampu LED'},
  f1:{icon:'🥗',title:'Makan Tanpa Daging'},
  f2:{icon:'🛒',title:'Belanja Produk Lokal'},
  f3:{icon:'🥡',title:'Kurangi Pemborosan Makanan'},
  f4:{icon:'🍶',title:'Bawa Tumbler & Tas'},
  f5:{icon:'🌾',title:'Protein Nabati'},
  w1:{icon:'♻️',title:'Pisahkan Sampah'},
  w2:{icon:'🌱',title:'Buat Kompos'},
  w3:{icon:'📦',title:'Daur Ulang'},
  w4:{icon:'🚿',title:'Kurangi Penggunaan Air'},
  w5:{icon:'🛍️',title:'Tolak Kantong Plastik'},
  n1:{icon:'🌳',title:'Tanam Satu Pohon'},
  n2:{icon:'🌿',title:'Rawat Tanaman'},
  n3:{icon:'🏞️',title:'Ikut Penghijauan'},
  n4:{icon:'🌊',title:'Bersihkan Pantai/Sungai'},
  n5:{icon:'🔥',title:'Tidak Membakar Lahan'},
  c1:{icon:'📢',title:'Edukasi Lingkungan'},
  c2:{icon:'📋',title:'Buat Laporan Lingkungan'},
  c3:{icon:'🏘️',title:'Inisiasi Gerakan Hijau'},
  c4:{icon:'📱',title:'Bagikan Konten Lingkungan'},
};

const ACTION_CO2 = {
  t1:2.5,t2:3.2,t3:2.1,t4:0.5,t5:0,
  e1:0.4,e2:0.7,e3:0.3,e4:1.2,e5:5.0,
  f1:5.0,f2:1.5,f3:2.0,f4:0.8,f5:4.0,
  w1:2.5,w2:3.0,w3:1.8,w4:0.2,w5:0.5,
  n1:21,n2:0.5,n3:50,n4:5,n5:10,
  c1:0,c2:0,c3:0,c4:0,
};

let carbonChart = null;

// ── Render profile card ───────────────────────────────────────────────────────
function renderProfile() {
  const { User, STORAGE_KEYS, Storage, formatDate, getLevel } = window.NapasBumi;
  const user     = User.get();
  const points   = User.getPoints();
  const actions  = Storage.get(STORAGE_KEYS.ECO_ACTIONS, []);
  const history  = Storage.get(STORAGE_KEYS.CARBON_HISTORY, []);
  const reports  = Storage.get(STORAGE_KEYS.REPORTS, []);
  const levelInfo = getLevel(points);

  setText('profile-name',     user.name);
  setText('profile-email',    user.email);
  setText('profile-location', user.location);
  setText('profile-points',   points);
  setText('profile-actions',  actions.length);
  setText('profile-calcs',    history.length);
  setText('profile-reports',  reports.length);
  setText('profile-join',     'Bergabung: ' + formatDate(user.joinDate || new Date().toISOString()));
  setText('profile-level-badge', `⭐ Level ${levelInfo.level} — ${levelInfo.name}`);

  renderCompletedActions(actions);
  renderCarbonHistory(history);
  renderProfileReports(reports);
  renderContribution(actions);
}

// ── Completed actions ─────────────────────────────────────────────────────────
function renderCompletedActions(actionIds) {
  const container = document.getElementById('completed-actions-list');
  if (!container) return;

  if (!actionIds.length) {
    container.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">Belum ada aksi diselesaikan. <a href="eco-action.html" class="text-green-600 underline">Mulai sekarang →</a></p>`;
    return;
  }

  container.innerHTML = actionIds.map(id => {
    const action = ACTION_REGISTRY[id];
    if (!action) return '';
    return `
      <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 transition-colors">
        <span class="text-xl">${action.icon}</span>
        <span class="text-sm font-medium text-gray-700 flex-1">${action.title}</span>
        <span class="text-green-600 text-xs font-semibold">✓ Selesai</span>
      </div>
    `;
  }).join('');
}

// ── Carbon history ────────────────────────────────────────────────────────────
function renderCarbonHistory(history) {
  const container = document.getElementById('carbon-history-container');
  const canvas    = document.getElementById('chart-carbon-history');
  if (!container) return;

  if (!history.length) {
    container.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">Belum ada riwayat. <a href="kalkulator.html" class="text-green-600 underline">Hitung sekarang →</a></p>`;
    if (canvas) canvas.classList.add('hidden');
    return;
  }

  // Show list
  const latest = history.slice(0, 5);
  container.innerHTML = latest.map(r => {
    const date = window.NapasBumi.formatDate(r.date);
    const color = r.total < 200 ? '#22c55e' : r.total < 400 ? '#eab308' : '#ef4444';
    return `
      <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 transition-colors">
        <span class="text-xl">🧮</span>
        <div class="flex-1">
          <span class="text-sm font-medium text-gray-700">${date}</span>
          <div class="text-xs text-gray-400">Transport: ${r.breakdown?.transport || 0} | Energi: ${r.breakdown?.energy || 0} | Pola Makan: ${r.breakdown?.diet || 0} | Gaya Hidup: ${r.breakdown?.lifestyle || 0} kg</div>
        </div>
        <span class="font-bold text-sm" style="color:${color}">${r.total} kg</span>
      </div>
    `;
  }).join('');

  // Chart
  if (history.length >= 2 && canvas) {
    canvas.classList.remove('hidden');
    buildCarbonHistoryChart(history.slice(0, 10).reverse());
  }
}

function buildCarbonHistoryChart(history) {
  const ctx = document.getElementById('chart-carbon-history');
  if (!ctx) return;
  if (carbonChart) carbonChart.destroy();

  carbonChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: history.map((_, i) => `Pengukuran ${i + 1}`),
      datasets: [{
        label: 'Jejak Karbon (kg CO₂e/bulan)',
        data: history.map(r => r.total),
        borderColor: '#1a6b3c',
        backgroundColor: 'rgba(26,107,60,0.1)',
        borderWidth: 2, fill: true, tension: 0.4,
        pointRadius: 4, pointBackgroundColor: '#1a6b3c',
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: {
        y: { grid: { color: '#f0fdf4' }, title: { display: true, text: 'kg CO₂e' }, min: 0 },
        x: { grid: { color: '#f0fdf4' } }
      }
    }
  });
}

// ── Reports list ──────────────────────────────────────────────────────────────
function renderProfileReports(reports) {
  const container = document.getElementById('profile-reports-list');
  if (!container) return;

  if (!reports.length) {
    container.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">Belum ada laporan. <a href="laporan.html" class="text-green-600 underline">Buat laporan →</a></p>`;
    return;
  }

  const statusMap = {
    pending:  { label:'Pending',  bg:'#fef3c7', color:'#92400e' },
    reviewed: { label:'Reviewed', bg:'#dbeafe', color:'#1e40af' },
    resolved: { label:'Resolved', bg:'#d1fae5', color:'#065f46' },
  };

  container.innerHTML = reports.slice(0, 8).map(r => {
    const st = statusMap[r.status] || statusMap.pending;
    const date = window.NapasBumi.formatDate(r.date);
    return `
      <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 transition-colors">
        <span class="text-xl">📋</span>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-700 truncate">${window.NapasBumi.escapeHtml(r.location)}</div>
          <div class="text-xs text-gray-400">${date}</div>
        </div>
        <span class="text-xs px-2 py-0.5 rounded-full font-semibold" style="background:${st.bg};color:${st.color}">${st.label}</span>
      </div>
    `;
  }).join('');
}

// ── Contribution stats ────────────────────────────────────────────────────────
function renderContribution(actionIds) {
  const totalCO2 = actionIds.reduce((s, id) => s + (ACTION_CO2[id] || 0), 0);
  const trees    = Math.round(totalCO2 / 21); // 1 tree = ~21 kg/year
  const carKm    = Math.round(totalCO2 / 0.21); // avg car 0.21 kg/km

  setText('total-co2-estimate', Math.round(totalCO2));
  setText('total-trees-equiv',  trees);
  setText('total-km-cars',      carKm.toLocaleString('id-ID'));
}

// ── Edit profile ──────────────────────────────────────────────────────────────
function initEditProfile() {
  const editBtn    = document.getElementById('edit-profile-btn');
  const editForm   = document.getElementById('edit-profile-form');
  const saveBtn    = document.getElementById('save-profile-btn');
  const cancelBtn  = document.getElementById('cancel-edit-btn');

  editBtn?.addEventListener('click', () => {
    const user = window.NapasBumi.User.get();
    document.getElementById('edit-name').value     = user.name;
    document.getElementById('edit-email').value    = user.email;
    document.getElementById('edit-location').value = user.location;
    editForm?.classList.remove('hidden');
    editBtn.classList.add('hidden');
  });

  saveBtn?.addEventListener('click', () => {
    const name     = document.getElementById('edit-name').value.trim();
    const email    = document.getElementById('edit-email').value.trim();
    const location = document.getElementById('edit-location').value.trim();
    if (!name) {
      window.NapasBumi.showToast('Nama tidak boleh kosong.', 'error');
      return;
    }
    window.NapasBumi.User.save({ name, email, location });
    editForm?.classList.add('hidden');
    editBtn?.classList.remove('hidden');
    renderProfile();
    window.NapasBumi.showToast('Profil berhasil diperbarui!', 'success');
  });

  cancelBtn?.addEventListener('click', () => {
    editForm?.classList.add('hidden');
    editBtn?.classList.remove('hidden');
  });
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProfile();
  initEditProfile();
});
