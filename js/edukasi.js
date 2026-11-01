/**
 * NapasBumi — Education Module
 * Handles: article list, search, category filter, article modal
 */

'use strict';

const ARTICLES = [
  {
    id: 1,
    cat: 'emisi',
    icon: '💨',
    title: 'Apa itu Emisi Karbon dan Jejak Karbon?',
    summary: 'Emisi karbon dan jejak karbon sering digunakan bergantian, padahal keduanya memiliki makna spesifik. Pahami perbedaannya dan mengapa ini penting.',
    content: `
      <h2 class="text-xl font-bold text-gray-800 mb-3">Emisi Karbon & Jejak Karbon</h2>
      <p class="text-gray-600 mb-3">Istilah "emisi karbon" merujuk pada pelepasan gas rumah kaca (terutama CO₂ dan CH₄) ke atmosfer akibat aktivitas manusia seperti pembakaran bahan bakar fosil, deforestasi, dan industri.</p>
      <p class="text-gray-600 mb-3"><strong>Jejak Karbon (Carbon Footprint)</strong> adalah jumlah total gas rumah kaca yang dihasilkan oleh individu, organisasi, atau produk dalam satuan CO₂ ekuivalen (CO₂e).</p>
      <h3 class="font-semibold text-gray-700 mb-2 mt-4">Gas Rumah Kaca Utama</h3>
      <ul class="space-y-1 text-gray-600 text-sm mb-4">
        <li>• <strong>CO₂ (Karbon Dioksida)</strong> — Dari pembakaran BBM, industri, deforestasi</li>
        <li>• <strong>CH₄ (Metana)</strong> — Dari peternakan, TPA, tambang batu bara (21x lebih kuat dari CO₂)</li>
        <li>• <strong>N₂O (Dinitrogen Oksida)</strong> — Dari pupuk, pembakaran biomassa (298x)</li>
        <li>• <strong>Gas Fluorinasi</strong> — Dari AC dan refrigeran industri</li>
      </ul>
      <div class="p-3 rounded-lg mb-4" style="background:#f0fdf4;border-left:3px solid #1a6b3c">
        <p class="text-sm text-gray-600"><strong>Penting:</strong> CO₂ adalah gas rumah kaca, berbeda dari polutan udara seperti PM2.5. CO₂ tidak secara langsung menyebabkan penipisan ozon (ozon dirusak oleh CFC/HCFC, bukan CO₂).</p>
      </div>
      <h3 class="font-semibold text-gray-700 mb-2">Rata-Rata Jejak Karbon</h3>
      <p class="text-gray-600 text-sm">Rata-rata global: ~4.7 ton CO₂e/orang/tahun. Target aman iklim: di bawah 2 ton/orang/tahun pada 2050. Indonesia saat ini ~2.3 ton/orang/tahun — relatif rendah, namun meningkat cepat.</p>
    `,
    readTime: '4 menit',
    date: '28 Oktober 2026',
    featured: true,
  },
  {
    id: 2,
    cat: 'karhutla',
    icon: '🔥',
    title: 'Karhutla Indonesia: Penyebab, Dampak, dan Solusi',
    summary: 'Indonesia adalah salah satu negara paling rentan karhutla di dunia. Memahami akar masalah adalah langkah pertama menuju solusi.',
    content: `
      <h2 class="text-xl font-bold text-gray-800 mb-3">Kebakaran Hutan dan Lahan di Indonesia</h2>
      <p class="text-gray-600 mb-3">Karhutla di Indonesia bukan hanya fenomena alam — sebagian besar disebabkan oleh faktor manusia, termasuk pembukaan lahan dengan cara membakar (land clearing) untuk perkebunan.</p>
      <h3 class="font-semibold text-gray-700 mb-2 mt-4">Penyebab Utama</h3>
      <ul class="space-y-1 text-gray-600 text-sm mb-4">
        <li>🔥 Pembukaan lahan untuk sawit & akasia (ilegal)</li>
        <li>🌾 Pembakaran sisa panen yang tidak terkendali</li>
        <li>🌡️ El Niño & kekeringan musiman</li>
        <li>🏗️ Konversi lahan gambut menjadi perkebunan</li>
      </ul>
      <h3 class="font-semibent text-gray-700 mb-2">Dampak Karhutla</h3>
      <div class="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div class="p-2 rounded-lg" style="background:#fff7ed"><strong>Kesehatan:</strong> ISPA, asma, kanker paru, stunting anak</div>
        <div class="p-2 rounded-lg" style="background:#fef9c3"><strong>Iklim:</strong> Emisi CO₂ masif dari gambut terbakar</div>
        <div class="p-2 rounded-lg" style="background:#f0fdf4"><strong>Ekosistem:</strong> Hilangnya biodiversitas, habitat orangutan</div>
        <div class="p-2 rounded-lg" style="background:#eff6ff"><strong>Ekonomi:</strong> Kerugian produktivitas, biaya kesehatan</div>
      </div>
      <div class="p-3 rounded-lg" style="background:#fff7ed;border-left:3px solid #f97316">
        <p class="text-sm text-gray-600"><strong>Data KLHK 2019:</strong> Karhutla 2019 melepaskan emisi setara 1.6 miliar ton CO₂e — lebih besar dari emisi Jerman setahun penuh.</p>
      </div>
    `,
    readTime: '5 menit',
    date: '25 Oktober 2026',
    featured: false,
  },
  {
    id: 3,
    cat: 'polusi',
    icon: '🌫️',
    title: 'PM2.5 — Pembunuh Tak Terlihat di Udara Kita',
    summary: 'Partikel PM2.5 berukuran 30x lebih kecil dari sehelai rambut manusia, namun mampu menyusup ke paru-paru dan aliran darah dengan efek kesehatan yang serius.',
    content: `
      <h2 class="text-xl font-bold text-gray-800 mb-3">Bahaya Partikel PM2.5</h2>
      <p class="text-gray-600 mb-3">PM2.5 adalah partikel udara berdiameter ≤ 2.5 mikrometer. Karena sangat kecil, partikel ini dapat melewati sistem pertahanan saluran pernapasan dan masuk langsung ke alveolus paru-paru.</p>
      <h3 class="font-semibold text-gray-700 mb-2 mt-4">Sumber PM2.5</h3>
      <ul class="space-y-1 text-gray-600 text-sm mb-4">
        <li>• Asap kendaraan bermotor (terutama diesel)</li>
        <li>• Asap karhutla dan pembakaran biomassa</li>
        <li>• Emisi industri dan pembangkit listrik batu bara</li>
        <li>• Debu jalan dan konstruksi</li>
      </ul>
      <h3 class="font-semibold text-gray-700 mb-2">Dampak Kesehatan</h3>
      <ul class="space-y-1 text-gray-600 text-sm mb-4">
        <li>🫁 Jangka pendek: Batuk, sesak napas, iritasi mata</li>
        <li>❤️ Jangka panjang: Penyakit jantung, stroke, kanker paru</li>
        <li>👶 Anak: Gangguan perkembangan paru, stunting</li>
        <li>🤰 Ibu hamil: Risiko bayi lahir prematur & berat badan rendah</li>
      </ul>
      <div class="p-3 rounded-lg" style="background:#fef9c3;border-left:3px solid #eab308">
        <p class="text-sm text-gray-600"><strong>Batas WHO (2021):</strong> PM2.5 tahunan ≤ 5 µg/m³. Sebagian besar kota besar Indonesia berada di atas 20 µg/m³ — 4x ambang batas WHO.</p>
      </div>
    `,
    readTime: '4 menit',
    date: '22 Oktober 2026',
    featured: false,
  },
  {
    id: 4,
    cat: 'iklim',
    icon: '🌡️',
    title: 'Pemanasan Global 1.5°C — Mengapa Ini Penting?',
    summary: 'Perbedaan 0.5°C antara target 1.5°C dan 2°C terlihat kecil, namun dampaknya terhadap kehidupan di Bumi sangat berbeda jauh.',
    content: `
      <h2 class="text-xl font-bold text-gray-800 mb-3">Mengapa 1.5°C Sangat Kritis?</h2>
      <p class="text-gray-600 mb-3">Perjanjian Paris 2015 menetapkan ambang batas 1.5°C kenaikan suhu global dibanding era pra-industri. Kita sudah berada di sekitar 1.1°C dan bergerak menuju 1.5°C dalam dekade ini.</p>
      <h3 class="font-semibold text-gray-700 mb-2 mt-4">Perbedaan 1.5°C vs 2°C</h3>
      <div class="overflow-x-auto mb-4">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr style="background:#f0fdf4">
              <th class="p-2 text-left border" style="border-color:#d1fae5">Dampak</th>
              <th class="p-2 text-center border" style="border-color:#d1fae5">+1.5°C</th>
              <th class="p-2 text-center border" style="border-color:#d1fae5">+2°C</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="p-2 border" style="border-color:#e8f5ee">Pencairan es Arktik</td><td class="p-2 text-center border" style="border-color:#e8f5ee">1x / abad</td><td class="p-2 text-center border" style="border-color:#e8f5ee">10x / abad</td></tr>
            <tr><td class="p-2 border" style="border-color:#e8f5ee">Kenaikan muka laut</td><td class="p-2 text-center border" style="border-color:#e8f5ee">+26-77 cm</td><td class="p-2 text-center border" style="border-color:#e8f5ee">+30-93 cm</td></tr>
            <tr><td class="p-2 border" style="border-color:#e8f5ee">Terumbu karang mati</td><td class="p-2 text-center border" style="border-color:#e8f5ee">70–90%</td><td class="p-2 text-center border" style="border-color:#e8f5ee">>99%</td></tr>
          </tbody>
        </table>
      </div>
      <div class="p-3 rounded-lg" style="background:#eff6ff;border-left:3px solid #0ea5e9">
        <p class="text-sm text-gray-600"><strong>IPCC AR6 (2021):</strong> Untuk membatasi pemanasan di 1.5°C, emisi CO₂ global harus mencapai net-zero sekitar tahun 2050. Ini memerlukan transformasi besar dalam energi, transportasi, pertanian, dan industri.</p>
      </div>
    `,
    readTime: '5 menit',
    date: '20 Oktober 2026',
    featured: false,
  },
  {
    id: 5,
    cat: 'tips',
    icon: '💡',
    title: '15 Cara Mudah Kurangi Jejak Karbon Harian',
    summary: 'Perubahan kecil dalam kebiasaan sehari-hari dapat memberikan dampak yang signifikan. Berikut 15 aksi praktis yang bisa dimulai hari ini.',
    content: `
      <h2 class="text-xl font-bold text-gray-800 mb-3">15 Aksi Harian untuk Kurangi Jejak Karbon</h2>
      <div class="space-y-3 text-sm">
        <div class="flex gap-3 p-2 rounded-lg hover:bg-green-50"><span class="text-xl">1️⃣</span><div><strong>Gunakan transportasi umum</strong> — Kurangi 2.4 ton CO₂/tahun per mobil yang tidak digunakan</div></div>
        <div class="flex gap-3 p-2 rounded-lg hover:bg-green-50"><span class="text-xl">2️⃣</span><div><strong>Kurangi konsumsi daging sapi</strong> — Daging sapi = 27 kg CO₂/kg vs tahu = 0.4 kg CO₂/kg</div></div>
        <div class="flex gap-3 p-2 rounded-lg hover:bg-green-50"><span class="text-xl">3️⃣</span><div><strong>Hemat listrik di rumah</strong> — Atur AC 24°C, matikan perangkat standby</div></div>
        <div class="flex gap-3 p-2 rounded-lg hover:bg-green-50"><span class="text-xl">4️⃣</span><div><strong>Kurangi penerbangan</strong> — 1 jam terbang ≈ 255 kg CO₂. Pilih video call untuk rapat</div></div>
        <div class="flex gap-3 p-2 rounded-lg hover:bg-green-50"><span class="text-xl">5️⃣</span><div><strong>Beli produk second-hand</strong> — Industri fashion = 10% emisi global</div></div>
        <div class="flex gap-3 p-2 rounded-lg hover:bg-green-50"><span class="text-xl">6️⃣</span><div><strong>Tanam pohon</strong> — Satu pohon menyerap ~21 kg CO₂/tahun</div></div>
        <div class="flex gap-3 p-2 rounded-lg hover:bg-green-50"><span class="text-xl">7️⃣</span><div><strong>Pisahkan sampah & kompos</strong> — Mengurangi emisi metana dari TPA</div></div>
        <div class="flex gap-3 p-2 rounded-lg hover:bg-green-50"><span class="text-xl">8️⃣</span><div><strong>Hemat air</strong> — Pemanasan air = 18% emisi rumah tangga</div></div>
        <div class="flex gap-3 p-2 rounded-lg hover:bg-green-50"><span class="text-xl">9️⃣</span><div><strong>Belanja lokal & musiman</strong> — Kurangi emisi rantai pasokan pangan</div></div>
        <div class="flex gap-3 p-2 rounded-lg hover:bg-green-50"><span class="text-xl">🔟</span><div><strong>Pertimbangkan panel surya</strong> — Investasi jangka panjang, ROI 7-10 tahun</div></div>
      </div>
    `,
    readTime: '3 menit',
    date: '18 Oktober 2026',
    featured: false,
  },
  {
    id: 6,
    cat: 'polusi',
    icon: '🏭',
    title: 'Polusi Udara vs Emisi CO₂ — Apa Bedanya?',
    summary: 'Banyak orang mencampurkan polusi udara dengan emisi karbon. Keduanya berbeda dan membutuhkan solusi yang berbeda pula.',
    content: `
      <h2 class="text-xl font-bold text-gray-800 mb-3">Membedakan Polusi Udara, Emisi Karbon, dan Penipisan Ozon</h2>
      <div class="space-y-4 text-sm text-gray-600">
        <div class="p-3 rounded-lg" style="background:#fef9c3;border-left:3px solid #eab308">
          <strong class="text-gray-800">🌫️ Polusi Udara:</strong> Partikel dan gas berbahaya di udara (PM2.5, PM10, NO₂, SO₂, O₃ permukaan). Dampak langsung: masalah pernapasan dan kesehatan. Sumber: kendaraan, industri, karhutla.
        </div>
        <div class="p-3 rounded-lg" style="background:#e0f2fe;border-left:3px solid #0ea5e9">
          <strong class="text-gray-800">💨 Emisi Karbon/Gas Rumah Kaca:</strong> CO₂, CH₄, N₂O yang memerangkap panas di atmosfer. Dampak: pemanasan global jangka panjang. CO₂ sendiri tidak langsung berbahaya untuk pernapasan pada konsentrasi normal.
        </div>
        <div class="p-3 rounded-lg" style="background:#f3e8ff;border-left:3px solid #a855f7">
          <strong class="text-gray-800">🌐 Penipisan Lapisan Ozon:</strong> Disebabkan oleh CFC (chlorofluorocarbon) dan HCFC — bukan CO₂. Perjanjian Montreal 1987 berhasil mengurangi CFC secara signifikan.
        </div>
        <div class="p-3 rounded-lg" style="background:#f0fdf4;border-left:3px solid #1a6b3c">
          <strong class="text-gray-800">Hubungannya:</strong> Banyak sumber (seperti kendaraan dan karhutla) menghasilkan KEDUANYA — polutan udara DAN gas rumah kaca. Solusi terpadu seperti beralih ke energi terbarukan menangani keduanya sekaligus.
        </div>
      </div>
    `,
    readTime: '4 menit',
    date: '15 Oktober 2026',
    featured: false,
  },
  {
    id: 7,
    cat: 'iklim',
    icon: '🌊',
    title: 'Dampak Perubahan Iklim terhadap Indonesia',
    summary: 'Sebagai negara kepulauan dengan 17.000 pulau dan garis pantai terpanjang ke-2 di dunia, Indonesia sangat rentan terhadap perubahan iklim.',
    content: `
      <h2 class="text-xl font-bold text-gray-800 mb-3">Indonesia dalam Krisis Iklim</h2>
      <p class="text-gray-600 mb-3">Indonesia memiliki kerentanan ganda: sebagai negara berkembang dengan ketergantungan pada sumber daya alam sekaligus sebagai salah satu emitter signifikan akibat deforestasi dan karhutla.</p>
      <h3 class="font-semibold text-gray-700 mb-2 mt-4">Dampak yang Sudah Dirasakan</h3>
      <ul class="space-y-2 text-gray-600 text-sm mb-4">
        <li>🌊 <strong>Kenaikan muka laut:</strong> Jakarta berpotensi tenggelam sebagian pada 2050</li>
        <li>🌡️ <strong>Suhu meningkat:</strong> Rata-rata suhu Indonesia naik 0.3°C sejak 1980</li>
        <li>🌧️ <strong>Pergeseran musim:</strong> Musim kemarau makin panjang di Jawa & Nusa Tenggara</li>
        <li>🐠 <strong>Pemutihan terumbu karang:</strong> 30% terumbu karang Indonesia rusak</li>
        <li>🔥 <strong>Karhutla makin intens:</strong> El Niño + perubahan iklim = karhutla lebih parah</li>
      </ul>
      <div class="p-3 rounded-lg" style="background:#eff6ff;border-left:3px solid #0ea5e9">
        <p class="text-sm text-gray-600">Indonesia menargetkan net-zero emissions pada 2060. Komitmen ini memerlukan transformasi energi besar dari batu bara ke energi terbarukan, khususnya tenaga surya dan air.</p>
      </div>
    `,
    readTime: '5 menit',
    date: '12 Oktober 2026',
    featured: false,
  },
  {
    id: 8,
    cat: 'emisi',
    icon: '🏭',
    title: 'Energi Terbarukan — Masa Depan Indonesia',
    summary: 'Indonesia memiliki potensi energi terbarukan terbesar di ASEAN: 400+ GW tenaga surya, 60 GW angin, 30 GW panas bumi. Namun, realisasinya masih jauh dari potensi.',
    content: `
      <h2 class="text-xl font-bold text-gray-800 mb-3">Potensi Energi Terbarukan Indonesia</h2>
      <p class="text-gray-600 mb-3">Ironi terbesar: Indonesia adalah salah satu penghasil batu bara terbesar dunia, sekaligus memiliki potensi energi terbarukan yang luar biasa yang belum dimanfaatkan.</p>
      <div class="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div class="p-3 rounded-lg" style="background:#fef9c3">
          <div class="font-bold text-yellow-700 text-lg">400 GW</div>
          <div class="text-gray-600">Potensi tenaga surya</div>
        </div>
        <div class="p-3 rounded-lg" style="background:#e0f2fe">
          <div class="font-bold text-blue-700 text-lg">75 GW</div>
          <div class="text-gray-600">Potensi tenaga air</div>
        </div>
        <div class="p-3 rounded-lg" style="background:#f0fdf4">
          <div class="font-bold text-green-700 text-lg">60 GW</div>
          <div class="text-gray-600">Potensi angin</div>
        </div>
        <div class="p-3 rounded-lg" style="background:#fff7ed">
          <div class="font-bold text-orange-700 text-lg">30 GW</div>
          <div class="text-gray-600">Potensi panas bumi</div>
        </div>
      </div>
      <p class="text-gray-600 text-sm">Pada 2023, bauran energi terbarukan Indonesia baru mencapai ~13%. Target RUEN (Rencana Umum Energi Nasional) adalah 23% pada 2025 — masih menghadapi tantangan investasi dan regulasi.</p>
    `,
    readTime: '4 menit',
    date: '10 Oktober 2026',
    featured: false,
  },
];

// ── State ─────────────────────────────────────────────────────────────────────
let currentCat    = 'all';
let currentSearch = '';

// ── Render articles ───────────────────────────────────────────────────────────
function renderArticles() {
  const grid       = document.getElementById('articles-grid');
  const noResults  = document.getElementById('no-results');
  const featuredEl = document.getElementById('featured-article');
  if (!grid) return;

  // Filter
  const filtered = ARTICLES.filter(a => {
    const matchCat    = currentCat === 'all' || a.cat === currentCat;
    const matchSearch = !currentSearch ||
      a.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
      a.summary.toLowerCase().includes(currentSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  // Featured (first article or first featured)
  const featured = filtered.find(a => a.featured) || filtered[0];
  const nonFeatured = filtered.filter(a => a !== featured);

  if (featuredEl && featured) {
    featuredEl.innerHTML = `
      <div class="flex flex-col lg:flex-row">
        <div class="article-thumb lg:w-64 lg:min-h-full" style="background:linear-gradient(135deg,#1a6b3c,#0ea5e9)">
          <span style="font-size:4rem">${featured.icon}</span>
        </div>
        <div class="p-6 flex-1">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full" style="background:#f0fdf4;color:#1a6b3c">${getCatLabel(featured.cat)}</span>
            <span class="text-xs text-gray-400">⭐ Artikel Pilihan</span>
          </div>
          <h2 class="text-xl font-extrabold text-gray-800 mb-2">${featured.title}</h2>
          <p class="text-gray-500 mb-4">${featured.summary}</p>
          <div class="flex items-center gap-4 text-xs text-gray-400 mb-4">
            <span>🕒 ${featured.readTime}</span>
            <span>📅 ${featured.date}</span>
          </div>
          <button onclick="openArticle(${featured.id})" class="btn-primary">📖 Baca Selengkapnya</button>
        </div>
      </div>
    `;
    featuredEl.style.display = 'block';
  } else if (featuredEl) {
    featuredEl.style.display = 'none';
  }

  if (!nonFeatured.length && !featured) {
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
    if (featuredEl) featuredEl.style.display = 'none';
    return;
  }
  noResults.classList.add('hidden');

  grid.innerHTML = nonFeatured.map(a => `
    <div class="article-card cursor-pointer" onclick="openArticle(${a.id})">
      <div class="article-thumb" style="background:linear-gradient(135deg,${getCatColor(a.cat)})">
        <span style="font-size:3rem">${a.icon}</span>
      </div>
      <div class="p-4 flex-1 flex flex-col">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full" style="background:#f0fdf4;color:#1a6b3c">${getCatLabel(a.cat)}</span>
        </div>
        <h3 class="font-bold text-gray-800 mb-1 truncate-2">${a.title}</h3>
        <p class="text-gray-500 text-sm truncate-3 mb-3 flex-1">${a.summary}</p>
        <div class="flex items-center justify-between text-xs text-gray-400 mt-auto">
          <span>🕒 ${a.readTime}</span>
          <span>📅 ${a.date}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ── Open article modal ────────────────────────────────────────────────────────
function openArticle(id) {
  const article = ARTICLES.find(a => a.id === id);
  if (!article) return;

  const modal    = document.getElementById('article-modal');
  const content  = document.getElementById('article-modal-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="flex items-center gap-2 mb-4">
      <span class="text-xs font-semibold px-2 py-0.5 rounded-full" style="background:#f0fdf4;color:#1a6b3c">${getCatLabel(article.cat)}</span>
      <span class="text-xs text-gray-400">🕒 ${article.readTime} • 📅 ${article.date}</span>
    </div>
    ${article.content}
    <div class="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
      <a href="eco-action.html" class="btn-primary text-sm">🌱 Ambil Aksi Sekarang</a>
      <button onclick="closeArticle()" class="btn-secondary text-sm">Tutup</button>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeArticle() {
  const modal = document.getElementById('article-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  document.body.style.overflow = '';
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getCatLabel(cat) {
  const map = { emisi:'💨 Emisi Karbon', karhutla:'🔥 Karhutla', polusi:'🌫️ Polusi Udara', iklim:'🌡️ Perubahan Iklim', tips:'💡 Tips Hijau' };
  return map[cat] || '📋 Umum';
}

function getCatColor(cat) {
  const map = { emisi:'#1a6b3c,#22c55e', karhutla:'#7f1d1d,#f97316', polusi:'#374151,#6b7280', iklim:'#1e3a5f,#0ea5e9', tips:'#1a6b3c,#0ea5e9' };
  return map[cat] || '#1a6b3c,#22c55e';
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderArticles();

  // Category filters
  document.querySelectorAll('#article-filters .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#article-filters .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      renderArticles();
    });
  });

  // Search
  const searchInput = document.getElementById('search-article');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value.trim();
      renderArticles();
    });
  }

  // Close modal on backdrop click
  document.getElementById('article-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeArticle();
  });

  // Expose globally
  window.openArticle  = openArticle;
  window.closeArticle = closeArticle;
});
