/**
 * NapasBumi — Simulated AQI & Air Quality Data
 * Source: Simulated data based on realistic patterns from BMKG/KLHK/OpenAQ
 * Label: SIMULATED DATA — NOT real-time values
 */

const AQI_DATA = {
  locations: [
    {
      id: 'jakarta',
      name: 'Jakarta, DKI Jakarta',
      lat: -6.2088, lng: 106.8456,
      aqi: 128, category: 'unhealthy-sensitive',
      pm25: 47.3, pm10: 82.1,
      co2: 412, no2: 38.4, o3: 54.2,
      temp: 31.2, humidity: 72, windSpeed: 8.4,
      description: 'Kualitas udara tidak sehat untuk kelompok sensitif.',
    },
    {
      id: 'bandung',
      name: 'Bandung, Jawa Barat',
      lat: -6.9175, lng: 107.6191,
      aqi: 78, category: 'moderate',
      pm25: 22.1, pm10: 41.5,
      co2: 405, no2: 21.2, o3: 48.7,
      temp: 24.5, humidity: 80, windSpeed: 6.1,
      description: 'Kualitas udara sedang, pertimbangkan aktivitas luar ruangan.',
    },
    {
      id: 'surabaya',
      name: 'Surabaya, Jawa Timur',
      lat: -7.2575, lng: 112.7521,
      aqi: 102, category: 'unhealthy-sensitive',
      pm25: 35.8, pm10: 64.3,
      co2: 408, no2: 29.6, o3: 51.3,
      temp: 33.1, humidity: 68, windSpeed: 9.2,
      description: 'Tidak sehat bagi kelompok sensitif.',
    },
    {
      id: 'palembang',
      name: 'Palembang, Sumatera Selatan',
      lat: -2.9761, lng: 104.7754,
      aqi: 165, category: 'unhealthy',
      pm25: 68.2, pm10: 115.4,
      co2: 418, no2: 42.1, o3: 61.5,
      temp: 34.8, humidity: 65, windSpeed: 5.3,
      description: 'Kualitas udara tidak sehat. Batasi aktivitas luar ruangan.',
    },
    {
      id: 'pekanbaru',
      name: 'Pekanbaru, Riau',
      lat: 0.5071, lng: 101.4478,
      aqi: 198, category: 'very-unhealthy',
      pm25: 98.7, pm10: 174.2,
      co2: 425, no2: 55.3, o3: 72.8,
      temp: 35.4, humidity: 58, windSpeed: 4.1,
      description: 'Sangat tidak sehat. Hindari aktivitas luar ruangan.',
    },
    {
      id: 'pontianak',
      name: 'Pontianak, Kalimantan Barat',
      lat: -0.0263, lng: 109.3425,
      aqi: 215, category: 'hazardous',
      pm25: 134.5, pm10: 228.7,
      co2: 431, no2: 61.2, o3: 80.1,
      temp: 36.1, humidity: 55, windSpeed: 3.8,
      description: 'Berbahaya! Tetap di dalam ruangan dan gunakan masker.',
    },
    {
      id: 'medan',
      name: 'Medan, Sumatera Utara',
      lat: 3.5952, lng: 98.6722,
      aqi: 89, category: 'moderate',
      pm25: 28.4, pm10: 52.1,
      co2: 406, no2: 24.8, o3: 46.9,
      temp: 30.2, humidity: 76, windSpeed: 7.5,
      description: 'Kualitas udara sedang.',
    },
    {
      id: 'yogyakarta',
      name: 'Yogyakarta, DIY',
      lat: -7.7956, lng: 110.3695,
      aqi: 55, category: 'good',
      pm25: 14.2, pm10: 28.5,
      co2: 399, no2: 15.3, o3: 38.2,
      temp: 28.7, humidity: 82, windSpeed: 5.8,
      description: 'Kualitas udara baik untuk semua aktivitas.',
    },
    {
      id: 'balikpapan',
      name: 'Balikpapan, Kalimantan Timur',
      lat: -1.2675, lng: 116.8289,
      aqi: 143, category: 'unhealthy',
      pm25: 56.1, pm10: 98.4,
      co2: 415, no2: 38.7, o3: 58.3,
      temp: 33.6, humidity: 62, windSpeed: 6.7,
      description: 'Tidak sehat. Batasi aktivitas luar ruangan.',
    },
    {
      id: 'makassar',
      name: 'Makassar, Sulawesi Selatan',
      lat: -5.1477, lng: 119.4327,
      aqi: 67, category: 'moderate',
      pm25: 18.9, pm10: 35.2,
      co2: 402, no2: 18.1, o3: 42.5,
      temp: 30.8, humidity: 70, windSpeed: 8.9,
      description: 'Kualitas udara sedang.',
    },
  ],

  // Hourly AQI data for the last 24 hours (for charts)
  hourlyData: {
    labels: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00',
             '08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00',
             '16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
    datasets: {
      jakarta:    [85,82,78,76,74,80,95,118,134,142,138,130,125,128,135,142,148,143,132,118,108,98,90,85],
      pekanbaru:  [165,158,148,140,135,142,162,185,201,215,210,205,198,202,208,214,219,212,198,184,175,168,160,155],
      pontianak:  [185,178,170,162,158,165,195,218,228,240,235,230,215,220,228,236,242,234,218,204,195,188,180,175],
      palembang:  [125,118,110,105,102,108,125,148,162,172,168,162,165,168,174,180,185,178,162,148,138,130,122,118],
      jakarta_pm25: [32,30,28,27,26,29,38,47,55,59,57,52,48,50,53,57,61,58,52,44,40,36,33,30],
    }
  },

  // Monthly average AQI for trend analysis
  monthlyData: {
    labels: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
    jakarta:   [98,92,88,82,79,85,102,118,135,112,96,90],
    pekanbaru: [102,95,88,82,78,95,148,182,215,168,112,98],
  },

  aqiCategories: [
    { min: 0,   max: 50,  label: 'Baik',                   color: '#22c55e', textColor: '#065f46', class: 'good' },
    { min: 51,  max: 100, label: 'Sedang',                  color: '#eab308', textColor: '#713f12', class: 'moderate' },
    { min: 101, max: 150, label: 'Tidak Sehat (Sensitif)',  color: '#f97316', textColor: '#9a3412', class: 'unhealthy-sensitive' },
    { min: 151, max: 200, label: 'Tidak Sehat',             color: '#ef4444', textColor: '#991b1b', class: 'unhealthy' },
    { min: 201, max: 300, label: 'Sangat Tidak Sehat',      color: '#a855f7', textColor: '#581c87', class: 'very-unhealthy' },
    { min: 301, max: 500, label: 'Berbahaya',               color: '#9f1239', textColor: '#4c0519', class: 'hazardous' },
  ],
};

/**
 * Get AQI category object for a given AQI value
 */
function getAQICategory(aqi) {
  return AQI_DATA.aqiCategories.find(c => aqi >= c.min && aqi <= c.max) || AQI_DATA.aqiCategories[0];
}

/**
 * Get location data by ID
 */
function getLocationById(id) {
  return AQI_DATA.locations.find(l => l.id === id);
}
