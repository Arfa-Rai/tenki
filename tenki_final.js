const api = 'https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FTokyo';

function getData() {
  fetch(api)
    .then(response => response.json())
    .then(data => makePage(data));
}

function updateClock() {
  setData('time', dateFormat(new Date(), 1));
}

setInterval(updateClock, 1000);
setInterval(getData, 1000 * 60 * 60);
getData();

function makePage(data) {
  setData('day0', dateFormat(data.daily.time[0]));
  setData('day1', dateFormat(data.daily.time[1]));
  setData('day2', dateFormat(data.daily.time[2]));
  setData('weathercode0', getWMO(data.daily.weathercode[0]));
  setData('weathercode1', getWMO(data.daily.weathercode[1]));
  setData('weathercode2', getWMO(data.daily.weathercode[2]));
  setData('temperature_2m_max0', data.daily.temperature_2m_max[0] + '℃');
  setData('temperature_2m_max1', data.daily.temperature_2m_max[1] + '℃');
  setData('temperature_2m_max2', data.daily.temperature_2m_max[2] + '℃');
  setData('temperature_2m_min0', data.daily.temperature_2m_min[0] + '℃');
  setData('temperature_2m_min1', data.daily.temperature_2m_min[1] + '℃');
  setData('temperature_2m_min2', data.daily.temperature_2m_min[2] + '℃');
  setData('precipitation_sum0', data.daily.precipitation_sum[0] + 'mm');
  setData('precipitation_sum1', data.daily.precipitation_sum[1] + 'mm');
  setData('precipitation_sum2', data.daily.precipitation_sum[2] + 'mm');

  if (data.daily.precipitation_sum[0] > 0) {
    document.getElementById('body').style.backgroundColor = '#cff';
  } else {
    document.getElementById('body').style.backgroundColor = '#ffc';
  }
}

function setData(id, data) {
  document.getElementById(id).innerHTML = data;
}

function dateFormat(date, mode) {
  let d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = addZero(d.getHours());
  const minute = addZero(d.getMinutes());
  const second = addZero(d.getSeconds());
  if (mode == 1) return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
  return month + '月' + day + '日';
}

function addZero(n) { return n < 10 ? '0' + n : n; }

function getWMO(w) {
  if (w == 0) return '☀️';
  if (w == 1) return '🌤';
  if (w == 2) return '⛅️';
  if (w == 3) return '☁️';
  if (w == 45 || w == 48) return '霧';
  if (w >= 51 && w <= 57) return '霧雨';
  if (w >= 61 && w <= 67) return '☔️';
  if (w >= 71 && w <= 77) return '❄️';
  if (w >= 80 && w <= 82) return '☔️';
  if (w >= 95) return '⚡️☔️';
  return w;
}