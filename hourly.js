const DEFAULT_HOURLY_LOCATION = { name: '東京', lat: 35.6785, lng: 139.6823 };

function initHourly() {
  const locationNameEl = document.getElementById('location-name');
  const latitudeEl = document.getElementById('latitude');
  const longitudeEl = document.getElementById('longitude');
  const fetchBtn = document.getElementById('fetch-hourly');

  locationNameEl.value = DEFAULT_HOURLY_LOCATION.name;
  latitudeEl.value = DEFAULT_HOURLY_LOCATION.lat;
  longitudeEl.value = DEFAULT_HOURLY_LOCATION.lng;
  document.getElementById('current-location-name').textContent = DEFAULT_HOURLY_LOCATION.name;

  fetchBtn.addEventListener('click', function () {
    const name = locationNameEl.value.trim() || '指定なし';
    const lat = parseFloat(latitudeEl.value);
    const lng = parseFloat(longitudeEl.value);

    if (!name || Number.isNaN(lat) || Number.isNaN(lng)) {
      showError('地名・緯度・経度を正しく入力してください。');
      return;
    }

    document.getElementById('current-location-name').textContent = name;
    showError('');
    fetchHourly(lat, lng);
  });

  updateClock();
  setInterval(updateClock, 1000);
  fetchHourly(DEFAULT_HOURLY_LOCATION.lat, DEFAULT_HOURLY_LOCATION.lng);
}

function showError(message) {
  const el = document.getElementById('error-message');
  if (el) el.textContent = message;
}

function updateClock() {
  document.getElementById('time').textContent = formatDateTime(new Date());
}

function fetchHourly(lat, lng) {
  const url = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=' + encodeURIComponent(lat)
    + '&longitude=' + encodeURIComponent(lng)
    + '&hourly=weathercode,temperature_2m,precipitation'
    + '&timezone=Asia%2FTokyo&forecast_days=1';

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error('データ取得に失敗しました。');
      return response.json();
    })
    .then((data) => renderHourly(data))
    .catch((error) => showError(error.message));
}

function renderHourly(data) {
  const tbody = document.getElementById('hourly-body');
  tbody.innerHTML = '';

  if (!data || !data.hourly || !Array.isArray(data.hourly.time)) {
    tbody.innerHTML = '<tr><td colspan="4">データが取得できませんでした。</td></tr>';
    return;
  }

  for (let i = 0; i < 24 && i < data.hourly.time.length; i++) {
    const time = new Date(data.hourly.time[i]);
    const row = document.createElement('tr');

    const timeCell = document.createElement('td');
    timeCell.textContent = formatHour(time);
    row.appendChild(timeCell);

    const weatherCell = document.createElement('td');
    weatherCell.textContent = getWMO(data.hourly.weathercode[i]);
    row.appendChild(weatherCell);

    const tempCell = document.createElement('td');
    tempCell.textContent = data.hourly.temperature_2m[i] + '℃';
    row.appendChild(tempCell);

    const precipCell = document.createElement('td');
    precipCell.textContent = data.hourly.precipitation[i] + 'mm';
    row.appendChild(precipCell);

    tbody.appendChild(row);
  }
}

function formatHour(date) {
  return addZero(date.getHours()) + ':00';
}

function formatDateTime(date) {
  return date.getFullYear() + '年'
    + addZero(date.getMonth() + 1) + '月'
    + addZero(date.getDate()) + '日 '
    + addZero(date.getHours()) + ':'
    + addZero(date.getMinutes()) + ':'
    + addZero(date.getSeconds());
}

function addZero(value) {
  return value < 10 ? '0' + value : String(value);
}

function getWMO(code) {
  if (code === 0) return '☀️';
  if (code === 1) return '🌤';
  if (code === 2) return '⛅️';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '霧';
  if (code >= 51 && code <= 57) return '霧雨';
  if (code >= 61 && code <= 67) return '☔️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '☔️';
  if (code >= 95) return '⚡️☔️';
  return String(code);
}

document.addEventListener('DOMContentLoaded', initHourly);
