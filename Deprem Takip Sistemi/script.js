let markers = L.layerGroup();
let currentMinMag = 0;

// Haritayı başlat
let map;
try {
  map = L.map('map').setView([38.9637, 35.2433], 4); // Türkiye merkezi
  markers.addTo(map);

  // Harita katmanı
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap katkıcıları'
  }).addTo(map);
} catch (error) {
  console.error("Harita başlatılırken hata:", error);
  document.getElementById('home-map').innerHTML = '<p>Harita yüklenemedi. Lütfen sayfayı yenileyin veya internet bağlantınızı kontrol edin.</p>';
}

// Büyüklüğe göre renk belirleme
function getColor(magnitude) {
  return magnitude > 5 ? '#d32f2f' :
         magnitude > 3 ? '#ff9800' :
         magnitude > 1 ? '#2196f3' : '#4caf50';
}

// Deprem verilerini al ve güncelle
async function fetchAndUpdateEarthquakes(minMag = 0) {
  const container = document.getElementById('earthquake-list');
  container.classList.add('loading');
  try {
    console.log("Deprem verileri çekiliyor...");
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
    if (!response.ok) throw new Error(`API isteği başarısız: ${response.status}`);
    const data = await response.json();
    console.log("Veriler alındı:", data);

    // Liste güncelleme
    container.innerHTML = data.features.length === 0 ? '<p>Son 24 saatte deprem kaydedilmedi.</p>' : '';
    data.features.filter(eq => eq.properties.mag >= minMag).slice(0, 20).forEach(eq => {
      const magnitude = eq.properties.mag;
      const place = eq.properties.place;
      const time = new Date(eq.properties.time).toLocaleString('tr-TR');
      const div = document.createElement('div');
      div.innerHTML = `<strong>${magnitude.toFixed(1)}M</strong> - ${place} <br><small>${time}</small>`;
      div.className = 'earthquake-item';
      container.appendChild(div);
    });

    // Harita güncelleme (animasyonlu)
    markers.clearLayers();
    const filteredFeatures = data.features.filter(eq => eq.properties.mag >= minMag);
    let index = 0;
    function addMarker() {
      if (index >= filteredFeatures.length) return;
      const eq = filteredFeatures[index];
      const coords = eq.geometry.coordinates;
      const lat = coords[1];
      const lon = coords[0];
      const mag = eq.properties.mag;
      const place = eq.properties.place;
      L.circleMarker([lat, lon], {
        radius: Math.max(mag * 2, 4),
        color: getColor(mag),
        fillColor: getColor(mag),
        fillOpacity: 0.8
      }).addTo(markers).bindPopup(`<strong>${mag.toFixed(1)}M</strong><br>${place}`);
      index++;
      setTimeout(addMarker, 500); // Her 0.5 saniyede bir işaretçi ekle
    }
    addMarker();
  } catch (error) {
    console.error("Deprem verisi alınırken hata:", error);
    container.innerHTML = '<p>Veriler yüklenemedi. Lütfen internet bağlantınızı kontrol edin veya sayfayı yenileyin.</p>';
  } finally {
    container.classList.remove('loading');
  }
}

// Filtreleme fonksiyonu
function filterEarthquakes() {
  currentMinMag = parseFloat(document.getElementById('mag-filter').value);
  fetchAndUpdateEarthquakes(currentMinMag);
}

// İlk yükleme
fetchAndUpdateEarthquakes();

// Otomatik güncelleme (her 5 dakika)
setInterval(() => fetchAndUpdateEarthquakes(currentMinMag), 300000);