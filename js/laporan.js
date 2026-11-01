/**
 * NapasBumi — Community Report Module
 * Handles: report form, validation, localStorage, status display
 */

'use strict';

// ── Category helpers ──────────────────────────────────────────────────────────
const CAT_MAP = {
  kebakaran:        { label: '🔥 Indikasi Kebakaran',     color: '#ef4444' },
  asap:             { label: '🌫️ Asap Pekat',             color: '#6b7280' },
  'pencemaran-air': { label: '💧 Pencemaran Air',         color: '#0ea5e9' },
  'pencemaran-udara':{ label: '💨 Pencemaran Udara',      color: '#8b5cf6' },
  'pembuangan-ilegal':{ label: '🗑️ Pembuangan Ilegal',   color: '#f97316' },
  deforestasi:      { label: '🌳 Pembalakan Liar',        color: '#1a6b3c' },
  lainnya:          { label: '❓ Lainnya',                color: '#94a3b8' },
};

const SEVERITY_MAP = {
  rendah:  { label: '🟢 Rendah',  bg: '#d1fae5', color: '#065f46' },
  sedang:  { label: '🟡 Sedang',  bg: '#fef9c3', color: '#713f12' },
  tinggi:  { label: '🔴 Tinggi',  bg: '#fee2e2', color: '#991b1b' },
  darurat: { label: '🚨 Darurat', bg: '#fce7f3', color: '#9d174d' },
};

const STATUS_MAP = {
  pending:  { label: 'Pending',  class: 'status-pending' },
  reviewed: { label: 'Reviewed', class: 'status-reviewed' },
  resolved: { label: 'Resolved', class: 'status-resolved' },
};

// ── Get/Save reports ──────────────────────────────────────────────────────────
function getReports() {
  return window.NapasBumi?.Storage.get(window.NapasBumi.STORAGE_KEYS.REPORTS, []) || [];
}

function saveReports(reports) {
  window.NapasBumi?.Storage.set(window.NapasBumi.STORAGE_KEYS.REPORTS, reports);
}

// ── Render reports list ───────────────────────────────────────────────────────
function renderReports(statusFilter = 'all') {
  const container = document.getElementById('reports-list');
  if (!container) return;

  let reports = getReports();
  if (statusFilter !== 'all') {
    reports = reports.filter(r => r.status === statusFilter);
  }

  // Update stats
  const all = getReports();
  setEl('count-total',    all.length);
  setEl('count-pending',  all.filter(r => r.status === 'pending').length);
  setEl('count-resolved', all.filter(r => r.status === 'resolved').length);

  if (!reports.length) {
    container.innerHTML = `
      <div class="text-center py-12 text-gray-400">
        <div class="text-4xl mb-2">${statusFilter === 'all' ? '📭' : '🔍'}</div>
        <p>${statusFilter === 'all' ? 'Belum ada laporan. Kirimkan laporan pertama Anda!' : 'Tidak ada laporan dengan status ini.'}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = reports.map(r => {
    const cat    = CAT_MAP[r.category]   || { label: r.category, color: '#94a3b8' };
    const sev    = SEVERITY_MAP[r.severity] || SEVERITY_MAP.sedang;
    const status = STATUS_MAP[r.status]   || STATUS_MAP.pending;
    const date   = window.NapasBumi?.formatDateTime(r.date) || r.date;

    return `
      <div class="card p-4">
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-semibold text-xs px-2 py-0.5 rounded-full" style="background:${cat.color}22;color:${cat.color}">${cat.label}</span>
            <span class="text-xs px-2 py-0.5 rounded-full font-medium" style="background:${sev.bg};color:${sev.color}">${sev.label}</span>
          </div>
          <span class="text-xs px-2 py-0.5 rounded-full font-semibold ${status.class} whitespace-nowrap">${status.label}</span>
        </div>

        <p class="font-semibold text-gray-800 text-sm">📍 ${window.NapasBumi?.escapeHtml(r.location) || r.location}</p>
        <p class="text-gray-500 text-sm mt-1 truncate-3">${window.NapasBumi?.escapeHtml(r.description) || r.description}</p>

        <div class="flex items-center justify-between mt-3 pt-2 border-t text-xs text-gray-400" style="border-color:#f0fdf4">
          <span>👤 ${window.NapasBumi?.escapeHtml(r.reporterName) || 'Anonim'}</span>
          <span>📅 ${date}</span>
          <button onclick="deleteReport('${r.id}')"
                  class="text-red-400 hover:text-red-600 px-1" aria-label="Hapus laporan">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

// ── Delete report ─────────────────────────────────────────────────────────────
function deleteReport(id) {
  if (!confirm('Hapus laporan ini?')) return;
  const updated = getReports().filter(r => r.id !== id);
  saveReports(updated);
  const sel = document.getElementById('filter-status');
  renderReports(sel ? sel.value : 'all');
  window.NapasBumi?.showToast('Laporan dihapus.', 'warning');
}

// ── Form validation ───────────────────────────────────────────────────────────
function validateForm() {
  const { validateRequired } = window.NapasBumi;
  let valid = true;

  const category    = document.getElementById('report-category');
  const location    = document.getElementById('report-location');
  const date        = document.getElementById('report-date');
  const description = document.getElementById('report-description');

  if (!validateRequired(category))    valid = false;
  if (!validateRequired(location))    valid = false;
  if (!validateRequired(date))        valid = false;

  // Description min length
  const descErr = description?.parentElement?.querySelector('.form-error-msg');
  if (!description?.value.trim() || description.value.trim().length < 20) {
    description?.classList.add('error');
    if (descErr) descErr.classList.add('show');
    valid = false;
  } else {
    description?.classList.remove('error');
    if (descErr) descErr.classList.remove('show');
  }

  return valid;
}

// ── Submit form ───────────────────────────────────────────────────────────────
function submitReport(e) {
  e.preventDefault();
  if (!validateForm()) {
    window.NapasBumi?.showToast('Lengkapi semua kolom yang diperlukan.', 'error');
    return;
  }

  const severity = document.querySelector('input[name="severity"]:checked')?.value || 'sedang';
  const report = {
    id: 'rpt_' + Date.now(),
    category:     document.getElementById('report-category').value,
    location:     window.NapasBumi.sanitizeText(document.getElementById('report-location').value),
    date:         new Date(document.getElementById('report-date').value + 'T12:00:00').toISOString(),
    description:  window.NapasBumi.sanitizeText(document.getElementById('report-description').value),
    severity,
    reporterName: window.NapasBumi.sanitizeText(document.getElementById('report-name').value) || 'Anonim',
    contact:      window.NapasBumi.sanitizeText(document.getElementById('report-contact').value),
    status:       'pending',
    createdAt:    new Date().toISOString(),
  };

  const reports = [report, ...getReports()];
  saveReports(reports);

  // Reset form
  document.getElementById('report-form').reset();
  setToday();
  document.getElementById('desc-count').textContent = '0/1000';

  // Add eco-action points for reporting
  window.NapasBumi?.User.addPoints(25);

  renderReports('all');
  window.NapasBumi?.showToast('✅ Laporan berhasil dikirim! Terima kasih atas kontribusi Anda.', 'success', 5000);

  // Scroll to reports list
  document.getElementById('reports-list')?.scrollIntoView({ behavior: 'smooth' });
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setToday() {
  const dateInput = document.getElementById('report-date');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setToday();
  renderReports();

  // Form submit
  document.getElementById('report-form')?.addEventListener('submit', submitReport);

  // Clear form
  document.getElementById('clear-form-btn')?.addEventListener('click', () => {
    document.getElementById('report-form').reset();
    setToday();
    document.getElementById('desc-count').textContent = '0/1000';
  });

  // Character counter
  document.getElementById('report-description')?.addEventListener('input', function () {
    document.getElementById('desc-count').textContent = `${this.value.length}/1000`;
  });

  // Status filter
  document.getElementById('filter-status')?.addEventListener('change', function () {
    renderReports(this.value);
  });

  // Expose globally
  window.deleteReport = deleteReport;
});
