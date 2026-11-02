/**
 * NapasBumi — Live Data Fetcher (v2)
 *
 * Sumber data real-time (semua gratis, CORS-friendly):
 *
 *  1. WAQI (World Air Quality Index) — AQI, PM2.5, PM10, O3, NO2 per kota
 *     Token: "demo"  (publik, rate-limited, cukup untuk development)
 *     Endpoint: https://api.waqi.info/feed/{city}/?token=demo
 *     Docs: https://aqicn.org/api/
 *
 *  2. Open-Meteo — cuaca real-time (suhu, kelembapan, angin, kode cuaca)
 *     Gratis, no key, no rate limit, CORS ✅
 *     Docs: https://open-meteo.com/
 *
 *  3. NASA EONET v3 — wildfire events aktif
 *     Gratis, no key, CORS ✅
 *     Docs: https://eonet.gsfc.nasa.gov/docs/v3
 *
 * Strategi fallback:
 *  Setiap sumber dicoba independen. Jika gagal, nilai dari data simulasi
 *  dipertahankan. Minimal cuaca (Open-Meteo) selalu berhasil jika ada internet.
 *
 * Catatan CORS lokal:
 *  Buka via Live Server / python http.server, bukan file:// langsung.
 *  WAQI dan Open-Meteo mengizinkan request dari semua origin.
 */

'use strict';

// ── State ──────────────────────────────────────────────────────────────────────
const LiveData = {
  isLive: false,
  lastFetch: null,
  refreshTimer: null,
  countdownInterval: null,
  nextRefreshAt: null,
  locations: [],
  hotspots: [],
  _onUpdateCallbacks: [],
  onUpdate(fn)  { this._onUpdateCallbacks.push(fn); },
  _emit()       { this._onUpdateCallbacks.forEach(fn => { try { fn(); } catch(e) {} }); },
};

// ── Constants ──────────────────────────────────────────────────────────────────
const WAQI_TOKEN = 'demo';           // free public token
const REFRESH_MS  = 5 * 60 * 1000;  // 5 minutes

// WAQI city slugs → mapped to our location IDs
const WAQI_CITIES = {
  jakarta:    'jakarta',
  bandung:    'bandung',
  surabaya:   'surabaya',
  medan:      'medan',
  makassar:   'makassar',
  yogyakarta: 'yogyakarta',
};

// Open-Meteo WMO weather codes → Indonesian description
function wmoDesc(code) {
  if (code === 0)        return 'Cerah';
  if (code <= 3)         return 'Berawan sebagian';
  if (code <= 48)        return 'Berkabut';
  if (code <= 57)        return 'Gerimis';
  if (code <= 67)        return 'Hujan';
  if (code <= 77)        return 'Hujan salju';
  if (code <= 82)        return 'Hujan lebat';
  if (code <= 99)        return 'Badai petir';
  return 'Tidak diketahui';
}

// ── Generic fetch helper (timeout 8s) ─────────────────────────────────────────
async function liveFetch(url, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// ── In-memory cache (5-min TTL) ───────────────────────────────────────────────
const _liveCache = new Map();
function liveGet(key) {
  const e = _liveCache.get(key);
  if (!e || Date.now() - e.ts > REFRESH_MS) { _liveCache.delete(key); return null; }
  return e.data;
}
function liveSet(key, data) { _liveCache.set(key, { data, ts: Date.now() }); }

// ── PM2.5 → AQI (US EPA linear interpolation) ─────────────────────────────────
function pm25ToAQI(pm25) {
  const bp = [
    [0,    12,    0,   50],
    [12.1, 35.4,  51,  100],
    [35.5, 55.4,  101, 150],
    [55.5, 150.4, 151, 200],
    [150.5,250.4, 201, 300],
    [250.5,500.4, 301, 500],
  ];
  const c = Math.min(Math.max(parseFloat((+pm25).toFixed(1)), 0), 500.4);
  for (const [cL, cH, iL, iH] of bp) {
    if (c >= cL && c <= cH) return Math.round(((iH - iL) / (cH - cL)) * (c - cL) + iL);
  }
  return 500;
}

// ── Fetch WAQI for one city ────────────────────────────────────────────────────
async function fetchWAQI(citySlug) {
  const key = `waqi_${citySlug}`;
  const cached = liveGet(key);
  if (cached) return cached;

  const url = `https://api.waqi.info/feed/${encodeURIComponent(citySlug)}/?token=${WAQI_TOKEN}`;
  const json = await liveFetch(url);

  if (json.status !== 'ok' || !json.data) throw new Error(`WAQI: ${json.status}`);

  const d = json.data;
  const result = {
    aqi:   typeof d.aqi === 'number' ? d.aqi : null,
    pm25:  d.iaqi?.pm25?.v  ?? null,
    pm10:  d.iaqi?.pm10?.v  ?? null,
    no2:   d.iaqi?.no2?.v   ?? null,
    o3:    d.iaqi?.o3?.v    ?? null,
    co:    d.iaqi?.co?.v    ?? null,
    stationName: d.city?.name || citySlug,
    time:  d.time?.s || null,
  };

  liveSet(key, result);
  return result;
}

// ── Fetch Open-Meteo weather for one coordinate ────────────────────────────────
async function fetchWeather(lat, lng) {
  const key = `weather_${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const cached = liveGet(key);
  if (cached) return cached;

  const url = `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&wind_speed_unit=kmh&timezone=Asia%2FJakarta`;

  const json = await liveFetch(url);
  const cur  = json.current;
  const result = {
    temp:        parseFloat((+cur.temperature_2m).toFixed(1)),
    humidity:    cur.relative_humidity_2m,
    windSpeed:   parseFloat((+cur.wind_speed_10m).toFixed(1)),
    weatherDesc: wmoDesc(cur.weather_code),
  };

  liveSet(key, result);
  return result;
}

// ── Fetch NASA EONET wildfires (Indonesia bbox) ────────────────────────────────
async function fetchWildfires() {
  const key = 'eonet_wildfires';
  const cached = liveGet(key);
  if (cached) return cached;

  // bbox: minLng,minLat,maxLng,maxLat covering Indonesian archipelago
  const url = 'https://eonet.gsfc.nasa.gov/api/v3/events' +
    '?category=wildfires&status=open&limit=50&bbox=94,-11,141,6';

  const json = await liveFetch(url);
  const hotspots = [];

  (json.events || []).forEach((ev, i) => {
    const geoms = ev.geometry || [];
    if (!geoms.length) return;

    // Use most recent geometry point
    const pt = [...geoms].reverse().find(g => g.type === 'Point');
    if (!pt) return;

    const [lng, lat] = pt.coordinates;
    // Double-check bounding box
    if (lat < -11 || lat > 6 || lng < 94 || lng > 141) return;

    hotspots.push({
      id:         `eonet_${i + 1}`,
      lat:        parseFloat((+lat).toFixed(4)),
      lng:        parseFloat((+lng).toFixed(4)),
      province:   guessProvince(lat, lng),
      confidence: 'high',
      frp:        null,
      date:       (pt.date || new Date().toISOString()).split('T')[0],
      type:       'hutan',
      title:      ev.title || 'Wildfire',
      source:     'NASA EONET',
    });
  });

  liveSet(key, hotspots);
  return hotspots;
}

function guessProvince(lat, lng) {
  if (lng >= 95  && lng <= 109 && lat >= -6 && lat <= 6)   return 'Sumatera';
  if (lng >= 108 && lng <= 117 && lat >= -4 && lat <= 2)   return 'Kalimantan';
  if (lng >= 117 && lng <= 141 && lat >= -9 && lat <= 1)   return 'Papua / Maluku';
  if (lng >= 119 && lng <= 125 && lat >= -9 && lat <= -1)  return 'Sulawesi / NTT';
  if (lng >= 106 && lng <= 116 && lat >= -9 && lat <= -5)  return 'Jawa / Bali';
  return 'Indonesia';
}

// ── Build location object from live sources ────────────────────────────────────
function buildLiveLocation(id, cfg, waqiData, weatherData) {
  // Base from simulation (always has all fields)
  const sim = (typeof AQI_DATA !== 'undefined')
    ? AQI_DATA.locations.find(l => l.id === id)
    : null;

  const loc = sim
    ? { ...sim }
    : { id, name: cfg.name, lat: cfg.lat, lng: cfg.lng,
        aqi: 100, pm25: 30, pm10: 55, co2: 410, no2: 25, o3: 45,
        temp: 30, humidity: 75, windSpeed: 6, description: 'Data belum tersedia.' };

  const liveSrc = {};

  // Apply WAQI data
  if (waqiData) {
    if (waqiData.aqi  !== null) { loc.aqi  = waqiData.aqi;  liveSrc.aqi  = true; }
    if (waqiData.pm25 !== null) { loc.pm25 = waqiData.pm25; liveSrc.pm25 = true; }
    if (waqiData.pm10 !== null) { loc.pm10 = waqiData.pm10; liveSrc.pm10 = true; }
    if (waqiData.no2  !== null) { loc.no2  = waqiData.no2;  liveSrc.no2  = true; }
    if (waqiData.o3   !== null) { loc.o3   = waqiData.o3;   liveSrc.o3   = true; }

    // Recalculate AQI from PM2.5 if WAQI AQI is missing but PM2.5 is live
    if (waqiData.aqi === null && waqiData.pm25 !== null) {
      loc.aqi = pm25ToAQI(waqiData.pm25);
      liveSrc.aqi = true;
    }

    // Update description & category
    if (liveSrc.aqi && typeof getAQICategory === 'function') {
      const cat = getAQICategory(loc.aqi);
      loc.category    = cat.class;
      loc.description = cat.label + ' — data langsung dari WAQI / sensor lokal.';
    }
  }

  // Apply Open-Meteo weather (almost always succeeds)
  if (weatherData) {
    loc.temp        = weatherData.temp;
    loc.humidity    = weatherData.humidity;
    loc.windSpeed   = weatherData.windSpeed;
    loc.weatherDesc = weatherData.weatherDesc;
    liveSrc.weather = true;
  }

  loc._liveSource = liveSrc;
  return loc;
}

// ── City coordinate config (matches WAQI slugs + Open-Meteo coords) ───────────
const CITY_CFG = {
  jakarta:    { name: 'Jakarta, DKI Jakarta',         lat: -6.2088,  lng: 106.8456, waqiSlug: 'jakarta' },
  bandung:    { name: 'Bandung, Jawa Barat',           lat: -6.9175,  lng: 107.6191, waqiSlug: 'bandung' },
  surabaya:   { name: 'Surabaya, Jawa Timur',          lat: -7.2575,  lng: 112.7521, waqiSlug: 'surabaya' },
  medan:      { name: 'Medan, Sumatera Utara',          lat:  3.5952,  lng:  98.6722, waqiSlug: 'medan' },
  makassar:   { name: 'Makassar, Sulawesi Selatan',    lat: -5.1477,  lng: 119.4327, waqiSlug: 'makassar' },
  yogyakarta: { name: 'Yogyakarta, DIY',               lat: -7.7956,  lng: 110.3695, waqiSlug: 'yogyakarta' },
};

// ── Main refresh function ──────────────────────────────────────────────────────
async function refreshAllLiveData() {
  updateLiveStatusBadge('loading');
  let anyLive = false;

  // ── 1. Fetch all cities in parallel ──────────────────────────────────────
  const cityEntries = Object.entries(CITY_CFG);
  const cityResults = await Promise.allSettled(
    cityEntries.map(async ([id, cfg]) => {
      // Fetch WAQI and weather independently — don't let one failure cancel the other
      const [waqiResult, weatherResult] = await Promise.allSettled([
        fetchWAQI(cfg.waqiSlug),
        fetchWeather(cfg.lat, cfg.lng),
      ]);

      const waqiData    = waqiResult.status   === 'fulfilled' ? waqiResult.value   : null;
      const weatherData = weatherResult.status === 'fulfilled' ? weatherResult.value : null;

      return buildLiveLocation(id, cfg, waqiData, weatherData);
    })
  );

  const updatedLocations = [];
  cityResults.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      updatedLocations.push(r.value);
      if (Object.keys(r.value._liveSource || {}).length > 0) anyLive = true;
    } else {
      // Pure fallback for this city
      const [id, cfg] = cityEntries[i];
      const sim = (typeof AQI_DATA !== 'undefined') ? AQI_DATA.locations.find(l => l.id === id) : null;
      if (sim) updatedLocations.push({ ...sim, _liveSource: {} });
    }
  });

  // Fill any simulation-only cities not covered by CITY_CFG
  if (typeof AQI_DATA !== 'undefined') {
    AQI_DATA.locations.forEach(simLoc => {
      if (!updatedLocations.find(l => l.id === simLoc.id)) {
        updatedLocations.push({ ...simLoc, _liveSource: {} });
      }
    });
  }

  LiveData.locations = updatedLocations;

  // ── 2. Fetch wildfires ────────────────────────────────────────────────────
  try {
    const fires = await fetchWildfires();
    LiveData.hotspots = fires;
    if (fires.length > 0) anyLive = true;
  } catch {
    LiveData.hotspots = []; // will fall back to HOTSPOT_DATA in getLiveHotspots()
  }

  // ── 3. Finalize ───────────────────────────────────────────────────────────
  LiveData.isLive    = anyLive;
  LiveData.lastFetch = new Date();
  if (typeof setLastRefresh === 'function') setLastRefresh();

  updateLiveStatusBadge(anyLive ? 'live' : 'fallback');
  LiveData._emit();
  scheduleNextRefresh();
}

// ── Auto-refresh countdown ─────────────────────────────────────────────────────
function scheduleNextRefresh() {
  if (LiveData.refreshTimer)     clearTimeout(LiveData.refreshTimer);
  if (LiveData.countdownInterval) clearInterval(LiveData.countdownInterval);

  LiveData.nextRefreshAt = Date.now() + REFRESH_MS;
  LiveData.refreshTimer  = setTimeout(refreshAllLiveData, REFRESH_MS);

  LiveData.countdownInterval = setInterval(() => {
    const rem  = Math.max(0, LiveData.nextRefreshAt - Date.now());
    const mins = Math.floor(rem / 60000);
    const secs = Math.floor((rem % 60000) / 1000);
    document.querySelectorAll('#live-countdown').forEach(el => {
      el.textContent = rem > 0 ? `Refresh ${mins}:${String(secs).padStart(2,'0')}` : '';
    });
    if (rem === 0) clearInterval(LiveData.countdownInterval);
  }, 1000);
}

// ── Live status badge ──────────────────────────────────────────────────────────
function updateLiveStatusBadge(state) {
  document.querySelectorAll('.live-status-badge').forEach(el => {
    if (state === 'loading') {
      el.innerHTML = '<span class="spinner" style="width:12px;height:12px;border-width:2px;flex-shrink:0"></span>&nbsp;Memuat...';
      el.style.cssText = 'background:#fef9c3;color:#92400e;display:inline-flex;align-items:center;gap:5px;font-size:0.72rem;font-weight:600;padding:3px 10px;border-radius:9999px;border:1px solid #fde68a;white-space:nowrap';
    } else if (state === 'live') {
      el.innerHTML = '<span style="width:8px;height:8px;background:#22c55e;border-radius:50%;display:inline-block;animation:pulse-dot 2s infinite;flex-shrink:0"></span>&nbsp;Data Live';
      el.style.cssText = 'background:#d1fae5;color:#065f46;display:inline-flex;align-items:center;gap:5px;font-size:0.72rem;font-weight:700;padding:3px 10px;border-radius:9999px;border:1px solid #6ee7b7;white-space:nowrap';
    } else {
      el.innerHTML = '⚠️&nbsp;Simulasi';
      el.style.cssText = 'background:#fef3c7;color:#92400e;display:inline-flex;align-items:center;gap:5px;font-size:0.72rem;font-weight:600;padding:3px 10px;border-radius:9999px;border:1px solid #fde68a;white-space:nowrap';
    }
  });
}

// ── Public helpers ─────────────────────────────────────────────────────────────
function getLiveLocationById(id) {
  return LiveData.locations.find(l => l.id === id)
    || (typeof getLocationById === 'function' ? getLocationById(id) : null);
}

function getAllLiveLocations() {
  return LiveData.locations.length
    ? LiveData.locations
    : (typeof AQI_DATA !== 'undefined' ? AQI_DATA.locations : []);
}

function getLiveHotspots() {
  return LiveData.hotspots.length
    ? LiveData.hotspots
    : (typeof HOTSPOT_DATA !== 'undefined' ? HOTSPOT_DATA.hotspots : []);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  window.LiveData             = LiveData;
  window.refreshAllLiveData   = refreshAllLiveData;
  window.getLiveLocationById  = getLiveLocationById;
  window.getAllLiveLocations   = getAllLiveLocations;
  window.getLiveHotspots      = getLiveHotspots;

  // First fetch after page paint (small delay)
  setTimeout(refreshAllLiveData, 600);
});
