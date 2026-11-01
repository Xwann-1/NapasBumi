/**
 * NapasBumi — Eco Action Module
 * Handles: action list, completion tracking, points, achievements, progress charts
 */

'use strict';

// ── Action Definitions ────────────────────────────────────────────────────────
const ECO_ACTIONS = [
  // Transport
  { id:'t1', cat:'transport', icon:'🚌', title:'Gunakan Transportasi Umum',       desc:'Pilih bus, KRL, MRT, atau BRT untuk perjalanan hari ini.',         points:15, co2:2.5,  frequency:'daily' },
  { id:'t2', cat:'transport', icon:'🚲', title:'Bersepeda atau Jalan Kaki',         desc:'Untuk jarak < 5 km, pilih bersepeda atau berjalan kaki.',          points:20, co2:3.2,  frequency:'daily' },
  { id:'t3', cat:'transport', icon:'🚗', title:'Carpooling Bersama Rekan',          desc:'Berbagi kendaraan dengan teman atau kolega menuju tujuan yang sama.',points:12, co2:2.1,  frequency:'daily' },
  { id:'t4', cat:'transport', icon:'🛵', title:'Matikan Mesin saat Berhenti',        desc:'Hindari idle kendaraan lebih dari 1 menit untuk hemat BBM.',        points:5,  co2:0.5,  frequency:'daily' },
  { id:'t5', cat:'transport', icon:'⚡', title:'Pertimbangkan Kendaraan Listrik',    desc:'Riset dan bandingkan kendaraan listrik sebagai langkah jangka panjang.', points:30, co2:0, frequency:'once' },

  // Energy
  { id:'e1', cat:'energy', icon:'💡', title:'Matikan Lampu Tidak Terpakai',       desc:'Pastikan mematikan lampu di ruangan yang tidak digunakan.',          points:8,  co2:0.4,  frequency:'daily' },
  { id:'e2', cat:'energy', icon:'❄️', title:'Atur AC di 24–26°C',                 desc:'Setiap 1°C penurunan suhu AC meningkatkan konsumsi listrik 6–8%.',  points:10, co2:0.7,  frequency:'daily' },
  { id:'e3', cat:'energy', icon:'🔌', title:'Cabut Perangkat Standby',             desc:'Charger dan TV standby tetap mengonsumsi listrik. Cabut saat tidak digunakan.',points:8, co2:0.3, frequency:'daily' },
  { id:'e4', cat:'energy', icon:'☀️', title:'Jemur Pakaian di Bawah Sinar Matahari', desc:'Hindari penggunaan mesin pengering. Matahari gratis dan nol emisi.', points:10, co2:1.2, frequency:'weekly' },
  { id:'e5', cat:'energy', icon:'🔆', title:'Ganti ke Lampu LED',                  desc:'Lampu LED 80% lebih hemat energi dari lampu pijar. Investasi sekali, hemat selamanya.', points:25, co2:5.0, frequency:'once' },

  // Food
  { id:'f1', cat:'food', icon:'🥗', title:'Makan Satu Hari Tanpa Daging',          desc:'Pilih makanan nabati hari ini. Produksi daging sapi = 27 kg CO₂/kg.',points:15, co2:5.0,  frequency:'daily' },
  { id:'f2', cat:'food', icon:'🛒', title:'Belanja Produk Lokal',                   desc:'Pilih produk dari petani lokal untuk mengurangi emisi transportasi pangan.', points:10, co2:1.5, frequency:'weekly' },
  { id:'f3', cat:'food', icon:'🥡', title:'Kurangi Pemborosan Makanan',             desc:'Masak dan beli sesuai kebutuhan. 1/3 makanan dunia terbuang sia-sia.', points:12, co2:2.0, frequency:'daily' },
  { id:'f4', cat:'food', icon:'🍶', title:'Bawa Tumbler & Tas Sendiri',             desc:'Tolak plastik sekali pakai. Bawa botol minum dan tas belanja dari rumah.', points:10, co2:0.8, frequency:'daily' },
  { id:'f5', cat:'food', icon:'🌾', title:'Coba Protein Nabati Alternatif',         desc:'Tempe, tahu, dan kacang-kacangan menghasilkan 95% lebih sedikit emisi dari daging sapi.',points:12, co2:4.0, frequency:'weekly' },

  // Waste
  { id:'w1', cat:'waste', icon:'♻️', title:'Pisahkan Sampah Organik & Non-Organik', desc:'Sampah yang dipilah mengurangi emisi metana dari TPA secara signifikan.',points:15, co2:2.5, frequency:'daily' },
  { id:'w2', cat:'waste', icon:'🌱', title:'Buat Kompos dari Sisa Makanan',          desc:'Kompos mengurangi sampah organik dan menghasilkan pupuk alami untuk tanaman.', points:20, co2:3.0, frequency:'weekly' },
  { id:'w3', cat:'waste', icon:'📦', title:'Daur Ulang Kertas & Plastik',            desc:'Sortir dan kumpulkan kertas, plastik, logam untuk diserahkan ke bank sampah.', points:12, co2:1.8, frequency:'weekly' },
  { id:'w4', cat:'waste', icon:'🚿', title:'Kurangi Penggunaan Air',                 desc:'Mandi dengan durasi lebih singkat dan matikan keran saat menyikat gigi.', points:8, co2:0.2, frequency:'daily' },
  { id:'w5', cat:'waste', icon:'🛍️', title:'Tolak Kantong Plastik Sekali Pakai',     desc:'Selalu bawa tas belanja sendiri. Indonesia penghasil sampah plastik laut ke-2 di dunia.', points:10, co2:0.5, frequency:'daily' },

  // Nature
  { id:'n1', cat:'nature', icon:'🌳', title:'Tanam Satu Pohon',                     desc:'Satu pohon menyerap ~21 kg CO₂/tahun. Tanam di halaman, sekolah, atau program komunitas.',points:50, co2:21, frequency:'monthly' },
  { id:'n2', cat:'nature', icon:'🌿', title:'Rawat Tanaman di Rumah',               desc:'Tanaman hias dalam ruangan meningkatkan kualitas udara dan keanekaragaman hayati.',points:15, co2:0.5, frequency:'weekly' },
  { id:'n3', cat:'nature', icon:'🏞️', title:'Ikut Kegiatan Penghijauan',             desc:'Bergabung dengan komunitas penanaman pohon di kawasan gundul atau area perkotaan.', points:40, co2:50, frequency:'monthly' },
  { id:'n4', cat:'nature', icon:'🌊', title:'Bersihkan Pantai atau Sungai',          desc:'Ikut aksi bersih lingkungan untuk menjaga ekosistem air dari pencemaran plastik.', points:35, co2:5.0, frequency:'monthly' },
  { id:'n5', cat:'nature', icon:'🔥', title:'Tidak Membakar Sampah atau Lahan',      desc:'Pembakaran lahan menghasilkan emisi besar dan berkontribusi pada karhutla.', points:20, co2:10, frequency:'daily' },

  // Community
  { id:'c1', cat:'community', icon:'📢', title:'Edukasi Lingkungan ke Sekitar',     desc:'Bagikan informasi tentang kualitas udara atau karhutla kepada keluarga dan teman.', points:20, co2:0, frequency:'weekly' },
  { id:'c2', cat:'community', icon:'📋', title:'Buat Laporan Lingkungan',            desc:'Laporkan indikasi kebakaran, asap pekat, atau pencemaran di sekitar Anda.',points:25, co2:0, frequency:'weekly' },
  { id:'c3', cat:'community', icon:'🏘️', title:'Inisiasi Gerakan Hijau Komunitas',   desc:'Ajak tetangga atau rekan kerja untuk memulai kebiasaan lingkungan positif bersama.',points:30, co2:0, frequency:'monthly' },
  { id:'c4', cat:'community', icon:'📱', title:'Bagikan Konten Lingkungan',          desc:'Sebarkan kesadaran lingkungan di media sosial dengan konten yang tepat dan akurat.', points:10, co2:0, frequency:'daily' },
];

const ACHIEVEMENTS = [
  { id:'ach1', icon:'🌱', title:'Langkah Pertama',   desc:'Selesaikan aksi pertama',           req: (done) => done >= 1 },
  { id:'ach2', icon:'🔥', title:'Pejuang Karhutla',  desc:'Laporkan lingkungan 1x',            req: (done, pts) => pts >= 25 },
  { id:'ach3', icon:'🌳', title:'Penanam Pohon',      desc:'Selesaikan aksi "Tanam Satu Pohon"', req: (done, pts, ids) => ids.includes('n1') },
  { id:'ach4', icon:'♻️', title:'Sahabat Daur Ulang', desc:'Selesaikan 5 aksi berbeda',         req: (done) => done >= 5 },
  { id:'ach5', icon:'💨', title:'Udara Bersih',       desc:'Kumpulkan 50 poin',                 req: (done, pts) => pts >= 50 },
  { id:'ach6', icon:'⭐', title:'Pahlawan Hijau',     desc:'Kumpulkan 100 poin',                req: (done, pts) => pts >= 100 },
  { id:'ach7', icon:'🏆', title:'Duta Bumi',          desc:'Selesaikan 15 aksi berbeda',        req: (done) => done >= 15 },
  { id:'ach8', icon:'🌍', title:'Pelindung Hutan',    desc:'Kumpulkan 200 poin',                req: (done, pts) => pts >= 200 },
  { id:'ach9', icon:'💪', title:'Konsisten',          desc:'Selesaikan 10 aksi sehari',         req: (done) => done >= 10 },
  { id:'ach10',icon:'🌟', title:'Inspirator',         desc:'Kumpulkan 300 poin',                req: (done, pts) => pts >= 300 },
];

// ── State ─────────────────────────────────────────────────────────────────────
let currentCategory = 'all';
let impactChart = null;

// ── Get completed actions from storage ───────────────────────────────────────
function getCompletedActions() {
  return window.NapasBumi?.Storage.get(window.NapasBumi.STORAGE_KEYS.ECO_ACTIONS, []) || [];
}

function saveCompletedActions(arr) {
  window.NapasBumi?.Storage.set(window.NapasBumi.STORAGE_KEYS.ECO_ACTIONS, arr);
}

// ── Calculate totals ──────────────────────────────────────────────────────────
function calcTotals(completedIds) {
  const actions = ECO_ACTIONS.filter(a => completedIds.includes(a.id));
  const points  = actions.reduce((s, a) => s + a.points, 0);
  const co2     = actions.reduce((s, a) => s + a.co2, 0);
  return { points, co2: Math.round(co2 * 10) / 10, count: completedIds.length };
}

// ── Render actions grid ───────────────────────────────────────────────────────
function renderActions(category = 'all') {
  const grid = document.getElementById('actions-grid');
  if (!grid) return;

  const completedIds = getCompletedActions();
  const filtered = category === 'all' ? ECO_ACTIONS : ECO_ACTIONS.filter(a => a.cat === category);

  grid.innerHTML = filtered.map(action => {
    const done = completedIds.includes(action.id);
    const freqLabel = action.frequency === 'daily' ? '🗓️ Harian' :
                      action.frequency === 'weekly' ? '📅 Mingguan' :
                      action.frequency === 'monthly' ? '🗃️ Bulanan' : '✅ Sekali';
    return `
      <div class="action-item ${done ? 'completed' : ''}" data-id="${action.id}" role="button" tabindex="0"
           aria-label="${done ? 'Dibatalkan: ' : 'Tandai selesai: '}${action.title}"
           onclick="toggleAction('${action.id}')"
           onkeydown="if(event.key==='Enter')toggleAction('${action.id}')">
        <div class="flex items-start gap-3">
          <span class="text-3xl">${action.icon}</span>
          <div class="flex-1 min-w-0">
            <h3 class="action-title font-semibold text-gray-800 text-sm leading-tight">${action.title}</h3>
            <p class="text-gray-500 text-xs mt-0.5 leading-relaxed">${action.desc}</p>
            <div class="flex items-center gap-2 mt-2 flex-wrap">
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full" style="background:#f0fdf4;color:#1a6b3c">+${action.points} pts</span>
              ${action.co2 > 0 ? `<span class="text-xs text-blue-600">~${action.co2} kg CO₂</span>` : ''}
              <span class="text-xs text-gray-400">${freqLabel}</span>
            </div>
          </div>
          <div class="ml-2 mt-1">
            <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${done ? 'bg-green-500 border-green-500' : 'border-gray-300'}">
              ${done ? '<span class="text-white text-xs">✓</span>' : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ── Toggle action completion ──────────────────────────────────────────────────
function toggleAction(actionId) {
  const completed = getCompletedActions();
  const action    = ECO_ACTIONS.find(a => a.id === actionId);
  if (!action) return;

  let newCompleted;
  if (completed.includes(actionId)) {
    newCompleted = completed.filter(id => id !== actionId);
    window.NapasBumi?.showToast(`"${action.title}" dibatalkan`, 'info');
  } else {
    newCompleted = [...completed, actionId];
    window.NapasBumi?.showToast(`✅ "${action.title}" selesai! +${action.points} poin`, 'success');
  }

  saveCompletedActions(newCompleted);
  updateUI();
  renderActions(currentCategory);
}

// ── Update stats & progress ───────────────────────────────────────────────────
function updateUI() {
  const completedIds = getCompletedActions();
  const totals       = calcTotals(completedIds);
  const levelInfo    = window.NapasBumi?.getLevel(totals.points) || { level: 1, name: 'Pemula', next: 50 };

  // Stats
  setText('stat-completed', completedIds.length);
  setText('stat-points', totals.points);
  setText('stat-co2-saved', totals.co2);
  setText('header-points', totals.points);
  setText('header-level', levelInfo.name);
  setText('progress-title', `Level ${levelInfo.level} — ${levelInfo.name}`);

  // Level progress
  const prevLevel = levelInfo.level > 1
    ? [0, 50, 150, 300, 500][levelInfo.level - 2]
    : 0;
  const nextLevel = levelInfo.next;
  const pct = nextLevel > prevLevel
    ? Math.min(100, Math.round(((totals.points - prevLevel) / (nextLevel - prevLevel)) * 100))
    : 100;

  setText('level-from', prevLevel + ' poin');
  setText('level-to', nextLevel + ' poin');
  setText('level-progress-pct', pct + '%');
  setText('level-next-label', pct < 100
    ? `${nextLevel - totals.points} poin lagi untuk naik ke Level ${levelInfo.level + 1}`
    : '🎉 Level maksimum tercapai!'
  );

  const fill = document.getElementById('level-progress-fill');
  if (fill) fill.style.width = pct + '%';

  // Streak (simplified: if any action done today)
  const today = new Date().toDateString();
  const lastAction = window.NapasBumi?.Storage.get('napas_last_action_date', '');
  if (completedIds.length > 0) {
    window.NapasBumi?.Storage.set('napas_last_action_date', today);
    const streakCount = window.NapasBumi?.Storage.get('napas_streak', 0) || 0;
    setText('stat-streak', lastAction === today ? streakCount : streakCount + 1);
  }

  renderAchievements(completedIds, totals.points);
  buildImpactChart(completedIds);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── Achievements ──────────────────────────────────────────────────────────────
function renderAchievements(completedIds, points) {
  const grid = document.getElementById('achievements-grid');
  if (!grid) return;

  grid.innerHTML = ACHIEVEMENTS.map(ach => {
    const unlocked = ach.req(completedIds.length, points, completedIds);
    return `
      <div class="achievement-badge ${unlocked ? '' : 'locked'}" title="${ach.desc}">
        <div class="text-3xl mb-1">${ach.icon}</div>
        <div class="text-xs font-bold text-gray-700">${ach.title}</div>
        <div class="text-xs text-gray-400 mt-0.5">${ach.desc}</div>
        ${unlocked ? '<div class="text-xs text-green-600 font-semibold mt-1">✅ Terbuka</div>' : '<div class="text-xs text-gray-300 mt-1">🔒 Terkunci</div>'}
      </div>
    `;
  }).join('');
}

// ── Impact Chart ──────────────────────────────────────────────────────────────
function buildImpactChart(completedIds) {
  const ctx = document.getElementById('chart-impact');
  if (!ctx) return;
  if (impactChart) impactChart.destroy();

  const catLabels = {
    transport: '🚗 Transportasi',
    energy:    '⚡ Energi',
    food:      '🍽️ Makanan',
    waste:     '♻️ Sampah',
    nature:    '🌳 Alam',
    community: '🤝 Komunitas',
  };
  const catColors = ['#0ea5e9','#eab308','#22c55e','#a855f7','#f97316','#14b8a6'];

  const catTotals = Object.keys(catLabels).map(cat => {
    return ECO_ACTIONS
      .filter(a => a.cat === cat && completedIds.includes(a.id))
      .reduce((s, a) => s + a.co2, 0);
  });

  impactChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.values(catLabels),
      datasets: [{
        label: 'Estimasi Pengurangan CO₂ (kg)',
        data: catTotals.map(v => Math.round(v * 10) / 10),
        backgroundColor: catColors.map(c => c + 'cc'),
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => ` ${ctx.raw} kg CO₂e (estimasi potensi)` }
        }
      },
      scales: {
        y: {
          grid: { color: '#f0fdf4' },
          title: { display: true, text: 'kg CO₂e (estimasi)' },
          min: 0,
        },
        x: { grid: { color: '#f0fdf4' } }
      }
    }
  });
}

// ── Category filter ───────────────────────────────────────────────────────────
function initCategoryFilters() {
  const buttons = document.querySelectorAll('#category-filters .tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.cat;
      renderActions(currentCategory);
    });
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCategoryFilters();
  renderActions();
  updateUI();

  const resetBtn = document.getElementById('reset-actions-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset semua progres Eco Action? Poin akan hilang.')) {
        saveCompletedActions([]);
        window.NapasBumi?.Storage.set(window.NapasBumi.STORAGE_KEYS.POINTS, 0);
        updateUI();
        renderActions(currentCategory);
        window.NapasBumi?.showToast('Progres direset.', 'warning');
      }
    });
  }

  // Expose toggle globally for onclick handlers
  window.toggleAction = toggleAction;
});
