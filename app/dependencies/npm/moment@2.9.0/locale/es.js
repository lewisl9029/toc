/* */ 
"format cjs";
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(["moment"], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require("../moment"));
  } else {
    factory((typeof global !== 'undefined' ? global : this).moment);
  }
}(function(moment) {
  var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
      monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');
  return moment.defineLocale('es', {
    months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
    monthsShort: function(m, format) {
      if (/-MMM-/.test(format)) {
        return monthsShort[m.month()];
      } else {
        return monthsShortDot[m.month()];
      }
    },
    weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_'),
    longDateFormat: {
      LT: 'H:mm',
      LTS: 'LT:ss',
      L: 'DD/MM/YYYY',
      LL: 'D [de] MMMM [de] YYYY',
      LLL: 'D [de] MMMM [de] YYYY LT',
      LLLL: 'dddd, D [de] MMMM [de] YYYY LT'
    },
    calendar: {
      sameDay: function() {
        return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
      },
      nextDay: function() {
        return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
      },
      nextWeek: function() {
        return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
      },
      lastDay: function() {
        return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
      },
      lastWeek: function() {
        return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
      },
      sameElse: 'L'
    },
    relativeTime: {
      future: 'en %s',
      past: 'hace %s',
      s: 'unos segundos',
      m: 'un minuto',
      mm: '%d minutos',
      h: 'una hora',
      hh: '%d horas',
      d: 'un día',
      dd: '%d días',
      M: 'un mes',
      MM: '%d meses',
      y: 'un año',
      yy: '%d años'
    },
    ordinalParse: /\d{1,2}º/,
    ordinal: '%dº',
    week: {
      dow: 1,
      doy: 4
    }
  });
}));
