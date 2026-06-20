/* =========================================
   THE LAST LIGHT SURVIVAL GUIDE
   tools.js — Shared utility functions
   Used by tools.html calculators
   ========================================= */

(function () {
  'use strict';

  window.survivalTools = {

    /* ── Calorie / BMR ── */
    calcBMR: function (weight_kg, height_cm, age, sex) {
      /* Mifflin-St Jeor equation */
      var base = (10 * weight_kg) + (6.25 * height_cm) - (5 * age);
      return sex === 'male' ? base + 5 : base - 161;
    },

    calcDailyCalories: function (bmr, activityLevel) {
      var multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
      return bmr * (multipliers[activityLevel] || 1.375);
    },

    /* ── Water ── */
    calcWaterLiters: function (people, climate, activity) {
      var climateM = { cold: 0.8, temperate: 1.0, hot: 1.5, desert: 2.0 };
      var actM     = { rest: 0.7, light: 1.0, moderate: 1.4, heavy: 1.8 };
      return people * 2.5 * (climateM[climate] || 1.0) * (actM[activity] || 1.0);
    },

    /* ── Solar ── */
    calcSolarWattHours: function (loads) {
      return loads.reduce(function (sum, l) { return sum + (l.watts * l.hours); }, 0);
    },

    calcPanelSize: function (dailyWh, sunHours, efficiency) {
      return dailyWh / (sunHours * (efficiency || 0.8));
    },

    calcBatteryAh: function (dailyWh, voltage, dod, days) {
      return (dailyWh * days) / (voltage * (dod || 0.5));
    },

    /* ── Supply tracking ── */
    calcDaysRemaining: function (qty, dailyUse) {
      if (!dailyUse || dailyUse === 0) return Infinity;
      return Math.floor(qty / dailyUse);
    },

    daysColor: function (days) {
      if (days >= 90)  return 'green';
      if (days >= 30)  return 'amber';
      if (days >= 7)   return 'orange';
      return 'red';
    },

    /* ── Formatting ── */
    formatNumber: function (n) {
      return Math.round(n).toLocaleString();
    },

    formatDays: function (days) {
      if (!isFinite(days)) return '∞';
      if (days >= 365) return Math.floor(days / 365) + ' yr ' + Math.floor((days % 365) / 30) + ' mo';
      if (days >= 30)  return Math.floor(days / 30) + ' mo ' + (days % 30) + ' d';
      return days + ' days';
    },

    /* ── localStorage helpers ── */
    save: function (key, data) {
      try { localStorage.setItem(key, JSON.stringify(data)); return true; }
      catch (e) { return false; }
    },

    load: function (key, fallback) {
      try {
        var raw = localStorage.getItem(key);
        return raw !== null ? JSON.parse(raw) : fallback;
      } catch (e) { return fallback; }
    },

    remove: function (key) {
      try { localStorage.removeItem(key); } catch (e) {}
    },

    /* ── CSV export ── */
    downloadCSV: function (filename, rows, headers) {
      var lines = [headers.join(',')].concat(rows.map(function (r) {
        return r.map(function (cell) {
          var s = String(cell).replace(/"/g, '""');
          return s.indexOf(',') >= 0 ? '"' + s + '"' : s;
        }).join(',');
      }));
      var blob = new Blob([lines.join('\n')], { type: 'text/csv' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    }
  };

})();
