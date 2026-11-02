/**
 * NapasBumi — API Configuration & Cache Manager
 *
 * APIs yang digunakan (semua GRATIS, tanpa API key):
 *  1. OpenAQ v3  — kualitas udara (PM2.5, PM10, NO2, O3) per kota Indonesia
 *     https://docs.openaq.org/
 *  2. Open-Meteo — cuaca real-time (suhu, kelembapan, angin)
 *     https://open-meteo.com/
 *  3. NASA FIRMS (EONET proxy) — kejadian kebakaran/hotspot aktif
 *     https://eonet.gsfc.nasa.gov/api/v3/events
 *
 * Cache TTL: 5 menit — data di-refresh otomatis setiap 5 menit
 */

'use strict';

const API_CONFIG = {

  // ── Cache TTL (milliseconds) ───────────────────────────────────────────────
  CACHE_TTL: 5 * 60 * 1000,   // 5 menit
  REFRESH_INTERVAL: 5 * 60 * 1000,

  // ── OpenAQ v3 — Air Quality ────────────────────────────────────────────────
  OPENAQ: {
    BASE: 'https://api.openaq.org/v3',
    // Location IDs for major Indonesian cities (OpenAQ location IDs)
    CITY_PARAMS: {
      jakarta:    { name: 'Jakarta, DKI Jakarta',       lat: -6.2088, lng: 106.8456, cityQuery: 'Jakarta' },
      bandung:    { name: 'Bandung, Jawa Barat',        lat: -6.9175, lng: 107.6191, cityQuery: 'Bandung' },
      surabaya:   { name: 'Surabaya, Jawa Timur',       lat: -7.2575, lng: 112.7521, cityQuery: 'Surabaya' },
      medan:      { name: 'Medan, Sumatera Utara',      lat: 3.5952,  lng: 98.6722,  cityQuery: 'Medan' },
      makassar:   { name: 'Makassar, Sulawesi Selatan', lat: -5.1477, lng: 119.4327, cityQuery: 'Makassar' },
      yogyakarta: { name: 'Yogyakarta, DIY',            lat: -7.7956, lng: 110.3695, cityQuery: 'Yogyakarta' },
    },
    // Radius-based lookup (degrees): search sensors within ~50 km
    RADIUS_DEG: 0.5,
  },

  // ── Open-Meteo — Weather ───────────────────────────────────────────────────
  OPEN_METEO: {
    BASE: 'https://api.open-meteo.com/v1/forecast',
    PARAMS: 'current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code' +
            '&wind_speed_unit=kmh&timezone=Asia%2FJakarta',
  },

  // ── NASA EONET — Natural Events (Wildfires) ────────────────────────────────
  EONET: {
    BASE: 'https://eonet.gsfc.nasa.gov/api/v3/events',
    // Wildfire category ID = 8
    PARAMS: 'category=wildfires&status=open&limit=50&bbox=94,-11,141,6',
    // bbox covers Indonesian archipelago: [minLng, minLat, maxLng, maxLat]
  },
};

// ── In-memory cache ────────────────────────────────────────────────────────────
const _cache = new Map();

function cacheGet(key) {
  const entry = _cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > API_CONFIG.CACHE_TTL) {
    _cache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key, data) {
  _cache.set(key, { data, ts: Date.now() });
}

// ── Generic fetch with timeout & error handling ────────────────────────────────
async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// ── Last refresh timestamp ─────────────────────────────────────────────────────
let _lastRefresh = null;
function setLastRefresh() {
  _lastRefresh = new Date();
}
function getLastRefresh() {
  return _lastRefresh
    ? _lastRefresh.toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';
}

// Expose globally
window.ApiConfig    = API_CONFIG;
window.apiCacheGet  = cacheGet;
window.apiCacheSet  = cacheSet;
window.apiFetch     = fetchWithTimeout;
window.setLastRefresh = setLastRefresh;
window.getLastRefresh = getLastRefresh;
