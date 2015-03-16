/* */ 
"format cjs";
(function(process) {
  (function(factory) {
    if (typeof define === 'function' && define.amd) {
      define(["moment"], factory);
    } else if (typeof exports === 'object') {
      module.exports = factory(require("../moment"));
    } else {
      factory((typeof global !== 'undefined' ? global : this).moment);
    }
  }(function(moment) {
    function processRelativeTime(number, withoutSuffix, key, isFuture) {
      var format = {
        'm': ['eng Minutt', 'enger Minutt'],
        'h': ['eng Stonn', 'enger Stonn'],
        'd': ['een Dag', 'engem Dag'],
        'M': ['ee Mount', 'engem Mount'],
        'y': ['ee Joer', 'engem Joer']
      };
      return withoutSuffix ? format[key][0] : format[key][1];
    }
    function processFutureTime(string) {
      var number = string.substr(0, string.indexOf(' '));
      if (eifelerRegelAppliesToNumber(number)) {
        return 'a ' + string;
      }
      return 'an ' + string;
    }
    function processPastTime(string) {
      var number = string.substr(0, string.indexOf(' '));
      if (eifelerRegelAppliesToNumber(number)) {
        return 'viru ' + string;
      }
      return 'virun ' + string;
    }
    function eifelerRegelAppliesToNumber(number) {
      number = parseInt(number, 10);
      if (isNaN(number)) {
        return false;
      }
      if (number < 0) {
        return true;
      } else if (number < 10) {
        if (4 <= number && number <= 7) {
          return true;
        }
        return false;
      } else if (number < 100) {
        var lastDigit = number % 10,
            firstDigit = number / 10;
        if (lastDigit === 0) {
          return eifelerRegelAppliesToNumber(firstDigit);
        }
        return eifelerRegelAppliesToNumber(lastDigit);
      } else if (number < 10000) {
        while (number >= 10) {
          number = number / 10;
        }
        return eifelerRegelAppliesToNumber(number);
      } else {
        number = number / 1000;
        return eifelerRegelAppliesToNumber(number);
      }
    }
    return moment.defineLocale('lb', {
      months: 'Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
      monthsShort: 'Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
      weekdays: 'Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg'.split('_'),
      weekdaysShort: 'So._Mé._Dë._Më._Do._Fr._Sa.'.split('_'),
      weekdaysMin: 'So_Mé_Dë_Më_Do_Fr_Sa'.split('_'),
      longDateFormat: {
        LT: 'H:mm [Auer]',
        LTS: 'H:mm:ss [Auer]',
        L: 'DD.MM.YYYY',
        LL: 'D. MMMM YYYY',
        LLL: 'D. MMMM YYYY LT',
        LLLL: 'dddd, D. MMMM YYYY LT'
      },
      calendar: {
        sameDay: '[Haut um] LT',
        sameElse: 'L',
        nextDay: '[Muer um] LT',
        nextWeek: 'dddd [um] LT',
        lastDay: '[Gëschter um] LT',
        lastWeek: function() {
          switch (this.day()) {
            case 2:
            case 4:
              return '[Leschten] dddd [um] LT';
            default:
              return '[Leschte] dddd [um] LT';
          }
        }
      },
      relativeTime: {
        future: processFutureTime,
        past: processPastTime,
        s: 'e puer Sekonnen',
        m: processRelativeTime,
        mm: '%d Minutten',
        h: processRelativeTime,
        hh: '%d Stonnen',
        d: processRelativeTime,
        dd: '%d Deeg',
        M: processRelativeTime,
        MM: '%d Méint',
        y: processRelativeTime,
        yy: '%d Joer'
      },
      ordinalParse: /\d{1,2}\./,
      ordinal: '%d.',
      week: {
        dow: 1,
        doy: 4
      }
    });
  }));
})(require("process"));
