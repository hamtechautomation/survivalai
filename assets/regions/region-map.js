/*!
 * BunkerBot Region Map: interactive survival map for British regions.
 * Requires Leaflet 1.9.x (global L). No other dependencies.
 *
 * Usage:
 *   <div class="bb-map" id="map"></div>
 *   BunkerRegionMap.mount(document.getElementById('map'), { data: '/regions/data/yorkshire.json' });
 *   BunkerRegionMap.mountHub(document.getElementById('hub'), { data: '/regions/data/uk-regions.json' });
 *
 * Live data (optional, needs network): Open-Meteo (forecast + elevation, CC BY 4.0, free for
 * non-commercial use) and RainViewer radar (free tier, max native zoom 7, attribution required).
 */
(function (global) {
  'use strict';

  var CAT = {
    wildlife: { label: 'Deer, game & wildlife', icon: '🦌', color: '#f4a261', on: true },
    river:    { label: 'Rivers & lakes',   icon: '🐟', color: '#3a86ff', on: true },
    fishing:  { label: 'Sea fishing marks', icon: '🎣', color: '#2ec4b6', on: false },
    station:  { label: 'Weather stations', icon: '🌡️', color: '#4cc9f0', on: false },
    forage:   { label: 'Foraging',         icon: '🌿', color: '#90be6d', on: false },
    water:    { label: 'Water sources',    icon: '💧', color: '#00b4d8', on: false },
    hazard:   { label: 'Hazards',          icon: '⚠️', color: '#e63946', on: true },
    flood:    { label: 'Flood history',    icon: '🌊', color: '#9d4edd', on: false },
    shelter:  { label: 'Bothies & refuges', icon: '🛖', color: '#c9a66b', on: false },
    rescue:   { label: 'Rescue & A&E',     icon: '⛑️', color: '#ffffff', on: false },
    summit:   { label: 'Summits',          icon: '▲',  color: '#ffd166', on: true },
    town:     { label: 'Towns',            icon: '🏘️', color: '#e9e5d6', on: true }
  };
  var ZONE_COLORS = {
    transition: '#56624a', dales: '#8a9a5b', nidderdale: '#7d6b4f', pennines: '#6b5440', nym: '#8b5a83',
    howardian: '#3f7d4a', pickering: '#b5c46a', vale: '#a7c957', wolds: '#e0d28a', holderness: '#9fc5a8',
    humberhead: '#6fa3a8', industrial: '#9a9a9a', cleveland: '#7a7a7a'
  };
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

  // ------------------------------------------------------------------ helpers
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function mid(r) { return Array.isArray(r) ? (r[0] + r[1]) / 2 : r; }
  function range(r, unit) { return Array.isArray(r) ? r[0].toLocaleString() + '–' + r[1].toLocaleString() + (unit || '') : r + (unit || ''); }
  function lerpColor(a, b, t) {
    var pa = [1, 3, 5].map(function (i) { return parseInt(a.substr(i, 2), 16); });
    var pb = [1, 3, 5].map(function (i) { return parseInt(b.substr(i, 2), 16); });
    return '#' + pa.map(function (v, i) { return Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0'); }).join('');
  }
  function ramp(stops, t) {
    t = Math.max(0, Math.min(1, t)); var n = stops.length - 1, i = Math.min(n - 1, Math.floor(t * n));
    return lerpColor(stops[i], stops[i + 1], t * n - i);
  }
  var RAIN_RAMP = ['#f1e3b4', '#a8d5a2', '#4fa3c7', '#2b5ea8', '#25246b'];
  var SNOW_RAMP = ['#3c4a3a', '#7d8f9c', '#b9c6d3', '#f2f6fa'];
  function rainColor(mm) { return ramp(RAIN_RAMP, (mm - 550) / (1700 - 550)); }
  function snowColor(d) { return ramp(SNOW_RAMP, (d - 3) / (45 - 3)); }

  function haversine(a, b) {
    var R = 6371, toR = Math.PI / 180, dLat = (b[0] - a[0]) * toR, dLon = (b[1] - a[1]) * toR;
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a[0] * toR) * Math.cos(b[0] * toR) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(s));
  }
  function bearing(a, b) {
    var toR = Math.PI / 180, y = Math.sin((b[1] - a[1]) * toR) * Math.cos(b[0] * toR);
    var x = Math.cos(a[0] * toR) * Math.sin(b[0] * toR) - Math.sin(a[0] * toR) * Math.cos(b[0] * toR) * Math.cos((b[1] - a[1]) * toR);
    return (Math.atan2(y, x) / toR + 360) % 360;
  }
  function compass(deg) { return COMPASS[Math.round(deg / 22.5) % 16]; }

  // ---- Sun & moon (adapted from SunCalc, BSD-2, (c) Vladimir Agafonkin) ----
  var RAD = Math.PI / 180, DAYMS = 864e5, J1970 = 2440588, J2000 = 2451545, OBL = RAD * 23.4397, J0 = 0.0009;
  function toDays(d) { return d.valueOf() / DAYMS - 0.5 + J1970 - J2000; }
  function fromJ(j) { return new Date((j + 0.5 - J1970) * DAYMS); }
  function decl(l, b) { return Math.asin(Math.sin(b) * Math.cos(OBL) + Math.cos(b) * Math.sin(OBL) * Math.sin(l)); }
  function rasc(l, b) { return Math.atan2(Math.sin(l) * Math.cos(OBL) - Math.tan(b) * Math.sin(OBL), Math.cos(l)); }
  function sMA(d) { return RAD * (357.5291 + 0.98560028 * d); }
  function eLon(M) { return M + RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)) + RAD * 102.9372 + Math.PI; }
  function sunTimes(date, lat, lng) {
    var lw = RAD * -lng, phi = RAD * lat, d = toDays(date), n = Math.round(d - J0 - lw / (2 * Math.PI)), ds = J0 + lw / (2 * Math.PI) + n,
      M = sMA(ds), L = eLon(M), dec = decl(L, 0), Jnoon = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    function at(h) { var w = Math.acos((Math.sin(h * RAD) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec)));
      if (isNaN(w)) return [null, null]; var a = J0 + (w + lw) / (2 * Math.PI) + n, Jset = J2000 + a + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L); return [fromJ(Jnoon - (Jset - Jnoon)), fromJ(Jset)]; }
    var sr = at(-0.833), cv = at(-6);
    return { sunrise: sr[0], sunset: sr[1], dawn: cv[0], dusk: cv[1], noon: fromJ(Jnoon) };
  }
  function moonInfo(date) {
    var d = toDays(date), M = sMA(d), Ls = eLon(M), sdec = decl(Ls, 0), sra = rasc(Ls, 0);
    var L = RAD * (218.316 + 13.176396 * d), Mm = RAD * (134.963 + 13.064993 * d), F = RAD * (93.272 + 13.229350 * d), l = L + RAD * 6.289 * Math.sin(Mm), b = RAD * 5.128 * Math.sin(F),
      dist = 385001 - 20905 * Math.cos(Mm), mdec = decl(l, b), mra = rasc(l, b), sd = 149598000;
    var ph = Math.acos(Math.sin(sdec) * Math.sin(mdec) + Math.cos(sdec) * Math.cos(mdec) * Math.cos(sra - mra)), inc = Math.atan2(sd * Math.sin(ph), dist - sd * Math.cos(ph)),
      ang = Math.atan2(Math.cos(sdec) * Math.sin(sra - mra), Math.sin(sdec) * Math.cos(mdec) - Math.cos(sdec) * Math.sin(mdec) * Math.cos(sra - mra));
    var frac = (1 + Math.cos(inc)) / 2, phase = 0.5 + 0.5 * inc * (ang < 0 ? -1 : 1) / Math.PI;
    var names = [['🌑', 'New moon'], ['🌒', 'Waxing crescent'], ['🌓', 'First quarter'], ['🌔', 'Waxing gibbous'], ['🌕', 'Full moon'], ['🌖', 'Waning gibbous'], ['🌗', 'Last quarter'], ['🌘', 'Waning crescent']];
    var idx = Math.round(phase * 8) % 8;
    return { fraction: frac, phase: phase, icon: names[idx][0], name: names[idx][1] };
  }
  function hm(d) { return d ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }) : '–'; }
  function sunMoonLine(lat, lon) {
    var t = sunTimes(new Date(), lat, lon), m = moonInfo(new Date());
    var dayLen = t.sunrise && t.sunset ? (t.sunset - t.sunrise) / 36e5 : null;
    return '🌅 ' + hm(t.sunrise) + ' · 🌇 ' + hm(t.sunset) + ' · last light ' + hm(t.dusk) + (dayLen ? ' · ' + Math.floor(dayLen) + 'h ' + Math.round((dayLen % 1) * 60) + 'm daylight' : '') +
      '<br>' + m.icon + ' ' + m.name + ', ' + Math.round(m.fraction * 100) + '% lit' + (m.fraction > 0.6 ? ': bright night, easier to move, harder to hide' : m.fraction < 0.2 ? ': dark night, carry a head torch' : '');
  }

  function pointInRing(pt, ring) { // pt [lon,lat]
    var inside = false;
    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      var xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
      if (((yi > pt[1]) !== (yj > pt[1])) && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }

  // WGS84 lat/lon -> Ordnance Survey grid reference (e.g. "SD 974 721"). Helmert approx, accurate to ~5 m.
  function osGridRef(lat, lon) {
    var toR = Math.PI / 180;
    // WGS84 -> cartesian
    var a = 6378137, b = 6356752.314245, e2 = 1 - (b * b) / (a * a);
    var phi = lat * toR, lam = lon * toR, s = Math.sin(phi), c = Math.cos(phi);
    var nu = a / Math.sqrt(1 - e2 * s * s);
    var x1 = nu * c * Math.cos(lam), y1 = nu * c * Math.sin(lam), z1 = nu * (1 - e2) * s;
    // Helmert WGS84 -> OSGB36
    var tx = -446.448, ty = 125.157, tz = -542.060, sc = 20.4894e-6;
    var rx = (-0.1502 / 3600) * toR, ry = (-0.2470 / 3600) * toR, rz = (-0.8421 / 3600) * toR;
    var x2 = tx + x1 * (1 + sc) - y1 * rz + z1 * ry;
    var y2 = ty + x1 * rz + y1 * (1 + sc) - z1 * rx;
    var z2 = tz - x1 * ry + y1 * rx + z1 * (1 + sc);
    // cartesian -> Airy 1830 lat/lon
    a = 6377563.396; b = 6356256.909; e2 = 1 - (b * b) / (a * a);
    var p = Math.sqrt(x2 * x2 + y2 * y2), phi2 = Math.atan2(z2, p * (1 - e2)), phiP = 2 * Math.PI;
    while (Math.abs(phi2 - phiP) > 1e-12) { nu = a / Math.sqrt(1 - e2 * Math.sin(phi2) * Math.sin(phi2)); phiP = phi2; phi2 = Math.atan2(z2 + e2 * nu * Math.sin(phi2), p); }
    var lam2 = Math.atan2(y2, x2);
    // Transverse Mercator (National Grid)
    var F0 = 0.9996012717, phi0 = 49 * toR, lam0 = -2 * toR, N0 = -100000, E0 = 400000;
    var n = (a - b) / (a + b), sp = Math.sin(phi2), cp = Math.cos(phi2), tp = Math.tan(phi2);
    nu = a * F0 / Math.sqrt(1 - e2 * sp * sp);
    var rho = a * F0 * (1 - e2) / Math.pow(1 - e2 * sp * sp, 1.5), eta2 = nu / rho - 1;
    var dp = phi2 - phi0, sp2 = phi2 + phi0;
    var M = b * F0 * ((1 + n + 1.25 * n * n + 1.25 * n * n * n) * dp - (3 * n + 3 * n * n + 2.625 * n * n * n) * Math.sin(dp) * Math.cos(sp2)
      + (1.875 * n * n + 1.875 * n * n * n) * Math.sin(2 * dp) * Math.cos(2 * sp2) - (35 / 24) * n * n * n * Math.sin(3 * dp) * Math.cos(3 * sp2));
    var I = M + N0, II = nu / 2 * sp * cp, III = nu / 24 * sp * Math.pow(cp, 3) * (5 - tp * tp + 9 * eta2);
    var IIIA = nu / 720 * sp * Math.pow(cp, 5) * (61 - 58 * tp * tp + Math.pow(tp, 4));
    var IV = nu * cp, V = nu / 6 * Math.pow(cp, 3) * (nu / rho - tp * tp), VI = nu / 120 * Math.pow(cp, 5) * (5 - 18 * tp * tp + Math.pow(tp, 4) + 14 * eta2 - 58 * tp * tp * eta2);
    var dl = lam2 - lam0;
    var N = I + II * dl * dl + III * Math.pow(dl, 4) + IIIA * Math.pow(dl, 6);
    var E = E0 + IV * dl + V * Math.pow(dl, 3) + VI * Math.pow(dl, 5);
    if (E < 0 || E >= 700000 || N < 0 || N >= 1300000) return null;
    var e100k = Math.floor(E / 100000), n100k = Math.floor(N / 100000);
    var l1 = (19 - n100k) - (19 - n100k) % 5 + Math.floor((e100k + 10) / 5);
    var l2 = (19 - n100k) * 5 % 25 + e100k % 5;
    if (l1 > 7) l1++; if (l2 > 7) l2++;
    var letters = String.fromCharCode(l1 + 65) + String.fromCharCode(l2 + 65);
    var e = Math.floor((E % 100000) / 100), nn = Math.floor((N % 100000) / 100);
    return { ref: letters + ' ' + String(e).padStart(3, '0') + ' ' + String(nn).padStart(3, '0'), E: Math.round(E), N: Math.round(N) };
  }

  function weatherText(code) {
    var m = { 0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Freezing fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
      56: 'Freezing drizzle', 57: 'Freezing drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain', 71: 'Light snow', 73: 'Snow',
      75: 'Heavy snow', 77: 'Snow grains', 80: 'Rain showers', 81: 'Heavy showers', 82: 'Violent showers', 85: 'Snow showers', 86: 'Heavy snow showers', 95: 'Thunderstorm',
      96: 'Thunderstorm with hail', 99: 'Thunderstorm with hail' };
    return m[code] || '—';
  }

  function advisories(cur, hourly) {
    var out = [];
    if (!cur) return out;
    var feels = cur.apparent_temperature, gust = cur.wind_gusts_10m, pr = cur.precipitation, t = cur.temperature_2m;
    if (feels != null && feels <= 0) out.push(['danger', 'Feels like ' + Math.round(feels) + ' °C: hypothermia risk for anyone wet or inactive. Windproof shell, insulation, hat and gloves.']);
    else if (t != null && t < 9 && pr > 0.2) out.push(['warn', 'Cold and wet: the classic UK hypothermia combination. Stay dry, and vent before you sweat.']);
    if (gust != null && gust >= 60) out.push(['danger', 'Gusts ' + Math.round(gust) + ' km/h: avoid summits, ridges and woodland (falling branches).']);
    else if (gust != null && gust >= 45) out.push(['warn', 'Strong gusts ' + Math.round(gust) + ' km/h: wind chill on high ground; pitch shelters low.']);
    if (cur.snowfall > 0 || (cur.weather_code >= 71 && cur.weather_code <= 86)) out.push(['warn', 'Snow: white-out risk on the tops; roads over the Pennines and Moors may close.']);
    if (cur.weather_code === 45 || cur.weather_code === 48) out.push(['warn', 'Fog: navigate by compass and pacing; stay off featureless moor.']);
    var code = cur.weather_code;
    if (code >= 95) out.push(['danger', 'Thunderstorm: get off summits, ridges and open moor; avoid lone trees, fences and water. Crouch low in a dip if caught out.']);
    if (code === 56 || code === 57 || code === 66 || code === 67) out.push(['danger', 'Freezing rain: black ice on roads and rocks. Microspikes or stay put.']);
    else if (t != null && t <= 1 && (pr > 0 || cur.snowfall > 0)) out.push(['warn', 'Near freezing with precipitation: ice likely on paths, rocks and untreated roads.']);
    var tmax = hourly && hourly.temperature_2m && hourly.temperature_2m.length ? Math.max.apply(null, hourly.temperature_2m) : t;
    if (tmax != null && tmax >= 30) out.push(['danger', 'Heat ' + Math.round(tmax) + ' °C: heatstroke risk. Rest 11:00–15:00, 0.5–1 L water an hour when working, check on older neighbours. No fires or BBQs.']);
    else if (tmax != null && tmax >= 25) out.push(['warn', 'Warm (' + Math.round(tmax) + ' °C): carry 3+ litres and shade. Moorland wildfire risk rises in dry spells.']);
    if (hourly && hourly.precipitation_probability) {
      var mx = Math.max.apply(null, hourly.precipitation_probability.slice(0, 12));
      if (mx >= 70) out.push(['info', 'Rain likely in the next 12 h (' + mx + '%): pitch shelter early, keep tinder dry.']);
    }
    if (!out.length) out.push(['ok', 'No weather warnings from the current conditions. Conditions on the tops can change fast.']);
    return out;
  }

  // ------------------------------------------------------------------ main map
  function mount(container, opts) {
    opts = opts || {};
    container.classList.add('bb-map-root');
    container.innerHTML = '';
    var mapEl = el('div', 'bb-map-canvas'); container.appendChild(mapEl);
    var ui = el('div', 'bb-map-ui'); container.appendChild(ui);
    var panel = el('div', 'bb-panel'); panel.setAttribute('aria-live', 'polite'); container.appendChild(panel);
    var notice = el('div', 'bb-notice'); container.appendChild(notice);

    var state = { mode: 'terrain', month: 0, cats: {}, radar: null, radarFrames: [], radarIdx: 0, radarTimer: null };
    Object.keys(CAT).forEach(function (k) { state.cats[k] = CAT[k].on; });

    function load() {
      if (opts.data && typeof opts.data === 'object') return Promise.resolve(opts.data);
      return fetch(opts.data).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .catch(function () { if (global.BB_REGION_DATA) return global.BB_REGION_DATA; throw new Error('Map data unavailable'); });
    }

    var api = {};
    return load().then(function (D) {
      try { build(D); } catch (e) {
        notice.textContent = 'The interactive map failed to start (' + e.message + '). The written guide below still applies.';
        notice.classList.add('show'); if (global.console) console.error(e); throw e;
      }
      return api;
    }, function (err) {
      notice.textContent = 'Map data could not be loaded (' + err.message + '). The written guide below still applies.';
      notice.classList.add('show');
    });

    function build(D) {
      var map = L.map(mapEl, { zoomControl: true, attributionControl: true, scrollWheelZoom: false, tap: true, minZoom: 6, maxZoom: 17 });
      api.map = map;
      if (D.bounds) map.fitBounds(D.bounds, { padding: [8, 8] }); else map.setView(D.center, D.zoom);
      if (D.bounds) map.setMaxBounds(L.latLngBounds(D.bounds).pad(0.6));

      // ---- basemaps
      var base = {
        'Terrain': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17, subdomains: 'abc',
          attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Style © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)' }),
        'Streets': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19,
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }),
        'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18,
          attribution: 'Imagery © Esri, Maxar, Earthstar Geographics' })
      };
      var hillshade = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, opacity: 0.35,
        attribution: 'Hillshade © Esri' });
      var currentBase = base['Terrain'].addTo(map);
      var tileErrors = 0;
      Object.keys(base).forEach(function (k) {
        base[k].on('tileerror', function () { if (++tileErrors === 6) { notice.textContent = 'Offline: background map tiles unavailable. Zones and points still work.'; notice.classList.add('show'); } });
      });

      // ---- outline
      var outline = L.geoJSON(D.outline, { style: { color: '#f5f0e1', weight: 2.5, fill: false, dashArray: '6 4' }, interactive: false }).addTo(map);

      // ---- zones
      function zoneStyle(f) {
        var p = f.properties, fill;
        if (state.mode === 'rain') fill = rainColor(mid(p.rain_mm));
        else if (state.mode === 'snow') fill = snowColor(mid(p.snow_days));
        else fill = (p.color || ZONE_COLORS[p.id]) || '#888';
        return { color: p.base ? 'transparent' : '#10140f', weight: p.base ? 0 : 1.2, fillColor: fill,
          fillOpacity: state.mode === 'terrain' ? (p.base ? 0.12 : 0.32) : (p.base ? 0.35 : 0.6) };
      }
      var zoneLayer = L.geoJSON(D.zones, {
        style: zoneStyle,
        onEachFeature: function (f, layer) {
          layer.on('click', function (e) { showPoint(e.latlng, f); if (L.DomEvent && e.originalEvent) L.DomEvent.stopPropagation(e); });
          if (!f.properties.base && layer.bindTooltip) layer.bindTooltip(esc(f.properties.name), { sticky: true, className: 'bb-tip' });
        }
      }).addTo(map);
      function restyleZones() { zoneLayer.setStyle(zoneStyle); renderLegend(); }

      // ---- points
      var groups = {};
      Object.keys(CAT).forEach(function (k) { groups[k] = L.layerGroup(); if (state.cats[k]) groups[k].addTo(map); });
      var markers = [];
      L.geoJSON(D.points, {
        pointToLayer: function (f, latlng) {
          var p = f.properties, c = CAT[p.cat] || { color: '#fff', icon: '•' }, m;
          if (p.cat === 'town') {
            m = L.circleMarker(latlng, { radius: 3, color: '#111', weight: 1, fillColor: c.color, fillOpacity: 1 });
            if (m.bindTooltip) m.bindTooltip(esc(p.name), { permanent: true, direction: 'right', className: 'bb-town', offset: [4, 0] });
          } else if (p.cat === 'summit') {
            m = L.marker(latlng, { icon: L.divIcon({ className: 'bb-summit', html: '▲', iconSize: [14, 14] }), keyboard: true, title: p.name });
          } else {
            m = L.marker(latlng, { icon: L.divIcon({ className: 'bb-pin bb-' + p.cat + (p.protected ? ' bb-protected' : ''),
              html: '<span>' + c.icon + '</span>', iconSize: [22, 22], iconAnchor: [11, 11] }), keyboard: true, title: p.name });
          }
          return m;
        },
        onEachFeature: function (f, layer) {
          layer.bindPopup(popupHtml(f.properties), { maxWidth: 300, className: 'bb-popup' });
          markers.push({ f: f, layer: layer });
          (groups[f.properties.cat] || groups.town).addLayer(layer);
        }
      });

      function popupHtml(p) {
        var c = CAT[p.cat] || {}, h = '<div class="bb-pop"><div class="bb-pop-cat" style="--c:' + (c.color || '#fff') + '">' + (c.icon || '') + ' ' + esc(c.label || '') + '</div>';
        h += '<div class="bb-pop-title">' + esc(p.name) + '</div>';
        if (p.protected) h += '<div class="bb-badge bb-badge-red">PROTECTED: do not take</div>';
        if (p.cat === 'station') {
          h += '<table class="bb-clim">'
            + (p.elev != null ? '<tr><th>Elevation</th><td>' + p.elev + ' m</td></tr>' : '')
            + (p.rain_mm != null ? '<tr><th>Rainfall</th><td>' + p.rain_mm.toLocaleString('en-GB') + ' mm/yr</td></tr>' : '')
            + (p.rain_days ? '<tr><th>Rain days (≥1 mm)</th><td>' + p.rain_days + '</td></tr>' : '')
            + (p.jan_min != null ? '<tr><th>Jan mean min</th><td>' + p.jan_min + ' °C</td></tr>' : '') + (p.jul_max != null ? '<tr><th>Jul mean max</th><td>' + p.jul_max + ' °C</td></tr>' : '')
            + (p.ann_max != null ? '<tr><th>Annual mean max / min</th><td>' + p.ann_max + ' / ' + p.ann_min + ' °C</td></tr>' : '')
            + (p.frost_days != null ? '<tr><th>Air frost days</th><td>' + p.frost_days + '</td></tr>' : '')
            + (p.sun_h != null ? '<tr><th>Sunshine</th><td>' + p.sun_h.toLocaleString('en-GB') + ' h/yr</td></tr>' : '') + '</table>';
        }
        if (p.fish) h += fishChips(p.fish);
        if (p.note) h += '<p>' + esc(p.note) + '</p>';
        if (p.months) h += '<div class="bb-months">' + MONTHS.map(function (m, i) { return '<span class="' + (p.months.indexOf(i + 1) >= 0 ? 'on' : '') + '">' + m[0] + '</span>'; }).join('') + '</div>';
        return h + '</div>';
      }

      function applyMonth() {
        markers.forEach(function (o) {
          var p = o.f.properties, on = !state.month || !p.months || p.months.indexOf(state.month) >= 0;
          var iconEl = o.layer.getElement ? o.layer.getElement() : null;
          if (iconEl) iconEl.classList.toggle('bb-off-season', !on);
          o.offSeason = !on;
        });
      }
      map.on('zoomend', applyMonth); map.on('layeradd', function () { setTimeout(applyMonth, 0); });

      // ---- live radar (RainViewer)
      function startRadar(btn) {
        notice.classList.remove('show');
        fetch('https://api.rainviewer.com/public/weather-maps.json').then(function (r) { return r.json(); }).then(function (j) {
          var frames = (j.radar && j.radar.past) || [];
          if (!frames.length) throw new Error('no frames');
          state.radarFrames = frames.map(function (fr) {
            return L.tileLayer(j.host + fr.path + '/256/{z}/{x}/{y}/2/1_1.png', { opacity: 0, maxNativeZoom: 7, maxZoom: 17, zIndex: 400,
              attribution: 'Radar © <a href="https://www.rainviewer.com/">RainViewer</a>' }).addTo(map);
          });
          state.radarTimes = frames.map(function (fr) { return fr.time; });
          state.radarIdx = state.radarFrames.length - 1;
          showFrame();
          state.radarTimer = setInterval(function () { state.radarIdx = (state.radarIdx + 1) % state.radarFrames.length; showFrame(); }, 700);
          btn.classList.add('on'); btn.setAttribute('aria-pressed', 'true');
        }).catch(function () {
          notice.textContent = 'Live radar unavailable (offline or service limit). Try again later.'; notice.classList.add('show');
          btn.classList.remove('on'); btn.setAttribute('aria-pressed', 'false');
        });
      }
      function showFrame() {
        state.radarFrames.forEach(function (l, i) { l.setOpacity(i === state.radarIdx ? 0.7 : 0); });
        var t = new Date(state.radarTimes[state.radarIdx] * 1000);
        radarTime.textContent = 'Radar ' + t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        radarTime.style.display = 'block';
      }
      function stopRadar(btn) {
        clearInterval(state.radarTimer); state.radarTimer = null;
        state.radarFrames.forEach(function (l) { map.removeLayer(l); }); state.radarFrames = [];
        radarTime.style.display = 'none';
        btn.classList.remove('on'); btn.setAttribute('aria-pressed', 'false');
      }

      // ---- sea areas: what lives offshore, by month
      var seaLayer = L.geoJSON({ type: 'FeatureCollection', features: (D.seas || []).map(function (s) { return { type: 'Feature', geometry: s.geometry, properties: s }; }) }, {
        style: { color: '#4fa3c7', weight: 1.2, dashArray: '4 4', fillColor: '#2b7bb9', fillOpacity: 0.1 },
        onEachFeature: function (f, layer) {
          layer.on('click', function (e) { showSea(f.properties); if (e.originalEvent) L.DomEvent.stopPropagation(e); });
          if (layer.bindTooltip) layer.bindTooltip('🌊 ' + esc(f.properties.name) + ': tap for sea fish', { sticky: true, className: 'bb-tip' });
        }
      });
      var seaLabels = L.layerGroup();
      (D.seas || []).forEach(function (s) {
        var m = L.marker(s.label, { icon: L.divIcon({ className: 'bb-sea-label', html: '<span>🌊 ' + esc(s.name.split(':')[0]) + '</span>', iconSize: null }), keyboard: true, title: s.name });
        m.on('click', function () { showSea(s); });
        seaLabels.addLayer(m);
      });
      state.cats.sea = true;
      if ((D.seas || []).length) { seaLayer.addTo(map); seaLabels.addTo(map); }

      // ---- UI: one toolbar, two drop-down menus
      var bar = el('div', 'bb-bar');
      var modeSel = el('div', 'bb-seg', '');
      [['terrain', '⛰️', 'Zones'], ['rain', '🌧️', 'Rain'], ['snow', '❄️', 'Snow']].forEach(function (m) {
        var b = el('button', 'bb-btn' + (m[0] === state.mode ? ' on' : ''), m[1] + '<span class="bb-lbl"> ' + m[2] + '</span>'); b.type = 'button';
        b.title = { terrain: 'Landscape zones', rain: 'Average rainfall', snow: 'Days with snow lying' }[m[0]];
        b.addEventListener('click', function () { state.mode = m[0]; modeSel.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); restyleZones(); });
        modeSel.appendChild(b);
      });
      bar.appendChild(modeSel);
      var lifeBtn = el('button', 'bb-btn bb-life', '🐟<span class="bb-lbl"> Fish &amp; game</span>'); lifeBtn.type = 'button';
      lifeBtn.title = 'What lives here: deer, game, river and sea fish by month';
      lifeBtn.addEventListener('click', function () { closeMenus(); showGuide(); });
      bar.appendChild(lifeBtn);
      var menus = [];
      function menu(label, title) {
        var wrap = el('div', 'bb-menu-wrap'), b = el('button', 'bb-btn', label + ' <span class="bb-caret">▾</span>'), box = el('div', 'bb-menu');
        b.type = 'button'; b.title = title; b.setAttribute('aria-expanded', 'false');
        b.addEventListener('click', function (e) { e.stopPropagation(); var open = !box.classList.contains('open'); closeMenus(); if (open) { box.classList.add('open'); b.classList.add('on'); b.setAttribute('aria-expanded', 'true'); } });
        box.addEventListener('click', function (e) { e.stopPropagation(); });
        wrap.appendChild(b); wrap.appendChild(box); bar.appendChild(wrap); menus.push([b, box]);
        return box;
      }
      function closeMenus() { menus.forEach(function (m) { m[1].classList.remove('open'); m[0].classList.remove('on'); m[0].setAttribute('aria-expanded', 'false'); }); }
      map.on('click movestart', closeMenus);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenus(); });
      var layersBox = menu('☰<span class="bb-lbl"> Layers</span>', 'Choose what to show');
      var toolsBox = menu('🧭<span class="bb-lbl"> Tools</span>', 'Location, planning and view tools');
      ui.appendChild(bar);

      layersBox.appendChild(el('div', 'bb-menu-h', 'Show on map'));
      var chips = el('div', 'bb-chips');
      var present = {}; D.points.features.forEach(function (f) { present[f.properties.cat] = 1; });
      function chip(k, label, icon, color, on, toggle) {
        var b = el('button', 'bb-chip' + (on ? ' on' : ''), '<i style="--c:' + color + '"></i>' + icon + ' ' + label);
        b.type = 'button'; b.setAttribute('aria-pressed', String(on));
        b.addEventListener('click', function () { state.cats[k] = !state.cats[k]; b.classList.toggle('on', state.cats[k]); b.setAttribute('aria-pressed', String(state.cats[k])); toggle(state.cats[k]); });
        chips.appendChild(b);
      }
      Object.keys(CAT).forEach(function (k) {
        if (!present[k]) return; // only offer layers this region actually has
        chip(k, CAT[k].label, CAT[k].icon, CAT[k].color, state.cats[k], function (on) { if (on) groups[k].addTo(map); else map.removeLayer(groups[k]); });
      });
      if ((D.seas || []).length) chip('sea', 'Sea areas', '🌊', '#4fa3c7', true, function (on) { [seaLayer, seaLabels].forEach(function (l) { if (on) l.addTo(map); else map.removeLayer(l); }); });
      layersBox.appendChild(chips);

      var season = el('div', 'bb-season');
      season.innerHTML = '<label>📅 Season: <b class="bb-mon">All year</b></label><input type="range" min="0" max="12" step="1" value="0" aria-label="Filter by month"><small>Greys out what is out of season.</small>';
      var slider = season.querySelector('input'), monLbl = season.querySelector('.bb-mon');
      slider.addEventListener('input', function () { state.month = +slider.value; monLbl.textContent = state.month ? MONTHS[state.month - 1] : 'All year'; applyMonth(); });
      layersBox.appendChild(season);

      layersBox.appendChild(el('div', 'bb-menu-h', 'Background'));
      var bgRow = el('div', 'bb-menu-row');
      var baseSel = el('select', 'bb-select'); baseSel.setAttribute('aria-label', 'Background map');
      Object.keys(base).forEach(function (k) { var o = el('option', null, k); o.value = k; baseSel.appendChild(o); });
      baseSel.addEventListener('change', function () { map.removeLayer(currentBase); currentBase = base[baseSel.value].addTo(map); if (currentBase.bringToBack) currentBase.bringToBack(); });
      var hsBtn = el('button', 'bb-btn', '🏔️ Hillshade'); hsBtn.type = 'button';
      hsBtn.addEventListener('click', function () { if (map.hasLayer(hillshade)) { map.removeLayer(hillshade); hsBtn.classList.remove('on'); } else { hillshade.addTo(map); hsBtn.classList.add('on'); } });
      var radarBtn = el('button', 'bb-btn bb-radar', '📡 Live rain radar'); radarBtn.type = 'button'; radarBtn.setAttribute('aria-pressed', 'false');
      radarBtn.addEventListener('click', function () { if (state.radarTimer) stopRadar(radarBtn); else startRadar(radarBtn); });
      [baseSel, hsBtn, radarBtn].forEach(function (x) { bgRow.appendChild(x); });
      layersBox.appendChild(bgRow);

      var tools = el('div', 'bb-tools');
      var locBtn = el('button', 'bb-btn', '📍 My location'); locBtn.type = 'button';
      locBtn.addEventListener('click', function () {
        closeMenus();
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(function (pos) { var ll = L.latLng(pos.coords.latitude, pos.coords.longitude); map.setView(ll, 12); showPoint(ll); },
          function () { notice.textContent = 'Location permission denied.'; notice.classList.add('show'); }, { enableHighAccuracy: true, timeout: 10000 });
      });
      var fsBtn = el('button', 'bb-btn', '⛶ Full screen'); fsBtn.type = 'button';
      fsBtn.addEventListener('click', function () { closeMenus(); container.classList.toggle('bb-full'); setTimeout(function () { map.invalidateSize(); }, 200); });
      var resetBtn = el('button', 'bb-btn', '⟲ Reset view'); resetBtn.type = 'button';
      resetBtn.addEventListener('click', function () { closeMenus(); if (D.bounds) map.fitBounds(D.bounds, { padding: [8, 8] }); else map.setView(D.center, D.zoom); });
      tools.appendChild(locBtn); tools.appendChild(fsBtn); tools.appendChild(resetBtn);
      var losBtn = el('button', 'bb-btn', '📡 Line of sight'), rteBtn = el('button', 'bb-btn', '🥾 Route check'), relBtn = el('button', 'bb-btn', '📶 Relay hills');
      [losBtn, rteBtn, relBtn].forEach(function (b) { b.type = 'button'; b.addEventListener('click', closeMenus); tools.appendChild(b); });
      toolsBox.appendChild(tools);

      var radarTime = el('div', 'bb-radar-time'); container.appendChild(radarTime);
      var legend = el('div', 'bb-legend'); container.appendChild(legend);
      if (global.matchMedia && global.matchMedia('(max-width: 759px)').matches) legend.classList.add('bb-leg-closed');
      legend.addEventListener('click', function (e) { if (!e.target.closest('.bb-leg-t')) return; legend.classList.toggle('bb-leg-closed'); e.target.closest('.bb-leg-t').setAttribute('aria-expanded', String(!legend.classList.contains('bb-leg-closed'))); });
      function renderLegend() {
        var h = '';
        if (state.mode === 'terrain') {
          h = '<b>Landscape zones</b>' + D.zones.features.filter(function (f) { return !f.properties.base; }).map(function (f) {
            return '<div><i style="background:' + ((f.properties.color || ZONE_COLORS[f.properties.id]) || '#888') + '"></i>' + esc(f.properties.name) + '</div>'; }).join('');
        } else if (state.mode === 'rain') {
          h = '<b>Average annual rainfall</b><div class="bb-ramp" style="background:linear-gradient(90deg,' + RAIN_RAMP.join(',') + ')"></div><div class="bb-ramp-l"><span>550 mm</span><span>1,700+ mm</span></div><small>Zone averages. Stations show measured 1991–2020 values.</small>';
        } else {
          h = '<b>Days with snow lying (approx.)</b><div class="bb-ramp" style="background:linear-gradient(90deg,' + SNOW_RAMP.join(',') + ')"></div><div class="bb-ramp-l"><span>&lt;5</span><span>45+</span></div><small>Typical winter; varies hugely year to year.</small>';
        }
        legend.innerHTML = '<button type="button" class="bb-leg-t" aria-expanded="' + !legend.classList.contains('bb-leg-closed') + '">🗺️ Key</button><div class="bb-leg-b">' + h + '</div>';
      }
      renderLegend();

      // ---- fish & game: chips, month strips, sea calendar, region guide
      function curMonth() { return state.month || new Date().getMonth() + 1; }
      function fishChips(list) {
        return '<div class="bb-fish">' + list.map(function (f) { return '<span' + (/protected|release|return|invasive/i.test(f) ? ' class="bb-warn"' : '') + '>' + esc(f) + '</span>'; }).join('') + '</div>';
      }
      function monthStrip(months) {
        var cm = curMonth();
        if (!months || !months.length) return '<div class="bb-ms bb-ms-none">Not to be taken</div>';
        return '<div class="bb-ms" aria-label="Best months: ' + months.map(function (m) { return MONTHS[m - 1]; }).join(', ') + '">' + MONTHS.map(function (m, i) {
          return '<span class="' + (months.indexOf(i + 1) >= 0 ? 'on' : '') + (i + 1 === cm ? ' now' : '') + '">' + m[0] + '</span>'; }).join('') + '</div>';
      }
      function spRows(list) {
        return '<div class="bb-sp">' + list.map(function (x) {
          return '<div class="bb-sp-row"><div class="bb-sp-n"><b>' + esc(x.sp) + '</b>' + (x.note ? '<small>' + esc(x.note) + '</small>' : '') + '</div>' + monthStrip(x.months) + '</div>'; }).join('') + '</div>';
      }
      function inSeason(list) { var cm = curMonth(); return list.filter(function (x) { return x.months && x.months.indexOf(cm) >= 0; }); }
      function openPanel(h) {
        ++reqId; stopPlanner && planner && stopPlanner();
        panel.innerHTML = '<button class="bb-close" type="button" aria-label="Close">×</button>' + h;
        panel.classList.add('open'); panel.scrollTop = 0;
        panel.querySelector('.bb-close').addEventListener('click', function () { panel.classList.remove('open'); });
      }
      function monthPicker() {
        return '<label class="bb-mpick">Month <select>' + MONTHS.map(function (m, i) { return '<option value="' + (i + 1) + '"' + (i + 1 === curMonth() ? ' selected' : '') + '>' + m + '</option>'; }).join('') + '</select></label>';
      }
      function bindMonthPicker(rerender) {
        var s = panel.querySelector('.bb-mpick select');
        if (s) s.addEventListener('change', function () { slider.value = s.value; slider.dispatchEvent(new Event('input')); rerender(); });
      }
      function showSea(s) {
        openPanel('<div class="bb-p-head"><div class="bb-p-sub">Sea area</div><div class="bb-p-zname">🌊 ' + esc(s.name) + '</div>'
          + '<p class="bb-small">Best months to catch each species from the shore or a small boat. ' + monthPicker() + '</p></div>'
          + '<div class="bb-p-sub">Fish</div>' + spRows(s.fish)
          + (s.shell && s.shell.length ? '<div class="bb-p-sub">Shellfish &amp; seaweed</div>' + spRows(s.shell) : '')
          + (s.note ? '<div class="bb-adv bb-adv-info">' + esc(s.note) + '</div>' : '')
          + rulesHtml() + '<p><button type="button" class="bb-mini bb-to-guide">🐟 Whole region: deer, game, rivers</button></p>');
        bindMonthPicker(function () { showSea(s); });
        panel.querySelector('.bb-to-guide').addEventListener('click', function () { showGuide('rivers'); });
      }
      function rulesHtml() {
        return D.rules ? '<details class="bb-rules"><summary>⚖️ The rules here</summary><ul>' + D.rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></details>' : '';
      }
      function rivers() { return D.points.features.filter(function (f) { return f.properties.cat === 'river'; }); }
      function flyTo(name) {
        markers.forEach(function (o) {
          if (o.f.properties.name !== name) return;
          var k = o.f.properties.cat;
          if (!state.cats[k]) { state.cats[k] = true; groups[k].addTo(map); chips.querySelectorAll('.bb-chip').forEach(function (c) { if (c.textContent.indexOf(CAT[k].label) >= 0) { c.classList.add('on'); c.setAttribute('aria-pressed', 'true'); } }); }
          if (global.matchMedia && global.matchMedia('(max-width: 759px)').matches) panel.classList.remove('open');
          map.setView(o.layer.getLatLng(), Math.max(map.getZoom(), 11)); o.layer.openPopup();
        });
      }
      var guideTab = 'rivers';
      function showGuide(tab) {
        guideTab = tab || guideTab;
        var T = [['deer', '🦌 Deer'], ['game', '🐦 Game'], ['rivers', '🐟 Rivers'], ['sea', '🌊 Sea'], ['protected', '🚫 Protected']]
          .filter(function (t) { return t[0] !== 'sea' || (D.seas || []).length; });
        var h = '<div class="bb-p-head"><div class="bb-p-sub">' + esc(D.title || '') + '</div><div class="bb-p-zname">What lives here</div>'
          + '<p class="bb-small">Highlighted months are open seasons or the best time to catch. ' + monthPicker() + '</p></div>'
          + '<div class="bb-tabs" role="tablist">' + T.map(function (t) { return '<button type="button" role="tab" data-t="' + t[0] + '" aria-selected="' + (t[0] === guideTab) + '" class="' + (t[0] === guideTab ? 'on' : '') + '">' + t[1] + '</button>'; }).join('') + '</div>';
        if (guideTab === 'deer') {
          h += (D.deer || []).map(function (d) { return '<div class="bb-card"><b>' + esc(d.sp) + '</b><div>' + esc(d.where) + '</div><div class="bb-season-t">Open season: ' + esc(d.season) + '</div></div>'; }).join('')
            + '<div class="bb-adv bb-adv-info">Deer need a firearm certificate, a legal calibre and the landowner\'s permission. Never at night. Rut: red and sika Sep–Oct, fallow Oct–Nov, roe Jul–Aug: stags and bucks can charge.</div>';
        } else if (guideTab === 'game') {
          h += spRows(D.game || []) + '<p class="bb-small">Shotgun certificate and the landowner\'s permission. Game birds can\'t be shot on Sundays or Christmas Day in England and Wales.</p>';
        } else if (guideTab === 'rivers') {
          h += rivers().map(function (f) { var p = f.properties;
            return '<div class="bb-card"><button type="button" class="bb-link" data-fly="' + esc(p.name) + '">📍 ' + esc(p.name) + '</button>' + fishChips(p.fish || []) + (p.note ? '<small>' + esc(p.note) + '</small>' : '') + (p.months ? monthStrip(p.months) : '') + '</div>'; }).join('');
        } else if (guideTab === 'sea') {
          h += (D.seas || []).map(function (s, i) { var now = inSeason(s.fish.concat(s.shell || []));
            return '<div class="bb-card"><button type="button" class="bb-link" data-sea="' + i + '">🌊 ' + esc(s.name) + ' →</button><div class="bb-small">In ' + MONTHS[curMonth() - 1] + ':</div>'
              + (now.length ? fishChips(now.map(function (x) { return x.sp; })) : '<div class="bb-small">Quiet month.</div>') + '</div>'; }).join('')
            + '<p class="bb-small">Tap a sea area for the full month-by-month calendar.</p>';
        } else {
          h += '<div class="bb-fish bb-prot">' + (D.protected || []).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>'
            + '<div class="bb-adv bb-adv-warn">Leave these alone. Killing, taking or disturbing most of them is a crime, even in a crisis, and many are too rare to recover.</div>';
        }
        openPanel(h + rulesHtml());
        bindMonthPicker(function () { showGuide(); });
        panel.querySelectorAll('.bb-tabs button').forEach(function (b) { b.addEventListener('click', function () { showGuide(b.getAttribute('data-t')); }); });
        panel.querySelectorAll('[data-fly]').forEach(function (b) { b.addEventListener('click', function () { flyTo(b.getAttribute('data-fly')); }); });
        panel.querySelectorAll('[data-sea]').forEach(function (b) { b.addEventListener('click', function () { showSea(D.seas[+b.getAttribute('data-sea')]); }); });
      }
      function nearSea(lat, lon) {
        var best = null;
        (D.seas || []).forEach(function (s) { s.geometry.coordinates[0].forEach(function (c) { var d = haversine([lat, lon], [c[1], c[0]]); if (!best || d < best.d) best = { d: d, s: s }; }); });
        return best && best.d < 15 ? best.s : null;
      }
      function lifeNearHtml(lat, lon) {
        var rs = rivers().map(function (f) { var ll = [f.geometry.coordinates[1], f.geometry.coordinates[0]]; return { f: f, d: haversine([lat, lon], ll), b: bearing([lat, lon], ll) }; })
          .filter(function (r) { return r.d < 20; }).sort(function (a, b) { return a.d - b.d; }).slice(0, 3);
        var sea = nearSea(lat, lon);
        var h = '<div class="bb-p-life"><div class="bb-p-sub">Fish &amp; game near here</div>';
        rs.forEach(function (r) { h += '<div class="bb-near-r"><button type="button" class="bb-link" data-fly="' + esc(r.f.properties.name) + '">🐟 ' + esc(r.f.properties.name) + '</button> <b>' + r.d.toFixed(1) + ' km ' + compass(r.b) + '</b>' + fishChips(r.f.properties.fish || []) + '</div>'; });
        if (!rs.length) h += '<div class="bb-small">No mapped river or lake within 20 km.</div>';
        if (sea) { var now = inSeason(sea.fish.concat(sea.shell || []));
          h += '<div class="bb-near-r"><button type="button" class="bb-link" data-sea-id="' + esc(sea.id) + '">🌊 ' + esc(sea.name) + ' →</button><div class="bb-small">In ' + MONTHS[curMonth() - 1] + ':</div>' + fishChips(now.map(function (x) { return x.sp; })) + '</div>'; }
        if (D.deer && D.deer.length) h += '<div class="bb-near-r">🦌 Deer in the region: ' + D.deer.map(function (d) { return esc(d.sp.replace(' deer', '')); }).join(', ') + '</div>';
        return h + '<button type="button" class="bb-mini bb-to-guide">Full guide: seasons and rules</button></div>';
      }
      function bindLife() {
        panel.querySelectorAll('.bb-p-life [data-fly]').forEach(function (b) { b.addEventListener('click', function () { flyTo(b.getAttribute('data-fly')); }); });
        panel.querySelectorAll('[data-sea-id]').forEach(function (b) { b.addEventListener('click', function () { showSea((D.seas || []).filter(function (s) { return s.id === b.getAttribute('data-sea-id'); })[0]); }); });
        var g = panel.querySelector('.bb-p-life .bb-to-guide'); if (g) g.addEventListener('click', function () { showGuide(); });
      }

      // ---- click anywhere: location report
      var planner = null;
      map.on('click', function (e) { if (planner && planner.click(e.latlng)) return; showPoint(e.latlng); });
      var reqId = 0;
      function inGeom(pt, g) { // Polygon or MultiPolygon, holes ignored
        return (g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates]).some(function (poly) { return pointInRing(pt, poly[0]); });
      }
      function seaAt(lat, lon) { return (D.seas || []).filter(function (s) { return inGeom([lon, lat], s.geometry); })[0] || null; }
      function zoneAt(lat, lon) {
        var feats = D.zones.features.slice().reverse();
        for (var i = 0; i < feats.length; i++) { if (inGeom([lon, lat], feats[i].geometry)) return feats[i]; }
        return null;
      }
      function nearest(cat, lat, lon, filt) {
        var best = null;
        D.points.features.forEach(function (f) {
          if (f.properties.cat !== cat || (filt && !filt(f.properties))) return;
          var ll = [f.geometry.coordinates[1], f.geometry.coordinates[0]], d = haversine([lat, lon], ll);
          if (!best || d < best.d) best = { d: d, f: f, b: bearing([lat, lon], ll) };
        });
        return best;
      }
      var EA = 'https://environment.data.gov.uk/flood-monitoring';
      var SEV = { 1: ['danger', '🔴 Severe flood warning: danger to life'], 2: ['danger', '🟠 Flood warning: act now'], 3: ['warn', '🟡 Flood alert: be prepared'], 4: ['info', 'Warning no longer in force'] };
      function getJSON(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
      function loadFlood(lat, lon, my, out) {
        var FP = {
          sepa: 'Scotland\'s flood warnings come from <b>SEPA</b>, not the Environment Agency, so they aren\'t shown live here. Check <b>floodline.sepa.org.uk</b> and river levels at <b>waterlevels.sepa.org.uk</b>. Sign up for free warnings: Floodline <b>0345 988 1188</b>.',
          nrw: 'Wales\'s flood warnings come from <b>Natural Resources Wales</b> (NRW), not the Environment Agency, so they aren\'t shown live here. Check <b>naturalresources.wales/flooding</b> (warnings updated every 15 minutes, plus river levels and a 5-day flood outlook). Sign up for free warnings: Floodline <b>0345 988 1188</b>.'
        };
        if (D.flood_provider && FP[D.flood_provider]) {
          // EA data stops at the border; link to the right agency rather than show an empty England-only result.
          out.innerHTML = '<div class="bb-adv bb-adv-info">' + FP[D.flood_provider] + '</div>';
          return;
        }
        var q = 'lat=' + lat.toFixed(4) + '&long=' + lon.toFixed(4);
        Promise.all([
          getJSON(EA + '/id/floods?' + q + '&dist=10&min-severity=3').catch(function () { return null; }),
          getJSON(EA + '/id/stations?' + q + '&dist=10&parameter=level&status=Active&_limit=20').catch(function () { return null; })
        ]).then(function (res) {
          if (my !== reqId) return;
          var fl = res[0], st = res[1], h = '';
          if (!fl && !st) { out.innerHTML = '<div class="bb-adv bb-adv-info">Flood data unavailable offline. Sign up for free warnings: Floodline 0345 988 1188.</div>'; return; }
          var items = fl && fl.items ? fl.items.slice().sort(function (a, b) { return a.severityLevel - b.severityLevel; }) : [];
          if (items.length) {
            h += items.slice(0, 5).map(function (w) { var sv = SEV[w.severityLevel] || SEV[3];
              return '<div class="bb-adv bb-adv-' + sv[0] + '"><b>' + sv[1] + '</b><br>' + esc(w.description || (w.floodArea && w.floodArea.riverOrSea) || '') + '</div>'; }).join('');
            if (items.length > 5) h += '<small>+' + (items.length - 5) + ' more nearby</small>';
          } else if (fl) h += '<div class="bb-adv bb-adv-ok">No flood alerts or warnings within 10 km right now.</div>';
          out.innerHTML = h + '<div class="bb-river">Finding nearest river gauge…</div>';
          var rv = out.querySelector('.bb-river');
          var stations = st && st.items ? st.items.filter(function (x) { return x.lat != null && x.long != null; }) : [];
          if (!stations.length) { rv.textContent = 'No river-level gauge within 10 km.'; return addSrc(); }
          stations.sort(function (a, b) { return haversine([lat, lon], [a.lat, a.long]) - haversine([lat, lon], [b.lat, b.long]); });
          var s0 = stations[0], ref = s0.stationReference || s0.notation;
          if (haversine([lat, lon], [s0.lat, s0.long]) > 15) { rv.textContent = 'No river-level gauge within 15 km.'; return addSrc(); }
          Promise.all([getJSON(EA + '/id/stations/' + encodeURIComponent(ref) + '/readings?latest').catch(function () { return null; }),
                       getJSON(EA + '/id/stations/' + encodeURIComponent(ref)).catch(function () { return null; })]).then(function (r2) {
            if (my !== reqId) return;
            var rds = (r2[0] && r2[0].items) || [], rd = rds.filter(function (i) { return /level-stage/i.test(i.measure || ''); })[0] || rds.filter(function (i) { return /level/i.test(i.measure || ''); })[0];
            var det = r2[1] && r2[1].items, ss = det && (Array.isArray(det) ? det[0] : det).stageScale;
            var hi = ss && ss.typicalRangeHigh, lo = ss && ss.typicalRangeLow;
            var name = esc(s0.label || ref) + (s0.riverName ? ' (' + esc(s0.riverName) + ')' : '');
            var dkm = haversine([lat, lon], [s0.lat, s0.long]).toFixed(1);
            if (!rd || rd.value == null) { rv.innerHTML = '🌊 Gauge: ' + name + ', ' + dkm + ' km. No recent reading.'; return addSrc(); }
            var v = +rd.value, state2 = '', cls = 'ok';
            if (hi != null && v > hi) { state2 = 'ABOVE normal range (typical high ' + (+hi).toFixed(2) + ' m)'; cls = 'warn'; }
            else if (lo != null && v < lo) state2 = 'below normal range';
            else if (hi != null) state2 = 'within normal range (typical high ' + (+hi).toFixed(2) + ' m)';
            rv.innerHTML = '<div class="bb-adv bb-adv-' + cls + '">🌊 <b>' + v.toFixed(2) + ' m</b> at ' + name + ', ' + dkm + ' km ' + compass(bearing([lat, lon], [s0.lat, s0.long])) + '. ' + state2
              + ' <small>(' + esc(String(rd.dateTime || '').slice(11, 16)) + ')</small></div>';
            addSrc();
          });
          function addSrc() { if (!out.querySelector('.bb-src')) out.insertAdjacentHTML('beforeend', '<small class="bb-src">This uses Environment Agency flood and river level data from the real-time data API (Beta), OGL v3.</small>'); }
        });
      }
      function loadMarine(lat, lon, my, out) {
        getJSON('https://marine-api.open-meteo.com/v1/marine?latitude=' + lat.toFixed(3) + '&longitude=' + lon.toFixed(3)
          + '&hourly=wave_height,sea_level_height_msl,sea_surface_temperature&forecast_days=2&timezone=Europe%2FLondon').then(function (j) {
          if (my !== reqId) return;
          var hr = j.hourly || {}, t = hr.time || [], sl = hr.sea_level_height_msl || [], wv = hr.wave_height || [], sst = hr.sea_surface_temperature || [];
          var i0 = 0;
          // hourly times are local; find the first slot not in the past (approximate)
          var nowL = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 13);
          for (var k = 0; k < t.length; k++) { if (t[k].slice(0, 13) >= nowL) { i0 = k; break; } }
          var tides = [];
          for (var i = Math.max(1, i0); i < sl.length - 1 && tides.length < 4; i++) {
            if (sl[i] == null || sl[i - 1] == null || sl[i + 1] == null) continue;
            if (sl[i] > sl[i - 1] && sl[i] >= sl[i + 1]) tides.push(['High', t[i], sl[i]]);
            else if (sl[i] < sl[i - 1] && sl[i] <= sl[i + 1]) tides.push(['Low', t[i], sl[i]]);
          }
          if (!wv.length && !tides.length) { out.textContent = 'No marine data for this point (too far inland).'; return; }
          var h = '<div class="bb-wx-row">' + (wv[i0] != null ? '🌊 Waves ' + (+wv[i0]).toFixed(1) + ' m' : '') + (sst[i0] != null ? ' · 🌡️ Sea ' + Math.round(sst[i0]) + ' °C' : '') + '</div>';
          if (tides.length) h += '<div class="bb-tides">' + tides.map(function (x) { return '<span><b>' + x[0] + '</b> ~' + x[1].slice(11, 16) + (x[1].slice(0, 10) !== t[i0].slice(0, 10) ? ' (tmrw)' : '') + '</span>'; }).join('') + '</div>';
          if (wv[i0] != null && wv[i0] >= 2) h += '<div class="bb-adv bb-adv-warn">Rough sea: keep off piers, breakwaters and wave-cut platforms.</div>';
          h += '<div class="bb-adv bb-adv-info">Tide times are a model estimate (±1 h), <b>not for navigation</b> or crossing tidal causeways. Use Admiralty EasyTide or local tide tables' + (D.tide_note ? ', and ' + esc(D.tide_note) : ', and leave a wide margin on causeways, sandbanks and estuaries') + '.</div>'
            + '<small class="bb-src">Marine model: <a href="https://open-meteo.com/en/docs/marine-weather-api" target="_blank" rel="noopener">Open-Meteo</a> (CC BY 4.0)</small>';
          out.innerHTML = h;
        }).catch(function () { if (my === reqId) out.innerHTML = '<div class="bb-adv bb-adv-info">Sea data unavailable offline. Carry printed tide tables.</div>'; });
      }
      // Region-wide active flood warnings badge
      if (D.ea_counties) {
        getJSON(EA + '/id/floods?min-severity=3&county=' + encodeURIComponent(D.ea_counties.join(','))).then(function (j) {
          var items = (j.items || []), n1 = items.filter(function (x) { return x.severityLevel <= 2; }).length, n3 = items.length - n1;
          if (!items.length) return;
          var b = el('button', 'bb-flood-badge' + (n1 ? ' sev' : ''), '⚠️ ' + (n1 ? n1 + ' flood warning' + (n1 > 1 ? 's' : '') : '') + (n1 && n3 ? ' · ' : '') + (n3 ? n3 + ' flood alert' + (n3 > 1 ? 's' : '') : '') + ' active');
          b.type = 'button';
          b.addEventListener('click', function () {
            ++reqId;
            panel.innerHTML = '<button class="bb-close" type="button" aria-label="Close">×</button><div class="bb-p-sub">Active EA flood warnings & alerts</div>'
              + items.sort(function (a, c) { return a.severityLevel - c.severityLevel; }).map(function (w) { var sv = SEV[w.severityLevel] || SEV[3];
                return '<div class="bb-adv bb-adv-' + sv[0] + '"><b>' + sv[1] + '</b><br>' + esc(w.description) + (w.floodArea && w.floodArea.county ? ' <small>(' + esc(w.floodArea.county) + ')</small>' : '') + '</div>'; }).join('')
              + '<small class="bb-src">This uses Environment Agency flood and river level data from the real-time data API (Beta), OGL v3. Full details: check-for-flooding.service.gov.uk</small>';
            panel.classList.add('open');
            panel.querySelector('.bb-close').addEventListener('click', function () { panel.classList.remove('open'); });
          });
          container.appendChild(b);
        }).catch(function () {});
      }
      function showPoint(latlng, zf) {
        var lat = latlng.lat, lon = latlng.lng, my = ++reqId;
        zf = zf && !zf.properties.base ? zoneAt(lat, lon) || zf : zoneAt(lat, lon);
        var os = osGridRef(lat, lon);
        var h = '<button class="bb-close" type="button" aria-label="Close">×</button>';
        h += '<div class="bb-p-head"><div class="bb-p-coords">' + lat.toFixed(4) + ', ' + lon.toFixed(4) + (os ? ' · <b>OS ' + os.ref + '</b>' : '') + '</div>';
        h += '<div class="bb-p-elev">Elevation: <b class="bb-elev">…</b></div>'
          + '<div class="bb-p-sun">' + sunMoonLine(lat, lon) + '</div>'
          + '<div class="bb-p-tools">' + (os ? '<button type="button" class="bb-mini bb-copy">📋 Copy grid ref</button>' : '') + '<button type="button" class="bb-mini bb-print">🖨️ Print card</button></div></div>';
        if (zf) {
          var p = zf.properties;
          h += '<div class="bb-p-zone" style="--c:' + ((p.color || ZONE_COLORS[p.id]) || '#888') + '"><div class="bb-p-zname">' + esc(p.name) + ' <small>' + esc(p.type) + '</small></div>'
            + '<div class="bb-p-stats"><span>⛰️ ' + range(p.elev, ' m') + '</span><span>🌧️ ' + range(p.rain_mm, ' mm/yr') + '</span><span>❄️ ' + range(p.snow_days, ' snow days') + '</span></div>'
            + '<details open><summary>Terrain</summary><p>' + esc(p.terrain) + '</p></details>'
            + '<details open><summary>Weather pattern</summary><p>' + esc(p.weather) + '</p></details>'
            + '<details><summary>Food in this zone</summary><p>' + esc(p.food) + '</p></details>'
            + '<details><summary>Water</summary><p>' + esc(p.water) + '</p></details>'
            + '<details><summary>Shelter</summary><p>' + esc(p.shelter) + '</p></details>'
            + '<details><summary>Hazards</summary><p>' + esc(p.hazards) + '</p></details>'
            + '<details><summary>Seasons & access</summary><p>' + esc(p.seasons) + ' ' + esc(p.access) + '</p></details></div>';
        } else {
          var atSea = seaAt(lat, lon);
          h += atSea ? '<div class="bb-p-zone" style="--c:#4fa3c7"><div class="bb-p-zname">🌊 ' + esc(atSea.name) + ' <small>At sea</small></div></div>'
            : '<div class="bb-p-zone"><div class="bb-p-zname">Outside the mapped region</div></div>';
        }
        h += lifeNearHtml(lat, lon);
        h += '<div class="bb-p-live"><div class="bb-p-sub">Live conditions</div><div class="bb-wx">Loading…</div></div>';
        h += '<div class="bb-p-flood"><div class="bb-p-sub">Flood warnings & river levels</div><div class="bb-fl">' + (D.flood_provider && D.flood_provider !== 'ea' ? '…' : 'Checking Environment Agency…') + '</div></div>';
        var lifeboat = nearest('rescue', lat, lon, function (p) { return /^RNLI/.test(p.name); });
        var coastal = (zf && (zf.properties.coastal || /holderness|cleveland/.test(zf.properties.id))) || (lifeboat && lifeboat.d < 10) || !!nearSea(lat, lon);
        if (coastal) h += '<div class="bb-p-marine"><div class="bb-p-sub">Sea & tide (estimate)</div><div class="bb-sea">Loading…</div></div>';
        var help = nearest('rescue', lat, lon, function (p) { return /MRT|FRA|Rescue|SRT/.test(p.name); });
        var ae = nearest('rescue', lat, lon, function (p) { return /^A&E/.test(p.name); });
        var wat = nearest('water', lat, lon);
        h += '<div class="bb-p-near"><div class="bb-p-sub">Nearest</div>';
        [['⛑️', help], ['🏥', ae], ['💧', wat]].forEach(function (n) {
          if (n[1]) h += '<div>' + n[0] + ' ' + esc(n[1].f.properties.name) + ' <b>' + n[1].d.toFixed(1) + ' km ' + compass(n[1].b) + '</b></div>';
        });
        h += '<div class="bb-999">Emergency: <b>999</b>. Ask for <b>Police → Mountain Rescue</b> inland, or <b>Coastguard</b> at sea or on the coast. Give your OS grid reference' + (os ? ' (<b>' + os.ref + '</b>)' : '') + ', then stay put.</div></div>';
        if (D.info) {
          var I = D.info;
          h += '<details class="bb-p-info"><summary>Local alerts, radio & utilities</summary>'
            + (I.radio ? '<div><b>📻 Local radio (FM)</b><ul>' + I.radio.map(function (r) { return '<li>' + esc(r[0]) + ': ' + esc(r[1]) + '</li>'; }).join('') + '</ul></div>' : '')
            + (I.numbers ? '<div><b>☎️ Numbers</b><ul>' + I.numbers.map(function (r) { return '<li>' + esc(r[0]) + ': <b>' + esc(r[1]) + '</b></li>'; }).join('') + '</ul></div>' : '')
            + (I.notes ? '<div>' + I.notes.map(function (n) { return '<p>' + esc(n) + '</p>'; }).join('') + '</div>' : '')
            + '</details>';
        }
        panel.innerHTML = h; panel.classList.add('open');
        panel.querySelector('.bb-close').addEventListener('click', function () { panel.classList.remove('open'); });
        var cp = panel.querySelector('.bb-copy');
        if (cp) cp.addEventListener('click', function () {
          var txt = 'OS ' + os.ref + ' (' + lat.toFixed(5) + ', ' + lon.toFixed(5) + ')';
          var done = function () { cp.textContent = '✓ Copied'; };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { cp.textContent = txt; });
          else cp.textContent = txt;
        });
        panel.querySelector('.bb-print').addEventListener('click', function () {
          panel.querySelectorAll('details').forEach(function (d) { d.open = true; });
          container.classList.add('bb-printing'); global.print(); setTimeout(function () { container.classList.remove('bb-printing'); }, 500);
        });
        bindLife();
        loadFlood(lat, lon, my, panel.querySelector('.bb-fl'));
        if (coastal) loadMarine(lat, lon, my, panel.querySelector('.bb-sea'));

        // elevation + forecast (Open-Meteo)
        var elevEl = panel.querySelector('.bb-elev'), wxEl = panel.querySelector('.bb-wx');
        fetch('https://api.open-meteo.com/v1/elevation?latitude=' + lat.toFixed(4) + '&longitude=' + lon.toFixed(4))
          .then(function (r) { return r.json(); }).then(function (j) { if (my === reqId && j.elevation) elevEl.textContent = Math.round(j.elevation[0]) + ' m'; })
          .catch(function () { if (my === reqId) elevEl.textContent = 'offline'; });
        var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat.toFixed(4) + '&longitude=' + lon.toFixed(4)
          + '&current=temperature_2m,apparent_temperature,precipitation,snowfall,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m'
          + '&hourly=temperature_2m,precipitation_probability,precipitation&daily=sunrise,sunset,temperature_2m_min,temperature_2m_max&forecast_days=2&timezone=Europe%2FLondon&wind_speed_unit=kmh';
        fetch(url).then(function (r) { return r.json(); }).then(function (j) {
          if (my !== reqId) return;
          var c = j.current, d = j.daily, hr = j.hourly;
          var nowIdx = 0;
          if (hr && hr.time && c && c.time) { nowIdx = Math.max(0, hr.time.indexOf(c.time.slice(0, 13) + ':00')); }
          var hourly = hr ? { precipitation_probability: (hr.precipitation_probability || []).slice(nowIdx, nowIdx + 24), temperature_2m: (hr.temperature_2m || []).slice(nowIdx, nowIdx + 24) } : null;
          var adv = advisories(c, hourly);
          var bars = '';
          if (hourly && hourly.precipitation_probability.length) {
            bars = '<div class="bb-bars" title="Chance of rain, next 24 h">' + hourly.precipitation_probability.map(function (v, i) {
              return '<i style="height:' + Math.max(2, v) + '%" title="+' + i + 'h: ' + v + '%"></i>'; }).join('') + '</div><div class="bb-bars-l"><span>now</span><span>chance of rain, next 24 h</span><span>+24h</span></div>';
          }
          wxEl.innerHTML = '<div class="bb-wx-now"><b>' + Math.round(c.temperature_2m) + ' °C</b> <span>feels ' + Math.round(c.apparent_temperature) + ' °C</span> · ' + weatherText(c.weather_code) + '</div>'
            + '<div class="bb-wx-row">💨 ' + Math.round(c.wind_speed_10m) + ' km/h ' + compass(c.wind_direction_10m) + ' (gusts ' + Math.round(c.wind_gusts_10m) + ')'
            + (d ? ' · 🌅 ' + d.sunrise[0].slice(11) + ' · 🌇 ' + d.sunset[0].slice(11) + ' · ↕ ' + Math.round(d.temperature_2m_min[0]) + '…' + Math.round(d.temperature_2m_max[0]) + ' °C' : '') + '</div>'
            + bars + adv.map(function (a) { return '<div class="bb-adv bb-adv-' + a[0] + '">' + esc(a[1]) + '</div>'; }).join('')
            + '<small class="bb-src">Forecast: <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a> (CC BY 4.0)</small>';
        }).catch(function () { if (my === reqId) wxEl.innerHTML = '<div class="bb-adv bb-adv-info">Live weather unavailable offline. Use the zone climate summary above.</div>'; });
      }
      // ================= Planner tools =================
      var ELEV = 'https://api.open-meteo.com/v1/elevation';
      var plLayer = L.layerGroup().addTo(map);
      var FREQS = [['PMR446 (446 MHz)', 0.446, 0.5], ['2 m amateur (145 MHz)', 0.145, 5], ['70 cm amateur (433 MHz)', 0.433, 5], ['Meshtastic (869 MHz)', 0.869, 0.5], ['Marine VHF (156 MHz)', 0.156, 5]];
      function interp(a, b, f) { return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; }
      function samplePath(pts, n) { // pts [[lat,lon],...] -> n samples with cumulative km
        var seg = [], tot = 0; for (var i = 1; i < pts.length; i++) { var dd = haversine(pts[i - 1], pts[i]); seg.push(dd); tot += dd; }
        var out = []; for (var k = 0; k < n; k++) { var t = tot * k / (n - 1), acc = 0, j = 0; while (j < seg.length - 1 && acc + seg[j] < t) { acc += seg[j]; j++; }
          var f = seg[j] ? (t - acc) / seg[j] : 0; var p = interp(pts[j], pts[j + 1] || pts[j], Math.min(1, f)); out.push([p[0], p[1], t]); }
        return { pts: out, km: tot };
      }
      function elevations(samples) {
        var lat = samples.map(function (s) { return s[0].toFixed(5); }).join(','), lon = samples.map(function (s) { return s[1].toFixed(5); }).join(',');
        return fetch(ELEV + '?latitude=' + lat + '&longitude=' + lon).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) { return j.elevation; });
      }
      function openPanel(html) { ++reqId; panel.innerHTML = '<button class="bb-close" type="button" aria-label="Close">×</button>' + html; panel.classList.add('open');
        panel.querySelector('.bb-close').addEventListener('click', function () { panel.classList.remove('open'); stopPlanner(); }); }
      function stopPlanner() { planner = null; plLayer.clearLayers(); [losBtn, rteBtn, relBtn].forEach(function (b) { b.classList.remove('on'); }); container.classList.remove('bb-planning'); }
      function profileSVG(km, terr, line, fres) {
        var W = 300, H = 110, all = terr.concat(line), mn = Math.min.apply(null, terr) - 20, mx = Math.max.apply(null, all) + 20;
        function X(i) { return (i / (terr.length - 1) * W).toFixed(1); } function Y(v) { return (H - (v - mn) / (mx - mn) * H).toFixed(1); }
        var t = 'M0 ' + H + ' ' + terr.map(function (v, i) { return 'L' + X(i) + ' ' + Y(v); }).join(' ') + ' L' + W + ' ' + H + ' Z';
        var ln = 'M' + X(0) + ' ' + Y(line[0]) + ' L' + X(line.length - 1) + ' ' + Y(line[line.length - 1]);
        var fz = fres ? 'M' + fres.map(function (v, i) { return X(i) + ' ' + Y(v); }).join(' L') : '';
        return '<svg viewBox="0 0 ' + W + ' ' + (H + 14) + '" class="bb-prof" role="img" aria-label="Elevation profile"><path d="' + t + '" fill="#5b4a33" opacity=".85"/>' + (fz ? '<path d="M' + fz.slice(1) + '" stroke="#f59e0b" stroke-dasharray="3 3" fill="none" stroke-width="1"/>' : '') +
          (line.length ? '<path d="' + ln + '" stroke="#4fc3f7" stroke-width="2" fill="none"/>' : '') + '<text x="0" y="' + (H + 12) + '" fill="#a9b0a8" font-size="10">0 km</text><text x="' + W + '" y="' + (H + 12) + '" fill="#a9b0a8" font-size="10" text-anchor="end">' + km.toFixed(1) + ' km</text>' +
          '<text x="2" y="10" fill="#a9b0a8" font-size="9">' + Math.round(mx) + ' m</text><text x="2" y="' + (H - 3) + '" fill="#a9b0a8" font-size="9">' + Math.round(mn) + ' m</text></svg>';
      }
      // ---- Line of sight
      function startLOS() {
        stopPlanner(); losBtn.classList.add('on'); container.classList.add('bb-planning');
        var pts = [], hA = 1.5, hB = 1.5, fi = 0;
        openPanel('<div class="bb-p-sub">📡 Radio line of sight</div><p>Tap <b>two points</b> on the map: your position and the other radio. The tool checks whether terrain (and the curve of the Earth) blocks the path.</p>');
        planner = { click: function (ll) {
          if (pts.length >= 2) { pts = []; plLayer.clearLayers(); }
          pts.push([ll.lat, ll.lng]); L.circleMarker(ll, { radius: 6, color: '#fff', weight: 2, fillColor: '#4fc3f7', fillOpacity: 1 }).addTo(plLayer);
          if (pts.length === 2) { L.polyline(pts, { color: '#4fc3f7', weight: 3, dashArray: '6 6' }).addTo(plLayer); run(); }
          return true; } };
        function run() {
          var sp = samplePath(pts, 90);
          openPanel('<div class="bb-p-sub">📡 Radio line of sight</div><div class="bb-los">Fetching terrain profile…</div>'); var my = reqId;
          elevations(sp.pts).then(function (el) { if (my !== reqId) return; draw(sp, el); }).catch(function () { if (my === reqId) panel.querySelector('.bb-los').textContent = 'Terrain data needs a connection.'; });
        }
        function draw(sp, el) {
          var D2 = sp.km, f = FREQS[fi], a0 = el[0] + hA, a1 = el[el.length - 1] + hB, worst = null, line = [], fres = [], terr = [];
          for (var i = 0; i < el.length; i++) {
            var x = sp.pts[i][2], bulge = x * (D2 - x) / 17.0, lh = a0 + (a1 - a0) * (x / (D2 || 1)), F1 = 17.32 * Math.sqrt(Math.max(0, x * (D2 - x)) / (f[1] * (D2 || 1)));
            terr.push(el[i] + bulge); line.push(lh); fres.push(lh - 0.6 * F1);
            var clr = lh - (el[i] + bulge); if (i > 0 && i < el.length - 1 && (worst === null || clr - 0.6 * F1 < worst.c)) worst = { c: clr - 0.6 * F1, raw: clr, km: x, i: i };
          }
          var blocked = worst && worst.raw < 0, marginal = worst && !blocked && worst.c < 0;
          var verdict = blocked ? '<div class="bb-adv bb-adv-danger">⛰️ <b>Blocked</b>: terrain is ' + Math.round(-worst.raw) + ' m above the line ' + worst.km.toFixed(1) + ' km from A. Move higher, or use a relay on a hill with a view of both.</div>'
            : marginal ? '<div class="bb-adv bb-adv-warn">⚠️ <b>Marginal</b>: the line just clears the ground ' + worst.km.toFixed(1) + ' km from A. Expect weak, patchy signals; gain a few metres of height.</div>'
            : '<div class="bb-adv bb-adv-ok">✅ <b>Clear line of sight</b> (' + D2.toFixed(1) + ' km). Range is then limited by power, antennas and trees and buildings.</div>';
          if (worst && (blocked || marginal)) L.circleMarker(sp.pts[worst.i].slice(0, 2), { radius: 7, color: '#dc3c32', weight: 3, fillOpacity: 0 }).addTo(plLayer);
          var rangeNote = D2 <= 3 ? 'Within normal PMR446 range.' : D2 <= 10 ? 'PMR446 possible with clear line of sight; Meshtastic and 2 m comfortable.' : D2 <= 40 ? 'Beyond PMR446. Meshtastic hilltop links, 2 m/70 cm (licensed) or CB work with clear line of sight.' : 'Long path: licensed VHF/UHF with good antennas, a relay, or HF NVIS.';
          openPanel('<div class="bb-p-sub">📡 Radio line of sight · ' + D2.toFixed(1) + ' km ' + compass(bearing(pts[0], pts[1])) + '</div>' + verdict +
            profileSVG(D2, terr, line, fres) +
            '<div class="bb-row2"><label>Radio <select class="los-f">' + FREQS.map(function (q, k) { return '<option value="' + k + '"' + (k === fi ? ' selected' : '') + '>' + q[0] + '</option>'; }).join('') + '</select></label>' +
            '<label>Height A <select class="los-a">' + [1.5, 3, 6, 10].map(function (h) { return '<option' + (h === hA ? ' selected' : '') + '>' + h + '</option>'; }).join('') + '</select> m</label>' +
            '<label>Height B <select class="los-b">' + [1.5, 3, 6, 10].map(function (h) { return '<option' + (h === hB ? ' selected' : '') + '>' + h + '</option>'; }).join('') + '</select> m</label></div>' +
            '<p class="bb-small">' + rangeNote + ' Ground: A ' + Math.round(el[0]) + ' m, B ' + Math.round(el[el.length - 1]) + ' m. Brown = terrain incl. Earth curvature (k = 4/3); blue = radio path; dashed = 60% Fresnel clearance needed for a solid link.</p>' +
            '<p class="bb-small">Elevation: Copernicus DEM via Open-Meteo (90 m grid). Trees, buildings and weather are not modelled. Tap two new points to try again.</p>');
          ['los-f', 'los-a', 'los-b'].forEach(function (c) { panel.querySelector('.' + c).addEventListener('change', function (e) { if (c === 'los-f') fi = +e.target.value; if (c === 'los-a') hA = +e.target.value; if (c === 'los-b') hB = +e.target.value; draw(sp, el); }); });
        }
      }
      // ---- Route check
      function startRoute() {
        stopPlanner(); rteBtn.classList.add('on'); container.classList.add('bb-planning');
        var pts = [], line = null;
        function intro() { openPanel('<div class="bb-p-sub">🥾 Route check</div><p>Tap points along your planned route (' + pts.length + ' so far). Then press <b>Analyse</b>.</p><div class="bb-p-tools"><button class="bb-mini r-go"' + (pts.length < 2 ? ' disabled' : '') + '>Analyse route</button><button class="bb-mini r-undo">Undo point</button><button class="bb-mini r-clr">Clear</button></div>');
          panel.querySelector('.r-go').onclick = analyse; panel.querySelector('.r-undo').onclick = function () { pts.pop(); redraw(); intro(); }; panel.querySelector('.r-clr').onclick = function () { pts = []; redraw(); intro(); }; }
        function redraw() { plLayer.clearLayers(); pts.forEach(function (p, i) { L.circleMarker(p, { radius: 5, color: '#fff', weight: 2, fillColor: i ? '#f59e0b' : '#3fae5a', fillOpacity: 1 }).addTo(plLayer); }); if (pts.length > 1) line = L.polyline(pts, { color: '#f59e0b', weight: 4 }).addTo(plLayer); }
        planner = { click: function (ll) { pts.push([ll.lat, ll.lng]); redraw(); intro(); return true; } };
        intro();
        function analyse() {
          var sp = samplePath(pts, Math.min(100, Math.max(20, Math.round(haversine(pts[0], pts[pts.length - 1]) * 6))));
          openPanel('<div class="bb-p-sub">🥾 Route check</div><p>Fetching elevation…</p>'); var my = reqId;
          elevations(sp.pts).then(function (el) {
            if (my !== reqId) return;
            var up = 0, down = 0, sm = el.map(function (v, i) { return (el[Math.max(0, i - 1)] + v + el[Math.min(el.length - 1, i + 1)]) / 3; });
            for (var i = 1; i < sm.length; i++) { var dz = sm[i] - sm[i - 1]; if (dz > 0) up += dz; else down -= dz; }
            var hrs = sp.km / 5 + up / 600, hrsW = sp.km / 4 + up / 450;
            var hz = [], seen = {};
            D.points.features.forEach(function (f) { var c = f.properties.cat; if (c !== 'flood' && c !== 'hazard') return; var ll = [f.geometry.coordinates[1], f.geometry.coordinates[0]];
              for (var k = 0; k < sp.pts.length; k += 2) { var dd = haversine(ll, sp.pts[k]); if (dd < (c === 'flood' ? 1.5 : 1.0)) { if (!seen[f.properties.name]) { seen[f.properties.name] = 1; hz.push([c, f.properties.name, f.properties.note || '', dd]); } break; } } });
            var mid = sp.pts[Math.floor(sp.pts.length / 2)], resc = nearest('rescue', mid[0], mid[1], function (p) { return /MRT|FRA\b|SRT\b|Mountain Rescue|Fell Rescue|Cave Rescue|Search (and|&) Rescue|SAR\b/i.test(p.name) && !/^RNLI|^A&E/.test(p.name); });
            var s0 = osGridRef(pts[0][0], pts[0][1]), s1 = osGridRef(pts[pts.length - 1][0], pts[pts.length - 1][1]), hi = Math.max.apply(null, el);
            var t = sunTimes(new Date(), pts[0][0], pts[0][1]);
            var html = '<div class="bb-route-card"><div class="bb-p-sub">🥾 Route card</div>' +
              '<table class="bb-rt"><tr><td>Start</td><td><b>' + (s0 ? 'OS ' + s0.ref : pts[0][0].toFixed(4) + ', ' + pts[0][1].toFixed(4)) + '</b></td></tr><tr><td>Finish</td><td><b>' + (s1 ? 'OS ' + s1.ref : '') + '</b></td></tr>' +
              '<tr><td>Distance</td><td><b>' + sp.km.toFixed(1) + ' km</b> (straight legs between your points)</td></tr><tr><td>Ascent / descent</td><td><b>' + Math.round(up) + ' m / ' + Math.round(down) + ' m</b>; high point ' + Math.round(hi) + ' m</td></tr>' +
              '<tr><td>Time (Naismith)</td><td><b>' + Math.floor(hrs) + 'h ' + Math.round((hrs % 1) * 60) + 'm</b> fit walker · <b>' + Math.floor(hrsW) + 'h ' + Math.round((hrsW % 1) * 60) + 'm</b> with a pack, children or in winter. Add rests.</td></tr>' +
              '<tr><td>Daylight today</td><td>Sunset ' + hm(t.sunset) + ', last light ' + hm(t.dusk) + '</td></tr>' +
              '<tr><td>Nearest MRT</td><td>' + (resc && resc.d < 80 ? esc(resc.f.properties.name) + ' (' + resc.d.toFixed(0) + ' km from midpoint)' : 'None on this map. Call 999 and ask for Police, then Mountain Rescue') + '</td></tr></table>' +
              profileSVG(sp.km, el, [], null) +
              (hz.length ? hz.map(function (h) { return '<div class="bb-adv bb-adv-' + (h[0] === 'flood' ? 'warn' : 'danger') + '">' + (h[0] === 'flood' ? '🌊 Near a flood-prone area: ' : '⚠️ Hazard near route: ') + '<b>' + esc(h[1]) + '</b>' + (h[2] ? ' (' + esc(h[2]) + ')' : '') + '</div>'; }).join('') : '<div class="bb-adv bb-adv-ok">No mapped flood areas or hazards within 1–1.5 km of the route.</div>') +
              '<div class="bb-small" style="margin-top:8px">Escape route: ____________________ · Leave this card with: ____________________ · Expected back: ________</div>' +
              '<p class="bb-small">Check live flood warnings and the forecast before you go. Naismith: 5 km/h plus 1 hour per 600 m of ascent; slower variant 4 km/h plus 1 h per 450 m.</p>' +
              '<div class="bb-p-tools"><button class="bb-mini r-print">🖨️ Print route card</button><button class="bb-mini r-new">New route</button></div></div>';
            openPanel(html);
            panel.querySelector('.r-print').onclick = function () { container.classList.add('bb-printing'); window.print(); setTimeout(function () { container.classList.remove('bb-printing'); }, 500); };
            panel.querySelector('.r-new').onclick = function () { pts = []; redraw(); intro(); };
          }).catch(function () { if (my === reqId) openPanel('<div class="bb-p-sub">🥾 Route check</div><p>Elevation data needs a connection. Distance: ' + sp.km.toFixed(1) + ' km ≈ ' + (sp.km / 4).toFixed(1) + ' h at 4 km/h on the flat.</p>'); });
        }
      }
      // ---- Relay hills
      function startRelay() {
        stopPlanner(); relBtn.classList.add('on');
        var hills = D.points.features.filter(function (f) { return f.properties.cat === 'summit' && f.properties.elev; }).sort(function (a, b) { return b.properties.elev - a.properties.elev; });
        var rows = hills.map(function (f) { var h = f.properties.elev, rel = Math.max(50, h - 150), km = Math.min(90, 4.12 * (Math.sqrt(rel) + Math.sqrt(1.5)));
          var ll = [f.geometry.coordinates[1], f.geometry.coordinates[0]];
          L.circle(ll, { radius: km * 1000, color: '#4fc3f7', weight: 1, fillColor: '#4fc3f7', fillOpacity: 0.06, dashArray: '4 6' }).addTo(plLayer);
          L.circleMarker(ll, { radius: 7, color: '#fff', weight: 2, fillColor: '#4fc3f7', fillOpacity: 1 }).bindTooltip(esc(f.properties.name)).addTo(plLayer);
          return '<tr><td>' + esc(f.properties.name) + '</td><td class="bb-num">' + h + ' m</td><td class="bb-num">≤ ' + Math.round(km) + ' km</td></tr>'; });
        openPanel('<div class="bb-p-sub">📶 Relay hills</div><p>High, prominent summits make the best relay or mesh-node sites. Circles show the <b>theoretical radio horizon</b> to a handheld in the valleys (≈150 m below the hill), so the real range is lower wherever other hills are in the way. Use <b>Line of sight</b> to test a specific path.</p>' +
          '<table class="bb-rt"><tr><th>Summit</th><th class="bb-num">Height</th><th class="bb-num">Horizon</th></tr>' + rows.join('') + '</table>' +
          '<p class="bb-small">Only transmit with a licence or on licence-free kit (PMR446, Meshtastic). A solar Meshtastic node in a weatherproof box needs the landowner\'s permission. See Signals & Radio.</p>');
        if (hills.length) map.fitBounds(L.latLngBounds(hills.map(function (f) { return [f.geometry.coordinates[1], f.geometry.coordinates[0]]; })).pad(0.5));
      }
      losBtn.addEventListener('click', function () { if (losBtn.classList.contains('on')) { stopPlanner(); panel.classList.remove('open'); } else startLOS(); });
      rteBtn.addEventListener('click', function () { if (rteBtn.classList.contains('on')) { stopPlanner(); panel.classList.remove('open'); } else startRoute(); });
      relBtn.addEventListener('click', function () { if (relBtn.classList.contains('on')) { stopPlanner(); panel.classList.remove('open'); } else startRelay(); });

      // sun & moon chip for the map centre
      var smChip = el('div', 'bb-sunchip'); container.appendChild(smChip);
      function updSun() { var c = map.getCenter ? map.getCenter() : { lat: D.center[0], lng: D.center[1] }; var t = sunTimes(new Date(), c.lat, c.lng), m = moonInfo(new Date());
        smChip.innerHTML = '🌅 ' + hm(t.sunrise) + ' · 🌇 ' + hm(t.sunset) + ' · ' + m.icon + ' ' + Math.round(m.fraction * 100) + '%'; smChip.title = m.name + '. Last light ' + hm(t.dusk); }
      updSun(); if (map.on) map.on('moveend', updSun);

      api.showPoint = showPoint;
      api.startLOS = startLOS; api.startRoute = startRoute; api.startRelay = startRelay; api._planner = function () { return planner; };
      api.state = state;
      api.setMode = function (m) { state.mode = m; restyleZones(); };
      api.setMonth = function (m) { slider.value = m; slider.dispatchEvent(new Event('input')); };
    }
  }

  // ------------------------------------------------------------------ UK hub map
  function mountHub(container, opts) {
    opts = opts || {};
    container.classList.add('bb-map-root', 'bb-hub');
    var mapEl = el('div', 'bb-map-canvas'); container.appendChild(mapEl);
    var load = opts.data && typeof opts.data === 'object' ? Promise.resolve(opts.data) : fetch(opts.data).then(function (r) { return r.json(); });
    return load.then(function (D) {
      var map = L.map(mapEl, { scrollWheelZoom: false, minZoom: 5, maxZoom: 9 }).setView([54.6, -3.2], 5);
      L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17, subdomains: 'abc',
        attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Style © OpenTopoMap (CC-BY-SA)' }).addTo(map);
      D.regions.forEach(function (r) {
        var live = r.status === 'live';
        var m = L.marker([r.lat, r.lon], { icon: L.divIcon({ className: 'bb-hub-pin' + (live ? ' live' : ''), html: '<span>' + esc(r.name) + '</span>', iconSize: null }), title: r.name }).addTo(map);
        m.bindPopup('<div class="bb-pop"><div class="bb-pop-title">' + esc(r.name) + '</div>' + (live ? '<p><a class="bb-go" href="' + esc(r.url) + '">Open the ' + esc(r.name) + ' survival map →</a></p>' : '<p>Coming soon.</p>') + '</div>');
      });
      return { map: map };
    });
  }

  global.BunkerRegionMap = { mount: mount, mountHub: mountHub, _osGridRef: osGridRef, _advisories: advisories, _sunTimes: sunTimes, _moon: moonInfo };

  // Auto-mount any <div class="bb-map" data-src="..."> (add data-hub for the UK overview).
  function autoInit() {
    if (!global.L) return;
    var nodes = document.querySelectorAll('.bb-map[data-src]:not([data-bb-mounted])');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i]; n.setAttribute('data-bb-mounted', '1');
      (n.hasAttribute('data-hub') ? mountHub : mount)(n, { data: n.getAttribute('data-src') });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoInit); else autoInit();
  global.BunkerRegionMap.init = autoInit;
})(window);
