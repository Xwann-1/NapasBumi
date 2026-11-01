/**
 * NapasBumi — Simulated Hotspot & Forest Fire Data
 * Source: Simulated data inspired by NASA FIRMS / LAPAN / KLHK patterns
 * Label: SIMULATED DATA — NOT real-time values
 * Reference: https://firms.modaps.eosdis.nasa.gov/
 */

const HOTSPOT_DATA = {
  // Current active hotspots (simulated)
  hotspots: [
    // Sumatera
    { id: 1,  lat: 0.3521,   lng: 101.8423, province: 'Riau',               confidence: 'high',   frp: 89.4,  date: '2026-10-30', type: 'lahan' },
    { id: 2,  lat: 0.1245,   lng: 101.6234, province: 'Riau',               confidence: 'high',   frp: 124.7, date: '2026-10-30', type: 'lahan' },
    { id: 3,  lat: 0.5823,   lng: 102.1467, province: 'Riau',               confidence: 'medium', frp: 45.2,  date: '2026-10-30', type: 'hutan' },
    { id: 4,  lat: -1.2341,  lng: 103.6234, province: 'Jambi',              confidence: 'high',   frp: 67.8,  date: '2026-10-30', type: 'lahan' },
    { id: 5,  lat: -1.8734,  lng: 103.4521, province: 'Jambi',              confidence: 'medium', frp: 38.9,  date: '2026-10-30', type: 'lahan' },
    { id: 6,  lat: -2.8234,  lng: 104.5123, province: 'Sumatera Selatan',   confidence: 'high',   frp: 156.3, date: '2026-10-30', type: 'lahan' },
    { id: 7,  lat: -3.1234,  lng: 104.8923, province: 'Sumatera Selatan',   confidence: 'high',   frp: 98.7,  date: '2026-10-30', type: 'hutan' },
    { id: 8,  lat: -2.5234,  lng: 105.1234, province: 'Sumatera Selatan',   confidence: 'high',   frp: 112.4, date: '2026-10-30', type: 'lahan' },
    { id: 9,  lat: 3.2341,   lng: 98.2341,  province: 'Sumatera Utara',     confidence: 'low',    frp: 22.1,  date: '2026-10-30', type: 'lahan' },
    { id: 10, lat: 2.1234,   lng: 99.4521,  province: 'Sumatera Utara',     confidence: 'medium', frp: 41.5,  date: '2026-10-30', type: 'hutan' },

    // Kalimantan
    { id: 11, lat: -0.4523,  lng: 109.8234, province: 'Kalimantan Barat',   confidence: 'high',   frp: 187.4, date: '2026-10-30', type: 'lahan' },
    { id: 12, lat: -0.8234,  lng: 110.2341, province: 'Kalimantan Barat',   confidence: 'high',   frp: 145.2, date: '2026-10-30', type: 'lahan' },
    { id: 13, lat: -1.2341,  lng: 110.6234, province: 'Kalimantan Barat',   confidence: 'high',   frp: 201.7, date: '2026-10-30', type: 'hutan' },
    { id: 14, lat: -1.8734,  lng: 111.4521, province: 'Kalimantan Tengah',  confidence: 'high',   frp: 178.3, date: '2026-10-30', type: 'lahan' },
    { id: 15, lat: -2.4523,  lng: 112.8234, province: 'Kalimantan Tengah',  confidence: 'high',   frp: 223.5, date: '2026-10-30', type: 'lahan' },
    { id: 16, lat: -2.8923,  lng: 113.2341, province: 'Kalimantan Tengah',  confidence: 'medium', frp: 89.1,  date: '2026-10-30', type: 'hutan' },
    { id: 17, lat: -3.4523,  lng: 114.8234, province: 'Kalimantan Selatan', confidence: 'high',   frp: 134.7, date: '2026-10-30', type: 'lahan' },
    { id: 18, lat: -1.5823,  lng: 116.4521, province: 'Kalimantan Timur',   confidence: 'medium', frp: 56.3,  date: '2026-10-30', type: 'hutan' },
    { id: 19, lat: 0.8234,   lng: 117.2341, province: 'Kalimantan Timur',   confidence: 'low',    frp: 31.2,  date: '2026-10-30', type: 'lahan' },

    // Papua & Sulawesi
    { id: 20, lat: -4.2341,  lng: 136.8234, province: 'Papua',              confidence: 'medium', frp: 48.9,  date: '2026-10-30', type: 'hutan' },
    { id: 21, lat: -5.8234,  lng: 134.4521, province: 'Papua Selatan',      confidence: 'medium', frp: 62.4,  date: '2026-10-30', type: 'hutan' },
    { id: 22, lat: -1.5234,  lng: 120.8923, province: 'Sulawesi Tengah',    confidence: 'low',    frp: 28.7,  date: '2026-10-30', type: 'lahan' },
    { id: 23, lat: -3.8234,  lng: 122.4521, province: 'Sulawesi Tenggara',  confidence: 'medium', frp: 44.1,  date: '2026-10-30', type: 'lahan' },

    // NTT / NTB
    { id: 24, lat: -8.7234,  lng: 121.2341, province: 'NTT',               confidence: 'medium', frp: 52.8,  date: '2026-10-30', type: 'lahan' },
    { id: 25, lat: -8.9523,  lng: 116.8234, province: 'NTB',               confidence: 'low',    frp: 19.4,  date: '2026-10-30', type: 'lahan' },
  ],

  // Summary per province
  provinceSummary: [
    { province: 'Kalimantan Tengah', total: 3, high: 2, medium: 1, low: 0, trend: 'up' },
    { province: 'Kalimantan Barat',  total: 3, high: 3, medium: 0, low: 0, trend: 'up' },
    { province: 'Sumatera Selatan',  total: 3, high: 3, medium: 0, low: 0, trend: 'stable' },
    { province: 'Riau',              total: 3, high: 2, medium: 1, low: 0, trend: 'up' },
    { province: 'Jambi',             total: 2, high: 1, medium: 1, low: 0, trend: 'stable' },
    { province: 'Kalimantan Timur',  total: 2, high: 0, medium: 1, low: 1, trend: 'down' },
    { province: 'Papua',             total: 2, high: 0, medium: 2, low: 0, trend: 'stable' },
    { province: 'Sumatera Utara',    total: 2, high: 0, medium: 1, low: 1, trend: 'down' },
    { province: 'Sulawesi Tengah',   total: 1, high: 0, medium: 0, low: 1, trend: 'stable' },
    { province: 'Kalimantan Selatan',total: 1, high: 1, medium: 0, low: 0, trend: 'up' },
  ],

  // Historical monthly hotspot count
  monthlyHistory: {
    labels: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt'],
    kalimantan: [12, 8, 6, 4, 9, 28, 87, 214, 312, 187],
    sumatera:   [18, 14, 10, 8, 12, 42, 118, 287, 398, 245],
    nasional:   [45, 32, 24, 18, 28, 98, 287, 648, 892, 523],
  },

  // Daily trend for the last 14 days
  dailyTrend: {
    labels: ['18 Okt','19 Okt','20 Okt','21 Okt','22 Okt','23 Okt','24 Okt',
             '25 Okt','26 Okt','27 Okt','28 Okt','29 Okt','30 Okt','31 Okt'],
    total:  [487, 512, 498, 523, 541, 568, 534, 521, 498, 476, 452, 435, 421, 408],
  },

  statistics: {
    totalToday: 25,
    highConfidence: 14,
    mediumConfidence: 8,
    lowConfidence: 3,
    totalHectaresBurned: 48700,
    co2EmittedTons: 124500,
    provincesAffected: 10,
    lastUpdated: '01 Nov 2026, 11:00 WIB',
  },
};
