"format register";



System.register("github:angular/bower-angular@1.3.8/angular.min", [], false, function(__require, __exports, __module) {
  System.get("@@global-helpers").prepareGlobal(__module.id, []);
  (function() {
    "format global";
    "exports angular";
    (function(M, Y, t) {
      'use strict';
      function T(b) {
        return function() {
          var a = arguments[0],
              c;
          c = "[" + (b ? b + ":" : "") + a + "] http://errors.angularjs.org/1.3.8/" + (b ? b + "/" : "") + a;
          for (a = 1; a < arguments.length; a++) {
            c = c + (1 == a ? "?" : "&") + "p" + (a - 1) + "=";
            var d = encodeURIComponent,
                e;
            e = arguments[a];
            e = "function" == typeof e ? e.toString().replace(/ \{[\s\S]*$/, "") : "undefined" == typeof e ? "undefined" : "string" != typeof e ? JSON.stringify(e) : e;
            c += d(e);
          }
          return Error(c);
        };
      }
      function Ta(b) {
        if (null == b || Ua(b))
          return !1;
        var a = b.length;
        return b.nodeType === na && a ? !0 : F(b) || x(b) || 0 === a || "number" === typeof a && 0 < a && a - 1 in b;
      }
      function s(b, a, c) {
        var d,
            e;
        if (b)
          if (G(b))
            for (d in b)
              "prototype" == d || "length" == d || "name" == d || b.hasOwnProperty && !b.hasOwnProperty(d) || a.call(c, b[d], d, b);
          else if (x(b) || Ta(b)) {
            var f = "object" !== typeof b;
            d = 0;
            for (e = b.length; d < e; d++)
              (f || d in b) && a.call(c, b[d], d, b);
          } else if (b.forEach && b.forEach !== s)
            b.forEach(a, c, b);
          else
            for (d in b)
              b.hasOwnProperty(d) && a.call(c, b[d], d, b);
        return b;
      }
      function Ed(b, a, c) {
        for (var d = Object.keys(b).sort(),
            e = 0; e < d.length; e++)
          a.call(c, b[d[e]], d[e]);
        return d;
      }
      function kc(b) {
        return function(a, c) {
          b(c, a);
        };
      }
      function Fd() {
        return ++nb;
      }
      function lc(b, a) {
        a ? b.$$hashKey = a : delete b.$$hashKey;
      }
      function z(b) {
        for (var a = b.$$hashKey,
            c = 1,
            d = arguments.length; c < d; c++) {
          var e = arguments[c];
          if (e)
            for (var f = Object.keys(e),
                g = 0,
                h = f.length; g < h; g++) {
              var l = f[g];
              b[l] = e[l];
            }
        }
        lc(b, a);
        return b;
      }
      function ba(b) {
        return parseInt(b, 10);
      }
      function C() {}
      function oa(b) {
        return b;
      }
      function da(b) {
        return function() {
          return b;
        };
      }
      function D(b) {
        return "undefined" === typeof b;
      }
      function y(b) {
        return "undefined" !== typeof b;
      }
      function H(b) {
        return null !== b && "object" === typeof b;
      }
      function F(b) {
        return "string" === typeof b;
      }
      function V(b) {
        return "number" === typeof b;
      }
      function pa(b) {
        return "[object Date]" === Da.call(b);
      }
      function G(b) {
        return "function" === typeof b;
      }
      function ob(b) {
        return "[object RegExp]" === Da.call(b);
      }
      function Ua(b) {
        return b && b.window === b;
      }
      function Va(b) {
        return b && b.$evalAsync && b.$watch;
      }
      function Wa(b) {
        return "boolean" === typeof b;
      }
      function mc(b) {
        return !(!b || !(b.nodeName || b.prop && b.attr && b.find));
      }
      function Gd(b) {
        var a = {};
        b = b.split(",");
        var c;
        for (c = 0; c < b.length; c++)
          a[b[c]] = !0;
        return a;
      }
      function ua(b) {
        return Q(b.nodeName || b[0] && b[0].nodeName);
      }
      function Xa(b, a) {
        var c = b.indexOf(a);
        0 <= c && b.splice(c, 1);
        return a;
      }
      function Ea(b, a, c, d) {
        if (Ua(b) || Va(b))
          throw Ka("cpws");
        if (a) {
          if (b === a)
            throw Ka("cpi");
          c = c || [];
          d = d || [];
          if (H(b)) {
            var e = c.indexOf(b);
            if (-1 !== e)
              return d[e];
            c.push(b);
            d.push(a);
          }
          if (x(b))
            for (var f = a.length = 0; f < b.length; f++)
              e = Ea(b[f], null, c, d), H(b[f]) && (c.push(b[f]), d.push(e)), a.push(e);
          else {
            var g = a.$$hashKey;
            x(a) ? a.length = 0 : s(a, function(b, c) {
              delete a[c];
            });
            for (f in b)
              b.hasOwnProperty(f) && (e = Ea(b[f], null, c, d), H(b[f]) && (c.push(b[f]), d.push(e)), a[f] = e);
            lc(a, g);
          }
        } else if (a = b)
          x(b) ? a = Ea(b, [], c, d) : pa(b) ? a = new Date(b.getTime()) : ob(b) ? (a = new RegExp(b.source, b.toString().match(/[^\/]*$/)[0]), a.lastIndex = b.lastIndex) : H(b) && (e = Object.create(Object.getPrototypeOf(b)), a = Ea(b, e, c, d));
        return a;
      }
      function qa(b, a) {
        if (x(b)) {
          a = a || [];
          for (var c = 0,
              d = b.length; c < d; c++)
            a[c] = b[c];
        } else if (H(b))
          for (c in a = a || {}, b)
            if ("$" !== c.charAt(0) || "$" !== c.charAt(1))
              a[c] = b[c];
        return a || b;
      }
      function fa(b, a) {
        if (b === a)
          return !0;
        if (null === b || null === a)
          return !1;
        if (b !== b && a !== a)
          return !0;
        var c = typeof b,
            d;
        if (c == typeof a && "object" == c)
          if (x(b)) {
            if (!x(a))
              return !1;
            if ((c = b.length) == a.length) {
              for (d = 0; d < c; d++)
                if (!fa(b[d], a[d]))
                  return !1;
              return !0;
            }
          } else {
            if (pa(b))
              return pa(a) ? fa(b.getTime(), a.getTime()) : !1;
            if (ob(b) && ob(a))
              return b.toString() == a.toString();
            if (Va(b) || Va(a) || Ua(b) || Ua(a) || x(a))
              return !1;
            c = {};
            for (d in b)
              if ("$" !== d.charAt(0) && !G(b[d])) {
                if (!fa(b[d], a[d]))
                  return !1;
                c[d] = !0;
              }
            for (d in a)
              if (!c.hasOwnProperty(d) && "$" !== d.charAt(0) && a[d] !== t && !G(a[d]))
                return !1;
            return !0;
          }
        return !1;
      }
      function Ya(b, a, c) {
        return b.concat(Za.call(a, c));
      }
      function nc(b, a) {
        var c = 2 < arguments.length ? Za.call(arguments, 2) : [];
        return !G(a) || a instanceof RegExp ? a : c.length ? function() {
          return arguments.length ? a.apply(b, Ya(c, arguments, 0)) : a.apply(b, c);
        } : function() {
          return arguments.length ? a.apply(b, arguments) : a.call(b);
        };
      }
      function Hd(b, a) {
        var c = a;
        "string" === typeof b && "$" === b.charAt(0) && "$" === b.charAt(1) ? c = t : Ua(a) ? c = "$WINDOW" : a && Y === a ? c = "$DOCUMENT" : Va(a) && (c = "$SCOPE");
        return c;
      }
      function $a(b, a) {
        if ("undefined" === typeof b)
          return t;
        V(a) || (a = a ? 2 : null);
        return JSON.stringify(b, Hd, a);
      }
      function oc(b) {
        return F(b) ? JSON.parse(b) : b;
      }
      function va(b) {
        b = B(b).clone();
        try {
          b.empty();
        } catch (a) {}
        var c = B("<div>").append(b).html();
        try {
          return b[0].nodeType === pb ? Q(c) : c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function(a, b) {
            return "<" + Q(b);
          });
        } catch (d) {
          return Q(c);
        }
      }
      function pc(b) {
        try {
          return decodeURIComponent(b);
        } catch (a) {}
      }
      function qc(b) {
        var a = {},
            c,
            d;
        s((b || "").split("&"), function(b) {
          b && (c = b.replace(/\+/g, "%20").split("="), d = pc(c[0]), y(d) && (b = y(c[1]) ? pc(c[1]) : !0, rc.call(a, d) ? x(a[d]) ? a[d].push(b) : a[d] = [a[d], b] : a[d] = b));
        });
        return a;
      }
      function Nb(b) {
        var a = [];
        s(b, function(b, d) {
          x(b) ? s(b, function(b) {
            a.push(Fa(d, !0) + (!0 === b ? "" : "=" + Fa(b, !0)));
          }) : a.push(Fa(d, !0) + (!0 === b ? "" : "=" + Fa(b, !0)));
        });
        return a.length ? a.join("&") : "";
      }
      function qb(b) {
        return Fa(b, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+");
      }
      function Fa(b, a) {
        return encodeURIComponent(b).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%20/g, a ? "%20" : "+");
      }
      function Id(b, a) {
        var c,
            d,
            e = rb.length;
        b = B(b);
        for (d = 0; d < e; ++d)
          if (c = rb[d] + a, F(c = b.attr(c)))
            return c;
        return null;
      }
      function Jd(b, a) {
        var c,
            d,
            e = {};
        s(rb, function(a) {
          a += "app";
          !c && b.hasAttribute && b.hasAttribute(a) && (c = b, d = b.getAttribute(a));
        });
        s(rb, function(a) {
          a += "app";
          var e;
          !c && (e = b.querySelector("[" + a.replace(":", "\\:") + "]")) && (c = e, d = e.getAttribute(a));
        });
        c && (e.strictDi = null !== Id(c, "strict-di"), a(c, d ? [d] : [], e));
      }
      function sc(b, a, c) {
        H(c) || (c = {});
        c = z({strictDi: !1}, c);
        var d = function() {
          b = B(b);
          if (b.injector()) {
            var d = b[0] === Y ? "document" : va(b);
            throw Ka("btstrpd", d.replace(/</, "&lt;").replace(/>/, "&gt;"));
          }
          a = a || [];
          a.unshift(["$provide", function(a) {
            a.value("$rootElement", b);
          }]);
          c.debugInfoEnabled && a.push(["$compileProvider", function(a) {
            a.debugInfoEnabled(!0);
          }]);
          a.unshift("ng");
          d = Ob(a, c.strictDi);
          d.invoke(["$rootScope", "$rootElement", "$compile", "$injector", function(a, b, c, d) {
            a.$apply(function() {
              b.data("$injector", d);
              c(b)(a);
            });
          }]);
          return d;
        },
            e = /^NG_ENABLE_DEBUG_INFO!/,
            f = /^NG_DEFER_BOOTSTRAP!/;
        M && e.test(M.name) && (c.debugInfoEnabled = !0, M.name = M.name.replace(e, ""));
        if (M && !f.test(M.name))
          return d();
        M.name = M.name.replace(f, "");
        ga.resumeBootstrap = function(b) {
          s(b, function(b) {
            a.push(b);
          });
          d();
        };
      }
      function Kd() {
        M.name = "NG_ENABLE_DEBUG_INFO!" + M.name;
        M.location.reload();
      }
      function Ld(b) {
        b = ga.element(b).injector();
        if (!b)
          throw Ka("test");
        return b.get("$$testability");
      }
      function tc(b, a) {
        a = a || "_";
        return b.replace(Md, function(b, d) {
          return (d ? a : "") + b.toLowerCase();
        });
      }
      function Nd() {
        var b;
        uc || ((ra = M.jQuery) && ra.fn.on ? (B = ra, z(ra.fn, {
          scope: La.scope,
          isolateScope: La.isolateScope,
          controller: La.controller,
          injector: La.injector,
          inheritedData: La.inheritedData
        }), b = ra.cleanData, ra.cleanData = function(a) {
          var c;
          if (Pb)
            Pb = !1;
          else
            for (var d = 0,
                e; null != (e = a[d]); d++)
              (c = ra._data(e, "events")) && c.$destroy && ra(e).triggerHandler("$destroy");
          b(a);
        }) : B = R, ga.element = B, uc = !0);
      }
      function Qb(b, a, c) {
        if (!b)
          throw Ka("areq", a || "?", c || "required");
        return b;
      }
      function sb(b, a, c) {
        c && x(b) && (b = b[b.length - 1]);
        Qb(G(b), a, "not a function, got " + (b && "object" === typeof b ? b.constructor.name || "Object" : typeof b));
        return b;
      }
      function Ma(b, a) {
        if ("hasOwnProperty" === b)
          throw Ka("badname", a);
      }
      function vc(b, a, c) {
        if (!a)
          return b;
        a = a.split(".");
        for (var d,
            e = b,
            f = a.length,
            g = 0; g < f; g++)
          d = a[g], b && (b = (e = b)[d]);
        return !c && G(b) ? nc(e, b) : b;
      }
      function tb(b) {
        var a = b[0];
        b = b[b.length - 1];
        var c = [a];
        do {
          a = a.nextSibling;
          if (!a)
            break;
          c.push(a);
        } while (a !== b);
        return B(c);
      }
      function ha() {
        return Object.create(null);
      }
      function Od(b) {
        function a(a, b, c) {
          return a[b] || (a[b] = c());
        }
        var c = T("$injector"),
            d = T("ng");
        b = a(b, "angular", Object);
        b.$$minErr = b.$$minErr || T;
        return a(b, "module", function() {
          var b = {};
          return function(f, g, h) {
            if ("hasOwnProperty" === f)
              throw d("badname", "module");
            g && b.hasOwnProperty(f) && (b[f] = null);
            return a(b, f, function() {
              function a(c, d, e, f) {
                f || (f = b);
                return function() {
                  f[e || "push"]([c, d, arguments]);
                  return u;
                };
              }
              if (!g)
                throw c("nomod", f);
              var b = [],
                  d = [],
                  e = [],
                  q = a("$injector", "invoke", "push", d),
                  u = {
                    _invokeQueue: b,
                    _configBlocks: d,
                    _runBlocks: e,
                    requires: g,
                    name: f,
                    provider: a("$provide", "provider"),
                    factory: a("$provide", "factory"),
                    service: a("$provide", "service"),
                    value: a("$provide", "value"),
                    constant: a("$provide", "constant", "unshift"),
                    animation: a("$animateProvider", "register"),
                    filter: a("$filterProvider", "register"),
                    controller: a("$controllerProvider", "register"),
                    directive: a("$compileProvider", "directive"),
                    config: q,
                    run: function(a) {
                      e.push(a);
                      return this;
                    }
                  };
              h && q(h);
              return u;
            });
          };
        });
      }
      function Pd(b) {
        z(b, {
          bootstrap: sc,
          copy: Ea,
          extend: z,
          equals: fa,
          element: B,
          forEach: s,
          injector: Ob,
          noop: C,
          bind: nc,
          toJson: $a,
          fromJson: oc,
          identity: oa,
          isUndefined: D,
          isDefined: y,
          isString: F,
          isFunction: G,
          isObject: H,
          isNumber: V,
          isElement: mc,
          isArray: x,
          version: Qd,
          isDate: pa,
          lowercase: Q,
          uppercase: ub,
          callbacks: {counter: 0},
          getTestability: Ld,
          $$minErr: T,
          $$csp: ab,
          reloadWithDebugInfo: Kd
        });
        bb = Od(M);
        try {
          bb("ngLocale");
        } catch (a) {
          bb("ngLocale", []).provider("$locale", Rd);
        }
        bb("ng", ["ngLocale"], ["$provide", function(a) {
          a.provider({$$sanitizeUri: Sd});
          a.provider("$compile", wc).directive({
            a: Td,
            input: xc,
            textarea: xc,
            form: Ud,
            script: Vd,
            select: Wd,
            style: Xd,
            option: Yd,
            ngBind: Zd,
            ngBindHtml: $d,
            ngBindTemplate: ae,
            ngClass: be,
            ngClassEven: ce,
            ngClassOdd: de,
            ngCloak: ee,
            ngController: fe,
            ngForm: ge,
            ngHide: he,
            ngIf: ie,
            ngInclude: je,
            ngInit: ke,
            ngNonBindable: le,
            ngPluralize: me,
            ngRepeat: ne,
            ngShow: oe,
            ngStyle: pe,
            ngSwitch: qe,
            ngSwitchWhen: re,
            ngSwitchDefault: se,
            ngOptions: te,
            ngTransclude: ue,
            ngModel: ve,
            ngList: we,
            ngChange: xe,
            pattern: yc,
            ngPattern: yc,
            required: zc,
            ngRequired: zc,
            minlength: Ac,
            ngMinlength: Ac,
            maxlength: Bc,
            ngMaxlength: Bc,
            ngValue: ye,
            ngModelOptions: ze
          }).directive({ngInclude: Ae}).directive(vb).directive(Cc);
          a.provider({
            $anchorScroll: Be,
            $animate: Ce,
            $browser: De,
            $cacheFactory: Ee,
            $controller: Fe,
            $document: Ge,
            $exceptionHandler: He,
            $filter: Dc,
            $interpolate: Ie,
            $interval: Je,
            $http: Ke,
            $httpBackend: Le,
            $location: Me,
            $log: Ne,
            $parse: Oe,
            $rootScope: Pe,
            $q: Qe,
            $$q: Re,
            $sce: Se,
            $sceDelegate: Te,
            $sniffer: Ue,
            $templateCache: Ve,
            $templateRequest: We,
            $$testability: Xe,
            $timeout: Ye,
            $window: Ze,
            $$rAF: $e,
            $$asyncCallback: af,
            $$jqLite: bf
          });
        }]);
      }
      function cb(b) {
        return b.replace(cf, function(a, b, d, e) {
          return e ? d.toUpperCase() : d;
        }).replace(df, "Moz$1");
      }
      function Ec(b) {
        b = b.nodeType;
        return b === na || !b || 9 === b;
      }
      function Fc(b, a) {
        var c,
            d,
            e = a.createDocumentFragment(),
            f = [];
        if (Rb.test(b)) {
          c = c || e.appendChild(a.createElement("div"));
          d = (ef.exec(b) || ["", ""])[1].toLowerCase();
          d = ia[d] || ia._default;
          c.innerHTML = d[1] + b.replace(ff, "<$1></$2>") + d[2];
          for (d = d[0]; d--; )
            c = c.lastChild;
          f = Ya(f, c.childNodes);
          c = e.firstChild;
          c.textContent = "";
        } else
          f.push(a.createTextNode(b));
        e.textContent = "";
        e.innerHTML = "";
        s(f, function(a) {
          e.appendChild(a);
        });
        return e;
      }
      function R(b) {
        if (b instanceof R)
          return b;
        var a;
        F(b) && (b = U(b), a = !0);
        if (!(this instanceof R)) {
          if (a && "<" != b.charAt(0))
            throw Sb("nosel");
          return new R(b);
        }
        if (a) {
          a = Y;
          var c;
          b = (c = gf.exec(b)) ? [a.createElement(c[1])] : (c = Fc(b, a)) ? c.childNodes : [];
        }
        Gc(this, b);
      }
      function Tb(b) {
        return b.cloneNode(!0);
      }
      function wb(b, a) {
        a || xb(b);
        if (b.querySelectorAll)
          for (var c = b.querySelectorAll("*"),
              d = 0,
              e = c.length; d < e; d++)
            xb(c[d]);
      }
      function Hc(b, a, c, d) {
        if (y(d))
          throw Sb("offargs");
        var e = (d = yb(b)) && d.events,
            f = d && d.handle;
        if (f)
          if (a)
            s(a.split(" "), function(a) {
              if (y(c)) {
                var d = e[a];
                Xa(d || [], c);
                if (d && 0 < d.length)
                  return;
              }
              b.removeEventListener(a, f, !1);
              delete e[a];
            });
          else
            for (a in e)
              "$destroy" !== a && b.removeEventListener(a, f, !1), delete e[a];
      }
      function xb(b, a) {
        var c = b.ng339,
            d = c && zb[c];
        d && (a ? delete d.data[a] : (d.handle && (d.events.$destroy && d.handle({}, "$destroy"), Hc(b)), delete zb[c], b.ng339 = t));
      }
      function yb(b, a) {
        var c = b.ng339,
            c = c && zb[c];
        a && !c && (b.ng339 = c = ++hf, c = zb[c] = {
          events: {},
          data: {},
          handle: t
        });
        return c;
      }
      function Ub(b, a, c) {
        if (Ec(b)) {
          var d = y(c),
              e = !d && a && !H(a),
              f = !a;
          b = (b = yb(b, !e)) && b.data;
          if (d)
            b[a] = c;
          else {
            if (f)
              return b;
            if (e)
              return b && b[a];
            z(b, a);
          }
        }
      }
      function Ab(b, a) {
        return b.getAttribute ? -1 < (" " + (b.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + a + " ") : !1;
      }
      function Bb(b, a) {
        a && b.setAttribute && s(a.split(" "), function(a) {
          b.setAttribute("class", U((" " + (b.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").replace(" " + U(a) + " ", " ")));
        });
      }
      function Cb(b, a) {
        if (a && b.setAttribute) {
          var c = (" " + (b.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");
          s(a.split(" "), function(a) {
            a = U(a);
            -1 === c.indexOf(" " + a + " ") && (c += a + " ");
          });
          b.setAttribute("class", U(c));
        }
      }
      function Gc(b, a) {
        if (a)
          if (a.nodeType)
            b[b.length++] = a;
          else {
            var c = a.length;
            if ("number" === typeof c && a.window !== a) {
              if (c)
                for (var d = 0; d < c; d++)
                  b[b.length++] = a[d];
            } else
              b[b.length++] = a;
          }
      }
      function Ic(b, a) {
        return Db(b, "$" + (a || "ngController") + "Controller");
      }
      function Db(b, a, c) {
        9 == b.nodeType && (b = b.documentElement);
        for (a = x(a) ? a : [a]; b; ) {
          for (var d = 0,
              e = a.length; d < e; d++)
            if ((c = B.data(b, a[d])) !== t)
              return c;
          b = b.parentNode || 11 === b.nodeType && b.host;
        }
      }
      function Jc(b) {
        for (wb(b, !0); b.firstChild; )
          b.removeChild(b.firstChild);
      }
      function Kc(b, a) {
        a || wb(b);
        var c = b.parentNode;
        c && c.removeChild(b);
      }
      function jf(b, a) {
        a = a || M;
        if ("complete" === a.document.readyState)
          a.setTimeout(b);
        else
          B(a).on("load", b);
      }
      function Lc(b, a) {
        var c = Eb[a.toLowerCase()];
        return c && Mc[ua(b)] && c;
      }
      function kf(b, a) {
        var c = b.nodeName;
        return ("INPUT" === c || "TEXTAREA" === c) && Nc[a];
      }
      function lf(b, a) {
        var c = function(c, e) {
          c.isDefaultPrevented = function() {
            return c.defaultPrevented;
          };
          var f = a[e || c.type],
              g = f ? f.length : 0;
          if (g) {
            if (D(c.immediatePropagationStopped)) {
              var h = c.stopImmediatePropagation;
              c.stopImmediatePropagation = function() {
                c.immediatePropagationStopped = !0;
                c.stopPropagation && c.stopPropagation();
                h && h.call(c);
              };
            }
            c.isImmediatePropagationStopped = function() {
              return !0 === c.immediatePropagationStopped;
            };
            1 < g && (f = qa(f));
            for (var l = 0; l < g; l++)
              c.isImmediatePropagationStopped() || f[l].call(b, c);
          }
        };
        c.elem = b;
        return c;
      }
      function bf() {
        this.$get = function() {
          return z(R, {
            hasClass: function(b, a) {
              b.attr && (b = b[0]);
              return Ab(b, a);
            },
            addClass: function(b, a) {
              b.attr && (b = b[0]);
              return Cb(b, a);
            },
            removeClass: function(b, a) {
              b.attr && (b = b[0]);
              return Bb(b, a);
            }
          });
        };
      }
      function Na(b, a) {
        var c = b && b.$$hashKey;
        if (c)
          return "function" === typeof c && (c = b.$$hashKey()), c;
        c = typeof b;
        return c = "function" == c || "object" == c && null !== b ? b.$$hashKey = c + ":" + (a || Fd)() : c + ":" + b;
      }
      function db(b, a) {
        if (a) {
          var c = 0;
          this.nextUid = function() {
            return ++c;
          };
        }
        s(b, this.put, this);
      }
      function mf(b) {
        return (b = b.toString().replace(Oc, "").match(Pc)) ? "function(" + (b[1] || "").replace(/[\s\r\n]+/, " ") + ")" : "fn";
      }
      function Vb(b, a, c) {
        var d;
        if ("function" === typeof b) {
          if (!(d = b.$inject)) {
            d = [];
            if (b.length) {
              if (a)
                throw F(c) && c || (c = b.name || mf(b)), Ga("strictdi", c);
              a = b.toString().replace(Oc, "");
              a = a.match(Pc);
              s(a[1].split(nf), function(a) {
                a.replace(of, function(a, b, c) {
                  d.push(c);
                });
              });
            }
            b.$inject = d;
          }
        } else
          x(b) ? (a = b.length - 1, sb(b[a], "fn"), d = b.slice(0, a)) : sb(b, "fn", !0);
        return d;
      }
      function Ob(b, a) {
        function c(a) {
          return function(b, c) {
            if (H(b))
              s(b, kc(a));
            else
              return a(b, c);
          };
        }
        function d(a, b) {
          Ma(a, "service");
          if (G(b) || x(b))
            b = q.instantiate(b);
          if (!b.$get)
            throw Ga("pget", a);
          return p[a + "Provider"] = b;
        }
        function e(a, b) {
          return function() {
            var c = r.invoke(b, this);
            if (D(c))
              throw Ga("undef", a);
            return c;
          };
        }
        function f(a, b, c) {
          return d(a, {$get: !1 !== c ? e(a, b) : b});
        }
        function g(a) {
          var b = [],
              c;
          s(a, function(a) {
            function d(a) {
              var b,
                  c;
              b = 0;
              for (c = a.length; b < c; b++) {
                var e = a[b],
                    f = q.get(e[0]);
                f[e[1]].apply(f, e[2]);
              }
            }
            if (!m.get(a)) {
              m.put(a, !0);
              try {
                F(a) ? (c = bb(a), b = b.concat(g(c.requires)).concat(c._runBlocks), d(c._invokeQueue), d(c._configBlocks)) : G(a) ? b.push(q.invoke(a)) : x(a) ? b.push(q.invoke(a)) : sb(a, "module");
              } catch (e) {
                throw x(a) && (a = a[a.length - 1]), e.message && e.stack && -1 == e.stack.indexOf(e.message) && (e = e.message + "\n" + e.stack), Ga("modulerr", a, e.stack || e.message || e);
              }
            }
          });
          return b;
        }
        function h(b, c) {
          function d(a, e) {
            if (b.hasOwnProperty(a)) {
              if (b[a] === l)
                throw Ga("cdep", a + " <- " + k.join(" <- "));
              return b[a];
            }
            try {
              return k.unshift(a), b[a] = l, b[a] = c(a, e);
            } catch (f) {
              throw b[a] === l && delete b[a], f;
            } finally {
              k.shift();
            }
          }
          function e(b, c, f, g) {
            "string" === typeof f && (g = f, f = null);
            var h = [],
                k = Vb(b, a, g),
                l,
                q,
                p;
            q = 0;
            for (l = k.length; q < l; q++) {
              p = k[q];
              if ("string" !== typeof p)
                throw Ga("itkn", p);
              h.push(f && f.hasOwnProperty(p) ? f[p] : d(p, g));
            }
            x(b) && (b = b[l]);
            return b.apply(c, h);
          }
          return {
            invoke: e,
            instantiate: function(a, b, c) {
              var d = Object.create((x(a) ? a[a.length - 1] : a).prototype);
              a = e(a, d, b, c);
              return H(a) || G(a) ? a : d;
            },
            get: d,
            annotate: Vb,
            has: function(a) {
              return p.hasOwnProperty(a + "Provider") || b.hasOwnProperty(a);
            }
          };
        }
        a = !0 === a;
        var l = {},
            k = [],
            m = new db([], !0),
            p = {$provide: {
                provider: c(d),
                factory: c(f),
                service: c(function(a, b) {
                  return f(a, ["$injector", function(a) {
                    return a.instantiate(b);
                  }]);
                }),
                value: c(function(a, b) {
                  return f(a, da(b), !1);
                }),
                constant: c(function(a, b) {
                  Ma(a, "constant");
                  p[a] = b;
                  u[a] = b;
                }),
                decorator: function(a, b) {
                  var c = q.get(a + "Provider"),
                      d = c.$get;
                  c.$get = function() {
                    var a = r.invoke(d, c);
                    return r.invoke(b, null, {$delegate: a});
                  };
                }
              }},
            q = p.$injector = h(p, function(a, b) {
              ga.isString(b) && k.push(b);
              throw Ga("unpr", k.join(" <- "));
            }),
            u = {},
            r = u.$injector = h(u, function(a, b) {
              var c = q.get(a + "Provider", b);
              return r.invoke(c.$get, c, t, a);
            });
        s(g(b), function(a) {
          r.invoke(a || C);
        });
        return r;
      }
      function Be() {
        var b = !0;
        this.disableAutoScrolling = function() {
          b = !1;
        };
        this.$get = ["$window", "$location", "$rootScope", function(a, c, d) {
          function e(a) {
            var b = null;
            Array.prototype.some.call(a, function(a) {
              if ("a" === ua(a))
                return b = a, !0;
            });
            return b;
          }
          function f(b) {
            if (b) {
              b.scrollIntoView();
              var c;
              c = g.yOffset;
              G(c) ? c = c() : mc(c) ? (c = c[0], c = "fixed" !== a.getComputedStyle(c).position ? 0 : c.getBoundingClientRect().bottom) : V(c) || (c = 0);
              c && (b = b.getBoundingClientRect().top, a.scrollBy(0, b - c));
            } else
              a.scrollTo(0, 0);
          }
          function g() {
            var a = c.hash(),
                b;
            a ? (b = h.getElementById(a)) ? f(b) : (b = e(h.getElementsByName(a))) ? f(b) : "top" === a && f(null) : f(null);
          }
          var h = a.document;
          b && d.$watch(function() {
            return c.hash();
          }, function(a, b) {
            a === b && "" === a || jf(function() {
              d.$evalAsync(g);
            });
          });
          return g;
        }];
      }
      function af() {
        this.$get = ["$$rAF", "$timeout", function(b, a) {
          return b.supported ? function(a) {
            return b(a);
          } : function(b) {
            return a(b, 0, !1);
          };
        }];
      }
      function pf(b, a, c, d) {
        function e(a) {
          try {
            a.apply(null, Za.call(arguments, 1));
          } finally {
            if (v--, 0 === v)
              for (; w.length; )
                try {
                  w.pop()();
                } catch (b) {
                  c.error(b);
                }
          }
        }
        function f(a, b) {
          (function N() {
            s(L, function(a) {
              a();
            });
            J = b(N, a);
          })();
        }
        function g() {
          h();
          l();
        }
        function h() {
          A = b.history.state;
          A = D(A) ? null : A;
          fa(A, I) && (A = I);
          I = A;
        }
        function l() {
          if (E !== m.url() || P !== A)
            E = m.url(), P = A, s(W, function(a) {
              a(m.url(), A);
            });
        }
        function k(a) {
          try {
            return decodeURIComponent(a);
          } catch (b) {
            return a;
          }
        }
        var m = this,
            p = a[0],
            q = b.location,
            u = b.history,
            r = b.setTimeout,
            O = b.clearTimeout,
            n = {};
        m.isMock = !1;
        var v = 0,
            w = [];
        m.$$completeOutstandingRequest = e;
        m.$$incOutstandingRequestCount = function() {
          v++;
        };
        m.notifyWhenNoOutstandingRequests = function(a) {
          s(L, function(a) {
            a();
          });
          0 === v ? a() : w.push(a);
        };
        var L = [],
            J;
        m.addPollFn = function(a) {
          D(J) && f(100, r);
          L.push(a);
          return a;
        };
        var A,
            P,
            E = q.href,
            S = a.find("base"),
            X = null;
        h();
        P = A;
        m.url = function(a, c, e) {
          D(e) && (e = null);
          q !== b.location && (q = b.location);
          u !== b.history && (u = b.history);
          if (a) {
            var f = P === e;
            if (E === a && (!d.history || f))
              return m;
            var g = E && Ha(E) === Ha(a);
            E = a;
            P = e;
            !d.history || g && f ? (g || (X = a), c ? q.replace(a) : g ? (c = q, e = a.indexOf("#"), a = -1 === e ? "" : a.substr(e + 1), c.hash = a) : q.href = a) : (u[c ? "replaceState" : "pushState"](e, "", a), h(), P = A);
            return m;
          }
          return X || q.href.replace(/%27/g, "'");
        };
        m.state = function() {
          return A;
        };
        var W = [],
            wa = !1,
            I = null;
        m.onUrlChange = function(a) {
          if (!wa) {
            if (d.history)
              B(b).on("popstate", g);
            B(b).on("hashchange", g);
            wa = !0;
          }
          W.push(a);
          return a;
        };
        m.$$checkUrlChange = l;
        m.baseHref = function() {
          var a = S.attr("href");
          return a ? a.replace(/^(https?\:)?\/\/[^\/]*/, "") : "";
        };
        var ea = {},
            y = "",
            ca = m.baseHref();
        m.cookies = function(a, b) {
          var d,
              e,
              f,
              g;
          if (a)
            b === t ? p.cookie = encodeURIComponent(a) + "=;path=" + ca + ";expires=Thu, 01 Jan 1970 00:00:00 GMT" : F(b) && (d = (p.cookie = encodeURIComponent(a) + "=" + encodeURIComponent(b) + ";path=" + ca).length + 1, 4096 < d && c.warn("Cookie '" + a + "' possibly not set or overflowed because it was too large (" + d + " > 4096 bytes)!"));
          else {
            if (p.cookie !== y)
              for (y = p.cookie, d = y.split("; "), ea = {}, f = 0; f < d.length; f++)
                e = d[f], g = e.indexOf("="), 0 < g && (a = k(e.substring(0, g)), ea[a] === t && (ea[a] = k(e.substring(g + 1))));
            return ea;
          }
        };
        m.defer = function(a, b) {
          var c;
          v++;
          c = r(function() {
            delete n[c];
            e(a);
          }, b || 0);
          n[c] = !0;
          return c;
        };
        m.defer.cancel = function(a) {
          return n[a] ? (delete n[a], O(a), e(C), !0) : !1;
        };
      }
      function De() {
        this.$get = ["$window", "$log", "$sniffer", "$document", function(b, a, c, d) {
          return new pf(b, d, a, c);
        }];
      }
      function Ee() {
        this.$get = function() {
          function b(b, d) {
            function e(a) {
              a != p && (q ? q == a && (q = a.n) : q = a, f(a.n, a.p), f(a, p), p = a, p.n = null);
            }
            function f(a, b) {
              a != b && (a && (a.p = b), b && (b.n = a));
            }
            if (b in a)
              throw T("$cacheFactory")("iid", b);
            var g = 0,
                h = z({}, d, {id: b}),
                l = {},
                k = d && d.capacity || Number.MAX_VALUE,
                m = {},
                p = null,
                q = null;
            return a[b] = {
              put: function(a, b) {
                if (k < Number.MAX_VALUE) {
                  var c = m[a] || (m[a] = {key: a});
                  e(c);
                }
                if (!D(b))
                  return a in l || g++, l[a] = b, g > k && this.remove(q.key), b;
              },
              get: function(a) {
                if (k < Number.MAX_VALUE) {
                  var b = m[a];
                  if (!b)
                    return;
                  e(b);
                }
                return l[a];
              },
              remove: function(a) {
                if (k < Number.MAX_VALUE) {
                  var b = m[a];
                  if (!b)
                    return;
                  b == p && (p = b.p);
                  b == q && (q = b.n);
                  f(b.n, b.p);
                  delete m[a];
                }
                delete l[a];
                g--;
              },
              removeAll: function() {
                l = {};
                g = 0;
                m = {};
                p = q = null;
              },
              destroy: function() {
                m = h = l = null;
                delete a[b];
              },
              info: function() {
                return z({}, h, {size: g});
              }
            };
          }
          var a = {};
          b.info = function() {
            var b = {};
            s(a, function(a, e) {
              b[e] = a.info();
            });
            return b;
          };
          b.get = function(b) {
            return a[b];
          };
          return b;
        };
      }
      function Ve() {
        this.$get = ["$cacheFactory", function(b) {
          return b("templates");
        }];
      }
      function wc(b, a) {
        function c(a, b) {
          var c = /^\s*([@&]|=(\*?))(\??)\s*(\w*)\s*$/,
              d = {};
          s(a, function(a, e) {
            var f = a.match(c);
            if (!f)
              throw ja("iscp", b, e, a);
            d[e] = {
              mode: f[1][0],
              collection: "*" === f[2],
              optional: "?" === f[3],
              attrName: f[4] || e
            };
          });
          return d;
        }
        var d = {},
            e = /^\s*directive\:\s*([\w\-]+)\s+(.*)$/,
            f = /(([\w\-]+)(?:\:([^;]+))?;?)/,
            g = Gd("ngSrc,ngSrcset,src,srcset"),
            h = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/,
            l = /^(on[a-z]+|formaction)$/;
        this.directive = function p(a, e) {
          Ma(a, "directive");
          F(a) ? (Qb(e, "directiveFactory"), d.hasOwnProperty(a) || (d[a] = [], b.factory(a + "Directive", ["$injector", "$exceptionHandler", function(b, e) {
            var f = [];
            s(d[a], function(d, g) {
              try {
                var h = b.invoke(d);
                G(h) ? h = {compile: da(h)} : !h.compile && h.link && (h.compile = da(h.link));
                h.priority = h.priority || 0;
                h.index = g;
                h.name = h.name || a;
                h.require = h.require || h.controller && h.name;
                h.restrict = h.restrict || "EA";
                H(h.scope) && (h.$$isolateBindings = c(h.scope, h.name));
                f.push(h);
              } catch (l) {
                e(l);
              }
            });
            return f;
          }])), d[a].push(e)) : s(a, kc(p));
          return this;
        };
        this.aHrefSanitizationWhitelist = function(b) {
          return y(b) ? (a.aHrefSanitizationWhitelist(b), this) : a.aHrefSanitizationWhitelist();
        };
        this.imgSrcSanitizationWhitelist = function(b) {
          return y(b) ? (a.imgSrcSanitizationWhitelist(b), this) : a.imgSrcSanitizationWhitelist();
        };
        var k = !0;
        this.debugInfoEnabled = function(a) {
          return y(a) ? (k = a, this) : k;
        };
        this.$get = ["$injector", "$interpolate", "$exceptionHandler", "$templateRequest", "$parse", "$controller", "$rootScope", "$document", "$sce", "$animate", "$$sanitizeUri", function(a, b, c, r, O, n, v, w, L, J, A) {
          function P(a, b) {
            try {
              a.addClass(b);
            } catch (c) {}
          }
          function E(a, b, c, d, e) {
            a instanceof B || (a = B(a));
            s(a, function(b, c) {
              b.nodeType == pb && b.nodeValue.match(/\S+/) && (a[c] = B(b).wrap("<span></span>").parent()[0]);
            });
            var f = S(a, b, a, c, d, e);
            E.$$addScopeClass(a);
            var g = null;
            return function(b, c, d) {
              Qb(b, "scope");
              d = d || {};
              var e = d.parentBoundTranscludeFn,
                  h = d.transcludeControllers;
              d = d.futureParentElement;
              e && e.$$boundTransclude && (e = e.$$boundTransclude);
              g || (g = (d = d && d[0]) ? "foreignobject" !== ua(d) && d.toString().match(/SVG/) ? "svg" : "html" : "html");
              d = "html" !== g ? B(Wb(g, B("<div>").append(a).html())) : c ? La.clone.call(a) : a;
              if (h)
                for (var l in h)
                  d.data("$" + l + "Controller", h[l].instance);
              E.$$addScopeInfo(d, b);
              c && c(d, b);
              f && f(b, d, d, e);
              return d;
            };
          }
          function S(a, b, c, d, e, f) {
            function g(a, c, d, e) {
              var f,
                  l,
                  k,
                  q,
                  p,
                  n,
                  w;
              if (r)
                for (w = Array(c.length), q = 0; q < h.length; q += 3)
                  f = h[q], w[f] = c[f];
              else
                w = c;
              q = 0;
              for (p = h.length; q < p; )
                l = w[h[q++]], c = h[q++], f = h[q++], c ? (c.scope ? (k = a.$new(), E.$$addScopeInfo(B(l), k)) : k = a, n = c.transcludeOnThisElement ? X(a, c.transclude, e, c.elementTranscludeOnThisElement) : !c.templateOnThisElement && e ? e : !e && b ? X(a, b) : null, c(f, k, l, d, n)) : f && f(a, l.childNodes, t, e);
            }
            for (var h = [],
                l,
                k,
                q,
                p,
                r,
                n = 0; n < a.length; n++) {
              l = new Xb;
              k = W(a[n], [], l, 0 === n ? d : t, e);
              (f = k.length ? ea(k, a[n], l, b, c, null, [], [], f) : null) && f.scope && E.$$addScopeClass(l.$$element);
              l = f && f.terminal || !(q = a[n].childNodes) || !q.length ? null : S(q, f ? (f.transcludeOnThisElement || !f.templateOnThisElement) && f.transclude : b);
              if (f || l)
                h.push(n, f, l), p = !0, r = r || f;
              f = null;
            }
            return p ? g : null;
          }
          function X(a, b, c, d) {
            return function(d, e, f, g, h) {
              d || (d = a.$new(!1, h), d.$$transcluded = !0);
              return b(d, e, {
                parentBoundTranscludeFn: c,
                transcludeControllers: f,
                futureParentElement: g
              });
            };
          }
          function W(a, b, c, d, g) {
            var h = c.$attr,
                l;
            switch (a.nodeType) {
              case na:
                ca(b, ya(ua(a)), "E", d, g);
                for (var k,
                    q,
                    p,
                    r = a.attributes,
                    n = 0,
                    w = r && r.length; n < w; n++) {
                  var O = !1,
                      L = !1;
                  k = r[n];
                  l = k.name;
                  q = U(k.value);
                  k = ya(l);
                  if (p = fb.test(k))
                    l = l.replace(Rc, "").substr(8).replace(/_(.)/g, function(a, b) {
                      return b.toUpperCase();
                    });
                  var u = k.replace(/(Start|End)$/, "");
                  D(u) && k === u + "Start" && (O = l, L = l.substr(0, l.length - 5) + "end", l = l.substr(0, l.length - 6));
                  k = ya(l.toLowerCase());
                  h[k] = l;
                  if (p || !c.hasOwnProperty(k))
                    c[k] = q, Lc(a, k) && (c[k] = !0);
                  Pa(a, b, q, k, p);
                  ca(b, k, "A", d, g, O, L);
                }
                a = a.className;
                if (F(a) && "" !== a)
                  for (; l = f.exec(a); )
                    k = ya(l[2]), ca(b, k, "C", d, g) && (c[k] = U(l[3])), a = a.substr(l.index + l[0].length);
                break;
              case pb:
                M(b, a.nodeValue);
                break;
              case 8:
                try {
                  if (l = e.exec(a.nodeValue))
                    k = ya(l[1]), ca(b, k, "M", d, g) && (c[k] = U(l[2]));
                } catch (v) {}
            }
            b.sort(N);
            return b;
          }
          function wa(a, b, c) {
            var d = [],
                e = 0;
            if (b && a.hasAttribute && a.hasAttribute(b)) {
              do {
                if (!a)
                  throw ja("uterdir", b, c);
                a.nodeType == na && (a.hasAttribute(b) && e++, a.hasAttribute(c) && e--);
                d.push(a);
                a = a.nextSibling;
              } while (0 < e);
            } else
              d.push(a);
            return B(d);
          }
          function I(a, b, c) {
            return function(d, e, f, g, h) {
              e = wa(e[0], b, c);
              return a(d, e, f, g, h);
            };
          }
          function ea(a, d, e, f, g, l, k, p, r) {
            function w(a, b, c, d) {
              if (a) {
                c && (a = I(a, c, d));
                a.require = K.require;
                a.directiveName = z;
                if (S === K || K.$$isolateScope)
                  a = Z(a, {isolateScope: !0});
                k.push(a);
              }
              if (b) {
                c && (b = I(b, c, d));
                b.require = K.require;
                b.directiveName = z;
                if (S === K || K.$$isolateScope)
                  b = Z(b, {isolateScope: !0});
                p.push(b);
              }
            }
            function L(a, b, c, d) {
              var e,
                  f = "data",
                  g = !1,
                  l = c,
                  k;
              if (F(b)) {
                k = b.match(h);
                b = b.substring(k[0].length);
                k[3] && (k[1] ? k[3] = null : k[1] = k[3]);
                "^" === k[1] ? f = "inheritedData" : "^^" === k[1] && (f = "inheritedData", l = c.parent());
                "?" === k[2] && (g = !0);
                e = null;
                d && "data" === f && (e = d[b]) && (e = e.instance);
                e = e || l[f]("$" + b + "Controller");
                if (!e && !g)
                  throw ja("ctreq", b, a);
                return e || null;
              }
              x(b) && (e = [], s(b, function(b) {
                e.push(L(a, b, c, d));
              }));
              return e;
            }
            function v(a, c, f, g, h) {
              function l(a, b, c) {
                var d;
                Va(a) || (c = b, b = a, a = t);
                C && (d = P);
                c || (c = C ? W.parent() : W);
                return h(a, b, d, c, wa);
              }
              var r,
                  w,
                  u,
                  A,
                  P,
                  eb,
                  W,
                  I;
              d === f ? (I = e, W = e.$$element) : (W = B(f), I = new Xb(W, e));
              S && (A = c.$new(!0));
              h && (eb = l, eb.$$boundTransclude = h);
              J && (X = {}, P = {}, s(J, function(a) {
                var b = {
                  $scope: a === S || a.$$isolateScope ? A : c,
                  $element: W,
                  $attrs: I,
                  $transclude: eb
                };
                u = a.controller;
                "@" == u && (u = I[a.name]);
                b = n(u, b, !0, a.controllerAs);
                P[a.name] = b;
                C || W.data("$" + a.name + "Controller", b.instance);
                X[a.name] = b;
              }));
              if (S) {
                E.$$addScopeInfo(W, A, !0, !(ka && (ka === S || ka === S.$$originalDirective)));
                E.$$addScopeClass(W, !0);
                g = X && X[S.name];
                var xa = A;
                g && g.identifier && !0 === S.bindToController && (xa = g.instance);
                s(A.$$isolateBindings = S.$$isolateBindings, function(a, d) {
                  var e = a.attrName,
                      f = a.optional,
                      g,
                      h,
                      l,
                      k;
                  switch (a.mode) {
                    case "@":
                      I.$observe(e, function(a) {
                        xa[d] = a;
                      });
                      I.$$observers[e].$$scope = c;
                      I[e] && (xa[d] = b(I[e])(c));
                      break;
                    case "=":
                      if (f && !I[e])
                        break;
                      h = O(I[e]);
                      k = h.literal ? fa : function(a, b) {
                        return a === b || a !== a && b !== b;
                      };
                      l = h.assign || function() {
                        g = xa[d] = h(c);
                        throw ja("nonassign", I[e], S.name);
                      };
                      g = xa[d] = h(c);
                      f = function(a) {
                        k(a, xa[d]) || (k(a, g) ? l(c, a = xa[d]) : xa[d] = a);
                        return g = a;
                      };
                      f.$stateful = !0;
                      f = a.collection ? c.$watchCollection(I[e], f) : c.$watch(O(I[e], f), null, h.literal);
                      A.$on("$destroy", f);
                      break;
                    case "&":
                      h = O(I[e]), xa[d] = function(a) {
                        return h(c, a);
                      };
                  }
                });
              }
              X && (s(X, function(a) {
                a();
              }), X = null);
              g = 0;
              for (r = k.length; g < r; g++)
                w = k[g], $(w, w.isolateScope ? A : c, W, I, w.require && L(w.directiveName, w.require, W, P), eb);
              var wa = c;
              S && (S.template || null === S.templateUrl) && (wa = A);
              a && a(wa, f.childNodes, t, h);
              for (g = p.length - 1; 0 <= g; g--)
                w = p[g], $(w, w.isolateScope ? A : c, W, I, w.require && L(w.directiveName, w.require, W, P), eb);
            }
            r = r || {};
            for (var A = -Number.MAX_VALUE,
                P,
                J = r.controllerDirectives,
                X,
                S = r.newIsolateScopeDirective,
                ka = r.templateDirective,
                ea = r.nonTlbTranscludeDirective,
                ca = !1,
                D = !1,
                C = r.hasElementTranscludeDirective,
                aa = e.$$element = B(d),
                K,
                z,
                N,
                Aa = f,
                Q,
                M = 0,
                R = a.length; M < R; M++) {
              K = a[M];
              var Pa = K.$$start,
                  fb = K.$$end;
              Pa && (aa = wa(d, Pa, fb));
              N = t;
              if (A > K.priority)
                break;
              if (N = K.scope)
                K.templateUrl || (H(N) ? (Oa("new/isolated scope", S || P, K, aa), S = K) : Oa("new/isolated scope", S, K, aa)), P = P || K;
              z = K.name;
              !K.templateUrl && K.controller && (N = K.controller, J = J || {}, Oa("'" + z + "' controller", J[z], K, aa), J[z] = K);
              if (N = K.transclude)
                ca = !0, K.$$tlb || (Oa("transclusion", ea, K, aa), ea = K), "element" == N ? (C = !0, A = K.priority, N = aa, aa = e.$$element = B(Y.createComment(" " + z + ": " + e[z] + " ")), d = aa[0], V(g, Za.call(N, 0), d), Aa = E(N, f, A, l && l.name, {nonTlbTranscludeDirective: ea})) : (N = B(Tb(d)).contents(), aa.empty(), Aa = E(N, f));
              if (K.template)
                if (D = !0, Oa("template", ka, K, aa), ka = K, N = G(K.template) ? K.template(aa, e) : K.template, N = Sc(N), K.replace) {
                  l = K;
                  N = Rb.test(N) ? Tc(Wb(K.templateNamespace, U(N))) : [];
                  d = N[0];
                  if (1 != N.length || d.nodeType !== na)
                    throw ja("tplrt", z, "");
                  V(g, aa, d);
                  R = {$attr: {}};
                  N = W(d, [], R);
                  var ba = a.splice(M + 1, a.length - (M + 1));
                  S && y(N);
                  a = a.concat(N).concat(ba);
                  Qc(e, R);
                  R = a.length;
                } else
                  aa.html(N);
              if (K.templateUrl)
                D = !0, Oa("template", ka, K, aa), ka = K, K.replace && (l = K), v = T(a.splice(M, a.length - M), aa, e, g, ca && Aa, k, p, {
                  controllerDirectives: J,
                  newIsolateScopeDirective: S,
                  templateDirective: ka,
                  nonTlbTranscludeDirective: ea
                }), R = a.length;
              else if (K.compile)
                try {
                  Q = K.compile(aa, e, Aa), G(Q) ? w(null, Q, Pa, fb) : Q && w(Q.pre, Q.post, Pa, fb);
                } catch (qf) {
                  c(qf, va(aa));
                }
              K.terminal && (v.terminal = !0, A = Math.max(A, K.priority));
            }
            v.scope = P && !0 === P.scope;
            v.transcludeOnThisElement = ca;
            v.elementTranscludeOnThisElement = C;
            v.templateOnThisElement = D;
            v.transclude = Aa;
            r.hasElementTranscludeDirective = C;
            return v;
          }
          function y(a) {
            for (var b = 0,
                c = a.length; b < c; b++) {
              var d = b,
                  e;
              e = z(Object.create(a[b]), {$$isolateScope: !0});
              a[d] = e;
            }
          }
          function ca(b, e, f, g, h, l, k) {
            if (e === h)
              return null;
            h = null;
            if (d.hasOwnProperty(e)) {
              var q;
              e = a.get(e + "Directive");
              for (var r = 0,
                  n = e.length; r < n; r++)
                try {
                  if (q = e[r], (g === t || g > q.priority) && -1 != q.restrict.indexOf(f)) {
                    if (l) {
                      var w = {
                        $$start: l,
                        $$end: k
                      };
                      q = z(Object.create(q), w);
                    }
                    b.push(q);
                    h = q;
                  }
                } catch (O) {
                  c(O);
                }
            }
            return h;
          }
          function D(b) {
            if (d.hasOwnProperty(b))
              for (var c = a.get(b + "Directive"),
                  e = 0,
                  f = c.length; e < f; e++)
                if (b = c[e], b.multiElement)
                  return !0;
            return !1;
          }
          function Qc(a, b) {
            var c = b.$attr,
                d = a.$attr,
                e = a.$$element;
            s(a, function(d, e) {
              "$" != e.charAt(0) && (b[e] && b[e] !== d && (d += ("style" === e ? ";" : " ") + b[e]), a.$set(e, d, !0, c[e]));
            });
            s(b, function(b, f) {
              "class" == f ? (P(e, b), a["class"] = (a["class"] ? a["class"] + " " : "") + b) : "style" == f ? (e.attr("style", e.attr("style") + ";" + b), a.style = (a.style ? a.style + ";" : "") + b) : "$" == f.charAt(0) || a.hasOwnProperty(f) || (a[f] = b, d[f] = c[f]);
            });
          }
          function T(a, b, c, d, e, f, g, h) {
            var l = [],
                k,
                q,
                p = b[0],
                n = a.shift(),
                w = z({}, n, {
                  templateUrl: null,
                  transclude: null,
                  replace: null,
                  $$originalDirective: n
                }),
                O = G(n.templateUrl) ? n.templateUrl(b, c) : n.templateUrl,
                u = n.templateNamespace;
            b.empty();
            r(L.getTrustedResourceUrl(O)).then(function(r) {
              var L,
                  v;
              r = Sc(r);
              if (n.replace) {
                r = Rb.test(r) ? Tc(Wb(u, U(r))) : [];
                L = r[0];
                if (1 != r.length || L.nodeType !== na)
                  throw ja("tplrt", n.name, O);
                r = {$attr: {}};
                V(d, b, L);
                var A = W(L, [], r);
                H(n.scope) && y(A);
                a = A.concat(a);
                Qc(c, r);
              } else
                L = p, b.html(r);
              a.unshift(w);
              k = ea(a, L, c, e, b, n, f, g, h);
              s(d, function(a, c) {
                a == L && (d[c] = b[0]);
              });
              for (q = S(b[0].childNodes, e); l.length; ) {
                r = l.shift();
                v = l.shift();
                var J = l.shift(),
                    E = l.shift(),
                    A = b[0];
                if (!r.$$destroyed) {
                  if (v !== p) {
                    var I = v.className;
                    h.hasElementTranscludeDirective && n.replace || (A = Tb(L));
                    V(J, B(v), A);
                    P(B(A), I);
                  }
                  v = k.transcludeOnThisElement ? X(r, k.transclude, E) : E;
                  k(q, r, A, d, v);
                }
              }
              l = null;
            });
            return function(a, b, c, d, e) {
              a = e;
              b.$$destroyed || (l ? l.push(b, c, d, a) : (k.transcludeOnThisElement && (a = X(b, k.transclude, e)), k(q, b, c, d, a)));
            };
          }
          function N(a, b) {
            var c = b.priority - a.priority;
            return 0 !== c ? c : a.name !== b.name ? a.name < b.name ? -1 : 1 : a.index - b.index;
          }
          function Oa(a, b, c, d) {
            if (b)
              throw ja("multidir", b.name, c.name, a, va(d));
          }
          function M(a, c) {
            var d = b(c, !0);
            d && a.push({
              priority: 0,
              compile: function(a) {
                a = a.parent();
                var b = !!a.length;
                b && E.$$addBindingClass(a);
                return function(a, c) {
                  var e = c.parent();
                  b || E.$$addBindingClass(e);
                  E.$$addBindingInfo(e, d.expressions);
                  a.$watch(d, function(a) {
                    c[0].nodeValue = a;
                  });
                };
              }
            });
          }
          function Wb(a, b) {
            a = Q(a || "html");
            switch (a) {
              case "svg":
              case "math":
                var c = Y.createElement("div");
                c.innerHTML = "<" + a + ">" + b + "</" + a + ">";
                return c.childNodes[0].childNodes;
              default:
                return b;
            }
          }
          function R(a, b) {
            if ("srcdoc" == b)
              return L.HTML;
            var c = ua(a);
            if ("xlinkHref" == b || "form" == c && "action" == b || "img" != c && ("src" == b || "ngSrc" == b))
              return L.RESOURCE_URL;
          }
          function Pa(a, c, d, e, f) {
            var h = R(a, e);
            f = g[e] || f;
            var k = b(d, !0, h, f);
            if (k) {
              if ("multiple" === e && "select" === ua(a))
                throw ja("selmulti", va(a));
              c.push({
                priority: 100,
                compile: function() {
                  return {pre: function(a, c, g) {
                      c = g.$$observers || (g.$$observers = {});
                      if (l.test(e))
                        throw ja("nodomevents");
                      var p = g[e];
                      p !== d && (k = p && b(p, !0, h, f), d = p);
                      k && (g[e] = k(a), (c[e] || (c[e] = [])).$$inter = !0, (g.$$observers && g.$$observers[e].$$scope || a).$watch(k, function(a, b) {
                        "class" === e && a != b ? g.$updateClass(a, b) : g.$set(e, a);
                      }));
                    }};
                }
              });
            }
          }
          function V(a, b, c) {
            var d = b[0],
                e = b.length,
                f = d.parentNode,
                g,
                h;
            if (a)
              for (g = 0, h = a.length; g < h; g++)
                if (a[g] == d) {
                  a[g++] = c;
                  h = g + e - 1;
                  for (var l = a.length; g < l; g++, h++)
                    h < l ? a[g] = a[h] : delete a[g];
                  a.length -= e - 1;
                  a.context === d && (a.context = c);
                  break;
                }
            f && f.replaceChild(c, d);
            a = Y.createDocumentFragment();
            a.appendChild(d);
            B(c).data(B(d).data());
            ra ? (Pb = !0, ra.cleanData([d])) : delete B.cache[d[B.expando]];
            d = 1;
            for (e = b.length; d < e; d++)
              f = b[d], B(f).remove(), a.appendChild(f), delete b[d];
            b[0] = c;
            b.length = 1;
          }
          function Z(a, b) {
            return z(function() {
              return a.apply(null, arguments);
            }, a, b);
          }
          function $(a, b, d, e, f, g) {
            try {
              a(b, d, e, f, g);
            } catch (h) {
              c(h, va(d));
            }
          }
          var Xb = function(a, b) {
            if (b) {
              var c = Object.keys(b),
                  d,
                  e,
                  f;
              d = 0;
              for (e = c.length; d < e; d++)
                f = c[d], this[f] = b[f];
            } else
              this.$attr = {};
            this.$$element = a;
          };
          Xb.prototype = {
            $normalize: ya,
            $addClass: function(a) {
              a && 0 < a.length && J.addClass(this.$$element, a);
            },
            $removeClass: function(a) {
              a && 0 < a.length && J.removeClass(this.$$element, a);
            },
            $updateClass: function(a, b) {
              var c = Uc(a, b);
              c && c.length && J.addClass(this.$$element, c);
              (c = Uc(b, a)) && c.length && J.removeClass(this.$$element, c);
            },
            $set: function(a, b, d, e) {
              var f = this.$$element[0],
                  g = Lc(f, a),
                  h = kf(f, a),
                  f = a;
              g ? (this.$$element.prop(a, b), e = g) : h && (this[h] = b, f = h);
              this[a] = b;
              e ? this.$attr[a] = e : (e = this.$attr[a]) || (this.$attr[a] = e = tc(a, "-"));
              g = ua(this.$$element);
              if ("a" === g && "href" === a || "img" === g && "src" === a)
                this[a] = b = A(b, "src" === a);
              else if ("img" === g && "srcset" === a) {
                for (var g = "",
                    h = U(b),
                    l = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/,
                    l = /\s/.test(h) ? l : /(,)/,
                    h = h.split(l),
                    l = Math.floor(h.length / 2),
                    k = 0; k < l; k++)
                  var q = 2 * k,
                      g = g + A(U(h[q]), !0),
                      g = g + (" " + U(h[q + 1]));
                h = U(h[2 * k]).split(/\s/);
                g += A(U(h[0]), !0);
                2 === h.length && (g += " " + U(h[1]));
                this[a] = b = g;
              }
              !1 !== d && (null === b || b === t ? this.$$element.removeAttr(e) : this.$$element.attr(e, b));
              (a = this.$$observers) && s(a[f], function(a) {
                try {
                  a(b);
                } catch (d) {
                  c(d);
                }
              });
            },
            $observe: function(a, b) {
              var c = this,
                  d = c.$$observers || (c.$$observers = ha()),
                  e = d[a] || (d[a] = []);
              e.push(b);
              v.$evalAsync(function() {
                !e.$$inter && c.hasOwnProperty(a) && b(c[a]);
              });
              return function() {
                Xa(e, b);
              };
            }
          };
          var Aa = b.startSymbol(),
              ka = b.endSymbol(),
              Sc = "{{" == Aa || "}}" == ka ? oa : function(a) {
                return a.replace(/\{\{/g, Aa).replace(/}}/g, ka);
              },
              fb = /^ngAttr[A-Z]/;
          E.$$addBindingInfo = k ? function(a, b) {
            var c = a.data("$binding") || [];
            x(b) ? c = c.concat(b) : c.push(b);
            a.data("$binding", c);
          } : C;
          E.$$addBindingClass = k ? function(a) {
            P(a, "ng-binding");
          } : C;
          E.$$addScopeInfo = k ? function(a, b, c, d) {
            a.data(c ? d ? "$isolateScopeNoTemplate" : "$isolateScope" : "$scope", b);
          } : C;
          E.$$addScopeClass = k ? function(a, b) {
            P(a, b ? "ng-isolate-scope" : "ng-scope");
          } : C;
          return E;
        }];
      }
      function ya(b) {
        return cb(b.replace(Rc, ""));
      }
      function Uc(b, a) {
        var c = "",
            d = b.split(/\s+/),
            e = a.split(/\s+/),
            f = 0;
        a: for (; f < d.length; f++) {
          for (var g = d[f],
              h = 0; h < e.length; h++)
            if (g == e[h])
              continue a;
          c += (0 < c.length ? " " : "") + g;
        }
        return c;
      }
      function Tc(b) {
        b = B(b);
        var a = b.length;
        if (1 >= a)
          return b;
        for (; a--; )
          8 === b[a].nodeType && rf.call(b, a, 1);
        return b;
      }
      function Fe() {
        var b = {},
            a = !1,
            c = /^(\S+)(\s+as\s+(\w+))?$/;
        this.register = function(a, c) {
          Ma(a, "controller");
          H(a) ? z(b, a) : b[a] = c;
        };
        this.allowGlobals = function() {
          a = !0;
        };
        this.$get = ["$injector", "$window", function(d, e) {
          function f(a, b, c, d) {
            if (!a || !H(a.$scope))
              throw T("$controller")("noscp", d, b);
            a.$scope[b] = c;
          }
          return function(g, h, l, k) {
            var m,
                p,
                q;
            l = !0 === l;
            k && F(k) && (q = k);
            F(g) && (k = g.match(c), p = k[1], q = q || k[3], g = b.hasOwnProperty(p) ? b[p] : vc(h.$scope, p, !0) || (a ? vc(e, p, !0) : t), sb(g, p, !0));
            if (l)
              return l = (x(g) ? g[g.length - 1] : g).prototype, m = Object.create(l), q && f(h, q, m, p || g.name), z(function() {
                d.invoke(g, m, h, p);
                return m;
              }, {
                instance: m,
                identifier: q
              });
            m = d.instantiate(g, h, p);
            q && f(h, q, m, p || g.name);
            return m;
          };
        }];
      }
      function Ge() {
        this.$get = ["$window", function(b) {
          return B(b.document);
        }];
      }
      function He() {
        this.$get = ["$log", function(b) {
          return function(a, c) {
            b.error.apply(b, arguments);
          };
        }];
      }
      function Yb(b, a) {
        if (F(b)) {
          var c = b.replace(sf, "").trim();
          if (c) {
            var d = a("Content-Type");
            (d = d && 0 === d.indexOf(Vc)) || (d = (d = c.match(tf)) && uf[d[0]].test(c));
            d && (b = oc(c));
          }
        }
        return b;
      }
      function Wc(b) {
        var a = ha(),
            c,
            d,
            e;
        if (!b)
          return a;
        s(b.split("\n"), function(b) {
          e = b.indexOf(":");
          c = Q(U(b.substr(0, e)));
          d = U(b.substr(e + 1));
          c && (a[c] = a[c] ? a[c] + ", " + d : d);
        });
        return a;
      }
      function Xc(b) {
        var a = H(b) ? b : t;
        return function(c) {
          a || (a = Wc(b));
          return c ? (c = a[Q(c)], void 0 === c && (c = null), c) : a;
        };
      }
      function Yc(b, a, c, d) {
        if (G(d))
          return d(b, a, c);
        s(d, function(d) {
          b = d(b, a, c);
        });
        return b;
      }
      function Ke() {
        var b = this.defaults = {
          transformResponse: [Yb],
          transformRequest: [function(a) {
            return H(a) && "[object File]" !== Da.call(a) && "[object Blob]" !== Da.call(a) && "[object FormData]" !== Da.call(a) ? $a(a) : a;
          }],
          headers: {
            common: {Accept: "application/json, text/plain, */*"},
            post: qa(Zb),
            put: qa(Zb),
            patch: qa(Zb)
          },
          xsrfCookieName: "XSRF-TOKEN",
          xsrfHeaderName: "X-XSRF-TOKEN"
        },
            a = !1;
        this.useApplyAsync = function(b) {
          return y(b) ? (a = !!b, this) : a;
        };
        var c = this.interceptors = [];
        this.$get = ["$httpBackend", "$browser", "$cacheFactory", "$rootScope", "$q", "$injector", function(d, e, f, g, h, l) {
          function k(a) {
            function c(a) {
              var b = z({}, a);
              b.data = a.data ? Yc(a.data, a.headers, a.status, e.transformResponse) : a.data;
              a = a.status;
              return 200 <= a && 300 > a ? b : h.reject(b);
            }
            function d(a) {
              var b,
                  c = {};
              s(a, function(a, d) {
                G(a) ? (b = a(), null != b && (c[d] = b)) : c[d] = a;
              });
              return c;
            }
            if (!ga.isObject(a))
              throw T("$http")("badreq", a);
            var e = z({
              method: "get",
              transformRequest: b.transformRequest,
              transformResponse: b.transformResponse
            }, a);
            e.headers = function(a) {
              var c = b.headers,
                  e = z({}, a.headers),
                  f,
                  g,
                  c = z({}, c.common, c[Q(a.method)]);
              a: for (f in c) {
                a = Q(f);
                for (g in e)
                  if (Q(g) === a)
                    continue a;
                e[f] = c[f];
              }
              return d(e);
            }(a);
            e.method = ub(e.method);
            var f = [function(a) {
              var d = a.headers,
                  e = Yc(a.data, Xc(d), t, a.transformRequest);
              D(e) && s(d, function(a, b) {
                "content-type" === Q(b) && delete d[b];
              });
              D(a.withCredentials) && !D(b.withCredentials) && (a.withCredentials = b.withCredentials);
              return m(a, e).then(c, c);
            }, t],
                g = h.when(e);
            for (s(u, function(a) {
              (a.request || a.requestError) && f.unshift(a.request, a.requestError);
              (a.response || a.responseError) && f.push(a.response, a.responseError);
            }); f.length; ) {
              a = f.shift();
              var l = f.shift(),
                  g = g.then(a, l);
            }
            g.success = function(a) {
              g.then(function(b) {
                a(b.data, b.status, b.headers, e);
              });
              return g;
            };
            g.error = function(a) {
              g.then(null, function(b) {
                a(b.data, b.status, b.headers, e);
              });
              return g;
            };
            return g;
          }
          function m(c, f) {
            function l(b, c, d, e) {
              function f() {
                m(c, b, d, e);
              }
              P && (200 <= b && 300 > b ? P.put(X, [b, c, Wc(d), e]) : P.remove(X));
              a ? g.$applyAsync(f) : (f(), g.$$phase || g.$apply());
            }
            function m(a, b, d, e) {
              b = Math.max(b, 0);
              (200 <= b && 300 > b ? J.resolve : J.reject)({
                data: a,
                status: b,
                headers: Xc(d),
                config: c,
                statusText: e
              });
            }
            function w(a) {
              m(a.data, a.status, qa(a.headers()), a.statusText);
            }
            function u() {
              var a = k.pendingRequests.indexOf(c);
              -1 !== a && k.pendingRequests.splice(a, 1);
            }
            var J = h.defer(),
                A = J.promise,
                P,
                E,
                s = c.headers,
                X = p(c.url, c.params);
            k.pendingRequests.push(c);
            A.then(u, u);
            !c.cache && !b.cache || !1 === c.cache || "GET" !== c.method && "JSONP" !== c.method || (P = H(c.cache) ? c.cache : H(b.cache) ? b.cache : q);
            P && (E = P.get(X), y(E) ? E && G(E.then) ? E.then(w, w) : x(E) ? m(E[1], E[0], qa(E[2]), E[3]) : m(E, 200, {}, "OK") : P.put(X, A));
            D(E) && ((E = Zc(c.url) ? e.cookies()[c.xsrfCookieName || b.xsrfCookieName] : t) && (s[c.xsrfHeaderName || b.xsrfHeaderName] = E), d(c.method, X, f, l, s, c.timeout, c.withCredentials, c.responseType));
            return A;
          }
          function p(a, b) {
            if (!b)
              return a;
            var c = [];
            Ed(b, function(a, b) {
              null === a || D(a) || (x(a) || (a = [a]), s(a, function(a) {
                H(a) && (a = pa(a) ? a.toISOString() : $a(a));
                c.push(Fa(b) + "=" + Fa(a));
              }));
            });
            0 < c.length && (a += (-1 == a.indexOf("?") ? "?" : "&") + c.join("&"));
            return a;
          }
          var q = f("$http"),
              u = [];
          s(c, function(a) {
            u.unshift(F(a) ? l.get(a) : l.invoke(a));
          });
          k.pendingRequests = [];
          (function(a) {
            s(arguments, function(a) {
              k[a] = function(b, c) {
                return k(z(c || {}, {
                  method: a,
                  url: b
                }));
              };
            });
          })("get", "delete", "head", "jsonp");
          (function(a) {
            s(arguments, function(a) {
              k[a] = function(b, c, d) {
                return k(z(d || {}, {
                  method: a,
                  url: b,
                  data: c
                }));
              };
            });
          })("post", "put", "patch");
          k.defaults = b;
          return k;
        }];
      }
      function vf() {
        return new M.XMLHttpRequest;
      }
      function Le() {
        this.$get = ["$browser", "$window", "$document", function(b, a, c) {
          return wf(b, vf, b.defer, a.angular.callbacks, c[0]);
        }];
      }
      function wf(b, a, c, d, e) {
        function f(a, b, c) {
          var f = e.createElement("script"),
              m = null;
          f.type = "text/javascript";
          f.src = a;
          f.async = !0;
          m = function(a) {
            f.removeEventListener("load", m, !1);
            f.removeEventListener("error", m, !1);
            e.body.removeChild(f);
            f = null;
            var g = -1,
                u = "unknown";
            a && ("load" !== a.type || d[b].called || (a = {type: "error"}), u = a.type, g = "error" === a.type ? 404 : 200);
            c && c(g, u);
          };
          f.addEventListener("load", m, !1);
          f.addEventListener("error", m, !1);
          e.body.appendChild(f);
          return m;
        }
        return function(e, h, l, k, m, p, q, u) {
          function r() {
            v && v();
            w && w.abort();
          }
          function O(a, d, e, f, g) {
            J !== t && c.cancel(J);
            v = w = null;
            a(d, e, f, g);
            b.$$completeOutstandingRequest(C);
          }
          b.$$incOutstandingRequestCount();
          h = h || b.url();
          if ("jsonp" == Q(e)) {
            var n = "_" + (d.counter++).toString(36);
            d[n] = function(a) {
              d[n].data = a;
              d[n].called = !0;
            };
            var v = f(h.replace("JSON_CALLBACK", "angular.callbacks." + n), n, function(a, b) {
              O(k, a, d[n].data, "", b);
              d[n] = C;
            });
          } else {
            var w = a();
            w.open(e, h, !0);
            s(m, function(a, b) {
              y(a) && w.setRequestHeader(b, a);
            });
            w.onload = function() {
              var a = w.statusText || "",
                  b = "response" in w ? w.response : w.responseText,
                  c = 1223 === w.status ? 204 : w.status;
              0 === c && (c = b ? 200 : "file" == Ba(h).protocol ? 404 : 0);
              O(k, c, b, w.getAllResponseHeaders(), a);
            };
            e = function() {
              O(k, -1, null, null, "");
            };
            w.onerror = e;
            w.onabort = e;
            q && (w.withCredentials = !0);
            if (u)
              try {
                w.responseType = u;
              } catch (L) {
                if ("json" !== u)
                  throw L;
              }
            w.send(l || null);
          }
          if (0 < p)
            var J = c(r, p);
          else
            p && G(p.then) && p.then(r);
        };
      }
      function Ie() {
        var b = "{{",
            a = "}}";
        this.startSymbol = function(a) {
          return a ? (b = a, this) : b;
        };
        this.endSymbol = function(b) {
          return b ? (a = b, this) : a;
        };
        this.$get = ["$parse", "$exceptionHandler", "$sce", function(c, d, e) {
          function f(a) {
            return "\\\\\\" + a;
          }
          function g(f, g, u, r) {
            function O(c) {
              return c.replace(k, b).replace(m, a);
            }
            function n(a) {
              try {
                var b = a;
                a = u ? e.getTrusted(u, b) : e.valueOf(b);
                var c;
                if (r && !y(a))
                  c = a;
                else if (null == a)
                  c = "";
                else {
                  switch (typeof a) {
                    case "string":
                      break;
                    case "number":
                      a = "" + a;
                      break;
                    default:
                      a = $a(a);
                  }
                  c = a;
                }
                return c;
              } catch (g) {
                c = $b("interr", f, g.toString()), d(c);
              }
            }
            r = !!r;
            for (var v,
                w,
                L = 0,
                J = [],
                A = [],
                P = f.length,
                E = [],
                s = []; L < P; )
              if (-1 != (v = f.indexOf(b, L)) && -1 != (w = f.indexOf(a, v + h)))
                L !== v && E.push(O(f.substring(L, v))), L = f.substring(v + h, w), J.push(L), A.push(c(L, n)), L = w + l, s.push(E.length), E.push("");
              else {
                L !== P && E.push(O(f.substring(L)));
                break;
              }
            if (u && 1 < E.length)
              throw $b("noconcat", f);
            if (!g || J.length) {
              var X = function(a) {
                for (var b = 0,
                    c = J.length; b < c; b++) {
                  if (r && D(a[b]))
                    return;
                  E[s[b]] = a[b];
                }
                return E.join("");
              };
              return z(function(a) {
                var b = 0,
                    c = J.length,
                    e = Array(c);
                try {
                  for (; b < c; b++)
                    e[b] = A[b](a);
                  return X(e);
                } catch (g) {
                  a = $b("interr", f, g.toString()), d(a);
                }
              }, {
                exp: f,
                expressions: J,
                $$watchDelegate: function(a, b, c) {
                  var d;
                  return a.$watchGroup(A, function(c, e) {
                    var f = X(c);
                    G(b) && b.call(this, f, c !== e ? d : f, a);
                    d = f;
                  }, c);
                }
              });
            }
          }
          var h = b.length,
              l = a.length,
              k = new RegExp(b.replace(/./g, f), "g"),
              m = new RegExp(a.replace(/./g, f), "g");
          g.startSymbol = function() {
            return b;
          };
          g.endSymbol = function() {
            return a;
          };
          return g;
        }];
      }
      function Je() {
        this.$get = ["$rootScope", "$window", "$q", "$$q", function(b, a, c, d) {
          function e(e, h, l, k) {
            var m = a.setInterval,
                p = a.clearInterval,
                q = 0,
                u = y(k) && !k,
                r = (u ? d : c).defer(),
                O = r.promise;
            l = y(l) ? l : 0;
            O.then(null, null, e);
            O.$$intervalId = m(function() {
              r.notify(q++);
              0 < l && q >= l && (r.resolve(q), p(O.$$intervalId), delete f[O.$$intervalId]);
              u || b.$apply();
            }, h);
            f[O.$$intervalId] = r;
            return O;
          }
          var f = {};
          e.cancel = function(b) {
            return b && b.$$intervalId in f ? (f[b.$$intervalId].reject("canceled"), a.clearInterval(b.$$intervalId), delete f[b.$$intervalId], !0) : !1;
          };
          return e;
        }];
      }
      function Rd() {
        this.$get = function() {
          return {
            id: "en-us",
            NUMBER_FORMATS: {
              DECIMAL_SEP: ".",
              GROUP_SEP: ",",
              PATTERNS: [{
                minInt: 1,
                minFrac: 0,
                maxFrac: 3,
                posPre: "",
                posSuf: "",
                negPre: "-",
                negSuf: "",
                gSize: 3,
                lgSize: 3
              }, {
                minInt: 1,
                minFrac: 2,
                maxFrac: 2,
                posPre: "\u00a4",
                posSuf: "",
                negPre: "(\u00a4",
                negSuf: ")",
                gSize: 3,
                lgSize: 3
              }],
              CURRENCY_SYM: "$"
            },
            DATETIME_FORMATS: {
              MONTH: "January February March April May June July August September October November December".split(" "),
              SHORTMONTH: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
              DAY: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
              SHORTDAY: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
              AMPMS: ["AM", "PM"],
              medium: "MMM d, y h:mm:ss a",
              "short": "M/d/yy h:mm a",
              fullDate: "EEEE, MMMM d, y",
              longDate: "MMMM d, y",
              mediumDate: "MMM d, y",
              shortDate: "M/d/yy",
              mediumTime: "h:mm:ss a",
              shortTime: "h:mm a"
            },
            pluralCat: function(b) {
              return 1 === b ? "one" : "other";
            }
          };
        };
      }
      function ac(b) {
        b = b.split("/");
        for (var a = b.length; a--; )
          b[a] = qb(b[a]);
        return b.join("/");
      }
      function $c(b, a) {
        var c = Ba(b);
        a.$$protocol = c.protocol;
        a.$$host = c.hostname;
        a.$$port = ba(c.port) || xf[c.protocol] || null;
      }
      function ad(b, a) {
        var c = "/" !== b.charAt(0);
        c && (b = "/" + b);
        var d = Ba(b);
        a.$$path = decodeURIComponent(c && "/" === d.pathname.charAt(0) ? d.pathname.substring(1) : d.pathname);
        a.$$search = qc(d.search);
        a.$$hash = decodeURIComponent(d.hash);
        a.$$path && "/" != a.$$path.charAt(0) && (a.$$path = "/" + a.$$path);
      }
      function za(b, a) {
        if (0 === a.indexOf(b))
          return a.substr(b.length);
      }
      function Ha(b) {
        var a = b.indexOf("#");
        return -1 == a ? b : b.substr(0, a);
      }
      function bd(b) {
        return b.replace(/(#.+)|#$/, "$1");
      }
      function bc(b) {
        return b.substr(0, Ha(b).lastIndexOf("/") + 1);
      }
      function cc(b, a) {
        this.$$html5 = !0;
        a = a || "";
        var c = bc(b);
        $c(b, this);
        this.$$parse = function(a) {
          var b = za(c, a);
          if (!F(b))
            throw Fb("ipthprfx", a, c);
          ad(b, this);
          this.$$path || (this.$$path = "/");
          this.$$compose();
        };
        this.$$compose = function() {
          var a = Nb(this.$$search),
              b = this.$$hash ? "#" + qb(this.$$hash) : "";
          this.$$url = ac(this.$$path) + (a ? "?" + a : "") + b;
          this.$$absUrl = c + this.$$url.substr(1);
        };
        this.$$parseLinkUrl = function(d, e) {
          if (e && "#" === e[0])
            return this.hash(e.slice(1)), !0;
          var f,
              g;
          (f = za(b, d)) !== t ? (g = f, g = (f = za(a, f)) !== t ? c + (za("/", f) || f) : b + g) : (f = za(c, d)) !== t ? g = c + f : c == d + "/" && (g = c);
          g && this.$$parse(g);
          return !!g;
        };
      }
      function dc(b, a) {
        var c = bc(b);
        $c(b, this);
        this.$$parse = function(d) {
          d = za(b, d) || za(c, d);
          var e;
          "#" === d.charAt(0) ? (e = za(a, d), D(e) && (e = d)) : e = this.$$html5 ? d : "";
          ad(e, this);
          d = this.$$path;
          var f = /^\/[A-Z]:(\/.*)/;
          0 === e.indexOf(b) && (e = e.replace(b, ""));
          f.exec(e) || (d = (e = f.exec(d)) ? e[1] : d);
          this.$$path = d;
          this.$$compose();
        };
        this.$$compose = function() {
          var c = Nb(this.$$search),
              e = this.$$hash ? "#" + qb(this.$$hash) : "";
          this.$$url = ac(this.$$path) + (c ? "?" + c : "") + e;
          this.$$absUrl = b + (this.$$url ? a + this.$$url : "");
        };
        this.$$parseLinkUrl = function(a, c) {
          return Ha(b) == Ha(a) ? (this.$$parse(a), !0) : !1;
        };
      }
      function cd(b, a) {
        this.$$html5 = !0;
        dc.apply(this, arguments);
        var c = bc(b);
        this.$$parseLinkUrl = function(d, e) {
          if (e && "#" === e[0])
            return this.hash(e.slice(1)), !0;
          var f,
              g;
          b == Ha(d) ? f = d : (g = za(c, d)) ? f = b + a + g : c === d + "/" && (f = c);
          f && this.$$parse(f);
          return !!f;
        };
        this.$$compose = function() {
          var c = Nb(this.$$search),
              e = this.$$hash ? "#" + qb(this.$$hash) : "";
          this.$$url = ac(this.$$path) + (c ? "?" + c : "") + e;
          this.$$absUrl = b + a + this.$$url;
        };
      }
      function Gb(b) {
        return function() {
          return this[b];
        };
      }
      function dd(b, a) {
        return function(c) {
          if (D(c))
            return this[b];
          this[b] = a(c);
          this.$$compose();
          return this;
        };
      }
      function Me() {
        var b = "",
            a = {
              enabled: !1,
              requireBase: !0,
              rewriteLinks: !0
            };
        this.hashPrefix = function(a) {
          return y(a) ? (b = a, this) : b;
        };
        this.html5Mode = function(b) {
          return Wa(b) ? (a.enabled = b, this) : H(b) ? (Wa(b.enabled) && (a.enabled = b.enabled), Wa(b.requireBase) && (a.requireBase = b.requireBase), Wa(b.rewriteLinks) && (a.rewriteLinks = b.rewriteLinks), this) : a;
        };
        this.$get = ["$rootScope", "$browser", "$sniffer", "$rootElement", "$window", function(c, d, e, f, g) {
          function h(a, b, c) {
            var e = k.url(),
                f = k.$$state;
            try {
              d.url(a, b, c), k.$$state = d.state();
            } catch (g) {
              throw k.url(e), k.$$state = f, g;
            }
          }
          function l(a, b) {
            c.$broadcast("$locationChangeSuccess", k.absUrl(), a, k.$$state, b);
          }
          var k,
              m;
          m = d.baseHref();
          var p = d.url(),
              q;
          if (a.enabled) {
            if (!m && a.requireBase)
              throw Fb("nobase");
            q = p.substring(0, p.indexOf("/", p.indexOf("//") + 2)) + (m || "/");
            m = e.history ? cc : cd;
          } else
            q = Ha(p), m = dc;
          k = new m(q, "#" + b);
          k.$$parseLinkUrl(p, p);
          k.$$state = d.state();
          var u = /^\s*(javascript|mailto):/i;
          f.on("click", function(b) {
            if (a.rewriteLinks && !b.ctrlKey && !b.metaKey && 2 != b.which) {
              for (var e = B(b.target); "a" !== ua(e[0]); )
                if (e[0] === f[0] || !(e = e.parent())[0])
                  return;
              var h = e.prop("href"),
                  l = e.attr("href") || e.attr("xlink:href");
              H(h) && "[object SVGAnimatedString]" === h.toString() && (h = Ba(h.animVal).href);
              u.test(h) || !h || e.attr("target") || b.isDefaultPrevented() || !k.$$parseLinkUrl(h, l) || (b.preventDefault(), k.absUrl() != d.url() && (c.$apply(), g.angular["ff-684208-preventDefault"] = !0));
            }
          });
          k.absUrl() != p && d.url(k.absUrl(), !0);
          var r = !0;
          d.onUrlChange(function(a, b) {
            c.$evalAsync(function() {
              var d = k.absUrl(),
                  e = k.$$state,
                  f;
              k.$$parse(a);
              k.$$state = b;
              f = c.$broadcast("$locationChangeStart", a, d, b, e).defaultPrevented;
              k.absUrl() === a && (f ? (k.$$parse(d), k.$$state = e, h(d, !1, e)) : (r = !1, l(d, e)));
            });
            c.$$phase || c.$digest();
          });
          c.$watch(function() {
            var a = bd(d.url()),
                b = bd(k.absUrl()),
                f = d.state(),
                g = k.$$replace,
                q = a !== b || k.$$html5 && e.history && f !== k.$$state;
            if (r || q)
              r = !1, c.$evalAsync(function() {
                var b = k.absUrl(),
                    d = c.$broadcast("$locationChangeStart", b, a, k.$$state, f).defaultPrevented;
                k.absUrl() === b && (d ? (k.$$parse(a), k.$$state = f) : (q && h(b, g, f === k.$$state ? null : k.$$state), l(a, f)));
              });
            k.$$replace = !1;
          });
          return k;
        }];
      }
      function Ne() {
        var b = !0,
            a = this;
        this.debugEnabled = function(a) {
          return y(a) ? (b = a, this) : b;
        };
        this.$get = ["$window", function(c) {
          function d(a) {
            a instanceof Error && (a.stack ? a = a.message && -1 === a.stack.indexOf(a.message) ? "Error: " + a.message + "\n" + a.stack : a.stack : a.sourceURL && (a = a.message + "\n" + a.sourceURL + ":" + a.line));
            return a;
          }
          function e(a) {
            var b = c.console || {},
                e = b[a] || b.log || C;
            a = !1;
            try {
              a = !!e.apply;
            } catch (l) {}
            return a ? function() {
              var a = [];
              s(arguments, function(b) {
                a.push(d(b));
              });
              return e.apply(b, a);
            } : function(a, b) {
              e(a, null == b ? "" : b);
            };
          }
          return {
            log: e("log"),
            info: e("info"),
            warn: e("warn"),
            error: e("error"),
            debug: function() {
              var c = e("debug");
              return function() {
                b && c.apply(a, arguments);
              };
            }()
          };
        }];
      }
      function sa(b, a) {
        if ("__defineGetter__" === b || "__defineSetter__" === b || "__lookupGetter__" === b || "__lookupSetter__" === b || "__proto__" === b)
          throw la("isecfld", a);
        return b;
      }
      function ta(b, a) {
        if (b) {
          if (b.constructor === b)
            throw la("isecfn", a);
          if (b.window === b)
            throw la("isecwindow", a);
          if (b.children && (b.nodeName || b.prop && b.attr && b.find))
            throw la("isecdom", a);
          if (b === Object)
            throw la("isecobj", a);
        }
        return b;
      }
      function ec(b) {
        return b.constant;
      }
      function gb(b, a, c, d) {
        ta(b, d);
        a = a.split(".");
        for (var e,
            f = 0; 1 < a.length; f++) {
          e = sa(a.shift(), d);
          var g = ta(b[e], d);
          g || (g = {}, b[e] = g);
          b = g;
        }
        e = sa(a.shift(), d);
        ta(b[e], d);
        return b[e] = c;
      }
      function Qa(b) {
        return "constructor" == b;
      }
      function ed(b, a, c, d, e, f, g) {
        sa(b, f);
        sa(a, f);
        sa(c, f);
        sa(d, f);
        sa(e, f);
        var h = function(a) {
          return ta(a, f);
        },
            l = g || Qa(b) ? h : oa,
            k = g || Qa(a) ? h : oa,
            m = g || Qa(c) ? h : oa,
            p = g || Qa(d) ? h : oa,
            q = g || Qa(e) ? h : oa;
        return function(f, g) {
          var h = g && g.hasOwnProperty(b) ? g : f;
          if (null == h)
            return h;
          h = l(h[b]);
          if (!a)
            return h;
          if (null == h)
            return t;
          h = k(h[a]);
          if (!c)
            return h;
          if (null == h)
            return t;
          h = m(h[c]);
          if (!d)
            return h;
          if (null == h)
            return t;
          h = p(h[d]);
          return e ? null == h ? t : h = q(h[e]) : h;
        };
      }
      function yf(b, a) {
        return function(c, d) {
          return b(c, d, ta, a);
        };
      }
      function zf(b, a, c) {
        var d = a.expensiveChecks,
            e = d ? Af : Bf,
            f = e[b];
        if (f)
          return f;
        var g = b.split("."),
            h = g.length;
        if (a.csp)
          f = 6 > h ? ed(g[0], g[1], g[2], g[3], g[4], c, d) : function(a, b) {
            var e = 0,
                f;
            do
              f = ed(g[e++], g[e++], g[e++], g[e++], g[e++], c, d)(a, b), b = t, a = f;
 while (e < h);
            return f;
          };
        else {
          var l = "";
          d && (l += "s = eso(s, fe);\nl = eso(l, fe);\n");
          var k = d;
          s(g, function(a, b) {
            sa(a, c);
            var e = (b ? "s" : '((l&&l.hasOwnProperty("' + a + '"))?l:s)') + "." + a;
            if (d || Qa(a))
              e = "eso(" + e + ", fe)", k = !0;
            l += "if(s == null) return undefined;\ns=" + e + ";\n";
          });
          l += "return s;";
          a = new Function("s", "l", "eso", "fe", l);
          a.toString = da(l);
          k && (a = yf(a, c));
          f = a;
        }
        f.sharedGetter = !0;
        f.assign = function(a, c) {
          return gb(a, b, c, b);
        };
        return e[b] = f;
      }
      function fc(b) {
        return G(b.valueOf) ? b.valueOf() : Cf.call(b);
      }
      function Oe() {
        var b = ha(),
            a = ha();
        this.$get = ["$filter", "$sniffer", function(c, d) {
          function e(a) {
            var b = a;
            a.sharedGetter && (b = function(b, c) {
              return a(b, c);
            }, b.literal = a.literal, b.constant = a.constant, b.assign = a.assign);
            return b;
          }
          function f(a, b) {
            for (var c = 0,
                d = a.length; c < d; c++) {
              var e = a[c];
              e.constant || (e.inputs ? f(e.inputs, b) : -1 === b.indexOf(e) && b.push(e));
            }
            return b;
          }
          function g(a, b) {
            return null == a || null == b ? a === b : "object" === typeof a && (a = fc(a), "object" === typeof a) ? !1 : a === b || a !== a && b !== b;
          }
          function h(a, b, c, d) {
            var e = d.$$inputs || (d.$$inputs = f(d.inputs, [])),
                h;
            if (1 === e.length) {
              var l = g,
                  e = e[0];
              return a.$watch(function(a) {
                var b = e(a);
                g(b, l) || (h = d(a), l = b && fc(b));
                return h;
              }, b, c);
            }
            for (var k = [],
                q = 0,
                p = e.length; q < p; q++)
              k[q] = g;
            return a.$watch(function(a) {
              for (var b = !1,
                  c = 0,
                  f = e.length; c < f; c++) {
                var l = e[c](a);
                if (b || (b = !g(l, k[c])))
                  k[c] = l && fc(l);
              }
              b && (h = d(a));
              return h;
            }, b, c);
          }
          function l(a, b, c, d) {
            var e,
                f;
            return e = a.$watch(function(a) {
              return d(a);
            }, function(a, c, d) {
              f = a;
              G(b) && b.apply(this, arguments);
              y(a) && d.$$postDigest(function() {
                y(f) && e();
              });
            }, c);
          }
          function k(a, b, c, d) {
            function e(a) {
              var b = !0;
              s(a, function(a) {
                y(a) || (b = !1);
              });
              return b;
            }
            var f,
                g;
            return f = a.$watch(function(a) {
              return d(a);
            }, function(a, c, d) {
              g = a;
              G(b) && b.call(this, a, c, d);
              e(a) && d.$$postDigest(function() {
                e(g) && f();
              });
            }, c);
          }
          function m(a, b, c, d) {
            var e;
            return e = a.$watch(function(a) {
              return d(a);
            }, function(a, c, d) {
              G(b) && b.apply(this, arguments);
              e();
            }, c);
          }
          function p(a, b) {
            if (!b)
              return a;
            var c = a.$$watchDelegate,
                c = c !== k && c !== l ? function(c, d) {
                  var e = a(c, d);
                  return b(e, c, d);
                } : function(c, d) {
                  var e = a(c, d),
                      f = b(e, c, d);
                  return y(e) ? f : e;
                };
            a.$$watchDelegate && a.$$watchDelegate !== h ? c.$$watchDelegate = a.$$watchDelegate : b.$stateful || (c.$$watchDelegate = h, c.inputs = [a]);
            return c;
          }
          var q = {
            csp: d.csp,
            expensiveChecks: !1
          },
              u = {
                csp: d.csp,
                expensiveChecks: !0
              };
          return function(d, f, g) {
            var v,
                w,
                L;
            switch (typeof d) {
              case "string":
                L = d = d.trim();
                var J = g ? a : b;
                v = J[L];
                v || (":" === d.charAt(0) && ":" === d.charAt(1) && (w = !0, d = d.substring(2)), g = g ? u : q, v = new gc(g), v = (new hb(v, c, g)).parse(d), v.constant ? v.$$watchDelegate = m : w ? (v = e(v), v.$$watchDelegate = v.literal ? k : l) : v.inputs && (v.$$watchDelegate = h), J[L] = v);
                return p(v, f);
              case "function":
                return p(d, f);
              default:
                return p(C, f);
            }
          };
        }];
      }
      function Qe() {
        this.$get = ["$rootScope", "$exceptionHandler", function(b, a) {
          return fd(function(a) {
            b.$evalAsync(a);
          }, a);
        }];
      }
      function Re() {
        this.$get = ["$browser", "$exceptionHandler", function(b, a) {
          return fd(function(a) {
            b.defer(a);
          }, a);
        }];
      }
      function fd(b, a) {
        function c(a, b, c) {
          function d(b) {
            return function(c) {
              e || (e = !0, b.call(a, c));
            };
          }
          var e = !1;
          return [d(b), d(c)];
        }
        function d() {
          this.$$state = {status: 0};
        }
        function e(a, b) {
          return function(c) {
            b.call(a, c);
          };
        }
        function f(c) {
          !c.processScheduled && c.pending && (c.processScheduled = !0, b(function() {
            var b,
                d,
                e;
            e = c.pending;
            c.processScheduled = !1;
            c.pending = t;
            for (var f = 0,
                g = e.length; f < g; ++f) {
              d = e[f][0];
              b = e[f][c.status];
              try {
                G(b) ? d.resolve(b(c.value)) : 1 === c.status ? d.resolve(c.value) : d.reject(c.value);
              } catch (h) {
                d.reject(h), a(h);
              }
            }
          }));
        }
        function g() {
          this.promise = new d;
          this.resolve = e(this, this.resolve);
          this.reject = e(this, this.reject);
          this.notify = e(this, this.notify);
        }
        var h = T("$q", TypeError);
        d.prototype = {
          then: function(a, b, c) {
            var d = new g;
            this.$$state.pending = this.$$state.pending || [];
            this.$$state.pending.push([d, a, b, c]);
            0 < this.$$state.status && f(this.$$state);
            return d.promise;
          },
          "catch": function(a) {
            return this.then(null, a);
          },
          "finally": function(a, b) {
            return this.then(function(b) {
              return k(b, !0, a);
            }, function(b) {
              return k(b, !1, a);
            }, b);
          }
        };
        g.prototype = {
          resolve: function(a) {
            this.promise.$$state.status || (a === this.promise ? this.$$reject(h("qcycle", a)) : this.$$resolve(a));
          },
          $$resolve: function(b) {
            var d,
                e;
            e = c(this, this.$$resolve, this.$$reject);
            try {
              if (H(b) || G(b))
                d = b && b.then;
              G(d) ? (this.promise.$$state.status = -1, d.call(b, e[0], e[1], this.notify)) : (this.promise.$$state.value = b, this.promise.$$state.status = 1, f(this.promise.$$state));
            } catch (g) {
              e[1](g), a(g);
            }
          },
          reject: function(a) {
            this.promise.$$state.status || this.$$reject(a);
          },
          $$reject: function(a) {
            this.promise.$$state.value = a;
            this.promise.$$state.status = 2;
            f(this.promise.$$state);
          },
          notify: function(c) {
            var d = this.promise.$$state.pending;
            0 >= this.promise.$$state.status && d && d.length && b(function() {
              for (var b,
                  e,
                  f = 0,
                  g = d.length; f < g; f++) {
                e = d[f][0];
                b = d[f][3];
                try {
                  e.notify(G(b) ? b(c) : c);
                } catch (h) {
                  a(h);
                }
              }
            });
          }
        };
        var l = function(a, b) {
          var c = new g;
          b ? c.resolve(a) : c.reject(a);
          return c.promise;
        },
            k = function(a, b, c) {
              var d = null;
              try {
                G(c) && (d = c());
              } catch (e) {
                return l(e, !1);
              }
              return d && G(d.then) ? d.then(function() {
                return l(a, b);
              }, function(a) {
                return l(a, !1);
              }) : l(a, b);
            },
            m = function(a, b, c, d) {
              var e = new g;
              e.resolve(a);
              return e.promise.then(b, c, d);
            },
            p = function u(a) {
              if (!G(a))
                throw h("norslvr", a);
              if (!(this instanceof u))
                return new u(a);
              var b = new g;
              a(function(a) {
                b.resolve(a);
              }, function(a) {
                b.reject(a);
              });
              return b.promise;
            };
        p.defer = function() {
          return new g;
        };
        p.reject = function(a) {
          var b = new g;
          b.reject(a);
          return b.promise;
        };
        p.when = m;
        p.all = function(a) {
          var b = new g,
              c = 0,
              d = x(a) ? [] : {};
          s(a, function(a, e) {
            c++;
            m(a).then(function(a) {
              d.hasOwnProperty(e) || (d[e] = a, --c || b.resolve(d));
            }, function(a) {
              d.hasOwnProperty(e) || b.reject(a);
            });
          });
          0 === c && b.resolve(d);
          return b.promise;
        };
        return p;
      }
      function $e() {
        this.$get = ["$window", "$timeout", function(b, a) {
          var c = b.requestAnimationFrame || b.webkitRequestAnimationFrame,
              d = b.cancelAnimationFrame || b.webkitCancelAnimationFrame || b.webkitCancelRequestAnimationFrame,
              e = !!c,
              f = e ? function(a) {
                var b = c(a);
                return function() {
                  d(b);
                };
              } : function(b) {
                var c = a(b, 16.66, !1);
                return function() {
                  a.cancel(c);
                };
              };
          f.supported = e;
          return f;
        }];
      }
      function Pe() {
        var b = 10,
            a = T("$rootScope"),
            c = null,
            d = null;
        this.digestTtl = function(a) {
          arguments.length && (b = a);
          return b;
        };
        this.$get = ["$injector", "$exceptionHandler", "$parse", "$browser", function(e, f, g, h) {
          function l() {
            this.$id = ++nb;
            this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;
            this.$root = this;
            this.$$destroyed = !1;
            this.$$listeners = {};
            this.$$listenerCount = {};
            this.$$isolateBindings = null;
          }
          function k(b) {
            if (r.$$phase)
              throw a("inprog", r.$$phase);
            r.$$phase = b;
          }
          function m(a, b, c) {
            do
              a.$$listenerCount[c] -= b, 0 === a.$$listenerCount[c] && delete a.$$listenerCount[c];
 while (a = a.$parent);
          }
          function p() {}
          function q() {
            for (; v.length; )
              try {
                v.shift()();
              } catch (a) {
                f(a);
              }
            d = null;
          }
          function u() {
            null === d && (d = h.defer(function() {
              r.$apply(q);
            }));
          }
          l.prototype = {
            constructor: l,
            $new: function(a, b) {
              function c() {
                d.$$destroyed = !0;
              }
              var d;
              b = b || this;
              a ? (d = new l, d.$root = this.$root) : (this.$$ChildScope || (this.$$ChildScope = function() {
                this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null;
                this.$$listeners = {};
                this.$$listenerCount = {};
                this.$id = ++nb;
                this.$$ChildScope = null;
              }, this.$$ChildScope.prototype = this), d = new this.$$ChildScope);
              d.$parent = b;
              d.$$prevSibling = b.$$childTail;
              b.$$childHead ? (b.$$childTail.$$nextSibling = d, b.$$childTail = d) : b.$$childHead = b.$$childTail = d;
              (a || b != this) && d.$on("$destroy", c);
              return d;
            },
            $watch: function(a, b, d) {
              var e = g(a);
              if (e.$$watchDelegate)
                return e.$$watchDelegate(this, b, d, e);
              var f = this.$$watchers,
                  h = {
                    fn: b,
                    last: p,
                    get: e,
                    exp: a,
                    eq: !!d
                  };
              c = null;
              G(b) || (h.fn = C);
              f || (f = this.$$watchers = []);
              f.unshift(h);
              return function() {
                Xa(f, h);
                c = null;
              };
            },
            $watchGroup: function(a, b) {
              function c() {
                h = !1;
                l ? (l = !1, b(e, e, g)) : b(e, d, g);
              }
              var d = Array(a.length),
                  e = Array(a.length),
                  f = [],
                  g = this,
                  h = !1,
                  l = !0;
              if (!a.length) {
                var k = !0;
                g.$evalAsync(function() {
                  k && b(e, e, g);
                });
                return function() {
                  k = !1;
                };
              }
              if (1 === a.length)
                return this.$watch(a[0], function(a, c, f) {
                  e[0] = a;
                  d[0] = c;
                  b(e, a === c ? e : d, f);
                });
              s(a, function(a, b) {
                var l = g.$watch(a, function(a, f) {
                  e[b] = a;
                  d[b] = f;
                  h || (h = !0, g.$evalAsync(c));
                });
                f.push(l);
              });
              return function() {
                for (; f.length; )
                  f.shift()();
              };
            },
            $watchCollection: function(a, b) {
              function c(a) {
                e = a;
                var b,
                    d,
                    g,
                    h;
                if (!D(e)) {
                  if (H(e))
                    if (Ta(e))
                      for (f !== q && (f = q, u = f.length = 0, k++), a = e.length, u !== a && (k++, f.length = u = a), b = 0; b < a; b++)
                        h = f[b], g = e[b], d = h !== h && g !== g, d || h === g || (k++, f[b] = g);
                    else {
                      f !== m && (f = m = {}, u = 0, k++);
                      a = 0;
                      for (b in e)
                        e.hasOwnProperty(b) && (a++, g = e[b], h = f[b], b in f ? (d = h !== h && g !== g, d || h === g || (k++, f[b] = g)) : (u++, f[b] = g, k++));
                      if (u > a)
                        for (b in k++, f)
                          e.hasOwnProperty(b) || (u--, delete f[b]);
                    }
                  else
                    f !== e && (f = e, k++);
                  return k;
                }
              }
              c.$stateful = !0;
              var d = this,
                  e,
                  f,
                  h,
                  l = 1 < b.length,
                  k = 0,
                  p = g(a, c),
                  q = [],
                  m = {},
                  n = !0,
                  u = 0;
              return this.$watch(p, function() {
                n ? (n = !1, b(e, e, d)) : b(e, h, d);
                if (l)
                  if (H(e))
                    if (Ta(e)) {
                      h = Array(e.length);
                      for (var a = 0; a < e.length; a++)
                        h[a] = e[a];
                    } else
                      for (a in h = {}, e)
                        rc.call(e, a) && (h[a] = e[a]);
                  else
                    h = e;
              });
            },
            $digest: function() {
              var e,
                  g,
                  l,
                  m,
                  u,
                  v,
                  s = b,
                  t,
                  W = [],
                  y,
                  I;
              k("$digest");
              h.$$checkUrlChange();
              this === r && null !== d && (h.defer.cancel(d), q());
              c = null;
              do {
                v = !1;
                for (t = this; O.length; ) {
                  try {
                    I = O.shift(), I.scope.$eval(I.expression, I.locals);
                  } catch (B) {
                    f(B);
                  }
                  c = null;
                }
                a: do {
                  if (m = t.$$watchers)
                    for (u = m.length; u--; )
                      try {
                        if (e = m[u])
                          if ((g = e.get(t)) !== (l = e.last) && !(e.eq ? fa(g, l) : "number" === typeof g && "number" === typeof l && isNaN(g) && isNaN(l)))
                            v = !0, c = e, e.last = e.eq ? Ea(g, null) : g, e.fn(g, l === p ? g : l, t), 5 > s && (y = 4 - s, W[y] || (W[y] = []), W[y].push({
                              msg: G(e.exp) ? "fn: " + (e.exp.name || e.exp.toString()) : e.exp,
                              newVal: g,
                              oldVal: l
                            }));
                          else if (e === c) {
                            v = !1;
                            break a;
                          }
                      } catch (D) {
                        f(D);
                      }
                  if (!(m = t.$$childHead || t !== this && t.$$nextSibling))
                    for (; t !== this && !(m = t.$$nextSibling); )
                      t = t.$parent;
                } while (t = m);
                if ((v || O.length) && !s--)
                  throw r.$$phase = null, a("infdig", b, W);
              } while (v || O.length);
              for (r.$$phase = null; n.length; )
                try {
                  n.shift()();
                } catch (ca) {
                  f(ca);
                }
            },
            $destroy: function() {
              if (!this.$$destroyed) {
                var a = this.$parent;
                this.$broadcast("$destroy");
                this.$$destroyed = !0;
                if (this !== r) {
                  for (var b in this.$$listenerCount)
                    m(this, this.$$listenerCount[b], b);
                  a.$$childHead == this && (a.$$childHead = this.$$nextSibling);
                  a.$$childTail == this && (a.$$childTail = this.$$prevSibling);
                  this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling);
                  this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling);
                  this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = C;
                  this.$on = this.$watch = this.$watchGroup = function() {
                    return C;
                  };
                  this.$$listeners = {};
                  this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = this.$root = this.$$watchers = null;
                }
              }
            },
            $eval: function(a, b) {
              return g(a)(this, b);
            },
            $evalAsync: function(a, b) {
              r.$$phase || O.length || h.defer(function() {
                O.length && r.$digest();
              });
              O.push({
                scope: this,
                expression: a,
                locals: b
              });
            },
            $$postDigest: function(a) {
              n.push(a);
            },
            $apply: function(a) {
              try {
                return k("$apply"), this.$eval(a);
              } catch (b) {
                f(b);
              } finally {
                r.$$phase = null;
                try {
                  r.$digest();
                } catch (c) {
                  throw f(c), c;
                }
              }
            },
            $applyAsync: function(a) {
              function b() {
                c.$eval(a);
              }
              var c = this;
              a && v.push(b);
              u();
            },
            $on: function(a, b) {
              var c = this.$$listeners[a];
              c || (this.$$listeners[a] = c = []);
              c.push(b);
              var d = this;
              do
                d.$$listenerCount[a] || (d.$$listenerCount[a] = 0), d.$$listenerCount[a]++;
 while (d = d.$parent);
              var e = this;
              return function() {
                var d = c.indexOf(b);
                -1 !== d && (c[d] = null, m(e, 1, a));
              };
            },
            $emit: function(a, b) {
              var c = [],
                  d,
                  e = this,
                  g = !1,
                  h = {
                    name: a,
                    targetScope: e,
                    stopPropagation: function() {
                      g = !0;
                    },
                    preventDefault: function() {
                      h.defaultPrevented = !0;
                    },
                    defaultPrevented: !1
                  },
                  l = Ya([h], arguments, 1),
                  k,
                  p;
              do {
                d = e.$$listeners[a] || c;
                h.currentScope = e;
                k = 0;
                for (p = d.length; k < p; k++)
                  if (d[k])
                    try {
                      d[k].apply(null, l);
                    } catch (m) {
                      f(m);
                    }
                  else
                    d.splice(k, 1), k--, p--;
                if (g)
                  return h.currentScope = null, h;
                e = e.$parent;
              } while (e);
              h.currentScope = null;
              return h;
            },
            $broadcast: function(a, b) {
              var c = this,
                  d = this,
                  e = {
                    name: a,
                    targetScope: this,
                    preventDefault: function() {
                      e.defaultPrevented = !0;
                    },
                    defaultPrevented: !1
                  };
              if (!this.$$listenerCount[a])
                return e;
              for (var g = Ya([e], arguments, 1),
                  h,
                  l; c = d; ) {
                e.currentScope = c;
                d = c.$$listeners[a] || [];
                h = 0;
                for (l = d.length; h < l; h++)
                  if (d[h])
                    try {
                      d[h].apply(null, g);
                    } catch (k) {
                      f(k);
                    }
                  else
                    d.splice(h, 1), h--, l--;
                if (!(d = c.$$listenerCount[a] && c.$$childHead || c !== this && c.$$nextSibling))
                  for (; c !== this && !(d = c.$$nextSibling); )
                    c = c.$parent;
              }
              e.currentScope = null;
              return e;
            }
          };
          var r = new l,
              O = r.$$asyncQueue = [],
              n = r.$$postDigestQueue = [],
              v = r.$$applyAsyncQueue = [];
          return r;
        }];
      }
      function Sd() {
        var b = /^\s*(https?|ftp|mailto|tel|file):/,
            a = /^\s*((https?|ftp|file|blob):|data:image\/)/;
        this.aHrefSanitizationWhitelist = function(a) {
          return y(a) ? (b = a, this) : b;
        };
        this.imgSrcSanitizationWhitelist = function(b) {
          return y(b) ? (a = b, this) : a;
        };
        this.$get = function() {
          return function(c, d) {
            var e = d ? a : b,
                f;
            f = Ba(c).href;
            return "" === f || f.match(e) ? c : "unsafe:" + f;
          };
        };
      }
      function Df(b) {
        if ("self" === b)
          return b;
        if (F(b)) {
          if (-1 < b.indexOf("***"))
            throw Ca("iwcard", b);
          b = gd(b).replace("\\*\\*", ".*").replace("\\*", "[^:/.?&;]*");
          return new RegExp("^" + b + "$");
        }
        if (ob(b))
          return new RegExp("^" + b.source + "$");
        throw Ca("imatcher");
      }
      function hd(b) {
        var a = [];
        y(b) && s(b, function(b) {
          a.push(Df(b));
        });
        return a;
      }
      function Te() {
        this.SCE_CONTEXTS = ma;
        var b = ["self"],
            a = [];
        this.resourceUrlWhitelist = function(a) {
          arguments.length && (b = hd(a));
          return b;
        };
        this.resourceUrlBlacklist = function(b) {
          arguments.length && (a = hd(b));
          return a;
        };
        this.$get = ["$injector", function(c) {
          function d(a, b) {
            return "self" === a ? Zc(b) : !!a.exec(b.href);
          }
          function e(a) {
            var b = function(a) {
              this.$$unwrapTrustedValue = function() {
                return a;
              };
            };
            a && (b.prototype = new a);
            b.prototype.valueOf = function() {
              return this.$$unwrapTrustedValue();
            };
            b.prototype.toString = function() {
              return this.$$unwrapTrustedValue().toString();
            };
            return b;
          }
          var f = function(a) {
            throw Ca("unsafe");
          };
          c.has("$sanitize") && (f = c.get("$sanitize"));
          var g = e(),
              h = {};
          h[ma.HTML] = e(g);
          h[ma.CSS] = e(g);
          h[ma.URL] = e(g);
          h[ma.JS] = e(g);
          h[ma.RESOURCE_URL] = e(h[ma.URL]);
          return {
            trustAs: function(a, b) {
              var c = h.hasOwnProperty(a) ? h[a] : null;
              if (!c)
                throw Ca("icontext", a, b);
              if (null === b || b === t || "" === b)
                return b;
              if ("string" !== typeof b)
                throw Ca("itype", a);
              return new c(b);
            },
            getTrusted: function(c, e) {
              if (null === e || e === t || "" === e)
                return e;
              var g = h.hasOwnProperty(c) ? h[c] : null;
              if (g && e instanceof g)
                return e.$$unwrapTrustedValue();
              if (c === ma.RESOURCE_URL) {
                var g = Ba(e.toString()),
                    p,
                    q,
                    u = !1;
                p = 0;
                for (q = b.length; p < q; p++)
                  if (d(b[p], g)) {
                    u = !0;
                    break;
                  }
                if (u)
                  for (p = 0, q = a.length; p < q; p++)
                    if (d(a[p], g)) {
                      u = !1;
                      break;
                    }
                if (u)
                  return e;
                throw Ca("insecurl", e.toString());
              }
              if (c === ma.HTML)
                return f(e);
              throw Ca("unsafe");
            },
            valueOf: function(a) {
              return a instanceof g ? a.$$unwrapTrustedValue() : a;
            }
          };
        }];
      }
      function Se() {
        var b = !0;
        this.enabled = function(a) {
          arguments.length && (b = !!a);
          return b;
        };
        this.$get = ["$parse", "$sceDelegate", function(a, c) {
          if (b && 8 > Ra)
            throw Ca("iequirks");
          var d = qa(ma);
          d.isEnabled = function() {
            return b;
          };
          d.trustAs = c.trustAs;
          d.getTrusted = c.getTrusted;
          d.valueOf = c.valueOf;
          b || (d.trustAs = d.getTrusted = function(a, b) {
            return b;
          }, d.valueOf = oa);
          d.parseAs = function(b, c) {
            var e = a(c);
            return e.literal && e.constant ? e : a(c, function(a) {
              return d.getTrusted(b, a);
            });
          };
          var e = d.parseAs,
              f = d.getTrusted,
              g = d.trustAs;
          s(ma, function(a, b) {
            var c = Q(b);
            d[cb("parse_as_" + c)] = function(b) {
              return e(a, b);
            };
            d[cb("get_trusted_" + c)] = function(b) {
              return f(a, b);
            };
            d[cb("trust_as_" + c)] = function(b) {
              return g(a, b);
            };
          });
          return d;
        }];
      }
      function Ue() {
        this.$get = ["$window", "$document", function(b, a) {
          var c = {},
              d = ba((/android (\d+)/.exec(Q((b.navigator || {}).userAgent)) || [])[1]),
              e = /Boxee/i.test((b.navigator || {}).userAgent),
              f = a[0] || {},
              g,
              h = /^(Moz|webkit|ms)(?=[A-Z])/,
              l = f.body && f.body.style,
              k = !1,
              m = !1;
          if (l) {
            for (var p in l)
              if (k = h.exec(p)) {
                g = k[0];
                g = g.substr(0, 1).toUpperCase() + g.substr(1);
                break;
              }
            g || (g = "WebkitOpacity" in l && "webkit");
            k = !!("transition" in l || g + "Transition" in l);
            m = !!("animation" in l || g + "Animation" in l);
            !d || k && m || (k = F(f.body.style.webkitTransition), m = F(f.body.style.webkitAnimation));
          }
          return {
            history: !(!b.history || !b.history.pushState || 4 > d || e),
            hasEvent: function(a) {
              if ("input" === a && 11 >= Ra)
                return !1;
              if (D(c[a])) {
                var b = f.createElement("div");
                c[a] = "on" + a in b;
              }
              return c[a];
            },
            csp: ab(),
            vendorPrefix: g,
            transitions: k,
            animations: m,
            android: d
          };
        }];
      }
      function We() {
        this.$get = ["$templateCache", "$http", "$q", function(b, a, c) {
          function d(e, f) {
            d.totalPendingRequests++;
            var g = a.defaults && a.defaults.transformResponse;
            x(g) ? g = g.filter(function(a) {
              return a !== Yb;
            }) : g === Yb && (g = null);
            return a.get(e, {
              cache: b,
              transformResponse: g
            }).then(function(a) {
              d.totalPendingRequests--;
              return a.data;
            }, function(a) {
              d.totalPendingRequests--;
              if (!f)
                throw ja("tpload", e);
              return c.reject(a);
            });
          }
          d.totalPendingRequests = 0;
          return d;
        }];
      }
      function Xe() {
        this.$get = ["$rootScope", "$browser", "$location", function(b, a, c) {
          return {
            findBindings: function(a, b, c) {
              a = a.getElementsByClassName("ng-binding");
              var g = [];
              s(a, function(a) {
                var d = ga.element(a).data("$binding");
                d && s(d, function(d) {
                  c ? (new RegExp("(^|\\s)" + gd(b) + "(\\s|\\||$)")).test(d) && g.push(a) : -1 != d.indexOf(b) && g.push(a);
                });
              });
              return g;
            },
            findModels: function(a, b, c) {
              for (var g = ["ng-", "data-ng-", "ng\\:"],
                  h = 0; h < g.length; ++h) {
                var l = a.querySelectorAll("[" + g[h] + "model" + (c ? "=" : "*=") + '"' + b + '"]');
                if (l.length)
                  return l;
              }
            },
            getLocation: function() {
              return c.url();
            },
            setLocation: function(a) {
              a !== c.url() && (c.url(a), b.$digest());
            },
            whenStable: function(b) {
              a.notifyWhenNoOutstandingRequests(b);
            }
          };
        }];
      }
      function Ye() {
        this.$get = ["$rootScope", "$browser", "$q", "$$q", "$exceptionHandler", function(b, a, c, d, e) {
          function f(f, l, k) {
            var m = y(k) && !k,
                p = (m ? d : c).defer(),
                q = p.promise;
            l = a.defer(function() {
              try {
                p.resolve(f());
              } catch (a) {
                p.reject(a), e(a);
              } finally {
                delete g[q.$$timeoutId];
              }
              m || b.$apply();
            }, l);
            q.$$timeoutId = l;
            g[l] = p;
            return q;
          }
          var g = {};
          f.cancel = function(b) {
            return b && b.$$timeoutId in g ? (g[b.$$timeoutId].reject("canceled"), delete g[b.$$timeoutId], a.defer.cancel(b.$$timeoutId)) : !1;
          };
          return f;
        }];
      }
      function Ba(b) {
        Ra && (Z.setAttribute("href", b), b = Z.href);
        Z.setAttribute("href", b);
        return {
          href: Z.href,
          protocol: Z.protocol ? Z.protocol.replace(/:$/, "") : "",
          host: Z.host,
          search: Z.search ? Z.search.replace(/^\?/, "") : "",
          hash: Z.hash ? Z.hash.replace(/^#/, "") : "",
          hostname: Z.hostname,
          port: Z.port,
          pathname: "/" === Z.pathname.charAt(0) ? Z.pathname : "/" + Z.pathname
        };
      }
      function Zc(b) {
        b = F(b) ? Ba(b) : b;
        return b.protocol === id.protocol && b.host === id.host;
      }
      function Ze() {
        this.$get = da(M);
      }
      function Dc(b) {
        function a(c, d) {
          if (H(c)) {
            var e = {};
            s(c, function(b, c) {
              e[c] = a(c, b);
            });
            return e;
          }
          return b.factory(c + "Filter", d);
        }
        this.register = a;
        this.$get = ["$injector", function(a) {
          return function(b) {
            return a.get(b + "Filter");
          };
        }];
        a("currency", jd);
        a("date", kd);
        a("filter", Ef);
        a("json", Ff);
        a("limitTo", Gf);
        a("lowercase", Hf);
        a("number", ld);
        a("orderBy", md);
        a("uppercase", If);
      }
      function Ef() {
        return function(b, a, c) {
          if (!x(b))
            return b;
          var d;
          switch (typeof a) {
            case "function":
              break;
            case "boolean":
            case "number":
            case "string":
              d = !0;
            case "object":
              a = Jf(a, c, d);
              break;
            default:
              return b;
          }
          return b.filter(a);
        };
      }
      function Jf(b, a, c) {
        var d = H(b) && "$" in b;
        !0 === a ? a = fa : G(a) || (a = function(a, b) {
          if (H(a) || H(b))
            return !1;
          a = Q("" + a);
          b = Q("" + b);
          return -1 !== a.indexOf(b);
        });
        return function(e) {
          return d && !H(e) ? Ia(e, b.$, a, !1) : Ia(e, b, a, c);
        };
      }
      function Ia(b, a, c, d, e) {
        var f = typeof b,
            g = typeof a;
        if ("string" === g && "!" === a.charAt(0))
          return !Ia(b, a.substring(1), c, d);
        if ("array" === f)
          return b.some(function(b) {
            return Ia(b, a, c, d);
          });
        switch (f) {
          case "object":
            var h;
            if (d) {
              for (h in b)
                if ("$" !== h.charAt(0) && Ia(b[h], a, c, !0))
                  return !0;
              return e ? !1 : Ia(b, a, c, !1);
            }
            if ("object" === g) {
              for (h in a)
                if (e = a[h], !G(e) && (f = "$" === h, !Ia(f ? b : b[h], e, c, f, f)))
                  return !1;
              return !0;
            }
            return c(b, a);
          case "function":
            return !1;
          default:
            return c(b, a);
        }
      }
      function jd(b) {
        var a = b.NUMBER_FORMATS;
        return function(b, d, e) {
          D(d) && (d = a.CURRENCY_SYM);
          D(e) && (e = a.PATTERNS[1].maxFrac);
          return null == b ? b : nd(b, a.PATTERNS[1], a.GROUP_SEP, a.DECIMAL_SEP, e).replace(/\u00A4/g, d);
        };
      }
      function ld(b) {
        var a = b.NUMBER_FORMATS;
        return function(b, d) {
          return null == b ? b : nd(b, a.PATTERNS[0], a.GROUP_SEP, a.DECIMAL_SEP, d);
        };
      }
      function nd(b, a, c, d, e) {
        if (!isFinite(b) || H(b))
          return "";
        var f = 0 > b;
        b = Math.abs(b);
        var g = b + "",
            h = "",
            l = [],
            k = !1;
        if (-1 !== g.indexOf("e")) {
          var m = g.match(/([\d\.]+)e(-?)(\d+)/);
          m && "-" == m[2] && m[3] > e + 1 ? b = 0 : (h = g, k = !0);
        }
        if (k)
          0 < e && 1 > b && (h = b.toFixed(e), b = parseFloat(h));
        else {
          g = (g.split(od)[1] || "").length;
          D(e) && (e = Math.min(Math.max(a.minFrac, g), a.maxFrac));
          b = +(Math.round(+(b.toString() + "e" + e)).toString() + "e" + -e);
          var g = ("" + b).split(od),
              k = g[0],
              g = g[1] || "",
              p = 0,
              q = a.lgSize,
              u = a.gSize;
          if (k.length >= q + u)
            for (p = k.length - q, m = 0; m < p; m++)
              0 === (p - m) % u && 0 !== m && (h += c), h += k.charAt(m);
          for (m = p; m < k.length; m++)
            0 === (k.length - m) % q && 0 !== m && (h += c), h += k.charAt(m);
          for (; g.length < e; )
            g += "0";
          e && "0" !== e && (h += d + g.substr(0, e));
        }
        0 === b && (f = !1);
        l.push(f ? a.negPre : a.posPre, h, f ? a.negSuf : a.posSuf);
        return l.join("");
      }
      function Hb(b, a, c) {
        var d = "";
        0 > b && (d = "-", b = -b);
        for (b = "" + b; b.length < a; )
          b = "0" + b;
        c && (b = b.substr(b.length - a));
        return d + b;
      }
      function $(b, a, c, d) {
        c = c || 0;
        return function(e) {
          e = e["get" + b]();
          if (0 < c || e > -c)
            e += c;
          0 === e && -12 == c && (e = 12);
          return Hb(e, a, d);
        };
      }
      function Ib(b, a) {
        return function(c, d) {
          var e = c["get" + b](),
              f = ub(a ? "SHORT" + b : b);
          return d[f][e];
        };
      }
      function pd(b) {
        var a = (new Date(b, 0, 1)).getDay();
        return new Date(b, 0, (4 >= a ? 5 : 12) - a);
      }
      function qd(b) {
        return function(a) {
          var c = pd(a.getFullYear());
          a = +new Date(a.getFullYear(), a.getMonth(), a.getDate() + (4 - a.getDay())) - +c;
          a = 1 + Math.round(a / 6048E5);
          return Hb(a, b);
        };
      }
      function kd(b) {
        function a(a) {
          var b;
          if (b = a.match(c)) {
            a = new Date(0);
            var f = 0,
                g = 0,
                h = b[8] ? a.setUTCFullYear : a.setFullYear,
                l = b[8] ? a.setUTCHours : a.setHours;
            b[9] && (f = ba(b[9] + b[10]), g = ba(b[9] + b[11]));
            h.call(a, ba(b[1]), ba(b[2]) - 1, ba(b[3]));
            f = ba(b[4] || 0) - f;
            g = ba(b[5] || 0) - g;
            h = ba(b[6] || 0);
            b = Math.round(1E3 * parseFloat("0." + (b[7] || 0)));
            l.call(a, f, g, h, b);
          }
          return a;
        }
        var c = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
        return function(c, e, f) {
          var g = "",
              h = [],
              l,
              k;
          e = e || "mediumDate";
          e = b.DATETIME_FORMATS[e] || e;
          F(c) && (c = Kf.test(c) ? ba(c) : a(c));
          V(c) && (c = new Date(c));
          if (!pa(c))
            return c;
          for (; e; )
            (k = Lf.exec(e)) ? (h = Ya(h, k, 1), e = h.pop()) : (h.push(e), e = null);
          f && "UTC" === f && (c = new Date(c.getTime()), c.setMinutes(c.getMinutes() + c.getTimezoneOffset()));
          s(h, function(a) {
            l = Mf[a];
            g += l ? l(c, b.DATETIME_FORMATS) : a.replace(/(^'|'$)/g, "").replace(/''/g, "'");
          });
          return g;
        };
      }
      function Ff() {
        return function(b, a) {
          D(a) && (a = 2);
          return $a(b, a);
        };
      }
      function Gf() {
        return function(b, a) {
          V(b) && (b = b.toString());
          if (!x(b) && !F(b))
            return b;
          a = Infinity === Math.abs(Number(a)) ? Number(a) : ba(a);
          if (F(b))
            return a ? 0 <= a ? b.slice(0, a) : b.slice(a, b.length) : "";
          var c,
              d;
          a > b.length ? a = b.length : a < -b.length && (a = -b.length);
          if (0 < a)
            c = 0, d = a;
          else {
            if (!a)
              return [];
            c = b.length + a;
            d = b.length;
          }
          return b.slice(c, d);
        };
      }
      function md(b) {
        return function(a, c, d) {
          function e(a, b) {
            return b ? function(b, c) {
              return a(c, b);
            } : a;
          }
          function f(a) {
            switch (typeof a) {
              case "number":
              case "boolean":
              case "string":
                return !0;
              default:
                return !1;
            }
          }
          function g(a) {
            return null === a ? "null" : "function" === typeof a.valueOf && (a = a.valueOf(), f(a)) || "function" === typeof a.toString && (a = a.toString(), f(a)) ? a : "";
          }
          function h(a, b) {
            var c = typeof a,
                d = typeof b;
            c === d && "object" === c && (a = g(a), b = g(b));
            return c === d ? ("string" === c && (a = a.toLowerCase(), b = b.toLowerCase()), a === b ? 0 : a < b ? -1 : 1) : c < d ? -1 : 1;
          }
          if (!Ta(a))
            return a;
          c = x(c) ? c : [c];
          0 === c.length && (c = ["+"]);
          c = c.map(function(a) {
            var c = !1,
                d = a || oa;
            if (F(a)) {
              if ("+" == a.charAt(0) || "-" == a.charAt(0))
                c = "-" == a.charAt(0), a = a.substring(1);
              if ("" === a)
                return e(h, c);
              d = b(a);
              if (d.constant) {
                var f = d();
                return e(function(a, b) {
                  return h(a[f], b[f]);
                }, c);
              }
            }
            return e(function(a, b) {
              return h(d(a), d(b));
            }, c);
          });
          return Za.call(a).sort(e(function(a, b) {
            for (var d = 0; d < c.length; d++) {
              var e = c[d](a, b);
              if (0 !== e)
                return e;
            }
            return 0;
          }, d));
        };
      }
      function Ja(b) {
        G(b) && (b = {link: b});
        b.restrict = b.restrict || "AC";
        return da(b);
      }
      function rd(b, a, c, d, e) {
        var f = this,
            g = [],
            h = f.$$parentForm = b.parent().controller("form") || Jb;
        f.$error = {};
        f.$$success = {};
        f.$pending = t;
        f.$name = e(a.name || a.ngForm || "")(c);
        f.$dirty = !1;
        f.$pristine = !0;
        f.$valid = !0;
        f.$invalid = !1;
        f.$submitted = !1;
        h.$addControl(f);
        f.$rollbackViewValue = function() {
          s(g, function(a) {
            a.$rollbackViewValue();
          });
        };
        f.$commitViewValue = function() {
          s(g, function(a) {
            a.$commitViewValue();
          });
        };
        f.$addControl = function(a) {
          Ma(a.$name, "input");
          g.push(a);
          a.$name && (f[a.$name] = a);
        };
        f.$$renameControl = function(a, b) {
          var c = a.$name;
          f[c] === a && delete f[c];
          f[b] = a;
          a.$name = b;
        };
        f.$removeControl = function(a) {
          a.$name && f[a.$name] === a && delete f[a.$name];
          s(f.$pending, function(b, c) {
            f.$setValidity(c, null, a);
          });
          s(f.$error, function(b, c) {
            f.$setValidity(c, null, a);
          });
          Xa(g, a);
        };
        sd({
          ctrl: this,
          $element: b,
          set: function(a, b, c) {
            var d = a[b];
            d ? -1 === d.indexOf(c) && d.push(c) : a[b] = [c];
          },
          unset: function(a, b, c) {
            var d = a[b];
            d && (Xa(d, c), 0 === d.length && delete a[b]);
          },
          parentForm: h,
          $animate: d
        });
        f.$setDirty = function() {
          d.removeClass(b, Sa);
          d.addClass(b, Kb);
          f.$dirty = !0;
          f.$pristine = !1;
          h.$setDirty();
        };
        f.$setPristine = function() {
          d.setClass(b, Sa, Kb + " ng-submitted");
          f.$dirty = !1;
          f.$pristine = !0;
          f.$submitted = !1;
          s(g, function(a) {
            a.$setPristine();
          });
        };
        f.$setUntouched = function() {
          s(g, function(a) {
            a.$setUntouched();
          });
        };
        f.$setSubmitted = function() {
          d.addClass(b, "ng-submitted");
          f.$submitted = !0;
          h.$setSubmitted();
        };
      }
      function hc(b) {
        b.$formatters.push(function(a) {
          return b.$isEmpty(a) ? a : a.toString();
        });
      }
      function ib(b, a, c, d, e, f) {
        var g = Q(a[0].type);
        if (!e.android) {
          var h = !1;
          a.on("compositionstart", function(a) {
            h = !0;
          });
          a.on("compositionend", function() {
            h = !1;
            l();
          });
        }
        var l = function(b) {
          k && (f.defer.cancel(k), k = null);
          if (!h) {
            var e = a.val();
            b = b && b.type;
            "password" === g || c.ngTrim && "false" === c.ngTrim || (e = U(e));
            (d.$viewValue !== e || "" === e && d.$$hasNativeValidators) && d.$setViewValue(e, b);
          }
        };
        if (e.hasEvent("input"))
          a.on("input", l);
        else {
          var k,
              m = function(a, b, c) {
                k || (k = f.defer(function() {
                  k = null;
                  b && b.value === c || l(a);
                }));
              };
          a.on("keydown", function(a) {
            var b = a.keyCode;
            91 === b || 15 < b && 19 > b || 37 <= b && 40 >= b || m(a, this, this.value);
          });
          if (e.hasEvent("paste"))
            a.on("paste cut", m);
        }
        a.on("change", l);
        d.$render = function() {
          a.val(d.$isEmpty(d.$viewValue) ? "" : d.$viewValue);
        };
      }
      function Lb(b, a) {
        return function(c, d) {
          var e,
              f;
          if (pa(c))
            return c;
          if (F(c)) {
            '"' == c.charAt(0) && '"' == c.charAt(c.length - 1) && (c = c.substring(1, c.length - 1));
            if (Nf.test(c))
              return new Date(c);
            b.lastIndex = 0;
            if (e = b.exec(c))
              return e.shift(), f = d ? {
                yyyy: d.getFullYear(),
                MM: d.getMonth() + 1,
                dd: d.getDate(),
                HH: d.getHours(),
                mm: d.getMinutes(),
                ss: d.getSeconds(),
                sss: d.getMilliseconds() / 1E3
              } : {
                yyyy: 1970,
                MM: 1,
                dd: 1,
                HH: 0,
                mm: 0,
                ss: 0,
                sss: 0
              }, s(e, function(b, c) {
                c < a.length && (f[a[c]] = +b);
              }), new Date(f.yyyy, f.MM - 1, f.dd, f.HH, f.mm, f.ss || 0, 1E3 * f.sss || 0);
          }
          return NaN;
        };
      }
      function jb(b, a, c, d) {
        return function(e, f, g, h, l, k, m) {
          function p(a) {
            return a && !(a.getTime && a.getTime() !== a.getTime());
          }
          function q(a) {
            return y(a) ? pa(a) ? a : c(a) : t;
          }
          td(e, f, g, h);
          ib(e, f, g, h, l, k);
          var u = h && h.$options && h.$options.timezone,
              r;
          h.$$parserName = b;
          h.$parsers.push(function(b) {
            return h.$isEmpty(b) ? null : a.test(b) ? (b = c(b, r), "UTC" === u && b.setMinutes(b.getMinutes() - b.getTimezoneOffset()), b) : t;
          });
          h.$formatters.push(function(a) {
            if (a && !pa(a))
              throw Mb("datefmt", a);
            if (p(a)) {
              if ((r = a) && "UTC" === u) {
                var b = 6E4 * r.getTimezoneOffset();
                r = new Date(r.getTime() + b);
              }
              return m("date")(a, d, u);
            }
            r = null;
            return "";
          });
          if (y(g.min) || g.ngMin) {
            var s;
            h.$validators.min = function(a) {
              return !p(a) || D(s) || c(a) >= s;
            };
            g.$observe("min", function(a) {
              s = q(a);
              h.$validate();
            });
          }
          if (y(g.max) || g.ngMax) {
            var n;
            h.$validators.max = function(a) {
              return !p(a) || D(n) || c(a) <= n;
            };
            g.$observe("max", function(a) {
              n = q(a);
              h.$validate();
            });
          }
        };
      }
      function td(b, a, c, d) {
        (d.$$hasNativeValidators = H(a[0].validity)) && d.$parsers.push(function(b) {
          var c = a.prop("validity") || {};
          return c.badInput && !c.typeMismatch ? t : b;
        });
      }
      function ud(b, a, c, d, e) {
        if (y(d)) {
          b = b(d);
          if (!b.constant)
            throw T("ngModel")("constexpr", c, d);
          return b(a);
        }
        return e;
      }
      function sd(b) {
        function a(a, b) {
          b && !f[a] ? (k.addClass(e, a), f[a] = !0) : !b && f[a] && (k.removeClass(e, a), f[a] = !1);
        }
        function c(b, c) {
          b = b ? "-" + tc(b, "-") : "";
          a(kb + b, !0 === c);
          a(vd + b, !1 === c);
        }
        var d = b.ctrl,
            e = b.$element,
            f = {},
            g = b.set,
            h = b.unset,
            l = b.parentForm,
            k = b.$animate;
        f[vd] = !(f[kb] = e.hasClass(kb));
        d.$setValidity = function(b, e, f) {
          e === t ? (d.$pending || (d.$pending = {}), g(d.$pending, b, f)) : (d.$pending && h(d.$pending, b, f), wd(d.$pending) && (d.$pending = t));
          Wa(e) ? e ? (h(d.$error, b, f), g(d.$$success, b, f)) : (g(d.$error, b, f), h(d.$$success, b, f)) : (h(d.$error, b, f), h(d.$$success, b, f));
          d.$pending ? (a(xd, !0), d.$valid = d.$invalid = t, c("", null)) : (a(xd, !1), d.$valid = wd(d.$error), d.$invalid = !d.$valid, c("", d.$valid));
          e = d.$pending && d.$pending[b] ? t : d.$error[b] ? !1 : d.$$success[b] ? !0 : null;
          c(b, e);
          l.$setValidity(b, e, d);
        };
      }
      function wd(b) {
        if (b)
          for (var a in b)
            return !1;
        return !0;
      }
      function ic(b, a) {
        b = "ngClass" + b;
        return ["$animate", function(c) {
          function d(a, b) {
            var c = [],
                d = 0;
            a: for (; d < a.length; d++) {
              for (var e = a[d],
                  m = 0; m < b.length; m++)
                if (e == b[m])
                  continue a;
              c.push(e);
            }
            return c;
          }
          function e(a) {
            if (!x(a)) {
              if (F(a))
                return a.split(" ");
              if (H(a)) {
                var b = [];
                s(a, function(a, c) {
                  a && (b = b.concat(c.split(" ")));
                });
                return b;
              }
            }
            return a;
          }
          return {
            restrict: "AC",
            link: function(f, g, h) {
              function l(a, b) {
                var c = g.data("$classCounts") || {},
                    d = [];
                s(a, function(a) {
                  if (0 < b || c[a])
                    c[a] = (c[a] || 0) + b, c[a] === +(0 < b) && d.push(a);
                });
                g.data("$classCounts", c);
                return d.join(" ");
              }
              function k(b) {
                if (!0 === a || f.$index % 2 === a) {
                  var k = e(b || []);
                  if (!m) {
                    var u = l(k, 1);
                    h.$addClass(u);
                  } else if (!fa(b, m)) {
                    var r = e(m),
                        u = d(k, r),
                        k = d(r, k),
                        u = l(u, 1),
                        k = l(k, -1);
                    u && u.length && c.addClass(g, u);
                    k && k.length && c.removeClass(g, k);
                  }
                }
                m = qa(b);
              }
              var m;
              f.$watch(h[b], k, !0);
              h.$observe("class", function(a) {
                k(f.$eval(h[b]));
              });
              "ngClass" !== b && f.$watch("$index", function(c, d) {
                var g = c & 1;
                if (g !== (d & 1)) {
                  var k = e(f.$eval(h[b]));
                  g === a ? (g = l(k, 1), h.$addClass(g)) : (g = l(k, -1), h.$removeClass(g));
                }
              });
            }
          };
        }];
      }
      var Of = /^\/(.+)\/([a-z]*)$/,
          Q = function(b) {
            return F(b) ? b.toLowerCase() : b;
          },
          rc = Object.prototype.hasOwnProperty,
          ub = function(b) {
            return F(b) ? b.toUpperCase() : b;
          },
          Ra,
          B,
          ra,
          Za = [].slice,
          rf = [].splice,
          Pf = [].push,
          Da = Object.prototype.toString,
          Ka = T("ng"),
          ga = M.angular || (M.angular = {}),
          bb,
          nb = 0;
      Ra = Y.documentMode;
      C.$inject = [];
      oa.$inject = [];
      var x = Array.isArray,
          U = function(b) {
            return F(b) ? b.trim() : b;
          },
          gd = function(b) {
            return b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
          },
          ab = function() {
            if (y(ab.isActive_))
              return ab.isActive_;
            var b = !(!Y.querySelector("[ng-csp]") && !Y.querySelector("[data-ng-csp]"));
            if (!b)
              try {
                new Function("");
              } catch (a) {
                b = !0;
              }
            return ab.isActive_ = b;
          },
          rb = ["ng-", "data-ng-", "ng:", "x-ng-"],
          Md = /[A-Z]/g,
          uc = !1,
          Pb,
          na = 1,
          pb = 3,
          Qd = {
            full: "1.3.8",
            major: 1,
            minor: 3,
            dot: 8,
            codeName: "prophetic-narwhal"
          };
      R.expando = "ng339";
      var zb = R.cache = {},
          hf = 1;
      R._data = function(b) {
        return this.cache[b[this.expando]] || {};
      };
      var cf = /([\:\-\_]+(.))/g,
          df = /^moz([A-Z])/,
          Qf = {
            mouseleave: "mouseout",
            mouseenter: "mouseover"
          },
          Sb = T("jqLite"),
          gf = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
          Rb = /<|&#?\w+;/,
          ef = /<([\w:]+)/,
          ff = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
          ia = {
            option: [1, '<select multiple="multiple">', "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
          };
      ia.optgroup = ia.option;
      ia.tbody = ia.tfoot = ia.colgroup = ia.caption = ia.thead;
      ia.th = ia.td;
      var La = R.prototype = {
        ready: function(b) {
          function a() {
            c || (c = !0, b());
          }
          var c = !1;
          "complete" === Y.readyState ? setTimeout(a) : (this.on("DOMContentLoaded", a), R(M).on("load", a));
        },
        toString: function() {
          var b = [];
          s(this, function(a) {
            b.push("" + a);
          });
          return "[" + b.join(", ") + "]";
        },
        eq: function(b) {
          return 0 <= b ? B(this[b]) : B(this[this.length + b]);
        },
        length: 0,
        push: Pf,
        sort: [].sort,
        splice: [].splice
      },
          Eb = {};
      s("multiple selected checked disabled readOnly required open".split(" "), function(b) {
        Eb[Q(b)] = b;
      });
      var Mc = {};
      s("input select option textarea button form details".split(" "), function(b) {
        Mc[b] = !0;
      });
      var Nc = {
        ngMinlength: "minlength",
        ngMaxlength: "maxlength",
        ngMin: "min",
        ngMax: "max",
        ngPattern: "pattern"
      };
      s({
        data: Ub,
        removeData: xb
      }, function(b, a) {
        R[a] = b;
      });
      s({
        data: Ub,
        inheritedData: Db,
        scope: function(b) {
          return B.data(b, "$scope") || Db(b.parentNode || b, ["$isolateScope", "$scope"]);
        },
        isolateScope: function(b) {
          return B.data(b, "$isolateScope") || B.data(b, "$isolateScopeNoTemplate");
        },
        controller: Ic,
        injector: function(b) {
          return Db(b, "$injector");
        },
        removeAttr: function(b, a) {
          b.removeAttribute(a);
        },
        hasClass: Ab,
        css: function(b, a, c) {
          a = cb(a);
          if (y(c))
            b.style[a] = c;
          else
            return b.style[a];
        },
        attr: function(b, a, c) {
          var d = Q(a);
          if (Eb[d])
            if (y(c))
              c ? (b[a] = !0, b.setAttribute(a, d)) : (b[a] = !1, b.removeAttribute(d));
            else
              return b[a] || (b.attributes.getNamedItem(a) || C).specified ? d : t;
          else if (y(c))
            b.setAttribute(a, c);
          else if (b.getAttribute)
            return b = b.getAttribute(a, 2), null === b ? t : b;
        },
        prop: function(b, a, c) {
          if (y(c))
            b[a] = c;
          else
            return b[a];
        },
        text: function() {
          function b(a, b) {
            if (D(b)) {
              var d = a.nodeType;
              return d === na || d === pb ? a.textContent : "";
            }
            a.textContent = b;
          }
          b.$dv = "";
          return b;
        }(),
        val: function(b, a) {
          if (D(a)) {
            if (b.multiple && "select" === ua(b)) {
              var c = [];
              s(b.options, function(a) {
                a.selected && c.push(a.value || a.text);
              });
              return 0 === c.length ? null : c;
            }
            return b.value;
          }
          b.value = a;
        },
        html: function(b, a) {
          if (D(a))
            return b.innerHTML;
          wb(b, !0);
          b.innerHTML = a;
        },
        empty: Jc
      }, function(b, a) {
        R.prototype[a] = function(a, d) {
          var e,
              f,
              g = this.length;
          if (b !== Jc && (2 == b.length && b !== Ab && b !== Ic ? a : d) === t) {
            if (H(a)) {
              for (e = 0; e < g; e++)
                if (b === Ub)
                  b(this[e], a);
                else
                  for (f in a)
                    b(this[e], f, a[f]);
              return this;
            }
            e = b.$dv;
            g = e === t ? Math.min(g, 1) : g;
            for (f = 0; f < g; f++) {
              var h = b(this[f], a, d);
              e = e ? e + h : h;
            }
            return e;
          }
          for (e = 0; e < g; e++)
            b(this[e], a, d);
          return this;
        };
      });
      s({
        removeData: xb,
        on: function a(c, d, e, f) {
          if (y(f))
            throw Sb("onargs");
          if (Ec(c)) {
            var g = yb(c, !0);
            f = g.events;
            var h = g.handle;
            h || (h = g.handle = lf(c, f));
            for (var g = 0 <= d.indexOf(" ") ? d.split(" ") : [d],
                l = g.length; l--; ) {
              d = g[l];
              var k = f[d];
              k || (f[d] = [], "mouseenter" === d || "mouseleave" === d ? a(c, Qf[d], function(a) {
                var c = a.relatedTarget;
                c && (c === this || this.contains(c)) || h(a, d);
              }) : "$destroy" !== d && c.addEventListener(d, h, !1), k = f[d]);
              k.push(e);
            }
          }
        },
        off: Hc,
        one: function(a, c, d) {
          a = B(a);
          a.on(c, function f() {
            a.off(c, d);
            a.off(c, f);
          });
          a.on(c, d);
        },
        replaceWith: function(a, c) {
          var d,
              e = a.parentNode;
          wb(a);
          s(new R(c), function(c) {
            d ? e.insertBefore(c, d.nextSibling) : e.replaceChild(c, a);
            d = c;
          });
        },
        children: function(a) {
          var c = [];
          s(a.childNodes, function(a) {
            a.nodeType === na && c.push(a);
          });
          return c;
        },
        contents: function(a) {
          return a.contentDocument || a.childNodes || [];
        },
        append: function(a, c) {
          var d = a.nodeType;
          if (d === na || 11 === d) {
            c = new R(c);
            for (var d = 0,
                e = c.length; d < e; d++)
              a.appendChild(c[d]);
          }
        },
        prepend: function(a, c) {
          if (a.nodeType === na) {
            var d = a.firstChild;
            s(new R(c), function(c) {
              a.insertBefore(c, d);
            });
          }
        },
        wrap: function(a, c) {
          c = B(c).eq(0).clone()[0];
          var d = a.parentNode;
          d && d.replaceChild(c, a);
          c.appendChild(a);
        },
        remove: Kc,
        detach: function(a) {
          Kc(a, !0);
        },
        after: function(a, c) {
          var d = a,
              e = a.parentNode;
          c = new R(c);
          for (var f = 0,
              g = c.length; f < g; f++) {
            var h = c[f];
            e.insertBefore(h, d.nextSibling);
            d = h;
          }
        },
        addClass: Cb,
        removeClass: Bb,
        toggleClass: function(a, c, d) {
          c && s(c.split(" "), function(c) {
            var f = d;
            D(f) && (f = !Ab(a, c));
            (f ? Cb : Bb)(a, c);
          });
        },
        parent: function(a) {
          return (a = a.parentNode) && 11 !== a.nodeType ? a : null;
        },
        next: function(a) {
          return a.nextElementSibling;
        },
        find: function(a, c) {
          return a.getElementsByTagName ? a.getElementsByTagName(c) : [];
        },
        clone: Tb,
        triggerHandler: function(a, c, d) {
          var e,
              f,
              g = c.type || c,
              h = yb(a);
          if (h = (h = h && h.events) && h[g])
            e = {
              preventDefault: function() {
                this.defaultPrevented = !0;
              },
              isDefaultPrevented: function() {
                return !0 === this.defaultPrevented;
              },
              stopImmediatePropagation: function() {
                this.immediatePropagationStopped = !0;
              },
              isImmediatePropagationStopped: function() {
                return !0 === this.immediatePropagationStopped;
              },
              stopPropagation: C,
              type: g,
              target: a
            }, c.type && (e = z(e, c)), c = qa(h), f = d ? [e].concat(d) : [e], s(c, function(c) {
              e.isImmediatePropagationStopped() || c.apply(a, f);
            });
        }
      }, function(a, c) {
        R.prototype[c] = function(c, e, f) {
          for (var g,
              h = 0,
              l = this.length; h < l; h++)
            D(g) ? (g = a(this[h], c, e, f), y(g) && (g = B(g))) : Gc(g, a(this[h], c, e, f));
          return y(g) ? g : this;
        };
        R.prototype.bind = R.prototype.on;
        R.prototype.unbind = R.prototype.off;
      });
      db.prototype = {
        put: function(a, c) {
          this[Na(a, this.nextUid)] = c;
        },
        get: function(a) {
          return this[Na(a, this.nextUid)];
        },
        remove: function(a) {
          var c = this[a = Na(a, this.nextUid)];
          delete this[a];
          return c;
        }
      };
      var Pc = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
          nf = /,/,
          of = /^\s*(_?)(\S+?)\1\s*$/,
          Oc = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
          Ga = T("$injector");
      Ob.$$annotate = Vb;
      var Rf = T("$animate"),
          Ce = ["$provide", function(a) {
            this.$$selectors = {};
            this.register = function(c, d) {
              var e = c + "-animation";
              if (c && "." != c.charAt(0))
                throw Rf("notcsel", c);
              this.$$selectors[c.substr(1)] = e;
              a.factory(e, d);
            };
            this.classNameFilter = function(a) {
              1 === arguments.length && (this.$$classNameFilter = a instanceof RegExp ? a : null);
              return this.$$classNameFilter;
            };
            this.$get = ["$$q", "$$asyncCallback", "$rootScope", function(a, d, e) {
              function f(d) {
                var f,
                    g = a.defer();
                g.promise.$$cancelFn = function() {
                  f && f();
                };
                e.$$postDigest(function() {
                  f = d(function() {
                    g.resolve();
                  });
                });
                return g.promise;
              }
              function g(a, c) {
                var d = [],
                    e = [],
                    f = ha();
                s((a.attr("class") || "").split(/\s+/), function(a) {
                  f[a] = !0;
                });
                s(c, function(a, c) {
                  var g = f[c];
                  !1 === a && g ? e.push(c) : !0 !== a || g || d.push(c);
                });
                return 0 < d.length + e.length && [d.length ? d : null, e.length ? e : null];
              }
              function h(a, c, d) {
                for (var e = 0,
                    f = c.length; e < f; ++e)
                  a[c[e]] = d;
              }
              function l() {
                m || (m = a.defer(), d(function() {
                  m.resolve();
                  m = null;
                }));
                return m.promise;
              }
              function k(a, c) {
                if (ga.isObject(c)) {
                  var d = z(c.from || {}, c.to || {});
                  a.css(d);
                }
              }
              var m;
              return {
                animate: function(a, c, d) {
                  k(a, {
                    from: c,
                    to: d
                  });
                  return l();
                },
                enter: function(a, c, d, e) {
                  k(a, e);
                  d ? d.after(a) : c.prepend(a);
                  return l();
                },
                leave: function(a, c) {
                  a.remove();
                  return l();
                },
                move: function(a, c, d, e) {
                  return this.enter(a, c, d, e);
                },
                addClass: function(a, c, d) {
                  return this.setClass(a, c, [], d);
                },
                $$addClassImmediately: function(a, c, d) {
                  a = B(a);
                  c = F(c) ? c : x(c) ? c.join(" ") : "";
                  s(a, function(a) {
                    Cb(a, c);
                  });
                  k(a, d);
                  return l();
                },
                removeClass: function(a, c, d) {
                  return this.setClass(a, [], c, d);
                },
                $$removeClassImmediately: function(a, c, d) {
                  a = B(a);
                  c = F(c) ? c : x(c) ? c.join(" ") : "";
                  s(a, function(a) {
                    Bb(a, c);
                  });
                  k(a, d);
                  return l();
                },
                setClass: function(a, c, d, e) {
                  var k = this,
                      l = !1;
                  a = B(a);
                  var m = a.data("$$animateClasses");
                  m ? e && m.options && (m.options = ga.extend(m.options || {}, e)) : (m = {
                    classes: {},
                    options: e
                  }, l = !0);
                  e = m.classes;
                  c = x(c) ? c : c.split(" ");
                  d = x(d) ? d : d.split(" ");
                  h(e, c, !0);
                  h(e, d, !1);
                  l && (m.promise = f(function(c) {
                    var d = a.data("$$animateClasses");
                    a.removeData("$$animateClasses");
                    if (d) {
                      var e = g(a, d.classes);
                      e && k.$$setClassImmediately(a, e[0], e[1], d.options);
                    }
                    c();
                  }), a.data("$$animateClasses", m));
                  return m.promise;
                },
                $$setClassImmediately: function(a, c, d, e) {
                  c && this.$$addClassImmediately(a, c);
                  d && this.$$removeClassImmediately(a, d);
                  k(a, e);
                  return l();
                },
                enabled: C,
                cancel: C
              };
            }];
          }],
          ja = T("$compile");
      wc.$inject = ["$provide", "$$sanitizeUriProvider"];
      var Rc = /^((?:x|data)[\:\-_])/i,
          Vc = "application/json",
          Zb = {"Content-Type": Vc + ";charset=utf-8"},
          tf = /^\[|^\{(?!\{)/,
          uf = {
            "[": /]$/,
            "{": /}$/
          },
          sf = /^\)\]\}',?\n/,
          $b = T("$interpolate"),
          Sf = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
          xf = {
            http: 80,
            https: 443,
            ftp: 21
          },
          Fb = T("$location"),
          Tf = {
            $$html5: !1,
            $$replace: !1,
            absUrl: Gb("$$absUrl"),
            url: function(a) {
              if (D(a))
                return this.$$url;
              var c = Sf.exec(a);
              (c[1] || "" === a) && this.path(decodeURIComponent(c[1]));
              (c[2] || c[1] || "" === a) && this.search(c[3] || "");
              this.hash(c[5] || "");
              return this;
            },
            protocol: Gb("$$protocol"),
            host: Gb("$$host"),
            port: Gb("$$port"),
            path: dd("$$path", function(a) {
              a = null !== a ? a.toString() : "";
              return "/" == a.charAt(0) ? a : "/" + a;
            }),
            search: function(a, c) {
              switch (arguments.length) {
                case 0:
                  return this.$$search;
                case 1:
                  if (F(a) || V(a))
                    a = a.toString(), this.$$search = qc(a);
                  else if (H(a))
                    a = Ea(a, {}), s(a, function(c, e) {
                      null == c && delete a[e];
                    }), this.$$search = a;
                  else
                    throw Fb("isrcharg");
                  break;
                default:
                  D(c) || null === c ? delete this.$$search[a] : this.$$search[a] = c;
              }
              this.$$compose();
              return this;
            },
            hash: dd("$$hash", function(a) {
              return null !== a ? a.toString() : "";
            }),
            replace: function() {
              this.$$replace = !0;
              return this;
            }
          };
      s([cd, dc, cc], function(a) {
        a.prototype = Object.create(Tf);
        a.prototype.state = function(c) {
          if (!arguments.length)
            return this.$$state;
          if (a !== cc || !this.$$html5)
            throw Fb("nostate");
          this.$$state = D(c) ? null : c;
          return this;
        };
      });
      var la = T("$parse"),
          Uf = Function.prototype.call,
          Vf = Function.prototype.apply,
          Wf = Function.prototype.bind,
          lb = ha();
      s({
        "null": function() {
          return null;
        },
        "true": function() {
          return !0;
        },
        "false": function() {
          return !1;
        },
        undefined: function() {}
      }, function(a, c) {
        a.constant = a.literal = a.sharedGetter = !0;
        lb[c] = a;
      });
      lb["this"] = function(a) {
        return a;
      };
      lb["this"].sharedGetter = !0;
      var mb = z(ha(), {
        "+": function(a, c, d, e) {
          d = d(a, c);
          e = e(a, c);
          return y(d) ? y(e) ? d + e : d : y(e) ? e : t;
        },
        "-": function(a, c, d, e) {
          d = d(a, c);
          e = e(a, c);
          return (y(d) ? d : 0) - (y(e) ? e : 0);
        },
        "*": function(a, c, d, e) {
          return d(a, c) * e(a, c);
        },
        "/": function(a, c, d, e) {
          return d(a, c) / e(a, c);
        },
        "%": function(a, c, d, e) {
          return d(a, c) % e(a, c);
        },
        "===": function(a, c, d, e) {
          return d(a, c) === e(a, c);
        },
        "!==": function(a, c, d, e) {
          return d(a, c) !== e(a, c);
        },
        "==": function(a, c, d, e) {
          return d(a, c) == e(a, c);
        },
        "!=": function(a, c, d, e) {
          return d(a, c) != e(a, c);
        },
        "<": function(a, c, d, e) {
          return d(a, c) < e(a, c);
        },
        ">": function(a, c, d, e) {
          return d(a, c) > e(a, c);
        },
        "<=": function(a, c, d, e) {
          return d(a, c) <= e(a, c);
        },
        ">=": function(a, c, d, e) {
          return d(a, c) >= e(a, c);
        },
        "&&": function(a, c, d, e) {
          return d(a, c) && e(a, c);
        },
        "||": function(a, c, d, e) {
          return d(a, c) || e(a, c);
        },
        "!": function(a, c, d) {
          return !d(a, c);
        },
        "=": !0,
        "|": !0
      }),
          Xf = {
            n: "\n",
            f: "\f",
            r: "\r",
            t: "\t",
            v: "\v",
            "'": "'",
            '"': '"'
          },
          gc = function(a) {
            this.options = a;
          };
      gc.prototype = {
        constructor: gc,
        lex: function(a) {
          this.text = a;
          this.index = 0;
          for (this.tokens = []; this.index < this.text.length; )
            if (a = this.text.charAt(this.index), '"' === a || "'" === a)
              this.readString(a);
            else if (this.isNumber(a) || "." === a && this.isNumber(this.peek()))
              this.readNumber();
            else if (this.isIdent(a))
              this.readIdent();
            else if (this.is(a, "(){}[].,;:?"))
              this.tokens.push({
                index: this.index,
                text: a
              }), this.index++;
            else if (this.isWhitespace(a))
              this.index++;
            else {
              var c = a + this.peek(),
                  d = c + this.peek(2),
                  e = mb[c],
                  f = mb[d];
              mb[a] || e || f ? (a = f ? d : e ? c : a, this.tokens.push({
                index: this.index,
                text: a,
                operator: !0
              }), this.index += a.length) : this.throwError("Unexpected next character ", this.index, this.index + 1);
            }
          return this.tokens;
        },
        is: function(a, c) {
          return -1 !== c.indexOf(a);
        },
        peek: function(a) {
          a = a || 1;
          return this.index + a < this.text.length ? this.text.charAt(this.index + a) : !1;
        },
        isNumber: function(a) {
          return "0" <= a && "9" >= a && "string" === typeof a;
        },
        isWhitespace: function(a) {
          return " " === a || "\r" === a || "\t" === a || "\n" === a || "\v" === a || "\u00a0" === a;
        },
        isIdent: function(a) {
          return "a" <= a && "z" >= a || "A" <= a && "Z" >= a || "_" === a || "$" === a;
        },
        isExpOperator: function(a) {
          return "-" === a || "+" === a || this.isNumber(a);
        },
        throwError: function(a, c, d) {
          d = d || this.index;
          c = y(c) ? "s " + c + "-" + this.index + " [" + this.text.substring(c, d) + "]" : " " + d;
          throw la("lexerr", a, c, this.text);
        },
        readNumber: function() {
          for (var a = "",
              c = this.index; this.index < this.text.length; ) {
            var d = Q(this.text.charAt(this.index));
            if ("." == d || this.isNumber(d))
              a += d;
            else {
              var e = this.peek();
              if ("e" == d && this.isExpOperator(e))
                a += d;
              else if (this.isExpOperator(d) && e && this.isNumber(e) && "e" == a.charAt(a.length - 1))
                a += d;
              else if (!this.isExpOperator(d) || e && this.isNumber(e) || "e" != a.charAt(a.length - 1))
                break;
              else
                this.throwError("Invalid exponent");
            }
            this.index++;
          }
          this.tokens.push({
            index: c,
            text: a,
            constant: !0,
            value: Number(a)
          });
        },
        readIdent: function() {
          for (var a = this.index; this.index < this.text.length; ) {
            var c = this.text.charAt(this.index);
            if (!this.isIdent(c) && !this.isNumber(c))
              break;
            this.index++;
          }
          this.tokens.push({
            index: a,
            text: this.text.slice(a, this.index),
            identifier: !0
          });
        },
        readString: function(a) {
          var c = this.index;
          this.index++;
          for (var d = "",
              e = a,
              f = !1; this.index < this.text.length; ) {
            var g = this.text.charAt(this.index),
                e = e + g;
            if (f)
              "u" === g ? (f = this.text.substring(this.index + 1, this.index + 5), f.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + f + "]"), this.index += 4, d += String.fromCharCode(parseInt(f, 16))) : d += Xf[g] || g, f = !1;
            else if ("\\" === g)
              f = !0;
            else {
              if (g === a) {
                this.index++;
                this.tokens.push({
                  index: c,
                  text: e,
                  constant: !0,
                  value: d
                });
                return;
              }
              d += g;
            }
            this.index++;
          }
          this.throwError("Unterminated quote", c);
        }
      };
      var hb = function(a, c, d) {
        this.lexer = a;
        this.$filter = c;
        this.options = d;
      };
      hb.ZERO = z(function() {
        return 0;
      }, {
        sharedGetter: !0,
        constant: !0
      });
      hb.prototype = {
        constructor: hb,
        parse: function(a) {
          this.text = a;
          this.tokens = this.lexer.lex(a);
          a = this.statements();
          0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]);
          a.literal = !!a.literal;
          a.constant = !!a.constant;
          return a;
        },
        primary: function() {
          var a;
          this.expect("(") ? (a = this.filterChain(), this.consume(")")) : this.expect("[") ? a = this.arrayDeclaration() : this.expect("{") ? a = this.object() : this.peek().identifier && this.peek().text in lb ? a = lb[this.consume().text] : this.peek().identifier ? a = this.identifier() : this.peek().constant ? a = this.constant() : this.throwError("not a primary expression", this.peek());
          for (var c,
              d; c = this.expect("(", "[", "."); )
            "(" === c.text ? (a = this.functionCall(a, d), d = null) : "[" === c.text ? (d = a, a = this.objectIndex(a)) : "." === c.text ? (d = a, a = this.fieldAccess(a)) : this.throwError("IMPOSSIBLE");
          return a;
        },
        throwError: function(a, c) {
          throw la("syntax", c.text, a, c.index + 1, this.text, this.text.substring(c.index));
        },
        peekToken: function() {
          if (0 === this.tokens.length)
            throw la("ueoe", this.text);
          return this.tokens[0];
        },
        peek: function(a, c, d, e) {
          return this.peekAhead(0, a, c, d, e);
        },
        peekAhead: function(a, c, d, e, f) {
          if (this.tokens.length > a) {
            a = this.tokens[a];
            var g = a.text;
            if (g === c || g === d || g === e || g === f || !(c || d || e || f))
              return a;
          }
          return !1;
        },
        expect: function(a, c, d, e) {
          return (a = this.peek(a, c, d, e)) ? (this.tokens.shift(), a) : !1;
        },
        consume: function(a) {
          if (0 === this.tokens.length)
            throw la("ueoe", this.text);
          var c = this.expect(a);
          c || this.throwError("is unexpected, expecting [" + a + "]", this.peek());
          return c;
        },
        unaryFn: function(a, c) {
          var d = mb[a];
          return z(function(a, f) {
            return d(a, f, c);
          }, {
            constant: c.constant,
            inputs: [c]
          });
        },
        binaryFn: function(a, c, d, e) {
          var f = mb[c];
          return z(function(c, e) {
            return f(c, e, a, d);
          }, {
            constant: a.constant && d.constant,
            inputs: !e && [a, d]
          });
        },
        identifier: function() {
          for (var a = this.consume().text; this.peek(".") && this.peekAhead(1).identifier && !this.peekAhead(2, "("); )
            a += this.consume().text + this.consume().text;
          return zf(a, this.options, this.text);
        },
        constant: function() {
          var a = this.consume().value;
          return z(function() {
            return a;
          }, {
            constant: !0,
            literal: !0
          });
        },
        statements: function() {
          for (var a = []; ; )
            if (0 < this.tokens.length && !this.peek("}", ")", ";", "]") && a.push(this.filterChain()), !this.expect(";"))
              return 1 === a.length ? a[0] : function(c, d) {
                for (var e,
                    f = 0,
                    g = a.length; f < g; f++)
                  e = a[f](c, d);
                return e;
              };
        },
        filterChain: function() {
          for (var a = this.expression(); this.expect("|"); )
            a = this.filter(a);
          return a;
        },
        filter: function(a) {
          var c = this.$filter(this.consume().text),
              d,
              e;
          if (this.peek(":"))
            for (d = [], e = []; this.expect(":"); )
              d.push(this.expression());
          var f = [a].concat(d || []);
          return z(function(f, h) {
            var l = a(f, h);
            if (e) {
              e[0] = l;
              for (l = d.length; l--; )
                e[l + 1] = d[l](f, h);
              return c.apply(t, e);
            }
            return c(l);
          }, {
            constant: !c.$stateful && f.every(ec),
            inputs: !c.$stateful && f
          });
        },
        expression: function() {
          return this.assignment();
        },
        assignment: function() {
          var a = this.ternary(),
              c,
              d;
          return (d = this.expect("=")) ? (a.assign || this.throwError("implies assignment but [" + this.text.substring(0, d.index) + "] can not be assigned to", d), c = this.ternary(), z(function(d, f) {
            return a.assign(d, c(d, f), f);
          }, {inputs: [a, c]})) : a;
        },
        ternary: function() {
          var a = this.logicalOR(),
              c;
          if (this.expect("?") && (c = this.assignment(), this.consume(":"))) {
            var d = this.assignment();
            return z(function(e, f) {
              return a(e, f) ? c(e, f) : d(e, f);
            }, {constant: a.constant && c.constant && d.constant});
          }
          return a;
        },
        logicalOR: function() {
          for (var a = this.logicalAND(),
              c; c = this.expect("||"); )
            a = this.binaryFn(a, c.text, this.logicalAND(), !0);
          return a;
        },
        logicalAND: function() {
          for (var a = this.equality(),
              c; c = this.expect("&&"); )
            a = this.binaryFn(a, c.text, this.equality(), !0);
          return a;
        },
        equality: function() {
          for (var a = this.relational(),
              c; c = this.expect("==", "!=", "===", "!=="); )
            a = this.binaryFn(a, c.text, this.relational());
          return a;
        },
        relational: function() {
          for (var a = this.additive(),
              c; c = this.expect("<", ">", "<=", ">="); )
            a = this.binaryFn(a, c.text, this.additive());
          return a;
        },
        additive: function() {
          for (var a = this.multiplicative(),
              c; c = this.expect("+", "-"); )
            a = this.binaryFn(a, c.text, this.multiplicative());
          return a;
        },
        multiplicative: function() {
          for (var a = this.unary(),
              c; c = this.expect("*", "/", "%"); )
            a = this.binaryFn(a, c.text, this.unary());
          return a;
        },
        unary: function() {
          var a;
          return this.expect("+") ? this.primary() : (a = this.expect("-")) ? this.binaryFn(hb.ZERO, a.text, this.unary()) : (a = this.expect("!")) ? this.unaryFn(a.text, this.unary()) : this.primary();
        },
        fieldAccess: function(a) {
          var c = this.identifier();
          return z(function(d, e, f) {
            d = f || a(d, e);
            return null == d ? t : c(d);
          }, {assign: function(d, e, f) {
              (f = a(d, f)) || a.assign(d, f = {});
              return c.assign(f, e);
            }});
        },
        objectIndex: function(a) {
          var c = this.text,
              d = this.expression();
          this.consume("]");
          return z(function(e, f) {
            var g = a(e, f),
                h = d(e, f);
            sa(h, c);
            return g ? ta(g[h], c) : t;
          }, {assign: function(e, f, g) {
              var h = sa(d(e, g), c);
              (g = ta(a(e, g), c)) || a.assign(e, g = {});
              return g[h] = f;
            }});
        },
        functionCall: function(a, c) {
          var d = [];
          if (")" !== this.peekToken().text) {
            do
              d.push(this.expression());
 while (this.expect(","));
          }
          this.consume(")");
          var e = this.text,
              f = d.length ? [] : null;
          return function(g, h) {
            var l = c ? c(g, h) : y(c) ? t : g,
                k = a(g, h, l) || C;
            if (f)
              for (var m = d.length; m--; )
                f[m] = ta(d[m](g, h), e);
            ta(l, e);
            if (k) {
              if (k.constructor === k)
                throw la("isecfn", e);
              if (k === Uf || k === Vf || k === Wf)
                throw la("isecff", e);
            }
            l = k.apply ? k.apply(l, f) : k(f[0], f[1], f[2], f[3], f[4]);
            return ta(l, e);
          };
        },
        arrayDeclaration: function() {
          var a = [];
          if ("]" !== this.peekToken().text) {
            do {
              if (this.peek("]"))
                break;
              a.push(this.expression());
            } while (this.expect(","));
          }
          this.consume("]");
          return z(function(c, d) {
            for (var e = [],
                f = 0,
                g = a.length; f < g; f++)
              e.push(a[f](c, d));
            return e;
          }, {
            literal: !0,
            constant: a.every(ec),
            inputs: a
          });
        },
        object: function() {
          var a = [],
              c = [];
          if ("}" !== this.peekToken().text) {
            do {
              if (this.peek("}"))
                break;
              var d = this.consume();
              d.constant ? a.push(d.value) : d.identifier ? a.push(d.text) : this.throwError("invalid key", d);
              this.consume(":");
              c.push(this.expression());
            } while (this.expect(","));
          }
          this.consume("}");
          return z(function(d, f) {
            for (var g = {},
                h = 0,
                l = c.length; h < l; h++)
              g[a[h]] = c[h](d, f);
            return g;
          }, {
            literal: !0,
            constant: c.every(ec),
            inputs: c
          });
        }
      };
      var Bf = ha(),
          Af = ha(),
          Cf = Object.prototype.valueOf,
          Ca = T("$sce"),
          ma = {
            HTML: "html",
            CSS: "css",
            URL: "url",
            RESOURCE_URL: "resourceUrl",
            JS: "js"
          },
          ja = T("$compile"),
          Z = Y.createElement("a"),
          id = Ba(M.location.href);
      Dc.$inject = ["$provide"];
      jd.$inject = ["$locale"];
      ld.$inject = ["$locale"];
      var od = ".",
          Mf = {
            yyyy: $("FullYear", 4),
            yy: $("FullYear", 2, 0, !0),
            y: $("FullYear", 1),
            MMMM: Ib("Month"),
            MMM: Ib("Month", !0),
            MM: $("Month", 2, 1),
            M: $("Month", 1, 1),
            dd: $("Date", 2),
            d: $("Date", 1),
            HH: $("Hours", 2),
            H: $("Hours", 1),
            hh: $("Hours", 2, -12),
            h: $("Hours", 1, -12),
            mm: $("Minutes", 2),
            m: $("Minutes", 1),
            ss: $("Seconds", 2),
            s: $("Seconds", 1),
            sss: $("Milliseconds", 3),
            EEEE: Ib("Day"),
            EEE: Ib("Day", !0),
            a: function(a, c) {
              return 12 > a.getHours() ? c.AMPMS[0] : c.AMPMS[1];
            },
            Z: function(a) {
              a = -1 * a.getTimezoneOffset();
              return a = (0 <= a ? "+" : "") + (Hb(Math[0 < a ? "floor" : "ceil"](a / 60), 2) + Hb(Math.abs(a % 60), 2));
            },
            ww: qd(2),
            w: qd(1)
          },
          Lf = /((?:[^yMdHhmsaZEw']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|w+))(.*)/,
          Kf = /^\-?\d+$/;
      kd.$inject = ["$locale"];
      var Hf = da(Q),
          If = da(ub);
      md.$inject = ["$parse"];
      var Td = da({
        restrict: "E",
        compile: function(a, c) {
          if (!c.href && !c.xlinkHref && !c.name)
            return function(a, c) {
              var f = "[object SVGAnimatedString]" === Da.call(c.prop("href")) ? "xlink:href" : "href";
              c.on("click", function(a) {
                c.attr(f) || a.preventDefault();
              });
            };
        }
      }),
          vb = {};
      s(Eb, function(a, c) {
        if ("multiple" != a) {
          var d = ya("ng-" + c);
          vb[d] = function() {
            return {
              restrict: "A",
              priority: 100,
              link: function(a, f, g) {
                a.$watch(g[d], function(a) {
                  g.$set(c, !!a);
                });
              }
            };
          };
        }
      });
      s(Nc, function(a, c) {
        vb[c] = function() {
          return {
            priority: 100,
            link: function(a, e, f) {
              if ("ngPattern" === c && "/" == f.ngPattern.charAt(0) && (e = f.ngPattern.match(Of))) {
                f.$set("ngPattern", new RegExp(e[1], e[2]));
                return;
              }
              a.$watch(f[c], function(a) {
                f.$set(c, a);
              });
            }
          };
        };
      });
      s(["src", "srcset", "href"], function(a) {
        var c = ya("ng-" + a);
        vb[c] = function() {
          return {
            priority: 99,
            link: function(d, e, f) {
              var g = a,
                  h = a;
              "href" === a && "[object SVGAnimatedString]" === Da.call(e.prop("href")) && (h = "xlinkHref", f.$attr[h] = "xlink:href", g = null);
              f.$observe(c, function(c) {
                c ? (f.$set(h, c), Ra && g && e.prop(g, f[h])) : "href" === a && f.$set(h, null);
              });
            }
          };
        };
      });
      var Jb = {
        $addControl: C,
        $$renameControl: function(a, c) {
          a.$name = c;
        },
        $removeControl: C,
        $setValidity: C,
        $setDirty: C,
        $setPristine: C,
        $setSubmitted: C
      };
      rd.$inject = ["$element", "$attrs", "$scope", "$animate", "$interpolate"];
      var yd = function(a) {
        return ["$timeout", function(c) {
          return {
            name: "form",
            restrict: a ? "EAC" : "E",
            controller: rd,
            compile: function(a) {
              a.addClass(Sa).addClass(kb);
              return {pre: function(a, d, g, h) {
                  if (!("action" in g)) {
                    var l = function(c) {
                      a.$apply(function() {
                        h.$commitViewValue();
                        h.$setSubmitted();
                      });
                      c.preventDefault();
                    };
                    d[0].addEventListener("submit", l, !1);
                    d.on("$destroy", function() {
                      c(function() {
                        d[0].removeEventListener("submit", l, !1);
                      }, 0, !1);
                    });
                  }
                  var k = h.$$parentForm,
                      m = h.$name;
                  m && (gb(a, m, h, m), g.$observe(g.name ? "name" : "ngForm", function(c) {
                    m !== c && (gb(a, m, t, m), m = c, gb(a, m, h, m), k.$$renameControl(h, m));
                  }));
                  d.on("$destroy", function() {
                    k.$removeControl(h);
                    m && gb(a, m, t, m);
                    z(h, Jb);
                  });
                }};
            }
          };
        }];
      },
          Ud = yd(),
          ge = yd(!0),
          Nf = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
          Yf = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
          Zf = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
          $f = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
          zd = /^(\d{4})-(\d{2})-(\d{2})$/,
          Ad = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,
          jc = /^(\d{4})-W(\d\d)$/,
          Bd = /^(\d{4})-(\d\d)$/,
          Cd = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,
          ag = /(\s+|^)default(\s+|$)/,
          Mb = new T("ngModel"),
          Dd = {
            text: function(a, c, d, e, f, g) {
              ib(a, c, d, e, f, g);
              hc(e);
            },
            date: jb("date", zd, Lb(zd, ["yyyy", "MM", "dd"]), "yyyy-MM-dd"),
            "datetime-local": jb("datetimelocal", Ad, Lb(Ad, "yyyy MM dd HH mm ss sss".split(" ")), "yyyy-MM-ddTHH:mm:ss.sss"),
            time: jb("time", Cd, Lb(Cd, ["HH", "mm", "ss", "sss"]), "HH:mm:ss.sss"),
            week: jb("week", jc, function(a, c) {
              if (pa(a))
                return a;
              if (F(a)) {
                jc.lastIndex = 0;
                var d = jc.exec(a);
                if (d) {
                  var e = +d[1],
                      f = +d[2],
                      g = d = 0,
                      h = 0,
                      l = 0,
                      k = pd(e),
                      f = 7 * (f - 1);
                  c && (d = c.getHours(), g = c.getMinutes(), h = c.getSeconds(), l = c.getMilliseconds());
                  return new Date(e, 0, k.getDate() + f, d, g, h, l);
                }
              }
              return NaN;
            }, "yyyy-Www"),
            month: jb("month", Bd, Lb(Bd, ["yyyy", "MM"]), "yyyy-MM"),
            number: function(a, c, d, e, f, g) {
              td(a, c, d, e);
              ib(a, c, d, e, f, g);
              e.$$parserName = "number";
              e.$parsers.push(function(a) {
                return e.$isEmpty(a) ? null : $f.test(a) ? parseFloat(a) : t;
              });
              e.$formatters.push(function(a) {
                if (!e.$isEmpty(a)) {
                  if (!V(a))
                    throw Mb("numfmt", a);
                  a = a.toString();
                }
                return a;
              });
              if (d.min || d.ngMin) {
                var h;
                e.$validators.min = function(a) {
                  return e.$isEmpty(a) || D(h) || a >= h;
                };
                d.$observe("min", function(a) {
                  y(a) && !V(a) && (a = parseFloat(a, 10));
                  h = V(a) && !isNaN(a) ? a : t;
                  e.$validate();
                });
              }
              if (d.max || d.ngMax) {
                var l;
                e.$validators.max = function(a) {
                  return e.$isEmpty(a) || D(l) || a <= l;
                };
                d.$observe("max", function(a) {
                  y(a) && !V(a) && (a = parseFloat(a, 10));
                  l = V(a) && !isNaN(a) ? a : t;
                  e.$validate();
                });
              }
            },
            url: function(a, c, d, e, f, g) {
              ib(a, c, d, e, f, g);
              hc(e);
              e.$$parserName = "url";
              e.$validators.url = function(a, c) {
                var d = a || c;
                return e.$isEmpty(d) || Yf.test(d);
              };
            },
            email: function(a, c, d, e, f, g) {
              ib(a, c, d, e, f, g);
              hc(e);
              e.$$parserName = "email";
              e.$validators.email = function(a, c) {
                var d = a || c;
                return e.$isEmpty(d) || Zf.test(d);
              };
            },
            radio: function(a, c, d, e) {
              D(d.name) && c.attr("name", ++nb);
              c.on("click", function(a) {
                c[0].checked && e.$setViewValue(d.value, a && a.type);
              });
              e.$render = function() {
                c[0].checked = d.value == e.$viewValue;
              };
              d.$observe("value", e.$render);
            },
            checkbox: function(a, c, d, e, f, g, h, l) {
              var k = ud(l, a, "ngTrueValue", d.ngTrueValue, !0),
                  m = ud(l, a, "ngFalseValue", d.ngFalseValue, !1);
              c.on("click", function(a) {
                e.$setViewValue(c[0].checked, a && a.type);
              });
              e.$render = function() {
                c[0].checked = e.$viewValue;
              };
              e.$isEmpty = function(a) {
                return !1 === a;
              };
              e.$formatters.push(function(a) {
                return fa(a, k);
              });
              e.$parsers.push(function(a) {
                return a ? k : m;
              });
            },
            hidden: C,
            button: C,
            submit: C,
            reset: C,
            file: C
          },
          xc = ["$browser", "$sniffer", "$filter", "$parse", function(a, c, d, e) {
            return {
              restrict: "E",
              require: ["?ngModel"],
              link: {pre: function(f, g, h, l) {
                  l[0] && (Dd[Q(h.type)] || Dd.text)(f, g, h, l[0], c, a, d, e);
                }}
            };
          }],
          kb = "ng-valid",
          vd = "ng-invalid",
          Sa = "ng-pristine",
          Kb = "ng-dirty",
          xd = "ng-pending",
          bg = ["$scope", "$exceptionHandler", "$attrs", "$element", "$parse", "$animate", "$timeout", "$rootScope", "$q", "$interpolate", function(a, c, d, e, f, g, h, l, k, m) {
            this.$modelValue = this.$viewValue = Number.NaN;
            this.$$rawModelValue = t;
            this.$validators = {};
            this.$asyncValidators = {};
            this.$parsers = [];
            this.$formatters = [];
            this.$viewChangeListeners = [];
            this.$untouched = !0;
            this.$touched = !1;
            this.$pristine = !0;
            this.$dirty = !1;
            this.$valid = !0;
            this.$invalid = !1;
            this.$error = {};
            this.$$success = {};
            this.$pending = t;
            this.$name = m(d.name || "", !1)(a);
            var p = f(d.ngModel),
                q = p.assign,
                u = p,
                r = q,
                O = null,
                n = this;
            this.$$setOptions = function(a) {
              if ((n.$options = a) && a.getterSetter) {
                var c = f(d.ngModel + "()"),
                    g = f(d.ngModel + "($$$p)");
                u = function(a) {
                  var d = p(a);
                  G(d) && (d = c(a));
                  return d;
                };
                r = function(a, c) {
                  G(p(a)) ? g(a, {$$$p: n.$modelValue}) : q(a, n.$modelValue);
                };
              } else if (!p.assign)
                throw Mb("nonassign", d.ngModel, va(e));
            };
            this.$render = C;
            this.$isEmpty = function(a) {
              return D(a) || "" === a || null === a || a !== a;
            };
            var v = e.inheritedData("$formController") || Jb,
                w = 0;
            sd({
              ctrl: this,
              $element: e,
              set: function(a, c) {
                a[c] = !0;
              },
              unset: function(a, c) {
                delete a[c];
              },
              parentForm: v,
              $animate: g
            });
            this.$setPristine = function() {
              n.$dirty = !1;
              n.$pristine = !0;
              g.removeClass(e, Kb);
              g.addClass(e, Sa);
            };
            this.$setDirty = function() {
              n.$dirty = !0;
              n.$pristine = !1;
              g.removeClass(e, Sa);
              g.addClass(e, Kb);
              v.$setDirty();
            };
            this.$setUntouched = function() {
              n.$touched = !1;
              n.$untouched = !0;
              g.setClass(e, "ng-untouched", "ng-touched");
            };
            this.$setTouched = function() {
              n.$touched = !0;
              n.$untouched = !1;
              g.setClass(e, "ng-touched", "ng-untouched");
            };
            this.$rollbackViewValue = function() {
              h.cancel(O);
              n.$viewValue = n.$$lastCommittedViewValue;
              n.$render();
            };
            this.$validate = function() {
              if (!V(n.$modelValue) || !isNaN(n.$modelValue)) {
                var a = n.$$rawModelValue,
                    c = n.$valid,
                    d = n.$modelValue,
                    e = n.$options && n.$options.allowInvalid;
                n.$$runValidators(n.$error[n.$$parserName || "parse"] ? !1 : t, a, n.$$lastCommittedViewValue, function(f) {
                  e || c === f || (n.$modelValue = f ? a : t, n.$modelValue !== d && n.$$writeModelToScope());
                });
              }
            };
            this.$$runValidators = function(a, c, d, e) {
              function f() {
                var a = !0;
                s(n.$validators, function(e, f) {
                  var g = e(c, d);
                  a = a && g;
                  h(f, g);
                });
                return a ? !0 : (s(n.$asyncValidators, function(a, c) {
                  h(c, null);
                }), !1);
              }
              function g() {
                var a = [],
                    e = !0;
                s(n.$asyncValidators, function(f, g) {
                  var l = f(c, d);
                  if (!l || !G(l.then))
                    throw Mb("$asyncValidators", l);
                  h(g, t);
                  a.push(l.then(function() {
                    h(g, !0);
                  }, function(a) {
                    e = !1;
                    h(g, !1);
                  }));
                });
                a.length ? k.all(a).then(function() {
                  l(e);
                }, C) : l(!0);
              }
              function h(a, c) {
                m === w && n.$setValidity(a, c);
              }
              function l(a) {
                m === w && e(a);
              }
              w++;
              var m = w;
              (function(a) {
                var c = n.$$parserName || "parse";
                if (a === t)
                  h(c, null);
                else if (h(c, a), !a)
                  return s(n.$validators, function(a, c) {
                    h(c, null);
                  }), s(n.$asyncValidators, function(a, c) {
                    h(c, null);
                  }), !1;
                return !0;
              })(a) ? f() ? g() : l(!1) : l(!1);
            };
            this.$commitViewValue = function() {
              var a = n.$viewValue;
              h.cancel(O);
              if (n.$$lastCommittedViewValue !== a || "" === a && n.$$hasNativeValidators)
                n.$$lastCommittedViewValue = a, n.$pristine && this.$setDirty(), this.$$parseAndValidate();
            };
            this.$$parseAndValidate = function() {
              var c = n.$$lastCommittedViewValue,
                  d = D(c) ? t : !0;
              if (d)
                for (var e = 0; e < n.$parsers.length; e++)
                  if (c = n.$parsers[e](c), D(c)) {
                    d = !1;
                    break;
                  }
              V(n.$modelValue) && isNaN(n.$modelValue) && (n.$modelValue = u(a));
              var f = n.$modelValue,
                  g = n.$options && n.$options.allowInvalid;
              n.$$rawModelValue = c;
              g && (n.$modelValue = c, n.$modelValue !== f && n.$$writeModelToScope());
              n.$$runValidators(d, c, n.$$lastCommittedViewValue, function(a) {
                g || (n.$modelValue = a ? c : t, n.$modelValue !== f && n.$$writeModelToScope());
              });
            };
            this.$$writeModelToScope = function() {
              r(a, n.$modelValue);
              s(n.$viewChangeListeners, function(a) {
                try {
                  a();
                } catch (d) {
                  c(d);
                }
              });
            };
            this.$setViewValue = function(a, c) {
              n.$viewValue = a;
              n.$options && !n.$options.updateOnDefault || n.$$debounceViewValueCommit(c);
            };
            this.$$debounceViewValueCommit = function(c) {
              var d = 0,
                  e = n.$options;
              e && y(e.debounce) && (e = e.debounce, V(e) ? d = e : V(e[c]) ? d = e[c] : V(e["default"]) && (d = e["default"]));
              h.cancel(O);
              d ? O = h(function() {
                n.$commitViewValue();
              }, d) : l.$$phase ? n.$commitViewValue() : a.$apply(function() {
                n.$commitViewValue();
              });
            };
            a.$watch(function() {
              var c = u(a);
              if (c !== n.$modelValue) {
                n.$modelValue = n.$$rawModelValue = c;
                for (var d = n.$formatters,
                    e = d.length,
                    f = c; e--; )
                  f = d[e](f);
                n.$viewValue !== f && (n.$viewValue = n.$$lastCommittedViewValue = f, n.$render(), n.$$runValidators(t, c, f, C));
              }
              return c;
            });
          }],
          ve = ["$rootScope", function(a) {
            return {
              restrict: "A",
              require: ["ngModel", "^?form", "^?ngModelOptions"],
              controller: bg,
              priority: 1,
              compile: function(c) {
                c.addClass(Sa).addClass("ng-untouched").addClass(kb);
                return {
                  pre: function(a, c, f, g) {
                    var h = g[0],
                        l = g[1] || Jb;
                    h.$$setOptions(g[2] && g[2].$options);
                    l.$addControl(h);
                    f.$observe("name", function(a) {
                      h.$name !== a && l.$$renameControl(h, a);
                    });
                    a.$on("$destroy", function() {
                      l.$removeControl(h);
                    });
                  },
                  post: function(c, e, f, g) {
                    var h = g[0];
                    if (h.$options && h.$options.updateOn)
                      e.on(h.$options.updateOn, function(a) {
                        h.$$debounceViewValueCommit(a && a.type);
                      });
                    e.on("blur", function(e) {
                      h.$touched || (a.$$phase ? c.$evalAsync(h.$setTouched) : c.$apply(h.$setTouched));
                    });
                  }
                };
              }
            };
          }],
          xe = da({
            restrict: "A",
            require: "ngModel",
            link: function(a, c, d, e) {
              e.$viewChangeListeners.push(function() {
                a.$eval(d.ngChange);
              });
            }
          }),
          zc = function() {
            return {
              restrict: "A",
              require: "?ngModel",
              link: function(a, c, d, e) {
                e && (d.required = !0, e.$validators.required = function(a, c) {
                  return !d.required || !e.$isEmpty(c);
                }, d.$observe("required", function() {
                  e.$validate();
                }));
              }
            };
          },
          yc = function() {
            return {
              restrict: "A",
              require: "?ngModel",
              link: function(a, c, d, e) {
                if (e) {
                  var f,
                      g = d.ngPattern || d.pattern;
                  d.$observe("pattern", function(a) {
                    F(a) && 0 < a.length && (a = new RegExp("^" + a + "$"));
                    if (a && !a.test)
                      throw T("ngPattern")("noregexp", g, a, va(c));
                    f = a || t;
                    e.$validate();
                  });
                  e.$validators.pattern = function(a) {
                    return e.$isEmpty(a) || D(f) || f.test(a);
                  };
                }
              }
            };
          },
          Bc = function() {
            return {
              restrict: "A",
              require: "?ngModel",
              link: function(a, c, d, e) {
                if (e) {
                  var f = -1;
                  d.$observe("maxlength", function(a) {
                    a = ba(a);
                    f = isNaN(a) ? -1 : a;
                    e.$validate();
                  });
                  e.$validators.maxlength = function(a, c) {
                    return 0 > f || e.$isEmpty(a) || c.length <= f;
                  };
                }
              }
            };
          },
          Ac = function() {
            return {
              restrict: "A",
              require: "?ngModel",
              link: function(a, c, d, e) {
                if (e) {
                  var f = 0;
                  d.$observe("minlength", function(a) {
                    f = ba(a) || 0;
                    e.$validate();
                  });
                  e.$validators.minlength = function(a, c) {
                    return e.$isEmpty(c) || c.length >= f;
                  };
                }
              }
            };
          },
          we = function() {
            return {
              restrict: "A",
              priority: 100,
              require: "ngModel",
              link: function(a, c, d, e) {
                var f = c.attr(d.$attr.ngList) || ", ",
                    g = "false" !== d.ngTrim,
                    h = g ? U(f) : f;
                e.$parsers.push(function(a) {
                  if (!D(a)) {
                    var c = [];
                    a && s(a.split(h), function(a) {
                      a && c.push(g ? U(a) : a);
                    });
                    return c;
                  }
                });
                e.$formatters.push(function(a) {
                  return x(a) ? a.join(f) : t;
                });
                e.$isEmpty = function(a) {
                  return !a || !a.length;
                };
              }
            };
          },
          cg = /^(true|false|\d+)$/,
          ye = function() {
            return {
              restrict: "A",
              priority: 100,
              compile: function(a, c) {
                return cg.test(c.ngValue) ? function(a, c, f) {
                  f.$set("value", a.$eval(f.ngValue));
                } : function(a, c, f) {
                  a.$watch(f.ngValue, function(a) {
                    f.$set("value", a);
                  });
                };
              }
            };
          },
          ze = function() {
            return {
              restrict: "A",
              controller: ["$scope", "$attrs", function(a, c) {
                var d = this;
                this.$options = a.$eval(c.ngModelOptions);
                this.$options.updateOn !== t ? (this.$options.updateOnDefault = !1, this.$options.updateOn = U(this.$options.updateOn.replace(ag, function() {
                  d.$options.updateOnDefault = !0;
                  return " ";
                }))) : this.$options.updateOnDefault = !0;
              }]
            };
          },
          Zd = ["$compile", function(a) {
            return {
              restrict: "AC",
              compile: function(c) {
                a.$$addBindingClass(c);
                return function(c, e, f) {
                  a.$$addBindingInfo(e, f.ngBind);
                  e = e[0];
                  c.$watch(f.ngBind, function(a) {
                    e.textContent = a === t ? "" : a;
                  });
                };
              }
            };
          }],
          ae = ["$interpolate", "$compile", function(a, c) {
            return {compile: function(d) {
                c.$$addBindingClass(d);
                return function(d, f, g) {
                  d = a(f.attr(g.$attr.ngBindTemplate));
                  c.$$addBindingInfo(f, d.expressions);
                  f = f[0];
                  g.$observe("ngBindTemplate", function(a) {
                    f.textContent = a === t ? "" : a;
                  });
                };
              }};
          }],
          $d = ["$sce", "$parse", "$compile", function(a, c, d) {
            return {
              restrict: "A",
              compile: function(e, f) {
                var g = c(f.ngBindHtml),
                    h = c(f.ngBindHtml, function(a) {
                      return (a || "").toString();
                    });
                d.$$addBindingClass(e);
                return function(c, e, f) {
                  d.$$addBindingInfo(e, f.ngBindHtml);
                  c.$watch(h, function() {
                    e.html(a.getTrustedHtml(g(c)) || "");
                  });
                };
              }
            };
          }],
          be = ic("", !0),
          de = ic("Odd", 0),
          ce = ic("Even", 1),
          ee = Ja({compile: function(a, c) {
              c.$set("ngCloak", t);
              a.removeClass("ng-cloak");
            }}),
          fe = [function() {
            return {
              restrict: "A",
              scope: !0,
              controller: "@",
              priority: 500
            };
          }],
          Cc = {},
          dg = {
            blur: !0,
            focus: !0
          };
      s("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "), function(a) {
        var c = ya("ng-" + a);
        Cc[c] = ["$parse", "$rootScope", function(d, e) {
          return {
            restrict: "A",
            compile: function(f, g) {
              var h = d(g[c], null, !0);
              return function(c, d) {
                d.on(a, function(d) {
                  var f = function() {
                    h(c, {$event: d});
                  };
                  dg[a] && e.$$phase ? c.$evalAsync(f) : c.$apply(f);
                });
              };
            }
          };
        }];
      });
      var ie = ["$animate", function(a) {
        return {
          multiElement: !0,
          transclude: "element",
          priority: 600,
          terminal: !0,
          restrict: "A",
          $$tlb: !0,
          link: function(c, d, e, f, g) {
            var h,
                l,
                k;
            c.$watch(e.ngIf, function(c) {
              c ? l || g(function(c, f) {
                l = f;
                c[c.length++] = Y.createComment(" end ngIf: " + e.ngIf + " ");
                h = {clone: c};
                a.enter(c, d.parent(), d);
              }) : (k && (k.remove(), k = null), l && (l.$destroy(), l = null), h && (k = tb(h.clone), a.leave(k).then(function() {
                k = null;
              }), h = null));
            });
          }
        };
      }],
          je = ["$templateRequest", "$anchorScroll", "$animate", "$sce", function(a, c, d, e) {
            return {
              restrict: "ECA",
              priority: 400,
              terminal: !0,
              transclude: "element",
              controller: ga.noop,
              compile: function(f, g) {
                var h = g.ngInclude || g.src,
                    l = g.onload || "",
                    k = g.autoscroll;
                return function(f, g, q, s, r) {
                  var t = 0,
                      n,
                      v,
                      w,
                      L = function() {
                        v && (v.remove(), v = null);
                        n && (n.$destroy(), n = null);
                        w && (d.leave(w).then(function() {
                          v = null;
                        }), v = w, w = null);
                      };
                  f.$watch(e.parseAsResourceUrl(h), function(e) {
                    var h = function() {
                      !y(k) || k && !f.$eval(k) || c();
                    },
                        q = ++t;
                    e ? (a(e, !0).then(function(a) {
                      if (q === t) {
                        var c = f.$new();
                        s.template = a;
                        a = r(c, function(a) {
                          L();
                          d.enter(a, null, g).then(h);
                        });
                        n = c;
                        w = a;
                        n.$emit("$includeContentLoaded", e);
                        f.$eval(l);
                      }
                    }, function() {
                      q === t && (L(), f.$emit("$includeContentError", e));
                    }), f.$emit("$includeContentRequested", e)) : (L(), s.template = null);
                  });
                };
              }
            };
          }],
          Ae = ["$compile", function(a) {
            return {
              restrict: "ECA",
              priority: -400,
              require: "ngInclude",
              link: function(c, d, e, f) {
                /SVG/.test(d[0].toString()) ? (d.empty(), a(Fc(f.template, Y).childNodes)(c, function(a) {
                  d.append(a);
                }, {futureParentElement: d})) : (d.html(f.template), a(d.contents())(c));
              }
            };
          }],
          ke = Ja({
            priority: 450,
            compile: function() {
              return {pre: function(a, c, d) {
                  a.$eval(d.ngInit);
                }};
            }
          }),
          le = Ja({
            terminal: !0,
            priority: 1E3
          }),
          me = ["$locale", "$interpolate", function(a, c) {
            var d = /{}/g,
                e = /^when(Minus)?(.+)$/;
            return {
              restrict: "EA",
              link: function(f, g, h) {
                function l(a) {
                  g.text(a || "");
                }
                var k = h.count,
                    m = h.$attr.when && g.attr(h.$attr.when),
                    p = h.offset || 0,
                    q = f.$eval(m) || {},
                    u = {},
                    m = c.startSymbol(),
                    r = c.endSymbol(),
                    t = m + k + "-" + p + r,
                    n = ga.noop,
                    v;
                s(h, function(a, c) {
                  var d = e.exec(c);
                  d && (d = (d[1] ? "-" : "") + Q(d[2]), q[d] = g.attr(h.$attr[c]));
                });
                s(q, function(a, e) {
                  u[e] = c(a.replace(d, t));
                });
                f.$watch(k, function(c) {
                  c = parseFloat(c);
                  var d = isNaN(c);
                  d || c in q || (c = a.pluralCat(c - p));
                  c === v || d && isNaN(v) || (n(), n = f.$watch(u[c], l), v = c);
                });
              }
            };
          }],
          ne = ["$parse", "$animate", function(a, c) {
            var d = T("ngRepeat"),
                e = function(a, c, d, e, k, m, p) {
                  a[d] = e;
                  k && (a[k] = m);
                  a.$index = c;
                  a.$first = 0 === c;
                  a.$last = c === p - 1;
                  a.$middle = !(a.$first || a.$last);
                  a.$odd = !(a.$even = 0 === (c & 1));
                };
            return {
              restrict: "A",
              multiElement: !0,
              transclude: "element",
              priority: 1E3,
              terminal: !0,
              $$tlb: !0,
              compile: function(f, g) {
                var h = g.ngRepeat,
                    l = Y.createComment(" end ngRepeat: " + h + " "),
                    k = h.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                if (!k)
                  throw d("iexp", h);
                var m = k[1],
                    p = k[2],
                    q = k[3],
                    u = k[4],
                    k = m.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
                if (!k)
                  throw d("iidexp", m);
                var r = k[3] || k[1],
                    y = k[2];
                if (q && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(q) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent)$/.test(q)))
                  throw d("badident", q);
                var n,
                    v,
                    w,
                    D,
                    z = {$id: Na};
                u ? n = a(u) : (w = function(a, c) {
                  return Na(c);
                }, D = function(a) {
                  return a;
                });
                return function(a, f, g, k, m) {
                  n && (v = function(c, d, e) {
                    y && (z[y] = c);
                    z[r] = d;
                    z.$index = e;
                    return n(a, z);
                  });
                  var u = ha();
                  a.$watchCollection(p, function(g) {
                    var k,
                        p,
                        n = f[0],
                        E,
                        z = ha(),
                        C,
                        S,
                        N,
                        G,
                        J,
                        x,
                        H;
                    q && (a[q] = g);
                    if (Ta(g))
                      J = g, p = v || w;
                    else {
                      p = v || D;
                      J = [];
                      for (H in g)
                        g.hasOwnProperty(H) && "$" != H.charAt(0) && J.push(H);
                      J.sort();
                    }
                    C = J.length;
                    H = Array(C);
                    for (k = 0; k < C; k++)
                      if (S = g === J ? k : J[k], N = g[S], G = p(S, N, k), u[G])
                        x = u[G], delete u[G], z[G] = x, H[k] = x;
                      else {
                        if (z[G])
                          throw s(H, function(a) {
                            a && a.scope && (u[a.id] = a);
                          }), d("dupes", h, G, N);
                        H[k] = {
                          id: G,
                          scope: t,
                          clone: t
                        };
                        z[G] = !0;
                      }
                    for (E in u) {
                      x = u[E];
                      G = tb(x.clone);
                      c.leave(G);
                      if (G[0].parentNode)
                        for (k = 0, p = G.length; k < p; k++)
                          G[k].$$NG_REMOVED = !0;
                      x.scope.$destroy();
                    }
                    for (k = 0; k < C; k++)
                      if (S = g === J ? k : J[k], N = g[S], x = H[k], x.scope) {
                        E = n;
                        do
                          E = E.nextSibling;
 while (E && E.$$NG_REMOVED);
                        x.clone[0] != E && c.move(tb(x.clone), null, B(n));
                        n = x.clone[x.clone.length - 1];
                        e(x.scope, k, r, N, y, S, C);
                      } else
                        m(function(a, d) {
                          x.scope = d;
                          var f = l.cloneNode(!1);
                          a[a.length++] = f;
                          c.enter(a, null, B(n));
                          n = f;
                          x.clone = a;
                          z[x.id] = x;
                          e(x.scope, k, r, N, y, S, C);
                        });
                    u = z;
                  });
                };
              }
            };
          }],
          oe = ["$animate", function(a) {
            return {
              restrict: "A",
              multiElement: !0,
              link: function(c, d, e) {
                c.$watch(e.ngShow, function(c) {
                  a[c ? "removeClass" : "addClass"](d, "ng-hide", {tempClasses: "ng-hide-animate"});
                });
              }
            };
          }],
          he = ["$animate", function(a) {
            return {
              restrict: "A",
              multiElement: !0,
              link: function(c, d, e) {
                c.$watch(e.ngHide, function(c) {
                  a[c ? "addClass" : "removeClass"](d, "ng-hide", {tempClasses: "ng-hide-animate"});
                });
              }
            };
          }],
          pe = Ja(function(a, c, d) {
            a.$watch(d.ngStyle, function(a, d) {
              d && a !== d && s(d, function(a, d) {
                c.css(d, "");
              });
              a && c.css(a);
            }, !0);
          }),
          qe = ["$animate", function(a) {
            return {
              restrict: "EA",
              require: "ngSwitch",
              controller: ["$scope", function() {
                this.cases = {};
              }],
              link: function(c, d, e, f) {
                var g = [],
                    h = [],
                    l = [],
                    k = [],
                    m = function(a, c) {
                      return function() {
                        a.splice(c, 1);
                      };
                    };
                c.$watch(e.ngSwitch || e.on, function(c) {
                  var d,
                      e;
                  d = 0;
                  for (e = l.length; d < e; ++d)
                    a.cancel(l[d]);
                  d = l.length = 0;
                  for (e = k.length; d < e; ++d) {
                    var r = tb(h[d].clone);
                    k[d].$destroy();
                    (l[d] = a.leave(r)).then(m(l, d));
                  }
                  h.length = 0;
                  k.length = 0;
                  (g = f.cases["!" + c] || f.cases["?"]) && s(g, function(c) {
                    c.transclude(function(d, e) {
                      k.push(e);
                      var f = c.element;
                      d[d.length++] = Y.createComment(" end ngSwitchWhen: ");
                      h.push({clone: d});
                      a.enter(d, f.parent(), f);
                    });
                  });
                });
              }
            };
          }],
          re = Ja({
            transclude: "element",
            priority: 1200,
            require: "^ngSwitch",
            multiElement: !0,
            link: function(a, c, d, e, f) {
              e.cases["!" + d.ngSwitchWhen] = e.cases["!" + d.ngSwitchWhen] || [];
              e.cases["!" + d.ngSwitchWhen].push({
                transclude: f,
                element: c
              });
            }
          }),
          se = Ja({
            transclude: "element",
            priority: 1200,
            require: "^ngSwitch",
            multiElement: !0,
            link: function(a, c, d, e, f) {
              e.cases["?"] = e.cases["?"] || [];
              e.cases["?"].push({
                transclude: f,
                element: c
              });
            }
          }),
          ue = Ja({
            restrict: "EAC",
            link: function(a, c, d, e, f) {
              if (!f)
                throw T("ngTransclude")("orphan", va(c));
              f(function(a) {
                c.empty();
                c.append(a);
              });
            }
          }),
          Vd = ["$templateCache", function(a) {
            return {
              restrict: "E",
              terminal: !0,
              compile: function(c, d) {
                "text/ng-template" == d.type && a.put(d.id, c[0].text);
              }
            };
          }],
          eg = T("ngOptions"),
          te = da({
            restrict: "A",
            terminal: !0
          }),
          Wd = ["$compile", "$parse", function(a, c) {
            var d = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
                e = {$setViewValue: C};
            return {
              restrict: "E",
              require: ["select", "?ngModel"],
              controller: ["$element", "$scope", "$attrs", function(a, c, d) {
                var l = this,
                    k = {},
                    m = e,
                    p;
                l.databound = d.ngModel;
                l.init = function(a, c, d) {
                  m = a;
                  p = d;
                };
                l.addOption = function(c, d) {
                  Ma(c, '"option value"');
                  k[c] = !0;
                  m.$viewValue == c && (a.val(c), p.parent() && p.remove());
                  d && d[0].hasAttribute("selected") && (d[0].selected = !0);
                };
                l.removeOption = function(a) {
                  this.hasOption(a) && (delete k[a], m.$viewValue === a && this.renderUnknownOption(a));
                };
                l.renderUnknownOption = function(c) {
                  c = "? " + Na(c) + " ?";
                  p.val(c);
                  a.prepend(p);
                  a.val(c);
                  p.prop("selected", !0);
                };
                l.hasOption = function(a) {
                  return k.hasOwnProperty(a);
                };
                c.$on("$destroy", function() {
                  l.renderUnknownOption = C;
                });
              }],
              link: function(e, g, h, l) {
                function k(a, c, d, e) {
                  d.$render = function() {
                    var a = d.$viewValue;
                    e.hasOption(a) ? (C.parent() && C.remove(), c.val(a), "" === a && n.prop("selected", !0)) : D(a) && n ? c.val("") : e.renderUnknownOption(a);
                  };
                  c.on("change", function() {
                    a.$apply(function() {
                      C.parent() && C.remove();
                      d.$setViewValue(c.val());
                    });
                  });
                }
                function m(a, c, d) {
                  var e;
                  d.$render = function() {
                    var a = new db(d.$viewValue);
                    s(c.find("option"), function(c) {
                      c.selected = y(a.get(c.value));
                    });
                  };
                  a.$watch(function() {
                    fa(e, d.$viewValue) || (e = qa(d.$viewValue), d.$render());
                  });
                  c.on("change", function() {
                    a.$apply(function() {
                      var a = [];
                      s(c.find("option"), function(c) {
                        c.selected && a.push(c.value);
                      });
                      d.$setViewValue(a);
                    });
                  });
                }
                function p(e, f, g) {
                  function h(a, c, d) {
                    T[A] = d;
                    H && (T[H] = c);
                    return a(e, T);
                  }
                  function k(a) {
                    var c;
                    if (u)
                      if (M && x(a)) {
                        c = new db([]);
                        for (var d = 0; d < a.length; d++)
                          c.put(h(M, null, a[d]), !0);
                      } else
                        c = new db(a);
                    else
                      M && (a = h(M, null, a));
                    return function(d, e) {
                      var f;
                      f = M ? M : B ? B : F;
                      return u ? y(c.remove(h(f, d, e))) : a === h(f, d, e);
                    };
                  }
                  function l() {
                    v || (e.$$postDigest(p), v = !0);
                  }
                  function m(a, c, d) {
                    a[c] = a[c] || 0;
                    a[c] += d ? 1 : -1;
                  }
                  function p() {
                    v = !1;
                    var a = {"": []},
                        c = [""],
                        d,
                        l,
                        n,
                        r,
                        t;
                    n = g.$viewValue;
                    r = P(e) || [];
                    var B = H ? Object.keys(r).sort() : r,
                        x,
                        A,
                        D,
                        F,
                        N = {};
                    t = k(n);
                    var I = !1,
                        U,
                        V;
                    Q = {};
                    for (F = 0; D = B.length, F < D; F++) {
                      x = F;
                      if (H && (x = B[F], "$" === x.charAt(0)))
                        continue;
                      A = r[x];
                      d = h(J, x, A) || "";
                      (l = a[d]) || (l = a[d] = [], c.push(d));
                      d = t(x, A);
                      I = I || d;
                      A = h(C, x, A);
                      A = y(A) ? A : "";
                      V = M ? M(e, T) : H ? B[F] : F;
                      M && (Q[V] = x);
                      l.push({
                        id: V,
                        label: A,
                        selected: d
                      });
                    }
                    u || (z || null === n ? a[""].unshift({
                      id: "",
                      label: "",
                      selected: !I
                    }) : I || a[""].unshift({
                      id: "?",
                      label: "",
                      selected: !0
                    }));
                    x = 0;
                    for (B = c.length; x < B; x++) {
                      d = c[x];
                      l = a[d];
                      R.length <= x ? (n = {
                        element: G.clone().attr("label", d),
                        label: l.label
                      }, r = [n], R.push(r), f.append(n.element)) : (r = R[x], n = r[0], n.label != d && n.element.attr("label", n.label = d));
                      I = null;
                      F = 0;
                      for (D = l.length; F < D; F++)
                        d = l[F], (t = r[F + 1]) ? (I = t.element, t.label !== d.label && (m(N, t.label, !1), m(N, d.label, !0), I.text(t.label = d.label), I.prop("label", t.label)), t.id !== d.id && I.val(t.id = d.id), I[0].selected !== d.selected && (I.prop("selected", t.selected = d.selected), Ra && I.prop("selected", t.selected))) : ("" === d.id && z ? U = z : (U = w.clone()).val(d.id).prop("selected", d.selected).attr("selected", d.selected).prop("label", d.label).text(d.label), r.push(t = {
                          element: U,
                          label: d.label,
                          id: d.id,
                          selected: d.selected
                        }), m(N, d.label, !0), I ? I.after(U) : n.element.append(U), I = U);
                      for (F++; r.length > F; )
                        d = r.pop(), m(N, d.label, !1), d.element.remove();
                    }
                    for (; R.length > x; ) {
                      l = R.pop();
                      for (F = 1; F < l.length; ++F)
                        m(N, l[F].label, !1);
                      l[0].element.remove();
                    }
                    s(N, function(a, c) {
                      0 < a ? q.addOption(c) : 0 > a && q.removeOption(c);
                    });
                  }
                  var n;
                  if (!(n = r.match(d)))
                    throw eg("iexp", r, va(f));
                  var C = c(n[2] || n[1]),
                      A = n[4] || n[6],
                      D = / as /.test(n[0]) && n[1],
                      B = D ? c(D) : null,
                      H = n[5],
                      J = c(n[3] || ""),
                      F = c(n[2] ? n[1] : A),
                      P = c(n[7]),
                      M = n[8] ? c(n[8]) : null,
                      Q = {},
                      R = [[{
                        element: f,
                        label: ""
                      }]],
                      T = {};
                  z && (a(z)(e), z.removeClass("ng-scope"), z.remove());
                  f.empty();
                  f.on("change", function() {
                    e.$apply(function() {
                      var a = P(e) || [],
                          c;
                      if (u)
                        c = [], s(f.val(), function(d) {
                          d = M ? Q[d] : d;
                          c.push("?" === d ? t : "" === d ? null : h(B ? B : F, d, a[d]));
                        });
                      else {
                        var d = M ? Q[f.val()] : f.val();
                        c = "?" === d ? t : "" === d ? null : h(B ? B : F, d, a[d]);
                      }
                      g.$setViewValue(c);
                      p();
                    });
                  });
                  g.$render = p;
                  e.$watchCollection(P, l);
                  e.$watchCollection(function() {
                    var a = P(e),
                        c;
                    if (a && x(a)) {
                      c = Array(a.length);
                      for (var d = 0,
                          f = a.length; d < f; d++)
                        c[d] = h(C, d, a[d]);
                    } else if (a)
                      for (d in c = {}, a)
                        a.hasOwnProperty(d) && (c[d] = h(C, d, a[d]));
                    return c;
                  }, l);
                  u && e.$watchCollection(function() {
                    return g.$modelValue;
                  }, l);
                }
                if (l[1]) {
                  var q = l[0];
                  l = l[1];
                  var u = h.multiple,
                      r = h.ngOptions,
                      z = !1,
                      n,
                      v = !1,
                      w = B(Y.createElement("option")),
                      G = B(Y.createElement("optgroup")),
                      C = w.clone();
                  h = 0;
                  for (var A = g.children(),
                      H = A.length; h < H; h++)
                    if ("" === A[h].value) {
                      n = z = A.eq(h);
                      break;
                    }
                  q.init(l, z, C);
                  u && (l.$isEmpty = function(a) {
                    return !a || 0 === a.length;
                  });
                  r ? p(e, g, l) : u ? m(e, g, l) : k(e, g, l, q);
                }
              }
            };
          }],
          Yd = ["$interpolate", function(a) {
            var c = {
              addOption: C,
              removeOption: C
            };
            return {
              restrict: "E",
              priority: 100,
              compile: function(d, e) {
                if (D(e.value)) {
                  var f = a(d.text(), !0);
                  f || e.$set("value", d.text());
                }
                return function(a, d, e) {
                  var k = d.parent(),
                      m = k.data("$selectController") || k.parent().data("$selectController");
                  m && m.databound || (m = c);
                  f ? a.$watch(f, function(a, c) {
                    e.$set("value", a);
                    c !== a && m.removeOption(c);
                    m.addOption(a, d);
                  }) : m.addOption(e.value, d);
                  d.on("$destroy", function() {
                    m.removeOption(e.value);
                  });
                };
              }
            };
          }],
          Xd = da({
            restrict: "E",
            terminal: !1
          });
      M.angular.bootstrap ? console.log("WARNING: Tried to load angular more than once.") : (Nd(), Pd(ga), B(Y).ready(function() {
        Jd(Y, sc);
      }));
    })(window, document);
    !window.angular.$$csp() && window.angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}</style>');
  }).call(System.global);
  return System.get("@@global-helpers").retrieveGlobal(__module.id, "angular");
});



System.register("github:systemjs/plugin-css@0.1.0/css", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  if (typeof window !== 'undefined') {
    var waitSeconds = 100;
    var head = document.getElementsByTagName('head')[0];
    var links = document.getElementsByTagName('link');
    var linkHrefs = [];
    for (var i = 0; i < links.length; i++) {
      linkHrefs.push(links[i].href);
    }
    var isWebkit = !!window.navigator.userAgent.match(/AppleWebKit\/([^ ;]*)/);
    var webkitLoadCheck = function(link, callback) {
      setTimeout(function() {
        for (var i = 0; i < document.styleSheets.length; i++) {
          var sheet = document.styleSheets[i];
          if (sheet.href == link.href)
            return callback();
        }
        webkitLoadCheck(link, callback);
      }, 10);
    };
    var noop = function() {};
    var loadCSS = function(url) {
      return new Promise(function(resolve, reject) {
        var timeout = setTimeout(function() {
          reject('Unable to load CSS');
        }, waitSeconds * 1000);
        var _callback = function() {
          clearTimeout(timeout);
          link.onload = noop;
          setTimeout(function() {
            resolve('');
          }, 7);
        };
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        if (!isWebkit)
          link.onload = _callback;
        else
          webkitLoadCheck(link, _callback);
        head.appendChild(link);
      });
    };
    exports.fetch = function(load) {
      for (var i = 0; i < linkHrefs.length; i++)
        if (load.address == linkHrefs[i])
          return '';
      return loadCSS(load.address);
    };
  } else {
    exports.build = false;
  }
  global.define = __define;
  return module.exports;
});



System.register("github:driftyco/ionic-bower@1.0.0-beta.14/js/ionic", [], false, function(__require, __exports, __module) {
  System.get("@@global-helpers").prepareGlobal(__module.id, []);
  (function() {
    "format global";
    (function() {
      window.ionic = window.ionic || {};
      window.ionic.views = {};
      window.ionic.version = '1.0.0-beta.14';
      (function(ionic) {
        ionic.DelegateService = function(methodNames) {
          if (methodNames.indexOf('$getByHandle') > -1) {
            throw new Error("Method '$getByHandle' is implicitly added to each delegate service. Do not list it as a method.");
          }
          function trueFn() {
            return true;
          }
          return ['$log', function($log) {
            function DelegateInstance(instances, handle) {
              this._instances = instances;
              this.handle = handle;
            }
            methodNames.forEach(function(methodName) {
              DelegateInstance.prototype[methodName] = instanceMethodCaller(methodName);
            });
            function DelegateService() {
              this._instances = [];
            }
            DelegateService.prototype = DelegateInstance.prototype;
            DelegateService.prototype._registerInstance = function(instance, handle, filterFn) {
              var instances = this._instances;
              instance.$$delegateHandle = handle;
              instance.$$filterFn = filterFn || trueFn;
              instances.push(instance);
              return function deregister() {
                var index = instances.indexOf(instance);
                if (index !== -1) {
                  instances.splice(index, 1);
                }
              };
            };
            DelegateService.prototype.$getByHandle = function(handle) {
              return new DelegateInstance(this._instances, handle);
            };
            return new DelegateService();
            function instanceMethodCaller(methodName) {
              return function caller() {
                var handle = this.handle;
                var args = arguments;
                var foundInstancesCount = 0;
                var returnValue;
                this._instances.forEach(function(instance) {
                  if ((!handle || handle == instance.$$delegateHandle) && instance.$$filterFn(instance)) {
                    foundInstancesCount++;
                    var ret = instance[methodName].apply(instance, args);
                    if (foundInstancesCount === 1) {
                      returnValue = ret;
                    }
                  }
                });
                if (!foundInstancesCount && handle) {
                  return $log.warn('Delegate for handle "' + handle + '" could not find a ' + 'corresponding element with delegate-handle="' + handle + '"! ' + methodName + '() was not called!\n' + 'Possible cause: If you are calling ' + methodName + '() immediately, and ' + 'your element with delegate-handle="' + handle + '" is a child of your ' + 'controller, then your element may not be compiled yet. Put a $timeout ' + 'around your call to ' + methodName + '() and try again.');
                }
                return returnValue;
              };
            }
          }];
        };
      })(window.ionic);
      (function(window, document, ionic) {
        var readyCallbacks = [];
        var isDomReady = document.readyState === 'complete' || document.readyState === 'interactive';
        function domReady() {
          isDomReady = true;
          for (var x = 0; x < readyCallbacks.length; x++) {
            ionic.requestAnimationFrame(readyCallbacks[x]);
          }
          readyCallbacks = [];
          document.removeEventListener('DOMContentLoaded', domReady);
        }
        if (!isDomReady) {
          document.addEventListener('DOMContentLoaded', domReady);
        }
        window._rAF = (function() {
          return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 16);
          };
        })();
        var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelRequestAnimationFrame;
        ionic.DomUtil = {
          requestAnimationFrame: function(cb) {
            return window._rAF(cb);
          },
          cancelAnimationFrame: function(requestId) {
            cancelAnimationFrame(requestId);
          },
          animationFrameThrottle: function(cb) {
            var args,
                isQueued,
                context;
            return function() {
              args = arguments;
              context = this;
              if (!isQueued) {
                isQueued = true;
                ionic.requestAnimationFrame(function() {
                  cb.apply(context, args);
                  isQueued = false;
                });
              }
            };
          },
          getPositionInParent: function(el) {
            return {
              left: el.offsetLeft,
              top: el.offsetTop
            };
          },
          ready: function(cb) {
            if (isDomReady) {
              ionic.requestAnimationFrame(cb);
            } else {
              readyCallbacks.push(cb);
            }
          },
          getTextBounds: function(textNode) {
            if (document.createRange) {
              var range = document.createRange();
              range.selectNodeContents(textNode);
              if (range.getBoundingClientRect) {
                var rect = range.getBoundingClientRect();
                if (rect) {
                  var sx = window.scrollX;
                  var sy = window.scrollY;
                  return {
                    top: rect.top + sy,
                    left: rect.left + sx,
                    right: rect.left + sx + rect.width,
                    bottom: rect.top + sy + rect.height,
                    width: rect.width,
                    height: rect.height
                  };
                }
              }
            }
            return null;
          },
          getChildIndex: function(element, type) {
            if (type) {
              var ch = element.parentNode.children;
              var c;
              for (var i = 0,
                  k = 0,
                  j = ch.length; i < j; i++) {
                c = ch[i];
                if (c.nodeName && c.nodeName.toLowerCase() == type) {
                  if (c == element) {
                    return k;
                  }
                  k++;
                }
              }
            }
            return Array.prototype.slice.call(element.parentNode.children).indexOf(element);
          },
          swapNodes: function(src, dest) {
            dest.parentNode.insertBefore(src, dest);
          },
          elementIsDescendant: function(el, parent, stopAt) {
            var current = el;
            do {
              if (current === parent)
                return true;
              current = current.parentNode;
            } while (current && current !== stopAt);
            return false;
          },
          getParentWithClass: function(e, className, depth) {
            depth = depth || 10;
            while (e.parentNode && depth--) {
              if (e.parentNode.classList && e.parentNode.classList.contains(className)) {
                return e.parentNode;
              }
              e = e.parentNode;
            }
            return null;
          },
          getParentOrSelfWithClass: function(e, className, depth) {
            depth = depth || 10;
            while (e && depth--) {
              if (e.classList && e.classList.contains(className)) {
                return e;
              }
              e = e.parentNode;
            }
            return null;
          },
          rectContains: function(x, y, x1, y1, x2, y2) {
            if (x < x1 || x > x2)
              return false;
            if (y < y1 || y > y2)
              return false;
            return true;
          },
          blurAll: function() {
            if (document.activeElement && document.activeElement != document.body) {
              document.activeElement.blur();
              return document.activeElement;
            }
            return null;
          },
          cachedAttr: function(ele, key, value) {
            ele = ele && ele.length && ele[0] || ele;
            if (ele && ele.setAttribute) {
              var dataKey = '$attr-' + key;
              if (arguments.length > 2) {
                if (ele[dataKey] !== value) {
                  ele.setAttribute(key, value);
                  ele[dataKey] = value;
                }
              } else if (typeof ele[dataKey] == 'undefined') {
                ele[dataKey] = ele.getAttribute(key);
              }
              return ele[dataKey];
            }
          },
          cachedStyles: function(ele, styles) {
            ele = ele && ele.length && ele[0] || ele;
            if (ele && ele.style) {
              for (var prop in styles) {
                if (ele['$style-' + prop] !== styles[prop]) {
                  ele.style[prop] = ele['$style-' + prop] = styles[prop];
                }
              }
            }
          }
        };
        ionic.requestAnimationFrame = ionic.DomUtil.requestAnimationFrame;
        ionic.cancelAnimationFrame = ionic.DomUtil.cancelAnimationFrame;
        ionic.animationFrameThrottle = ionic.DomUtil.animationFrameThrottle;
      })(window, document, ionic);
      (function(ionic) {
        ionic.CustomEvent = (function() {
          if (typeof window.CustomEvent === 'function')
            return CustomEvent;
          var customEvent = function(event, params) {
            var evt;
            params = params || {
              bubbles: false,
              cancelable: false,
              detail: undefined
            };
            try {
              evt = document.createEvent("CustomEvent");
              evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            } catch (error) {
              evt = document.createEvent("Event");
              for (var param in params) {
                evt[param] = params[param];
              }
              evt.initEvent(event, params.bubbles, params.cancelable);
            }
            return evt;
          };
          customEvent.prototype = window.Event.prototype;
          return customEvent;
        })();
        ionic.EventController = {
          VIRTUALIZED_EVENTS: ['tap', 'swipe', 'swiperight', 'swipeleft', 'drag', 'hold', 'release'],
          trigger: function(eventType, data, bubbles, cancelable) {
            var event = new ionic.CustomEvent(eventType, {
              detail: data,
              bubbles: !!bubbles,
              cancelable: !!cancelable
            });
            data && data.target && data.target.dispatchEvent && data.target.dispatchEvent(event) || window.dispatchEvent(event);
          },
          on: function(type, callback, element) {
            var e = element || window;
            for (var i = 0,
                j = this.VIRTUALIZED_EVENTS.length; i < j; i++) {
              if (type == this.VIRTUALIZED_EVENTS[i]) {
                var gesture = new ionic.Gesture(element);
                gesture.on(type, callback);
                return gesture;
              }
            }
            e.addEventListener(type, callback);
          },
          off: function(type, callback, element) {
            element.removeEventListener(type, callback);
          },
          onGesture: function(type, callback, element, options) {
            var gesture = new ionic.Gesture(element, options);
            gesture.on(type, callback);
            return gesture;
          },
          offGesture: function(gesture, type, callback) {
            gesture.off(type, callback);
          },
          handlePopState: function(event) {}
        };
        ionic.on = function() {
          ionic.EventController.on.apply(ionic.EventController, arguments);
        };
        ionic.off = function() {
          ionic.EventController.off.apply(ionic.EventController, arguments);
        };
        ionic.trigger = ionic.EventController.trigger;
        ionic.onGesture = function() {
          return ionic.EventController.onGesture.apply(ionic.EventController.onGesture, arguments);
        };
        ionic.offGesture = function() {
          return ionic.EventController.offGesture.apply(ionic.EventController.offGesture, arguments);
        };
      })(window.ionic);
      (function(ionic) {
        ionic.Gesture = function(element, options) {
          return new ionic.Gestures.Instance(element, options || {});
        };
        ionic.Gestures = {};
        ionic.Gestures.defaults = {stop_browser_behavior: 'disable-user-behavior'};
        ionic.Gestures.HAS_POINTEREVENTS = window.navigator.pointerEnabled || window.navigator.msPointerEnabled;
        ionic.Gestures.HAS_TOUCHEVENTS = ('ontouchstart' in window);
        ionic.Gestures.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android|silk/i;
        ionic.Gestures.NO_MOUSEEVENTS = ionic.Gestures.HAS_TOUCHEVENTS && window.navigator.userAgent.match(ionic.Gestures.MOBILE_REGEX);
        ionic.Gestures.EVENT_TYPES = {};
        ionic.Gestures.DIRECTION_DOWN = 'down';
        ionic.Gestures.DIRECTION_LEFT = 'left';
        ionic.Gestures.DIRECTION_UP = 'up';
        ionic.Gestures.DIRECTION_RIGHT = 'right';
        ionic.Gestures.POINTER_MOUSE = 'mouse';
        ionic.Gestures.POINTER_TOUCH = 'touch';
        ionic.Gestures.POINTER_PEN = 'pen';
        ionic.Gestures.EVENT_START = 'start';
        ionic.Gestures.EVENT_MOVE = 'move';
        ionic.Gestures.EVENT_END = 'end';
        ionic.Gestures.DOCUMENT = window.document;
        ionic.Gestures.plugins = {};
        ionic.Gestures.READY = false;
        function setup() {
          if (ionic.Gestures.READY) {
            return;
          }
          ionic.Gestures.event.determineEventTypes();
          for (var name in ionic.Gestures.gestures) {
            if (ionic.Gestures.gestures.hasOwnProperty(name)) {
              ionic.Gestures.detection.register(ionic.Gestures.gestures[name]);
            }
          }
          ionic.Gestures.event.onTouch(ionic.Gestures.DOCUMENT, ionic.Gestures.EVENT_MOVE, ionic.Gestures.detection.detect);
          ionic.Gestures.event.onTouch(ionic.Gestures.DOCUMENT, ionic.Gestures.EVENT_END, ionic.Gestures.detection.detect);
          ionic.Gestures.READY = true;
        }
        ionic.Gestures.Instance = function(element, options) {
          var self = this;
          if (element === null) {
            void 0;
            return;
          }
          setup();
          this.element = element;
          this.enabled = true;
          this.options = ionic.Gestures.utils.extend(ionic.Gestures.utils.extend({}, ionic.Gestures.defaults), options || {});
          if (this.options.stop_browser_behavior) {
            ionic.Gestures.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior);
          }
          ionic.Gestures.event.onTouch(element, ionic.Gestures.EVENT_START, function(ev) {
            if (self.enabled) {
              ionic.Gestures.detection.startDetect(self, ev);
            }
          });
          return this;
        };
        ionic.Gestures.Instance.prototype = {
          on: function onEvent(gesture, handler) {
            var gestures = gesture.split(' ');
            for (var t = 0; t < gestures.length; t++) {
              this.element.addEventListener(gestures[t], handler, false);
            }
            return this;
          },
          off: function offEvent(gesture, handler) {
            var gestures = gesture.split(' ');
            for (var t = 0; t < gestures.length; t++) {
              this.element.removeEventListener(gestures[t], handler, false);
            }
            return this;
          },
          trigger: function triggerEvent(gesture, eventData) {
            var event = ionic.Gestures.DOCUMENT.createEvent('Event');
            event.initEvent(gesture, true, true);
            event.gesture = eventData;
            var element = this.element;
            if (ionic.Gestures.utils.hasParent(eventData.target, element)) {
              element = eventData.target;
            }
            element.dispatchEvent(event);
            return this;
          },
          enable: function enable(state) {
            this.enabled = state;
            return this;
          }
        };
        var last_move_event = null;
        var enable_detect = false;
        var touch_triggered = false;
        ionic.Gestures.event = {
          bindDom: function(element, type, handler) {
            var types = type.split(' ');
            for (var t = 0; t < types.length; t++) {
              element.addEventListener(types[t], handler, false);
            }
          },
          onTouch: function onTouch(element, eventType, handler) {
            var self = this;
            this.bindDom(element, ionic.Gestures.EVENT_TYPES[eventType], function bindDomOnTouch(ev) {
              var sourceEventType = ev.type.toLowerCase();
              if (sourceEventType.match(/mouse/) && touch_triggered) {
                return;
              } else if (sourceEventType.match(/touch/) || sourceEventType.match(/pointerdown/) || (sourceEventType.match(/mouse/) && ev.which === 1)) {
                enable_detect = true;
              } else if (sourceEventType.match(/mouse/) && ev.which !== 1) {
                enable_detect = false;
              }
              if (sourceEventType.match(/touch|pointer/)) {
                touch_triggered = true;
              }
              var count_touches = 0;
              if (enable_detect) {
                if (ionic.Gestures.HAS_POINTEREVENTS && eventType != ionic.Gestures.EVENT_END) {
                  count_touches = ionic.Gestures.PointerEvent.updatePointer(eventType, ev);
                } else if (sourceEventType.match(/touch/)) {
                  count_touches = ev.touches.length;
                } else if (!touch_triggered) {
                  count_touches = sourceEventType.match(/up/) ? 0 : 1;
                }
                if (count_touches > 0 && eventType == ionic.Gestures.EVENT_END) {
                  eventType = ionic.Gestures.EVENT_MOVE;
                } else if (!count_touches) {
                  eventType = ionic.Gestures.EVENT_END;
                }
                if (count_touches || last_move_event === null) {
                  last_move_event = ev;
                }
                handler.call(ionic.Gestures.detection, self.collectEventData(element, eventType, self.getTouchList(last_move_event, eventType), ev));
                if (ionic.Gestures.HAS_POINTEREVENTS && eventType == ionic.Gestures.EVENT_END) {
                  count_touches = ionic.Gestures.PointerEvent.updatePointer(eventType, ev);
                }
              }
              if (!count_touches) {
                last_move_event = null;
                enable_detect = false;
                touch_triggered = false;
                ionic.Gestures.PointerEvent.reset();
              }
            });
          },
          determineEventTypes: function determineEventTypes() {
            var types;
            if (ionic.Gestures.HAS_POINTEREVENTS) {
              types = ionic.Gestures.PointerEvent.getEvents();
            } else if (ionic.Gestures.NO_MOUSEEVENTS) {
              types = ['touchstart', 'touchmove', 'touchend touchcancel'];
            } else {
              types = ['touchstart mousedown', 'touchmove mousemove', 'touchend touchcancel mouseup'];
            }
            ionic.Gestures.EVENT_TYPES[ionic.Gestures.EVENT_START] = types[0];
            ionic.Gestures.EVENT_TYPES[ionic.Gestures.EVENT_MOVE] = types[1];
            ionic.Gestures.EVENT_TYPES[ionic.Gestures.EVENT_END] = types[2];
          },
          getTouchList: function getTouchList(ev) {
            if (ionic.Gestures.HAS_POINTEREVENTS) {
              return ionic.Gestures.PointerEvent.getTouchList();
            } else if (ev.touches) {
              return ev.touches;
            } else {
              ev.identifier = 1;
              return [ev];
            }
          },
          collectEventData: function collectEventData(element, eventType, touches, ev) {
            var pointerType = ionic.Gestures.POINTER_TOUCH;
            if (ev.type.match(/mouse/) || ionic.Gestures.PointerEvent.matchType(ionic.Gestures.POINTER_MOUSE, ev)) {
              pointerType = ionic.Gestures.POINTER_MOUSE;
            }
            return {
              center: ionic.Gestures.utils.getCenter(touches),
              timeStamp: new Date().getTime(),
              target: ev.target,
              touches: touches,
              eventType: eventType,
              pointerType: pointerType,
              srcEvent: ev,
              preventDefault: function() {
                if (this.srcEvent.preventManipulation) {
                  this.srcEvent.preventManipulation();
                }
                if (this.srcEvent.preventDefault) {}
              },
              stopPropagation: function() {
                this.srcEvent.stopPropagation();
              },
              stopDetect: function() {
                return ionic.Gestures.detection.stopDetect();
              }
            };
          }
        };
        ionic.Gestures.PointerEvent = {
          pointers: {},
          getTouchList: function() {
            var self = this;
            var touchlist = [];
            Object.keys(self.pointers).sort().forEach(function(id) {
              touchlist.push(self.pointers[id]);
            });
            return touchlist;
          },
          updatePointer: function(type, pointerEvent) {
            if (type == ionic.Gestures.EVENT_END) {
              this.pointers = {};
            } else {
              pointerEvent.identifier = pointerEvent.pointerId;
              this.pointers[pointerEvent.pointerId] = pointerEvent;
            }
            return Object.keys(this.pointers).length;
          },
          matchType: function(pointerType, ev) {
            if (!ev.pointerType) {
              return false;
            }
            var types = {};
            types[ionic.Gestures.POINTER_MOUSE] = (ev.pointerType == ev.MSPOINTER_TYPE_MOUSE || ev.pointerType == ionic.Gestures.POINTER_MOUSE);
            types[ionic.Gestures.POINTER_TOUCH] = (ev.pointerType == ev.MSPOINTER_TYPE_TOUCH || ev.pointerType == ionic.Gestures.POINTER_TOUCH);
            types[ionic.Gestures.POINTER_PEN] = (ev.pointerType == ev.MSPOINTER_TYPE_PEN || ev.pointerType == ionic.Gestures.POINTER_PEN);
            return types[pointerType];
          },
          getEvents: function() {
            return ['pointerdown MSPointerDown', 'pointermove MSPointerMove', 'pointerup pointercancel MSPointerUp MSPointerCancel'];
          },
          reset: function() {
            this.pointers = {};
          }
        };
        ionic.Gestures.utils = {
          extend: function extend(dest, src, merge) {
            for (var key in src) {
              if (dest[key] !== undefined && merge) {
                continue;
              }
              dest[key] = src[key];
            }
            return dest;
          },
          hasParent: function(node, parent) {
            while (node) {
              if (node == parent) {
                return true;
              }
              node = node.parentNode;
            }
            return false;
          },
          getCenter: function getCenter(touches) {
            var valuesX = [],
                valuesY = [];
            for (var t = 0,
                len = touches.length; t < len; t++) {
              valuesX.push(touches[t].pageX);
              valuesY.push(touches[t].pageY);
            }
            return {
              pageX: ((Math.min.apply(Math, valuesX) + Math.max.apply(Math, valuesX)) / 2),
              pageY: ((Math.min.apply(Math, valuesY) + Math.max.apply(Math, valuesY)) / 2)
            };
          },
          getVelocity: function getVelocity(delta_time, delta_x, delta_y) {
            return {
              x: Math.abs(delta_x / delta_time) || 0,
              y: Math.abs(delta_y / delta_time) || 0
            };
          },
          getAngle: function getAngle(touch1, touch2) {
            var y = touch2.pageY - touch1.pageY,
                x = touch2.pageX - touch1.pageX;
            return Math.atan2(y, x) * 180 / Math.PI;
          },
          getDirection: function getDirection(touch1, touch2) {
            var x = Math.abs(touch1.pageX - touch2.pageX),
                y = Math.abs(touch1.pageY - touch2.pageY);
            if (x >= y) {
              return touch1.pageX - touch2.pageX > 0 ? ionic.Gestures.DIRECTION_LEFT : ionic.Gestures.DIRECTION_RIGHT;
            } else {
              return touch1.pageY - touch2.pageY > 0 ? ionic.Gestures.DIRECTION_UP : ionic.Gestures.DIRECTION_DOWN;
            }
          },
          getDistance: function getDistance(touch1, touch2) {
            var x = touch2.pageX - touch1.pageX,
                y = touch2.pageY - touch1.pageY;
            return Math.sqrt((x * x) + (y * y));
          },
          getScale: function getScale(start, end) {
            if (start.length >= 2 && end.length >= 2) {
              return this.getDistance(end[0], end[1]) / this.getDistance(start[0], start[1]);
            }
            return 1;
          },
          getRotation: function getRotation(start, end) {
            if (start.length >= 2 && end.length >= 2) {
              return this.getAngle(end[1], end[0]) - this.getAngle(start[1], start[0]);
            }
            return 0;
          },
          isVertical: function isVertical(direction) {
            return (direction == ionic.Gestures.DIRECTION_UP || direction == ionic.Gestures.DIRECTION_DOWN);
          },
          stopDefaultBrowserBehavior: function stopDefaultBrowserBehavior(element, css_class) {
            if (element && element.classList) {
              element.classList.add(css_class);
              element.onselectstart = function() {
                return false;
              };
            }
          }
        };
        ionic.Gestures.detection = {
          gestures: [],
          current: null,
          previous: null,
          stopped: false,
          startDetect: function startDetect(inst, eventData) {
            if (this.current) {
              return;
            }
            this.stopped = false;
            this.current = {
              inst: inst,
              startEvent: ionic.Gestures.utils.extend({}, eventData),
              lastEvent: false,
              name: ''
            };
            this.detect(eventData);
          },
          detect: function detect(eventData) {
            if (!this.current || this.stopped) {
              return;
            }
            eventData = this.extendEventData(eventData);
            var inst_options = this.current.inst.options;
            for (var g = 0,
                len = this.gestures.length; g < len; g++) {
              var gesture = this.gestures[g];
              if (!this.stopped && inst_options[gesture.name] !== false) {
                if (gesture.handler.call(gesture, eventData, this.current.inst) === false) {
                  this.stopDetect();
                  break;
                }
              }
            }
            if (this.current) {
              this.current.lastEvent = eventData;
            }
            if (eventData.eventType == ionic.Gestures.EVENT_END && !eventData.touches.length - 1) {
              this.stopDetect();
            }
            return eventData;
          },
          stopDetect: function stopDetect() {
            this.previous = ionic.Gestures.utils.extend({}, this.current);
            this.current = null;
            this.stopped = true;
          },
          extendEventData: function extendEventData(ev) {
            var startEv = this.current.startEvent;
            if (startEv && (ev.touches.length != startEv.touches.length || ev.touches === startEv.touches)) {
              startEv.touches = [];
              for (var i = 0,
                  len = ev.touches.length; i < len; i++) {
                startEv.touches.push(ionic.Gestures.utils.extend({}, ev.touches[i]));
              }
            }
            var delta_time = ev.timeStamp - startEv.timeStamp,
                delta_x = ev.center.pageX - startEv.center.pageX,
                delta_y = ev.center.pageY - startEv.center.pageY,
                velocity = ionic.Gestures.utils.getVelocity(delta_time, delta_x, delta_y);
            ionic.Gestures.utils.extend(ev, {
              deltaTime: delta_time,
              deltaX: delta_x,
              deltaY: delta_y,
              velocityX: velocity.x,
              velocityY: velocity.y,
              distance: ionic.Gestures.utils.getDistance(startEv.center, ev.center),
              angle: ionic.Gestures.utils.getAngle(startEv.center, ev.center),
              direction: ionic.Gestures.utils.getDirection(startEv.center, ev.center),
              scale: ionic.Gestures.utils.getScale(startEv.touches, ev.touches),
              rotation: ionic.Gestures.utils.getRotation(startEv.touches, ev.touches),
              startEvent: startEv
            });
            return ev;
          },
          register: function register(gesture) {
            var options = gesture.defaults || {};
            if (options[gesture.name] === undefined) {
              options[gesture.name] = true;
            }
            ionic.Gestures.utils.extend(ionic.Gestures.defaults, options, true);
            gesture.index = gesture.index || 1000;
            this.gestures.push(gesture);
            this.gestures.sort(function(a, b) {
              if (a.index < b.index) {
                return -1;
              }
              if (a.index > b.index) {
                return 1;
              }
              return 0;
            });
            return this.gestures;
          }
        };
        ionic.Gestures.gestures = ionic.Gestures.gestures || {};
        ionic.Gestures.gestures.Hold = {
          name: 'hold',
          index: 10,
          defaults: {
            hold_timeout: 500,
            hold_threshold: 1
          },
          timer: null,
          handler: function holdGesture(ev, inst) {
            switch (ev.eventType) {
              case ionic.Gestures.EVENT_START:
                clearTimeout(this.timer);
                ionic.Gestures.detection.current.name = this.name;
                this.timer = setTimeout(function() {
                  if (ionic.Gestures.detection.current.name == 'hold') {
                    ionic.tap.cancelClick();
                    inst.trigger('hold', ev);
                  }
                }, inst.options.hold_timeout);
                break;
              case ionic.Gestures.EVENT_MOVE:
                if (ev.distance > inst.options.hold_threshold) {
                  clearTimeout(this.timer);
                }
                break;
              case ionic.Gestures.EVENT_END:
                clearTimeout(this.timer);
                break;
            }
          }
        };
        ionic.Gestures.gestures.Tap = {
          name: 'tap',
          index: 100,
          defaults: {
            tap_max_touchtime: 250,
            tap_max_distance: 10,
            tap_always: true,
            doubletap_distance: 20,
            doubletap_interval: 300
          },
          handler: function tapGesture(ev, inst) {
            if (ev.eventType == ionic.Gestures.EVENT_END && ev.srcEvent.type != 'touchcancel') {
              var prev = ionic.Gestures.detection.previous,
                  did_doubletap = false;
              if (ev.deltaTime > inst.options.tap_max_touchtime || ev.distance > inst.options.tap_max_distance) {
                return;
              }
              if (prev && prev.name == 'tap' && (ev.timeStamp - prev.lastEvent.timeStamp) < inst.options.doubletap_interval && ev.distance < inst.options.doubletap_distance) {
                inst.trigger('doubletap', ev);
                did_doubletap = true;
              }
              if (!did_doubletap || inst.options.tap_always) {
                ionic.Gestures.detection.current.name = 'tap';
                inst.trigger('tap', ev);
              }
            }
          }
        };
        ionic.Gestures.gestures.Swipe = {
          name: 'swipe',
          index: 40,
          defaults: {
            swipe_max_touches: 1,
            swipe_velocity: 0.7
          },
          handler: function swipeGesture(ev, inst) {
            if (ev.eventType == ionic.Gestures.EVENT_END) {
              if (inst.options.swipe_max_touches > 0 && ev.touches.length > inst.options.swipe_max_touches) {
                return;
              }
              if (ev.velocityX > inst.options.swipe_velocity || ev.velocityY > inst.options.swipe_velocity) {
                inst.trigger(this.name, ev);
                inst.trigger(this.name + ev.direction, ev);
              }
            }
          }
        };
        ionic.Gestures.gestures.Drag = {
          name: 'drag',
          index: 50,
          defaults: {
            drag_min_distance: 10,
            correct_for_drag_min_distance: true,
            drag_max_touches: 1,
            drag_block_horizontal: true,
            drag_block_vertical: true,
            drag_lock_to_axis: false,
            drag_lock_min_distance: 25
          },
          triggered: false,
          handler: function dragGesture(ev, inst) {
            if (ionic.Gestures.detection.current.name != this.name && this.triggered) {
              inst.trigger(this.name + 'end', ev);
              this.triggered = false;
              return;
            }
            if (inst.options.drag_max_touches > 0 && ev.touches.length > inst.options.drag_max_touches) {
              return;
            }
            switch (ev.eventType) {
              case ionic.Gestures.EVENT_START:
                this.triggered = false;
                break;
              case ionic.Gestures.EVENT_MOVE:
                if (ev.distance < inst.options.drag_min_distance && ionic.Gestures.detection.current.name != this.name) {
                  return;
                }
                if (ionic.Gestures.detection.current.name != this.name) {
                  ionic.Gestures.detection.current.name = this.name;
                  if (inst.options.correct_for_drag_min_distance) {
                    var factor = Math.abs(inst.options.drag_min_distance / ev.distance);
                    ionic.Gestures.detection.current.startEvent.center.pageX += ev.deltaX * factor;
                    ionic.Gestures.detection.current.startEvent.center.pageY += ev.deltaY * factor;
                    ev = ionic.Gestures.detection.extendEventData(ev);
                  }
                }
                if (ionic.Gestures.detection.current.lastEvent.drag_locked_to_axis || (inst.options.drag_lock_to_axis && inst.options.drag_lock_min_distance <= ev.distance)) {
                  ev.drag_locked_to_axis = true;
                }
                var last_direction = ionic.Gestures.detection.current.lastEvent.direction;
                if (ev.drag_locked_to_axis && last_direction !== ev.direction) {
                  if (ionic.Gestures.utils.isVertical(last_direction)) {
                    ev.direction = (ev.deltaY < 0) ? ionic.Gestures.DIRECTION_UP : ionic.Gestures.DIRECTION_DOWN;
                  } else {
                    ev.direction = (ev.deltaX < 0) ? ionic.Gestures.DIRECTION_LEFT : ionic.Gestures.DIRECTION_RIGHT;
                  }
                }
                if (!this.triggered) {
                  inst.trigger(this.name + 'start', ev);
                  this.triggered = true;
                }
                inst.trigger(this.name, ev);
                inst.trigger(this.name + ev.direction, ev);
                if ((inst.options.drag_block_vertical && ionic.Gestures.utils.isVertical(ev.direction)) || (inst.options.drag_block_horizontal && !ionic.Gestures.utils.isVertical(ev.direction))) {
                  ev.preventDefault();
                }
                break;
              case ionic.Gestures.EVENT_END:
                if (this.triggered) {
                  inst.trigger(this.name + 'end', ev);
                }
                this.triggered = false;
                break;
            }
          }
        };
        ionic.Gestures.gestures.Transform = {
          name: 'transform',
          index: 45,
          defaults: {
            transform_min_scale: 0.01,
            transform_min_rotation: 1,
            transform_always_block: false
          },
          triggered: false,
          handler: function transformGesture(ev, inst) {
            if (ionic.Gestures.detection.current.name != this.name && this.triggered) {
              inst.trigger(this.name + 'end', ev);
              this.triggered = false;
              return;
            }
            if (ev.touches.length < 2) {
              return;
            }
            if (inst.options.transform_always_block) {
              ev.preventDefault();
            }
            switch (ev.eventType) {
              case ionic.Gestures.EVENT_START:
                this.triggered = false;
                break;
              case ionic.Gestures.EVENT_MOVE:
                var scale_threshold = Math.abs(1 - ev.scale);
                var rotation_threshold = Math.abs(ev.rotation);
                if (scale_threshold < inst.options.transform_min_scale && rotation_threshold < inst.options.transform_min_rotation) {
                  return;
                }
                ionic.Gestures.detection.current.name = this.name;
                if (!this.triggered) {
                  inst.trigger(this.name + 'start', ev);
                  this.triggered = true;
                }
                inst.trigger(this.name, ev);
                if (rotation_threshold > inst.options.transform_min_rotation) {
                  inst.trigger('rotate', ev);
                }
                if (scale_threshold > inst.options.transform_min_scale) {
                  inst.trigger('pinch', ev);
                  inst.trigger('pinch' + ((ev.scale < 1) ? 'in' : 'out'), ev);
                }
                break;
              case ionic.Gestures.EVENT_END:
                if (this.triggered) {
                  inst.trigger(this.name + 'end', ev);
                }
                this.triggered = false;
                break;
            }
          }
        };
        ionic.Gestures.gestures.Touch = {
          name: 'touch',
          index: -Infinity,
          defaults: {
            prevent_default: false,
            prevent_mouseevents: false
          },
          handler: function touchGesture(ev, inst) {
            if (inst.options.prevent_mouseevents && ev.pointerType == ionic.Gestures.POINTER_MOUSE) {
              ev.stopDetect();
              return;
            }
            if (inst.options.prevent_default) {
              ev.preventDefault();
            }
            if (ev.eventType == ionic.Gestures.EVENT_START) {
              inst.trigger(this.name, ev);
            }
          }
        };
        ionic.Gestures.gestures.Release = {
          name: 'release',
          index: Infinity,
          handler: function releaseGesture(ev, inst) {
            if (ev.eventType == ionic.Gestures.EVENT_END) {
              inst.trigger(this.name, ev);
            }
          }
        };
      })(window.ionic);
      (function(window, document, ionic) {
        function getParameterByName(name) {
          name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
          var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
              results = regex.exec(location.search);
          return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
        var IOS = 'ios';
        var ANDROID = 'android';
        var WINDOWS_PHONE = 'windowsphone';
        ionic.Platform = {
          navigator: window.navigator,
          isReady: false,
          isFullScreen: false,
          platforms: null,
          grade: null,
          ua: navigator.userAgent,
          ready: function(cb) {
            if (this.isReady) {
              cb();
            } else {
              readyCallbacks.push(cb);
            }
          },
          detect: function() {
            ionic.Platform._checkPlatforms();
            ionic.requestAnimationFrame(function() {
              for (var i = 0; i < ionic.Platform.platforms.length; i++) {
                document.body.classList.add('platform-' + ionic.Platform.platforms[i]);
              }
            });
          },
          setGrade: function(grade) {
            var oldGrade = this.grade;
            this.grade = grade;
            ionic.requestAnimationFrame(function() {
              if (oldGrade) {
                document.body.classList.remove('grade-' + oldGrade);
              }
              document.body.classList.add('grade-' + grade);
            });
          },
          device: function() {
            return window.device || {};
          },
          _checkPlatforms: function(platforms) {
            this.platforms = [];
            var grade = 'a';
            if (this.isWebView()) {
              this.platforms.push('webview');
              this.platforms.push('cordova');
            } else {
              this.platforms.push('browser');
            }
            if (this.isIPad())
              this.platforms.push('ipad');
            var platform = this.platform();
            if (platform) {
              this.platforms.push(platform);
              var version = this.version();
              if (version) {
                var v = version.toString();
                if (v.indexOf('.') > 0) {
                  v = v.replace('.', '_');
                } else {
                  v += '_0';
                }
                this.platforms.push(platform + v.split('_')[0]);
                this.platforms.push(platform + v);
                if (this.isAndroid() && version < 4.4) {
                  grade = (version < 4 ? 'c' : 'b');
                } else if (this.isWindowsPhone()) {
                  grade = 'b';
                }
              }
            }
            this.setGrade(grade);
          },
          isWebView: function() {
            return !(!window.cordova && !window.PhoneGap && !window.phonegap);
          },
          isIPad: function() {
            if (/iPad/i.test(ionic.Platform.navigator.platform)) {
              return true;
            }
            return /iPad/i.test(this.ua);
          },
          isIOS: function() {
            return this.is(IOS);
          },
          isAndroid: function() {
            return this.is(ANDROID);
          },
          isWindowsPhone: function() {
            return this.is(WINDOWS_PHONE);
          },
          platform: function() {
            if (platformName === null)
              this.setPlatform(this.device().platform);
            return platformName;
          },
          setPlatform: function(n) {
            if (typeof n != 'undefined' && n !== null && n.length) {
              platformName = n.toLowerCase();
            } else if (getParameterByName('ionicplatform')) {
              platformName = getParameterByName('ionicplatform');
            } else if (this.ua.indexOf('Android') > 0) {
              platformName = ANDROID;
            } else if (this.ua.indexOf('iPhone') > -1 || this.ua.indexOf('iPad') > -1 || this.ua.indexOf('iPod') > -1) {
              platformName = IOS;
            } else if (this.ua.indexOf('Windows Phone') > -1) {
              platformName = WINDOWS_PHONE;
            } else {
              platformName = ionic.Platform.navigator.platform && navigator.platform.toLowerCase().split(' ')[0] || '';
            }
          },
          version: function() {
            if (platformVersion === null)
              this.setVersion(this.device().version);
            return platformVersion;
          },
          setVersion: function(v) {
            if (typeof v != 'undefined' && v !== null) {
              v = v.split('.');
              v = parseFloat(v[0] + '.' + (v.length > 1 ? v[1] : 0));
              if (!isNaN(v)) {
                platformVersion = v;
                return;
              }
            }
            platformVersion = 0;
            var pName = this.platform();
            var versionMatch = {
              'android': /Android (\d+).(\d+)?/,
              'ios': /OS (\d+)_(\d+)?/,
              'windowsphone': /Windows Phone (\d+).(\d+)?/
            };
            if (versionMatch[pName]) {
              v = this.ua.match(versionMatch[pName]);
              if (v && v.length > 2) {
                platformVersion = parseFloat(v[1] + '.' + v[2]);
              }
            }
          },
          is: function(type) {
            type = type.toLowerCase();
            if (this.platforms) {
              for (var x = 0; x < this.platforms.length; x++) {
                if (this.platforms[x] === type)
                  return true;
              }
            }
            var pName = this.platform();
            if (pName) {
              return pName === type.toLowerCase();
            }
            return this.ua.toLowerCase().indexOf(type) >= 0;
          },
          exitApp: function() {
            this.ready(function() {
              navigator.app && navigator.app.exitApp && navigator.app.exitApp();
            });
          },
          showStatusBar: function(val) {
            this._showStatusBar = val;
            this.ready(function() {
              ionic.requestAnimationFrame(function() {
                if (ionic.Platform._showStatusBar) {
                  window.StatusBar && window.StatusBar.show();
                  document.body.classList.remove('status-bar-hide');
                } else {
                  window.StatusBar && window.StatusBar.hide();
                  document.body.classList.add('status-bar-hide');
                }
              });
            });
          },
          fullScreen: function(showFullScreen, showStatusBar) {
            this.isFullScreen = (showFullScreen !== false);
            ionic.DomUtil.ready(function() {
              ionic.requestAnimationFrame(function() {
                panes = document.getElementsByClassName('pane');
                for (var i = 0; i < panes.length; i++) {
                  panes[i].style.height = panes[i].offsetHeight + "px";
                }
                if (ionic.Platform.isFullScreen) {
                  document.body.classList.add('fullscreen');
                } else {
                  document.body.classList.remove('fullscreen');
                }
              });
              ionic.Platform.showStatusBar((showStatusBar === true));
            });
          }
        };
        var platformName = null,
            platformVersion = null,
            readyCallbacks = [],
            windowLoadListenderAttached;
        function onWindowLoad() {
          if (ionic.Platform.isWebView()) {
            document.addEventListener("deviceready", onPlatformReady, false);
          } else {
            onPlatformReady();
          }
          if (windowLoadListenderAttached) {
            window.removeEventListener("load", onWindowLoad, false);
          }
        }
        if (document.readyState === 'complete') {
          onWindowLoad();
        } else {
          windowLoadListenderAttached = true;
          window.addEventListener("load", onWindowLoad, false);
        }
        window.addEventListener("load", onWindowLoad, false);
        function onPlatformReady() {
          ionic.Platform.isReady = true;
          ionic.Platform.detect();
          for (var x = 0; x < readyCallbacks.length; x++) {
            readyCallbacks[x]();
          }
          readyCallbacks = [];
          ionic.trigger('platformready', {target: document});
          ionic.requestAnimationFrame(function() {
            document.body.classList.add('platform-ready');
          });
        }
      })(this, document, ionic);
      (function(document, ionic) {
        'use strict';
        ionic.CSS = {};
        (function() {
          var i,
              keys = ['webkitTransform', 'transform', '-webkit-transform', 'webkit-transform', '-moz-transform', 'moz-transform', 'MozTransform', 'mozTransform', 'msTransform'];
          for (i = 0; i < keys.length; i++) {
            if (document.documentElement.style[keys[i]] !== undefined) {
              ionic.CSS.TRANSFORM = keys[i];
              break;
            }
          }
          keys = ['webkitTransition', 'mozTransition', 'msTransition', 'transition'];
          for (i = 0; i < keys.length; i++) {
            if (document.documentElement.style[keys[i]] !== undefined) {
              ionic.CSS.TRANSITION = keys[i];
              break;
            }
          }
          var isWebkit = ionic.CSS.TRANSITION.indexOf('webkit') > -1;
          ionic.CSS.TRANSITION_DURATION = (isWebkit ? '-webkit-' : '') + 'transition-duration';
          ionic.CSS.TRANSITIONEND = (isWebkit ? 'webkitTransitionEnd ' : '') + 'transitionend';
        })();
        if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {
          Object.defineProperty(HTMLElement.prototype, 'classList', {get: function() {
              var self = this;
              function update(fn) {
                return function() {
                  var x,
                      classes = self.className.split(/\s+/);
                  for (x = 0; x < arguments.length; x++) {
                    fn(classes, classes.indexOf(arguments[x]), arguments[x]);
                  }
                  self.className = classes.join(" ");
                };
              }
              return {
                add: update(function(classes, index, value) {
                  ~index || classes.push(value);
                }),
                remove: update(function(classes, index) {
                  ~index && classes.splice(index, 1);
                }),
                toggle: update(function(classes, index, value) {
                  ~index ? classes.splice(index, 1) : classes.push(value);
                }),
                contains: function(value) {
                  return !!~self.className.split(/\s+/).indexOf(value);
                },
                item: function(i) {
                  return self.className.split(/\s+/)[i] || null;
                }
              };
            }});
        }
      })(document, ionic);
      var tapDoc;
      var tapActiveEle;
      var tapEnabledTouchEvents;
      var tapMouseResetTimer;
      var tapPointerMoved;
      var tapPointerStart;
      var tapTouchFocusedInput;
      var tapLastTouchTarget;
      var tapTouchMoveListener = 'touchmove';
      var TAP_RELEASE_TOLERANCE = 12;
      var TAP_RELEASE_BUTTON_TOLERANCE = 50;
      var tapEventListeners = {
        'click': tapClickGateKeeper,
        'mousedown': tapMouseDown,
        'mouseup': tapMouseUp,
        'mousemove': tapMouseMove,
        'touchstart': tapTouchStart,
        'touchend': tapTouchEnd,
        'touchcancel': tapTouchCancel,
        'touchmove': tapTouchMove,
        'pointerdown': tapTouchStart,
        'pointerup': tapTouchEnd,
        'pointercancel': tapTouchCancel,
        'pointermove': tapTouchMove,
        'MSPointerDown': tapTouchStart,
        'MSPointerUp': tapTouchEnd,
        'MSPointerCancel': tapTouchCancel,
        'MSPointerMove': tapTouchMove,
        'focusin': tapFocusIn,
        'focusout': tapFocusOut
      };
      ionic.tap = {
        register: function(ele) {
          tapDoc = ele;
          tapEventListener('click', true, true);
          tapEventListener('mouseup');
          tapEventListener('mousedown');
          if (window.navigator.pointerEnabled) {
            tapEventListener('pointerdown');
            tapEventListener('pointerup');
            tapEventListener('pointcancel');
            tapTouchMoveListener = 'pointermove';
          } else if (window.navigator.msPointerEnabled) {
            tapEventListener('MSPointerDown');
            tapEventListener('MSPointerUp');
            tapEventListener('MSPointerCancel');
            tapTouchMoveListener = 'MSPointerMove';
          } else {
            tapEventListener('touchstart');
            tapEventListener('touchend');
            tapEventListener('touchcancel');
          }
          tapEventListener('focusin');
          tapEventListener('focusout');
          return function() {
            for (var type in tapEventListeners) {
              tapEventListener(type, false);
            }
            tapDoc = null;
            tapActiveEle = null;
            tapEnabledTouchEvents = false;
            tapPointerMoved = false;
            tapPointerStart = null;
          };
        },
        ignoreScrollStart: function(e) {
          return (e.defaultPrevented) || (/^(file|range)$/i).test(e.target.type) || (e.target.dataset ? e.target.dataset.preventScroll : e.target.getAttribute('data-prevent-scroll')) == 'true' || (!!(/^(object|embed)$/i).test(e.target.tagName)) || ionic.tap.isElementTapDisabled(e.target);
        },
        isTextInput: function(ele) {
          return !!ele && (ele.tagName == 'TEXTAREA' || ele.contentEditable === 'true' || (ele.tagName == 'INPUT' && !(/^(radio|checkbox|range|file|submit|reset)$/i).test(ele.type)));
        },
        isDateInput: function(ele) {
          return !!ele && (ele.tagName == 'INPUT' && (/^(date|time|datetime-local|month|week)$/i).test(ele.type));
        },
        isLabelWithTextInput: function(ele) {
          var container = tapContainingElement(ele, false);
          return !!container && ionic.tap.isTextInput(tapTargetElement(container));
        },
        containsOrIsTextInput: function(ele) {
          return ionic.tap.isTextInput(ele) || ionic.tap.isLabelWithTextInput(ele);
        },
        cloneFocusedInput: function(container, scrollIntance) {
          if (ionic.tap.hasCheckedClone)
            return;
          ionic.tap.hasCheckedClone = true;
          ionic.requestAnimationFrame(function() {
            var focusInput = container.querySelector(':focus');
            if (ionic.tap.isTextInput(focusInput)) {
              var clonedInput = focusInput.parentElement.querySelector('.cloned-text-input');
              if (!clonedInput) {
                clonedInput = document.createElement(focusInput.tagName);
                clonedInput.placeholder = focusInput.placeholder;
                clonedInput.type = focusInput.type;
                clonedInput.value = focusInput.value;
                clonedInput.style = focusInput.style;
                clonedInput.className = focusInput.className;
                clonedInput.classList.add('cloned-text-input');
                clonedInput.readOnly = true;
                if (focusInput.isContentEditable) {
                  clonedInput.contentEditable = focusInput.contentEditable;
                  clonedInput.innerHTML = focusInput.innerHTML;
                }
                focusInput.parentElement.insertBefore(clonedInput, focusInput);
                focusInput.style.top = focusInput.offsetTop;
                focusInput.classList.add('previous-input-focus');
              }
            }
          });
        },
        hasCheckedClone: false,
        removeClonedInputs: function(container, scrollIntance) {
          ionic.tap.hasCheckedClone = false;
          ionic.requestAnimationFrame(function() {
            var clonedInputs = container.querySelectorAll('.cloned-text-input');
            var previousInputFocus = container.querySelectorAll('.previous-input-focus');
            var x;
            for (x = 0; x < clonedInputs.length; x++) {
              clonedInputs[x].parentElement.removeChild(clonedInputs[x]);
            }
            for (x = 0; x < previousInputFocus.length; x++) {
              previousInputFocus[x].classList.remove('previous-input-focus');
              previousInputFocus[x].style.top = '';
              previousInputFocus[x].focus();
            }
          });
        },
        requiresNativeClick: function(ele) {
          if (!ele || ele.disabled || (/^(file|range)$/i).test(ele.type) || (/^(object|video)$/i).test(ele.tagName) || ionic.tap.isLabelContainingFileInput(ele)) {
            return true;
          }
          return ionic.tap.isElementTapDisabled(ele);
        },
        isLabelContainingFileInput: function(ele) {
          var lbl = tapContainingElement(ele);
          if (lbl.tagName !== 'LABEL')
            return false;
          var fileInput = lbl.querySelector('input[type=file]');
          if (fileInput && fileInput.disabled === false)
            return true;
          return false;
        },
        isElementTapDisabled: function(ele) {
          if (ele && ele.nodeType === 1) {
            var element = ele;
            while (element) {
              if ((element.dataset ? element.dataset.tapDisabled : element.getAttribute('data-tap-disabled')) == 'true') {
                return true;
              }
              element = element.parentElement;
            }
          }
          return false;
        },
        setTolerance: function(releaseTolerance, releaseButtonTolerance) {
          TAP_RELEASE_TOLERANCE = releaseTolerance;
          TAP_RELEASE_BUTTON_TOLERANCE = releaseButtonTolerance;
        },
        cancelClick: function() {
          tapPointerMoved = true;
        },
        pointerCoord: function(event) {
          var c = {
            x: 0,
            y: 0
          };
          if (event) {
            var touches = event.touches && event.touches.length ? event.touches : [event];
            var e = (event.changedTouches && event.changedTouches[0]) || touches[0];
            if (e) {
              c.x = e.clientX || e.pageX || 0;
              c.y = e.clientY || e.pageY || 0;
            }
          }
          return c;
        }
      };
      function tapEventListener(type, enable, useCapture) {
        if (enable !== false) {
          tapDoc.addEventListener(type, tapEventListeners[type], useCapture);
        } else {
          tapDoc.removeEventListener(type, tapEventListeners[type]);
        }
      }
      function tapClick(e) {
        var container = tapContainingElement(e.target);
        var ele = tapTargetElement(container);
        if (ionic.tap.requiresNativeClick(ele) || tapPointerMoved)
          return false;
        var c = ionic.tap.pointerCoord(e);
        triggerMouseEvent('click', ele, c.x, c.y);
        tapHandleFocus(ele);
      }
      function triggerMouseEvent(type, ele, x, y) {
        var clickEvent = document.createEvent("MouseEvents");
        clickEvent.initMouseEvent(type, true, true, window, 1, 0, 0, x, y, false, false, false, false, 0, null);
        clickEvent.isIonicTap = true;
        ele.dispatchEvent(clickEvent);
      }
      function tapClickGateKeeper(e) {
        if (e.target.type == 'submit' && e.detail === 0) {
          return;
        }
        if ((ionic.scroll.isScrolling && ionic.tap.containsOrIsTextInput(e.target)) || (!e.isIonicTap && !ionic.tap.requiresNativeClick(e.target))) {
          e.stopPropagation();
          if (!ionic.tap.isLabelWithTextInput(e.target)) {
            e.preventDefault();
          }
          return false;
        }
      }
      function tapMouseDown(e) {
        if (e.isIonicTap || tapIgnoreEvent(e))
          return;
        if (tapEnabledTouchEvents) {
          void 0;
          e.stopPropagation();
          if ((!ionic.tap.isTextInput(e.target) || tapLastTouchTarget !== e.target) && !(/^(select|option)$/i).test(e.target.tagName)) {
            e.preventDefault();
          }
          return false;
        }
        tapPointerMoved = false;
        tapPointerStart = ionic.tap.pointerCoord(e);
        tapEventListener('mousemove');
        ionic.activator.start(e);
      }
      function tapMouseUp(e) {
        if (tapEnabledTouchEvents) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
        if (tapIgnoreEvent(e) || (/^(select|option)$/i).test(e.target.tagName))
          return false;
        if (!tapHasPointerMoved(e)) {
          tapClick(e);
        }
        tapEventListener('mousemove', false);
        ionic.activator.end();
        tapPointerMoved = false;
      }
      function tapMouseMove(e) {
        if (tapHasPointerMoved(e)) {
          tapEventListener('mousemove', false);
          ionic.activator.end();
          tapPointerMoved = true;
          return false;
        }
      }
      function tapTouchStart(e) {
        if (tapIgnoreEvent(e))
          return;
        tapPointerMoved = false;
        tapEnableTouchEvents();
        tapPointerStart = ionic.tap.pointerCoord(e);
        tapEventListener(tapTouchMoveListener);
        ionic.activator.start(e);
        if (ionic.Platform.isIOS() && ionic.tap.isLabelWithTextInput(e.target)) {
          var textInput = tapTargetElement(tapContainingElement(e.target));
          if (textInput !== tapActiveEle) {
            e.preventDefault();
          }
        }
      }
      function tapTouchEnd(e) {
        if (tapIgnoreEvent(e))
          return;
        tapEnableTouchEvents();
        if (!tapHasPointerMoved(e)) {
          tapClick(e);
          if ((/^(select|option)$/i).test(e.target.tagName)) {
            e.preventDefault();
          }
        }
        tapLastTouchTarget = e.target;
        tapTouchCancel();
      }
      function tapTouchMove(e) {
        if (tapHasPointerMoved(e)) {
          tapPointerMoved = true;
          tapEventListener(tapTouchMoveListener, false);
          ionic.activator.end();
          return false;
        }
      }
      function tapTouchCancel(e) {
        tapEventListener(tapTouchMoveListener, false);
        ionic.activator.end();
        tapPointerMoved = false;
      }
      function tapEnableTouchEvents() {
        tapEnabledTouchEvents = true;
        clearTimeout(tapMouseResetTimer);
        tapMouseResetTimer = setTimeout(function() {
          tapEnabledTouchEvents = false;
        }, 2000);
      }
      function tapIgnoreEvent(e) {
        if (e.isTapHandled)
          return true;
        e.isTapHandled = true;
        if (ionic.scroll.isScrolling && ionic.tap.containsOrIsTextInput(e.target)) {
          e.preventDefault();
          return true;
        }
      }
      function tapHandleFocus(ele) {
        tapTouchFocusedInput = null;
        var triggerFocusIn = false;
        if (ele.tagName == 'SELECT') {
          triggerMouseEvent('mousedown', ele, 0, 0);
          ele.focus && ele.focus();
          triggerFocusIn = true;
        } else if (tapActiveElement() === ele) {
          triggerFocusIn = true;
        } else if ((/^(input|textarea)$/i).test(ele.tagName) || ele.isContentEditable) {
          triggerFocusIn = true;
          ele.focus && ele.focus();
          ele.value = ele.value;
          if (tapEnabledTouchEvents) {
            tapTouchFocusedInput = ele;
          }
        } else {
          tapFocusOutActive();
        }
        if (triggerFocusIn) {
          tapActiveElement(ele);
          ionic.trigger('ionic.focusin', {target: ele}, true);
        }
      }
      function tapFocusOutActive() {
        var ele = tapActiveElement();
        if (ele && ((/^(input|textarea|select)$/i).test(ele.tagName) || ele.isContentEditable)) {
          void 0;
          ele.blur();
        }
        tapActiveElement(null);
      }
      function tapFocusIn(e) {
        if (tapEnabledTouchEvents && ionic.tap.isTextInput(tapActiveElement()) && ionic.tap.isTextInput(tapTouchFocusedInput) && tapTouchFocusedInput !== e.target) {
          void 0;
          tapTouchFocusedInput.focus();
          tapTouchFocusedInput = null;
        }
        ionic.scroll.isScrolling = false;
      }
      function tapFocusOut() {
        tapActiveElement(null);
      }
      function tapActiveElement(ele) {
        if (arguments.length) {
          tapActiveEle = ele;
        }
        return tapActiveEle || document.activeElement;
      }
      function tapHasPointerMoved(endEvent) {
        if (!endEvent || endEvent.target.nodeType !== 1 || !tapPointerStart || (tapPointerStart.x === 0 && tapPointerStart.y === 0)) {
          return false;
        }
        var endCoordinates = ionic.tap.pointerCoord(endEvent);
        var hasClassList = !!(endEvent.target.classList && endEvent.target.classList.contains && typeof endEvent.target.classList.contains === 'function');
        var releaseTolerance = hasClassList && endEvent.target.classList.contains('button') ? TAP_RELEASE_BUTTON_TOLERANCE : TAP_RELEASE_TOLERANCE;
        return Math.abs(tapPointerStart.x - endCoordinates.x) > releaseTolerance || Math.abs(tapPointerStart.y - endCoordinates.y) > releaseTolerance;
      }
      function tapContainingElement(ele, allowSelf) {
        var climbEle = ele;
        for (var x = 0; x < 6; x++) {
          if (!climbEle)
            break;
          if (climbEle.tagName === 'LABEL')
            return climbEle;
          climbEle = climbEle.parentElement;
        }
        if (allowSelf !== false)
          return ele;
      }
      function tapTargetElement(ele) {
        if (ele && ele.tagName === 'LABEL') {
          if (ele.control)
            return ele.control;
          if (ele.querySelector) {
            var control = ele.querySelector('input,textarea,select');
            if (control)
              return control;
          }
        }
        return ele;
      }
      ionic.DomUtil.ready(function() {
        var ng = typeof angular !== 'undefined' ? angular : null;
        if (!ng || (ng && !ng.scenario)) {
          ionic.tap.register(document);
        }
      });
      (function(document, ionic) {
        'use strict';
        var queueElements = {};
        var activeElements = {};
        var keyId = 0;
        var ACTIVATED_CLASS = 'activated';
        ionic.activator = {
          start: function(e) {
            var self = this;
            ionic.requestAnimationFrame(function() {
              if ((ionic.scroll && ionic.scroll.isScrolling) || ionic.tap.requiresNativeClick(e.target))
                return;
              var ele = e.target;
              var eleToActivate;
              for (var x = 0; x < 6; x++) {
                if (!ele || ele.nodeType !== 1)
                  break;
                if (eleToActivate && ele.classList.contains('item')) {
                  eleToActivate = ele;
                  break;
                }
                if (ele.tagName == 'A' || ele.tagName == 'BUTTON' || ele.hasAttribute('ng-click')) {
                  eleToActivate = ele;
                  break;
                }
                if (ele.classList.contains('button')) {
                  eleToActivate = ele;
                  break;
                }
                if (ele.tagName == 'ION-CONTENT' || ele.classList.contains('pane') || ele.tagName == 'BODY') {
                  break;
                }
                ele = ele.parentElement;
              }
              if (eleToActivate) {
                queueElements[keyId] = eleToActivate;
                ionic.requestAnimationFrame(activateElements);
                keyId = (keyId > 29 ? 0 : keyId + 1);
              }
            });
          },
          end: function() {
            setTimeout(clear, 200);
          }
        };
        function clear() {
          queueElements = {};
          ionic.requestAnimationFrame(deactivateElements);
        }
        function activateElements() {
          for (var key in queueElements) {
            if (queueElements[key]) {
              queueElements[key].classList.add(ACTIVATED_CLASS);
              activeElements[key] = queueElements[key];
            }
          }
          queueElements = {};
        }
        function deactivateElements() {
          if (ionic.transition && ionic.transition.isActive) {
            setTimeout(deactivateElements, 400);
            return;
          }
          for (var key in activeElements) {
            if (activeElements[key]) {
              activeElements[key].classList.remove(ACTIVATED_CLASS);
              delete activeElements[key];
            }
          }
        }
      })(document, ionic);
      (function(ionic) {
        var uid = ['0', '0', '0'];
        ionic.Utils = {
          arrayMove: function(arr, old_index, new_index) {
            if (new_index >= arr.length) {
              var k = new_index - arr.length;
              while ((k--) + 1) {
                arr.push(undefined);
              }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr;
          },
          proxy: function(func, context) {
            var args = Array.prototype.slice.call(arguments, 2);
            return function() {
              return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
            };
          },
          debounce: function(func, wait, immediate) {
            var timeout,
                args,
                context,
                timestamp,
                result;
            return function() {
              context = this;
              args = arguments;
              timestamp = new Date();
              var later = function() {
                var last = (new Date()) - timestamp;
                if (last < wait) {
                  timeout = setTimeout(later, wait - last);
                } else {
                  timeout = null;
                  if (!immediate)
                    result = func.apply(context, args);
                }
              };
              var callNow = immediate && !timeout;
              if (!timeout) {
                timeout = setTimeout(later, wait);
              }
              if (callNow)
                result = func.apply(context, args);
              return result;
            };
          },
          throttle: function(func, wait, options) {
            var context,
                args,
                result;
            var timeout = null;
            var previous = 0;
            options || (options = {});
            var later = function() {
              previous = options.leading === false ? 0 : Date.now();
              timeout = null;
              result = func.apply(context, args);
            };
            return function() {
              var now = Date.now();
              if (!previous && options.leading === false)
                previous = now;
              var remaining = wait - (now - previous);
              context = this;
              args = arguments;
              if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
              } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
              }
              return result;
            };
          },
          inherit: function(protoProps, staticProps) {
            var parent = this;
            var child;
            if (protoProps && protoProps.hasOwnProperty('constructor')) {
              child = protoProps.constructor;
            } else {
              child = function() {
                return parent.apply(this, arguments);
              };
            }
            ionic.extend(child, parent, staticProps);
            var Surrogate = function() {
              this.constructor = child;
            };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate();
            if (protoProps)
              ionic.extend(child.prototype, protoProps);
            child.__super__ = parent.prototype;
            return child;
          },
          extend: function(obj) {
            var args = Array.prototype.slice.call(arguments, 1);
            for (var i = 0; i < args.length; i++) {
              var source = args[i];
              if (source) {
                for (var prop in source) {
                  obj[prop] = source[prop];
                }
              }
            }
            return obj;
          },
          nextUid: function() {
            var index = uid.length;
            var digit;
            while (index) {
              index--;
              digit = uid[index].charCodeAt(0);
              if (digit == 57) {
                uid[index] = 'A';
                return uid.join('');
              }
              if (digit == 90) {
                uid[index] = '0';
              } else {
                uid[index] = String.fromCharCode(digit + 1);
                return uid.join('');
              }
            }
            uid.unshift('0');
            return uid.join('');
          },
          disconnectScope: function disconnectScope(scope) {
            if (!scope)
              return;
            if (scope.$root === scope) {
              return;
            }
            var parent = scope.$parent;
            scope.$$disconnected = true;
            scope.$broadcast('$ionic.disconnectScope');
            if (parent.$$childHead === scope) {
              parent.$$childHead = scope.$$nextSibling;
            }
            if (parent.$$childTail === scope) {
              parent.$$childTail = scope.$$prevSibling;
            }
            if (scope.$$prevSibling) {
              scope.$$prevSibling.$$nextSibling = scope.$$nextSibling;
            }
            if (scope.$$nextSibling) {
              scope.$$nextSibling.$$prevSibling = scope.$$prevSibling;
            }
            scope.$$nextSibling = scope.$$prevSibling = null;
          },
          reconnectScope: function reconnectScope(scope) {
            if (!scope)
              return;
            if (scope.$root === scope) {
              return;
            }
            if (!scope.$$disconnected) {
              return;
            }
            var parent = scope.$parent;
            scope.$$disconnected = false;
            scope.$broadcast('$ionic.reconnectScope');
            scope.$$prevSibling = parent.$$childTail;
            if (parent.$$childHead) {
              parent.$$childTail.$$nextSibling = scope;
              parent.$$childTail = scope;
            } else {
              parent.$$childHead = parent.$$childTail = scope;
            }
          },
          isScopeDisconnected: function(scope) {
            var climbScope = scope;
            while (climbScope) {
              if (climbScope.$$disconnected)
                return true;
              climbScope = climbScope.$parent;
            }
            return false;
          }
        };
        ionic.inherit = ionic.Utils.inherit;
        ionic.extend = ionic.Utils.extend;
        ionic.throttle = ionic.Utils.throttle;
        ionic.proxy = ionic.Utils.proxy;
        ionic.debounce = ionic.Utils.debounce;
      })(window.ionic);
      var keyboardViewportHeight = getViewportHeight();
      var keyboardIsOpen;
      var keyboardActiveElement;
      var keyboardFocusOutTimer;
      var keyboardFocusInTimer;
      var keyboardPollHeightTimer;
      var keyboardLastShow = 0;
      var KEYBOARD_OPEN_CSS = 'keyboard-open';
      var SCROLL_CONTAINER_CSS = 'scroll';
      ionic.keyboard = {
        isOpen: false,
        height: null,
        landscape: false,
        hide: function() {
          clearTimeout(keyboardFocusInTimer);
          clearTimeout(keyboardFocusOutTimer);
          clearTimeout(keyboardPollHeightTimer);
          ionic.keyboard.isOpen = false;
          ionic.trigger('resetScrollView', {target: keyboardActiveElement}, true);
          ionic.requestAnimationFrame(function() {
            document.body.classList.remove(KEYBOARD_OPEN_CSS);
          });
          if (window.navigator.msPointerEnabled) {
            document.removeEventListener("MSPointerMove", keyboardPreventDefault);
          } else {
            document.removeEventListener('touchmove', keyboardPreventDefault);
          }
          document.removeEventListener('keydown', keyboardOnKeyDown);
          if (keyboardHasPlugin()) {
            cordova.plugins.Keyboard.close();
          }
        },
        show: function() {
          if (keyboardHasPlugin()) {
            cordova.plugins.Keyboard.show();
          }
        }
      };
      function keyboardInit() {
        if (keyboardHasPlugin()) {
          window.addEventListener('native.keyboardshow', keyboardNativeShow);
          window.addEventListener('native.keyboardhide', keyboardFocusOut);
          window.addEventListener('native.showkeyboard', keyboardNativeShow);
          window.addEventListener('native.hidekeyboard', keyboardFocusOut);
        } else {
          document.body.addEventListener('focusout', keyboardFocusOut);
        }
        document.body.addEventListener('ionic.focusin', keyboardBrowserFocusIn);
        document.body.addEventListener('focusin', keyboardBrowserFocusIn);
        document.body.addEventListener('orientationchange', keyboardOrientationChange);
        if (window.navigator.msPointerEnabled) {
          document.removeEventListener("MSPointerDown", keyboardInit);
        } else {
          document.removeEventListener('touchstart', keyboardInit);
        }
      }
      function keyboardNativeShow(e) {
        clearTimeout(keyboardFocusOutTimer);
        ionic.keyboard.height = e.keyboardHeight;
      }
      function keyboardBrowserFocusIn(e) {
        if (!e.target || e.target.readOnly || !ionic.tap.isTextInput(e.target) || ionic.tap.isDateInput(e.target) || !keyboardIsWithinScroll(e.target))
          return;
        document.addEventListener('keydown', keyboardOnKeyDown, false);
        document.body.scrollTop = 0;
        document.body.querySelector('.scroll-content').scrollTop = 0;
        keyboardActiveElement = e.target;
        keyboardSetShow(e);
      }
      function keyboardSetShow(e) {
        clearTimeout(keyboardFocusInTimer);
        clearTimeout(keyboardFocusOutTimer);
        keyboardFocusInTimer = setTimeout(function() {
          if (keyboardLastShow + 350 > Date.now())
            return;
          void 0;
          keyboardLastShow = Date.now();
          var keyboardHeight;
          var elementBounds = keyboardActiveElement.getBoundingClientRect();
          var count = 0;
          keyboardPollHeightTimer = setInterval(function() {
            keyboardHeight = keyboardGetHeight();
            if (count > 10) {
              clearInterval(keyboardPollHeightTimer);
              keyboardHeight = 275;
            }
            if (keyboardHeight) {
              clearInterval(keyboardPollHeightTimer);
              keyboardShow(e.target, elementBounds.top, elementBounds.bottom, keyboardViewportHeight, keyboardHeight);
            }
            count++;
          }, 100);
        }, 32);
      }
      function keyboardShow(element, elementTop, elementBottom, viewportHeight, keyboardHeight) {
        var details = {
          target: element,
          elementTop: Math.round(elementTop),
          elementBottom: Math.round(elementBottom),
          keyboardHeight: keyboardHeight,
          viewportHeight: viewportHeight
        };
        details.hasPlugin = keyboardHasPlugin();
        details.contentHeight = viewportHeight - keyboardHeight;
        void 0;
        details.isElementUnderKeyboard = (details.elementBottom > details.contentHeight);
        ionic.keyboard.isOpen = true;
        keyboardActiveElement = element;
        ionic.trigger('scrollChildIntoView', details, true);
        ionic.requestAnimationFrame(function() {
          document.body.classList.add(KEYBOARD_OPEN_CSS);
        });
        if (window.navigator.msPointerEnabled) {
          document.addEventListener("MSPointerMove", keyboardPreventDefault, false);
        } else {
          document.addEventListener('touchmove', keyboardPreventDefault, false);
        }
        return details;
      }
      function keyboardFocusOut(e) {
        clearTimeout(keyboardFocusOutTimer);
        keyboardFocusOutTimer = setTimeout(ionic.keyboard.hide, 350);
      }
      function keyboardUpdateViewportHeight() {
        if (getViewportHeight() > keyboardViewportHeight) {
          keyboardViewportHeight = getViewportHeight();
        }
      }
      function keyboardOnKeyDown(e) {
        if (ionic.scroll.isScrolling) {
          keyboardPreventDefault(e);
        }
      }
      function keyboardPreventDefault(e) {
        if (e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }
      function keyboardOrientationChange() {
        var updatedViewportHeight = getViewportHeight();
        if (updatedViewportHeight === keyboardViewportHeight) {
          var count = 0;
          var pollViewportHeight = setInterval(function() {
            if (count > 10) {
              clearInterval(pollViewportHeight);
            }
            updatedViewportHeight = getViewportHeight();
            if (updatedViewportHeight !== keyboardViewportHeight) {
              if (updatedViewportHeight < keyboardViewportHeight) {
                ionic.keyboard.landscape = true;
              } else {
                ionic.keyboard.landscape = false;
              }
              keyboardViewportHeight = updatedViewportHeight;
              clearInterval(pollViewportHeight);
            }
            count++;
          }, 50);
        } else {
          keyboardViewportHeight = updatedViewportHeight;
        }
      }
      function keyboardGetHeight() {
        if (ionic.keyboard.height) {
          return ionic.keyboard.height;
        }
        if (ionic.Platform.isAndroid()) {
          if (ionic.Platform.isFullScreen) {
            return 275;
          }
          if (getViewportHeight() < keyboardViewportHeight) {
            return keyboardViewportHeight - getViewportHeight();
          } else {
            return 0;
          }
        }
        if (ionic.Platform.isIOS()) {
          if (ionic.keyboard.landscape) {
            return 206;
          }
          if (!ionic.Platform.isWebView()) {
            return 216;
          }
          return 260;
        }
        return 275;
      }
      function getViewportHeight() {
        return window.innerHeight || screen.height;
      }
      function keyboardIsWithinScroll(ele) {
        while (ele) {
          if (ele.classList.contains(SCROLL_CONTAINER_CSS)) {
            return true;
          }
          ele = ele.parentElement;
        }
        return false;
      }
      function keyboardHasPlugin() {
        return !!(window.cordova && cordova.plugins && cordova.plugins.Keyboard);
      }
      ionic.Platform.ready(function() {
        keyboardUpdateViewportHeight();
        setTimeout(keyboardUpdateViewportHeight, 999);
        if (window.navigator.msPointerEnabled) {
          document.addEventListener("MSPointerDown", keyboardInit, false);
        } else {
          document.addEventListener('touchstart', keyboardInit, false);
        }
      });
      var viewportTag;
      var viewportProperties = {};
      ionic.viewport = {orientation: function() {
          return (window.innerWidth > window.innerHeight ? 90 : 0);
        }};
      function viewportLoadTag() {
        var x;
        for (x = 0; x < document.head.children.length; x++) {
          if (document.head.children[x].name == 'viewport') {
            viewportTag = document.head.children[x];
            break;
          }
        }
        if (viewportTag) {
          var props = viewportTag.content.toLowerCase().replace(/\s+/g, '').split(',');
          var keyValue;
          for (x = 0; x < props.length; x++) {
            if (props[x]) {
              keyValue = props[x].split('=');
              viewportProperties[keyValue[0]] = (keyValue.length > 1 ? keyValue[1] : '_');
            }
          }
          viewportUpdate();
        }
      }
      function viewportUpdate() {
        var initWidth = viewportProperties.width;
        var initHeight = viewportProperties.height;
        var p = ionic.Platform;
        var version = p.version();
        var DEVICE_WIDTH = 'device-width';
        var DEVICE_HEIGHT = 'device-height';
        var orientation = ionic.viewport.orientation();
        delete viewportProperties.height;
        viewportProperties.width = DEVICE_WIDTH;
        if (p.isIPad()) {
          if (version > 7) {
            delete viewportProperties.width;
          } else {
            if (p.isWebView()) {
              if (orientation == 90) {
                viewportProperties.height = '0';
              } else if (version == 7) {
                viewportProperties.height = DEVICE_HEIGHT;
              }
            } else {
              if (version < 7) {
                viewportProperties.height = '0';
              }
            }
          }
        } else if (p.isIOS()) {
          if (p.isWebView()) {
            if (version > 7) {
              delete viewportProperties.width;
            } else if (version < 7) {
              if (initHeight)
                viewportProperties.height = '0';
            } else if (version == 7) {
              viewportProperties.height = DEVICE_HEIGHT;
            }
          } else {
            if (version < 7) {
              if (initHeight)
                viewportProperties.height = '0';
            }
          }
        }
        if (initWidth !== viewportProperties.width || initHeight !== viewportProperties.height) {
          viewportTagUpdate();
        }
      }
      function viewportTagUpdate() {
        var key,
            props = [];
        for (key in viewportProperties) {
          if (viewportProperties[key]) {
            props.push(key + (viewportProperties[key] == '_' ? '' : '=' + viewportProperties[key]));
          }
        }
        viewportTag.content = props.join(', ');
      }
      ionic.Platform.ready(function() {
        viewportLoadTag();
        window.addEventListener("orientationchange", function() {
          setTimeout(viewportUpdate, 1000);
        }, false);
      });
      (function(ionic) {
        'use strict';
        ionic.views.View = function() {
          this.initialize.apply(this, arguments);
        };
        ionic.views.View.inherit = ionic.inherit;
        ionic.extend(ionic.views.View.prototype, {initialize: function() {}});
      })(window.ionic);
      var zyngaCore = {effect: {}};
      (function(global) {
        var time = Date.now || function() {
          return +new Date();
        };
        var desiredFrames = 60;
        var millisecondsPerSecond = 1000;
        var running = {};
        var counter = 1;
        zyngaCore.effect.Animate = {
          requestAnimationFrame: (function() {
            var requestFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame;
            var isNative = !!requestFrame;
            if (requestFrame && !/requestAnimationFrame\(\)\s*\{\s*\[native code\]\s*\}/i.test(requestFrame.toString())) {
              isNative = false;
            }
            if (isNative) {
              return function(callback, root) {
                requestFrame(callback, root);
              };
            }
            var TARGET_FPS = 60;
            var requests = {};
            var requestCount = 0;
            var rafHandle = 1;
            var intervalHandle = null;
            var lastActive = +new Date();
            return function(callback, root) {
              var callbackHandle = rafHandle++;
              requests[callbackHandle] = callback;
              requestCount++;
              if (intervalHandle === null) {
                intervalHandle = setInterval(function() {
                  var time = +new Date();
                  var currentRequests = requests;
                  requests = {};
                  requestCount = 0;
                  for (var key in currentRequests) {
                    if (currentRequests.hasOwnProperty(key)) {
                      currentRequests[key](time);
                      lastActive = time;
                    }
                  }
                  if (time - lastActive > 2500) {
                    clearInterval(intervalHandle);
                    intervalHandle = null;
                  }
                }, 1000 / TARGET_FPS);
              }
              return callbackHandle;
            };
          })(),
          stop: function(id) {
            var cleared = running[id] != null;
            if (cleared) {
              running[id] = null;
            }
            return cleared;
          },
          isRunning: function(id) {
            return running[id] != null;
          },
          start: function(stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {
            var start = time();
            var lastFrame = start;
            var percent = 0;
            var dropCounter = 0;
            var id = counter++;
            if (!root) {
              root = document.body;
            }
            if (id % 20 === 0) {
              var newRunning = {};
              for (var usedId in running) {
                newRunning[usedId] = true;
              }
              running = newRunning;
            }
            var step = function(virtual) {
              var render = virtual !== true;
              var now = time();
              if (!running[id] || (verifyCallback && !verifyCallback(id))) {
                running[id] = null;
                completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, false);
                return;
              }
              if (render) {
                var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
                for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
                  step(true);
                  dropCounter++;
                }
              }
              if (duration) {
                percent = (now - start) / duration;
                if (percent > 1) {
                  percent = 1;
                }
              }
              var value = easingMethod ? easingMethod(percent) : percent;
              if ((stepCallback(value, now, render) === false || percent === 1) && render) {
                running[id] = null;
                completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, percent === 1 || duration == null);
              } else if (render) {
                lastFrame = now;
                zyngaCore.effect.Animate.requestAnimationFrame(step, root);
              }
            };
            running[id] = true;
            zyngaCore.effect.Animate.requestAnimationFrame(step, root);
            return id;
          }
        };
      })(this);
      var Scroller;
      (function(ionic) {
        var NOOP = function() {};
        var easeOutCubic = function(pos) {
          return (Math.pow((pos - 1), 3) + 1);
        };
        var easeInOutCubic = function(pos) {
          if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 3);
          }
          return 0.5 * (Math.pow((pos - 2), 3) + 2);
        };
        ionic.views.Scroll = ionic.views.View.inherit({
          initialize: function(options) {
            var self = this;
            self.__container = options.el;
            self.__content = options.el.firstElementChild;
            setTimeout(function() {
              if (self.__container && self.__content) {
                self.__container.scrollTop = 0;
                self.__content.scrollTop = 0;
              }
            });
            self.options = {
              scrollingX: false,
              scrollbarX: true,
              scrollingY: true,
              scrollbarY: true,
              startX: 0,
              startY: 0,
              wheelDampen: 6,
              minScrollbarSizeX: 5,
              minScrollbarSizeY: 5,
              scrollbarsFade: true,
              scrollbarFadeDelay: 300,
              scrollbarResizeFadeDelay: 1000,
              animating: true,
              animationDuration: 250,
              bouncing: true,
              locking: true,
              paging: false,
              snapping: false,
              zooming: false,
              minZoom: 0.5,
              maxZoom: 3,
              speedMultiplier: 1,
              deceleration: 0.97,
              preventDefault: false,
              scrollingComplete: NOOP,
              penetrationDeceleration: 0.03,
              penetrationAcceleration: 0.08,
              scrollEventInterval: 10,
              getContentWidth: function() {
                return Math.max(self.__content.scrollWidth, self.__content.offsetWidth);
              },
              getContentHeight: function() {
                return Math.max(self.__content.scrollHeight, self.__content.offsetHeight + (self.__content.offsetTop * 2));
              }
            };
            for (var key in options) {
              self.options[key] = options[key];
            }
            self.hintResize = ionic.debounce(function() {
              self.resize();
            }, 1000, true);
            self.onScroll = function() {
              if (!ionic.scroll.isScrolling) {
                setTimeout(self.setScrollStart, 50);
              } else {
                clearTimeout(self.scrollTimer);
                self.scrollTimer = setTimeout(self.setScrollStop, 80);
              }
            };
            self.setScrollStart = function() {
              ionic.scroll.isScrolling = Math.abs(ionic.scroll.lastTop - self.__scrollTop) > 1;
              clearTimeout(self.scrollTimer);
              self.scrollTimer = setTimeout(self.setScrollStop, 80);
            };
            self.setScrollStop = function() {
              ionic.scroll.isScrolling = false;
              ionic.scroll.lastTop = self.__scrollTop;
            };
            self.triggerScrollEvent = ionic.throttle(function() {
              self.onScroll();
              ionic.trigger('scroll', {
                scrollTop: self.__scrollTop,
                scrollLeft: self.__scrollLeft,
                target: self.__container
              });
            }, self.options.scrollEventInterval);
            self.triggerScrollEndEvent = function() {
              ionic.trigger('scrollend', {
                scrollTop: self.__scrollTop,
                scrollLeft: self.__scrollLeft,
                target: self.__container
              });
            };
            self.__scrollLeft = self.options.startX;
            self.__scrollTop = self.options.startY;
            self.__callback = self.getRenderFn();
            self.__initEventHandlers();
            self.__createScrollbars();
          },
          run: function() {
            this.resize();
            this.__fadeScrollbars('out', this.options.scrollbarResizeFadeDelay);
          },
          __isSingleTouch: false,
          __isTracking: false,
          __didDecelerationComplete: false,
          __isGesturing: false,
          __isDragging: false,
          __isDecelerating: false,
          __isAnimating: false,
          __clientLeft: 0,
          __clientTop: 0,
          __clientWidth: 0,
          __clientHeight: 0,
          __contentWidth: 0,
          __contentHeight: 0,
          __snapWidth: 100,
          __snapHeight: 100,
          __refreshHeight: null,
          __refreshActive: false,
          __refreshActivate: null,
          __refreshDeactivate: null,
          __refreshStart: null,
          __zoomLevel: 1,
          __scrollLeft: 0,
          __scrollTop: 0,
          __maxScrollLeft: 0,
          __maxScrollTop: 0,
          __scheduledLeft: 0,
          __scheduledTop: 0,
          __scheduledZoom: 0,
          __lastTouchLeft: null,
          __lastTouchTop: null,
          __lastTouchMove: null,
          __positions: null,
          __minDecelerationScrollLeft: null,
          __minDecelerationScrollTop: null,
          __maxDecelerationScrollLeft: null,
          __maxDecelerationScrollTop: null,
          __decelerationVelocityX: null,
          __decelerationVelocityY: null,
          __transformProperty: null,
          __perspectiveProperty: null,
          __indicatorX: null,
          __indicatorY: null,
          __scrollbarFadeTimeout: null,
          __didWaitForSize: null,
          __sizerTimeout: null,
          __initEventHandlers: function() {
            var self = this;
            var container = self.__container;
            self.scrollChildIntoView = function(e) {
              var scrollBottomOffsetToTop;
              if (!self.isScrolledIntoView) {
                if ((ionic.Platform.isIOS() || ionic.Platform.isFullScreen)) {
                  scrollBottomOffsetToTop = container.getBoundingClientRect().bottom;
                  var scrollBottomOffsetToBottom = e.detail.viewportHeight - scrollBottomOffsetToTop;
                  var keyboardOffset = Math.max(0, e.detail.keyboardHeight - scrollBottomOffsetToBottom);
                  container.style.height = (container.clientHeight - keyboardOffset) + "px";
                  container.style.overflow = "visible";
                  self.resize();
                }
                self.isScrolledIntoView = true;
              }
              if (e.detail.isElementUnderKeyboard) {
                var delay;
                if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
                  if (ionic.Platform.version() < 4.4) {
                    delay = 500;
                  } else {
                    delay = 350;
                  }
                } else {
                  delay = 80;
                }
                ionic.scroll.isScrolling = true;
                setTimeout(function() {
                  var scrollMidpointOffset = container.clientHeight * 0.5;
                  scrollBottomOffsetToTop = container.getBoundingClientRect().bottom;
                  var elementTopOffsetToScrollBottom = e.detail.elementTop - scrollBottomOffsetToTop;
                  var scrollTop = elementTopOffsetToScrollBottom + scrollMidpointOffset;
                  if (scrollTop > 0) {
                    ionic.tap.cloneFocusedInput(container, self);
                    self.scrollBy(0, scrollTop, true);
                    self.onScroll();
                  }
                }, delay);
              }
              e.stopPropagation();
            };
            self.resetScrollView = function(e) {
              if (self.isScrolledIntoView) {
                self.isScrolledIntoView = false;
                container.style.height = "";
                container.style.overflow = "";
                self.resize();
                ionic.scroll.isScrolling = false;
              }
            };
            container.addEventListener('scrollChildIntoView', self.scrollChildIntoView);
            container.addEventListener('resetScrollView', self.resetScrollView);
            function getEventTouches(e) {
              return e.touches && e.touches.length ? e.touches : [{
                pageX: e.pageX,
                pageY: e.pageY
              }];
            }
            self.touchStart = function(e) {
              self.startCoordinates = ionic.tap.pointerCoord(e);
              if (ionic.tap.ignoreScrollStart(e)) {
                return;
              }
              self.__isDown = true;
              if (ionic.tap.containsOrIsTextInput(e.target) || e.target.tagName === 'SELECT') {
                self.__hasStarted = false;
                return;
              }
              self.__isSelectable = true;
              self.__enableScrollY = true;
              self.__hasStarted = true;
              self.doTouchStart(getEventTouches(e), e.timeStamp);
              e.preventDefault();
            };
            self.touchMove = function(e) {
              if (!self.__isDown || (!self.__isDown && e.defaultPrevented) || (e.target.tagName === 'TEXTAREA' && e.target.parentElement.querySelector(':focus'))) {
                return;
              }
              if (!self.__hasStarted && (ionic.tap.containsOrIsTextInput(e.target) || e.target.tagName === 'SELECT')) {
                self.__hasStarted = true;
                self.doTouchStart(getEventTouches(e), e.timeStamp);
                e.preventDefault();
                return;
              }
              if (self.startCoordinates) {
                var currentCoordinates = ionic.tap.pointerCoord(e);
                if (self.__isSelectable && ionic.tap.isTextInput(e.target) && Math.abs(self.startCoordinates.x - currentCoordinates.x) > 20) {
                  self.__enableScrollY = false;
                  self.__isSelectable = true;
                }
                if (self.__enableScrollY && Math.abs(self.startCoordinates.y - currentCoordinates.y) > 10) {
                  self.__isSelectable = false;
                  ionic.tap.cloneFocusedInput(container, self);
                }
              }
              self.doTouchMove(getEventTouches(e), e.timeStamp, e.scale);
              self.__isDown = true;
            };
            self.touchMoveBubble = function(e) {
              if (self.__isDown && self.options.preventDefault) {
                e.preventDefault();
              }
            };
            self.touchEnd = function(e) {
              if (!self.__isDown)
                return;
              self.doTouchEnd(e.timeStamp);
              self.__isDown = false;
              self.__hasStarted = false;
              self.__isSelectable = true;
              self.__enableScrollY = true;
              if (!self.__isDragging && !self.__isDecelerating && !self.__isAnimating) {
                ionic.tap.removeClonedInputs(container, self);
              }
            };
            if ('ontouchstart' in window) {
              container.addEventListener("touchstart", self.touchStart, false);
              if (self.options.preventDefault)
                container.addEventListener("touchmove", self.touchMoveBubble, false);
              document.addEventListener("touchmove", self.touchMove, false);
              document.addEventListener("touchend", self.touchEnd, false);
              document.addEventListener("touchcancel", self.touchEnd, false);
            } else if (window.navigator.pointerEnabled) {
              container.addEventListener("pointerdown", self.touchStart, false);
              if (self.options.preventDefault)
                container.addEventListener("pointermove", self.touchMoveBubble, false);
              document.addEventListener("pointermove", self.touchMove, false);
              document.addEventListener("pointerup", self.touchEnd, false);
              document.addEventListener("pointercancel", self.touchEnd, false);
            } else if (window.navigator.msPointerEnabled) {
              container.addEventListener("MSPointerDown", self.touchStart, false);
              if (self.options.preventDefault)
                container.addEventListener("MSPointerMove", self.touchMoveBubble, false);
              document.addEventListener("MSPointerMove", self.touchMove, false);
              document.addEventListener("MSPointerUp", self.touchEnd, false);
              document.addEventListener("MSPointerCancel", self.touchEnd, false);
            } else {
              var mousedown = false;
              self.mouseDown = function(e) {
                if (ionic.tap.ignoreScrollStart(e) || e.target.tagName === 'SELECT') {
                  return;
                }
                self.doTouchStart(getEventTouches(e), e.timeStamp);
                if (!ionic.tap.isTextInput(e.target)) {
                  e.preventDefault();
                }
                mousedown = true;
              };
              self.mouseMove = function(e) {
                if (!mousedown || (!mousedown && e.defaultPrevented)) {
                  return;
                }
                self.doTouchMove(getEventTouches(e), e.timeStamp);
                mousedown = true;
              };
              self.mouseMoveBubble = function(e) {
                if (mousedown && self.options.preventDefault) {
                  e.preventDefault();
                }
              };
              self.mouseUp = function(e) {
                if (!mousedown) {
                  return;
                }
                self.doTouchEnd(e.timeStamp);
                mousedown = false;
              };
              self.mouseWheel = ionic.animationFrameThrottle(function(e) {
                var scrollParent = ionic.DomUtil.getParentOrSelfWithClass(e.target, 'ionic-scroll');
                if (scrollParent === self.__container) {
                  self.hintResize();
                  self.scrollBy((e.wheelDeltaX || e.deltaX || 0) / self.options.wheelDampen, (-e.wheelDeltaY || e.deltaY || 0) / self.options.wheelDampen);
                  self.__fadeScrollbars('in');
                  clearTimeout(self.__wheelHideBarTimeout);
                  self.__wheelHideBarTimeout = setTimeout(function() {
                    self.__fadeScrollbars('out');
                  }, 100);
                }
              });
              container.addEventListener("mousedown", self.mouseDown, false);
              if (self.options.preventDefault)
                container.addEventListener("mousemove", self.mouseMoveBubble, false);
              document.addEventListener("mousemove", self.mouseMove, false);
              document.addEventListener("mouseup", self.mouseUp, false);
              document.addEventListener('mousewheel', self.mouseWheel, false);
              document.addEventListener('wheel', self.mouseWheel, false);
            }
          },
          __cleanup: function() {
            var self = this;
            var container = self.__container;
            container.removeEventListener('touchstart', self.touchStart);
            container.removeEventListener('touchmove', self.touchMoveBubble);
            document.removeEventListener('touchmove', self.touchMove);
            document.removeEventListener('touchend', self.touchEnd);
            document.removeEventListener('touchcancel', self.touchCancel);
            container.removeEventListener("pointerdown", self.touchStart);
            container.removeEventListener("pointermove", self.touchMoveBubble);
            document.removeEventListener("pointermove", self.touchMove);
            document.removeEventListener("pointerup", self.touchEnd);
            document.removeEventListener("pointercancel", self.touchEnd);
            container.removeEventListener("MSPointerDown", self.touchStart);
            container.removeEventListener("MSPointerMove", self.touchMoveBubble);
            document.removeEventListener("MSPointerMove", self.touchMove);
            document.removeEventListener("MSPointerUp", self.touchEnd);
            document.removeEventListener("MSPointerCancel", self.touchEnd);
            container.removeEventListener("mousedown", self.mouseDown);
            container.removeEventListener("mousemove", self.mouseMoveBubble);
            document.removeEventListener("mousemove", self.mouseMove);
            document.removeEventListener("mouseup", self.mouseUp);
            document.removeEventListener('mousewheel', self.mouseWheel);
            document.removeEventListener('wheel', self.mouseWheel);
            container.removeEventListener('scrollChildIntoView', self.scrollChildIntoView);
            container.removeEventListener('resetScrollView', self.resetScrollView);
            ionic.tap.removeClonedInputs(container, self);
            delete self.__container;
            delete self.__content;
            delete self.__indicatorX;
            delete self.__indicatorY;
            delete self.options.el;
            self.__callback = self.scrollChildIntoView = self.resetScrollView = angular.noop;
            self.mouseMove = self.mouseDown = self.mouseUp = self.mouseWheel = self.touchStart = self.touchMove = self.touchEnd = self.touchCancel = angular.noop;
            self.resize = self.scrollTo = self.zoomTo = self.__scrollingComplete = angular.noop;
            container = null;
          },
          __createScrollbar: function(direction) {
            var bar = document.createElement('div'),
                indicator = document.createElement('div');
            indicator.className = 'scroll-bar-indicator scroll-bar-fade-out';
            if (direction == 'h') {
              bar.className = 'scroll-bar scroll-bar-h';
            } else {
              bar.className = 'scroll-bar scroll-bar-v';
            }
            bar.appendChild(indicator);
            return bar;
          },
          __createScrollbars: function() {
            var self = this;
            var indicatorX,
                indicatorY;
            if (self.options.scrollingX) {
              indicatorX = {
                el: self.__createScrollbar('h'),
                sizeRatio: 1
              };
              indicatorX.indicator = indicatorX.el.children[0];
              if (self.options.scrollbarX) {
                self.__container.appendChild(indicatorX.el);
              }
              self.__indicatorX = indicatorX;
            }
            if (self.options.scrollingY) {
              indicatorY = {
                el: self.__createScrollbar('v'),
                sizeRatio: 1
              };
              indicatorY.indicator = indicatorY.el.children[0];
              if (self.options.scrollbarY) {
                self.__container.appendChild(indicatorY.el);
              }
              self.__indicatorY = indicatorY;
            }
          },
          __resizeScrollbars: function() {
            var self = this;
            if (self.__indicatorX) {
              var width = Math.max(Math.round(self.__clientWidth * self.__clientWidth / (self.__contentWidth)), 20);
              if (width > self.__contentWidth) {
                width = 0;
              }
              if (width !== self.__indicatorX.size) {
                ionic.requestAnimationFrame(function() {
                  self.__indicatorX.indicator.style.width = width + 'px';
                });
              }
              self.__indicatorX.size = width;
              self.__indicatorX.minScale = self.options.minScrollbarSizeX / width;
              self.__indicatorX.maxPos = self.__clientWidth - width;
              self.__indicatorX.sizeRatio = self.__maxScrollLeft ? self.__indicatorX.maxPos / self.__maxScrollLeft : 1;
            }
            if (self.__indicatorY) {
              var height = Math.max(Math.round(self.__clientHeight * self.__clientHeight / (self.__contentHeight)), 20);
              if (height > self.__contentHeight) {
                height = 0;
              }
              if (height !== self.__indicatorY.size) {
                ionic.requestAnimationFrame(function() {
                  self.__indicatorY && (self.__indicatorY.indicator.style.height = height + 'px');
                });
              }
              self.__indicatorY.size = height;
              self.__indicatorY.minScale = self.options.minScrollbarSizeY / height;
              self.__indicatorY.maxPos = self.__clientHeight - height;
              self.__indicatorY.sizeRatio = self.__maxScrollTop ? self.__indicatorY.maxPos / self.__maxScrollTop : 1;
            }
          },
          __repositionScrollbars: function() {
            var self = this,
                width,
                heightScale,
                widthDiff,
                heightDiff,
                x,
                y,
                xstop = 0,
                ystop = 0;
            if (self.__indicatorX) {
              if (self.__indicatorY)
                xstop = 10;
              x = Math.round(self.__indicatorX.sizeRatio * self.__scrollLeft) || 0, widthDiff = self.__scrollLeft - (self.__maxScrollLeft - xstop);
              if (self.__scrollLeft < 0) {
                widthScale = Math.max(self.__indicatorX.minScale, (self.__indicatorX.size - Math.abs(self.__scrollLeft)) / self.__indicatorX.size);
                x = 0;
                self.__indicatorX.indicator.style[self.__transformOriginProperty] = 'left center';
              } else if (widthDiff > 0) {
                widthScale = Math.max(self.__indicatorX.minScale, (self.__indicatorX.size - widthDiff) / self.__indicatorX.size);
                x = self.__indicatorX.maxPos - xstop;
                self.__indicatorX.indicator.style[self.__transformOriginProperty] = 'right center';
              } else {
                x = Math.min(self.__maxScrollLeft, Math.max(0, x));
                widthScale = 1;
              }
              var translate3dX = 'translate3d(' + x + 'px, 0, 0) scaleX(' + widthScale + ')';
              if (self.__indicatorX.transformProp !== translate3dX) {
                self.__indicatorX.indicator.style[self.__transformProperty] = translate3dX;
                self.__indicatorX.transformProp = translate3dX;
              }
            }
            if (self.__indicatorY) {
              y = Math.round(self.__indicatorY.sizeRatio * self.__scrollTop) || 0;
              if (self.__indicatorX)
                ystop = 10;
              heightDiff = self.__scrollTop - (self.__maxScrollTop - ystop);
              if (self.__scrollTop < 0) {
                heightScale = Math.max(self.__indicatorY.minScale, (self.__indicatorY.size - Math.abs(self.__scrollTop)) / self.__indicatorY.size);
                y = 0;
                if (self.__indicatorY.originProp !== 'center top') {
                  self.__indicatorY.indicator.style[self.__transformOriginProperty] = 'center top';
                  self.__indicatorY.originProp = 'center top';
                }
              } else if (heightDiff > 0) {
                heightScale = Math.max(self.__indicatorY.minScale, (self.__indicatorY.size - heightDiff) / self.__indicatorY.size);
                y = self.__indicatorY.maxPos - ystop;
                if (self.__indicatorY.originProp !== 'center bottom') {
                  self.__indicatorY.indicator.style[self.__transformOriginProperty] = 'center bottom';
                  self.__indicatorY.originProp = 'center bottom';
                }
              } else {
                y = Math.min(self.__maxScrollTop, Math.max(0, y));
                heightScale = 1;
              }
              var translate3dY = 'translate3d(0,' + y + 'px, 0) scaleY(' + heightScale + ')';
              if (self.__indicatorY.transformProp !== translate3dY) {
                self.__indicatorY.indicator.style[self.__transformProperty] = translate3dY;
                self.__indicatorY.transformProp = translate3dY;
              }
            }
          },
          __fadeScrollbars: function(direction, delay) {
            var self = this;
            if (!self.options.scrollbarsFade) {
              return;
            }
            var className = 'scroll-bar-fade-out';
            if (self.options.scrollbarsFade === true) {
              clearTimeout(self.__scrollbarFadeTimeout);
              if (direction == 'in') {
                if (self.__indicatorX) {
                  self.__indicatorX.indicator.classList.remove(className);
                }
                if (self.__indicatorY) {
                  self.__indicatorY.indicator.classList.remove(className);
                }
              } else {
                self.__scrollbarFadeTimeout = setTimeout(function() {
                  if (self.__indicatorX) {
                    self.__indicatorX.indicator.classList.add(className);
                  }
                  if (self.__indicatorY) {
                    self.__indicatorY.indicator.classList.add(className);
                  }
                }, delay || self.options.scrollbarFadeDelay);
              }
            }
          },
          __scrollingComplete: function() {
            this.options.scrollingComplete();
            ionic.tap.removeClonedInputs(this.__container, this);
            this.__fadeScrollbars('out');
          },
          resize: function() {
            var self = this;
            if (!self.__container || !self.options)
              return;
            self.setDimensions(self.__container.clientWidth, self.__container.clientHeight, self.options.getContentWidth(), self.options.getContentHeight());
          },
          getRenderFn: function() {
            var self = this;
            var content = self.__content;
            var docStyle = document.documentElement.style;
            var engine;
            if ('MozAppearance' in docStyle) {
              engine = 'gecko';
            } else if ('WebkitAppearance' in docStyle) {
              engine = 'webkit';
            } else if (typeof navigator.cpuClass === 'string') {
              engine = 'trident';
            }
            var vendorPrefix = {
              trident: 'ms',
              gecko: 'Moz',
              webkit: 'Webkit',
              presto: 'O'
            }[engine];
            var helperElem = document.createElement("div");
            var undef;
            var perspectiveProperty = vendorPrefix + "Perspective";
            var transformProperty = vendorPrefix + "Transform";
            var transformOriginProperty = vendorPrefix + 'TransformOrigin';
            self.__perspectiveProperty = transformProperty;
            self.__transformProperty = transformProperty;
            self.__transformOriginProperty = transformOriginProperty;
            if (helperElem.style[perspectiveProperty] !== undef) {
              return function(left, top, zoom, wasResize) {
                var translate3d = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
                if (translate3d !== self.contentTransform) {
                  content.style[transformProperty] = translate3d;
                  self.contentTransform = translate3d;
                }
                self.__repositionScrollbars();
                if (!wasResize) {
                  self.triggerScrollEvent();
                }
              };
            } else if (helperElem.style[transformProperty] !== undef) {
              return function(left, top, zoom, wasResize) {
                content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
                self.__repositionScrollbars();
                if (!wasResize) {
                  self.triggerScrollEvent();
                }
              };
            } else {
              return function(left, top, zoom, wasResize) {
                content.style.marginLeft = left ? (-left / zoom) + 'px' : '';
                content.style.marginTop = top ? (-top / zoom) + 'px' : '';
                content.style.zoom = zoom || '';
                self.__repositionScrollbars();
                if (!wasResize) {
                  self.triggerScrollEvent();
                }
              };
            }
          },
          setDimensions: function(clientWidth, clientHeight, contentWidth, contentHeight) {
            var self = this;
            if (!clientWidth && !clientHeight && !contentWidth && !contentHeight) {
              return;
            }
            if (clientWidth === +clientWidth) {
              self.__clientWidth = clientWidth;
            }
            if (clientHeight === +clientHeight) {
              self.__clientHeight = clientHeight;
            }
            if (contentWidth === +contentWidth) {
              self.__contentWidth = contentWidth;
            }
            if (contentHeight === +contentHeight) {
              self.__contentHeight = contentHeight;
            }
            self.__computeScrollMax();
            self.__resizeScrollbars();
            self.scrollTo(self.__scrollLeft, self.__scrollTop, true, null, true);
          },
          setPosition: function(left, top) {
            this.__clientLeft = left || 0;
            this.__clientTop = top || 0;
          },
          setSnapSize: function(width, height) {
            this.__snapWidth = width;
            this.__snapHeight = height;
          },
          activatePullToRefresh: function(height, activateCallback, deactivateCallback, startCallback, showCallback, hideCallback, tailCallback) {
            var self = this;
            self.__refreshHeight = height;
            self.__refreshActivate = function() {
              ionic.requestAnimationFrame(activateCallback);
            };
            self.__refreshDeactivate = function() {
              ionic.requestAnimationFrame(deactivateCallback);
            };
            self.__refreshStart = function() {
              ionic.requestAnimationFrame(startCallback);
            };
            self.__refreshShow = function() {
              ionic.requestAnimationFrame(showCallback);
            };
            self.__refreshHide = function() {
              ionic.requestAnimationFrame(hideCallback);
            };
            self.__refreshTail = function() {
              ionic.requestAnimationFrame(tailCallback);
            };
            self.__refreshTailTime = 100;
            self.__minSpinTime = 600;
          },
          triggerPullToRefresh: function() {
            this.__publish(this.__scrollLeft, -this.__refreshHeight, this.__zoomLevel, true);
            var d = new Date();
            this.refreshStartTime = d.getTime();
            if (this.__refreshStart) {
              this.__refreshStart();
            }
          },
          finishPullToRefresh: function() {
            var self = this;
            var d = new Date();
            var delay = 0;
            if (self.refreshStartTime + self.__minSpinTime > d.getTime()) {
              delay = self.refreshStartTime + self.__minSpinTime - d.getTime();
            }
            setTimeout(function() {
              if (self.__refreshTail) {
                self.__refreshTail();
              }
              setTimeout(function() {
                self.__refreshActive = false;
                if (self.__refreshDeactivate) {
                  self.__refreshDeactivate();
                }
                if (self.__refreshHide) {
                  self.__refreshHide();
                }
                self.scrollTo(self.__scrollLeft, self.__scrollTop, true);
              }, self.__refreshTailTime);
            }, delay);
          },
          getValues: function() {
            return {
              left: this.__scrollLeft,
              top: this.__scrollTop,
              zoom: this.__zoomLevel
            };
          },
          getScrollMax: function() {
            return {
              left: this.__maxScrollLeft,
              top: this.__maxScrollTop
            };
          },
          zoomTo: function(level, animate, originLeft, originTop) {
            var self = this;
            if (!self.options.zooming) {
              throw new Error("Zooming is not enabled!");
            }
            if (self.__isDecelerating) {
              zyngaCore.effect.Animate.stop(self.__isDecelerating);
              self.__isDecelerating = false;
            }
            var oldLevel = self.__zoomLevel;
            if (originLeft == null) {
              originLeft = self.__clientWidth / 2;
            }
            if (originTop == null) {
              originTop = self.__clientHeight / 2;
            }
            level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);
            self.__computeScrollMax(level);
            var left = ((originLeft + self.__scrollLeft) * level / oldLevel) - originLeft;
            var top = ((originTop + self.__scrollTop) * level / oldLevel) - originTop;
            if (left > self.__maxScrollLeft) {
              left = self.__maxScrollLeft;
            } else if (left < 0) {
              left = 0;
            }
            if (top > self.__maxScrollTop) {
              top = self.__maxScrollTop;
            } else if (top < 0) {
              top = 0;
            }
            self.__publish(left, top, level, animate);
          },
          zoomBy: function(factor, animate, originLeft, originTop) {
            this.zoomTo(this.__zoomLevel * factor, animate, originLeft, originTop);
          },
          scrollTo: function(left, top, animate, zoom, wasResize) {
            var self = this;
            if (self.__isDecelerating) {
              zyngaCore.effect.Animate.stop(self.__isDecelerating);
              self.__isDecelerating = false;
            }
            if (zoom != null && zoom !== self.__zoomLevel) {
              if (!self.options.zooming) {
                throw new Error("Zooming is not enabled!");
              }
              left *= zoom;
              top *= zoom;
              self.__computeScrollMax(zoom);
            } else {
              zoom = self.__zoomLevel;
            }
            if (!self.options.scrollingX) {
              left = self.__scrollLeft;
            } else {
              if (self.options.paging) {
                left = Math.round(left / self.__clientWidth) * self.__clientWidth;
              } else if (self.options.snapping) {
                left = Math.round(left / self.__snapWidth) * self.__snapWidth;
              }
            }
            if (!self.options.scrollingY) {
              top = self.__scrollTop;
            } else {
              if (self.options.paging) {
                top = Math.round(top / self.__clientHeight) * self.__clientHeight;
              } else if (self.options.snapping) {
                top = Math.round(top / self.__snapHeight) * self.__snapHeight;
              }
            }
            left = Math.max(Math.min(self.__maxScrollLeft, left), 0);
            top = Math.max(Math.min(self.__maxScrollTop, top), 0);
            if (left === self.__scrollLeft && top === self.__scrollTop) {
              animate = false;
            }
            self.__publish(left, top, zoom, animate, wasResize);
          },
          scrollBy: function(left, top, animate) {
            var self = this;
            var startLeft = self.__isAnimating ? self.__scheduledLeft : self.__scrollLeft;
            var startTop = self.__isAnimating ? self.__scheduledTop : self.__scrollTop;
            self.scrollTo(startLeft + (left || 0), startTop + (top || 0), animate);
          },
          doMouseZoom: function(wheelDelta, timeStamp, pageX, pageY) {
            var change = wheelDelta > 0 ? 0.97 : 1.03;
            return this.zoomTo(this.__zoomLevel * change, false, pageX - this.__clientLeft, pageY - this.__clientTop);
          },
          doTouchStart: function(touches, timeStamp) {
            var self = this;
            self.hintResize();
            if (timeStamp instanceof Date) {
              timeStamp = timeStamp.valueOf();
            }
            if (typeof timeStamp !== "number") {
              timeStamp = Date.now();
            }
            self.__interruptedAnimation = true;
            if (self.__isDecelerating) {
              zyngaCore.effect.Animate.stop(self.__isDecelerating);
              self.__isDecelerating = false;
              self.__interruptedAnimation = true;
            }
            if (self.__isAnimating) {
              zyngaCore.effect.Animate.stop(self.__isAnimating);
              self.__isAnimating = false;
              self.__interruptedAnimation = true;
            }
            var currentTouchLeft,
                currentTouchTop;
            var isSingleTouch = touches.length === 1;
            if (isSingleTouch) {
              currentTouchLeft = touches[0].pageX;
              currentTouchTop = touches[0].pageY;
            } else {
              currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
              currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
            }
            self.__initialTouchLeft = currentTouchLeft;
            self.__initialTouchTop = currentTouchTop;
            self.__initialTouches = touches;
            self.__zoomLevelStart = self.__zoomLevel;
            self.__lastTouchLeft = currentTouchLeft;
            self.__lastTouchTop = currentTouchTop;
            self.__lastTouchMove = timeStamp;
            self.__lastScale = 1;
            self.__enableScrollX = !isSingleTouch && self.options.scrollingX;
            self.__enableScrollY = !isSingleTouch && self.options.scrollingY;
            self.__isTracking = true;
            self.__didDecelerationComplete = false;
            self.__isDragging = !isSingleTouch;
            self.__isSingleTouch = isSingleTouch;
            self.__positions = [];
          },
          doTouchMove: function(touches, timeStamp, scale) {
            if (timeStamp instanceof Date) {
              timeStamp = timeStamp.valueOf();
            }
            if (typeof timeStamp !== "number") {
              timeStamp = Date.now();
            }
            var self = this;
            if (!self.__isTracking) {
              return;
            }
            var currentTouchLeft,
                currentTouchTop;
            if (touches.length === 2) {
              currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
              currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
              if (!scale && self.options.zooming) {
                scale = self.__getScale(self.__initialTouches, touches);
              }
            } else {
              currentTouchLeft = touches[0].pageX;
              currentTouchTop = touches[0].pageY;
            }
            var positions = self.__positions;
            if (self.__isDragging) {
              var moveX = currentTouchLeft - self.__lastTouchLeft;
              var moveY = currentTouchTop - self.__lastTouchTop;
              var scrollLeft = self.__scrollLeft;
              var scrollTop = self.__scrollTop;
              var level = self.__zoomLevel;
              if (scale != null && self.options.zooming) {
                var oldLevel = level;
                level = level / self.__lastScale * scale;
                level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);
                if (oldLevel !== level) {
                  var currentTouchLeftRel = currentTouchLeft - self.__clientLeft;
                  var currentTouchTopRel = currentTouchTop - self.__clientTop;
                  scrollLeft = ((currentTouchLeftRel + scrollLeft) * level / oldLevel) - currentTouchLeftRel;
                  scrollTop = ((currentTouchTopRel + scrollTop) * level / oldLevel) - currentTouchTopRel;
                  self.__computeScrollMax(level);
                }
              }
              if (self.__enableScrollX) {
                scrollLeft -= moveX * self.options.speedMultiplier;
                var maxScrollLeft = self.__maxScrollLeft;
                if (scrollLeft > maxScrollLeft || scrollLeft < 0) {
                  if (self.options.bouncing) {
                    scrollLeft += (moveX / 2 * self.options.speedMultiplier);
                  } else if (scrollLeft > maxScrollLeft) {
                    scrollLeft = maxScrollLeft;
                  } else {
                    scrollLeft = 0;
                  }
                }
              }
              if (self.__enableScrollY) {
                scrollTop -= moveY * self.options.speedMultiplier;
                var maxScrollTop = self.__maxScrollTop;
                if (scrollTop > maxScrollTop || scrollTop < 0) {
                  if (self.options.bouncing || (self.__refreshHeight && scrollTop < 0)) {
                    scrollTop += (moveY / 2 * self.options.speedMultiplier);
                    if (!self.__enableScrollX && self.__refreshHeight != null) {
                      if (scrollTop < 0) {
                        self.__refreshHidden = false;
                        self.__refreshShow();
                      } else {
                        self.__refreshHide();
                        self.__refreshHidden = true;
                      }
                      if (!self.__refreshActive && scrollTop <= -self.__refreshHeight) {
                        self.__refreshActive = true;
                        if (self.__refreshActivate) {
                          self.__refreshActivate();
                        }
                      } else if (self.__refreshActive && scrollTop > -self.__refreshHeight) {
                        self.__refreshActive = false;
                        if (self.__refreshDeactivate) {
                          self.__refreshDeactivate();
                        }
                      }
                    }
                  } else if (scrollTop > maxScrollTop) {
                    scrollTop = maxScrollTop;
                  } else {
                    scrollTop = 0;
                  }
                } else if (self.__refreshHeight && !self.__refreshHidden) {
                  self.__refreshHide();
                  self.__refreshHidden = true;
                }
              }
              if (positions.length > 60) {
                positions.splice(0, 30);
              }
              positions.push(scrollLeft, scrollTop, timeStamp);
              self.__publish(scrollLeft, scrollTop, level);
            } else {
              var minimumTrackingForScroll = self.options.locking ? 3 : 0;
              var minimumTrackingForDrag = 5;
              var distanceX = Math.abs(currentTouchLeft - self.__initialTouchLeft);
              var distanceY = Math.abs(currentTouchTop - self.__initialTouchTop);
              self.__enableScrollX = self.options.scrollingX && distanceX >= minimumTrackingForScroll;
              self.__enableScrollY = self.options.scrollingY && distanceY >= minimumTrackingForScroll;
              positions.push(self.__scrollLeft, self.__scrollTop, timeStamp);
              self.__isDragging = (self.__enableScrollX || self.__enableScrollY) && (distanceX >= minimumTrackingForDrag || distanceY >= minimumTrackingForDrag);
              if (self.__isDragging) {
                self.__interruptedAnimation = false;
                self.__fadeScrollbars('in');
              }
            }
            self.__lastTouchLeft = currentTouchLeft;
            self.__lastTouchTop = currentTouchTop;
            self.__lastTouchMove = timeStamp;
            self.__lastScale = scale;
          },
          doTouchEnd: function(timeStamp) {
            if (timeStamp instanceof Date) {
              timeStamp = timeStamp.valueOf();
            }
            if (typeof timeStamp !== "number") {
              timeStamp = Date.now();
            }
            var self = this;
            if (!self.__isTracking) {
              return;
            }
            self.__isTracking = false;
            if (self.__isDragging) {
              self.__isDragging = false;
              if (self.__isSingleTouch && self.options.animating && (timeStamp - self.__lastTouchMove) <= 100) {
                var positions = self.__positions;
                var endPos = positions.length - 1;
                var startPos = endPos;
                for (var i = endPos; i > 0 && positions[i] > (self.__lastTouchMove - 100); i -= 3) {
                  startPos = i;
                }
                if (startPos !== endPos) {
                  var timeOffset = positions[endPos] - positions[startPos];
                  var movedLeft = self.__scrollLeft - positions[startPos - 2];
                  var movedTop = self.__scrollTop - positions[startPos - 1];
                  self.__decelerationVelocityX = movedLeft / timeOffset * (1000 / 60);
                  self.__decelerationVelocityY = movedTop / timeOffset * (1000 / 60);
                  var minVelocityToStartDeceleration = self.options.paging || self.options.snapping ? 4 : 1;
                  if (Math.abs(self.__decelerationVelocityX) > minVelocityToStartDeceleration || Math.abs(self.__decelerationVelocityY) > minVelocityToStartDeceleration) {
                    if (!self.__refreshActive) {
                      self.__startDeceleration(timeStamp);
                    }
                  }
                } else {
                  self.__scrollingComplete();
                }
              } else if ((timeStamp - self.__lastTouchMove) > 100) {
                self.__scrollingComplete();
              }
            }
            if (!self.__isDecelerating) {
              if (self.__refreshActive && self.__refreshStart) {
                self.__publish(self.__scrollLeft, -self.__refreshHeight, self.__zoomLevel, true);
                var d = new Date();
                self.refreshStartTime = d.getTime();
                if (self.__refreshStart) {
                  self.__refreshStart();
                }
                if (!ionic.Platform.isAndroid())
                  self.__startDeceleration();
              } else {
                if (self.__interruptedAnimation || self.__isDragging) {
                  self.__scrollingComplete();
                }
                self.scrollTo(self.__scrollLeft, self.__scrollTop, true, self.__zoomLevel);
                if (self.__refreshActive) {
                  self.__refreshActive = false;
                  if (self.__refreshDeactivate) {
                    self.__refreshDeactivate();
                  }
                }
              }
            }
            self.__positions.length = 0;
          },
          __publish: function(left, top, zoom, animate, wasResize) {
            var self = this;
            var wasAnimating = self.__isAnimating;
            if (wasAnimating) {
              zyngaCore.effect.Animate.stop(wasAnimating);
              self.__isAnimating = false;
            }
            if (animate && self.options.animating) {
              self.__scheduledLeft = left;
              self.__scheduledTop = top;
              self.__scheduledZoom = zoom;
              var oldLeft = self.__scrollLeft;
              var oldTop = self.__scrollTop;
              var oldZoom = self.__zoomLevel;
              var diffLeft = left - oldLeft;
              var diffTop = top - oldTop;
              var diffZoom = zoom - oldZoom;
              var step = function(percent, now, render) {
                if (render) {
                  self.__scrollLeft = oldLeft + (diffLeft * percent);
                  self.__scrollTop = oldTop + (diffTop * percent);
                  self.__zoomLevel = oldZoom + (diffZoom * percent);
                  if (self.__callback) {
                    self.__callback(self.__scrollLeft, self.__scrollTop, self.__zoomLevel, wasResize);
                  }
                }
              };
              var verify = function(id) {
                return self.__isAnimating === id;
              };
              var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
                if (animationId === self.__isAnimating) {
                  self.__isAnimating = false;
                }
                if (self.__didDecelerationComplete || wasFinished) {
                  self.__scrollingComplete();
                }
                if (self.options.zooming) {
                  self.__computeScrollMax();
                }
              };
              self.__isAnimating = zyngaCore.effect.Animate.start(step, verify, completed, self.options.animationDuration, wasAnimating ? easeOutCubic : easeInOutCubic);
            } else {
              self.__scheduledLeft = self.__scrollLeft = left;
              self.__scheduledTop = self.__scrollTop = top;
              self.__scheduledZoom = self.__zoomLevel = zoom;
              if (self.__callback) {
                self.__callback(left, top, zoom, wasResize);
              }
              if (self.options.zooming) {
                self.__computeScrollMax();
              }
            }
          },
          __computeScrollMax: function(zoomLevel) {
            var self = this;
            if (zoomLevel == null) {
              zoomLevel = self.__zoomLevel;
            }
            self.__maxScrollLeft = Math.max((self.__contentWidth * zoomLevel) - self.__clientWidth, 0);
            self.__maxScrollTop = Math.max((self.__contentHeight * zoomLevel) - self.__clientHeight, 0);
            if (!self.__didWaitForSize && !self.__maxScrollLeft && !self.__maxScrollTop) {
              self.__didWaitForSize = true;
              self.__waitForSize();
            }
          },
          __waitForSize: function() {
            var self = this;
            clearTimeout(self.__sizerTimeout);
            var sizer = function() {
              self.resize();
            };
            sizer();
            self.__sizerTimeout = setTimeout(sizer, 1000);
          },
          __startDeceleration: function(timeStamp) {
            var self = this;
            if (self.options.paging) {
              var scrollLeft = Math.max(Math.min(self.__scrollLeft, self.__maxScrollLeft), 0);
              var scrollTop = Math.max(Math.min(self.__scrollTop, self.__maxScrollTop), 0);
              var clientWidth = self.__clientWidth;
              var clientHeight = self.__clientHeight;
              self.__minDecelerationScrollLeft = Math.floor(scrollLeft / clientWidth) * clientWidth;
              self.__minDecelerationScrollTop = Math.floor(scrollTop / clientHeight) * clientHeight;
              self.__maxDecelerationScrollLeft = Math.ceil(scrollLeft / clientWidth) * clientWidth;
              self.__maxDecelerationScrollTop = Math.ceil(scrollTop / clientHeight) * clientHeight;
            } else {
              self.__minDecelerationScrollLeft = 0;
              self.__minDecelerationScrollTop = 0;
              self.__maxDecelerationScrollLeft = self.__maxScrollLeft;
              self.__maxDecelerationScrollTop = self.__maxScrollTop;
              if (self.__refreshActive)
                self.__minDecelerationScrollTop = self.__refreshHeight * -1;
            }
            var step = function(percent, now, render) {
              self.__stepThroughDeceleration(render);
            };
            self.__minVelocityToKeepDecelerating = self.options.snapping ? 4 : 0.1;
            var verify = function() {
              var shouldContinue = Math.abs(self.__decelerationVelocityX) >= self.__minVelocityToKeepDecelerating || Math.abs(self.__decelerationVelocityY) >= self.__minVelocityToKeepDecelerating;
              if (!shouldContinue) {
                self.__didDecelerationComplete = true;
                if (self.options.bouncing && !self.__refreshActive) {
                  self.scrollTo(Math.min(Math.max(self.__scrollLeft, 0), self.__maxScrollLeft), Math.min(Math.max(self.__scrollTop, 0), self.__maxScrollTop), self.__refreshActive);
                }
              }
              return shouldContinue;
            };
            var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
              self.__isDecelerating = false;
              if (self.__didDecelerationComplete) {
                self.__scrollingComplete();
              }
              if (self.options.paging) {
                self.scrollTo(self.__scrollLeft, self.__scrollTop, self.options.snapping);
              }
            };
            self.__isDecelerating = zyngaCore.effect.Animate.start(step, verify, completed);
          },
          __stepThroughDeceleration: function(render) {
            var self = this;
            var scrollLeft = self.__scrollLeft + self.__decelerationVelocityX;
            var scrollTop = self.__scrollTop + self.__decelerationVelocityY;
            if (!self.options.bouncing) {
              var scrollLeftFixed = Math.max(Math.min(self.__maxDecelerationScrollLeft, scrollLeft), self.__minDecelerationScrollLeft);
              if (scrollLeftFixed !== scrollLeft) {
                scrollLeft = scrollLeftFixed;
                self.__decelerationVelocityX = 0;
              }
              var scrollTopFixed = Math.max(Math.min(self.__maxDecelerationScrollTop, scrollTop), self.__minDecelerationScrollTop);
              if (scrollTopFixed !== scrollTop) {
                scrollTop = scrollTopFixed;
                self.__decelerationVelocityY = 0;
              }
            }
            if (render) {
              self.__publish(scrollLeft, scrollTop, self.__zoomLevel);
            } else {
              self.__scrollLeft = scrollLeft;
              self.__scrollTop = scrollTop;
            }
            if (!self.options.paging) {
              var frictionFactor = self.options.deceleration;
              self.__decelerationVelocityX *= frictionFactor;
              self.__decelerationVelocityY *= frictionFactor;
            }
            if (self.options.bouncing) {
              var scrollOutsideX = 0;
              var scrollOutsideY = 0;
              var penetrationDeceleration = self.options.penetrationDeceleration;
              var penetrationAcceleration = self.options.penetrationAcceleration;
              if (scrollLeft < self.__minDecelerationScrollLeft) {
                scrollOutsideX = self.__minDecelerationScrollLeft - scrollLeft;
              } else if (scrollLeft > self.__maxDecelerationScrollLeft) {
                scrollOutsideX = self.__maxDecelerationScrollLeft - scrollLeft;
              }
              if (scrollTop < self.__minDecelerationScrollTop) {
                scrollOutsideY = self.__minDecelerationScrollTop - scrollTop;
              } else if (scrollTop > self.__maxDecelerationScrollTop) {
                scrollOutsideY = self.__maxDecelerationScrollTop - scrollTop;
              }
              if (scrollOutsideX !== 0) {
                var isHeadingOutwardsX = scrollOutsideX * self.__decelerationVelocityX <= self.__minDecelerationScrollLeft;
                if (isHeadingOutwardsX) {
                  self.__decelerationVelocityX += scrollOutsideX * penetrationDeceleration;
                }
                var isStoppedX = Math.abs(self.__decelerationVelocityX) <= self.__minVelocityToKeepDecelerating;
                if (!isHeadingOutwardsX || isStoppedX) {
                  self.__decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
                }
              }
              if (scrollOutsideY !== 0) {
                var isHeadingOutwardsY = scrollOutsideY * self.__decelerationVelocityY <= self.__minDecelerationScrollTop;
                if (isHeadingOutwardsY) {
                  self.__decelerationVelocityY += scrollOutsideY * penetrationDeceleration;
                }
                var isStoppedY = Math.abs(self.__decelerationVelocityY) <= self.__minVelocityToKeepDecelerating;
                if (!isHeadingOutwardsY || isStoppedY) {
                  self.__decelerationVelocityY = scrollOutsideY * penetrationAcceleration;
                }
              }
            }
          },
          __getDistance: function getDistance(touch1, touch2) {
            var x = touch2.pageX - touch1.pageX,
                y = touch2.pageY - touch1.pageY;
            return Math.sqrt((x * x) + (y * y));
          },
          __getScale: function getScale(start, end) {
            if (start.length >= 2 && end.length >= 2) {
              return this.__getDistance(end[0], end[1]) / this.__getDistance(start[0], start[1]);
            }
            return 1;
          }
        });
        ionic.scroll = {
          isScrolling: false,
          lastTop: 0
        };
      })(ionic);
      (function(ionic) {
        'use strict';
        var ITEM_CLASS = 'item';
        var ITEM_CONTENT_CLASS = 'item-content';
        var ITEM_SLIDING_CLASS = 'item-sliding';
        var ITEM_OPTIONS_CLASS = 'item-options';
        var ITEM_PLACEHOLDER_CLASS = 'item-placeholder';
        var ITEM_REORDERING_CLASS = 'item-reordering';
        var ITEM_REORDER_BTN_CLASS = 'item-reorder';
        var DragOp = function() {};
        DragOp.prototype = {
          start: function(e) {},
          drag: function(e) {},
          end: function(e) {},
          isSameItem: function(item) {
            return false;
          }
        };
        var SlideDrag = function(opts) {
          this.dragThresholdX = opts.dragThresholdX || 10;
          this.el = opts.el;
          this.canSwipe = opts.canSwipe;
        };
        SlideDrag.prototype = new DragOp();
        SlideDrag.prototype.start = function(e) {
          var content,
              buttons,
              offsetX,
              buttonsWidth;
          if (!this.canSwipe()) {
            return;
          }
          if (e.target.classList.contains(ITEM_CONTENT_CLASS)) {
            content = e.target;
          } else if (e.target.classList.contains(ITEM_CLASS)) {
            content = e.target.querySelector('.' + ITEM_CONTENT_CLASS);
          } else {
            content = ionic.DomUtil.getParentWithClass(e.target, ITEM_CONTENT_CLASS);
          }
          if (!content) {
            return;
          }
          content.classList.remove(ITEM_SLIDING_CLASS);
          offsetX = parseFloat(content.style[ionic.CSS.TRANSFORM].replace('translate3d(', '').split(',')[0]) || 0;
          buttons = content.parentNode.querySelector('.' + ITEM_OPTIONS_CLASS);
          if (!buttons) {
            return;
          }
          buttons.classList.remove('invisible');
          buttonsWidth = buttons.offsetWidth;
          this._currentDrag = {
            buttons: buttons,
            buttonsWidth: buttonsWidth,
            content: content,
            startOffsetX: offsetX
          };
        };
        SlideDrag.prototype.isSameItem = function(op) {
          if (op._lastDrag && this._currentDrag) {
            return this._currentDrag.content == op._lastDrag.content;
          }
          return false;
        };
        SlideDrag.prototype.clean = function(e) {
          var lastDrag = this._lastDrag;
          if (!lastDrag || !lastDrag.content)
            return;
          lastDrag.content.style[ionic.CSS.TRANSITION] = '';
          lastDrag.content.style[ionic.CSS.TRANSFORM] = '';
          ionic.requestAnimationFrame(function() {
            setTimeout(function() {
              lastDrag.buttons && lastDrag.buttons.classList.add('invisible');
            }, 250);
          });
        };
        SlideDrag.prototype.drag = ionic.animationFrameThrottle(function(e) {
          var buttonsWidth;
          if (!this._currentDrag) {
            return;
          }
          if (!this._isDragging && ((Math.abs(e.gesture.deltaX) > this.dragThresholdX) || (Math.abs(this._currentDrag.startOffsetX) > 0))) {
            this._isDragging = true;
          }
          if (this._isDragging) {
            buttonsWidth = this._currentDrag.buttonsWidth;
            var newX = Math.min(0, this._currentDrag.startOffsetX + e.gesture.deltaX);
            if (newX < -buttonsWidth) {
              newX = Math.min(-buttonsWidth, -buttonsWidth + (((e.gesture.deltaX + buttonsWidth) * 0.4)));
            }
            this._currentDrag.content.style[ionic.CSS.TRANSFORM] = 'translate3d(' + newX + 'px, 0, 0)';
            this._currentDrag.content.style[ionic.CSS.TRANSITION] = 'none';
          }
        });
        SlideDrag.prototype.end = function(e, doneCallback) {
          var _this = this;
          if (!this._currentDrag) {
            doneCallback && doneCallback();
            return;
          }
          var restingPoint = -this._currentDrag.buttonsWidth;
          if (e.gesture.deltaX > -(this._currentDrag.buttonsWidth / 2)) {
            if (e.gesture.direction == "left" && Math.abs(e.gesture.velocityX) < 0.3) {
              restingPoint = 0;
            } else if (e.gesture.direction == "right") {
              restingPoint = 0;
            }
          }
          ionic.requestAnimationFrame(function() {
            if (restingPoint === 0) {
              _this._currentDrag.content.style[ionic.CSS.TRANSFORM] = '';
              var buttons = _this._currentDrag.buttons;
              setTimeout(function() {
                buttons && buttons.classList.add('invisible');
              }, 250);
            } else {
              _this._currentDrag.content.style[ionic.CSS.TRANSFORM] = 'translate3d(' + restingPoint + 'px, 0, 0)';
            }
            _this._currentDrag.content.style[ionic.CSS.TRANSITION] = '';
            if (!_this._lastDrag) {
              _this._lastDrag = {};
            }
            angular.extend(_this._lastDrag, _this._currentDrag);
            if (_this._currentDrag) {
              _this._currentDrag.buttons = null;
              _this._currentDrag.content = null;
            }
            _this._currentDrag = null;
            doneCallback && doneCallback();
          });
        };
        var ReorderDrag = function(opts) {
          this.dragThresholdY = opts.dragThresholdY || 0;
          this.onReorder = opts.onReorder;
          this.listEl = opts.listEl;
          this.el = opts.el;
          this.scrollEl = opts.scrollEl;
          this.scrollView = opts.scrollView;
          this.listElTrueTop = 0;
          if (this.listEl.offsetParent) {
            var obj = this.listEl;
            do {
              this.listElTrueTop += obj.offsetTop;
              obj = obj.offsetParent;
            } while (obj);
          }
        };
        ReorderDrag.prototype = new DragOp();
        ReorderDrag.prototype._moveElement = function(e) {
          var y = e.gesture.center.pageY + this.scrollView.getValues().top - (this._currentDrag.elementHeight / 2) - this.listElTrueTop;
          this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + y + 'px, 0)';
        };
        ReorderDrag.prototype.deregister = function() {
          this.listEl = null;
          this.el = null;
          this.scrollEl = null;
          this.scrollView = null;
        };
        ReorderDrag.prototype.start = function(e) {
          var content;
          var startIndex = ionic.DomUtil.getChildIndex(this.el, this.el.nodeName.toLowerCase());
          var elementHeight = this.el.scrollHeight;
          var placeholder = this.el.cloneNode(true);
          placeholder.classList.add(ITEM_PLACEHOLDER_CLASS);
          this.el.parentNode.insertBefore(placeholder, this.el);
          this.el.classList.add(ITEM_REORDERING_CLASS);
          this._currentDrag = {
            elementHeight: elementHeight,
            startIndex: startIndex,
            placeholder: placeholder,
            scrollHeight: scroll,
            list: placeholder.parentNode
          };
          this._moveElement(e);
        };
        ReorderDrag.prototype.drag = ionic.animationFrameThrottle(function(e) {
          var self = this;
          if (!this._currentDrag) {
            return;
          }
          var scrollY = 0;
          var pageY = e.gesture.center.pageY;
          var offset = this.listElTrueTop;
          if (this.scrollView) {
            var container = this.scrollView.__container;
            scrollY = this.scrollView.getValues().top;
            var containerTop = container.offsetTop;
            var pixelsPastTop = containerTop - pageY + this._currentDrag.elementHeight / 2;
            var pixelsPastBottom = pageY + this._currentDrag.elementHeight / 2 - containerTop - container.offsetHeight;
            if (e.gesture.deltaY < 0 && pixelsPastTop > 0 && scrollY > 0) {
              this.scrollView.scrollBy(null, -pixelsPastTop);
              ionic.requestAnimationFrame(function() {
                self.drag(e);
              });
            }
            if (e.gesture.deltaY > 0 && pixelsPastBottom > 0) {
              if (scrollY < this.scrollView.getScrollMax().top) {
                this.scrollView.scrollBy(null, pixelsPastBottom);
                ionic.requestAnimationFrame(function() {
                  self.drag(e);
                });
              }
            }
          }
          if (!this._isDragging && Math.abs(e.gesture.deltaY) > this.dragThresholdY) {
            this._isDragging = true;
          }
          if (this._isDragging) {
            this._moveElement(e);
            this._currentDrag.currentY = scrollY + pageY - offset;
          }
        });
        ReorderDrag.prototype._getReorderIndex = function() {
          var self = this;
          var placeholder = this._currentDrag.placeholder;
          var siblings = Array.prototype.slice.call(this._currentDrag.placeholder.parentNode.children).filter(function(el) {
            return el.nodeName === self.el.nodeName && el !== self.el;
          });
          var dragOffsetTop = this._currentDrag.currentY;
          var el;
          for (var i = 0,
              len = siblings.length; i < len; i++) {
            el = siblings[i];
            if (i === len - 1) {
              if (dragOffsetTop > el.offsetTop) {
                return i;
              }
            } else if (i === 0) {
              if (dragOffsetTop < el.offsetTop + el.offsetHeight) {
                return i;
              }
            } else if (dragOffsetTop > el.offsetTop - el.offsetHeight / 2 && dragOffsetTop < el.offsetTop + el.offsetHeight) {
              return i;
            }
          }
          return this._currentDrag.startIndex;
        };
        ReorderDrag.prototype.end = function(e, doneCallback) {
          if (!this._currentDrag) {
            doneCallback && doneCallback();
            return;
          }
          var placeholder = this._currentDrag.placeholder;
          var finalIndex = this._getReorderIndex();
          this.el.classList.remove(ITEM_REORDERING_CLASS);
          this.el.style[ionic.CSS.TRANSFORM] = '';
          placeholder.parentNode.insertBefore(this.el, placeholder);
          placeholder.parentNode.removeChild(placeholder);
          this.onReorder && this.onReorder(this.el, this._currentDrag.startIndex, finalIndex);
          this._currentDrag = {
            placeholder: null,
            content: null
          };
          this._currentDrag = null;
          doneCallback && doneCallback();
        };
        ionic.views.ListView = ionic.views.View.inherit({
          initialize: function(opts) {
            var _this = this;
            opts = ionic.extend({
              onReorder: function(el, oldIndex, newIndex) {},
              virtualRemoveThreshold: -200,
              virtualAddThreshold: 200,
              canSwipe: function() {
                return true;
              }
            }, opts);
            ionic.extend(this, opts);
            if (!this.itemHeight && this.listEl) {
              this.itemHeight = this.listEl.children[0] && parseInt(this.listEl.children[0].style.height, 10);
            }
            this.onRefresh = opts.onRefresh || function() {};
            this.onRefreshOpening = opts.onRefreshOpening || function() {};
            this.onRefreshHolding = opts.onRefreshHolding || function() {};
            window.ionic.onGesture('release', function(e) {
              _this._handleEndDrag(e);
            }, this.el);
            window.ionic.onGesture('drag', function(e) {
              _this._handleDrag(e);
            }, this.el);
            this._initDrag();
          },
          deregister: function() {
            this.el = null;
            this.listEl = null;
            this.scrollEl = null;
            this.scrollView = null;
          },
          stopRefreshing: function() {
            var refresher = this.el.querySelector('.list-refresher');
            refresher.style.height = '0';
          },
          didScroll: function(e) {
            if (this.isVirtual) {
              var itemHeight = this.itemHeight;
              var totalItems = this.listEl.children.length;
              var scrollHeight = e.target.scrollHeight;
              var viewportHeight = this.el.parentNode.offsetHeight;
              var scrollTop = e.scrollTop;
              var highWater = Math.max(0, e.scrollTop + this.virtualRemoveThreshold);
              var lowWater = Math.min(scrollHeight, Math.abs(e.scrollTop) + viewportHeight + this.virtualAddThreshold);
              var itemsPerViewport = Math.floor((lowWater - highWater) / itemHeight);
              var first = parseInt(Math.abs(highWater / itemHeight), 10);
              var last = parseInt(Math.abs(lowWater / itemHeight), 10);
              this._virtualItemsToRemove = Array.prototype.slice.call(this.listEl.children, 0, first);
              var nodes = Array.prototype.slice.call(this.listEl.children, first, first + itemsPerViewport);
              this.renderViewport && this.renderViewport(highWater, lowWater, first, last);
            }
          },
          didStopScrolling: function(e) {
            if (this.isVirtual) {
              for (var i = 0; i < this._virtualItemsToRemove.length; i++) {
                var el = this._virtualItemsToRemove[i];
                this.didHideItem && this.didHideItem(i);
              }
            }
          },
          clearDragEffects: function() {
            if (this._lastDragOp) {
              this._lastDragOp.clean && this._lastDragOp.clean();
              this._lastDragOp.deregister && this._lastDragOp.deregister();
              this._lastDragOp = null;
            }
          },
          _initDrag: function() {
            if (this._lastDragOp) {
              this._lastDragOp.deregister && this._lastDragOp.deregister();
            }
            this._lastDragOp = this._dragOp;
            this._dragOp = null;
          },
          _getItem: function(target) {
            while (target) {
              if (target.classList && target.classList.contains(ITEM_CLASS)) {
                return target;
              }
              target = target.parentNode;
            }
            return null;
          },
          _startDrag: function(e) {
            var _this = this;
            var didStart = false;
            this._isDragging = false;
            var lastDragOp = this._lastDragOp;
            var item;
            if (this._didDragUpOrDown && lastDragOp instanceof SlideDrag) {
              lastDragOp.clean && lastDragOp.clean();
            }
            if (ionic.DomUtil.getParentOrSelfWithClass(e.target, ITEM_REORDER_BTN_CLASS) && (e.gesture.direction == 'up' || e.gesture.direction == 'down')) {
              item = this._getItem(e.target);
              if (item) {
                this._dragOp = new ReorderDrag({
                  listEl: this.el,
                  el: item,
                  scrollEl: this.scrollEl,
                  scrollView: this.scrollView,
                  onReorder: function(el, start, end) {
                    _this.onReorder && _this.onReorder(el, start, end);
                  }
                });
                this._dragOp.start(e);
                e.preventDefault();
              }
            } else if (!this._didDragUpOrDown && (e.gesture.direction == 'left' || e.gesture.direction == 'right') && Math.abs(e.gesture.deltaX) > 5) {
              item = this._getItem(e.target);
              if (item && item.querySelector('.item-options')) {
                this._dragOp = new SlideDrag({
                  el: this.el,
                  canSwipe: this.canSwipe
                });
                this._dragOp.start(e);
                e.preventDefault();
              }
            }
            if (lastDragOp && this._dragOp && !this._dragOp.isSameItem(lastDragOp) && e.defaultPrevented) {
              lastDragOp.clean && lastDragOp.clean();
            }
          },
          _handleEndDrag: function(e) {
            var _this = this;
            this._didDragUpOrDown = false;
            if (!this._dragOp) {
              return;
            }
            this._dragOp.end(e, function() {
              _this._initDrag();
            });
          },
          _handleDrag: function(e) {
            var _this = this,
                content,
                buttons;
            if (Math.abs(e.gesture.deltaY) > 5) {
              this._didDragUpOrDown = true;
            }
            if (!this.isDragging && !this._dragOp) {
              this._startDrag(e);
            }
            if (!this._dragOp) {
              return;
            }
            e.gesture.srcEvent.preventDefault();
            this._dragOp.drag(e);
          }
        });
      })(ionic);
      (function(ionic) {
        'use strict';
        ionic.views.Modal = ionic.views.View.inherit({
          initialize: function(opts) {
            opts = ionic.extend({
              focusFirstInput: false,
              unfocusOnHide: true,
              focusFirstDelay: 600,
              backdropClickToClose: true,
              hardwareBackButtonClose: true
            }, opts);
            ionic.extend(this, opts);
            this.el = opts.el;
          },
          show: function() {
            var self = this;
            if (self.focusFirstInput) {
              window.setTimeout(function() {
                var input = self.el.querySelector('input, textarea');
                input && input.focus && input.focus();
              }, self.focusFirstDelay);
            }
          },
          hide: function() {
            if (this.unfocusOnHide) {
              var inputs = this.el.querySelectorAll('input, textarea');
              window.setTimeout(function() {
                for (var i = 0; i < inputs.length; i++) {
                  inputs[i].blur && inputs[i].blur();
                }
              });
            }
          }
        });
      })(ionic);
      (function(ionic) {
        'use strict';
        ionic.views.SideMenu = ionic.views.View.inherit({
          initialize: function(opts) {
            this.el = opts.el;
            this.isEnabled = (typeof opts.isEnabled === 'undefined') ? true : opts.isEnabled;
            this.setWidth(opts.width);
          },
          getFullWidth: function() {
            return this.width;
          },
          setWidth: function(width) {
            this.width = width;
            this.el.style.width = width + 'px';
          },
          setIsEnabled: function(isEnabled) {
            this.isEnabled = isEnabled;
          },
          bringUp: function() {
            if (this.el.style.zIndex !== '0') {
              this.el.style.zIndex = '0';
            }
          },
          pushDown: function() {
            if (this.el.style.zIndex !== '-1') {
              this.el.style.zIndex = '-1';
            }
          }
        });
        ionic.views.SideMenuContent = ionic.views.View.inherit({
          initialize: function(opts) {
            ionic.extend(this, {
              animationClass: 'menu-animated',
              onDrag: function(e) {},
              onEndDrag: function(e) {}
            }, opts);
            ionic.onGesture('drag', ionic.proxy(this._onDrag, this), this.el);
            ionic.onGesture('release', ionic.proxy(this._onEndDrag, this), this.el);
          },
          _onDrag: function(e) {
            this.onDrag && this.onDrag(e);
          },
          _onEndDrag: function(e) {
            this.onEndDrag && this.onEndDrag(e);
          },
          disableAnimation: function() {
            this.el.classList.remove(this.animationClass);
          },
          enableAnimation: function() {
            this.el.classList.add(this.animationClass);
          },
          getTranslateX: function() {
            return parseFloat(this.el.style[ionic.CSS.TRANSFORM].replace('translate3d(', '').split(',')[0]);
          },
          setTranslateX: ionic.animationFrameThrottle(function(x) {
            this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + x + 'px, 0, 0)';
          })
        });
      })(ionic);
      (function(ionic) {
        'use strict';
        ionic.views.Slider = ionic.views.View.inherit({initialize: function(options) {
            var slider = this;
            var noop = function() {};
            var offloadFn = function(fn) {
              setTimeout(fn || noop, 0);
            };
            var browser = {
              addEventListener: !!window.addEventListener,
              touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
              transitions: (function(temp) {
                var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
                for (var i in props)
                  if (temp.style[props[i]] !== undefined)
                    return true;
                return false;
              })(document.createElement('swipe'))
            };
            var container = options.el;
            if (!container)
              return;
            var element = container.children[0];
            var slides,
                slidePos,
                width,
                length;
            options = options || {};
            var index = parseInt(options.startSlide, 10) || 0;
            var speed = options.speed || 300;
            options.continuous = options.continuous !== undefined ? options.continuous : true;
            function setup() {
              slides = element.children;
              length = slides.length;
              if (slides.length < 2)
                options.continuous = false;
              if (browser.transitions && options.continuous && slides.length < 3) {
                element.appendChild(slides[0].cloneNode(true));
                element.appendChild(element.children[1].cloneNode(true));
                slides = element.children;
              }
              slidePos = new Array(slides.length);
              width = container.offsetWidth || container.getBoundingClientRect().width;
              element.style.width = (slides.length * width) + 'px';
              var pos = slides.length;
              while (pos--) {
                var slide = slides[pos];
                slide.style.width = width + 'px';
                slide.setAttribute('data-index', pos);
                if (browser.transitions) {
                  slide.style.left = (pos * -width) + 'px';
                  move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
                }
              }
              if (options.continuous && browser.transitions) {
                move(circle(index - 1), -width, 0);
                move(circle(index + 1), width, 0);
              }
              if (!browser.transitions)
                element.style.left = (index * -width) + 'px';
              container.style.visibility = 'visible';
              options.slidesChanged && options.slidesChanged();
            }
            function prev() {
              if (options.continuous)
                slide(index - 1);
              else if (index)
                slide(index - 1);
            }
            function next() {
              if (options.continuous)
                slide(index + 1);
              else if (index < slides.length - 1)
                slide(index + 1);
            }
            function circle(index) {
              return (slides.length + (index % slides.length)) % slides.length;
            }
            function slide(to, slideSpeed) {
              if (index == to)
                return;
              if (browser.transitions) {
                var direction = Math.abs(index - to) / (index - to);
                if (options.continuous) {
                  var natural_direction = direction;
                  direction = -slidePos[circle(to)] / width;
                  if (direction !== natural_direction)
                    to = -direction * slides.length + to;
                }
                var diff = Math.abs(index - to) - 1;
                while (diff--)
                  move(circle((to > index ? to : index) - diff - 1), width * direction, 0);
                to = circle(to);
                move(index, width * direction, slideSpeed || speed);
                move(to, 0, slideSpeed || speed);
                if (options.continuous)
                  move(circle(to - direction), -(width * direction), 0);
              } else {
                to = circle(to);
                animate(index * -width, to * -width, slideSpeed || speed);
              }
              index = to;
              offloadFn(options.callback && options.callback(index, slides[index]));
            }
            function move(index, dist, speed) {
              translate(index, dist, speed);
              slidePos[index] = dist;
            }
            function translate(index, dist, speed) {
              var slide = slides[index];
              var style = slide && slide.style;
              if (!style)
                return;
              style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = speed + 'ms';
              style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
              style.msTransform = style.MozTransform = style.OTransform = 'translateX(' + dist + 'px)';
            }
            function animate(from, to, speed) {
              if (!speed) {
                element.style.left = to + 'px';
                return;
              }
              var start = +new Date();
              var timer = setInterval(function() {
                var timeElap = +new Date() - start;
                if (timeElap > speed) {
                  element.style.left = to + 'px';
                  if (delay)
                    begin();
                  options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);
                  clearInterval(timer);
                  return;
                }
                element.style.left = (((to - from) * (Math.floor((timeElap / speed) * 100) / 100)) + from) + 'px';
              }, 4);
            }
            var delay = options.auto || 0;
            var interval;
            function begin() {
              interval = setTimeout(next, delay);
            }
            function stop() {
              delay = options.auto || 0;
              clearTimeout(interval);
            }
            var start = {};
            var delta = {};
            var isScrolling;
            var events = {
              handleEvent: function(event) {
                if (event.type == 'mousedown' || event.type == 'mouseup' || event.type == 'mousemove') {
                  event.touches = [{
                    pageX: event.pageX,
                    pageY: event.pageY
                  }];
                }
                switch (event.type) {
                  case 'mousedown':
                    this.start(event);
                    break;
                  case 'touchstart':
                    this.start(event);
                    break;
                  case 'touchmove':
                    this.touchmove(event);
                    break;
                  case 'mousemove':
                    this.touchmove(event);
                    break;
                  case 'touchend':
                    offloadFn(this.end(event));
                    break;
                  case 'mouseup':
                    offloadFn(this.end(event));
                    break;
                  case 'webkitTransitionEnd':
                  case 'msTransitionEnd':
                  case 'oTransitionEnd':
                  case 'otransitionend':
                  case 'transitionend':
                    offloadFn(this.transitionEnd(event));
                    break;
                  case 'resize':
                    offloadFn(setup);
                    break;
                }
                if (options.stopPropagation)
                  event.stopPropagation();
              },
              start: function(event) {
                var touches = event.touches[0];
                start = {
                  x: touches.pageX,
                  y: touches.pageY,
                  time: +new Date()
                };
                isScrolling = undefined;
                delta = {};
                if (browser.touch) {
                  element.addEventListener('touchmove', this, false);
                  element.addEventListener('touchend', this, false);
                } else {
                  element.addEventListener('mousemove', this, false);
                  element.addEventListener('mouseup', this, false);
                  document.addEventListener('mouseup', this, false);
                }
              },
              touchmove: function(event) {
                if (event.touches.length > 1 || event.scale && event.scale !== 1 || slider.slideIsDisabled) {
                  return;
                }
                if (options.disableScroll)
                  event.preventDefault();
                var touches = event.touches[0];
                delta = {
                  x: touches.pageX - start.x,
                  y: touches.pageY - start.y
                };
                if (typeof isScrolling == 'undefined') {
                  isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
                }
                if (!isScrolling) {
                  event.preventDefault();
                  stop();
                  if (options.continuous) {
                    translate(circle(index - 1), delta.x + slidePos[circle(index - 1)], 0);
                    translate(index, delta.x + slidePos[index], 0);
                    translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);
                  } else {
                    delta.x = delta.x / ((!index && delta.x > 0 || index == slides.length - 1 && delta.x < 0) ? (Math.abs(delta.x) / width + 1) : 1);
                    translate(index - 1, delta.x + slidePos[index - 1], 0);
                    translate(index, delta.x + slidePos[index], 0);
                    translate(index + 1, delta.x + slidePos[index + 1], 0);
                  }
                }
              },
              end: function(event) {
                var duration = +new Date() - start.time;
                var isValidSlide = Number(duration) < 250 && Math.abs(delta.x) > 20 || Math.abs(delta.x) > width / 2;
                var isPastBounds = (!index && delta.x > 0) || (index == slides.length - 1 && delta.x < 0);
                if (options.continuous)
                  isPastBounds = false;
                var direction = delta.x < 0;
                if (!isScrolling) {
                  if (isValidSlide && !isPastBounds) {
                    if (direction) {
                      if (options.continuous) {
                        move(circle(index - 1), -width, 0);
                        move(circle(index + 2), width, 0);
                      } else {
                        move(index - 1, -width, 0);
                      }
                      move(index, slidePos[index] - width, speed);
                      move(circle(index + 1), slidePos[circle(index + 1)] - width, speed);
                      index = circle(index + 1);
                    } else {
                      if (options.continuous) {
                        move(circle(index + 1), width, 0);
                        move(circle(index - 2), -width, 0);
                      } else {
                        move(index + 1, width, 0);
                      }
                      move(index, slidePos[index] + width, speed);
                      move(circle(index - 1), slidePos[circle(index - 1)] + width, speed);
                      index = circle(index - 1);
                    }
                    options.callback && options.callback(index, slides[index]);
                  } else {
                    if (options.continuous) {
                      move(circle(index - 1), -width, speed);
                      move(index, 0, speed);
                      move(circle(index + 1), width, speed);
                    } else {
                      move(index - 1, -width, speed);
                      move(index, 0, speed);
                      move(index + 1, width, speed);
                    }
                  }
                }
                if (browser.touch) {
                  element.removeEventListener('touchmove', events, false);
                  element.removeEventListener('touchend', events, false);
                } else {
                  element.removeEventListener('mousemove', events, false);
                  element.removeEventListener('mouseup', events, false);
                  document.removeEventListener('mouseup', events, false);
                }
              },
              transitionEnd: function(event) {
                if (parseInt(event.target.getAttribute('data-index'), 10) == index) {
                  if (delay)
                    begin();
                  options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);
                }
              }
            };
            this.update = function() {
              setTimeout(setup);
            };
            this.setup = function() {
              setup();
            };
            this.loop = function(value) {
              if (arguments.length)
                options.continuous = !!value;
              return options.continuous;
            };
            this.enableSlide = function(shouldEnable) {
              if (arguments.length) {
                this.slideIsDisabled = !shouldEnable;
              }
              return !this.slideIsDisabled;
            }, this.slide = this.select = function(to, speed) {
              stop();
              slide(to, speed);
            };
            this.prev = this.previous = function() {
              stop();
              prev();
            };
            this.next = function() {
              stop();
              next();
            };
            this.stop = function() {
              stop();
            };
            this.start = function() {
              begin();
            };
            this.autoPlay = function(newDelay) {
              if (!delay || delay < 0) {
                stop();
              } else {
                delay = newDelay;
                begin();
              }
            };
            this.currentIndex = this.selected = function() {
              return index;
            };
            this.slidesCount = this.count = function() {
              return length;
            };
            this.kill = function() {
              stop();
              element.style.width = '';
              element.style.left = '';
              var pos = slides.length;
              while (pos--) {
                var slide = slides[pos];
                slide.style.width = '';
                slide.style.left = '';
                if (browser.transitions)
                  translate(pos, 0, 0);
              }
              if (browser.addEventListener) {
                element.removeEventListener('touchstart', events, false);
                element.removeEventListener('webkitTransitionEnd', events, false);
                element.removeEventListener('msTransitionEnd', events, false);
                element.removeEventListener('oTransitionEnd', events, false);
                element.removeEventListener('otransitionend', events, false);
                element.removeEventListener('transitionend', events, false);
                window.removeEventListener('resize', events, false);
              } else {
                window.onresize = null;
              }
            };
            this.load = function() {
              setup();
              if (delay)
                begin();
              if (browser.addEventListener) {
                if (browser.touch) {
                  element.addEventListener('touchstart', events, false);
                } else {
                  element.addEventListener('mousedown', events, false);
                }
                if (browser.transitions) {
                  element.addEventListener('webkitTransitionEnd', events, false);
                  element.addEventListener('msTransitionEnd', events, false);
                  element.addEventListener('oTransitionEnd', events, false);
                  element.addEventListener('otransitionend', events, false);
                  element.addEventListener('transitionend', events, false);
                }
                window.addEventListener('resize', events, false);
              } else {
                window.onresize = function() {
                  setup();
                };
              }
            };
          }});
      })(ionic);
      (function(ionic) {
        'use strict';
        ionic.views.Toggle = ionic.views.View.inherit({
          initialize: function(opts) {
            var self = this;
            this.el = opts.el;
            this.checkbox = opts.checkbox;
            this.track = opts.track;
            this.handle = opts.handle;
            this.openPercent = -1;
            this.onChange = opts.onChange || function() {};
            this.triggerThreshold = opts.triggerThreshold || 20;
            this.dragStartHandler = function(e) {
              self.dragStart(e);
            };
            this.dragHandler = function(e) {
              self.drag(e);
            };
            this.holdHandler = function(e) {
              self.hold(e);
            };
            this.releaseHandler = function(e) {
              self.release(e);
            };
            this.dragStartGesture = ionic.onGesture('dragstart', this.dragStartHandler, this.el);
            this.dragGesture = ionic.onGesture('drag', this.dragHandler, this.el);
            this.dragHoldGesture = ionic.onGesture('hold', this.holdHandler, this.el);
            this.dragReleaseGesture = ionic.onGesture('release', this.releaseHandler, this.el);
          },
          destroy: function() {
            ionic.offGesture(this.dragStartGesture, 'dragstart', this.dragStartGesture);
            ionic.offGesture(this.dragGesture, 'drag', this.dragGesture);
            ionic.offGesture(this.dragHoldGesture, 'hold', this.holdHandler);
            ionic.offGesture(this.dragReleaseGesture, 'release', this.releaseHandler);
          },
          tap: function(e) {
            if (this.el.getAttribute('disabled') !== 'disabled') {
              this.val(!this.checkbox.checked);
            }
          },
          dragStart: function(e) {
            if (this.checkbox.disabled)
              return;
            this._dragInfo = {
              width: this.el.offsetWidth,
              left: this.el.offsetLeft,
              right: this.el.offsetLeft + this.el.offsetWidth,
              triggerX: this.el.offsetWidth / 2,
              initialState: this.checkbox.checked
            };
            e.gesture.srcEvent.preventDefault();
            this.hold(e);
          },
          drag: function(e) {
            var self = this;
            if (!this._dragInfo) {
              return;
            }
            e.gesture.srcEvent.preventDefault();
            ionic.requestAnimationFrame(function(amount) {
              if (!self._dragInfo) {
                return;
              }
              var slidePageLeft = self.track.offsetLeft + (self.handle.offsetWidth / 2);
              var slidePageRight = self.track.offsetLeft + self.track.offsetWidth - (self.handle.offsetWidth / 2);
              var dx = e.gesture.deltaX;
              var px = e.gesture.touches[0].pageX - self._dragInfo.left;
              var mx = self._dragInfo.width - self.triggerThreshold;
              if (self._dragInfo.initialState) {
                if (px < self.triggerThreshold) {
                  self.setOpenPercent(0);
                } else if (px > self._dragInfo.triggerX) {
                  self.setOpenPercent(100);
                }
              } else {
                if (px < self._dragInfo.triggerX) {
                  self.setOpenPercent(0);
                } else if (px > mx) {
                  self.setOpenPercent(100);
                }
              }
            });
          },
          endDrag: function(e) {
            this._dragInfo = null;
          },
          hold: function(e) {
            this.el.classList.add('dragging');
          },
          release: function(e) {
            this.el.classList.remove('dragging');
            this.endDrag(e);
          },
          setOpenPercent: function(openPercent) {
            if (this.openPercent < 0 || (openPercent < (this.openPercent - 3) || openPercent > (this.openPercent + 3))) {
              this.openPercent = openPercent;
              if (openPercent === 0) {
                this.val(false);
              } else if (openPercent === 100) {
                this.val(true);
              } else {
                var openPixel = Math.round((openPercent / 100) * this.track.offsetWidth - (this.handle.offsetWidth));
                openPixel = (openPixel < 1 ? 0 : openPixel);
                this.handle.style[ionic.CSS.TRANSFORM] = 'translate3d(' + openPixel + 'px,0,0)';
              }
            }
          },
          val: function(value) {
            if (value === true || value === false) {
              if (this.handle.style[ionic.CSS.TRANSFORM] !== "") {
                this.handle.style[ionic.CSS.TRANSFORM] = "";
              }
              this.checkbox.checked = value;
              this.openPercent = (value ? 100 : 0);
              this.onChange && this.onChange();
            }
            return this.checkbox.checked;
          }
        });
      })(ionic);
    })();
  }).call(System.global);
  return System.get("@@global-helpers").retrieveGlobal(__module.id, false);
});



System.register("github:angular/bower-angular-animate@1.3.8/angular-animate", ["angular"], false, function(__require, __exports, __module) {
  System.get("@@global-helpers").prepareGlobal(__module.id, ["angular"]);
  (function() {
    "format global";
    "deps angular";
    (function(window, angular, undefined) {
      'use strict';
      angular.module('ngAnimate', ['ng']).directive('ngAnimateChildren', function() {
        var NG_ANIMATE_CHILDREN = '$$ngAnimateChildren';
        return function(scope, element, attrs) {
          var val = attrs.ngAnimateChildren;
          if (angular.isString(val) && val.length === 0) {
            element.data(NG_ANIMATE_CHILDREN, true);
          } else {
            scope.$watch(val, function(value) {
              element.data(NG_ANIMATE_CHILDREN, !!value);
            });
          }
        };
      }).factory('$$animateReflow', ['$$rAF', '$document', function($$rAF, $document) {
        var bod = $document[0].body;
        return function(fn) {
          return $$rAF(function() {
            var a = bod.offsetWidth + 1;
            fn();
          });
        };
      }]).config(['$provide', '$animateProvider', function($provide, $animateProvider) {
        var noop = angular.noop;
        var forEach = angular.forEach;
        var selectors = $animateProvider.$$selectors;
        var isArray = angular.isArray;
        var isString = angular.isString;
        var isObject = angular.isObject;
        var ELEMENT_NODE = 1;
        var NG_ANIMATE_STATE = '$$ngAnimateState';
        var NG_ANIMATE_CHILDREN = '$$ngAnimateChildren';
        var NG_ANIMATE_CLASS_NAME = 'ng-animate';
        var rootAnimateState = {running: true};
        function extractElementNode(element) {
          for (var i = 0; i < element.length; i++) {
            var elm = element[i];
            if (elm.nodeType == ELEMENT_NODE) {
              return elm;
            }
          }
        }
        function prepareElement(element) {
          return element && angular.element(element);
        }
        function stripCommentsFromElement(element) {
          return angular.element(extractElementNode(element));
        }
        function isMatchingElement(elm1, elm2) {
          return extractElementNode(elm1) == extractElementNode(elm2);
        }
        var $$jqLite;
        $provide.decorator('$animate', ['$delegate', '$$q', '$injector', '$sniffer', '$rootElement', '$$asyncCallback', '$rootScope', '$document', '$templateRequest', '$$jqLite', function($delegate, $$q, $injector, $sniffer, $rootElement, $$asyncCallback, $rootScope, $document, $templateRequest, $$$jqLite) {
          $$jqLite = $$$jqLite;
          $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);
          var deregisterWatch = $rootScope.$watch(function() {
            return $templateRequest.totalPendingRequests;
          }, function(val, oldVal) {
            if (val !== 0)
              return;
            deregisterWatch();
            $rootScope.$$postDigest(function() {
              $rootScope.$$postDigest(function() {
                rootAnimateState.running = false;
              });
            });
          });
          var globalAnimationCounter = 0;
          var classNameFilter = $animateProvider.classNameFilter();
          var isAnimatableClassName = !classNameFilter ? function() {
            return true;
          } : function(className) {
            return classNameFilter.test(className);
          };
          function classBasedAnimationsBlocked(element, setter) {
            var data = element.data(NG_ANIMATE_STATE) || {};
            if (setter) {
              data.running = true;
              data.structural = true;
              element.data(NG_ANIMATE_STATE, data);
            }
            return data.disabled || (data.running && data.structural);
          }
          function runAnimationPostDigest(fn) {
            var cancelFn,
                defer = $$q.defer();
            defer.promise.$$cancelFn = function() {
              cancelFn && cancelFn();
            };
            $rootScope.$$postDigest(function() {
              cancelFn = fn(function() {
                defer.resolve();
              });
            });
            return defer.promise;
          }
          function parseAnimateOptions(options) {
            if (isObject(options)) {
              if (options.tempClasses && isString(options.tempClasses)) {
                options.tempClasses = options.tempClasses.split(/\s+/);
              }
              return options;
            }
          }
          function resolveElementClasses(element, cache, runningAnimations) {
            runningAnimations = runningAnimations || {};
            var lookup = {};
            forEach(runningAnimations, function(data, selector) {
              forEach(selector.split(' '), function(s) {
                lookup[s] = data;
              });
            });
            var hasClasses = Object.create(null);
            forEach((element.attr('class') || '').split(/\s+/), function(className) {
              hasClasses[className] = true;
            });
            var toAdd = [],
                toRemove = [];
            forEach((cache && cache.classes) || [], function(status, className) {
              var hasClass = hasClasses[className];
              var matchingAnimation = lookup[className] || {};
              if (status === false) {
                if (hasClass || matchingAnimation.event == 'addClass') {
                  toRemove.push(className);
                }
              } else if (status === true) {
                if (!hasClass || matchingAnimation.event == 'removeClass') {
                  toAdd.push(className);
                }
              }
            });
            return (toAdd.length + toRemove.length) > 0 && [toAdd.join(' '), toRemove.join(' ')];
          }
          function lookup(name) {
            if (name) {
              var matches = [],
                  flagMap = {},
                  classes = name.substr(1).split('.');
              if ($sniffer.transitions || $sniffer.animations) {
                matches.push($injector.get(selectors['']));
              }
              for (var i = 0; i < classes.length; i++) {
                var klass = classes[i],
                    selectorFactoryName = selectors[klass];
                if (selectorFactoryName && !flagMap[klass]) {
                  matches.push($injector.get(selectorFactoryName));
                  flagMap[klass] = true;
                }
              }
              return matches;
            }
          }
          function animationRunner(element, animationEvent, className, options) {
            var node = element[0];
            if (!node) {
              return;
            }
            if (options) {
              options.to = options.to || {};
              options.from = options.from || {};
            }
            var classNameAdd;
            var classNameRemove;
            if (isArray(className)) {
              classNameAdd = className[0];
              classNameRemove = className[1];
              if (!classNameAdd) {
                className = classNameRemove;
                animationEvent = 'removeClass';
              } else if (!classNameRemove) {
                className = classNameAdd;
                animationEvent = 'addClass';
              } else {
                className = classNameAdd + ' ' + classNameRemove;
              }
            }
            var isSetClassOperation = animationEvent == 'setClass';
            var isClassBased = isSetClassOperation || animationEvent == 'addClass' || animationEvent == 'removeClass' || animationEvent == 'animate';
            var currentClassName = element.attr('class');
            var classes = currentClassName + ' ' + className;
            if (!isAnimatableClassName(classes)) {
              return;
            }
            var beforeComplete = noop,
                beforeCancel = [],
                before = [],
                afterComplete = noop,
                afterCancel = [],
                after = [];
            var animationLookup = (' ' + classes).replace(/\s+/g, '.');
            forEach(lookup(animationLookup), function(animationFactory) {
              var created = registerAnimation(animationFactory, animationEvent);
              if (!created && isSetClassOperation) {
                registerAnimation(animationFactory, 'addClass');
                registerAnimation(animationFactory, 'removeClass');
              }
            });
            function registerAnimation(animationFactory, event) {
              var afterFn = animationFactory[event];
              var beforeFn = animationFactory['before' + event.charAt(0).toUpperCase() + event.substr(1)];
              if (afterFn || beforeFn) {
                if (event == 'leave') {
                  beforeFn = afterFn;
                  afterFn = null;
                }
                after.push({
                  event: event,
                  fn: afterFn
                });
                before.push({
                  event: event,
                  fn: beforeFn
                });
                return true;
              }
            }
            function run(fns, cancellations, allCompleteFn) {
              var animations = [];
              forEach(fns, function(animation) {
                animation.fn && animations.push(animation);
              });
              var count = 0;
              function afterAnimationComplete(index) {
                if (cancellations) {
                  (cancellations[index] || noop)();
                  if (++count < animations.length)
                    return;
                  cancellations = null;
                }
                allCompleteFn();
              }
              forEach(animations, function(animation, index) {
                var progress = function() {
                  afterAnimationComplete(index);
                };
                switch (animation.event) {
                  case 'setClass':
                    cancellations.push(animation.fn(element, classNameAdd, classNameRemove, progress, options));
                    break;
                  case 'animate':
                    cancellations.push(animation.fn(element, className, options.from, options.to, progress));
                    break;
                  case 'addClass':
                    cancellations.push(animation.fn(element, classNameAdd || className, progress, options));
                    break;
                  case 'removeClass':
                    cancellations.push(animation.fn(element, classNameRemove || className, progress, options));
                    break;
                  default:
                    cancellations.push(animation.fn(element, progress, options));
                    break;
                }
              });
              if (cancellations && cancellations.length === 0) {
                allCompleteFn();
              }
            }
            return {
              node: node,
              event: animationEvent,
              className: className,
              isClassBased: isClassBased,
              isSetClassOperation: isSetClassOperation,
              applyStyles: function() {
                if (options) {
                  element.css(angular.extend(options.from || {}, options.to || {}));
                }
              },
              before: function(allCompleteFn) {
                beforeComplete = allCompleteFn;
                run(before, beforeCancel, function() {
                  beforeComplete = noop;
                  allCompleteFn();
                });
              },
              after: function(allCompleteFn) {
                afterComplete = allCompleteFn;
                run(after, afterCancel, function() {
                  afterComplete = noop;
                  allCompleteFn();
                });
              },
              cancel: function() {
                if (beforeCancel) {
                  forEach(beforeCancel, function(cancelFn) {
                    (cancelFn || noop)(true);
                  });
                  beforeComplete(true);
                }
                if (afterCancel) {
                  forEach(afterCancel, function(cancelFn) {
                    (cancelFn || noop)(true);
                  });
                  afterComplete(true);
                }
              }
            };
          }
          return {
            animate: function(element, from, to, className, options) {
              className = className || 'ng-inline-animate';
              options = parseAnimateOptions(options) || {};
              options.from = to ? from : null;
              options.to = to ? to : from;
              return runAnimationPostDigest(function(done) {
                return performAnimation('animate', className, stripCommentsFromElement(element), null, null, noop, options, done);
              });
            },
            enter: function(element, parentElement, afterElement, options) {
              options = parseAnimateOptions(options);
              element = angular.element(element);
              parentElement = prepareElement(parentElement);
              afterElement = prepareElement(afterElement);
              classBasedAnimationsBlocked(element, true);
              $delegate.enter(element, parentElement, afterElement);
              return runAnimationPostDigest(function(done) {
                return performAnimation('enter', 'ng-enter', stripCommentsFromElement(element), parentElement, afterElement, noop, options, done);
              });
            },
            leave: function(element, options) {
              options = parseAnimateOptions(options);
              element = angular.element(element);
              cancelChildAnimations(element);
              classBasedAnimationsBlocked(element, true);
              return runAnimationPostDigest(function(done) {
                return performAnimation('leave', 'ng-leave', stripCommentsFromElement(element), null, null, function() {
                  $delegate.leave(element);
                }, options, done);
              });
            },
            move: function(element, parentElement, afterElement, options) {
              options = parseAnimateOptions(options);
              element = angular.element(element);
              parentElement = prepareElement(parentElement);
              afterElement = prepareElement(afterElement);
              cancelChildAnimations(element);
              classBasedAnimationsBlocked(element, true);
              $delegate.move(element, parentElement, afterElement);
              return runAnimationPostDigest(function(done) {
                return performAnimation('move', 'ng-move', stripCommentsFromElement(element), parentElement, afterElement, noop, options, done);
              });
            },
            addClass: function(element, className, options) {
              return this.setClass(element, className, [], options);
            },
            removeClass: function(element, className, options) {
              return this.setClass(element, [], className, options);
            },
            setClass: function(element, add, remove, options) {
              options = parseAnimateOptions(options);
              var STORAGE_KEY = '$$animateClasses';
              element = angular.element(element);
              element = stripCommentsFromElement(element);
              if (classBasedAnimationsBlocked(element)) {
                return $delegate.$$setClassImmediately(element, add, remove, options);
              }
              var classes,
                  cache = element.data(STORAGE_KEY);
              var hasCache = !!cache;
              if (!cache) {
                cache = {};
                cache.classes = {};
              }
              classes = cache.classes;
              add = isArray(add) ? add : add.split(' ');
              forEach(add, function(c) {
                if (c && c.length) {
                  classes[c] = true;
                }
              });
              remove = isArray(remove) ? remove : remove.split(' ');
              forEach(remove, function(c) {
                if (c && c.length) {
                  classes[c] = false;
                }
              });
              if (hasCache) {
                if (options && cache.options) {
                  cache.options = angular.extend(cache.options || {}, options);
                }
                return cache.promise;
              } else {
                element.data(STORAGE_KEY, cache = {
                  classes: classes,
                  options: options
                });
              }
              return cache.promise = runAnimationPostDigest(function(done) {
                var parentElement = element.parent();
                var elementNode = extractElementNode(element);
                var parentNode = elementNode.parentNode;
                if (!parentNode || parentNode['$$NG_REMOVED'] || elementNode['$$NG_REMOVED']) {
                  done();
                  return;
                }
                var cache = element.data(STORAGE_KEY);
                element.removeData(STORAGE_KEY);
                var state = element.data(NG_ANIMATE_STATE) || {};
                var classes = resolveElementClasses(element, cache, state.active);
                return !classes ? done() : performAnimation('setClass', classes, element, parentElement, null, function() {
                  if (classes[0])
                    $delegate.$$addClassImmediately(element, classes[0]);
                  if (classes[1])
                    $delegate.$$removeClassImmediately(element, classes[1]);
                }, cache.options, done);
              });
            },
            cancel: function(promise) {
              promise.$$cancelFn();
            },
            enabled: function(value, element) {
              switch (arguments.length) {
                case 2:
                  if (value) {
                    cleanup(element);
                  } else {
                    var data = element.data(NG_ANIMATE_STATE) || {};
                    data.disabled = true;
                    element.data(NG_ANIMATE_STATE, data);
                  }
                  break;
                case 1:
                  rootAnimateState.disabled = !value;
                  break;
                default:
                  value = !rootAnimateState.disabled;
                  break;
              }
              return !!value;
            }
          };
          function performAnimation(animationEvent, className, element, parentElement, afterElement, domOperation, options, doneCallback) {
            var noopCancel = noop;
            var runner = animationRunner(element, animationEvent, className, options);
            if (!runner) {
              fireDOMOperation();
              fireBeforeCallbackAsync();
              fireAfterCallbackAsync();
              closeAnimation();
              return noopCancel;
            }
            animationEvent = runner.event;
            className = runner.className;
            var elementEvents = angular.element._data(runner.node);
            elementEvents = elementEvents && elementEvents.events;
            if (!parentElement) {
              parentElement = afterElement ? afterElement.parent() : element.parent();
            }
            if (animationsDisabled(element, parentElement)) {
              fireDOMOperation();
              fireBeforeCallbackAsync();
              fireAfterCallbackAsync();
              closeAnimation();
              return noopCancel;
            }
            var ngAnimateState = element.data(NG_ANIMATE_STATE) || {};
            var runningAnimations = ngAnimateState.active || {};
            var totalActiveAnimations = ngAnimateState.totalActive || 0;
            var lastAnimation = ngAnimateState.last;
            var skipAnimation = false;
            if (totalActiveAnimations > 0) {
              var animationsToCancel = [];
              if (!runner.isClassBased) {
                if (animationEvent == 'leave' && runningAnimations['ng-leave']) {
                  skipAnimation = true;
                } else {
                  for (var klass in runningAnimations) {
                    animationsToCancel.push(runningAnimations[klass]);
                  }
                  ngAnimateState = {};
                  cleanup(element, true);
                }
              } else if (lastAnimation.event == 'setClass') {
                animationsToCancel.push(lastAnimation);
                cleanup(element, className);
              } else if (runningAnimations[className]) {
                var current = runningAnimations[className];
                if (current.event == animationEvent) {
                  skipAnimation = true;
                } else {
                  animationsToCancel.push(current);
                  cleanup(element, className);
                }
              }
              if (animationsToCancel.length > 0) {
                forEach(animationsToCancel, function(operation) {
                  operation.cancel();
                });
              }
            }
            if (runner.isClassBased && !runner.isSetClassOperation && animationEvent != 'animate' && !skipAnimation) {
              skipAnimation = (animationEvent == 'addClass') == element.hasClass(className);
            }
            if (skipAnimation) {
              fireDOMOperation();
              fireBeforeCallbackAsync();
              fireAfterCallbackAsync();
              fireDoneCallbackAsync();
              return noopCancel;
            }
            runningAnimations = ngAnimateState.active || {};
            totalActiveAnimations = ngAnimateState.totalActive || 0;
            if (animationEvent == 'leave') {
              element.one('$destroy', function(e) {
                var element = angular.element(this);
                var state = element.data(NG_ANIMATE_STATE);
                if (state) {
                  var activeLeaveAnimation = state.active['ng-leave'];
                  if (activeLeaveAnimation) {
                    activeLeaveAnimation.cancel();
                    cleanup(element, 'ng-leave');
                  }
                }
              });
            }
            $$jqLite.addClass(element, NG_ANIMATE_CLASS_NAME);
            if (options && options.tempClasses) {
              forEach(options.tempClasses, function(className) {
                $$jqLite.addClass(element, className);
              });
            }
            var localAnimationCount = globalAnimationCounter++;
            totalActiveAnimations++;
            runningAnimations[className] = runner;
            element.data(NG_ANIMATE_STATE, {
              last: runner,
              active: runningAnimations,
              index: localAnimationCount,
              totalActive: totalActiveAnimations
            });
            fireBeforeCallbackAsync();
            runner.before(function(cancelled) {
              var data = element.data(NG_ANIMATE_STATE);
              cancelled = cancelled || !data || !data.active[className] || (runner.isClassBased && data.active[className].event != animationEvent);
              fireDOMOperation();
              if (cancelled === true) {
                closeAnimation();
              } else {
                fireAfterCallbackAsync();
                runner.after(closeAnimation);
              }
            });
            return runner.cancel;
            function fireDOMCallback(animationPhase) {
              var eventName = '$animate:' + animationPhase;
              if (elementEvents && elementEvents[eventName] && elementEvents[eventName].length > 0) {
                $$asyncCallback(function() {
                  element.triggerHandler(eventName, {
                    event: animationEvent,
                    className: className
                  });
                });
              }
            }
            function fireBeforeCallbackAsync() {
              fireDOMCallback('before');
            }
            function fireAfterCallbackAsync() {
              fireDOMCallback('after');
            }
            function fireDoneCallbackAsync() {
              fireDOMCallback('close');
              doneCallback();
            }
            function fireDOMOperation() {
              if (!fireDOMOperation.hasBeenRun) {
                fireDOMOperation.hasBeenRun = true;
                domOperation();
              }
            }
            function closeAnimation() {
              if (!closeAnimation.hasBeenRun) {
                if (runner) {
                  runner.applyStyles();
                }
                closeAnimation.hasBeenRun = true;
                if (options && options.tempClasses) {
                  forEach(options.tempClasses, function(className) {
                    $$jqLite.removeClass(element, className);
                  });
                }
                var data = element.data(NG_ANIMATE_STATE);
                if (data) {
                  if (runner && runner.isClassBased) {
                    cleanup(element, className);
                  } else {
                    $$asyncCallback(function() {
                      var data = element.data(NG_ANIMATE_STATE) || {};
                      if (localAnimationCount == data.index) {
                        cleanup(element, className, animationEvent);
                      }
                    });
                    element.data(NG_ANIMATE_STATE, data);
                  }
                }
                fireDoneCallbackAsync();
              }
            }
          }
          function cancelChildAnimations(element) {
            var node = extractElementNode(element);
            if (node) {
              var nodes = angular.isFunction(node.getElementsByClassName) ? node.getElementsByClassName(NG_ANIMATE_CLASS_NAME) : node.querySelectorAll('.' + NG_ANIMATE_CLASS_NAME);
              forEach(nodes, function(element) {
                element = angular.element(element);
                var data = element.data(NG_ANIMATE_STATE);
                if (data && data.active) {
                  forEach(data.active, function(runner) {
                    runner.cancel();
                  });
                }
              });
            }
          }
          function cleanup(element, className) {
            if (isMatchingElement(element, $rootElement)) {
              if (!rootAnimateState.disabled) {
                rootAnimateState.running = false;
                rootAnimateState.structural = false;
              }
            } else if (className) {
              var data = element.data(NG_ANIMATE_STATE) || {};
              var removeAnimations = className === true;
              if (!removeAnimations && data.active && data.active[className]) {
                data.totalActive--;
                delete data.active[className];
              }
              if (removeAnimations || !data.totalActive) {
                $$jqLite.removeClass(element, NG_ANIMATE_CLASS_NAME);
                element.removeData(NG_ANIMATE_STATE);
              }
            }
          }
          function animationsDisabled(element, parentElement) {
            if (rootAnimateState.disabled) {
              return true;
            }
            if (isMatchingElement(element, $rootElement)) {
              return rootAnimateState.running;
            }
            var allowChildAnimations,
                parentRunningAnimation,
                hasParent;
            do {
              if (parentElement.length === 0)
                break;
              var isRoot = isMatchingElement(parentElement, $rootElement);
              var state = isRoot ? rootAnimateState : (parentElement.data(NG_ANIMATE_STATE) || {});
              if (state.disabled) {
                return true;
              }
              if (isRoot) {
                hasParent = true;
              }
              if (allowChildAnimations !== false) {
                var animateChildrenFlag = parentElement.data(NG_ANIMATE_CHILDREN);
                if (angular.isDefined(animateChildrenFlag)) {
                  allowChildAnimations = animateChildrenFlag;
                }
              }
              parentRunningAnimation = parentRunningAnimation || state.running || (state.last && !state.last.isClassBased);
            } while (parentElement = parentElement.parent());
            return !hasParent || (!allowChildAnimations && parentRunningAnimation);
          }
        }]);
        $animateProvider.register('', ['$window', '$sniffer', '$timeout', '$$animateReflow', function($window, $sniffer, $timeout, $$animateReflow) {
          var CSS_PREFIX = '',
              TRANSITION_PROP,
              TRANSITIONEND_EVENT,
              ANIMATION_PROP,
              ANIMATIONEND_EVENT;
          if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
            CSS_PREFIX = '-webkit-';
            TRANSITION_PROP = 'WebkitTransition';
            TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
          } else {
            TRANSITION_PROP = 'transition';
            TRANSITIONEND_EVENT = 'transitionend';
          }
          if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
            CSS_PREFIX = '-webkit-';
            ANIMATION_PROP = 'WebkitAnimation';
            ANIMATIONEND_EVENT = 'webkitAnimationEnd animationend';
          } else {
            ANIMATION_PROP = 'animation';
            ANIMATIONEND_EVENT = 'animationend';
          }
          var DURATION_KEY = 'Duration';
          var PROPERTY_KEY = 'Property';
          var DELAY_KEY = 'Delay';
          var ANIMATION_ITERATION_COUNT_KEY = 'IterationCount';
          var ANIMATION_PLAYSTATE_KEY = 'PlayState';
          var NG_ANIMATE_PARENT_KEY = '$$ngAnimateKey';
          var NG_ANIMATE_CSS_DATA_KEY = '$$ngAnimateCSS3Data';
          var ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
          var CLOSING_TIME_BUFFER = 1.5;
          var ONE_SECOND = 1000;
          var lookupCache = {};
          var parentCounter = 0;
          var animationReflowQueue = [];
          var cancelAnimationReflow;
          function clearCacheAfterReflow() {
            if (!cancelAnimationReflow) {
              cancelAnimationReflow = $$animateReflow(function() {
                animationReflowQueue = [];
                cancelAnimationReflow = null;
                lookupCache = {};
              });
            }
          }
          function afterReflow(element, callback) {
            if (cancelAnimationReflow) {
              cancelAnimationReflow();
            }
            animationReflowQueue.push(callback);
            cancelAnimationReflow = $$animateReflow(function() {
              forEach(animationReflowQueue, function(fn) {
                fn();
              });
              animationReflowQueue = [];
              cancelAnimationReflow = null;
              lookupCache = {};
            });
          }
          var closingTimer = null;
          var closingTimestamp = 0;
          var animationElementQueue = [];
          function animationCloseHandler(element, totalTime) {
            var node = extractElementNode(element);
            element = angular.element(node);
            animationElementQueue.push(element);
            var futureTimestamp = Date.now() + totalTime;
            if (futureTimestamp <= closingTimestamp) {
              return;
            }
            $timeout.cancel(closingTimer);
            closingTimestamp = futureTimestamp;
            closingTimer = $timeout(function() {
              closeAllAnimations(animationElementQueue);
              animationElementQueue = [];
            }, totalTime, false);
          }
          function closeAllAnimations(elements) {
            forEach(elements, function(element) {
              var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
              if (elementData) {
                forEach(elementData.closeAnimationFns, function(fn) {
                  fn();
                });
              }
            });
          }
          function getElementAnimationDetails(element, cacheKey) {
            var data = cacheKey ? lookupCache[cacheKey] : null;
            if (!data) {
              var transitionDuration = 0;
              var transitionDelay = 0;
              var animationDuration = 0;
              var animationDelay = 0;
              forEach(element, function(element) {
                if (element.nodeType == ELEMENT_NODE) {
                  var elementStyles = $window.getComputedStyle(element) || {};
                  var transitionDurationStyle = elementStyles[TRANSITION_PROP + DURATION_KEY];
                  transitionDuration = Math.max(parseMaxTime(transitionDurationStyle), transitionDuration);
                  var transitionDelayStyle = elementStyles[TRANSITION_PROP + DELAY_KEY];
                  transitionDelay = Math.max(parseMaxTime(transitionDelayStyle), transitionDelay);
                  var animationDelayStyle = elementStyles[ANIMATION_PROP + DELAY_KEY];
                  animationDelay = Math.max(parseMaxTime(elementStyles[ANIMATION_PROP + DELAY_KEY]), animationDelay);
                  var aDuration = parseMaxTime(elementStyles[ANIMATION_PROP + DURATION_KEY]);
                  if (aDuration > 0) {
                    aDuration *= parseInt(elementStyles[ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY], 10) || 1;
                  }
                  animationDuration = Math.max(aDuration, animationDuration);
                }
              });
              data = {
                total: 0,
                transitionDelay: transitionDelay,
                transitionDuration: transitionDuration,
                animationDelay: animationDelay,
                animationDuration: animationDuration
              };
              if (cacheKey) {
                lookupCache[cacheKey] = data;
              }
            }
            return data;
          }
          function parseMaxTime(str) {
            var maxValue = 0;
            var values = isString(str) ? str.split(/\s*,\s*/) : [];
            forEach(values, function(value) {
              maxValue = Math.max(parseFloat(value) || 0, maxValue);
            });
            return maxValue;
          }
          function getCacheKey(element) {
            var parentElement = element.parent();
            var parentID = parentElement.data(NG_ANIMATE_PARENT_KEY);
            if (!parentID) {
              parentElement.data(NG_ANIMATE_PARENT_KEY, ++parentCounter);
              parentID = parentCounter;
            }
            return parentID + '-' + extractElementNode(element).getAttribute('class');
          }
          function animateSetup(animationEvent, element, className, styles) {
            var structural = ['ng-enter', 'ng-leave', 'ng-move'].indexOf(className) >= 0;
            var cacheKey = getCacheKey(element);
            var eventCacheKey = cacheKey + ' ' + className;
            var itemIndex = lookupCache[eventCacheKey] ? ++lookupCache[eventCacheKey].total : 0;
            var stagger = {};
            if (itemIndex > 0) {
              var staggerClassName = className + '-stagger';
              var staggerCacheKey = cacheKey + ' ' + staggerClassName;
              var applyClasses = !lookupCache[staggerCacheKey];
              applyClasses && $$jqLite.addClass(element, staggerClassName);
              stagger = getElementAnimationDetails(element, staggerCacheKey);
              applyClasses && $$jqLite.removeClass(element, staggerClassName);
            }
            $$jqLite.addClass(element, className);
            var formerData = element.data(NG_ANIMATE_CSS_DATA_KEY) || {};
            var timings = getElementAnimationDetails(element, eventCacheKey);
            var transitionDuration = timings.transitionDuration;
            var animationDuration = timings.animationDuration;
            if (structural && transitionDuration === 0 && animationDuration === 0) {
              $$jqLite.removeClass(element, className);
              return false;
            }
            var blockTransition = styles || (structural && transitionDuration > 0);
            var blockAnimation = animationDuration > 0 && stagger.animationDelay > 0 && stagger.animationDuration === 0;
            var closeAnimationFns = formerData.closeAnimationFns || [];
            element.data(NG_ANIMATE_CSS_DATA_KEY, {
              stagger: stagger,
              cacheKey: eventCacheKey,
              running: formerData.running || 0,
              itemIndex: itemIndex,
              blockTransition: blockTransition,
              closeAnimationFns: closeAnimationFns
            });
            var node = extractElementNode(element);
            if (blockTransition) {
              blockTransitions(node, true);
              if (styles) {
                element.css(styles);
              }
            }
            if (blockAnimation) {
              blockAnimations(node, true);
            }
            return true;
          }
          function animateRun(animationEvent, element, className, activeAnimationComplete, styles) {
            var node = extractElementNode(element);
            var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
            if (node.getAttribute('class').indexOf(className) == -1 || !elementData) {
              activeAnimationComplete();
              return;
            }
            var activeClassName = '';
            var pendingClassName = '';
            forEach(className.split(' '), function(klass, i) {
              var prefix = (i > 0 ? ' ' : '') + klass;
              activeClassName += prefix + '-active';
              pendingClassName += prefix + '-pending';
            });
            var style = '';
            var appliedStyles = [];
            var itemIndex = elementData.itemIndex;
            var stagger = elementData.stagger;
            var staggerTime = 0;
            if (itemIndex > 0) {
              var transitionStaggerDelay = 0;
              if (stagger.transitionDelay > 0 && stagger.transitionDuration === 0) {
                transitionStaggerDelay = stagger.transitionDelay * itemIndex;
              }
              var animationStaggerDelay = 0;
              if (stagger.animationDelay > 0 && stagger.animationDuration === 0) {
                animationStaggerDelay = stagger.animationDelay * itemIndex;
                appliedStyles.push(CSS_PREFIX + 'animation-play-state');
              }
              staggerTime = Math.round(Math.max(transitionStaggerDelay, animationStaggerDelay) * 100) / 100;
            }
            if (!staggerTime) {
              $$jqLite.addClass(element, activeClassName);
              if (elementData.blockTransition) {
                blockTransitions(node, false);
              }
            }
            var eventCacheKey = elementData.cacheKey + ' ' + activeClassName;
            var timings = getElementAnimationDetails(element, eventCacheKey);
            var maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
            if (maxDuration === 0) {
              $$jqLite.removeClass(element, activeClassName);
              animateClose(element, className);
              activeAnimationComplete();
              return;
            }
            if (!staggerTime && styles) {
              if (!timings.transitionDuration) {
                element.css('transition', timings.animationDuration + 's linear all');
                appliedStyles.push('transition');
              }
              element.css(styles);
            }
            var maxDelay = Math.max(timings.transitionDelay, timings.animationDelay);
            var maxDelayTime = maxDelay * ONE_SECOND;
            if (appliedStyles.length > 0) {
              var oldStyle = node.getAttribute('style') || '';
              if (oldStyle.charAt(oldStyle.length - 1) !== ';') {
                oldStyle += ';';
              }
              node.setAttribute('style', oldStyle + ' ' + style);
            }
            var startTime = Date.now();
            var css3AnimationEvents = ANIMATIONEND_EVENT + ' ' + TRANSITIONEND_EVENT;
            var animationTime = (maxDelay + maxDuration) * CLOSING_TIME_BUFFER;
            var totalTime = (staggerTime + animationTime) * ONE_SECOND;
            var staggerTimeout;
            if (staggerTime > 0) {
              $$jqLite.addClass(element, pendingClassName);
              staggerTimeout = $timeout(function() {
                staggerTimeout = null;
                if (timings.transitionDuration > 0) {
                  blockTransitions(node, false);
                }
                if (timings.animationDuration > 0) {
                  blockAnimations(node, false);
                }
                $$jqLite.addClass(element, activeClassName);
                $$jqLite.removeClass(element, pendingClassName);
                if (styles) {
                  if (timings.transitionDuration === 0) {
                    element.css('transition', timings.animationDuration + 's linear all');
                  }
                  element.css(styles);
                  appliedStyles.push('transition');
                }
              }, staggerTime * ONE_SECOND, false);
            }
            element.on(css3AnimationEvents, onAnimationProgress);
            elementData.closeAnimationFns.push(function() {
              onEnd();
              activeAnimationComplete();
            });
            elementData.running++;
            animationCloseHandler(element, totalTime);
            return onEnd;
            function onEnd() {
              element.off(css3AnimationEvents, onAnimationProgress);
              $$jqLite.removeClass(element, activeClassName);
              $$jqLite.removeClass(element, pendingClassName);
              if (staggerTimeout) {
                $timeout.cancel(staggerTimeout);
              }
              animateClose(element, className);
              var node = extractElementNode(element);
              for (var i in appliedStyles) {
                node.style.removeProperty(appliedStyles[i]);
              }
            }
            function onAnimationProgress(event) {
              event.stopPropagation();
              var ev = event.originalEvent || event;
              var timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now();
              var elapsedTime = parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));
              if (Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration) {
                activeAnimationComplete();
              }
            }
          }
          function blockTransitions(node, bool) {
            node.style[TRANSITION_PROP + PROPERTY_KEY] = bool ? 'none' : '';
          }
          function blockAnimations(node, bool) {
            node.style[ANIMATION_PROP + ANIMATION_PLAYSTATE_KEY] = bool ? 'paused' : '';
          }
          function animateBefore(animationEvent, element, className, styles) {
            if (animateSetup(animationEvent, element, className, styles)) {
              return function(cancelled) {
                cancelled && animateClose(element, className);
              };
            }
          }
          function animateAfter(animationEvent, element, className, afterAnimationComplete, styles) {
            if (element.data(NG_ANIMATE_CSS_DATA_KEY)) {
              return animateRun(animationEvent, element, className, afterAnimationComplete, styles);
            } else {
              animateClose(element, className);
              afterAnimationComplete();
            }
          }
          function animate(animationEvent, element, className, animationComplete, options) {
            var preReflowCancellation = animateBefore(animationEvent, element, className, options.from);
            if (!preReflowCancellation) {
              clearCacheAfterReflow();
              animationComplete();
              return;
            }
            var cancel = preReflowCancellation;
            afterReflow(element, function() {
              cancel = animateAfter(animationEvent, element, className, animationComplete, options.to);
            });
            return function(cancelled) {
              (cancel || noop)(cancelled);
            };
          }
          function animateClose(element, className) {
            $$jqLite.removeClass(element, className);
            var data = element.data(NG_ANIMATE_CSS_DATA_KEY);
            if (data) {
              if (data.running) {
                data.running--;
              }
              if (!data.running || data.running === 0) {
                element.removeData(NG_ANIMATE_CSS_DATA_KEY);
              }
            }
          }
          return {
            animate: function(element, className, from, to, animationCompleted, options) {
              options = options || {};
              options.from = from;
              options.to = to;
              return animate('animate', element, className, animationCompleted, options);
            },
            enter: function(element, animationCompleted, options) {
              options = options || {};
              return animate('enter', element, 'ng-enter', animationCompleted, options);
            },
            leave: function(element, animationCompleted, options) {
              options = options || {};
              return animate('leave', element, 'ng-leave', animationCompleted, options);
            },
            move: function(element, animationCompleted, options) {
              options = options || {};
              return animate('move', element, 'ng-move', animationCompleted, options);
            },
            beforeSetClass: function(element, add, remove, animationCompleted, options) {
              options = options || {};
              var className = suffixClasses(remove, '-remove') + ' ' + suffixClasses(add, '-add');
              var cancellationMethod = animateBefore('setClass', element, className, options.from);
              if (cancellationMethod) {
                afterReflow(element, animationCompleted);
                return cancellationMethod;
              }
              clearCacheAfterReflow();
              animationCompleted();
            },
            beforeAddClass: function(element, className, animationCompleted, options) {
              options = options || {};
              var cancellationMethod = animateBefore('addClass', element, suffixClasses(className, '-add'), options.from);
              if (cancellationMethod) {
                afterReflow(element, animationCompleted);
                return cancellationMethod;
              }
              clearCacheAfterReflow();
              animationCompleted();
            },
            beforeRemoveClass: function(element, className, animationCompleted, options) {
              options = options || {};
              var cancellationMethod = animateBefore('removeClass', element, suffixClasses(className, '-remove'), options.from);
              if (cancellationMethod) {
                afterReflow(element, animationCompleted);
                return cancellationMethod;
              }
              clearCacheAfterReflow();
              animationCompleted();
            },
            setClass: function(element, add, remove, animationCompleted, options) {
              options = options || {};
              remove = suffixClasses(remove, '-remove');
              add = suffixClasses(add, '-add');
              var className = remove + ' ' + add;
              return animateAfter('setClass', element, className, animationCompleted, options.to);
            },
            addClass: function(element, className, animationCompleted, options) {
              options = options || {};
              return animateAfter('addClass', element, suffixClasses(className, '-add'), animationCompleted, options.to);
            },
            removeClass: function(element, className, animationCompleted, options) {
              options = options || {};
              return animateAfter('removeClass', element, suffixClasses(className, '-remove'), animationCompleted, options.to);
            }
          };
          function suffixClasses(classes, suffix) {
            var className = '';
            classes = isArray(classes) ? classes : classes.split(/\s+/);
            forEach(classes, function(klass, i) {
              if (klass && klass.length > 0) {
                className += (i > 0 ? ' ' : '') + klass + suffix;
              }
            });
            return className;
          }
        }]);
      }]);
    })(window, window.angular);
  }).call(System.global);
  return System.get("@@global-helpers").retrieveGlobal(__module.id, false);
});



System.register("github:angular/bower-angular-sanitize@1.3.8/angular-sanitize", ["angular"], false, function(__require, __exports, __module) {
  System.get("@@global-helpers").prepareGlobal(__module.id, ["angular"]);
  (function() {
    "format global";
    "deps angular";
    (function(window, angular, undefined) {
      'use strict';
      var $sanitizeMinErr = angular.$$minErr('$sanitize');
      function $SanitizeProvider() {
        this.$get = ['$$sanitizeUri', function($$sanitizeUri) {
          return function(html) {
            var buf = [];
            htmlParser(html, htmlSanitizeWriter(buf, function(uri, isImage) {
              return !/^unsafe/.test($$sanitizeUri(uri, isImage));
            }));
            return buf.join('');
          };
        }];
      }
      function sanitizeText(chars) {
        var buf = [];
        var writer = htmlSanitizeWriter(buf, angular.noop);
        writer.chars(chars);
        return buf.join('');
      }
      var START_TAG_REGEXP = /^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/,
          END_TAG_REGEXP = /^<\/\s*([\w:-]+)[^>]*>/,
          ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
          BEGIN_TAG_REGEXP = /^</,
          BEGING_END_TAGE_REGEXP = /^<\//,
          COMMENT_REGEXP = /<!--(.*?)-->/g,
          DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
          CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
          SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
          NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;
      var voidElements = makeMap("area,br,col,hr,img,wbr");
      var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
          optionalEndTagInlineElements = makeMap("rp,rt"),
          optionalEndTagElements = angular.extend({}, optionalEndTagInlineElements, optionalEndTagBlockElements);
      var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap("address,article," + "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," + "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));
      var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," + "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," + "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));
      var svgElements = makeMap("animate,animateColor,animateMotion,animateTransform,circle,defs," + "desc,ellipse,font-face,font-face-name,font-face-src,g,glyph,hkern,image,linearGradient," + "line,marker,metadata,missing-glyph,mpath,path,polygon,polyline,radialGradient,rect,set," + "stop,svg,switch,text,title,tspan,use");
      var specialElements = makeMap("script,style");
      var validElements = angular.extend({}, voidElements, blockElements, inlineElements, optionalEndTagElements, svgElements);
      var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap,xlink:href");
      var htmlAttrs = makeMap('abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,' + 'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,' + 'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,' + 'scope,scrolling,shape,size,span,start,summary,target,title,type,' + 'valign,value,vspace,width');
      var svgAttrs = makeMap('accent-height,accumulate,additive,alphabetic,arabic-form,ascent,' + 'attributeName,attributeType,baseProfile,bbox,begin,by,calcMode,cap-height,class,color,' + 'color-rendering,content,cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,' + 'font-size,font-stretch,font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,' + 'gradientUnits,hanging,height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,' + 'keySplines,keyTimes,lang,marker-end,marker-mid,marker-start,markerHeight,markerUnits,' + 'markerWidth,mathematical,max,min,offset,opacity,orient,origin,overline-position,' + 'overline-thickness,panose-1,path,pathLength,points,preserveAspectRatio,r,refX,refY,' + 'repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,' + 'stemv,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,stroke,' + 'stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,' + 'stroke-opacity,stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,' + 'underline-position,underline-thickness,unicode,unicode-range,units-per-em,values,version,' + 'viewBox,visibility,width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,' + 'xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,' + 'zoomAndPan');
      var validAttrs = angular.extend({}, uriAttrs, svgAttrs, htmlAttrs);
      function makeMap(str) {
        var obj = {},
            items = str.split(','),
            i;
        for (i = 0; i < items.length; i++)
          obj[items[i]] = true;
        return obj;
      }
      function htmlParser(html, handler) {
        if (typeof html !== 'string') {
          if (html === null || typeof html === 'undefined') {
            html = '';
          } else {
            html = '' + html;
          }
        }
        var index,
            chars,
            match,
            stack = [],
            last = html,
            text;
        stack.last = function() {
          return stack[stack.length - 1];
        };
        while (html) {
          text = '';
          chars = true;
          if (!stack.last() || !specialElements[stack.last()]) {
            if (html.indexOf("<!--") === 0) {
              index = html.indexOf("--", 4);
              if (index >= 0 && html.lastIndexOf("-->", index) === index) {
                if (handler.comment)
                  handler.comment(html.substring(4, index));
                html = html.substring(index + 3);
                chars = false;
              }
            } else if (DOCTYPE_REGEXP.test(html)) {
              match = html.match(DOCTYPE_REGEXP);
              if (match) {
                html = html.replace(match[0], '');
                chars = false;
              }
            } else if (BEGING_END_TAGE_REGEXP.test(html)) {
              match = html.match(END_TAG_REGEXP);
              if (match) {
                html = html.substring(match[0].length);
                match[0].replace(END_TAG_REGEXP, parseEndTag);
                chars = false;
              }
            } else if (BEGIN_TAG_REGEXP.test(html)) {
              match = html.match(START_TAG_REGEXP);
              if (match) {
                if (match[4]) {
                  html = html.substring(match[0].length);
                  match[0].replace(START_TAG_REGEXP, parseStartTag);
                }
                chars = false;
              } else {
                text += '<';
                html = html.substring(1);
              }
            }
            if (chars) {
              index = html.indexOf("<");
              text += index < 0 ? html : html.substring(0, index);
              html = index < 0 ? "" : html.substring(index);
              if (handler.chars)
                handler.chars(decodeEntities(text));
            }
          } else {
            html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'), function(all, text) {
              text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");
              if (handler.chars)
                handler.chars(decodeEntities(text));
              return "";
            });
            parseEndTag("", stack.last());
          }
          if (html == last) {
            throw $sanitizeMinErr('badparse', "The sanitizer was unable to parse the following block " + "of html: {0}", html);
          }
          last = html;
        }
        parseEndTag();
        function parseStartTag(tag, tagName, rest, unary) {
          tagName = angular.lowercase(tagName);
          if (blockElements[tagName]) {
            while (stack.last() && inlineElements[stack.last()]) {
              parseEndTag("", stack.last());
            }
          }
          if (optionalEndTagElements[tagName] && stack.last() == tagName) {
            parseEndTag("", tagName);
          }
          unary = voidElements[tagName] || !!unary;
          if (!unary)
            stack.push(tagName);
          var attrs = {};
          rest.replace(ATTR_REGEXP, function(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
            var value = doubleQuotedValue || singleQuotedValue || unquotedValue || '';
            attrs[name] = decodeEntities(value);
          });
          if (handler.start)
            handler.start(tagName, attrs, unary);
        }
        function parseEndTag(tag, tagName) {
          var pos = 0,
              i;
          tagName = angular.lowercase(tagName);
          if (tagName)
            for (pos = stack.length - 1; pos >= 0; pos--)
              if (stack[pos] == tagName)
                break;
          if (pos >= 0) {
            for (i = stack.length - 1; i >= pos; i--)
              if (handler.end)
                handler.end(stack[i]);
            stack.length = pos;
          }
        }
      }
      var hiddenPre = document.createElement("pre");
      var spaceRe = /^(\s*)([\s\S]*?)(\s*)$/;
      function decodeEntities(value) {
        if (!value) {
          return '';
        }
        var parts = spaceRe.exec(value);
        var spaceBefore = parts[1];
        var spaceAfter = parts[3];
        var content = parts[2];
        if (content) {
          hiddenPre.innerHTML = content.replace(/</g, "&lt;");
          content = 'textContent' in hiddenPre ? hiddenPre.textContent : hiddenPre.innerText;
        }
        return spaceBefore + content + spaceAfter;
      }
      function encodeEntities(value) {
        return value.replace(/&/g, '&amp;').replace(SURROGATE_PAIR_REGEXP, function(value) {
          var hi = value.charCodeAt(0);
          var low = value.charCodeAt(1);
          return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
        }).replace(NON_ALPHANUMERIC_REGEXP, function(value) {
          return '&#' + value.charCodeAt(0) + ';';
        }).replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      function htmlSanitizeWriter(buf, uriValidator) {
        var ignore = false;
        var out = angular.bind(buf, buf.push);
        return {
          start: function(tag, attrs, unary) {
            tag = angular.lowercase(tag);
            if (!ignore && specialElements[tag]) {
              ignore = tag;
            }
            if (!ignore && validElements[tag] === true) {
              out('<');
              out(tag);
              angular.forEach(attrs, function(value, key) {
                var lkey = angular.lowercase(key);
                var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
                if (validAttrs[lkey] === true && (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
                  out(' ');
                  out(key);
                  out('="');
                  out(encodeEntities(value));
                  out('"');
                }
              });
              out(unary ? '/>' : '>');
            }
          },
          end: function(tag) {
            tag = angular.lowercase(tag);
            if (!ignore && validElements[tag] === true) {
              out('</');
              out(tag);
              out('>');
            }
            if (tag == ignore) {
              ignore = false;
            }
          },
          chars: function(chars) {
            if (!ignore) {
              out(encodeEntities(chars));
            }
          }
        };
      }
      angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);
      angular.module('ngSanitize').filter('linky', ['$sanitize', function($sanitize) {
        var LINKY_URL_REGEXP = /((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"”’]/,
            MAILTO_REGEXP = /^mailto:/;
        return function(text, target) {
          if (!text)
            return text;
          var match;
          var raw = text;
          var html = [];
          var url;
          var i;
          while ((match = raw.match(LINKY_URL_REGEXP))) {
            url = match[0];
            if (!match[2] && !match[4]) {
              url = (match[3] ? 'http://' : 'mailto:') + url;
            }
            i = match.index;
            addText(raw.substr(0, i));
            addLink(url, match[0].replace(MAILTO_REGEXP, ''));
            raw = raw.substring(i + match[0].length);
          }
          addText(raw);
          return $sanitize(html.join(''));
          function addText(text) {
            if (!text) {
              return;
            }
            html.push(sanitizeText(text));
          }
          function addLink(url, text) {
            html.push('<a ');
            if (angular.isDefined(target)) {
              html.push('target="', target, '" ');
            }
            html.push('href="', url.replace(/"/g, '&quot;'), '">');
            addText(text);
            html.push('</a>');
          }
        };
      }]);
    })(window, window.angular);
  }).call(System.global);
  return System.get("@@global-helpers").retrieveGlobal(__module.id, false);
});



System.register("github:angular-ui/ui-router@0.2.10/release/angular-ui-router", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'ui.router';
  }
  (function(window, angular, undefined) {
    'use strict';
    var isDefined = angular.isDefined,
        isFunction = angular.isFunction,
        isString = angular.isString,
        isObject = angular.isObject,
        isArray = angular.isArray,
        forEach = angular.forEach,
        extend = angular.extend,
        copy = angular.copy;
    function inherit(parent, extra) {
      return extend(new (extend(function() {}, {prototype: parent}))(), extra);
    }
    function merge(dst) {
      forEach(arguments, function(obj) {
        if (obj !== dst) {
          forEach(obj, function(value, key) {
            if (!dst.hasOwnProperty(key))
              dst[key] = value;
          });
        }
      });
      return dst;
    }
    function ancestors(first, second) {
      var path = [];
      for (var n in first.path) {
        if (first.path[n] !== second.path[n])
          break;
        path.push(first.path[n]);
      }
      return path;
    }
    function keys(object) {
      if (Object.keys) {
        return Object.keys(object);
      }
      var result = [];
      angular.forEach(object, function(val, key) {
        result.push(key);
      });
      return result;
    }
    function arraySearch(array, value) {
      if (Array.prototype.indexOf) {
        return array.indexOf(value, Number(arguments[2]) || 0);
      }
      var len = array.length >>> 0,
          from = Number(arguments[2]) || 0;
      from = (from < 0) ? Math.ceil(from) : Math.floor(from);
      if (from < 0)
        from += len;
      for (; from < len; from++) {
        if (from in array && array[from] === value)
          return from;
      }
      return -1;
    }
    function inheritParams(currentParams, newParams, $current, $to) {
      var parents = ancestors($current, $to),
          parentParams,
          inherited = {},
          inheritList = [];
      for (var i in parents) {
        if (!parents[i].params || !parents[i].params.length)
          continue;
        parentParams = parents[i].params;
        for (var j in parentParams) {
          if (arraySearch(inheritList, parentParams[j]) >= 0)
            continue;
          inheritList.push(parentParams[j]);
          inherited[parentParams[j]] = currentParams[parentParams[j]];
        }
      }
      return extend({}, inherited, newParams);
    }
    function normalize(keys, values) {
      var normalized = {};
      forEach(keys, function(name) {
        var value = values[name];
        normalized[name] = (value != null) ? String(value) : null;
      });
      return normalized;
    }
    function equalForKeys(a, b, keys) {
      if (!keys) {
        keys = [];
        for (var n in a)
          keys.push(n);
      }
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (a[k] != b[k])
          return false;
      }
      return true;
    }
    function filterByKeys(keys, values) {
      var filtered = {};
      forEach(keys, function(name) {
        filtered[name] = values[name];
      });
      return filtered;
    }
    angular.module('ui.router.util', ['ng']);
    angular.module('ui.router.router', ['ui.router.util']);
    angular.module('ui.router.state', ['ui.router.router', 'ui.router.util']);
    angular.module('ui.router', ['ui.router.state']);
    angular.module('ui.router.compat', ['ui.router']);
    $Resolve.$inject = ['$q', '$injector'];
    function $Resolve($q, $injector) {
      var VISIT_IN_PROGRESS = 1,
          VISIT_DONE = 2,
          NOTHING = {},
          NO_DEPENDENCIES = [],
          NO_LOCALS = NOTHING,
          NO_PARENT = extend($q.when(NOTHING), {
            $$promises: NOTHING,
            $$values: NOTHING
          });
      this.study = function(invocables) {
        if (!isObject(invocables))
          throw new Error("'invocables' must be an object");
        var plan = [],
            cycle = [],
            visited = {};
        function visit(value, key) {
          if (visited[key] === VISIT_DONE)
            return;
          cycle.push(key);
          if (visited[key] === VISIT_IN_PROGRESS) {
            cycle.splice(0, cycle.indexOf(key));
            throw new Error("Cyclic dependency: " + cycle.join(" -> "));
          }
          visited[key] = VISIT_IN_PROGRESS;
          if (isString(value)) {
            plan.push(key, [function() {
              return $injector.get(value);
            }], NO_DEPENDENCIES);
          } else {
            var params = $injector.annotate(value);
            forEach(params, function(param) {
              if (param !== key && invocables.hasOwnProperty(param))
                visit(invocables[param], param);
            });
            plan.push(key, value, params);
          }
          cycle.pop();
          visited[key] = VISIT_DONE;
        }
        forEach(invocables, visit);
        invocables = cycle = visited = null;
        function isResolve(value) {
          return isObject(value) && value.then && value.$$promises;
        }
        return function(locals, parent, self) {
          if (isResolve(locals) && self === undefined) {
            self = parent;
            parent = locals;
            locals = null;
          }
          if (!locals)
            locals = NO_LOCALS;
          else if (!isObject(locals)) {
            throw new Error("'locals' must be an object");
          }
          if (!parent)
            parent = NO_PARENT;
          else if (!isResolve(parent)) {
            throw new Error("'parent' must be a promise returned by $resolve.resolve()");
          }
          var resolution = $q.defer(),
              result = resolution.promise,
              promises = result.$$promises = {},
              values = extend({}, locals),
              wait = 1 + plan.length / 3,
              merged = false;
          function done() {
            if (!--wait) {
              if (!merged)
                merge(values, parent.$$values);
              result.$$values = values;
              result.$$promises = true;
              resolution.resolve(values);
            }
          }
          function fail(reason) {
            result.$$failure = reason;
            resolution.reject(reason);
          }
          if (isDefined(parent.$$failure)) {
            fail(parent.$$failure);
            return result;
          }
          if (parent.$$values) {
            merged = merge(values, parent.$$values);
            done();
          } else {
            extend(promises, parent.$$promises);
            parent.then(done, fail);
          }
          for (var i = 0,
              ii = plan.length; i < ii; i += 3) {
            if (locals.hasOwnProperty(plan[i]))
              done();
            else
              invoke(plan[i], plan[i + 1], plan[i + 2]);
          }
          function invoke(key, invocable, params) {
            var invocation = $q.defer(),
                waitParams = 0;
            function onfailure(reason) {
              invocation.reject(reason);
              fail(reason);
            }
            forEach(params, function(dep) {
              if (promises.hasOwnProperty(dep) && !locals.hasOwnProperty(dep)) {
                waitParams++;
                promises[dep].then(function(result) {
                  values[dep] = result;
                  if (!(--waitParams))
                    proceed();
                }, onfailure);
              }
            });
            if (!waitParams)
              proceed();
            function proceed() {
              if (isDefined(result.$$failure))
                return;
              try {
                invocation.resolve($injector.invoke(invocable, self, values));
                invocation.promise.then(function(result) {
                  values[key] = result;
                  done();
                }, onfailure);
              } catch (e) {
                onfailure(e);
              }
            }
            promises[key] = invocation.promise;
          }
          return result;
        };
      };
      this.resolve = function(invocables, locals, parent, self) {
        return this.study(invocables)(locals, parent, self);
      };
    }
    angular.module('ui.router.util').service('$resolve', $Resolve);
    $TemplateFactory.$inject = ['$http', '$templateCache', '$injector'];
    function $TemplateFactory($http, $templateCache, $injector) {
      this.fromConfig = function(config, params, locals) {
        return (isDefined(config.template) ? this.fromString(config.template, params) : isDefined(config.templateUrl) ? this.fromUrl(config.templateUrl, params) : isDefined(config.templateProvider) ? this.fromProvider(config.templateProvider, params, locals) : null);
      };
      this.fromString = function(template, params) {
        return isFunction(template) ? template(params) : template;
      };
      this.fromUrl = function(url, params) {
        if (isFunction(url))
          url = url(params);
        if (url == null)
          return null;
        else
          return $http.get(url, {cache: $templateCache}).then(function(response) {
            return response.data;
          });
      };
      this.fromProvider = function(provider, params, locals) {
        return $injector.invoke(provider, null, locals || {params: params});
      };
    }
    angular.module('ui.router.util').service('$templateFactory', $TemplateFactory);
    function UrlMatcher(pattern) {
      var placeholder = /([:*])(\w+)|\{(\w+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
          names = {},
          compiled = '^',
          last = 0,
          m,
          segments = this.segments = [],
          params = this.params = [];
      function addParameter(id) {
        if (!/^\w+(-+\w+)*$/.test(id))
          throw new Error("Invalid parameter name '" + id + "' in pattern '" + pattern + "'");
        if (names[id])
          throw new Error("Duplicate parameter name '" + id + "' in pattern '" + pattern + "'");
        names[id] = true;
        params.push(id);
      }
      function quoteRegExp(string) {
        return string.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");
      }
      this.source = pattern;
      var id,
          regexp,
          segment;
      while ((m = placeholder.exec(pattern))) {
        id = m[2] || m[3];
        regexp = m[4] || (m[1] == '*' ? '.*' : '[^/]*');
        segment = pattern.substring(last, m.index);
        if (segment.indexOf('?') >= 0)
          break;
        compiled += quoteRegExp(segment) + '(' + regexp + ')';
        addParameter(id);
        segments.push(segment);
        last = placeholder.lastIndex;
      }
      segment = pattern.substring(last);
      var i = segment.indexOf('?');
      if (i >= 0) {
        var search = this.sourceSearch = segment.substring(i);
        segment = segment.substring(0, i);
        this.sourcePath = pattern.substring(0, last + i);
        forEach(search.substring(1).split(/[&?]/), addParameter);
      } else {
        this.sourcePath = pattern;
        this.sourceSearch = '';
      }
      compiled += quoteRegExp(segment) + '$';
      segments.push(segment);
      this.regexp = new RegExp(compiled);
      this.prefix = segments[0];
    }
    UrlMatcher.prototype.concat = function(pattern) {
      return new UrlMatcher(this.sourcePath + pattern + this.sourceSearch);
    };
    UrlMatcher.prototype.toString = function() {
      return this.source;
    };
    UrlMatcher.prototype.exec = function(path, searchParams) {
      var m = this.regexp.exec(path);
      if (!m)
        return null;
      var params = this.params,
          nTotal = params.length,
          nPath = this.segments.length - 1,
          values = {},
          i;
      if (nPath !== m.length - 1)
        throw new Error("Unbalanced capture group in route '" + this.source + "'");
      for (i = 0; i < nPath; i++)
        values[params[i]] = m[i + 1];
      for (; i < nTotal; i++)
        values[params[i]] = searchParams[params[i]];
      return values;
    };
    UrlMatcher.prototype.parameters = function() {
      return this.params;
    };
    UrlMatcher.prototype.format = function(values) {
      var segments = this.segments,
          params = this.params;
      if (!values)
        return segments.join('');
      var nPath = segments.length - 1,
          nTotal = params.length,
          result = segments[0],
          i,
          search,
          value;
      for (i = 0; i < nPath; i++) {
        value = values[params[i]];
        if (value != null)
          result += encodeURIComponent(value);
        result += segments[i + 1];
      }
      for (; i < nTotal; i++) {
        value = values[params[i]];
        if (value != null) {
          result += (search ? '&' : '?') + params[i] + '=' + encodeURIComponent(value);
          search = true;
        }
      }
      return result;
    };
    function $UrlMatcherFactory() {
      this.compile = function(pattern) {
        return new UrlMatcher(pattern);
      };
      this.isMatcher = function(o) {
        return isObject(o) && isFunction(o.exec) && isFunction(o.format) && isFunction(o.concat);
      };
      this.$get = function() {
        return this;
      };
    }
    angular.module('ui.router.util').provider('$urlMatcherFactory', $UrlMatcherFactory);
    $UrlRouterProvider.$inject = ['$urlMatcherFactoryProvider'];
    function $UrlRouterProvider($urlMatcherFactory) {
      var rules = [],
          otherwise = null;
      function regExpPrefix(re) {
        var prefix = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(re.source);
        return (prefix != null) ? prefix[1].replace(/\\(.)/g, "$1") : '';
      }
      function interpolate(pattern, match) {
        return pattern.replace(/\$(\$|\d{1,2})/, function(m, what) {
          return match[what === '$' ? 0 : Number(what)];
        });
      }
      this.rule = function(rule) {
        if (!isFunction(rule))
          throw new Error("'rule' must be a function");
        rules.push(rule);
        return this;
      };
      this.otherwise = function(rule) {
        if (isString(rule)) {
          var redirect = rule;
          rule = function() {
            return redirect;
          };
        } else if (!isFunction(rule))
          throw new Error("'rule' must be a function");
        otherwise = rule;
        return this;
      };
      function handleIfMatch($injector, handler, match) {
        if (!match)
          return false;
        var result = $injector.invoke(handler, handler, {$match: match});
        return isDefined(result) ? result : true;
      }
      this.when = function(what, handler) {
        var redirect,
            handlerIsString = isString(handler);
        if (isString(what))
          what = $urlMatcherFactory.compile(what);
        if (!handlerIsString && !isFunction(handler) && !isArray(handler))
          throw new Error("invalid 'handler' in when()");
        var strategies = {
          matcher: function(what, handler) {
            if (handlerIsString) {
              redirect = $urlMatcherFactory.compile(handler);
              handler = ['$match', function($match) {
                return redirect.format($match);
              }];
            }
            return extend(function($injector, $location) {
              return handleIfMatch($injector, handler, what.exec($location.path(), $location.search()));
            }, {prefix: isString(what.prefix) ? what.prefix : ''});
          },
          regex: function(what, handler) {
            if (what.global || what.sticky)
              throw new Error("when() RegExp must not be global or sticky");
            if (handlerIsString) {
              redirect = handler;
              handler = ['$match', function($match) {
                return interpolate(redirect, $match);
              }];
            }
            return extend(function($injector, $location) {
              return handleIfMatch($injector, handler, what.exec($location.path()));
            }, {prefix: regExpPrefix(what)});
          }
        };
        var check = {
          matcher: $urlMatcherFactory.isMatcher(what),
          regex: what instanceof RegExp
        };
        for (var n in check) {
          if (check[n]) {
            return this.rule(strategies[n](what, handler));
          }
        }
        throw new Error("invalid 'what' in when()");
      };
      this.$get = ['$location', '$rootScope', '$injector', function($location, $rootScope, $injector) {
        function update(evt) {
          if (evt && evt.defaultPrevented)
            return;
          function check(rule) {
            var handled = rule($injector, $location);
            if (handled) {
              if (isString(handled))
                $location.replace().url(handled);
              return true;
            }
            return false;
          }
          var n = rules.length,
              i;
          for (i = 0; i < n; i++) {
            if (check(rules[i]))
              return;
          }
          if (otherwise)
            check(otherwise);
        }
        $rootScope.$on('$locationChangeSuccess', update);
        return {sync: function() {
            update();
          }};
      }];
    }
    angular.module('ui.router.router').provider('$urlRouter', $UrlRouterProvider);
    $StateProvider.$inject = ['$urlRouterProvider', '$urlMatcherFactoryProvider', '$locationProvider'];
    function $StateProvider($urlRouterProvider, $urlMatcherFactory, $locationProvider) {
      var root,
          states = {},
          $state,
          queue = {},
          abstractKey = 'abstract';
      var stateBuilder = {
        parent: function(state) {
          if (isDefined(state.parent) && state.parent)
            return findState(state.parent);
          var compositeName = /^(.+)\.[^.]+$/.exec(state.name);
          return compositeName ? findState(compositeName[1]) : root;
        },
        data: function(state) {
          if (state.parent && state.parent.data) {
            state.data = state.self.data = extend({}, state.parent.data, state.data);
          }
          return state.data;
        },
        url: function(state) {
          var url = state.url;
          if (isString(url)) {
            if (url.charAt(0) == '^') {
              return $urlMatcherFactory.compile(url.substring(1));
            }
            return (state.parent.navigable || root).url.concat(url);
          }
          if ($urlMatcherFactory.isMatcher(url) || url == null) {
            return url;
          }
          throw new Error("Invalid url '" + url + "' in state '" + state + "'");
        },
        navigable: function(state) {
          return state.url ? state : (state.parent ? state.parent.navigable : null);
        },
        params: function(state) {
          if (!state.params) {
            return state.url ? state.url.parameters() : state.parent.params;
          }
          if (!isArray(state.params))
            throw new Error("Invalid params in state '" + state + "'");
          if (state.url)
            throw new Error("Both params and url specicified in state '" + state + "'");
          return state.params;
        },
        views: function(state) {
          var views = {};
          forEach(isDefined(state.views) ? state.views : {'': state}, function(view, name) {
            if (name.indexOf('@') < 0)
              name += '@' + state.parent.name;
            views[name] = view;
          });
          return views;
        },
        ownParams: function(state) {
          if (!state.parent) {
            return state.params;
          }
          var paramNames = {};
          forEach(state.params, function(p) {
            paramNames[p] = true;
          });
          forEach(state.parent.params, function(p) {
            if (!paramNames[p]) {
              throw new Error("Missing required parameter '" + p + "' in state '" + state.name + "'");
            }
            paramNames[p] = false;
          });
          var ownParams = [];
          forEach(paramNames, function(own, p) {
            if (own)
              ownParams.push(p);
          });
          return ownParams;
        },
        path: function(state) {
          return state.parent ? state.parent.path.concat(state) : [];
        },
        includes: function(state) {
          var includes = state.parent ? extend({}, state.parent.includes) : {};
          includes[state.name] = true;
          return includes;
        },
        $delegates: {}
      };
      function isRelative(stateName) {
        return stateName.indexOf(".") === 0 || stateName.indexOf("^") === 0;
      }
      function findState(stateOrName, base) {
        var isStr = isString(stateOrName),
            name = isStr ? stateOrName : stateOrName.name,
            path = isRelative(name);
        if (path) {
          if (!base)
            throw new Error("No reference point given for path '" + name + "'");
          var rel = name.split("."),
              i = 0,
              pathLength = rel.length,
              current = base;
          for (; i < pathLength; i++) {
            if (rel[i] === "" && i === 0) {
              current = base;
              continue;
            }
            if (rel[i] === "^") {
              if (!current.parent)
                throw new Error("Path '" + name + "' not valid for state '" + base.name + "'");
              current = current.parent;
              continue;
            }
            break;
          }
          rel = rel.slice(i).join(".");
          name = current.name + (current.name && rel ? "." : "") + rel;
        }
        var state = states[name];
        if (state && (isStr || (!isStr && (state === stateOrName || state.self === stateOrName)))) {
          return state;
        }
        return undefined;
      }
      function queueState(parentName, state) {
        if (!queue[parentName]) {
          queue[parentName] = [];
        }
        queue[parentName].push(state);
      }
      function registerState(state) {
        state = inherit(state, {
          self: state,
          resolve: state.resolve || {},
          toString: function() {
            return this.name;
          }
        });
        var name = state.name;
        if (!isString(name) || name.indexOf('@') >= 0)
          throw new Error("State must have a valid name");
        if (states.hasOwnProperty(name))
          throw new Error("State '" + name + "'' is already defined");
        var parentName = (name.indexOf('.') !== -1) ? name.substring(0, name.lastIndexOf('.')) : (isString(state.parent)) ? state.parent : '';
        if (parentName && !states[parentName]) {
          return queueState(parentName, state.self);
        }
        for (var key in stateBuilder) {
          if (isFunction(stateBuilder[key]))
            state[key] = stateBuilder[key](state, stateBuilder.$delegates[key]);
        }
        states[name] = state;
        if (!state[abstractKey] && state.url) {
          $urlRouterProvider.when(state.url, ['$match', '$stateParams', function($match, $stateParams) {
            if ($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
              $state.transitionTo(state, $match, {location: false});
            }
          }]);
        }
        if (queue[name]) {
          for (var i = 0; i < queue[name].length; i++) {
            registerState(queue[name][i]);
          }
        }
        return state;
      }
      function isGlob(text) {
        return text.indexOf('*') > -1;
      }
      function doesStateMatchGlob(glob) {
        var globSegments = glob.split('.'),
            segments = $state.$current.name.split('.');
        if (globSegments[0] === '**') {
          segments = segments.slice(segments.indexOf(globSegments[1]));
          segments.unshift('**');
        }
        if (globSegments[globSegments.length - 1] === '**') {
          segments.splice(segments.indexOf(globSegments[globSegments.length - 2]) + 1, Number.MAX_VALUE);
          segments.push('**');
        }
        if (globSegments.length != segments.length) {
          return false;
        }
        for (var i = 0,
            l = globSegments.length; i < l; i++) {
          if (globSegments[i] === '*') {
            segments[i] = '*';
          }
        }
        return segments.join('') === globSegments.join('');
      }
      root = registerState({
        name: '',
        url: '^',
        views: null,
        'abstract': true
      });
      root.navigable = null;
      this.decorator = decorator;
      function decorator(name, func) {
        if (isString(name) && !isDefined(func)) {
          return stateBuilder[name];
        }
        if (!isFunction(func) || !isString(name)) {
          return this;
        }
        if (stateBuilder[name] && !stateBuilder.$delegates[name]) {
          stateBuilder.$delegates[name] = stateBuilder[name];
        }
        stateBuilder[name] = func;
        return this;
      }
      this.state = state;
      function state(name, definition) {
        if (isObject(name))
          definition = name;
        else
          definition.name = name;
        registerState(definition);
        return this;
      }
      this.$get = $get;
      $get.$inject = ['$rootScope', '$q', '$view', '$injector', '$resolve', '$stateParams', '$location', '$urlRouter', '$browser'];
      function $get($rootScope, $q, $view, $injector, $resolve, $stateParams, $location, $urlRouter, $browser) {
        var TransitionSuperseded = $q.reject(new Error('transition superseded'));
        var TransitionPrevented = $q.reject(new Error('transition prevented'));
        var TransitionAborted = $q.reject(new Error('transition aborted'));
        var TransitionFailed = $q.reject(new Error('transition failed'));
        var currentLocation = $location.url();
        var baseHref = $browser.baseHref();
        function syncUrl() {
          if ($location.url() !== currentLocation) {
            $location.url(currentLocation);
            $location.replace();
          }
        }
        root.locals = {
          resolve: null,
          globals: {$stateParams: {}}
        };
        $state = {
          params: {},
          current: root.self,
          $current: root,
          transition: null
        };
        $state.reload = function reload() {
          $state.transitionTo($state.current, $stateParams, {
            reload: true,
            inherit: false,
            notify: false
          });
        };
        $state.go = function go(to, params, options) {
          return this.transitionTo(to, params, extend({
            inherit: true,
            relative: $state.$current
          }, options));
        };
        $state.transitionTo = function transitionTo(to, toParams, options) {
          toParams = toParams || {};
          options = extend({
            location: true,
            inherit: false,
            relative: null,
            notify: true,
            reload: false,
            $retry: false
          }, options || {});
          var from = $state.$current,
              fromParams = $state.params,
              fromPath = from.path;
          var evt,
              toState = findState(to, options.relative);
          if (!isDefined(toState)) {
            var redirect = {
              to: to,
              toParams: toParams,
              options: options
            };
            evt = $rootScope.$broadcast('$stateNotFound', redirect, from.self, fromParams);
            if (evt.defaultPrevented) {
              syncUrl();
              return TransitionAborted;
            }
            if (evt.retry) {
              if (options.$retry) {
                syncUrl();
                return TransitionFailed;
              }
              var retryTransition = $state.transition = $q.when(evt.retry);
              retryTransition.then(function() {
                if (retryTransition !== $state.transition)
                  return TransitionSuperseded;
                redirect.options.$retry = true;
                return $state.transitionTo(redirect.to, redirect.toParams, redirect.options);
              }, function() {
                return TransitionAborted;
              });
              syncUrl();
              return retryTransition;
            }
            to = redirect.to;
            toParams = redirect.toParams;
            options = redirect.options;
            toState = findState(to, options.relative);
            if (!isDefined(toState)) {
              if (options.relative)
                throw new Error("Could not resolve '" + to + "' from state '" + options.relative + "'");
              throw new Error("No such state '" + to + "'");
            }
          }
          if (toState[abstractKey])
            throw new Error("Cannot transition to abstract state '" + to + "'");
          if (options.inherit)
            toParams = inheritParams($stateParams, toParams || {}, $state.$current, toState);
          to = toState;
          var toPath = to.path;
          var keep,
              state,
              locals = root.locals,
              toLocals = [];
          for (keep = 0, state = toPath[keep]; state && state === fromPath[keep] && equalForKeys(toParams, fromParams, state.ownParams) && !options.reload; keep++, state = toPath[keep]) {
            locals = toLocals[keep] = state.locals;
          }
          if (shouldTriggerReload(to, from, locals, options)) {
            if (to.self.reloadOnSearch !== false)
              syncUrl();
            $state.transition = null;
            return $q.when($state.current);
          }
          toParams = normalize(to.params, toParams || {});
          if (options.notify) {
            evt = $rootScope.$broadcast('$stateChangeStart', to.self, toParams, from.self, fromParams);
            if (evt.defaultPrevented) {
              syncUrl();
              return TransitionPrevented;
            }
          }
          var resolved = $q.when(locals);
          for (var l = keep; l < toPath.length; l++, state = toPath[l]) {
            locals = toLocals[l] = inherit(locals);
            resolved = resolveState(state, toParams, state === to, resolved, locals);
          }
          var transition = $state.transition = resolved.then(function() {
            var l,
                entering,
                exiting;
            if ($state.transition !== transition)
              return TransitionSuperseded;
            for (l = fromPath.length - 1; l >= keep; l--) {
              exiting = fromPath[l];
              if (exiting.self.onExit) {
                $injector.invoke(exiting.self.onExit, exiting.self, exiting.locals.globals);
              }
              exiting.locals = null;
            }
            for (l = keep; l < toPath.length; l++) {
              entering = toPath[l];
              entering.locals = toLocals[l];
              if (entering.self.onEnter) {
                $injector.invoke(entering.self.onEnter, entering.self, entering.locals.globals);
              }
            }
            if ($state.transition !== transition)
              return TransitionSuperseded;
            $state.$current = to;
            $state.current = to.self;
            $state.params = toParams;
            copy($state.params, $stateParams);
            $state.transition = null;
            var toNav = to.navigable;
            if (options.location && toNav) {
              $location.url(toNav.url.format(toNav.locals.globals.$stateParams));
              if (options.location === 'replace') {
                $location.replace();
              }
            }
            if (options.notify) {
              $rootScope.$broadcast('$stateChangeSuccess', to.self, toParams, from.self, fromParams);
            }
            currentLocation = $location.url();
            return $state.current;
          }, function(error) {
            if ($state.transition !== transition)
              return TransitionSuperseded;
            $state.transition = null;
            $rootScope.$broadcast('$stateChangeError', to.self, toParams, from.self, fromParams, error);
            syncUrl();
            return $q.reject(error);
          });
          return transition;
        };
        $state.is = function is(stateOrName, params) {
          var state = findState(stateOrName);
          if (!isDefined(state)) {
            return undefined;
          }
          if ($state.$current !== state) {
            return false;
          }
          return isDefined(params) && params !== null ? angular.equals($stateParams, params) : true;
        };
        $state.includes = function includes(stateOrName, params) {
          if (isString(stateOrName) && isGlob(stateOrName)) {
            if (doesStateMatchGlob(stateOrName)) {
              stateOrName = $state.$current.name;
            } else {
              return false;
            }
          }
          var state = findState(stateOrName);
          if (!isDefined(state)) {
            return undefined;
          }
          if (!isDefined($state.$current.includes[state.name])) {
            return false;
          }
          var validParams = true;
          angular.forEach(params, function(value, key) {
            if (!isDefined($stateParams[key]) || $stateParams[key] !== value) {
              validParams = false;
            }
          });
          return validParams;
        };
        $state.href = function href(stateOrName, params, options) {
          options = extend({
            lossy: true,
            inherit: false,
            absolute: false,
            relative: $state.$current
          }, options || {});
          var state = findState(stateOrName, options.relative);
          if (!isDefined(state))
            return null;
          params = inheritParams($stateParams, params || {}, $state.$current, state);
          var nav = (state && options.lossy) ? state.navigable : state;
          var url = (nav && nav.url) ? nav.url.format(normalize(state.params, params || {})) : null;
          if (!$locationProvider.html5Mode() && url) {
            url = "#" + $locationProvider.hashPrefix() + url;
          }
          if (baseHref !== '/') {
            if ($locationProvider.html5Mode()) {
              url = baseHref.slice(0, -1) + url;
            } else if (options.absolute) {
              url = baseHref.slice(1) + url;
            }
          }
          if (options.absolute && url) {
            url = $location.protocol() + '://' + $location.host() + ($location.port() == 80 || $location.port() == 443 ? '' : ':' + $location.port()) + (!$locationProvider.html5Mode() && url ? '/' : '') + url;
          }
          return url;
        };
        $state.get = function(stateOrName, context) {
          if (!isDefined(stateOrName)) {
            var list = [];
            forEach(states, function(state) {
              list.push(state.self);
            });
            return list;
          }
          var state = findState(stateOrName, context);
          return (state && state.self) ? state.self : null;
        };
        function resolveState(state, params, paramsAreFiltered, inherited, dst) {
          var $stateParams = (paramsAreFiltered) ? params : filterByKeys(state.params, params);
          var locals = {$stateParams: $stateParams};
          dst.resolve = $resolve.resolve(state.resolve, locals, dst.resolve, state);
          var promises = [dst.resolve.then(function(globals) {
            dst.globals = globals;
          })];
          if (inherited)
            promises.push(inherited);
          forEach(state.views, function(view, name) {
            var injectables = (view.resolve && view.resolve !== state.resolve ? view.resolve : {});
            injectables.$template = [function() {
              return $view.load(name, {
                view: view,
                locals: locals,
                params: $stateParams,
                notify: false
              }) || '';
            }];
            promises.push($resolve.resolve(injectables, locals, dst.resolve, state).then(function(result) {
              if (isFunction(view.controllerProvider) || isArray(view.controllerProvider)) {
                var injectLocals = angular.extend({}, injectables, locals);
                result.$$controller = $injector.invoke(view.controllerProvider, null, injectLocals);
              } else {
                result.$$controller = view.controller;
              }
              result.$$state = state;
              result.$$controllerAs = view.controllerAs;
              dst[name] = result;
            }));
          });
          return $q.all(promises).then(function(values) {
            return dst;
          });
        }
        return $state;
      }
      function shouldTriggerReload(to, from, locals, options) {
        if (to === from && ((locals === from.locals && !options.reload) || (to.self.reloadOnSearch === false))) {
          return true;
        }
      }
    }
    angular.module('ui.router.state').value('$stateParams', {}).provider('$state', $StateProvider);
    $ViewProvider.$inject = [];
    function $ViewProvider() {
      this.$get = $get;
      $get.$inject = ['$rootScope', '$templateFactory'];
      function $get($rootScope, $templateFactory) {
        return {load: function load(name, options) {
            var result,
                defaults = {
                  template: null,
                  controller: null,
                  view: null,
                  locals: null,
                  notify: true,
                  async: true,
                  params: {}
                };
            options = extend(defaults, options);
            if (options.view) {
              result = $templateFactory.fromConfig(options.view, options.params, options.locals);
            }
            if (result && options.notify) {
              $rootScope.$broadcast('$viewContentLoading', options);
            }
            return result;
          }};
      }
    }
    angular.module('ui.router.state').provider('$view', $ViewProvider);
    function $ViewScrollProvider() {
      var useAnchorScroll = false;
      this.useAnchorScroll = function() {
        useAnchorScroll = true;
      };
      this.$get = ['$anchorScroll', '$timeout', function($anchorScroll, $timeout) {
        if (useAnchorScroll) {
          return $anchorScroll;
        }
        return function($element) {
          $timeout(function() {
            $element[0].scrollIntoView();
          }, 0, false);
        };
      }];
    }
    angular.module('ui.router.state').provider('$uiViewScroll', $ViewScrollProvider);
    $ViewDirective.$inject = ['$state', '$injector', '$uiViewScroll'];
    function $ViewDirective($state, $injector, $uiViewScroll) {
      function getService() {
        return ($injector.has) ? function(service) {
          return $injector.has(service) ? $injector.get(service) : null;
        } : function(service) {
          try {
            return $injector.get(service);
          } catch (e) {
            return null;
          }
        };
      }
      var service = getService(),
          $animator = service('$animator'),
          $animate = service('$animate');
      function getRenderer(attrs, scope) {
        var statics = function() {
          return {
            enter: function(element, target, cb) {
              target.after(element);
              cb();
            },
            leave: function(element, cb) {
              element.remove();
              cb();
            }
          };
        };
        if ($animate) {
          return {
            enter: function(element, target, cb) {
              $animate.enter(element, null, target, cb);
            },
            leave: function(element, cb) {
              $animate.leave(element, cb);
            }
          };
        }
        if ($animator) {
          var animate = $animator && $animator(scope, attrs);
          return {
            enter: function(element, target, cb) {
              animate.enter(element, null, target);
              cb();
            },
            leave: function(element, cb) {
              animate.leave(element);
              cb();
            }
          };
        }
        return statics();
      }
      var directive = {
        restrict: 'ECA',
        terminal: true,
        priority: 400,
        transclude: 'element',
        compile: function(tElement, tAttrs, $transclude) {
          return function(scope, $element, attrs) {
            var previousEl,
                currentEl,
                currentScope,
                latestLocals,
                onloadExp = attrs.onload || '',
                autoScrollExp = attrs.autoscroll,
                renderer = getRenderer(attrs, scope);
            scope.$on('$stateChangeSuccess', function() {
              updateView(false);
            });
            scope.$on('$viewContentLoading', function() {
              updateView(false);
            });
            updateView(true);
            function cleanupLastView() {
              if (previousEl) {
                previousEl.remove();
                previousEl = null;
              }
              if (currentScope) {
                currentScope.$destroy();
                currentScope = null;
              }
              if (currentEl) {
                renderer.leave(currentEl, function() {
                  previousEl = null;
                });
                previousEl = currentEl;
                currentEl = null;
              }
            }
            function updateView(firstTime) {
              var newScope = scope.$new(),
                  name = currentEl && currentEl.data('$uiViewName'),
                  previousLocals = name && $state.$current && $state.$current.locals[name];
              if (!firstTime && previousLocals === latestLocals)
                return;
              var clone = $transclude(newScope, function(clone) {
                renderer.enter(clone, $element, function onUiViewEnter() {
                  if (angular.isDefined(autoScrollExp) && !autoScrollExp || scope.$eval(autoScrollExp)) {
                    $uiViewScroll(clone);
                  }
                });
                cleanupLastView();
              });
              latestLocals = $state.$current.locals[clone.data('$uiViewName')];
              currentEl = clone;
              currentScope = newScope;
              currentScope.$emit('$viewContentLoaded');
              currentScope.$eval(onloadExp);
            }
          };
        }
      };
      return directive;
    }
    $ViewDirectiveFill.$inject = ['$compile', '$controller', '$state'];
    function $ViewDirectiveFill($compile, $controller, $state) {
      return {
        restrict: 'ECA',
        priority: -400,
        compile: function(tElement) {
          var initial = tElement.html();
          return function(scope, $element, attrs) {
            var name = attrs.uiView || attrs.name || '',
                inherited = $element.inheritedData('$uiView');
            if (name.indexOf('@') < 0) {
              name = name + '@' + (inherited ? inherited.state.name : '');
            }
            $element.data('$uiViewName', name);
            var current = $state.$current,
                locals = current && current.locals[name];
            if (!locals) {
              return;
            }
            $element.data('$uiView', {
              name: name,
              state: locals.$$state
            });
            $element.html(locals.$template ? locals.$template : initial);
            var link = $compile($element.contents());
            if (locals.$$controller) {
              locals.$scope = scope;
              var controller = $controller(locals.$$controller, locals);
              if (locals.$$controllerAs) {
                scope[locals.$$controllerAs] = controller;
              }
              $element.data('$ngControllerController', controller);
              $element.children().data('$ngControllerController', controller);
            }
            link(scope);
          };
        }
      };
    }
    angular.module('ui.router.state').directive('uiView', $ViewDirective);
    angular.module('ui.router.state').directive('uiView', $ViewDirectiveFill);
    function parseStateRef(ref) {
      var parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/);
      if (!parsed || parsed.length !== 4)
        throw new Error("Invalid state ref '" + ref + "'");
      return {
        state: parsed[1],
        paramExpr: parsed[3] || null
      };
    }
    function stateContext(el) {
      var stateData = el.parent().inheritedData('$uiView');
      if (stateData && stateData.state && stateData.state.name) {
        return stateData.state;
      }
    }
    $StateRefDirective.$inject = ['$state', '$timeout'];
    function $StateRefDirective($state, $timeout) {
      var allowedOptions = ['location', 'inherit', 'reload'];
      return {
        restrict: 'A',
        require: '?^uiSrefActive',
        link: function(scope, element, attrs, uiSrefActive) {
          var ref = parseStateRef(attrs.uiSref);
          var params = null,
              url = null,
              base = stateContext(element) || $state.$current;
          var isForm = element[0].nodeName === "FORM";
          var attr = isForm ? "action" : "href",
              nav = true;
          var options = {relative: base};
          var optionsOverride = scope.$eval(attrs.uiSrefOpts) || {};
          angular.forEach(allowedOptions, function(option) {
            if (option in optionsOverride) {
              options[option] = optionsOverride[option];
            }
          });
          var update = function(newVal) {
            if (newVal)
              params = newVal;
            if (!nav)
              return;
            var newHref = $state.href(ref.state, params, options);
            if (uiSrefActive) {
              uiSrefActive.$$setStateInfo(ref.state, params);
            }
            if (!newHref) {
              nav = false;
              return false;
            }
            element[0][attr] = newHref;
          };
          if (ref.paramExpr) {
            scope.$watch(ref.paramExpr, function(newVal, oldVal) {
              if (newVal !== params)
                update(newVal);
            }, true);
            params = scope.$eval(ref.paramExpr);
          }
          update();
          if (isForm)
            return;
          element.bind("click", function(e) {
            var button = e.which || e.button;
            if (!(button > 1 || e.ctrlKey || e.metaKey || e.shiftKey || element.attr('target'))) {
              $timeout(function() {
                $state.go(ref.state, params, options);
              });
              e.preventDefault();
            }
          });
        }
      };
    }
    $StateActiveDirective.$inject = ['$state', '$stateParams', '$interpolate'];
    function $StateActiveDirective($state, $stateParams, $interpolate) {
      return {
        restrict: "A",
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
          var state,
              params,
              activeClass;
          activeClass = $interpolate($attrs.uiSrefActive || '', false)($scope);
          this.$$setStateInfo = function(newState, newParams) {
            state = $state.get(newState, stateContext($element));
            params = newParams;
            update();
          };
          $scope.$on('$stateChangeSuccess', update);
          function update() {
            if ($state.$current.self === state && matchesParams()) {
              $element.addClass(activeClass);
            } else {
              $element.removeClass(activeClass);
            }
          }
          function matchesParams() {
            return !params || equalForKeys(params, $stateParams);
          }
        }]
      };
    }
    angular.module('ui.router.state').directive('uiSref', $StateRefDirective).directive('uiSrefActive', $StateActiveDirective);
    $IsStateFilter.$inject = ['$state'];
    function $IsStateFilter($state) {
      return function(state) {
        return $state.is(state);
      };
    }
    $IncludedByStateFilter.$inject = ['$state'];
    function $IncludedByStateFilter($state) {
      return function(state) {
        return $state.includes(state);
      };
    }
    angular.module('ui.router.state').filter('isState', $IsStateFilter).filter('includedByState', $IncludedByStateFilter);
    $RouteProvider.$inject = ['$stateProvider', '$urlRouterProvider'];
    function $RouteProvider($stateProvider, $urlRouterProvider) {
      var routes = [];
      onEnterRoute.$inject = ['$$state'];
      function onEnterRoute($$state) {
        this.locals = $$state.locals.globals;
        this.params = this.locals.$stateParams;
      }
      function onExitRoute() {
        this.locals = null;
        this.params = null;
      }
      this.when = when;
      function when(url, route) {
        if (route.redirectTo != null) {
          var redirect = route.redirectTo,
              handler;
          if (isString(redirect)) {
            handler = redirect;
          } else if (isFunction(redirect)) {
            handler = function(params, $location) {
              return redirect(params, $location.path(), $location.search());
            };
          } else {
            throw new Error("Invalid 'redirectTo' in when()");
          }
          $urlRouterProvider.when(url, handler);
        } else {
          $stateProvider.state(inherit(route, {
            parent: null,
            name: 'route:' + encodeURIComponent(url),
            url: url,
            onEnter: onEnterRoute,
            onExit: onExitRoute
          }));
        }
        routes.push(route);
        return this;
      }
      this.$get = $get;
      $get.$inject = ['$state', '$rootScope', '$routeParams'];
      function $get($state, $rootScope, $routeParams) {
        var $route = {
          routes: routes,
          params: $routeParams,
          current: undefined
        };
        function stateAsRoute(state) {
          return (state.name !== '') ? state : undefined;
        }
        $rootScope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
          $rootScope.$broadcast('$routeChangeStart', stateAsRoute(to), stateAsRoute(from));
        });
        $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
          $route.current = stateAsRoute(to);
          $rootScope.$broadcast('$routeChangeSuccess', stateAsRoute(to), stateAsRoute(from));
          copy(toParams, $route.params);
        });
        $rootScope.$on('$stateChangeError', function(ev, to, toParams, from, fromParams, error) {
          $rootScope.$broadcast('$routeChangeError', stateAsRoute(to), stateAsRoute(from), error);
        });
        return $route;
      }
    }
    angular.module('ui.router.compat').provider('$route', $RouteProvider).directive('ngView', $ViewDirective);
  })(window, window.angular);
  global.define = __define;
  return module.exports;
});



(function() {
function define(){};  define.amd = {};
(function(factory) {
  if (typeof exports === 'object') {
    module.exports = factory(this);
  } else if (typeof define === 'function' && define.amd) {
    System.register("github:ramda/ramda@0.8.0/ramda", [], false, typeof factory == "function" ? factory : function() {
      return factory;
    });
  } else {
    this.R = factory(this);
  }
}(function() {
  'use strict';
  var R = {version: '0.8.0'};
  function _noArgsException() {
    return new TypeError('Function called with no arguments');
  }
  function _slice(args, from, to) {
    switch (arguments.length) {
      case 0:
        throw _noArgsException();
      case 1:
        return _slice(args, 0, args.length);
      case 2:
        return _slice(args, from, args.length);
      default:
        var length = Math.max(0, to - from),
            list = new Array(length),
            idx = -1;
        while (++idx < length) {
          list[idx] = args[from + idx];
        }
        return list;
    }
  }
  function _concat(set1, set2) {
    set1 = set1 || [];
    set2 = set2 || [];
    var idx;
    var len1 = set1.length;
    var len2 = set2.length;
    var result = new Array(len1 + len2);
    idx = -1;
    while (++idx < len1) {
      result[idx] = set1[idx];
    }
    idx = -1;
    while (++idx < len2) {
      result[len1 + idx] = set2[idx];
    }
    return result;
  }
  var toString = Object.prototype.toString;
  var _isArray = Array.isArray || function isArray(val) {
    return val != null && val.length >= 0 && toString.call(val) === '[object Array]';
  };
  var isArrayLike = R.isArrayLike = function isArrayLike(x) {
    if (_isArray(x)) {
      return true;
    }
    if (!x) {
      return false;
    }
    if (typeof x !== 'object') {
      return false;
    }
    if (x instanceof String) {
      return false;
    }
    if (x.nodeType === 1) {
      return !!x.length;
    }
    if (x.length === 0) {
      return true;
    }
    if (x.length > 0) {
      return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
    }
    return false;
  };
  function _curry2(fn) {
    return function(a, b) {
      switch (arguments.length) {
        case 0:
          throw _noArgsException();
        case 1:
          return function(b) {
            return fn(a, b);
          };
        default:
          return fn(a, b);
      }
    };
  }
  function _curry3(fn) {
    return function(a, b, c) {
      switch (arguments.length) {
        case 0:
          throw _noArgsException();
        case 1:
          return _curry2(function(b, c) {
            return fn(a, b, c);
          });
        case 2:
          return function(c) {
            return fn(a, b, c);
          };
        default:
          return fn(a, b, c);
      }
    };
  }
  var __;
  try {
    Object.defineProperty(R, '__', {
      writable: false,
      value: __
    });
  } catch (e) {
    R.__ = __;
  }
  var op = R.op = function op(fn) {
    var length = fn.length;
    if (length !== 2) {
      throw new Error('Expected binary function.');
    }
    return function _op(a, b) {
      switch (arguments.length) {
        case 0:
          throw _noArgsException();
        case 1:
          return a === __ ? binary(flip(_op)) : unary(lPartial(fn, a));
        default:
          return a === __ ? unary(rPartial(fn, b)) : fn(a, b);
      }
    };
  };
  var curryN = R.curryN = function curryN(length, fn) {
    return (function recurry(args) {
      return arity(Math.max(length - (args && args.length || 0), 0), function() {
        if (arguments.length === 0) {
          throw _noArgsException();
        }
        var newArgs = _concat(args, arguments);
        if (newArgs.length >= length) {
          return fn.apply(this, newArgs);
        } else {
          return recurry(newArgs);
        }
      });
    }([]));
  };
  var curry = R.curry = function curry(fn) {
    return curryN(fn.length, fn);
  };
  var flip = R.flip = function flip(fn) {
    return function(a, b) {
      switch (arguments.length) {
        case 0:
          throw _noArgsException();
        case 1:
          return function(b) {
            return fn.apply(this, [b, a].concat(_slice(arguments, 1)));
          };
        default:
          return fn.apply(this, _concat([b, a], _slice(arguments, 2)));
      }
    };
  };
  function _hasMethod(methodName, obj) {
    return obj != null && !_isArray(obj) && typeof obj[methodName] === 'function';
  }
  function _checkForMethod(methodname, fn) {
    return function(a, b, c) {
      var length = arguments.length;
      var obj = arguments[length - 1],
          callBound = obj && !_isArray(obj) && typeof obj[methodname] === 'function';
      switch (arguments.length) {
        case 0:
          return fn();
        case 1:
          return callBound ? obj[methodname]() : fn(a);
        case 2:
          return callBound ? obj[methodname](a) : fn(a, b);
        case 3:
          return callBound ? obj[methodname](a, b) : fn(a, b, c);
      }
    };
  }
  var nAry = R.nAry = function(n, fn) {
    switch (n) {
      case 0:
        return function() {
          return fn.call(this);
        };
      case 1:
        return function(a0) {
          return fn.call(this, a0);
        };
      case 2:
        return function(a0, a1) {
          return fn.call(this, a0, a1);
        };
      case 3:
        return function(a0, a1, a2) {
          return fn.call(this, a0, a1, a2);
        };
      case 4:
        return function(a0, a1, a2, a3) {
          return fn.call(this, a0, a1, a2, a3);
        };
      case 5:
        return function(a0, a1, a2, a3, a4) {
          return fn.call(this, a0, a1, a2, a3, a4);
        };
      case 6:
        return function(a0, a1, a2, a3, a4, a5) {
          return fn.call(this, a0, a1, a2, a3, a4, a5);
        };
      case 7:
        return function(a0, a1, a2, a3, a4, a5, a6) {
          return fn.call(this, a0, a1, a2, a3, a4, a5, a6);
        };
      case 8:
        return function(a0, a1, a2, a3, a4, a5, a6, a7) {
          return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7);
        };
      case 9:
        return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
          return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8);
        };
      case 10:
        return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
        };
      default:
        return fn;
    }
  };
  var unary = R.unary = function unary(fn) {
    return nAry(1, fn);
  };
  var binary = R.binary = function binary(fn) {
    return nAry(2, fn);
  };
  var arity = R.arity = function(n, fn) {
    switch (n) {
      case 0:
        return function() {
          return fn.apply(this, arguments);
        };
      case 1:
        return function(a0) {
          void a0;
          return fn.apply(this, arguments);
        };
      case 2:
        return function(a0, a1) {
          void a1;
          return fn.apply(this, arguments);
        };
      case 3:
        return function(a0, a1, a2) {
          void a2;
          return fn.apply(this, arguments);
        };
      case 4:
        return function(a0, a1, a2, a3) {
          void a3;
          return fn.apply(this, arguments);
        };
      case 5:
        return function(a0, a1, a2, a3, a4) {
          void a4;
          return fn.apply(this, arguments);
        };
      case 6:
        return function(a0, a1, a2, a3, a4, a5) {
          void a5;
          return fn.apply(this, arguments);
        };
      case 7:
        return function(a0, a1, a2, a3, a4, a5, a6) {
          void a6;
          return fn.apply(this, arguments);
        };
      case 8:
        return function(a0, a1, a2, a3, a4, a5, a6, a7) {
          void a7;
          return fn.apply(this, arguments);
        };
      case 9:
        return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
          void a8;
          return fn.apply(this, arguments);
        };
      case 10:
        return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          void a9;
          return fn.apply(this, arguments);
        };
      default:
        return fn;
    }
  };
  var invokerN = R.invokerN = function invokerN(arity, method) {
    var initialArgs = _slice(arguments, 2);
    var len = arity - initialArgs.length;
    return curryN(len + 1, function() {
      var target = arguments[len];
      var args = initialArgs.concat(_slice(arguments, 0, len));
      return target[method].apply(target, args);
    });
  };
  var useWith = R.useWith = function useWith(fn) {
    var transformers = _slice(arguments, 1);
    var tlen = transformers.length;
    return curry(arity(tlen, function() {
      var args = [],
          idx = -1;
      while (++idx < tlen) {
        args.push(transformers[idx](arguments[idx]));
      }
      return fn.apply(this, args.concat(_slice(arguments, tlen)));
    }));
  };
  function forEach(fn, list) {
    var idx = -1,
        len = list.length;
    while (++idx < len) {
      fn(list[idx]);
    }
    return list;
  }
  R.forEach = _curry2(forEach);
  R.forEach.idx = _curry2(function forEachIdx(fn, list) {
    var idx = -1,
        len = list.length;
    while (++idx < len) {
      fn(list[idx], idx, list);
    }
    return list;
  });
  var clone = R.clone = function clone(list) {
    return _slice(list);
  };
  R.cloneDeep = function cloneDeep(value) {
    return _baseCopy(value, [], []);
  };
  function _baseCopy(value, refFrom, refTo) {
    switch (value && toString.call(value)) {
      case '[object Object]':
        return _copyObj(value, {}, refFrom, refTo);
      case '[object Array]':
        return _copyObj(value, [], refFrom, refTo);
      case '[object Function]':
        return value;
      case '[object Date]':
        return new Date(value);
      default:
        return value;
    }
  }
  function _copyObj(value, copiedValue, refFrom, refTo) {
    var len = refFrom.length;
    var idx = -1;
    while (++idx < len) {
      if (value === refFrom[idx]) {
        return refTo[idx];
      }
    }
    refFrom.push(value);
    refTo.push(copiedValue);
    for (var key in value) {
      copiedValue[key] = _baseCopy(value[key], refFrom, refTo);
    }
    return copiedValue;
  }
  var isEmpty = R.isEmpty = function isEmpty(val) {
    return val == null || val.length === 0;
  };
  function _prepend(el, list) {
    return _concat([el], list);
  }
  var prepend = R.prepend = _curry2(_prepend);
  R.cons = prepend;
  R.prependTo = flip(_prepend);
  var nth = R.nth = _curry2(function nth(n, list) {
    return n < 0 ? list[list.length + n] : list[n];
  });
  var head = R.head = nth(0);
  R.car = head;
  R.last = nth(-1);
  var tail = R.tail = _checkForMethod('tail', function(list) {
    return _slice(list, 1);
  });
  R.cdr = tail;
  function _append(el, list) {
    return _concat(list, [el]);
  }
  var append = R.append = _curry2(_append);
  R.push = append;
  R.appendTo = flip(_append);
  R.concat = _curry2(function(set1, set2) {
    if (_isArray(set2)) {
      return _concat(set1, set2);
    } else if (_hasMethod('concat', set1)) {
      return set1.concat(set2);
    } else {
      throw new TypeError("can't concat " + typeof set1);
    }
  });
  var identity = R.identity = function identity(x) {
    return x;
  };
  R.I = identity;
  R.argN = function argN(n) {
    return function() {
      return arguments[n];
    };
  };
  var times = R.times = _curry2(function times(fn, n) {
    var list = new Array(n);
    var idx = -1;
    while (++idx < n) {
      list[idx] = fn(idx);
    }
    return list;
  });
  R.repeatN = _curry2(function repeatN(value, n) {
    return times(always(value), n);
  });
  R.apply = _curry2(function apply(fn, args) {
    return fn.apply(this, args);
  });
  R.unapply = function unapply(fn) {
    if (arguments.length === 0) {
      throw _noArgsException();
    }
    return function() {
      return fn(_slice(arguments));
    };
  };
  function _compose(f, g) {
    return function() {
      return f.call(this, g.apply(this, arguments));
    };
  }
  function _pCompose(f, g) {
    return function() {
      var context = this;
      var value = g.apply(this, arguments);
      if (_isThennable(value)) {
        return value.then(function(result) {
          return f.call(context, result);
        });
      } else {
        return f.call(this, value);
      }
    };
  }
  function _isThennable(value) {
    return (value != null) && (value === Object(value)) && value.then && typeof value.then === 'function';
  }
  function _createComposer(composeFunction) {
    return function() {
      switch (arguments.length) {
        case 0:
          throw _noArgsException();
        case 1:
          return arguments[0];
        default:
          var idx = arguments.length - 1,
              fn = arguments[idx],
              length = fn.length;
          while (idx--) {
            fn = composeFunction(arguments[idx], fn);
          }
          return arity(length, fn);
      }
    };
  }
  var compose = R.compose = _createComposer(_compose);
  var pCompose = R.pCompose = _createComposer(_pCompose);
  R.pipe = function pipe() {
    return compose.apply(this, reverse(arguments));
  };
  R.pPipe = function pPipe() {
    return pCompose.apply(this, reverse(arguments));
  };
  function _createPartialApplicator(concat) {
    return function(fn) {
      var args = _slice(arguments, 1);
      return arity(Math.max(0, fn.length - args.length), function() {
        return fn.apply(this, concat(args, arguments));
      });
    };
  }
  var lPartial = R.lPartial = _createPartialApplicator(_concat);
  var rPartial = R.rPartial = _createPartialApplicator(flip(_concat));
  R.memoize = function memoize(fn) {
    if (!fn.length) {
      return once(fn);
    }
    var cache = {};
    return function() {
      if (!arguments.length) {
        return;
      }
      var position = reduce(function(cache, arg) {
        return cache[arg] || (cache[arg] = {});
      }, cache, _slice(arguments, 0, arguments.length - 1));
      var arg = arguments[arguments.length - 1];
      return (position[arg] || (position[arg] = fn.apply(this, arguments)));
    };
  };
  var once = R.once = function once(fn) {
    var called = false,
        result;
    return function() {
      if (called) {
        return result;
      }
      called = true;
      result = fn.apply(this, arguments);
      return result;
    };
  };
  R.wrap = function wrap(fn, wrapper) {
    return arity(fn.length, function() {
      return wrapper.apply(this, _concat([fn], arguments));
    });
  };
  var constructN = R.constructN = _curry2(function constructN(n, Fn) {
    var f = function() {
      var Temp = function() {},
          inst,
          ret;
      Temp.prototype = Fn.prototype;
      inst = new Temp();
      ret = Fn.apply(inst, arguments);
      return Object(ret) === ret ? ret : inst;
    };
    return n > 1 ? curry(nAry(n, f)) : f;
  });
  R.construct = function construct(Fn) {
    return constructN(Fn.length, Fn);
  };
  R.converge = function(after) {
    var fns = _slice(arguments, 1);
    return function() {
      var args = arguments;
      return after.apply(this, _map(function(fn) {
        return fn.apply(this, args);
      }, fns));
    };
  };
  var reduce = R.reduce = _curry3(function reduce(fn, acc, list) {
    var idx = -1,
        len = list.length;
    while (++idx < len) {
      acc = fn(acc, list[idx]);
    }
    return acc;
  });
  R.foldl = reduce;
  R.reduce.idx = _curry3(function reduceIdx(fn, acc, list) {
    var idx = -1,
        len = list.length;
    while (++idx < len) {
      acc = fn(acc, list[idx], idx, list);
    }
    return acc;
  });
  R.foldl.idx = reduce.idx;
  var reduceRight = R.reduceRight = _curry3(_checkForMethod('reduceRight', function reduceRight(fn, acc, list) {
    var idx = list.length;
    while (idx--) {
      acc = fn(acc, list[idx]);
    }
    return acc;
  }));
  R.foldr = reduceRight;
  R.reduceRight.idx = _curry3(function reduceRightIdx(fn, acc, list) {
    var idx = list.length;
    while (idx--) {
      acc = fn(acc, list[idx], idx, list);
    }
    return acc;
  });
  R.foldr.idx = reduceRight.idx;
  R.unfoldr = _curry2(function unfoldr(fn, seed) {
    var pair = fn(seed);
    var result = [];
    while (pair && pair.length) {
      result.push(pair[0]);
      pair = fn(pair[1]);
    }
    return result;
  });
  function _map(fn, list) {
    var idx = -1,
        len = list.length,
        result = new Array(len);
    while (++idx < len) {
      result[idx] = fn(list[idx]);
    }
    return result;
  }
  var map = R.map = _curry2(_checkForMethod('map', _map));
  R.map.idx = _curry2(function mapIdx(fn, list) {
    var idx = -1,
        len = list.length,
        result = new Array(len);
    while (++idx < len) {
      result[idx] = fn(list[idx], idx, list);
    }
    return result;
  });
  R.mapObj = _curry2(function mapObject(fn, obj) {
    return reduce(function(acc, key) {
      acc[key] = fn(obj[key]);
      return acc;
    }, {}, keys(obj));
  });
  R.mapObj.idx = _curry2(function mapObjectIdx(fn, obj) {
    return reduce(function(acc, key) {
      acc[key] = fn(obj[key], key, obj);
      return acc;
    }, {}, keys(obj));
  });
  R.scanl = _curry3(function scanl(fn, acc, list) {
    var idx = 0,
        len = list.length + 1,
        result = new Array(len);
    result[idx] = acc;
    while (++idx < len) {
      acc = fn(acc, list[idx - 1]);
      result[idx] = acc;
    }
    return result;
  });
  var liftN = R.liftN = _curry2(function liftN(arity, fn) {
    var lifted = curryN(arity, fn);
    if (arguments.length === 0) {
      throw _noArgsException();
    }
    return curryN(arity, function() {
      return reduce(ap, _map(lifted, arguments[0]), _slice(arguments, 1));
    });
  });
  R.lift = function lift(fn) {
    if (arguments.length === 0) {
      throw _noArgsException();
    }
    return liftN(fn.length, fn);
  };
  var ap = R.ap = _curry2(function ap(fns, vs) {
    return _hasMethod('ap', fns) ? fns.ap(vs) : reduce(function(acc, fn) {
      return _concat(acc, _map(fn, vs));
    }, [], fns);
  });
  R.of = function of(x, container) {
    return (_hasMethod('of', container)) ? container.of(x) : [x];
  };
  R.empty = function empty(x) {
    return (_hasMethod('empty', x)) ? x.empty() : [];
  };
  R.chain = _curry2(_checkForMethod('chain', function chain(f, list) {
    return unnest(_map(f, list));
  }));
  var commuteMap = R.commuteMap = _curry3(function commuteMap(fn, of, list) {
    function consF(acc, ftor) {
      return ap(map(append, fn(ftor)), acc);
    }
    return reduce(consF, of([]), list);
  });
  R.commute = commuteMap(map(identity));
  var size = R.size = function size(list) {
    return list.length;
  };
  R.length = size;
  function _filter(fn, list) {
    var idx = -1,
        len = list.length,
        result = [];
    while (++idx < len) {
      if (fn(list[idx])) {
        result.push(list[idx]);
      }
    }
    return result;
  }
  R.filter = _curry2(_checkForMethod('filter', _filter));
  function filterIdx(fn, list) {
    var idx = -1,
        len = list.length,
        result = [];
    while (++idx < len) {
      if (fn(list[idx], idx, list)) {
        result.push(list[idx]);
      }
    }
    return result;
  }
  R.filter.idx = _curry2(filterIdx);
  var reject = function reject(fn, list) {
    return _filter(not(fn), list);
  };
  R.reject = _curry2(reject);
  R.reject.idx = _curry2(function rejectIdx(fn, list) {
    return filterIdx(not(fn), list);
  });
  R.takeWhile = _curry2(_checkForMethod('takeWhile', function(fn, list) {
    var idx = -1,
        len = list.length;
    while (++idx < len && fn(list[idx])) {}
    return _slice(list, 0, idx);
  }));
  R.take = _curry2(_checkForMethod('take', function(n, list) {
    return _slice(list, 0, Math.min(n, list.length));
  }));
  R.skipUntil = _curry2(function skipUntil(fn, list) {
    var idx = -1,
        len = list.length;
    while (++idx < len && !fn(list[idx])) {}
    return _slice(list, idx);
  });
  R.skip = _curry2(_checkForMethod('skip', function skip(n, list) {
    if (n < list.length) {
      return _slice(list, n);
    } else {
      return [];
    }
  }));
  R.find = _curry2(function find(fn, list) {
    var idx = -1;
    var len = list.length;
    while (++idx < len) {
      if (fn(list[idx])) {
        return list[idx];
      }
    }
  });
  R.findIndex = _curry2(function findIndex(fn, list) {
    var idx = -1;
    var len = list.length;
    while (++idx < len) {
      if (fn(list[idx])) {
        return idx;
      }
    }
    return -1;
  });
  R.findLast = _curry2(function findLast(fn, list) {
    var idx = list.length;
    while (idx--) {
      if (fn(list[idx])) {
        return list[idx];
      }
    }
  });
  R.findLastIndex = _curry2(function findLastIndex(fn, list) {
    var idx = list.length;
    while (idx--) {
      if (fn(list[idx])) {
        return idx;
      }
    }
    return -1;
  });
  function every(fn, list) {
    var idx = -1;
    while (++idx < list.length) {
      if (!fn(list[idx])) {
        return false;
      }
    }
    return true;
  }
  R.every = _curry2(every);
  function some(fn, list) {
    var idx = -1;
    while (++idx < list.length) {
      if (fn(list[idx])) {
        return true;
      }
    }
    return false;
  }
  R.some = _curry2(some);
  function _indexOf(list, item, from) {
    var idx = 0,
        len = list.length;
    if (typeof from == 'number') {
      idx = from < 0 ? Math.max(0, len + from) : from;
    }
    while (idx < len) {
      if (list[idx] === item) {
        return idx;
      }
      ++idx;
    }
    return -1;
  }
  function _lastIndexOf(list, item, from) {
    var idx = list.length;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    while (--idx >= 0) {
      if (list[idx] === item) {
        return idx;
      }
    }
    return -1;
  }
  R.indexOf = _curry2(function indexOf(target, list) {
    return _indexOf(list, target);
  });
  R.indexOf.from = _curry3(function indexOfFrom(target, fromIdx, list) {
    return _indexOf(list, target, fromIdx);
  });
  R.lastIndexOf = _curry2(function lastIndexOf(target, list) {
    return _lastIndexOf(list, target);
  });
  R.lastIndexOf.from = _curry3(function lastIndexOfFrom(target, fromIdx, list) {
    return _lastIndexOf(list, target, fromIdx);
  });
  function _contains(a, list) {
    return _indexOf(list, a) >= 0;
  }
  R.contains = _curry2(_contains);
  function _containsWith(pred, x, list) {
    var idx = -1,
        len = list.length;
    while (++idx < len) {
      if (pred(x, list[idx])) {
        return true;
      }
    }
    return false;
  }
  var containsWith = R.containsWith = _curry3(_containsWith);
  var uniq = R.uniq = function uniq(list) {
    var idx = -1,
        len = list.length;
    var result = [],
        item;
    while (++idx < len) {
      item = list[idx];
      if (!_contains(item, result)) {
        result.push(item);
      }
    }
    return result;
  };
  R.isSet = function isSet(list) {
    var len = list.length;
    var idx = -1;
    while (++idx < len) {
      if (_indexOf(list, list[idx], idx + 1) >= 0) {
        return false;
      }
    }
    return true;
  };
  var uniqWith = R.uniqWith = _curry2(function uniqWith(pred, list) {
    var idx = -1,
        len = list.length;
    var result = [],
        item;
    while (++idx < len) {
      item = list[idx];
      if (!_containsWith(pred, item, result)) {
        result.push(item);
      }
    }
    return result;
  });
  var pluck = R.pluck = _curry2(function pluck(p, list) {
    return _map(prop(p), list);
  });
  function _makeFlat(recursive) {
    return function flatt(list) {
      var value,
          result = [],
          idx = -1,
          j,
          ilen = list.length,
          jlen;
      while (++idx < ilen) {
        if (isArrayLike(list[idx])) {
          value = (recursive) ? flatt(list[idx]) : list[idx];
          j = -1;
          jlen = value.length;
          while (++j < jlen) {
            result.push(value[j]);
          }
        } else {
          result.push(list[idx]);
        }
      }
      return result;
    };
  }
  R.flatten = _makeFlat(true);
  var unnest = R.unnest = _makeFlat(false);
  R.zipWith = _curry3(function zipWith(fn, a, b) {
    var rv = [],
        idx = -1,
        len = Math.min(a.length, b.length);
    while (++idx < len) {
      rv[idx] = fn(a[idx], b[idx]);
    }
    return rv;
  });
  R.zip = _curry2(function zip(a, b) {
    var rv = [];
    var idx = -1;
    var len = Math.min(a.length, b.length);
    while (++idx < len) {
      rv[idx] = [a[idx], b[idx]];
    }
    return rv;
  });
  R.zipObj = _curry2(function zipObj(keys, values) {
    var idx = -1,
        len = keys.length,
        out = {};
    while (++idx < len) {
      out[keys[idx]] = values[idx];
    }
    return out;
  });
  var fromPairs = R.fromPairs = function fromPairs(pairs) {
    var idx = -1,
        len = pairs.length,
        out = {};
    while (++idx < len) {
      if (_isArray(pairs[idx]) && pairs[idx].length) {
        out[pairs[idx][0]] = pairs[idx][1];
      }
    }
    return out;
  };
  var createMapEntry = R.createMapEntry = _curry2(function(key, val) {
    var obj = {};
    obj[key] = val;
    return obj;
  });
  R.lens = _curry2(function lens(get, set) {
    var lns = function(a) {
      return get(a);
    };
    lns.set = set;
    lns.map = function(fn, a) {
      return set(fn(get(a)), a);
    };
    return lns;
  });
  R.xprod = _curry2(function xprod(a, b) {
    if (isEmpty(a) || isEmpty(b)) {
      return [];
    }
    var idx = -1;
    var ilen = a.length;
    var j;
    var jlen = b.length;
    var result = [];
    while (++idx < ilen) {
      j = -1;
      while (++j < jlen) {
        result.push([a[idx], b[j]]);
      }
    }
    return result;
  });
  var reverse = R.reverse = function reverse(list) {
    var idx = -1,
        length = list.length;
    var pointer = length;
    var result = new Array(length);
    while (++idx < length) {
      result[--pointer] = list[idx];
    }
    return result;
  };
  R.range = _curry2(function range(from, to) {
    if (from >= to) {
      return [];
    }
    var idx = 0,
        result = new Array(Math.floor(to) - Math.ceil(from));
    while (from < to) {
      result[idx++] = from++;
    }
    return result;
  });
  R.join = invokerN(1, 'join');
  R.slice = invokerN(2, 'slice');
  R.slice.from = _curry2(function(a, xs) {
    return xs.slice(a, xs.length);
  });
  R.remove = _curry3(function remove(start, count, list) {
    return _concat(_slice(list, 0, Math.min(start, list.length)), _slice(list, Math.min(list.length, start + count)));
  });
  R.insert = _curry3(function insert(idx, elt, list) {
    idx = idx < list.length && idx >= 0 ? idx : list.length;
    return _concat(_append(elt, _slice(list, 0, idx)), _slice(list, idx));
  });
  R.insert.all = _curry3(function insertAll(idx, elts, list) {
    idx = idx < list.length && idx >= 0 ? idx : list.length;
    return _concat(_concat(_slice(list, 0, idx), elts), _slice(list, idx));
  });
  var comparator = R.comparator = function comparator(pred) {
    return function(a, b) {
      return pred(a, b) ? -1 : pred(b, a) ? 1 : 0;
    };
  };
  R.sort = _curry2(function sort(comparator, list) {
    return clone(list).sort(comparator);
  });
  var groupBy = R.groupBy = _curry2(function groupBy(fn, list) {
    return reduce(function(acc, elt) {
      var key = fn(elt);
      acc[key] = _append(elt, acc[key] || (acc[key] = []));
      return acc;
    }, {}, list);
  });
  R.partition = _curry2(function partition(pred, list) {
    return reduce(function(acc, elt) {
      acc[pred(elt) ? 0 : 1].push(elt);
      return acc;
    }, [[], []], list);
  });
  R.tap = _curry2(function tap(fn, x) {
    fn(x);
    return x;
  });
  R.eq = _curry2(function eq(a, b) {
    return a === b;
  });
  var prop = R.prop = function prop(p, obj) {
    switch (arguments.length) {
      case 0:
        throw _noArgsException();
      case 1:
        return function _prop(obj) {
          return obj[p];
        };
    }
    return obj[p];
  };
  R.get = prop;
  R.propOf = flip(prop);
  R.props = _curry2(function props(ps, obj) {
    var len = ps.length,
        out = new Array(len),
        idx = -1;
    while (++idx < len) {
      out[idx] = obj[ps[idx]];
    }
    return out;
  });
  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  R.propOr = _curry3(function propOr(p, val, obj) {
    return _hasOwnProperty.call(obj, p) ? obj[p] : val;
  });
  R.has = _curry2(function(prop, obj) {
    return _hasOwnProperty.call(obj, prop);
  });
  R.hasIn = _curry2(function(prop, obj) {
    return prop in obj;
  });
  R.func = function func(funcName, obj) {
    switch (arguments.length) {
      case 0:
        throw _noArgsException();
      case 1:
        return function(obj) {
          return obj[funcName].apply(obj, _slice(arguments, 1));
        };
      default:
        return obj[funcName].apply(obj, _slice(arguments, 2));
    }
  };
  var always = R.always = function always(val) {
    return function() {
      return val;
    };
  };
  R.bind = _curry2(function bind(fn, thisObj) {
    return function() {
      return fn.apply(thisObj, arguments);
    };
  });
  var keys = R.keys = (function() {
    var hasEnumBug = !({toString: null}).propertyIsEnumerable('toString');
    var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
    return function keys(obj) {
      if (Object(obj) !== obj) {
        return [];
      }
      if (Object.keys) {
        return Object.keys(obj);
      }
      var prop,
          ks = [],
          nIdx;
      for (prop in obj) {
        if (_hasOwnProperty.call(obj, prop)) {
          ks.push(prop);
        }
      }
      if (hasEnumBug) {
        nIdx = nonEnumerableProps.length;
        while (nIdx--) {
          prop = nonEnumerableProps[nIdx];
          if (_hasOwnProperty.call(obj, prop) && !_contains(prop, ks)) {
            ks.push(prop);
          }
        }
      }
      return ks;
    };
  }());
  var keysIn = R.keysIn = function keysIn(obj) {
    var prop,
        ks = [];
    for (prop in obj) {
      ks.push(prop);
    }
    return ks;
  };
  function _pairWith(fn) {
    return function(obj) {
      return _map(function(key) {
        return [key, obj[key]];
      }, fn(obj));
    };
  }
  R.toPairs = _pairWith(keys);
  R.toPairsIn = _pairWith(keysIn);
  R.values = function values(obj) {
    var props = keys(obj);
    var len = props.length;
    var vals = new Array(len);
    var idx = -1;
    while (++idx < len) {
      vals[idx] = obj[props[idx]];
    }
    return vals;
  };
  R.valuesIn = function valuesIn(obj) {
    var prop,
        vs = [];
    for (prop in obj) {
      vs.push(obj[prop]);
    }
    return vs;
  };
  function _pickBy(test, obj) {
    var copy = {};
    var prop;
    var props = keysIn(obj);
    var len = props.length;
    var idx = -1;
    while (++idx < len) {
      prop = props[idx];
      if (test(obj[prop], prop, obj)) {
        copy[prop] = obj[prop];
      }
    }
    return copy;
  }
  R.pick = _curry2(function pick(names, obj) {
    return _pickBy(function(val, key) {
      return _contains(key, names);
    }, obj);
  });
  R.omit = _curry2(function omit(names, obj) {
    return _pickBy(function(val, key) {
      return !_contains(key, names);
    }, obj);
  });
  R.pickBy = _curry2(_pickBy);
  function _pickAll(names, obj) {
    var copy = {};
    forEach(function(name) {
      copy[name] = obj[name];
    }, names);
    return copy;
  }
  var pickAll = R.pickAll = _curry2(_pickAll);
  function _extend(destination, other) {
    var props = keys(other),
        idx = -1,
        length = props.length;
    while (++idx < length) {
      destination[props[idx]] = other[props[idx]];
    }
    return destination;
  }
  R.mixin = _curry2(function mixin(a, b) {
    return _extend(_extend({}, a), b);
  });
  R.cloneObj = function(obj) {
    return _extend({}, obj);
  };
  R.eqProps = _curry3(function eqProps(prop, obj1, obj2) {
    return obj1[prop] === obj2[prop];
  });
  function _satisfiesSpec(spec, parsedSpec, testObj) {
    if (spec === testObj) {
      return true;
    }
    if (testObj == null) {
      return false;
    }
    parsedSpec.fn = parsedSpec.fn || [];
    parsedSpec.obj = parsedSpec.obj || [];
    var key,
        val,
        idx = -1,
        fnLen = parsedSpec.fn.length,
        j = -1,
        objLen = parsedSpec.obj.length;
    while (++idx < fnLen) {
      key = parsedSpec.fn[idx];
      val = spec[key];
      if (!(key in testObj)) {
        return false;
      }
      if (!val(testObj[key], testObj)) {
        return false;
      }
    }
    while (++j < objLen) {
      key = parsedSpec.obj[j];
      if (spec[key] !== testObj[key]) {
        return false;
      }
    }
    return true;
  }
  R.where = function where(spec, testObj) {
    var parsedSpec = groupBy(function(key) {
      return typeof spec[key] === 'function' ? 'fn' : 'obj';
    }, keys(spec));
    switch (arguments.length) {
      case 0:
        throw _noArgsException();
      case 1:
        return function(testObj) {
          return _satisfiesSpec(spec, parsedSpec, testObj);
        };
    }
    return _satisfiesSpec(spec, parsedSpec, testObj);
  };
  var assoc = R.assoc = _curry3(function(prop, val, obj) {
    return _extend(fromPairs(_map(function(key) {
      return [key, obj[key]];
    }, keysIn(obj))), createMapEntry(prop, val));
  });
  R.assocPath = (function() {
    var setParts = function(parts, val, obj) {
      if (parts.length === 1) {
        return assoc(parts[0], val, obj);
      }
      var current = obj[parts[0]];
      return assoc(parts[0], setParts(_slice(parts, 1), val, is(Object, current) ? current : {}), obj);
    };
    return function(path, val, obj) {
      var length = arguments.length;
      if (length === 0) {
        throw _noArgsException();
      }
      var parts = split('.', path);
      var fn = _curry2(function(val, obj) {
        return setParts(parts, val, obj);
      });
      switch (length) {
        case 1:
          return fn;
        case 2:
          return fn(val);
        default:
          return fn(val, obj);
      }
    };
  }());
  R.installTo = function(obj) {
    return _extend(obj, R);
  };
  var is = R.is = _curry2(function is(Ctor, val) {
    return val != null && val.constructor === Ctor || val instanceof Ctor;
  });
  R.type = function type(val) {
    return val === null ? 'Null' : val === undefined ? 'Undefined' : toString.call(val).slice(8, -1);
  };
  R.alwaysZero = always(0);
  R.alwaysFalse = always(false);
  R.alwaysTrue = always(true);
  R.and = _curry2(function and(f, g) {
    return function _and() {
      return f.apply(this, arguments) && g.apply(this, arguments);
    };
  });
  R.or = _curry2(function or(f, g) {
    return function _or() {
      return f.apply(this, arguments) || g.apply(this, arguments);
    };
  });
  var not = R.not = function not(f) {
    return function() {
      return !f.apply(this, arguments);
    };
  };
  function _predicateWrap(predPicker) {
    return function(preds) {
      var predIterator = function() {
        var args = arguments;
        return predPicker(function(predicate) {
          return predicate.apply(null, args);
        }, preds);
      };
      return arguments.length > 1 ? predIterator.apply(null, _slice(arguments, 1)) : arity(max(pluck('length', preds)), predIterator);
    };
  }
  R.allPredicates = _predicateWrap(every);
  R.anyPredicates = _predicateWrap(some);
  var ifElse = R.ifElse = _curry3(function ifElse(condition, onTrue, onFalse) {
    return function _ifElse() {
      return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
    };
  });
  R['if'] = ifElse;
  R.cond = function cond() {
    var pairs = arguments;
    return function() {
      var idx = -1;
      while (++idx < pairs.length) {
        if (pairs[idx][0].apply(this, arguments)) {
          return pairs[idx][1].apply(this, arguments);
        }
      }
    };
  };
  function _add(a, b) {
    return a + b;
  }
  R.add = _curry2(_add);
  function _multiply(a, b) {
    return a * b;
  }
  R.multiply = _curry2(_multiply);
  R.subtract = op(function subtract(a, b) {
    return a - b;
  });
  R.divide = op(function divide(a, b) {
    return a / b;
  });
  R.modulo = op(function modulo(a, b) {
    return a % b;
  });
  var _isInteger = Number.isInteger || function isInteger(n) {
    return (n << 0) === n;
  };
  R.mathMod = op(function mathMod(m, p) {
    if (!_isInteger(m)) {
      return NaN;
    }
    if (!_isInteger(p) || p < 1) {
      return NaN;
    }
    return ((m % p) + p) % p;
  });
  R.sum = reduce(_add, 0);
  R.product = reduce(_multiply, 1);
  function lt(a, b) {
    return a < b;
  }
  R.lt = op(lt);
  R.lte = op(function lte(a, b) {
    return a <= b;
  });
  function gt(a, b) {
    return a > b;
  }
  R.gt = op(gt);
  R.gte = op(function gte(a, b) {
    return a >= b;
  });
  function _createMaxMin(comparator, initialVal) {
    return function(list) {
      if (arguments.length === 0) {
        throw _noArgsException();
      }
      var idx = -1,
          winner = initialVal,
          computed;
      while (++idx < list.length) {
        computed = +list[idx];
        if (comparator(computed, winner)) {
          winner = computed;
        }
      }
      return winner;
    };
  }
  function _createMaxMinBy(comparator) {
    return function(valueComputer, list) {
      if (!(list && list.length > 0)) {
        return;
      }
      var idx = 0,
          winner = list[idx],
          computedWinner = valueComputer(winner),
          computedCurrent;
      while (++idx < list.length) {
        computedCurrent = valueComputer(list[idx]);
        if (comparator(computedCurrent, computedWinner)) {
          computedWinner = computedCurrent;
          winner = list[idx];
        }
      }
      return winner;
    };
  }
  var max = R.max = _createMaxMin(gt, -Infinity);
  R.maxBy = _curry2(_createMaxMinBy(gt));
  R.min = _createMaxMin(lt, Infinity);
  R.minBy = _curry2(_createMaxMinBy(lt));
  var substring = R.substring = invokerN(2, 'substring');
  R.substringFrom = flip(substring)(void 0);
  R.substringTo = substring(0);
  R.charAt = invokerN(1, 'charAt');
  R.charCodeAt = invokerN(1, 'charCodeAt');
  R.match = invokerN(1, 'match');
  R.replace = _curry3(function replace(regex, replacement, str) {
    return str.replace(regex, replacement);
  });
  R.strIndexOf = _curry2(function strIndexOf(c, str) {
    return str.indexOf(c);
  });
  R.strLastIndexOf = _curry2(function(c, str) {
    return str.lastIndexOf(c);
  });
  R.toUpperCase = invokerN(0, 'toUpperCase');
  R.toLowerCase = invokerN(0, 'toLowerCase');
  R.trim = (function() {
    var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' + '\u2029\uFEFF';
    var zeroWidth = '\u200b';
    var hasProtoTrim = (typeof String.prototype.trim === 'function');
    if (!hasProtoTrim || (ws.trim() || !zeroWidth.trim())) {
      return function trim(str) {
        var beginRx = new RegExp('^[' + ws + '][' + ws + ']*');
        var endRx = new RegExp('[' + ws + '][' + ws + ']*$');
        return str.replace(beginRx, '').replace(endRx, '');
      };
    } else {
      return function trim(str) {
        return str.trim();
      };
    }
  }());
  var split = R.split = invokerN(1, 'split');
  function _path(paths, obj) {
    var idx = -1,
        length = paths.length,
        val;
    if (obj == null) {
      return;
    }
    val = obj;
    while (val != null && ++idx < length) {
      val = val[paths[idx]];
    }
    return val;
  }
  var pathOn = R.pathOn = _curry3(function pathOn(sep, str, obj) {
    return _path(str.split(sep), obj);
  });
  R.path = pathOn('.');
  R.pathEq = _curry3(function(path, val, obj) {
    return _path(path.split('.'), obj) === val;
  });
  R.project = useWith(_map, pickAll, identity);
  R.propEq = _curry3(function propEq(name, val, obj) {
    return obj[name] === val;
  });
  R.union = compose(uniq, _concat);
  R.unionWith = _curry3(function unionWith(pred, list1, list2) {
    return uniqWith(pred, _concat(list1, list2));
  });
  R.difference = _curry2(function difference(first, second) {
    var out = [];
    var idx = -1;
    var firstLen = first.length;
    while (++idx < firstLen) {
      if (!_contains(first[idx], second) && !_contains(first[idx], out)) {
        out.push(first[idx]);
      }
    }
    return out;
  });
  R.differenceWith = _curry3(function differenceWith(pred, first, second) {
    var out = [];
    var idx = -1;
    var firstLen = first.length;
    var containsPred = containsWith(pred);
    while (++idx < firstLen) {
      if (!containsPred(first[idx], second) && !containsPred(first[idx], out)) {
        out.push(first[idx]);
      }
    }
    return out;
  });
  R.intersection = _curry2(function intersection(list1, list2) {
    return uniq(_filter(flip(_contains)(list1), list2));
  });
  R.intersectionWith = _curry3(function intersectionWith(pred, list1, list2) {
    var results = [],
        idx = -1;
    while (++idx < list1.length) {
      if (_containsWith(pred, list1[idx], list2)) {
        results[results.length] = list1[idx];
      }
    }
    return uniqWith(pred, results);
  });
  function _keyValue(fn, list) {
    return _map(function(item) {
      return {
        key: fn(item),
        val: item
      };
    }, list);
  }
  var _compareKeys = comparator(function(a, b) {
    return a.key < b.key;
  });
  R.sortBy = _curry2(function sortBy(fn, list) {
    return pluck('val', _keyValue(fn, list).sort(_compareKeys));
  });
  R.countBy = _curry2(function countBy(fn, list) {
    return reduce(function(counts, obj) {
      counts[obj.key] = (counts[obj.key] || 0) + 1;
      return counts;
    }, {}, _keyValue(fn, list));
  });
  function _functionsWith(fn) {
    return function(obj) {
      return _filter(function(key) {
        return typeof obj[key] === 'function';
      }, fn(obj));
    };
  }
  R.functions = _functionsWith(keys);
  R.functionsIn = _functionsWith(keysIn);
  return R;
}));


})();
System.register("services/contacts/contacts-service", [], function($__export) {
  "use strict";
  var __moduleName = "services/contacts/contacts-service";
  var service;
  return {
    setters: [],
    execute: function() {
      service = function contacts(R) {
        var ids = [1, 2, 3];
        return R.map((function(id) {
          return {
            id: id,
            name: 'contact ' + id
          };
        }))(ids);
      };
      $__export('default', service);
    }
  };
});



System.register("libraries/libraries", ["angular", "./ramda/ramda"], function($__export) {
  "use strict";
  var __moduleName = "libraries/libraries";
  var angular,
      ramda,
      libraries;
  return {
    setters: [function(m) {
      angular = m.default;
    }, function(m) {
      ramda = m.default;
    }],
    execute: function() {
      libraries = angular.module('toc.libraries', [ramda.name]);
      $__export('default', libraries);
    }
  };
});



System.register("views/home/home.html!github:systemjs/plugin-text@0.0.2", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = "<ion-view view-title=\"Home\">\n  <ion-content>\n    <h1 class=\"home-title\">Home</h1>\n    <div ng-repeat=\"contact in vm.contacts\">\n      {{contact.name}}\n    </div>\n  </ion-content>\n</ion-view>\n";
  global.define = __define;
  return module.exports;
});



System.register("views/home/home-controller", [], function($__export) {
  "use strict";
  var __moduleName = "views/home/home-controller";
  var controller;
  return {
    setters: [],
    execute: function() {
      controller = function HomeController(contacts) {
        this.contacts = contacts;
      };
      $__export('default', controller);
    }
  };
});



System.register("views/home/home-service", [], false, function(__require, __exports, __module) {
  System.get("@@global-helpers").prepareGlobal(__module.id, []);
  (function() {
    [];
  }).call(System.global);
  return System.get("@@global-helpers").retrieveGlobal(__module.id, false);
});



System.register("components/header/header.html!github:systemjs/plugin-text@0.0.2", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = "<ion-nav-back-button>\n</ion-nav-back-button>\n\n<ion-nav-buttons side=\"left\">\n  <button class=\"button button-icon button-clear ion-navicon\" menu-toggle=\"left\">\n  </button>\n</ion-nav-buttons>\n";
  global.define = __define;
  return module.exports;
});



System.register("app-run", [], function($__export) {
  "use strict";
  var __moduleName = "app-run";
  var run;
  return {
    setters: [],
    execute: function() {
      run = function run($ionicPlatform) {
        $ionicPlatform.ready(function() {
          if (window.cordova && window.cordova.plugins.Keyboard) {
            window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          }
          if (window.StatusBar) {
            window.StatusBar.styleDefault();
          }
        });
      };
      $__export('default', run);
    }
  };
});



System.register("app.html!github:systemjs/plugin-text@0.0.2", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = "<ion-side-menus enable-menu-with-back-views=\"false\">\n  <ion-side-menu-content>\n    <ion-nav-bar class=\"bar-stable\">\n      <toc-header></toc-header>\n    </ion-nav-bar>\n    <ion-nav-view name=\"content\"></ion-nav-view>\n  </ion-side-menu-content>\n\n  <ion-side-menu side=\"left\" expose-aside-when=\"large\">\n  </ion-side-menu>\n</ion-side-menus>\n";
  global.define = __define;
  return module.exports;
});



System.register("github:angular/bower-angular@1.3.8", ["github:angular/bower-angular@1.3.8/angular.min"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:angular/bower-angular@1.3.8/angular.min");
  global.define = __define;
  return module.exports;
});



System.register("github:systemjs/plugin-css@0.1.0", ["github:systemjs/plugin-css@0.1.0/css"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:systemjs/plugin-css@0.1.0/css");
  global.define = __define;
  return module.exports;
});



System.register("github:angular/bower-angular-animate@1.3.8", ["github:angular/bower-angular-animate@1.3.8/angular-animate"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:angular/bower-angular-animate@1.3.8/angular-animate");
  global.define = __define;
  return module.exports;
});



System.register("github:angular/bower-angular-sanitize@1.3.8", ["github:angular/bower-angular-sanitize@1.3.8/angular-sanitize"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:angular/bower-angular-sanitize@1.3.8/angular-sanitize");
  global.define = __define;
  return module.exports;
});



System.register("github:angular-ui/ui-router@0.2.10", ["github:angular-ui/ui-router@0.2.10/release/angular-ui-router"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:angular-ui/ui-router@0.2.10/release/angular-ui-router");
  global.define = __define;
  return module.exports;
});



(function() {
function define(){};  define.amd = {};
System.register("github:ramda/ramda@0.8.0", ["github:ramda/ramda@0.8.0/ramda"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('github:ramda/ramda@0.8.0/ramda'));
});


})();
System.register("views/home/home-config", ["./home.html!", "./home-controller"], function($__export) {
  "use strict";
  var __moduleName = "views/home/home-config";
  var template,
      controller,
      config;
  return {
    setters: [function(m) {
      template = m.default;
    }, function(m) {
      controller = m.default;
    }],
    execute: function() {
      config = function config($stateProvider) {
        $stateProvider.state('app.home', {
          url: '/home',
          views: {'content': {
              template: template,
              controller: controller.name + ' as vm'
            }}
        });
      };
      $__export('default', config);
    }
  };
});



System.register("components/header/header-directive", ["./header.html!"], function($__export) {
  "use strict";
  var __moduleName = "components/header/header-directive";
  var template,
      directive;
  return {
    setters: [function(m) {
      template = m.default;
    }],
    execute: function() {
      directive = function tocHeader() {
        return {
          restrict: 'E',
          template: template
        };
      };
      $__export('default', directive);
    }
  };
});



System.register("app-config", ["app.html!"], function($__export) {
  "use strict";
  var __moduleName = "app-config";
  var template,
      config;
  return {
    setters: [function(m) {
      template = m.default;
    }],
    execute: function() {
      config = function config($stateProvider, $urlRouterProvider) {
        $stateProvider.state('app', {
          url: "/app",
          abstract: true,
          template: template
        });
        $urlRouterProvider.otherwise('/app/home');
      };
      $__export('default', config);
    }
  };
});



System.register("libraries/ramda/ramda", ["angular", "ramda"], function($__export) {
  "use strict";
  var __moduleName = "libraries/ramda/ramda";
  var angular,
      R,
      library;
  return {
    setters: [function(m) {
      angular = m.default;
    }, function(m) {
      R = m.default;
    }],
    execute: function() {
      library = angular.module('toc.libraries.ramda', []).factory('R', (function() {
        return R;
      }));
      $__export('default', library);
    }
  };
});



System.register("views/home/home", ["angular", "services/contacts/contacts", "./home-config", "./home-controller", "./home-service"], function($__export) {
  "use strict";
  var __moduleName = "views/home/home";
  var angular,
      contacts,
      config,
      controller,
      service,
      home;
  return {
    setters: [function(m) {
      angular = m.default;
    }, function(m) {
      contacts = m.default;
    }, function(m) {
      config = m.default;
    }, function(m) {
      controller = m.default;
    }, function(m) {
      service = m.default;
    }],
    execute: function() {
      home = angular.module('toc.views.home', [contacts.name]).config(config).controller(controller.name, controller).factory(service.name, service);
      $__export('default', home);
    }
  };
});



System.register("components/header/header", ["angular", "./header-directive"], function($__export) {
  "use strict";
  var __moduleName = "components/header/header";
  var angular,
      directive,
      header;
  return {
    setters: [function(m) {
      angular = m.default;
    }, function(m) {
      directive = m.default;
    }],
    execute: function() {
      header = angular.module('toc.components.header', []).directive(directive.name, directive);
      $__export('default', header);
    }
  };
});



System.register("github:driftyco/ionic-bower@1.0.0-beta.14/js/ionic-angular", ["../css/ionic.css!", "./ionic", "angular", "angular-animate", "angular-sanitize", "angular-ui-router"], false, function(__require, __exports, __module) {
  System.get("@@global-helpers").prepareGlobal(__module.id, ["../css/ionic.css!", "./ionic", "angular", "angular-animate", "angular-sanitize", "angular-ui-router"]);
  (function() {
    "format global";
    "deps ../css/ionic.css!";
    "deps ./ionic";
    "deps angular";
    "deps angular-animate";
    "deps angular-sanitize";
    "deps angular-ui-router";
    (function() {
      var deprecated = {
        method: function(msg, log, fn) {
          var called = false;
          return function deprecatedMethod() {
            if (!called) {
              called = true;
              log(msg);
            }
            return fn.apply(this, arguments);
          };
        },
        field: function(msg, log, parent, field, val) {
          var called = false;
          var getter = function() {
            if (!called) {
              called = true;
              log(msg);
            }
            return val;
          };
          var setter = function(v) {
            if (!called) {
              called = true;
              log(msg);
            }
            val = v;
            return v;
          };
          Object.defineProperty(parent, field, {
            get: getter,
            set: setter,
            enumerable: true
          });
          return;
        }
      };
      var IonicModule = angular.module('ionic', ['ngAnimate', 'ngSanitize', 'ui.router']),
          extend = angular.extend,
          forEach = angular.forEach,
          isDefined = angular.isDefined,
          isNumber = angular.isNumber,
          isString = angular.isString,
          jqLite = angular.element;
      IonicModule.factory('$ionicActionSheet', ['$rootScope', '$compile', '$animate', '$timeout', '$ionicTemplateLoader', '$ionicPlatform', '$ionicBody', function($rootScope, $compile, $animate, $timeout, $ionicTemplateLoader, $ionicPlatform, $ionicBody) {
        return {show: actionSheet};
        function actionSheet(opts) {
          var scope = $rootScope.$new(true);
          angular.extend(scope, {
            cancel: angular.noop,
            destructiveButtonClicked: angular.noop,
            buttonClicked: angular.noop,
            $deregisterBackButton: angular.noop,
            buttons: [],
            cancelOnStateChange: true
          }, opts || {});
          var element = scope.element = $compile('<ion-action-sheet ng-class="cssClass" buttons="buttons"></ion-action-sheet>')(scope);
          var sheetEl = jqLite(element[0].querySelector('.action-sheet-wrapper'));
          var stateChangeListenDone = scope.cancelOnStateChange ? $rootScope.$on('$stateChangeSuccess', function() {
            scope.cancel();
          }) : angular.noop;
          scope.removeSheet = function(done) {
            if (scope.removed)
              return;
            scope.removed = true;
            sheetEl.removeClass('action-sheet-up');
            $timeout(function() {
              $ionicBody.removeClass('action-sheet-open');
            }, 400);
            scope.$deregisterBackButton();
            stateChangeListenDone();
            $animate.removeClass(element, 'active').then(function() {
              scope.$destroy();
              element.remove();
              scope.cancel.$scope = sheetEl = null;
              (done || angular.noop)();
            });
          };
          scope.showSheet = function(done) {
            if (scope.removed)
              return;
            $ionicBody.append(element).addClass('action-sheet-open');
            $animate.addClass(element, 'active').then(function() {
              if (scope.removed)
                return;
              (done || angular.noop)();
            });
            $timeout(function() {
              if (scope.removed)
                return;
              sheetEl.addClass('action-sheet-up');
            }, 20, false);
          };
          scope.$deregisterBackButton = $ionicPlatform.registerBackButtonAction(function() {
            $timeout(scope.cancel);
          }, PLATFORM_BACK_BUTTON_PRIORITY_ACTION_SHEET);
          scope.cancel = function() {
            scope.removeSheet(opts.cancel);
          };
          scope.buttonClicked = function(index) {
            if (opts.buttonClicked(index, opts.buttons[index]) === true) {
              scope.removeSheet();
            }
          };
          scope.destructiveButtonClicked = function() {
            if (opts.destructiveButtonClicked() === true) {
              scope.removeSheet();
            }
          };
          scope.showSheet();
          scope.cancel.$scope = scope;
          return scope.cancel;
        }
      }]);
      jqLite.prototype.addClass = function(cssClasses) {
        var x,
            y,
            cssClass,
            el,
            splitClasses,
            existingClasses;
        if (cssClasses && cssClasses != 'ng-scope' && cssClasses != 'ng-isolate-scope') {
          for (x = 0; x < this.length; x++) {
            el = this[x];
            if (el.setAttribute) {
              if (cssClasses.indexOf(' ') < 0 && el.classList.add) {
                el.classList.add(cssClasses);
              } else {
                existingClasses = (' ' + (el.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, " ");
                splitClasses = cssClasses.split(' ');
                for (y = 0; y < splitClasses.length; y++) {
                  cssClass = splitClasses[y].trim();
                  if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
                    existingClasses += cssClass + ' ';
                  }
                }
                el.setAttribute('class', existingClasses.trim());
              }
            }
          }
        }
        return this;
      };
      jqLite.prototype.removeClass = function(cssClasses) {
        var x,
            y,
            splitClasses,
            cssClass,
            el;
        if (cssClasses) {
          for (x = 0; x < this.length; x++) {
            el = this[x];
            if (el.getAttribute) {
              if (cssClasses.indexOf(' ') < 0 && el.classList.remove) {
                el.classList.remove(cssClasses);
              } else {
                splitClasses = cssClasses.split(' ');
                for (y = 0; y < splitClasses.length; y++) {
                  cssClass = splitClasses[y];
                  el.setAttribute('class', ((" " + (el.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").replace(" " + cssClass.trim() + " ", " ")).trim());
                }
              }
            }
          }
        }
        return this;
      };
      IonicModule.factory('$$ionicAttachDrag', [function() {
        return attachDrag;
        function attachDrag(scope, element, options) {
          var opts = extend({}, {
            getDistance: function() {
              return opts.element.prop('offsetWidth');
            },
            onDragStart: angular.noop,
            onDrag: angular.noop,
            onDragEnd: angular.noop
          }, options);
          var dragStartGesture = ionic.onGesture('dragstart', handleDragStart, element[0]);
          var dragGesture = ionic.onGesture('drag', handleDrag, element[0]);
          var dragEndGesture = ionic.onGesture('dragend', handleDragEnd, element[0]);
          scope.$on('$destroy', function() {
            ionic.offGesture(dragStartGesture, 'dragstart', handleDragStart);
            ionic.offGesture(dragGesture, 'drag', handleDrag);
            ionic.offGesture(dragEndGesture, 'dragend', handleDragEnd);
          });
          var isDragging = false;
          element.on('touchmove pointermove mousemove', function(ev) {
            if (isDragging)
              ev.preventDefault();
          });
          element.on('touchend mouseup mouseleave', function(ev) {
            isDragging = false;
          });
          var dragState;
          function handleDragStart(ev) {
            if (dragState)
              return;
            if (opts.onDragStart() !== false) {
              dragState = {
                startX: ev.gesture.center.pageX,
                startY: ev.gesture.center.pageY,
                distance: opts.getDistance()
              };
            }
          }
          function handleDrag(ev) {
            if (!dragState)
              return;
            var deltaX = dragState.startX - ev.gesture.center.pageX;
            var deltaY = dragState.startY - ev.gesture.center.pageY;
            var isVertical = ev.gesture.direction === 'up' || ev.gesture.direction === 'down';
            if (isVertical && Math.abs(deltaY) > Math.abs(deltaX) * 2) {
              handleDragEnd(ev);
              return;
            }
            if (Math.abs(deltaX) > Math.abs(deltaY) * 2) {
              isDragging = true;
            }
            var percent = getDragPercent(ev.gesture.center.pageX);
            opts.onDrag(percent);
          }
          function handleDragEnd(ev) {
            if (!dragState)
              return;
            var percent = getDragPercent(ev.gesture.center.pageX);
            options.onDragEnd(percent, ev.gesture.velocityX);
            dragState = null;
          }
          function getDragPercent(x) {
            var delta = dragState.startX - x;
            var percent = delta / dragState.distance;
            return percent;
          }
        }
      }]);
      IonicModule.factory('$ionicBackdrop', ['$document', '$timeout', function($document, $timeout) {
        var el = jqLite('<div class="backdrop">');
        var backdropHolds = 0;
        $document[0].body.appendChild(el[0]);
        return {
          retain: retain,
          release: release,
          getElement: getElement,
          _element: el
        };
        function retain() {
          if ((++backdropHolds) === 1) {
            el.addClass('visible');
            ionic.requestAnimationFrame(function() {
              backdropHolds && el.addClass('active');
            });
          }
        }
        function release() {
          if ((--backdropHolds) === 0) {
            el.removeClass('active');
            $timeout(function() {
              !backdropHolds && el.removeClass('visible');
            }, 400, false);
          }
        }
        function getElement() {
          return el;
        }
      }]);
      IonicModule.factory('$ionicBind', ['$parse', '$interpolate', function($parse, $interpolate) {
        var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/;
        return function(scope, attrs, bindDefinition) {
          forEach(bindDefinition || {}, function(definition, scopeName) {
            var match = definition.match(LOCAL_REGEXP) || [],
                attrName = match[3] || scopeName,
                mode = match[1],
                parentGet,
                unwatch;
            switch (mode) {
              case '@':
                if (!attrs[attrName]) {
                  return;
                }
                attrs.$observe(attrName, function(value) {
                  scope[scopeName] = value;
                });
                if (attrs[attrName]) {
                  scope[scopeName] = $interpolate(attrs[attrName])(scope);
                }
                break;
              case '=':
                if (!attrs[attrName]) {
                  return;
                }
                unwatch = scope.$watch(attrs[attrName], function(value) {
                  scope[scopeName] = value;
                });
                scope.$on('$destroy', unwatch);
                break;
              case '&':
                if (attrs[attrName] && attrs[attrName].match(RegExp(scopeName + '\(.*?\)'))) {
                  throw new Error('& expression binding "' + scopeName + '" looks like it will recursively call "' + attrs[attrName] + '" and cause a stack overflow! Please choose a different scopeName.');
                }
                parentGet = $parse(attrs[attrName]);
                scope[scopeName] = function(locals) {
                  return parentGet(scope, locals);
                };
                break;
            }
          });
        };
      }]);
      IonicModule.factory('$ionicBody', ['$document', function($document) {
        return {
          addClass: function() {
            for (var x = 0; x < arguments.length; x++) {
              $document[0].body.classList.add(arguments[x]);
            }
            return this;
          },
          removeClass: function() {
            for (var x = 0; x < arguments.length; x++) {
              $document[0].body.classList.remove(arguments[x]);
            }
            return this;
          },
          enableClass: function(shouldEnableClass) {
            var args = Array.prototype.slice.call(arguments).slice(1);
            if (shouldEnableClass) {
              this.addClass.apply(this, args);
            } else {
              this.removeClass.apply(this, args);
            }
            return this;
          },
          append: function(ele) {
            $document[0].body.appendChild(ele.length ? ele[0] : ele);
            return this;
          },
          get: function() {
            return $document[0].body;
          }
        };
      }]);
      IonicModule.factory('$ionicClickBlock', ['$document', '$ionicBody', '$timeout', function($document, $ionicBody, $timeout) {
        var CSS_HIDE = 'click-block-hide';
        var cbEle,
            fallbackTimer,
            pendingShow;
        function addClickBlock() {
          if (pendingShow) {
            if (cbEle) {
              cbEle.classList.remove(CSS_HIDE);
            } else {
              cbEle = $document[0].createElement('div');
              cbEle.className = 'click-block';
              $ionicBody.append(cbEle);
            }
            pendingShow = false;
          }
        }
        function removeClickBlock() {
          cbEle && cbEle.classList.add(CSS_HIDE);
        }
        return {
          show: function(autoExpire) {
            pendingShow = true;
            $timeout.cancel(fallbackTimer);
            fallbackTimer = $timeout(this.hide, autoExpire || 310);
            ionic.requestAnimationFrame(addClickBlock);
          },
          hide: function() {
            pendingShow = false;
            $timeout.cancel(fallbackTimer);
            ionic.requestAnimationFrame(removeClickBlock);
          }
        };
      }]);
      IonicModule.factory('$collectionDataSource', ['$cacheFactory', '$parse', '$rootScope', function($cacheFactory, $parse, $rootScope) {
        function hideWithTransform(element) {
          element.css(ionic.CSS.TRANSFORM, 'translate3d(-2000px,-2000px,0)');
        }
        function CollectionRepeatDataSource(options) {
          var self = this;
          this.scope = options.scope;
          this.transcludeFn = options.transcludeFn;
          this.transcludeParent = options.transcludeParent;
          this.element = options.element;
          this.keyExpr = options.keyExpr;
          this.listExpr = options.listExpr;
          this.trackByExpr = options.trackByExpr;
          this.heightGetter = options.heightGetter;
          this.widthGetter = options.widthGetter;
          this.dimensions = [];
          this.data = [];
          this.attachedItems = {};
          this.BACKUP_ITEMS_LENGTH = 20;
          this.backupItemsArray = [];
        }
        CollectionRepeatDataSource.prototype = {
          setup: function() {
            if (this.isSetup)
              return;
            this.isSetup = true;
            for (var i = 0; i < this.BACKUP_ITEMS_LENGTH; i++) {
              this.detachItem(this.createItem());
            }
          },
          destroy: function() {
            this.dimensions.length = 0;
            this.data = null;
            this.backupItemsArray.length = 0;
            this.attachedItems = {};
          },
          calculateDataDimensions: function() {
            var locals = {};
            this.dimensions = this.data.map(function(value, index) {
              locals[this.keyExpr] = value;
              locals.$index = index;
              return {
                width: this.widthGetter(this.scope, locals),
                height: this.heightGetter(this.scope, locals)
              };
            }, this);
            this.dimensions = this.beforeSiblings.concat(this.dimensions).concat(this.afterSiblings);
            this.dataStartIndex = this.beforeSiblings.length;
          },
          createItem: function() {
            var item = {};
            item.scope = this.scope.$new();
            this.transcludeFn(item.scope, function(clone) {
              clone.css('position', 'absolute');
              item.element = clone;
            });
            this.transcludeParent.append(item.element);
            return item;
          },
          getItem: function(index) {
            var item;
            if ((item = this.attachedItems[index])) {} else if ((item = this.backupItemsArray.pop())) {
              ionic.Utils.reconnectScope(item.scope);
            } else {
              item = this.createItem();
            }
            return item;
          },
          attachItemAtIndex: function(index) {
            if (index < this.dataStartIndex) {
              return this.beforeSiblings[index];
            }
            index -= this.dataStartIndex;
            if (index > this.data.length - 1) {
              return this.afterSiblings[index - this.dataStartIndex];
            }
            var item = this.getItem(index);
            var value = this.data[index];
            if (item.index !== index || item.scope[this.keyExpr] !== value) {
              item.index = item.scope.$index = index;
              item.scope[this.keyExpr] = value;
              item.scope.$first = (index === 0);
              item.scope.$last = (index === (this.getLength() - 1));
              item.scope.$middle = !(item.scope.$first || item.scope.$last);
              item.scope.$odd = !(item.scope.$even = (index & 1) === 0);
              if (!$rootScope.$$phase) {
                item.scope.$digest();
              }
            }
            this.attachedItems[index] = item;
            return item;
          },
          destroyItem: function(item) {
            item.element.remove();
            item.scope.$destroy();
            item.scope = null;
            item.element = null;
          },
          detachItem: function(item) {
            delete this.attachedItems[item.index];
            if (item.isOutside) {
              hideWithTransform(item.element);
            } else if (this.backupItemsArray.length >= this.BACKUP_ITEMS_LENGTH) {
              this.destroyItem(item);
            } else {
              this.backupItemsArray.push(item);
              hideWithTransform(item.element);
              ionic.Utils.disconnectScope(item.scope);
            }
          },
          getLength: function() {
            return this.dimensions && this.dimensions.length || 0;
          },
          setData: function(value, beforeSiblings, afterSiblings) {
            this.data = value || [];
            this.beforeSiblings = beforeSiblings || [];
            this.afterSiblings = afterSiblings || [];
            this.calculateDataDimensions();
            this.afterSiblings.forEach(function(item) {
              item.element.css({
                position: 'absolute',
                top: '0',
                left: '0'
              });
              hideWithTransform(item.element);
            });
          }
        };
        return CollectionRepeatDataSource;
      }]);
      IonicModule.factory('$collectionRepeatManager', ['$rootScope', '$timeout', function($rootScope, $timeout) {
        function CollectionRepeatManager(options) {
          var self = this;
          this.dataSource = options.dataSource;
          this.element = options.element;
          this.scrollView = options.scrollView;
          this.isVertical = !!this.scrollView.options.scrollingY;
          this.renderedItems = {};
          this.dimensions = [];
          this.setCurrentIndex(0);
          this.scrollView.__$callback = this.scrollView.__callback;
          this.scrollView.__callback = angular.bind(this, this.renderScroll);
          function getViewportSize() {
            return self.viewportSize;
          }
          if (this.isVertical) {
            this.scrollView.options.getContentHeight = getViewportSize;
            this.scrollValue = function() {
              return this.scrollView.__scrollTop;
            };
            this.scrollMaxValue = function() {
              return this.scrollView.__maxScrollTop;
            };
            this.scrollSize = function() {
              return this.scrollView.__clientHeight;
            };
            this.secondaryScrollSize = function() {
              return this.scrollView.__clientWidth;
            };
            this.transformString = function(y, x) {
              return 'translate3d(' + x + 'px,' + y + 'px,0)';
            };
            this.primaryDimension = function(dim) {
              return dim.height;
            };
            this.secondaryDimension = function(dim) {
              return dim.width;
            };
          } else {
            this.scrollView.options.getContentWidth = getViewportSize;
            this.scrollValue = function() {
              return this.scrollView.__scrollLeft;
            };
            this.scrollMaxValue = function() {
              return this.scrollView.__maxScrollLeft;
            };
            this.scrollSize = function() {
              return this.scrollView.__clientWidth;
            };
            this.secondaryScrollSize = function() {
              return this.scrollView.__clientHeight;
            };
            this.transformString = function(x, y) {
              return 'translate3d(' + x + 'px,' + y + 'px,0)';
            };
            this.primaryDimension = function(dim) {
              return dim.width;
            };
            this.secondaryDimension = function(dim) {
              return dim.height;
            };
          }
        }
        CollectionRepeatManager.prototype = {
          destroy: function() {
            this.renderedItems = {};
            this.render = angular.noop;
            this.calculateDimensions = angular.noop;
            this.dimensions = [];
          },
          calculateDimensions: function() {
            var primaryPos = 0;
            var secondaryPos = 0;
            var secondaryScrollSize = this.secondaryScrollSize();
            var previousItem;
            this.dataSource.beforeSiblings && this.dataSource.beforeSiblings.forEach(calculateSize, this);
            var beforeSize = primaryPos + (previousItem ? previousItem.primarySize : 0);
            primaryPos = secondaryPos = 0;
            previousItem = null;
            var dimensions = this.dataSource.dimensions.map(calculateSize, this);
            var totalSize = primaryPos + (previousItem ? previousItem.primarySize : 0);
            return {
              beforeSize: beforeSize,
              totalSize: totalSize,
              dimensions: dimensions
            };
            function calculateSize(dim) {
              var rect = {
                primarySize: this.primaryDimension(dim),
                secondarySize: Math.min(this.secondaryDimension(dim), secondaryScrollSize)
              };
              if (previousItem) {
                secondaryPos += previousItem.secondarySize;
                if (previousItem.primaryPos === primaryPos && secondaryPos + rect.secondarySize > secondaryScrollSize) {
                  secondaryPos = 0;
                  primaryPos += previousItem.primarySize;
                }
              }
              rect.primaryPos = primaryPos;
              rect.secondaryPos = secondaryPos;
              previousItem = rect;
              return rect;
            }
          },
          resize: function() {
            var result = this.calculateDimensions();
            this.dimensions = result.dimensions;
            this.viewportSize = result.totalSize;
            this.beforeSize = result.beforeSize;
            this.setCurrentIndex(0);
            this.render(true);
            this.dataSource.setup();
          },
          setCurrentIndex: function(index, height) {
            var currentPos = (this.dimensions[index] || {}).primaryPos || 0;
            this.currentIndex = index;
            this.hasPrevIndex = index > 0;
            if (this.hasPrevIndex) {
              this.previousPos = Math.max(currentPos - this.dimensions[index - 1].primarySize, this.dimensions[index - 1].primaryPos);
            }
            this.hasNextIndex = index + 1 < this.dataSource.getLength();
            if (this.hasNextIndex) {
              this.nextPos = Math.min(currentPos + this.dimensions[index + 1].primarySize, this.dimensions[index + 1].primaryPos);
            }
          },
          renderScroll: ionic.animationFrameThrottle(function(transformLeft, transformTop, zoom, wasResize) {
            if (this.isVertical) {
              this.renderIfNeeded(transformTop);
            } else {
              this.renderIfNeeded(transformLeft);
            }
            return this.scrollView.__$callback(transformLeft, transformTop, zoom, wasResize);
          }),
          renderIfNeeded: function(scrollPos) {
            if ((this.hasNextIndex && scrollPos >= this.nextPos) || (this.hasPrevIndex && scrollPos < this.previousPos)) {
              this.render();
            }
          },
          getIndexForScrollValue: function(i, scrollValue) {
            var rect;
            if (scrollValue <= this.dimensions[i].primaryPos) {
              while ((rect = this.dimensions[i - 1]) && rect.primaryPos > scrollValue) {
                i--;
              }
            } else {
              while ((rect = this.dimensions[i + 1]) && rect.primaryPos < scrollValue) {
                i++;
              }
            }
            return i;
          },
          render: function(shouldRedrawAll) {
            var self = this;
            var i;
            var isOutOfBounds = (this.currentIndex >= this.dataSource.getLength());
            if (isOutOfBounds || shouldRedrawAll) {
              for (i in this.renderedItems) {
                this.removeItem(i);
              }
              if (isOutOfBounds)
                return;
            }
            var rect;
            var scrollValue = this.scrollValue();
            var scrollSize = this.scrollSize();
            var scrollSizeEnd = scrollSize + scrollValue;
            var startIndex = this.getIndexForScrollValue(this.currentIndex, scrollValue);
            var renderStartIndex = Math.max(startIndex - 1, 0);
            while (renderStartIndex > 0 && (rect = this.dimensions[renderStartIndex]) && rect.primaryPos === this.dimensions[startIndex - 1].primaryPos) {
              renderStartIndex--;
            }
            i = renderStartIndex;
            while ((rect = this.dimensions[i]) && (rect.primaryPos - rect.primarySize < scrollSizeEnd)) {
              doRender(i, rect);
              i++;
            }
            if (self.dimensions[i]) {
              doRender(i, self.dimensions[i]);
              i++;
            }
            if (self.dimensions[i]) {
              doRender(i, self.dimensions[i]);
            }
            var renderEndIndex = i;
            for (var renderIndex in this.renderedItems) {
              if (renderIndex < renderStartIndex || renderIndex > renderEndIndex) {
                this.removeItem(renderIndex);
              }
            }
            this.setCurrentIndex(startIndex);
            function doRender(dataIndex, rect) {
              if (dataIndex < self.dataSource.dataStartIndex) {} else {
                self.renderItem(dataIndex, rect.primaryPos - self.beforeSize, rect.secondaryPos);
              }
            }
          },
          renderItem: function(dataIndex, primaryPos, secondaryPos) {
            var item = this.dataSource.attachItemAtIndex(dataIndex);
            if (item && item.element) {
              if (item.primaryPos !== primaryPos || item.secondaryPos !== secondaryPos) {
                item.element.css(ionic.CSS.TRANSFORM, this.transformString(primaryPos, secondaryPos));
                item.primaryPos = primaryPos;
                item.secondaryPos = secondaryPos;
              }
              this.renderedItems[dataIndex] = item;
            } else {
              delete this.renderedItems[dataIndex];
            }
          },
          removeItem: function(dataIndex) {
            var item = this.renderedItems[dataIndex];
            if (item) {
              item.primaryPos = item.secondaryPos = null;
              this.dataSource.detachItem(item);
              delete this.renderedItems[dataIndex];
            }
          }
        };
        return CollectionRepeatManager;
      }]);
      IonicModule.factory('$ionicGesture', [function() {
        return {
          on: function(eventType, cb, $element, options) {
            return window.ionic.onGesture(eventType, cb, $element[0], options);
          },
          off: function(gesture, eventType, cb) {
            return window.ionic.offGesture(gesture, eventType, cb);
          }
        };
      }]);
      IonicModule.factory('$ionicHistory', ['$rootScope', '$state', '$location', '$window', '$timeout', '$ionicViewSwitcher', '$ionicNavViewDelegate', function($rootScope, $state, $location, $window, $timeout, $ionicViewSwitcher, $ionicNavViewDelegate) {
        var ACTION_INITIAL_VIEW = 'initialView';
        var ACTION_NEW_VIEW = 'newView';
        var ACTION_MOVE_BACK = 'moveBack';
        var ACTION_MOVE_FORWARD = 'moveForward';
        var DIRECTION_BACK = 'back';
        var DIRECTION_FORWARD = 'forward';
        var DIRECTION_ENTER = 'enter';
        var DIRECTION_EXIT = 'exit';
        var DIRECTION_SWAP = 'swap';
        var DIRECTION_NONE = 'none';
        var stateChangeCounter = 0;
        var lastStateId,
            nextViewOptions,
            nextViewExpireTimer,
            forcedNav;
        var viewHistory = {
          histories: {root: {
              historyId: 'root',
              parentHistoryId: null,
              stack: [],
              cursor: -1
            }},
          views: {},
          backView: null,
          forwardView: null,
          currentView: null
        };
        var View = function() {};
        View.prototype.initialize = function(data) {
          if (data) {
            for (var name in data)
              this[name] = data[name];
            return this;
          }
          return null;
        };
        View.prototype.go = function() {
          if (this.stateName) {
            return $state.go(this.stateName, this.stateParams);
          }
          if (this.url && this.url !== $location.url()) {
            if (viewHistory.backView === this) {
              return $window.history.go(-1);
            } else if (viewHistory.forwardView === this) {
              return $window.history.go(1);
            }
            $location.url(this.url);
            return;
          }
          return null;
        };
        View.prototype.destroy = function() {
          if (this.scope) {
            this.scope.$destroy && this.scope.$destroy();
            this.scope = null;
          }
        };
        function getViewById(viewId) {
          return (viewId ? viewHistory.views[viewId] : null);
        }
        function getBackView(view) {
          return (view ? getViewById(view.backViewId) : null);
        }
        function getForwardView(view) {
          return (view ? getViewById(view.forwardViewId) : null);
        }
        function getHistoryById(historyId) {
          return (historyId ? viewHistory.histories[historyId] : null);
        }
        function getHistory(scope) {
          var histObj = getParentHistoryObj(scope);
          if (!viewHistory.histories[histObj.historyId]) {
            viewHistory.histories[histObj.historyId] = {
              historyId: histObj.historyId,
              parentHistoryId: getParentHistoryObj(histObj.scope.$parent).historyId,
              stack: [],
              cursor: -1
            };
          }
          return getHistoryById(histObj.historyId);
        }
        function getParentHistoryObj(scope) {
          var parentScope = scope;
          while (parentScope) {
            if (parentScope.hasOwnProperty('$historyId')) {
              return {
                historyId: parentScope.$historyId,
                scope: parentScope
              };
            }
            parentScope = parentScope.$parent;
          }
          return {
            historyId: 'root',
            scope: $rootScope
          };
        }
        function setNavViews(viewId) {
          viewHistory.currentView = getViewById(viewId);
          viewHistory.backView = getBackView(viewHistory.currentView);
          viewHistory.forwardView = getForwardView(viewHistory.currentView);
        }
        function getCurrentStateId() {
          var id;
          if ($state && $state.current && $state.current.name) {
            id = $state.current.name;
            if ($state.params) {
              for (var key in $state.params) {
                if ($state.params.hasOwnProperty(key) && $state.params[key]) {
                  id += "_" + key + "=" + $state.params[key];
                }
              }
            }
            return id;
          }
          return ionic.Utils.nextUid();
        }
        function getCurrentStateParams() {
          var rtn;
          if ($state && $state.params) {
            for (var key in $state.params) {
              if ($state.params.hasOwnProperty(key)) {
                rtn = rtn || {};
                rtn[key] = $state.params[key];
              }
            }
          }
          return rtn;
        }
        return {
          register: function(parentScope, viewLocals) {
            var currentStateId = getCurrentStateId(),
                hist = getHistory(parentScope),
                currentView = viewHistory.currentView,
                backView = viewHistory.backView,
                forwardView = viewHistory.forwardView,
                viewId = null,
                action = null,
                direction = DIRECTION_NONE,
                historyId = hist.historyId,
                url = $location.url(),
                tmp,
                x,
                ele;
            if (lastStateId !== currentStateId) {
              lastStateId = currentStateId;
              stateChangeCounter++;
            }
            if (forcedNav) {
              viewId = forcedNav.viewId;
              action = forcedNav.action;
              direction = forcedNav.direction;
              forcedNav = null;
            } else if (backView && backView.stateId === currentStateId) {
              viewId = backView.viewId;
              historyId = backView.historyId;
              action = ACTION_MOVE_BACK;
              if (backView.historyId === currentView.historyId) {
                direction = DIRECTION_BACK;
              } else if (currentView) {
                direction = DIRECTION_EXIT;
                tmp = getHistoryById(backView.historyId);
                if (tmp && tmp.parentHistoryId === currentView.historyId) {
                  direction = DIRECTION_ENTER;
                } else {
                  tmp = getHistoryById(currentView.historyId);
                  if (tmp && tmp.parentHistoryId === hist.parentHistoryId) {
                    direction = DIRECTION_SWAP;
                  }
                }
              }
            } else if (forwardView && forwardView.stateId === currentStateId) {
              viewId = forwardView.viewId;
              historyId = forwardView.historyId;
              action = ACTION_MOVE_FORWARD;
              if (forwardView.historyId === currentView.historyId) {
                direction = DIRECTION_FORWARD;
              } else if (currentView) {
                direction = DIRECTION_EXIT;
                if (currentView.historyId === hist.parentHistoryId) {
                  direction = DIRECTION_ENTER;
                } else {
                  tmp = getHistoryById(currentView.historyId);
                  if (tmp && tmp.parentHistoryId === hist.parentHistoryId) {
                    direction = DIRECTION_SWAP;
                  }
                }
              }
              tmp = getParentHistoryObj(parentScope);
              if (forwardView.historyId && tmp.scope) {
                tmp.scope.$historyId = forwardView.historyId;
                historyId = forwardView.historyId;
              }
            } else if (currentView && currentView.historyId !== historyId && hist.cursor > -1 && hist.stack.length > 0 && hist.cursor < hist.stack.length && hist.stack[hist.cursor].stateId === currentStateId) {
              var switchToView = hist.stack[hist.cursor];
              viewId = switchToView.viewId;
              historyId = switchToView.historyId;
              action = ACTION_MOVE_BACK;
              direction = DIRECTION_SWAP;
              tmp = getHistoryById(currentView.historyId);
              if (tmp && tmp.parentHistoryId === historyId) {
                direction = DIRECTION_EXIT;
              } else {
                tmp = getHistoryById(historyId);
                if (tmp && tmp.parentHistoryId === currentView.historyId) {
                  direction = DIRECTION_ENTER;
                }
              }
              tmp = getViewById(switchToView.backViewId);
              if (tmp && switchToView.historyId !== tmp.historyId) {
                hist.stack[hist.cursor].backViewId = currentView.viewId;
              }
            } else {
              ele = $ionicViewSwitcher.createViewEle(viewLocals);
              if (this.isAbstractEle(ele, viewLocals)) {
                void 0;
                return {
                  action: 'abstractView',
                  direction: DIRECTION_NONE,
                  ele: ele
                };
              }
              viewId = ionic.Utils.nextUid();
              if (currentView) {
                currentView.forwardViewId = viewId;
                action = ACTION_NEW_VIEW;
                if (forwardView && currentView.stateId !== forwardView.stateId && currentView.historyId === forwardView.historyId) {
                  tmp = getHistoryById(forwardView.historyId);
                  if (tmp) {
                    for (x = tmp.stack.length - 1; x >= forwardView.index; x--) {
                      tmp.stack[x].destroy();
                      tmp.stack.splice(x);
                    }
                    historyId = forwardView.historyId;
                  }
                }
                if (hist.historyId === currentView.historyId) {
                  direction = DIRECTION_FORWARD;
                } else if (currentView.historyId !== hist.historyId) {
                  direction = DIRECTION_ENTER;
                  tmp = getHistoryById(currentView.historyId);
                  if (tmp && tmp.parentHistoryId === hist.parentHistoryId) {
                    direction = DIRECTION_SWAP;
                  } else {
                    tmp = getHistoryById(tmp.parentHistoryId);
                    if (tmp && tmp.historyId === hist.historyId) {
                      direction = DIRECTION_EXIT;
                    }
                  }
                }
              } else {
                action = ACTION_INITIAL_VIEW;
              }
              if (stateChangeCounter < 2) {
                direction = DIRECTION_NONE;
              }
              viewHistory.views[viewId] = this.createView({
                viewId: viewId,
                index: hist.stack.length,
                historyId: hist.historyId,
                backViewId: (currentView && currentView.viewId ? currentView.viewId : null),
                forwardViewId: null,
                stateId: currentStateId,
                stateName: this.currentStateName(),
                stateParams: getCurrentStateParams(),
                url: url
              });
              hist.stack.push(viewHistory.views[viewId]);
            }
            $timeout.cancel(nextViewExpireTimer);
            if (nextViewOptions) {
              if (nextViewOptions.disableAnimate)
                direction = DIRECTION_NONE;
              if (nextViewOptions.disableBack)
                viewHistory.views[viewId].backViewId = null;
              if (nextViewOptions.historyRoot) {
                for (x = 0; x < hist.stack.length; x++) {
                  if (hist.stack[x].viewId === viewId) {
                    hist.stack[x].index = 0;
                    hist.stack[x].backViewId = hist.stack[x].forwardViewId = null;
                  } else {
                    delete viewHistory.views[hist.stack[x].viewId];
                  }
                }
                hist.stack = [viewHistory.views[viewId]];
              }
              nextViewOptions = null;
            }
            setNavViews(viewId);
            if (viewHistory.backView && historyId == viewHistory.backView.historyId && currentStateId == viewHistory.backView.stateId && url == viewHistory.backView.url) {
              for (x = 0; x < hist.stack.length; x++) {
                if (hist.stack[x].viewId == viewId) {
                  action = 'dupNav';
                  direction = DIRECTION_NONE;
                  hist.stack[x - 1].forwardViewId = viewHistory.forwardView = null;
                  viewHistory.currentView.index = viewHistory.backView.index;
                  viewHistory.currentView.backViewId = viewHistory.backView.backViewId;
                  viewHistory.backView = getBackView(viewHistory.backView);
                  hist.stack.splice(x, 1);
                  break;
                }
              }
            }
            void 0;
            hist.cursor = viewHistory.currentView.index;
            return {
              viewId: viewId,
              action: action,
              direction: direction,
              historyId: historyId,
              enableBack: !!(viewHistory.backView && viewHistory.backView.historyId === viewHistory.currentView.historyId),
              isHistoryRoot: (viewHistory.currentView.index === 0),
              ele: ele
            };
          },
          registerHistory: function(scope) {
            scope.$historyId = ionic.Utils.nextUid();
          },
          createView: function(data) {
            var newView = new View();
            return newView.initialize(data);
          },
          getViewById: getViewById,
          viewHistory: function() {
            return viewHistory;
          },
          currentView: function(view) {
            if (arguments.length) {
              viewHistory.currentView = view;
            }
            return viewHistory.currentView;
          },
          currentHistoryId: function() {
            return viewHistory.currentView ? viewHistory.currentView.historyId : null;
          },
          currentTitle: function(val) {
            if (viewHistory.currentView) {
              if (arguments.length) {
                viewHistory.currentView.title = val;
              }
              return viewHistory.currentView.title;
            }
          },
          backView: function(view) {
            if (arguments.length) {
              viewHistory.backView = view;
            }
            return viewHistory.backView;
          },
          backTitle: function() {
            if (viewHistory.backView) {
              return viewHistory.backView.title;
            }
          },
          forwardView: function(view) {
            if (arguments.length) {
              viewHistory.forwardView = view;
            }
            return viewHistory.forwardView;
          },
          currentStateName: function() {
            return ($state && $state.current ? $state.current.name : null);
          },
          isCurrentStateNavView: function(navView) {
            return !!($state && $state.current && $state.current.views && $state.current.views[navView]);
          },
          goToHistoryRoot: function(historyId) {
            if (historyId) {
              var hist = getHistoryById(historyId);
              if (hist && hist.stack.length) {
                if (viewHistory.currentView && viewHistory.currentView.viewId === hist.stack[0].viewId) {
                  return;
                }
                forcedNav = {
                  viewId: hist.stack[0].viewId,
                  action: ACTION_MOVE_BACK,
                  direction: DIRECTION_BACK
                };
                hist.stack[0].go();
              }
            }
          },
          goBack: function() {
            viewHistory.backView && viewHistory.backView.go();
          },
          clearHistory: function() {
            var histories = viewHistory.histories,
                currentView = viewHistory.currentView;
            if (histories) {
              for (var historyId in histories) {
                if (histories[historyId].stack) {
                  histories[historyId].stack = [];
                  histories[historyId].cursor = -1;
                }
                if (currentView && currentView.historyId === historyId) {
                  currentView.backViewId = currentView.forwardViewId = null;
                  histories[historyId].stack.push(currentView);
                } else if (histories[historyId].destroy) {
                  histories[historyId].destroy();
                }
              }
            }
            for (var viewId in viewHistory.views) {
              if (viewId !== currentView.viewId) {
                delete viewHistory.views[viewId];
              }
            }
            if (currentView) {
              setNavViews(currentView.viewId);
            }
          },
          clearCache: function() {
            $ionicNavViewDelegate._instances.forEach(function(instance) {
              instance.clearCache();
            });
          },
          nextViewOptions: function(opts) {
            if (arguments.length) {
              $timeout.cancel(nextViewExpireTimer);
              if (opts === null) {
                nextViewOptions = opts;
              } else {
                nextViewOptions = nextViewOptions || {};
                extend(nextViewOptions, opts);
                if (nextViewOptions.expire) {
                  nextViewExpireTimer = $timeout(function() {
                    nextViewOptions = null;
                  }, nextViewOptions.expire);
                }
              }
            }
            return nextViewOptions;
          },
          isAbstractEle: function(ele, viewLocals) {
            if (viewLocals && viewLocals.$$state && viewLocals.$$state.self.abstract) {
              return true;
            }
            return !!(ele && (isAbstractTag(ele) || isAbstractTag(ele.children())));
          },
          isActiveScope: function(scope) {
            if (!scope)
              return false;
            var climbScope = scope;
            var currentHistoryId = this.currentHistoryId();
            var foundHistoryId;
            while (climbScope) {
              if (climbScope.$$disconnected) {
                return false;
              }
              if (!foundHistoryId && climbScope.hasOwnProperty('$historyId')) {
                foundHistoryId = true;
              }
              if (currentHistoryId) {
                if (climbScope.hasOwnProperty('$historyId') && currentHistoryId == climbScope.$historyId) {
                  return true;
                }
                if (climbScope.hasOwnProperty('$activeHistoryId')) {
                  if (currentHistoryId == climbScope.$activeHistoryId) {
                    if (climbScope.hasOwnProperty('$historyId')) {
                      return true;
                    }
                    if (!foundHistoryId) {
                      return true;
                    }
                  }
                }
              }
              if (foundHistoryId && climbScope.hasOwnProperty('$activeHistoryId')) {
                foundHistoryId = false;
              }
              climbScope = climbScope.$parent;
            }
            return currentHistoryId ? currentHistoryId == 'root' : true;
          }
        };
        function isAbstractTag(ele) {
          return ele && ele.length && /ion-side-menus|ion-tabs/i.test(ele[0].tagName);
        }
      }]).run(['$rootScope', '$state', '$location', '$document', '$ionicPlatform', '$ionicHistory', function($rootScope, $state, $location, $document, $ionicPlatform, $ionicHistory) {
        $rootScope.$on('$ionicView.beforeEnter', function() {
          ionic.keyboard && ionic.keyboard.hide && ionic.keyboard.hide();
        });
        $rootScope.$on('$ionicHistory.change', function(e, data) {
          if (!data)
            return;
          var viewHistory = $ionicHistory.viewHistory();
          var hist = (data.historyId ? viewHistory.histories[data.historyId] : null);
          if (hist && hist.cursor > -1 && hist.cursor < hist.stack.length) {
            var view = hist.stack[hist.cursor];
            return view.go(data);
          }
          if (!data.url && data.uiSref) {
            data.url = $state.href(data.uiSref);
          }
          if (data.url) {
            if (data.url.indexOf('#') === 0) {
              data.url = data.url.replace('#', '');
            }
            if (data.url !== $location.url()) {
              $location.url(data.url);
            }
          }
        });
        $rootScope.$ionicGoBack = function() {
          $ionicHistory.goBack();
        };
        $rootScope.$on('$ionicView.afterEnter', function(ev, data) {
          if (data && data.title) {
            $document[0].title = data.title;
          }
        });
        function onHardwareBackButton(e) {
          var backView = $ionicHistory.backView();
          if (backView) {
            backView.go();
          } else {
            ionic.Platform.exitApp();
          }
          e.preventDefault();
          return false;
        }
        $ionicPlatform.registerBackButtonAction(onHardwareBackButton, PLATFORM_BACK_BUTTON_PRIORITY_VIEW);
      }]);
      IonicModule.provider('$ionicConfig', function() {
        var provider = this;
        provider.platform = {};
        var PLATFORM = 'platform';
        var configProperties = {
          views: {
            maxCache: PLATFORM,
            forwardCache: PLATFORM,
            transition: PLATFORM
          },
          navBar: {
            alignTitle: PLATFORM,
            positionPrimaryButtons: PLATFORM,
            positionSecondaryButtons: PLATFORM,
            transition: PLATFORM
          },
          backButton: {
            icon: PLATFORM,
            text: PLATFORM,
            previousTitleText: PLATFORM
          },
          form: {checkbox: PLATFORM},
          tabs: {
            style: PLATFORM,
            position: PLATFORM
          },
          templates: {maxPrefetch: PLATFORM},
          platform: {}
        };
        createConfig(configProperties, provider, '');
        setPlatformConfig('default', {
          views: {
            maxCache: 10,
            forwardCache: false,
            transition: 'ios'
          },
          navBar: {
            alignTitle: 'center',
            positionPrimaryButtons: 'left',
            positionSecondaryButtons: 'right',
            transition: 'view'
          },
          backButton: {
            icon: 'ion-ios7-arrow-back',
            text: 'Back',
            previousTitleText: true
          },
          form: {checkbox: 'circle'},
          tabs: {
            style: 'standard',
            position: 'bottom'
          },
          templates: {maxPrefetch: 30}
        });
        setPlatformConfig('ios', {});
        setPlatformConfig('android', {
          views: {transition: 'android'},
          navBar: {
            alignTitle: 'left',
            positionPrimaryButtons: 'right',
            positionSecondaryButtons: 'right'
          },
          backButton: {
            icon: 'ion-arrow-left-c',
            text: false,
            previousTitleText: false
          },
          form: {checkbox: 'square'},
          tabs: {
            style: 'striped',
            position: 'top'
          }
        });
        provider.transitions = {
          views: {},
          navBar: {}
        };
        provider.transitions.views.ios = function(enteringEle, leavingEle, direction, shouldAnimate) {
          shouldAnimate = shouldAnimate && (direction == 'forward' || direction == 'back');
          function setStyles(ele, opacity, x) {
            var css = {};
            css[ionic.CSS.TRANSITION_DURATION] = shouldAnimate ? '' : 0;
            css.opacity = opacity;
            css[ionic.CSS.TRANSFORM] = 'translate3d(' + x + '%,0,0)';
            ionic.DomUtil.cachedStyles(ele, css);
          }
          return {
            run: function(step) {
              if (direction == 'forward') {
                setStyles(enteringEle, 1, (1 - step) * 99);
                setStyles(leavingEle, (1 - 0.1 * step), step * -33);
              } else if (direction == 'back') {
                setStyles(enteringEle, (1 - 0.1 * (1 - step)), (1 - step) * -33);
                setStyles(leavingEle, 1, step * 100);
              } else {
                setStyles(enteringEle, 1, 0);
                setStyles(leavingEle, 0, 0);
              }
            },
            shouldAnimate: shouldAnimate
          };
        };
        provider.transitions.navBar.ios = function(enteringHeaderBar, leavingHeaderBar, direction, shouldAnimate) {
          shouldAnimate = shouldAnimate && (direction == 'forward' || direction == 'back');
          function setStyles(ctrl, opacity, titleX, backTextX) {
            var css = {};
            css[ionic.CSS.TRANSITION_DURATION] = shouldAnimate ? '' : 0;
            css.opacity = opacity === 1 ? '' : opacity;
            ctrl.setCss('buttons-left', css);
            ctrl.setCss('buttons-right', css);
            ctrl.setCss('back-button', css);
            css[ionic.CSS.TRANSFORM] = 'translate3d(' + backTextX + 'px,0,0)';
            ctrl.setCss('back-text', css);
            css[ionic.CSS.TRANSFORM] = 'translate3d(' + titleX + 'px,0,0)';
            ctrl.setCss('title', css);
          }
          function enter(ctrlA, ctrlB, step) {
            if (!ctrlA)
              return;
            var titleX = (ctrlA.titleTextX() + ctrlA.titleWidth()) * (1 - step);
            var backTextX = (ctrlB && (ctrlB.titleTextX() - ctrlA.backButtonTextLeft()) * (1 - step)) || 0;
            setStyles(ctrlA, step, titleX, backTextX);
          }
          function leave(ctrlA, ctrlB, step) {
            if (!ctrlA)
              return;
            var titleX = (-(ctrlA.titleTextX() - ctrlB.backButtonTextLeft()) - (ctrlA.titleLeftRight())) * step;
            setStyles(ctrlA, 1 - step, titleX, 0);
          }
          return {
            run: function(step) {
              var enteringHeaderCtrl = enteringHeaderBar.controller();
              var leavingHeaderCtrl = leavingHeaderBar && leavingHeaderBar.controller();
              if (direction == 'back') {
                leave(enteringHeaderCtrl, leavingHeaderCtrl, 1 - step);
                enter(leavingHeaderCtrl, enteringHeaderCtrl, 1 - step);
              } else {
                enter(enteringHeaderCtrl, leavingHeaderCtrl, step);
                leave(leavingHeaderCtrl, enteringHeaderCtrl, step);
              }
            },
            shouldAnimate: shouldAnimate
          };
        };
        provider.transitions.views.android = function(enteringEle, leavingEle, direction, shouldAnimate) {
          shouldAnimate = shouldAnimate && (direction == 'forward' || direction == 'back');
          function setStyles(ele, x) {
            var css = {};
            css[ionic.CSS.TRANSITION_DURATION] = shouldAnimate ? '' : 0;
            css[ionic.CSS.TRANSFORM] = 'translate3d(' + x + '%,0,0)';
            ionic.DomUtil.cachedStyles(ele, css);
          }
          return {
            run: function(step) {
              if (direction == 'forward') {
                setStyles(enteringEle, (1 - step) * 99);
                setStyles(leavingEle, step * -100);
              } else if (direction == 'back') {
                setStyles(enteringEle, (1 - step) * -100);
                setStyles(leavingEle, step * 100);
              } else {
                setStyles(enteringEle, 0);
                setStyles(leavingEle, 0);
              }
            },
            shouldAnimate: shouldAnimate
          };
        };
        provider.transitions.navBar.android = function(enteringHeaderBar, leavingHeaderBar, direction, shouldAnimate) {
          shouldAnimate = shouldAnimate && (direction == 'forward' || direction == 'back');
          function setStyles(ctrl, opacity) {
            if (!ctrl)
              return;
            var css = {};
            css.opacity = opacity === 1 ? '' : opacity;
            ctrl.setCss('buttons-left', css);
            ctrl.setCss('buttons-right', css);
            ctrl.setCss('back-button', css);
            ctrl.setCss('back-text', css);
            ctrl.setCss('title', css);
          }
          return {
            run: function(step) {
              setStyles(enteringHeaderBar.controller(), step);
              setStyles(leavingHeaderBar && leavingHeaderBar.controller(), 1 - step);
            },
            shouldAnimate: true
          };
        };
        provider.transitions.views.none = function(enteringEle, leavingEle) {
          return {run: function(step) {
              provider.transitions.views.android(enteringEle, leavingEle, false, false).run(step);
            }};
        };
        provider.transitions.navBar.none = function(enteringHeaderBar, leavingHeaderBar) {
          return {run: function(step) {
              provider.transitions.navBar.ios(enteringHeaderBar, leavingHeaderBar, false, false).run(step);
              provider.transitions.navBar.android(enteringHeaderBar, leavingHeaderBar, false, false).run(step);
            }};
        };
        function setPlatformConfig(platformName, platformConfigs) {
          configProperties.platform[platformName] = platformConfigs;
          provider.platform[platformName] = {};
          addConfig(configProperties, configProperties.platform[platformName]);
          createConfig(configProperties.platform[platformName], provider.platform[platformName], '');
        }
        function addConfig(configObj, platformObj) {
          for (var n in configObj) {
            if (n != PLATFORM && configObj.hasOwnProperty(n)) {
              if (angular.isObject(configObj[n])) {
                if (!isDefined(platformObj[n])) {
                  platformObj[n] = {};
                }
                addConfig(configObj[n], platformObj[n]);
              } else if (!isDefined(platformObj[n])) {
                platformObj[n] = null;
              }
            }
          }
        }
        function createConfig(configObj, providerObj, platformPath) {
          forEach(configObj, function(value, namespace) {
            if (angular.isObject(configObj[namespace])) {
              providerObj[namespace] = {};
              createConfig(configObj[namespace], providerObj[namespace], platformPath + '.' + namespace);
            } else {
              providerObj[namespace] = function(newValue) {
                if (arguments.length) {
                  configObj[namespace] = newValue;
                  return providerObj;
                }
                if (configObj[namespace] == PLATFORM) {
                  var platformConfig = stringObj(configProperties.platform, ionic.Platform.platform() + platformPath + '.' + namespace);
                  if (platformConfig || platformConfig === false) {
                    return platformConfig;
                  }
                  return stringObj(configProperties.platform, 'default' + platformPath + '.' + namespace);
                }
                return configObj[namespace];
              };
            }
          });
        }
        function stringObj(obj, str) {
          str = str.split(".");
          for (var i = 0; i < str.length; i++) {
            if (obj && isDefined(obj[str[i]])) {
              obj = obj[str[i]];
            } else {
              return null;
            }
          }
          return obj;
        }
        provider.setPlatformConfig = setPlatformConfig;
        provider.$get = function() {
          return provider;
        };
      });
      var LOADING_TPL = '<div class="loading-container">' + '<div class="loading">' + '</div>' + '</div>';
      var LOADING_HIDE_DEPRECATED = '$ionicLoading instance.hide() has been deprecated. Use $ionicLoading.hide().';
      var LOADING_SHOW_DEPRECATED = '$ionicLoading instance.show() has been deprecated. Use $ionicLoading.show().';
      var LOADING_SET_DEPRECATED = '$ionicLoading instance.setContent() has been deprecated. Use $ionicLoading.show({ template: \'my content\' }).';
      IonicModule.constant('$ionicLoadingConfig', {template: '<i class="icon ion-loading-d"></i>'}).factory('$ionicLoading', ['$ionicLoadingConfig', '$ionicBody', '$ionicTemplateLoader', '$ionicBackdrop', '$timeout', '$q', '$log', '$compile', '$ionicPlatform', '$rootScope', function($ionicLoadingConfig, $ionicBody, $ionicTemplateLoader, $ionicBackdrop, $timeout, $q, $log, $compile, $ionicPlatform, $rootScope) {
        var loaderInstance;
        var deregisterBackAction = angular.noop;
        var deregisterStateListener = angular.noop;
        var loadingShowDelay = $q.when();
        return {
          show: showLoader,
          hide: hideLoader,
          _getLoader: getLoader
        };
        function getLoader() {
          if (!loaderInstance) {
            loaderInstance = $ionicTemplateLoader.compile({
              template: LOADING_TPL,
              appendTo: $ionicBody.get()
            }).then(function(loader) {
              var self = loader;
              loader.show = function(options) {
                var templatePromise = options.templateUrl ? $ionicTemplateLoader.load(options.templateUrl) : $q.when(options.template || options.content || '');
                self.scope = options.scope || self.scope;
                if (!this.isShown) {
                  this.hasBackdrop = !options.noBackdrop && options.showBackdrop !== false;
                  if (this.hasBackdrop) {
                    $ionicBackdrop.retain();
                    $ionicBackdrop.getElement().addClass('backdrop-loading');
                  }
                }
                if (options.duration) {
                  $timeout.cancel(this.durationTimeout);
                  this.durationTimeout = $timeout(angular.bind(this, this.hide), +options.duration);
                }
                deregisterBackAction();
                deregisterBackAction = $ionicPlatform.registerBackButtonAction(angular.noop, PLATFORM_BACK_BUTTON_PRIORITY_LOADING);
                templatePromise.then(function(html) {
                  if (html) {
                    var loading = self.element.children();
                    loading.html(html);
                    $compile(loading.contents())(self.scope);
                  }
                  if (self.isShown) {
                    self.element.addClass('visible');
                    ionic.requestAnimationFrame(function() {
                      if (self.isShown) {
                        self.element.addClass('active');
                        $ionicBody.addClass('loading-active');
                      }
                    });
                  }
                });
                this.isShown = true;
              };
              loader.hide = function() {
                deregisterBackAction();
                if (this.isShown) {
                  if (this.hasBackdrop) {
                    $ionicBackdrop.release();
                    $ionicBackdrop.getElement().removeClass('backdrop-loading');
                  }
                  self.element.removeClass('active');
                  $ionicBody.removeClass('loading-active');
                  setTimeout(function() {
                    !self.isShown && self.element.removeClass('visible');
                  }, 200);
                }
                $timeout.cancel(this.durationTimeout);
                this.isShown = false;
              };
              return loader;
            });
          }
          return loaderInstance;
        }
        function showLoader(options) {
          options = extend({}, $ionicLoadingConfig || {}, options || {});
          var delay = options.delay || options.showDelay || 0;
          loadingShowDelay && $timeout.cancel(loadingShowDelay);
          loadingShowDelay = $timeout(angular.noop, delay);
          loadingShowDelay.then(getLoader).then(function(loader) {
            if (options.hideOnStateChange) {
              deregisterStateListener = $rootScope.$on('$stateChangeSuccess', hideLoader);
            }
            return loader.show(options);
          });
          return {
            hide: deprecated.method(LOADING_HIDE_DEPRECATED, $log.error, hideLoader),
            show: deprecated.method(LOADING_SHOW_DEPRECATED, $log.error, function() {
              showLoader(options);
            }),
            setContent: deprecated.method(LOADING_SET_DEPRECATED, $log.error, function(content) {
              getLoader().then(function(loader) {
                loader.show({template: content});
              });
            })
          };
        }
        function hideLoader() {
          deregisterStateListener();
          $timeout.cancel(loadingShowDelay);
          getLoader().then(function(loader) {
            loader.hide();
          });
        }
      }]);
      IonicModule.factory('$ionicModal', ['$rootScope', '$ionicBody', '$compile', '$timeout', '$ionicPlatform', '$ionicTemplateLoader', '$q', '$log', function($rootScope, $ionicBody, $compile, $timeout, $ionicPlatform, $ionicTemplateLoader, $q, $log) {
        var ModalView = ionic.views.Modal.inherit({
          initialize: function(opts) {
            ionic.views.Modal.prototype.initialize.call(this, opts);
            this.animation = opts.animation || 'slide-in-up';
          },
          show: function(target) {
            var self = this;
            if (self.scope.$$destroyed) {
              $log.error('Cannot call ' + self.viewType + '.show() after remove(). Please create a new ' + self.viewType + ' instance.');
              return;
            }
            var modalEl = jqLite(self.modalEl);
            self.el.classList.remove('hide');
            $timeout(function() {
              $ionicBody.addClass(self.viewType + '-open');
            }, 400);
            if (!self.el.parentElement) {
              modalEl.addClass(self.animation);
              $ionicBody.append(self.el);
            }
            if (target && self.positionView) {
              self.positionView(target, modalEl);
              ionic.on('resize', function() {
                ionic.off('resize', null, window);
                self.positionView(target, modalEl);
              }, window);
            }
            modalEl.addClass('ng-enter active').removeClass('ng-leave ng-leave-active');
            self._isShown = true;
            self._deregisterBackButton = $ionicPlatform.registerBackButtonAction(self.hardwareBackButtonClose ? angular.bind(self, self.hide) : angular.noop, PLATFORM_BACK_BUTTON_PRIORITY_MODAL);
            self._isOpenPromise = $q.defer();
            ionic.views.Modal.prototype.show.call(self);
            $timeout(function() {
              modalEl.addClass('ng-enter-active');
              ionic.trigger('resize');
              self.scope.$parent && self.scope.$parent.$broadcast(self.viewType + '.shown', self);
              self.el.classList.add('active');
              self.scope.$broadcast('$ionicHeader.align');
            }, 20);
            return $timeout(function() {
              self.$el.on('click', function(e) {
                if (self.backdropClickToClose && e.target === self.el) {
                  self.hide();
                }
              });
            }, 400);
          },
          hide: function() {
            var self = this;
            var modalEl = jqLite(self.modalEl);
            self.el.classList.remove('active');
            modalEl.addClass('ng-leave');
            $timeout(function() {
              modalEl.addClass('ng-leave-active').removeClass('ng-enter ng-enter-active active');
            }, 20);
            self.$el.off('click');
            self._isShown = false;
            self.scope.$parent && self.scope.$parent.$broadcast(self.viewType + '.hidden', self);
            self._deregisterBackButton && self._deregisterBackButton();
            ionic.views.Modal.prototype.hide.call(self);
            if (self.positionView) {
              ionic.off('resize', null, window);
            }
            return $timeout(function() {
              $ionicBody.removeClass(self.viewType + '-open');
              self.el.classList.add('hide');
            }, self.hideDelay || 320);
          },
          remove: function() {
            var self = this;
            self.scope.$parent && self.scope.$parent.$broadcast(self.viewType + '.removed', self);
            return self.hide().then(function() {
              self.scope.$destroy();
              self.$el.remove();
            });
          },
          isShown: function() {
            return !!this._isShown;
          }
        });
        var createModal = function(templateString, options) {
          var scope = options.scope && options.scope.$new() || $rootScope.$new(true);
          options.viewType = options.viewType || 'modal';
          extend(scope, {
            $hasHeader: false,
            $hasSubheader: false,
            $hasFooter: false,
            $hasSubfooter: false,
            $hasTabs: false,
            $hasTabsTop: false
          });
          var element = $compile('<ion-' + options.viewType + '>' + templateString + '</ion-' + options.viewType + '>')(scope);
          options.$el = element;
          options.el = element[0];
          options.modalEl = options.el.querySelector('.' + options.viewType);
          var modal = new ModalView(options);
          modal.scope = scope;
          if (!options.scope) {
            scope[options.viewType] = modal;
          }
          return modal;
        };
        return {
          fromTemplate: function(templateString, options) {
            var modal = createModal(templateString, options || {});
            return modal;
          },
          fromTemplateUrl: function(url, options, _) {
            var cb;
            if (angular.isFunction(options)) {
              cb = options;
              options = _;
            }
            return $ionicTemplateLoader.load(url).then(function(templateString) {
              var modal = createModal(templateString, options || {});
              cb && cb(modal);
              return modal;
            });
          }
        };
      }]);
      IonicModule.service('$ionicNavBarDelegate', ionic.DelegateService(['align', 'showBackButton', 'showBar', 'title', 'changeTitle', 'setTitle', 'getTitle', 'back', 'getPreviousTitle']));
      IonicModule.service('$ionicNavViewDelegate', ionic.DelegateService(['clearCache']));
      var PLATFORM_BACK_BUTTON_PRIORITY_VIEW = 100;
      var PLATFORM_BACK_BUTTON_PRIORITY_SIDE_MENU = 150;
      var PLATFORM_BACK_BUTTON_PRIORITY_MODAL = 200;
      var PLATFORM_BACK_BUTTON_PRIORITY_ACTION_SHEET = 300;
      var PLATFORM_BACK_BUTTON_PRIORITY_POPUP = 400;
      var PLATFORM_BACK_BUTTON_PRIORITY_LOADING = 500;
      IonicModule.provider('$ionicPlatform', function() {
        return {$get: ['$q', '$rootScope', function($q, $rootScope) {
            var self = {
              onHardwareBackButton: function(cb) {
                ionic.Platform.ready(function() {
                  document.addEventListener('backbutton', cb, false);
                });
              },
              offHardwareBackButton: function(fn) {
                ionic.Platform.ready(function() {
                  document.removeEventListener('backbutton', fn);
                });
              },
              $backButtonActions: {},
              registerBackButtonAction: function(fn, priority, actionId) {
                if (!self._hasBackButtonHandler) {
                  self.$backButtonActions = {};
                  self.onHardwareBackButton(self.hardwareBackButtonClick);
                  self._hasBackButtonHandler = true;
                }
                var action = {
                  id: (actionId ? actionId : ionic.Utils.nextUid()),
                  priority: (priority ? priority : 0),
                  fn: fn
                };
                self.$backButtonActions[action.id] = action;
                return function() {
                  delete self.$backButtonActions[action.id];
                };
              },
              hardwareBackButtonClick: function(e) {
                var priorityAction,
                    actionId;
                for (actionId in self.$backButtonActions) {
                  if (!priorityAction || self.$backButtonActions[actionId].priority >= priorityAction.priority) {
                    priorityAction = self.$backButtonActions[actionId];
                  }
                }
                if (priorityAction) {
                  priorityAction.fn(e);
                  return priorityAction;
                }
              },
              is: function(type) {
                return ionic.Platform.is(type);
              },
              on: function(type, cb) {
                ionic.Platform.ready(function() {
                  document.addEventListener(type, cb, false);
                });
                return function() {
                  ionic.Platform.ready(function() {
                    document.removeEventListener(type, cb);
                  });
                };
              },
              ready: function(cb) {
                var q = $q.defer();
                ionic.Platform.ready(function() {
                  q.resolve();
                  cb && cb();
                });
                return q.promise;
              }
            };
            return self;
          }]};
      });
      IonicModule.factory('$ionicPopover', ['$ionicModal', '$ionicPosition', '$document', '$window', function($ionicModal, $ionicPosition, $document, $window) {
        var POPOVER_BODY_PADDING = 6;
        var POPOVER_OPTIONS = {
          viewType: 'popover',
          hideDelay: 1,
          animation: 'none',
          positionView: positionView
        };
        function positionView(target, popoverEle) {
          var targetEle = angular.element(target.target || target);
          var buttonOffset = $ionicPosition.offset(targetEle);
          var popoverWidth = popoverEle.prop('offsetWidth');
          var popoverHeight = popoverEle.prop('offsetHeight');
          var bodyWidth = $document[0].body.clientWidth;
          var bodyHeight = $window.innerHeight;
          var popoverCSS = {left: buttonOffset.left + buttonOffset.width / 2 - popoverWidth / 2};
          var arrowEle = jqLite(popoverEle[0].querySelector('.popover-arrow'));
          if (popoverCSS.left < POPOVER_BODY_PADDING) {
            popoverCSS.left = POPOVER_BODY_PADDING;
          } else if (popoverCSS.left + popoverWidth + POPOVER_BODY_PADDING > bodyWidth) {
            popoverCSS.left = bodyWidth - popoverWidth - POPOVER_BODY_PADDING;
          }
          if (buttonOffset.top + buttonOffset.height + popoverHeight > bodyHeight) {
            popoverCSS.top = buttonOffset.top - popoverHeight;
            popoverEle.addClass('popover-bottom');
          } else {
            popoverCSS.top = buttonOffset.top + buttonOffset.height;
            popoverEle.removeClass('popover-bottom');
          }
          arrowEle.css({left: buttonOffset.left + buttonOffset.width / 2 - arrowEle.prop('offsetWidth') / 2 - popoverCSS.left + 'px'});
          popoverEle.css({
            top: popoverCSS.top + 'px',
            left: popoverCSS.left + 'px',
            marginLeft: '0',
            opacity: '1'
          });
        }
        return {
          fromTemplate: function(templateString, options) {
            return $ionicModal.fromTemplate(templateString, ionic.Utils.extend(POPOVER_OPTIONS, options || {}));
          },
          fromTemplateUrl: function(url, options) {
            return $ionicModal.fromTemplateUrl(url, ionic.Utils.extend(POPOVER_OPTIONS, options || {}));
          }
        };
      }]);
      var POPUP_TPL = '<div class="popup-container" ng-class="cssClass">' + '<div class="popup">' + '<div class="popup-head">' + '<h3 class="popup-title" ng-bind-html="title"></h3>' + '<h5 class="popup-sub-title" ng-bind-html="subTitle" ng-if="subTitle"></h5>' + '</div>' + '<div class="popup-body">' + '</div>' + '<div class="popup-buttons" ng-show="buttons.length">' + '<button ng-repeat="button in buttons" ng-click="$buttonTapped(button, $event)" class="button" ng-class="button.type || \'button-default\'" ng-bind-html="button.text"></button>' + '</div>' + '</div>' + '</div>';
      IonicModule.factory('$ionicPopup', ['$ionicTemplateLoader', '$ionicBackdrop', '$q', '$timeout', '$rootScope', '$ionicBody', '$compile', '$ionicPlatform', function($ionicTemplateLoader, $ionicBackdrop, $q, $timeout, $rootScope, $ionicBody, $compile, $ionicPlatform) {
        var config = {stackPushDelay: 75};
        var popupStack = [];
        var $ionicPopup = {
          show: showPopup,
          alert: showAlert,
          confirm: showConfirm,
          prompt: showPrompt,
          _createPopup: createPopup,
          _popupStack: popupStack
        };
        return $ionicPopup;
        function createPopup(options) {
          options = extend({
            scope: null,
            title: '',
            buttons: []
          }, options || {});
          var popupPromise = $ionicTemplateLoader.compile({
            template: POPUP_TPL,
            scope: options.scope && options.scope.$new(),
            appendTo: $ionicBody.get()
          });
          var contentPromise = options.templateUrl ? $ionicTemplateLoader.load(options.templateUrl) : $q.when(options.template || options.content || '');
          return $q.all([popupPromise, contentPromise]).then(function(results) {
            var self = results[0];
            var content = results[1];
            var responseDeferred = $q.defer();
            self.responseDeferred = responseDeferred;
            var body = jqLite(self.element[0].querySelector('.popup-body'));
            if (content) {
              body.html(content);
              $compile(body.contents())(self.scope);
            } else {
              body.remove();
            }
            extend(self.scope, {
              title: options.title,
              buttons: options.buttons,
              subTitle: options.subTitle,
              cssClass: options.cssClass,
              $buttonTapped: function(button, event) {
                var result = (button.onTap || angular.noop)(event);
                event = event.originalEvent || event;
                if (!event.defaultPrevented) {
                  responseDeferred.resolve(result);
                }
              }
            });
            self.show = function() {
              if (self.isShown)
                return;
              self.isShown = true;
              ionic.requestAnimationFrame(function() {
                if (!self.isShown)
                  return;
                self.element.removeClass('popup-hidden');
                self.element.addClass('popup-showing active');
                focusInput(self.element);
              });
            };
            self.hide = function(callback) {
              callback = callback || angular.noop;
              if (!self.isShown)
                return callback();
              self.isShown = false;
              self.element.removeClass('active');
              self.element.addClass('popup-hidden');
              $timeout(callback, 250);
            };
            self.remove = function() {
              if (self.removed)
                return;
              self.hide(function() {
                self.element.remove();
                self.scope.$destroy();
              });
              self.removed = true;
            };
            return self;
          });
        }
        function onHardwareBackButton(e) {
          popupStack[0] && popupStack[0].responseDeferred.resolve();
        }
        function showPopup(options) {
          var popupPromise = $ionicPopup._createPopup(options);
          var previousPopup = popupStack[0];
          if (previousPopup) {
            previousPopup.hide();
          }
          var resultPromise = $timeout(angular.noop, previousPopup ? config.stackPushDelay : 0).then(function() {
            return popupPromise;
          }).then(function(popup) {
            if (!previousPopup) {
              $ionicBody.addClass('popup-open');
              $ionicBackdrop.retain();
              $ionicPopup._backButtonActionDone = $ionicPlatform.registerBackButtonAction(onHardwareBackButton, PLATFORM_BACK_BUTTON_PRIORITY_POPUP);
            }
            popupStack.unshift(popup);
            popup.show();
            popup.responseDeferred.notify({close: resultPromise.close});
            return popup.responseDeferred.promise.then(function(result) {
              var index = popupStack.indexOf(popup);
              if (index !== -1) {
                popupStack.splice(index, 1);
              }
              popup.remove();
              var previousPopup = popupStack[0];
              if (previousPopup) {
                previousPopup.show();
              } else {
                $timeout(function() {
                  $ionicBody.removeClass('popup-open');
                }, 400);
                $timeout(function() {
                  $ionicBackdrop.release();
                }, config.stackPushDelay || 0);
                ($ionicPopup._backButtonActionDone || angular.noop)();
              }
              return result;
            });
          });
          function close(result) {
            popupPromise.then(function(popup) {
              if (!popup.removed) {
                popup.responseDeferred.resolve(result);
              }
            });
          }
          resultPromise.close = close;
          return resultPromise;
        }
        function focusInput(element) {
          var focusOn = element[0].querySelector('[autofocus]');
          if (focusOn) {
            focusOn.focus();
          }
        }
        function showAlert(opts) {
          return showPopup(extend({buttons: [{
              text: opts.okText || 'OK',
              type: opts.okType || 'button-positive',
              onTap: function(e) {
                return true;
              }
            }]}, opts || {}));
        }
        function showConfirm(opts) {
          return showPopup(extend({buttons: [{
              text: opts.cancelText || 'Cancel',
              type: opts.cancelType || 'button-default',
              onTap: function(e) {
                return false;
              }
            }, {
              text: opts.okText || 'OK',
              type: opts.okType || 'button-positive',
              onTap: function(e) {
                return true;
              }
            }]}, opts || {}));
        }
        function showPrompt(opts) {
          var scope = $rootScope.$new(true);
          scope.data = {};
          var text = '';
          if (opts.template && /<[a-z][\s\S]*>/i.test(opts.template) === false) {
            text = '<span>' + opts.template + '</span>';
            delete opts.template;
          }
          return showPopup(extend({
            template: text + '<input ng-model="data.response" type="' + (opts.inputType || 'text') + '" placeholder="' + (opts.inputPlaceholder || '') + '">',
            scope: scope,
            buttons: [{
              text: opts.cancelText || 'Cancel',
              type: opts.cancelType || 'button-default',
              onTap: function(e) {}
            }, {
              text: opts.okText || 'OK',
              type: opts.okType || 'button-positive',
              onTap: function(e) {
                return scope.data.response || '';
              }
            }]
          }, opts || {}));
        }
      }]);
      IonicModule.factory('$ionicPosition', ['$document', '$window', function($document, $window) {
        function getStyle(el, cssprop) {
          if (el.currentStyle) {
            return el.currentStyle[cssprop];
          } else if ($window.getComputedStyle) {
            return $window.getComputedStyle(el)[cssprop];
          }
          return el.style[cssprop];
        }
        function isStaticPositioned(element) {
          return (getStyle(element, 'position') || 'static') === 'static';
        }
        var parentOffsetEl = function(element) {
          var docDomEl = $document[0];
          var offsetParent = element.offsetParent || docDomEl;
          while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
            offsetParent = offsetParent.offsetParent;
          }
          return offsetParent || docDomEl;
        };
        return {
          position: function(element) {
            var elBCR = this.offset(element);
            var offsetParentBCR = {
              top: 0,
              left: 0
            };
            var offsetParentEl = parentOffsetEl(element[0]);
            if (offsetParentEl != $document[0]) {
              offsetParentBCR = this.offset(angular.element(offsetParentEl));
              offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
              offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
            }
            var boundingClientRect = element[0].getBoundingClientRect();
            return {
              width: boundingClientRect.width || element.prop('offsetWidth'),
              height: boundingClientRect.height || element.prop('offsetHeight'),
              top: elBCR.top - offsetParentBCR.top,
              left: elBCR.left - offsetParentBCR.left
            };
          },
          offset: function(element) {
            var boundingClientRect = element[0].getBoundingClientRect();
            return {
              width: boundingClientRect.width || element.prop('offsetWidth'),
              height: boundingClientRect.height || element.prop('offsetHeight'),
              top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
              left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
            };
          }
        };
      }]);
      IonicModule.service('$ionicScrollDelegate', ionic.DelegateService(['resize', 'scrollTop', 'scrollBottom', 'scrollTo', 'scrollBy', 'zoomTo', 'zoomBy', 'getScrollPosition', 'anchorScroll', 'getScrollView']));
      IonicModule.service('$ionicSideMenuDelegate', ionic.DelegateService(['toggleLeft', 'toggleRight', 'getOpenRatio', 'isOpen', 'isOpenLeft', 'isOpenRight', 'canDragContent', 'edgeDragThreshold']));
      IonicModule.service('$ionicSlideBoxDelegate', ionic.DelegateService(['update', 'slide', 'select', 'enableSlide', 'previous', 'next', 'stop', 'autoPlay', 'start', 'currentIndex', 'selected', 'slidesCount', 'count', 'loop']));
      IonicModule.service('$ionicTabsDelegate', ionic.DelegateService(['select', 'selectedIndex']));
      (function() {
        var templatesToCache = [];
        IonicModule.factory('$ionicTemplateCache', ['$http', '$templateCache', '$timeout', function($http, $templateCache, $timeout) {
          var toCache = templatesToCache,
              hasRun;
          function $ionicTemplateCache(templates) {
            if (typeof templates === 'undefined') {
              return run();
            }
            if (isString(templates)) {
              templates = [templates];
            }
            forEach(templates, function(template) {
              toCache.push(template);
            });
            if (hasRun) {
              run();
            }
          }
          function run() {
            $ionicTemplateCache._runCount++;
            hasRun = true;
            if (toCache.length === 0)
              return;
            var i = 0;
            while (i < 4 && (template = toCache.pop())) {
              if (isString(template))
                $http.get(template, {cache: $templateCache});
              i++;
            }
            if (toCache.length) {
              $timeout(run, 1000);
            }
          }
          $ionicTemplateCache._runCount = 0;
          return $ionicTemplateCache;
        }]).config(['$stateProvider', '$ionicConfigProvider', function($stateProvider, $ionicConfigProvider) {
          var stateProviderState = $stateProvider.state;
          $stateProvider.state = function(stateName, definition) {
            if (typeof definition === 'object') {
              var enabled = definition.prefetchTemplate !== false && templatesToCache.length < $ionicConfigProvider.templates.maxPrefetch();
              if (enabled && isString(definition.templateUrl))
                templatesToCache.push(definition.templateUrl);
              if (angular.isObject(definition.views)) {
                for (var key in definition.views) {
                  enabled = definition.views[key].prefetchTemplate !== false && templatesToCache.length < $ionicConfigProvider.templates.maxPrefetch();
                  if (enabled && isString(definition.views[key].templateUrl))
                    templatesToCache.push(definition.views[key].templateUrl);
                }
              }
            }
            return stateProviderState.call($stateProvider, stateName, definition);
          };
        }]).run(['$ionicTemplateCache', function($ionicTemplateCache) {
          $ionicTemplateCache();
        }]);
      })();
      IonicModule.factory('$ionicTemplateLoader', ['$compile', '$controller', '$http', '$q', '$rootScope', '$templateCache', function($compile, $controller, $http, $q, $rootScope, $templateCache) {
        return {
          load: fetchTemplate,
          compile: loadAndCompile
        };
        function fetchTemplate(url) {
          return $http.get(url, {cache: $templateCache}).then(function(response) {
            return response.data && response.data.trim();
          });
        }
        function loadAndCompile(options) {
          options = extend({
            template: '',
            templateUrl: '',
            scope: null,
            controller: null,
            locals: {},
            appendTo: null
          }, options || {});
          var templatePromise = options.templateUrl ? this.load(options.templateUrl) : $q.when(options.template);
          return templatePromise.then(function(template) {
            var controller;
            var scope = options.scope || $rootScope.$new();
            var element = jqLite('<div>').html(template).contents();
            if (options.controller) {
              controller = $controller(options.controller, extend(options.locals, {$scope: scope}));
              element.children().data('$ngControllerController', controller);
            }
            if (options.appendTo) {
              jqLite(options.appendTo).append(element);
            }
            $compile(element)(scope);
            return {
              element: element,
              scope: scope
            };
          });
        }
      }]);
      IonicModule.factory('$ionicViewService', ['$ionicHistory', '$log', function($ionicHistory, $log) {
        function warn(oldMethod, newMethod) {
          $log.warn('$ionicViewService' + oldMethod + ' is deprecated, please use $ionicHistory' + newMethod + ' instead: http://ionicframework.com/docs/nightly/api/service/$ionicHistory/');
        }
        warn('', '');
        var methodsMap = {
          getCurrentView: 'currentView',
          getBackView: 'backView',
          getForwardView: 'forwardView',
          getCurrentStateName: 'currentStateName',
          nextViewOptions: 'nextViewOptions',
          clearHistory: 'clearHistory'
        };
        forEach(methodsMap, function(newMethod, oldMethod) {
          methodsMap[oldMethod] = function() {
            warn('.' + oldMethod, '.' + newMethod);
            return $ionicHistory[newMethod].apply(this, arguments);
          };
        });
        return methodsMap;
      }]);
      IonicModule.factory('$ionicViewSwitcher', ['$timeout', '$document', '$q', '$ionicClickBlock', '$ionicConfig', '$ionicNavBarDelegate', function($timeout, $document, $q, $ionicClickBlock, $ionicConfig, $ionicNavBarDelegate) {
        var TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
        var DATA_NO_CACHE = '$noCache';
        var DATA_DESTROY_ELE = '$destroyEle';
        var DATA_ELE_IDENTIFIER = '$eleId';
        var DATA_VIEW_ACCESSED = '$accessed';
        var DATA_FALLBACK_TIMER = '$fallbackTimer';
        var DATA_VIEW = '$viewData';
        var NAV_VIEW_ATTR = 'nav-view';
        var HISTORY_CURSOR_ATTR = 'history-cursor';
        var VIEW_STATUS_ACTIVE = 'active';
        var VIEW_STATUS_CACHED = 'cached';
        var VIEW_STATUS_STAGED = 'stage';
        var transitionCounter = 0;
        var nextTransition,
            nextDirection;
        ionic.transition = ionic.transition || {};
        ionic.transition.isActive = false;
        var isActiveTimer;
        var cachedAttr = ionic.DomUtil.cachedAttr;
        var transitionPromises = [];
        var ionicViewSwitcher = {
          create: function(navViewCtrl, viewLocals, enteringView, leavingView) {
            var enteringEle,
                leavingEle;
            var transitionId = ++transitionCounter;
            var alreadyInDom;
            var switcher = {
              init: function(registerData, callback) {
                ionicViewSwitcher.isTransitioning(true);
                switcher.loadViewElements(registerData);
                switcher.render(registerData, function() {
                  callback && callback();
                });
              },
              loadViewElements: function(registerData) {
                var viewEle,
                    viewElements = navViewCtrl.getViewElements();
                var enteringEleIdentifier = getViewElementIdentifier(viewLocals, enteringView);
                var navViewActiveEleId = navViewCtrl.activeEleId();
                for (var x = 0,
                    l = viewElements.length; x < l; x++) {
                  viewEle = viewElements.eq(x);
                  if (viewEle.data(DATA_ELE_IDENTIFIER) === enteringEleIdentifier) {
                    if (viewEle.data(DATA_NO_CACHE)) {
                      viewEle.data(DATA_ELE_IDENTIFIER, enteringEleIdentifier + ionic.Utils.nextUid());
                      viewEle.data(DATA_DESTROY_ELE, true);
                    } else {
                      enteringEle = viewEle;
                    }
                  } else if (viewEle.data(DATA_ELE_IDENTIFIER) === navViewActiveEleId) {
                    leavingEle = viewEle;
                  }
                  if (enteringEle && leavingEle)
                    break;
                }
                alreadyInDom = !!enteringEle;
                if (!alreadyInDom) {
                  enteringEle = registerData.ele || ionicViewSwitcher.createViewEle(viewLocals);
                  enteringEle.data(DATA_ELE_IDENTIFIER, enteringEleIdentifier);
                }
                navViewCtrl.activeEleId(enteringEleIdentifier);
                registerData.ele = null;
              },
              render: function(registerData, callback) {
                leavingEle && ionic.Utils.disconnectScope(leavingEle.scope());
                if (alreadyInDom) {
                  ionic.Utils.reconnectScope(enteringEle.scope());
                } else {
                  navViewAttr(enteringEle, VIEW_STATUS_STAGED);
                  var enteringData = getTransitionData(viewLocals, enteringEle, registerData.direction, enteringView);
                  var transitionFn = $ionicConfig.transitions.views[enteringData.transition] || $ionicConfig.transitions.views.none;
                  transitionFn(enteringEle, null, enteringData.direction, true).run(0);
                  enteringEle.data(DATA_VIEW, {
                    viewId: enteringData.viewId,
                    historyId: enteringData.historyId,
                    stateName: enteringData.stateName,
                    stateParams: enteringData.stateParams
                  });
                  if (viewState(viewLocals).cache === false || viewState(viewLocals).cache === 'false' || enteringEle.attr('cache-view') == 'false' || $ionicConfig.views.maxCache() === 0) {
                    enteringEle.data(DATA_NO_CACHE, true);
                  }
                  var viewScope = navViewCtrl.appendViewElement(enteringEle, viewLocals);
                  delete enteringData.direction;
                  delete enteringData.transition;
                  viewScope.$emit('$ionicView.loaded', enteringData);
                }
                enteringEle.data(DATA_VIEW_ACCESSED, Date.now());
                callback && callback();
              },
              transition: function(direction, enableBack) {
                var deferred = $q.defer();
                transitionPromises.push(deferred.promise);
                var enteringData = getTransitionData(viewLocals, enteringEle, direction, enteringView);
                var leavingData = extend(extend({}, enteringData), getViewData(leavingView));
                enteringData.transitionId = leavingData.transitionId = transitionId;
                enteringData.fromCache = !!alreadyInDom;
                enteringData.enableBack = !!enableBack;
                cachedAttr(enteringEle.parent(), 'nav-view-transition', enteringData.transition);
                cachedAttr(enteringEle.parent(), 'nav-view-direction', enteringData.direction);
                $timeout.cancel(enteringEle.data(DATA_FALLBACK_TIMER));
                switcher.emit('before', enteringData, leavingData);
                var transitionFn = $ionicConfig.transitions.views[enteringData.transition] || $ionicConfig.transitions.views.none;
                var viewTransition = transitionFn(enteringEle, leavingEle, enteringData.direction, enteringData.shouldAnimate);
                if (viewTransition.shouldAnimate) {
                  enteringEle.on(TRANSITIONEND_EVENT, transitionComplete);
                  enteringEle.data(DATA_FALLBACK_TIMER, $timeout(transitionComplete, 1000));
                  $ionicClickBlock.show();
                }
                navViewAttr(enteringEle, VIEW_STATUS_STAGED);
                viewTransition.run(0);
                $timeout(onReflow, 16);
                function onReflow() {
                  navViewAttr(enteringEle, viewTransition.shouldAnimate ? 'entering' : VIEW_STATUS_ACTIVE);
                  navViewAttr(leavingEle, viewTransition.shouldAnimate ? 'leaving' : VIEW_STATUS_CACHED);
                  viewTransition.run(1);
                  $ionicNavBarDelegate._instances.forEach(function(instance) {
                    instance.triggerTransitionStart(transitionId);
                  });
                  if (!viewTransition.shouldAnimate) {
                    transitionComplete();
                  }
                }
                function transitionComplete() {
                  if (transitionComplete.x)
                    return;
                  transitionComplete.x = true;
                  enteringEle.off(TRANSITIONEND_EVENT, transitionComplete);
                  $timeout.cancel(enteringEle.data(DATA_FALLBACK_TIMER));
                  leavingEle && $timeout.cancel(leavingEle.data(DATA_FALLBACK_TIMER));
                  switcher.emit('after', enteringData, leavingData);
                  deferred.resolve(navViewCtrl);
                  if (transitionId === transitionCounter) {
                    $q.all(transitionPromises).then(ionicViewSwitcher.transitionEnd);
                    switcher.cleanup(enteringData);
                  }
                  $ionicNavBarDelegate._instances.forEach(function(instance) {
                    instance.triggerTransitionEnd();
                  });
                  nextTransition = nextDirection = enteringView = leavingView = enteringEle = leavingEle = null;
                }
              },
              emit: function(step, enteringData, leavingData) {
                var scope = enteringEle.scope();
                if (scope) {
                  scope.$emit('$ionicView.' + step + 'Enter', enteringData);
                  if (step == 'after') {
                    scope.$emit('$ionicView.enter', enteringData);
                  }
                }
                if (leavingEle) {
                  scope = leavingEle.scope();
                  if (scope) {
                    scope.$emit('$ionicView.' + step + 'Leave', leavingData);
                    if (step == 'after') {
                      scope.$emit('$ionicView.leave', leavingData);
                    }
                  }
                }
              },
              cleanup: function(transData) {
                if (leavingEle && transData.direction == 'back' && !$ionicConfig.views.forwardCache()) {
                  destroyViewEle(leavingEle);
                }
                var viewElements = navViewCtrl.getViewElements();
                var viewElementsLength = viewElements.length;
                var x,
                    viewElement;
                var removeOldestAccess = (viewElementsLength - 1) > $ionicConfig.views.maxCache();
                var removableEle;
                var oldestAccess = Date.now();
                for (x = 0; x < viewElementsLength; x++) {
                  viewElement = viewElements.eq(x);
                  if (removeOldestAccess && viewElement.data(DATA_VIEW_ACCESSED) < oldestAccess) {
                    oldestAccess = viewElement.data(DATA_VIEW_ACCESSED);
                    removableEle = viewElements.eq(x);
                  } else if (viewElement.data(DATA_DESTROY_ELE) && navViewAttr(viewElement) != VIEW_STATUS_ACTIVE) {
                    destroyViewEle(viewElement);
                  }
                }
                destroyViewEle(removableEle);
                if (enteringEle.data(DATA_NO_CACHE)) {
                  enteringEle.data(DATA_DESTROY_ELE, true);
                }
              },
              enteringEle: function() {
                return enteringEle;
              },
              leavingEle: function() {
                return leavingEle;
              }
            };
            return switcher;
          },
          transitionEnd: function(navViewCtrls) {
            forEach(navViewCtrls, function(navViewCtrl) {
              navViewCtrl.transitionEnd();
            });
            ionicViewSwitcher.isTransitioning(false);
            $ionicClickBlock.hide();
            transitionPromises = [];
          },
          nextTransition: function(val) {
            nextTransition = val;
          },
          nextDirection: function(val) {
            nextDirection = val;
          },
          isTransitioning: function(val) {
            if (arguments.length) {
              ionic.transition.isActive = !!val;
              $timeout.cancel(isActiveTimer);
              if (val) {
                isActiveTimer = $timeout(function() {
                  ionicViewSwitcher.isTransitioning(false);
                }, 999);
              }
            }
            return ionic.transition.isActive;
          },
          createViewEle: function(viewLocals) {
            var containerEle = $document[0].createElement('div');
            if (viewLocals && viewLocals.$template) {
              containerEle.innerHTML = viewLocals.$template;
              if (containerEle.children.length === 1) {
                containerEle.children[0].classList.add('pane');
                return jqLite(containerEle.children[0]);
              }
            }
            containerEle.className = "pane";
            return jqLite(containerEle);
          },
          viewEleIsActive: function(viewEle, isActiveAttr) {
            navViewAttr(viewEle, isActiveAttr ? VIEW_STATUS_ACTIVE : VIEW_STATUS_CACHED);
          },
          getTransitionData: getTransitionData,
          navViewAttr: navViewAttr,
          destroyViewEle: destroyViewEle
        };
        return ionicViewSwitcher;
        function getViewElementIdentifier(locals, view) {
          if (viewState(locals).abstract)
            return viewState(locals).name;
          if (view)
            return view.stateId || view.viewId;
          return ionic.Utils.nextUid();
        }
        function viewState(locals) {
          return locals && locals.$$state && locals.$$state.self || {};
        }
        function getTransitionData(viewLocals, enteringEle, direction, view) {
          var state = viewState(viewLocals);
          var viewTransition = nextTransition || cachedAttr(enteringEle, 'view-transition') || state.viewTransition || $ionicConfig.views.transition() || 'ios';
          var navBarTransition = $ionicConfig.navBar.transition();
          direction = nextDirection || cachedAttr(enteringEle, 'view-direction') || state.viewDirection || direction || 'none';
          return extend(getViewData(view), {
            transition: viewTransition,
            navBarTransition: navBarTransition === 'view' ? viewTransition : navBarTransition,
            direction: direction,
            shouldAnimate: (viewTransition !== 'none' && direction !== 'none')
          });
        }
        function getViewData(view) {
          view = view || {};
          return {
            viewId: view.viewId,
            historyId: view.historyId,
            stateId: view.stateId,
            stateName: view.stateName,
            stateParams: view.stateParams
          };
        }
        function navViewAttr(ele, value) {
          if (arguments.length > 1) {
            cachedAttr(ele, NAV_VIEW_ATTR, value);
          } else {
            return cachedAttr(ele, NAV_VIEW_ATTR);
          }
        }
        function destroyViewEle(ele) {
          if (ele && ele.length) {
            var viewScope = ele.scope();
            if (viewScope) {
              viewScope.$emit('$ionicView.unloaded', ele.data(DATA_VIEW));
              viewScope.$destroy();
            }
            ele.remove();
          }
        }
      }]);
      IonicModule.config(['$provide', function($provide) {
        $provide.decorator('$compile', ['$delegate', function($compile) {
          $compile.$$addScopeInfo = function $$addScopeInfo($element, scope, isolated, noTemplate) {
            var dataName = isolated ? (noTemplate ? '$isolateScopeNoTemplate' : '$isolateScope') : '$scope';
            $element.data(dataName, scope);
          };
          return $compile;
        }]);
      }]);
      IonicModule.config(['$provide', function($provide) {
        function $LocationDecorator($location, $timeout) {
          $location.__hash = $location.hash;
          $location.hash = function(value) {
            if (angular.isDefined(value)) {
              $timeout(function() {
                var scroll = document.querySelector('.scroll-content');
                if (scroll)
                  scroll.scrollTop = 0;
              }, 0, false);
            }
            return $location.__hash(value);
          };
          return $location;
        }
        $provide.decorator('$location', ['$delegate', '$timeout', $LocationDecorator]);
      }]);
      IonicModule.controller('$ionicHeaderBar', ['$scope', '$element', '$attrs', '$q', '$ionicConfig', '$ionicHistory', function($scope, $element, $attrs, $q, $ionicConfig, $ionicHistory) {
        var TITLE = 'title';
        var BACK_TEXT = 'back-text';
        var BACK_BUTTON = 'back-button';
        var DEFAULT_TITLE = 'default-title';
        var PREVIOUS_TITLE = 'previous-title';
        var HIDE = 'hide';
        var self = this;
        var titleText = '';
        var previousTitleText = '';
        var titleLeft = 0;
        var titleRight = 0;
        var titleCss = '';
        var isBackEnabled = false;
        var isBackShown = true;
        var isNavBackShown = true;
        var isBackElementShown = false;
        var titleTextWidth = 0;
        self.beforeEnter = function(viewData) {
          $scope.$broadcast('$ionicView.beforeEnter', viewData);
        };
        self.title = function(newTitleText) {
          if (arguments.length && newTitleText !== titleText) {
            getEle(TITLE).innerHTML = newTitleText;
            titleText = newTitleText;
            titleTextWidth = 0;
          }
          return titleText;
        };
        self.enableBack = function(shouldEnable, disableReset) {
          if (arguments.length) {
            isBackEnabled = shouldEnable;
            if (!disableReset)
              self.updateBackButton();
          }
          return isBackEnabled;
        };
        self.showBack = function(shouldShow, disableReset) {
          if (arguments.length) {
            isBackShown = shouldShow;
            if (!disableReset)
              self.updateBackButton();
          }
          return isBackShown;
        };
        self.showNavBack = function(shouldShow) {
          isNavBackShown = shouldShow;
          self.updateBackButton();
        };
        self.updateBackButton = function() {
          if ((isBackShown && isNavBackShown && isBackEnabled) !== isBackElementShown) {
            isBackElementShown = isBackShown && isNavBackShown && isBackEnabled;
            var backBtnEle = getEle(BACK_BUTTON);
            backBtnEle && backBtnEle.classList[isBackElementShown ? 'remove' : 'add'](HIDE);
          }
        };
        self.titleTextWidth = function() {
          if (!titleTextWidth) {
            var bounds = ionic.DomUtil.getTextBounds(getEle(TITLE));
            titleTextWidth = Math.min(bounds && bounds.width || 30);
          }
          return titleTextWidth;
        };
        self.titleWidth = function() {
          var titleWidth = self.titleTextWidth();
          var offsetWidth = getEle(TITLE).offsetWidth;
          if (offsetWidth < titleWidth) {
            titleWidth = offsetWidth + (titleLeft - titleRight - 5);
          }
          return titleWidth;
        };
        self.titleTextX = function() {
          return ($element[0].offsetWidth / 2) - (self.titleWidth() / 2);
        };
        self.titleLeftRight = function() {
          return titleLeft - titleRight;
        };
        self.backButtonTextLeft = function() {
          var offsetLeft = 0;
          var ele = getEle(BACK_TEXT);
          while (ele) {
            offsetLeft += ele.offsetLeft;
            ele = ele.parentElement;
          }
          return offsetLeft;
        };
        self.resetBackButton = function() {
          if ($ionicConfig.backButton.previousTitleText()) {
            var previousTitleEle = getEle(PREVIOUS_TITLE);
            if (previousTitleEle) {
              previousTitleEle.classList.remove(HIDE);
              var newPreviousTitleText = $ionicHistory.backTitle();
              if (newPreviousTitleText !== previousTitleText) {
                previousTitleText = previousTitleEle.innerHTML = newPreviousTitleText;
              }
            }
            var defaultTitleEle = getEle(DEFAULT_TITLE);
            if (defaultTitleEle) {
              defaultTitleEle.classList.remove(HIDE);
            }
          }
        };
        self.align = function(textAlign) {
          var titleEle = getEle(TITLE);
          textAlign = textAlign || $attrs.alignTitle || $ionicConfig.navBar.alignTitle();
          var widths = self.calcWidths(textAlign, false);
          if (isBackShown && previousTitleText && $ionicConfig.backButton.previousTitleText()) {
            var previousTitleWidths = self.calcWidths(textAlign, true);
            var availableTitleWidth = $element[0].offsetWidth - previousTitleWidths.titleLeft - previousTitleWidths.titleRight;
            if (self.titleTextWidth() <= availableTitleWidth) {
              widths = previousTitleWidths;
            }
          }
          return self.updatePositions(titleEle, widths.titleLeft, widths.titleRight, widths.buttonsLeft, widths.buttonsRight, widths.css, widths.showPrevTitle);
        };
        self.calcWidths = function(textAlign, isPreviousTitle) {
          var titleEle = getEle(TITLE);
          var backBtnEle = getEle(BACK_BUTTON);
          var x,
              y,
              z,
              b,
              c,
              d,
              childSize,
              bounds;
          var childNodes = $element[0].childNodes;
          var buttonsLeft = 0;
          var buttonsRight = 0;
          var isCountRightOfTitle;
          var updateTitleLeft = 0;
          var updateTitleRight = 0;
          var updateCss = '';
          var backButtonWidth = 0;
          for (x = 0; x < childNodes.length; x++) {
            c = childNodes[x];
            childSize = 0;
            if (c.nodeType == 1) {
              if (c === titleEle) {
                isCountRightOfTitle = true;
                continue;
              }
              if (c.classList.contains(HIDE)) {
                continue;
              }
              if (isBackShown && c === backBtnEle) {
                for (y = 0; y < c.childNodes.length; y++) {
                  b = c.childNodes[y];
                  if (b.nodeType == 1) {
                    if (b.classList.contains(BACK_TEXT)) {
                      for (z = 0; z < b.children.length; z++) {
                        d = b.children[z];
                        if (isPreviousTitle) {
                          if (d.classList.contains(DEFAULT_TITLE))
                            continue;
                          backButtonWidth += d.offsetWidth;
                        } else {
                          if (d.classList.contains(PREVIOUS_TITLE))
                            continue;
                          backButtonWidth += d.offsetWidth;
                        }
                      }
                    } else {
                      backButtonWidth += b.offsetWidth;
                    }
                  } else if (b.nodeType == 3 && b.nodeValue.trim()) {
                    bounds = ionic.DomUtil.getTextBounds(b);
                    backButtonWidth += bounds && bounds.width || 0;
                  }
                }
                childSize = backButtonWidth || c.offsetWidth;
              } else {
                childSize = c.offsetWidth;
              }
            } else if (c.nodeType == 3 && c.nodeValue.trim()) {
              bounds = ionic.DomUtil.getTextBounds(c);
              childSize = bounds && bounds.width || 0;
            }
            if (isCountRightOfTitle) {
              buttonsRight += childSize;
            } else {
              buttonsLeft += childSize;
            }
          }
          if (textAlign == 'left') {
            updateCss = 'title-left';
            if (buttonsLeft) {
              updateTitleLeft = buttonsLeft + 15;
            }
            if (buttonsRight) {
              updateTitleRight = buttonsRight + 15;
            }
          } else if (textAlign == 'right') {
            updateCss = 'title-right';
            if (buttonsLeft) {
              updateTitleLeft = buttonsLeft + 15;
            }
            if (buttonsRight) {
              updateTitleRight = buttonsRight + 15;
            }
          } else {
            var margin = Math.max(buttonsLeft, buttonsRight) + 10;
            if (margin > 10) {
              updateTitleLeft = updateTitleRight = margin;
            }
          }
          return {
            backButtonWidth: backButtonWidth,
            buttonsLeft: buttonsLeft,
            buttonsRight: buttonsRight,
            titleLeft: updateTitleLeft,
            titleRight: updateTitleRight,
            showPrevTitle: isPreviousTitle,
            css: updateCss
          };
        };
        self.updatePositions = function(titleEle, updateTitleLeft, updateTitleRight, buttonsLeft, buttonsRight, updateCss, showPreviousTitle) {
          var deferred = $q.defer();
          if (titleEle) {
            if (updateTitleLeft !== titleLeft) {
              titleEle.style.left = updateTitleLeft ? updateTitleLeft + 'px' : '';
              titleLeft = updateTitleLeft;
            }
            if (updateTitleRight !== titleRight) {
              titleEle.style.right = updateTitleRight ? updateTitleRight + 'px' : '';
              titleRight = updateTitleRight;
            }
            if (updateCss !== titleCss) {
              updateCss && titleEle.classList.add(updateCss);
              titleCss && titleEle.classList.remove(titleCss);
              titleCss = updateCss;
            }
          }
          if ($ionicConfig.backButton.previousTitleText()) {
            var prevTitle = getEle(PREVIOUS_TITLE);
            var defaultTitle = getEle(DEFAULT_TITLE);
            prevTitle && prevTitle.classList[showPreviousTitle ? 'remove' : 'add'](HIDE);
            defaultTitle && defaultTitle.classList[showPreviousTitle ? 'add' : 'remove'](HIDE);
          }
          ionic.requestAnimationFrame(function() {
            if (titleEle && titleEle.offsetWidth + 10 < titleEle.scrollWidth) {
              var minRight = buttonsRight + 5;
              var testRight = $element[0].offsetWidth - titleLeft - self.titleTextWidth() - 20;
              updateTitleRight = testRight < minRight ? minRight : testRight;
              if (updateTitleRight !== titleRight) {
                titleEle.style.right = updateTitleRight + 'px';
                titleRight = updateTitleRight;
              }
            }
            deferred.resolve();
          });
          return deferred.promise;
        };
        self.setCss = function(elementClassname, css) {
          ionic.DomUtil.cachedStyles(getEle(elementClassname), css);
        };
        var eleCache = {};
        function getEle(className) {
          if (!eleCache[className]) {
            eleCache[className] = $element[0].querySelector('.' + className);
          }
          return eleCache[className];
        }
        $scope.$on('$destroy', function() {
          for (var n in eleCache)
            eleCache[n] = null;
        });
      }]);
      IonicModule.service('$ionicListDelegate', ionic.DelegateService(['showReorder', 'showDelete', 'canSwipeItems', 'closeOptionButtons'])).controller('$ionicList', ['$scope', '$attrs', '$ionicListDelegate', '$ionicHistory', function($scope, $attrs, $ionicListDelegate, $ionicHistory) {
        var self = this;
        var isSwipeable = true;
        var isReorderShown = false;
        var isDeleteShown = false;
        var deregisterInstance = $ionicListDelegate._registerInstance(self, $attrs.delegateHandle, function() {
          return $ionicHistory.isActiveScope($scope);
        });
        $scope.$on('$destroy', deregisterInstance);
        self.showReorder = function(show) {
          if (arguments.length) {
            isReorderShown = !!show;
          }
          return isReorderShown;
        };
        self.showDelete = function(show) {
          if (arguments.length) {
            isDeleteShown = !!show;
          }
          return isDeleteShown;
        };
        self.canSwipeItems = function(can) {
          if (arguments.length) {
            isSwipeable = !!can;
          }
          return isSwipeable;
        };
        self.closeOptionButtons = function() {
          self.listView && self.listView.clearDragEffects();
        };
      }]);
      IonicModule.controller('$ionicNavBar', ['$scope', '$element', '$attrs', '$compile', '$timeout', '$ionicNavBarDelegate', '$ionicConfig', '$ionicHistory', function($scope, $element, $attrs, $compile, $timeout, $ionicNavBarDelegate, $ionicConfig, $ionicHistory) {
        var CSS_HIDE = 'hide';
        var DATA_NAV_BAR_CTRL = '$ionNavBarController';
        var PRIMARY_BUTTONS = 'primaryButtons';
        var SECONDARY_BUTTONS = 'secondaryButtons';
        var BACK_BUTTON = 'backButton';
        var ITEM_TYPES = 'primaryButtons secondaryButtons leftButtons rightButtons title'.split(' ');
        var self = this;
        var headerBars = [];
        var navElementHtml = {};
        var isVisible = true;
        var queuedTransitionStart,
            queuedTransitionEnd,
            latestTransitionId;
        $element.parent().data(DATA_NAV_BAR_CTRL, self);
        var delegateHandle = $attrs.delegateHandle || 'navBar' + ionic.Utils.nextUid();
        var deregisterInstance = $ionicNavBarDelegate._registerInstance(self, delegateHandle);
        self.init = function() {
          $element.addClass('nav-bar-container');
          ionic.DomUtil.cachedAttr($element, 'nav-bar-transition', $ionicConfig.views.transition());
          self.createHeaderBar(false);
          self.createHeaderBar(true);
          $scope.$emit('ionNavBar.init', delegateHandle);
        };
        self.createHeaderBar = function(isActive, navBarClass) {
          var containerEle = jqLite('<div class="nav-bar-block">');
          ionic.DomUtil.cachedAttr(containerEle, 'nav-bar', isActive ? 'active' : 'cached');
          var alignTitle = $attrs.alignTitle || $ionicConfig.navBar.alignTitle();
          var headerBarEle = jqLite('<ion-header-bar>').addClass($attrs.class).attr('align-title', alignTitle);
          if (isDefined($attrs.noTapScroll))
            headerBarEle.attr('no-tap-scroll', $attrs.noTapScroll);
          var titleEle = jqLite('<div class="title title-' + alignTitle + '">');
          var navEle = {};
          var lastViewItemEle = {};
          var leftButtonsEle,
              rightButtonsEle;
          navEle[BACK_BUTTON] = createNavElement(BACK_BUTTON);
          navEle[BACK_BUTTON] && headerBarEle.append(navEle[BACK_BUTTON]);
          headerBarEle.append(titleEle);
          forEach(ITEM_TYPES, function(itemType) {
            navEle[itemType] = createNavElement(itemType);
            positionItem(navEle[itemType], itemType);
          });
          for (var x = 0; x < headerBarEle[0].children.length; x++) {
            headerBarEle[0].children[x].classList.add('header-item');
          }
          containerEle.append(headerBarEle);
          $element.append($compile(containerEle)($scope.$new()));
          var headerBarCtrl = headerBarEle.data('$ionHeaderBarController');
          var headerBarInstance = {
            isActive: isActive,
            title: function(newTitleText) {
              headerBarCtrl.title(newTitleText);
            },
            setItem: function(navBarItemEle, itemType) {
              headerBarInstance.removeItem(itemType);
              if (navBarItemEle) {
                if (itemType === 'title') {
                  headerBarInstance.title("");
                }
                positionItem(navBarItemEle, itemType);
                if (navEle[itemType]) {
                  navEle[itemType].addClass(CSS_HIDE);
                }
                lastViewItemEle[itemType] = navBarItemEle;
              } else if (navEle[itemType]) {
                navEle[itemType].removeClass(CSS_HIDE);
              }
            },
            removeItem: function(itemType) {
              if (lastViewItemEle[itemType]) {
                lastViewItemEle[itemType].scope().$destroy();
                lastViewItemEle[itemType].remove();
                lastViewItemEle[itemType] = null;
              }
            },
            containerEle: function() {
              return containerEle;
            },
            headerBarEle: function() {
              return headerBarEle;
            },
            afterLeave: function() {
              forEach(ITEM_TYPES, function(itemType) {
                headerBarInstance.removeItem(itemType);
              });
              headerBarCtrl.resetBackButton();
            },
            controller: function() {
              return headerBarCtrl;
            },
            destroy: function() {
              forEach(ITEM_TYPES, function(itemType) {
                headerBarInstance.removeItem(itemType);
              });
              containerEle.scope().$destroy();
              for (var n in navEle) {
                if (navEle[n]) {
                  navEle[n].removeData();
                  navEle[n] = null;
                }
              }
              leftButtonsEle && leftButtonsEle.removeData();
              rightButtonsEle && rightButtonsEle.removeData();
              titleEle.removeData();
              headerBarEle.removeData();
              containerEle.remove();
              containerEle = headerBarEle = titleEle = leftButtonsEle = rightButtonsEle = null;
            }
          };
          function positionItem(ele, itemType) {
            if (!ele)
              return;
            if (itemType === 'title') {
              titleEle.append(ele);
            } else if (itemType == 'rightButtons' || (itemType == SECONDARY_BUTTONS && $ionicConfig.navBar.positionSecondaryButtons() != 'left') || (itemType == PRIMARY_BUTTONS && $ionicConfig.navBar.positionPrimaryButtons() == 'right')) {
              if (!rightButtonsEle) {
                rightButtonsEle = jqLite('<div class="buttons buttons-right">');
                headerBarEle.append(rightButtonsEle);
              }
              if (itemType == SECONDARY_BUTTONS) {
                rightButtonsEle.append(ele);
              } else {
                rightButtonsEle.prepend(ele);
              }
            } else {
              if (!leftButtonsEle) {
                leftButtonsEle = jqLite('<div class="buttons buttons-left">');
                if (navEle[BACK_BUTTON]) {
                  navEle[BACK_BUTTON].after(leftButtonsEle);
                } else {
                  headerBarEle.prepend(leftButtonsEle);
                }
              }
              if (itemType == SECONDARY_BUTTONS) {
                leftButtonsEle.append(ele);
              } else {
                leftButtonsEle.prepend(ele);
              }
            }
          }
          headerBars.push(headerBarInstance);
          return headerBarInstance;
        };
        self.navElement = function(type, html) {
          if (isDefined(html)) {
            navElementHtml[type] = html;
          }
          return navElementHtml[type];
        };
        self.update = function(viewData) {
          var showNavBar = !viewData.hasHeaderBar && viewData.showNavBar;
          viewData.transition = $ionicConfig.views.transition();
          if (!showNavBar) {
            viewData.direction = 'none';
          }
          self.enable(showNavBar);
          var enteringHeaderBar = self.isInitialized ? getOffScreenHeaderBar() : getOnScreenHeaderBar();
          var leavingHeaderBar = self.isInitialized ? getOnScreenHeaderBar() : null;
          var enteringHeaderCtrl = enteringHeaderBar.controller();
          enteringHeaderCtrl.enableBack(viewData.enableBack, true);
          enteringHeaderCtrl.showBack(viewData.showBack, true);
          enteringHeaderCtrl.updateBackButton();
          self.title(viewData.title, enteringHeaderBar);
          self.showBar(showNavBar);
          if (viewData.navBarItems) {
            forEach(ITEM_TYPES, function(itemType) {
              enteringHeaderBar.setItem(viewData.navBarItems[itemType], itemType);
            });
          }
          self.transition(enteringHeaderBar, leavingHeaderBar, viewData);
          self.isInitialized = true;
        };
        self.transition = function(enteringHeaderBar, leavingHeaderBar, viewData) {
          var enteringHeaderBarCtrl = enteringHeaderBar.controller();
          var transitionFn = $ionicConfig.transitions.navBar[viewData.navBarTransition] || $ionicConfig.transitions.navBar.none;
          var transitionId = viewData.transitionId;
          enteringHeaderBarCtrl.beforeEnter(viewData);
          var navBarTransition = transitionFn(enteringHeaderBar, leavingHeaderBar, viewData.direction, viewData.shouldAnimate && self.isInitialized);
          ionic.DomUtil.cachedAttr($element, 'nav-bar-transition', viewData.navBarTransition);
          ionic.DomUtil.cachedAttr($element, 'nav-bar-direction', viewData.direction);
          if (navBarTransition.shouldAnimate) {
            navBarAttr(enteringHeaderBar, 'stage');
          } else {
            navBarAttr(enteringHeaderBar, 'entering');
            navBarAttr(leavingHeaderBar, 'leaving');
          }
          enteringHeaderBarCtrl.resetBackButton();
          navBarTransition.run(0);
          $timeout(enteringHeaderBarCtrl.align, 16);
          queuedTransitionStart = function() {
            if (latestTransitionId !== transitionId)
              return;
            navBarAttr(enteringHeaderBar, 'entering');
            navBarAttr(leavingHeaderBar, 'leaving');
            navBarTransition.run(1);
            queuedTransitionEnd = function() {
              if (latestTransitionId == transitionId || !navBarTransition.shouldAnimate) {
                for (var x = 0; x < headerBars.length; x++) {
                  headerBars[x].isActive = false;
                }
                enteringHeaderBar.isActive = true;
                navBarAttr(enteringHeaderBar, 'active');
                navBarAttr(leavingHeaderBar, 'cached');
                queuedTransitionEnd = null;
              }
            };
            queuedTransitionStart = null;
          };
          queuedTransitionStart();
        };
        self.triggerTransitionStart = function(triggerTransitionId) {
          latestTransitionId = triggerTransitionId;
          queuedTransitionStart && queuedTransitionStart();
        };
        self.triggerTransitionEnd = function() {
          queuedTransitionEnd && queuedTransitionEnd();
        };
        self.showBar = function(shouldShow) {
          if (arguments.length) {
            self.visibleBar(shouldShow);
            $scope.$parent.$hasHeader = !!shouldShow;
          }
          return !!$scope.$parent.$hasHeader;
        };
        self.visibleBar = function(shouldShow) {
          if (shouldShow && !isVisible) {
            $element.removeClass(CSS_HIDE);
          } else if (!shouldShow && isVisible) {
            $element.addClass(CSS_HIDE);
          }
          isVisible = shouldShow;
        };
        self.enable = function(val) {
          self.visibleBar(val);
          for (var x = 0; x < $ionicNavBarDelegate._instances.length; x++) {
            if ($ionicNavBarDelegate._instances[x] !== self)
              $ionicNavBarDelegate._instances[x].visibleBar(false);
          }
        };
        self.showBackButton = function(shouldShow) {
          for (var x = 0; x < headerBars.length; x++) {
            headerBars[x].controller().showNavBack(!!shouldShow);
          }
          $scope.$isBackButtonShown = !!shouldShow;
          return $scope.$isBackButtonShown;
        };
        self.showActiveBackButton = function(shouldShow) {
          var headerBar = getOnScreenHeaderBar();
          headerBar && headerBar.controller().showBack(shouldShow);
        };
        self.title = function(newTitleText, headerBar) {
          if (isDefined(newTitleText)) {
            newTitleText = newTitleText || '';
            headerBar = headerBar || getOnScreenHeaderBar();
            headerBar && headerBar.title(newTitleText);
            $scope.$title = newTitleText;
            $ionicHistory.currentTitle(newTitleText);
          }
          return $scope.$title;
        };
        self.align = function(val, headerBar) {
          headerBar = headerBar || getOnScreenHeaderBar();
          headerBar && headerBar.controller().align(val);
        };
        self.changeTitle = function(val) {
          deprecatedWarning('changeTitle(val)', 'title(val)');
          self.title(val);
        };
        self.setTitle = function(val) {
          deprecatedWarning('setTitle(val)', 'title(val)');
          self.title(val);
        };
        self.getTitle = function() {
          deprecatedWarning('getTitle()', 'title()');
          return self.title();
        };
        self.back = function() {
          deprecatedWarning('back()', '$ionicHistory.goBack()');
          $ionicHistory.goBack();
        };
        self.getPreviousTitle = function() {
          deprecatedWarning('getPreviousTitle()', '$ionicHistory.backTitle()');
          $ionicHistory.goBack();
        };
        function deprecatedWarning(oldMethod, newMethod) {
          var warn = console.warn || console.log;
          warn && warn('navBarController.' + oldMethod + ' is deprecated, please use ' + newMethod + ' instead');
        }
        function createNavElement(type) {
          if (navElementHtml[type]) {
            return jqLite(navElementHtml[type]);
          }
        }
        function getOnScreenHeaderBar() {
          for (var x = 0; x < headerBars.length; x++) {
            if (headerBars[x].isActive)
              return headerBars[x];
          }
        }
        function getOffScreenHeaderBar() {
          for (var x = 0; x < headerBars.length; x++) {
            if (!headerBars[x].isActive)
              return headerBars[x];
          }
        }
        function navBarAttr(ctrl, val) {
          ctrl && ionic.DomUtil.cachedAttr(ctrl.containerEle(), 'nav-bar', val);
        }
        $scope.$on('$destroy', function() {
          $scope.$parent.$hasHeader = false;
          $element.parent().removeData(DATA_NAV_BAR_CTRL);
          for (var x = 0; x < headerBars.length; x++) {
            headerBars[x].destroy();
          }
          $element.remove();
          $element = headerBars = null;
          deregisterInstance();
        });
      }]);
      IonicModule.controller('$ionicNavView', ['$scope', '$element', '$attrs', '$compile', '$controller', '$ionicNavBarDelegate', '$ionicNavViewDelegate', '$ionicHistory', '$ionicViewSwitcher', function($scope, $element, $attrs, $compile, $controller, $ionicNavBarDelegate, $ionicNavViewDelegate, $ionicHistory, $ionicViewSwitcher) {
        var DATA_ELE_IDENTIFIER = '$eleId';
        var DATA_DESTROY_ELE = '$destroyEle';
        var DATA_NO_CACHE = '$noCache';
        var VIEW_STATUS_ACTIVE = 'active';
        var VIEW_STATUS_CACHED = 'cached';
        var self = this;
        var direction;
        var isPrimary = false;
        var navBarDelegate;
        var activeEleId;
        var navViewAttr = $ionicViewSwitcher.navViewAttr;
        self.scope = $scope;
        self.init = function() {
          var navViewName = $attrs.name || '';
          var parent = $element.parent().inheritedData('$uiView');
          var parentViewName = ((parent && parent.state) ? parent.state.name : '');
          if (navViewName.indexOf('@') < 0)
            navViewName = navViewName + '@' + parentViewName;
          var viewData = {
            name: navViewName,
            state: null
          };
          $element.data('$uiView', viewData);
          var deregisterInstance = $ionicNavViewDelegate._registerInstance(self, $attrs.delegateHandle);
          $scope.$on('$destroy', deregisterInstance);
          $scope.$on('$ionicHistory.deselect', self.cacheCleanup);
          return viewData;
        };
        self.register = function(viewLocals) {
          var leavingView = extend({}, $ionicHistory.currentView());
          var registerData = $ionicHistory.register($scope, viewLocals);
          self.update(registerData);
          self.render(registerData, viewLocals, leavingView);
        };
        self.update = function(registerData) {
          isPrimary = true;
          direction = registerData.direction;
          var parentNavViewCtrl = $element.parent().inheritedData('$ionNavViewController');
          if (parentNavViewCtrl) {
            parentNavViewCtrl.isPrimary(false);
            if (direction === 'enter' || direction === 'exit') {
              parentNavViewCtrl.direction(direction);
              if (direction === 'enter') {
                direction = 'none';
              }
            }
          }
        };
        self.render = function(registerData, viewLocals, leavingView) {
          var enteringView = $ionicHistory.getViewById(registerData.viewId) || {};
          var switcher = $ionicViewSwitcher.create(self, viewLocals, enteringView, leavingView);
          switcher.init(registerData, function() {
            switcher.transition(self.direction(), registerData.enableBack);
          });
        };
        self.beforeEnter = function(transitionData) {
          if (isPrimary) {
            navBarDelegate = transitionData.navBarDelegate;
            var associatedNavBarCtrl = getAssociatedNavBarCtrl();
            associatedNavBarCtrl && associatedNavBarCtrl.update(transitionData);
          }
        };
        self.activeEleId = function(eleId) {
          if (arguments.length) {
            activeEleId = eleId;
          }
          return activeEleId;
        };
        self.transitionEnd = function() {
          var viewElements = $element.children();
          var x,
              l,
              viewElement;
          for (x = 0, l = viewElements.length; x < l; x++) {
            viewElement = viewElements.eq(x);
            if (viewElement.data(DATA_ELE_IDENTIFIER) === activeEleId) {
              navViewAttr(viewElement, VIEW_STATUS_ACTIVE);
            } else if (navViewAttr(viewElement) === 'leaving' || navViewAttr(viewElement) === VIEW_STATUS_ACTIVE || navViewAttr(viewElement) === VIEW_STATUS_CACHED) {
              if (viewElement.data(DATA_DESTROY_ELE) || viewElement.data(DATA_NO_CACHE)) {
                $ionicViewSwitcher.destroyViewEle(viewElement);
              } else {
                navViewAttr(viewElement, VIEW_STATUS_CACHED);
              }
            }
          }
        };
        self.cacheCleanup = function() {
          var viewElements = $element.children();
          for (var x = 0,
              l = viewElements.length; x < l; x++) {
            if (viewElements.eq(x).data(DATA_DESTROY_ELE)) {
              $ionicViewSwitcher.destroyViewEle(viewElements.eq(x));
            }
          }
        };
        self.clearCache = function() {
          var viewElements = $element.children();
          var viewElement,
              viewScope;
          for (var x = 0,
              l = viewElements.length; x < l; x++) {
            viewElement = viewElements.eq(x);
            if (navViewAttr(viewElement) == VIEW_STATUS_CACHED) {
              $ionicViewSwitcher.destroyViewEle(viewElement);
            } else if (navViewAttr(viewElement) == VIEW_STATUS_ACTIVE) {
              viewScope = viewElement.scope();
              viewScope && viewScope.$broadcast('$ionicView.clearCache');
            }
          }
        };
        self.getViewElements = function() {
          return $element.children();
        };
        self.appendViewElement = function(viewEle, viewLocals) {
          var linkFn = $compile(viewEle);
          $element.append(viewEle);
          var viewScope = $scope.$new();
          if (viewLocals && viewLocals.$$controller) {
            viewLocals.$scope = viewScope;
            var controller = $controller(viewLocals.$$controller, viewLocals);
            $element.children().data('$ngControllerController', controller);
          }
          linkFn(viewScope);
          return viewScope;
        };
        self.title = function(val) {
          var associatedNavBarCtrl = getAssociatedNavBarCtrl();
          associatedNavBarCtrl && associatedNavBarCtrl.title(val);
        };
        self.enableBackButton = function(shouldEnable) {
          var associatedNavBarCtrl = getAssociatedNavBarCtrl();
          associatedNavBarCtrl && associatedNavBarCtrl.enableBackButton(shouldEnable);
        };
        self.showBackButton = function(shouldShow) {
          var associatedNavBarCtrl = getAssociatedNavBarCtrl();
          associatedNavBarCtrl && associatedNavBarCtrl.showActiveBackButton(shouldShow);
        };
        self.showBar = function(val) {
          var associatedNavBarCtrl = getAssociatedNavBarCtrl();
          associatedNavBarCtrl && associatedNavBarCtrl.showBar(val);
        };
        self.isPrimary = function(val) {
          if (arguments.length) {
            isPrimary = val;
          }
          return isPrimary;
        };
        self.direction = function(val) {
          if (arguments.length) {
            direction = val;
          }
          return direction;
        };
        function getAssociatedNavBarCtrl() {
          if (navBarDelegate) {
            for (var x = 0; x < $ionicNavBarDelegate._instances.length; x++) {
              if ($ionicNavBarDelegate._instances[x].$$delegateHandle == navBarDelegate) {
                return $ionicNavBarDelegate._instances[x];
              }
            }
          }
          return $element.inheritedData('$ionNavBarController');
        }
      }]);
      IonicModule.controller('$ionicScroll', ['$scope', 'scrollViewOptions', '$timeout', '$window', '$location', '$document', '$ionicScrollDelegate', '$ionicHistory', function($scope, scrollViewOptions, $timeout, $window, $location, $document, $ionicScrollDelegate, $ionicHistory) {
        var self = this;
        self.__timeout = $timeout;
        self._scrollViewOptions = scrollViewOptions;
        var element = self.element = scrollViewOptions.el;
        var $element = self.$element = jqLite(element);
        var scrollView = self.scrollView = new ionic.views.Scroll(scrollViewOptions);
        ($element.parent().length ? $element.parent() : $element).data('$$ionicScrollController', self);
        var deregisterInstance = $ionicScrollDelegate._registerInstance(self, scrollViewOptions.delegateHandle, function() {
          return $ionicHistory.isActiveScope($scope);
        });
        if (!angular.isDefined(scrollViewOptions.bouncing)) {
          ionic.Platform.ready(function() {
            if (scrollView.options) {
              scrollView.options.bouncing = true;
              if (ionic.Platform.isAndroid()) {
                scrollView.options.bouncing = false;
                scrollView.options.deceleration = 0.95;
              }
            }
          });
        }
        var resize = angular.bind(scrollView, scrollView.resize);
        ionic.on('resize', resize, $window);
        var scrollFunc = function(e) {
          var detail = (e.originalEvent || e).detail || {};
          $scope.$onScroll && $scope.$onScroll({
            event: e,
            scrollTop: detail.scrollTop || 0,
            scrollLeft: detail.scrollLeft || 0
          });
        };
        $element.on('scroll', scrollFunc);
        $scope.$on('$destroy', function() {
          deregisterInstance();
          scrollView.__cleanup();
          ionic.off('resize', resize, $window);
          $window.removeEventListener('resize', resize);
          scrollViewOptions = null;
          self._scrollViewOptions.el = null;
          self._scrollViewOptions = null;
          $element.off('scroll', scrollFunc);
          $element = null;
          self.$element = null;
          element = null;
          self.element = null;
          self.scrollView = null;
          scrollView = null;
        });
        $timeout(function() {
          scrollView && scrollView.run && scrollView.run();
        });
        self.getScrollView = function() {
          return self.scrollView;
        };
        self.getScrollPosition = function() {
          return self.scrollView.getValues();
        };
        self.resize = function() {
          return $timeout(resize).then(function() {
            $element && $element.triggerHandler('scroll.resize');
          });
        };
        self.scrollTop = function(shouldAnimate) {
          ionic.DomUtil.blurAll();
          self.resize().then(function() {
            scrollView.scrollTo(0, 0, !!shouldAnimate);
          });
        };
        self.scrollBottom = function(shouldAnimate) {
          ionic.DomUtil.blurAll();
          self.resize().then(function() {
            var max = scrollView.getScrollMax();
            scrollView.scrollTo(max.left, max.top, !!shouldAnimate);
          });
        };
        self.scrollTo = function(left, top, shouldAnimate) {
          ionic.DomUtil.blurAll();
          self.resize().then(function() {
            scrollView.scrollTo(left, top, !!shouldAnimate);
          });
        };
        self.zoomTo = function(zoom, shouldAnimate, originLeft, originTop) {
          ionic.DomUtil.blurAll();
          self.resize().then(function() {
            scrollView.zoomTo(zoom, !!shouldAnimate, originLeft, originTop);
          });
        };
        self.zoomBy = function(zoom, shouldAnimate, originLeft, originTop) {
          ionic.DomUtil.blurAll();
          self.resize().then(function() {
            scrollView.zoomBy(zoom, !!shouldAnimate, originLeft, originTop);
          });
        };
        self.scrollBy = function(left, top, shouldAnimate) {
          ionic.DomUtil.blurAll();
          self.resize().then(function() {
            scrollView.scrollBy(left, top, !!shouldAnimate);
          });
        };
        self.anchorScroll = function(shouldAnimate) {
          ionic.DomUtil.blurAll();
          self.resize().then(function() {
            var hash = $location.hash();
            var elm = hash && $document[0].getElementById(hash);
            if (!(hash && elm)) {
              scrollView.scrollTo(0, 0, !!shouldAnimate);
              return;
            }
            var curElm = elm;
            var scrollLeft = 0,
                scrollTop = 0,
                levelsClimbed = 0;
            do {
              if (curElm !== null)
                scrollLeft += curElm.offsetLeft;
              if (curElm !== null)
                scrollTop += curElm.offsetTop;
              curElm = curElm.offsetParent;
              levelsClimbed++;
            } while (curElm.attributes != self.element.attributes && curElm.offsetParent);
            scrollView.scrollTo(scrollLeft, scrollTop, !!shouldAnimate);
          });
        };
        self._setRefresher = function(refresherScope, refresherElement) {
          var refresher = self.refresher = refresherElement;
          var refresherHeight = self.refresher.clientHeight || 60;
          scrollView.activatePullToRefresh(refresherHeight, function() {
            refresher.classList.add('active');
            refresherScope.$onPulling();
          }, function() {
            refresher.classList.remove('active');
            refresher.classList.remove('refreshing');
            refresher.classList.remove('refreshing-tail');
          }, function() {
            refresher.classList.add('refreshing');
            refresherScope.$onRefresh();
          }, function() {
            refresher.classList.remove('invisible');
          }, function() {
            refresher.classList.add('invisible');
          }, function() {
            refresher.classList.add('refreshing-tail');
          });
        };
      }]);
      IonicModule.controller('$ionicSideMenus', ['$scope', '$attrs', '$ionicSideMenuDelegate', '$ionicPlatform', '$ionicBody', '$ionicHistory', function($scope, $attrs, $ionicSideMenuDelegate, $ionicPlatform, $ionicBody, $ionicHistory) {
        var self = this;
        var rightShowing,
            leftShowing,
            isDragging;
        var startX,
            lastX,
            offsetX,
            isAsideExposed;
        var enableMenuWithBackViews = true;
        self.$scope = $scope;
        self.initialize = function(options) {
          self.left = options.left;
          self.right = options.right;
          self.setContent(options.content);
          self.dragThresholdX = options.dragThresholdX || 10;
          $ionicHistory.registerHistory(self.$scope);
        };
        self.setContent = function(content) {
          if (content) {
            self.content = content;
            self.content.onDrag = function(e) {
              self._handleDrag(e);
            };
            self.content.endDrag = function(e) {
              self._endDrag(e);
            };
          }
        };
        self.isOpenLeft = function() {
          return self.getOpenAmount() > 0;
        };
        self.isOpenRight = function() {
          return self.getOpenAmount() < 0;
        };
        self.toggleLeft = function(shouldOpen) {
          if (isAsideExposed || !self.left.isEnabled)
            return;
          var openAmount = self.getOpenAmount();
          if (arguments.length === 0) {
            shouldOpen = openAmount <= 0;
          }
          self.content.enableAnimation();
          if (!shouldOpen) {
            self.openPercentage(0);
          } else {
            self.openPercentage(100);
          }
        };
        self.toggleRight = function(shouldOpen) {
          if (isAsideExposed || !self.right.isEnabled)
            return;
          var openAmount = self.getOpenAmount();
          if (arguments.length === 0) {
            shouldOpen = openAmount >= 0;
          }
          self.content.enableAnimation();
          if (!shouldOpen) {
            self.openPercentage(0);
          } else {
            self.openPercentage(-100);
          }
        };
        self.toggle = function(side) {
          if (side == 'right') {
            self.toggleRight();
          } else {
            self.toggleLeft();
          }
        };
        self.close = function() {
          self.openPercentage(0);
        };
        self.getOpenAmount = function() {
          return self.content && self.content.getTranslateX() || 0;
        };
        self.getOpenRatio = function() {
          var amount = self.getOpenAmount();
          if (amount >= 0) {
            return amount / self.left.width;
          }
          return amount / self.right.width;
        };
        self.isOpen = function() {
          return self.getOpenAmount() !== 0;
        };
        self.getOpenPercentage = function() {
          return self.getOpenRatio() * 100;
        };
        self.openPercentage = function(percentage) {
          var p = percentage / 100;
          if (self.left && percentage >= 0) {
            self.openAmount(self.left.width * p);
          } else if (self.right && percentage < 0) {
            var maxRight = self.right.width;
            self.openAmount(self.right.width * p);
          }
          $ionicBody.enableClass((percentage !== 0), 'menu-open');
        };
        self.openAmount = function(amount) {
          var maxLeft = self.left && self.left.width || 0;
          var maxRight = self.right && self.right.width || 0;
          if (!(self.left && self.left.isEnabled) && amount > 0) {
            self.content.setTranslateX(0);
            return;
          }
          if (!(self.right && self.right.isEnabled) && amount < 0) {
            self.content.setTranslateX(0);
            return;
          }
          if (leftShowing && amount > maxLeft) {
            self.content.setTranslateX(maxLeft);
            return;
          }
          if (rightShowing && amount < -maxRight) {
            self.content.setTranslateX(-maxRight);
            return;
          }
          self.content.setTranslateX(amount);
          if (amount >= 0) {
            leftShowing = true;
            rightShowing = false;
            if (amount > 0) {
              self.right && self.right.pushDown && self.right.pushDown();
              self.left && self.left.bringUp && self.left.bringUp();
            }
          } else {
            rightShowing = true;
            leftShowing = false;
            self.right && self.right.bringUp && self.right.bringUp();
            self.left && self.left.pushDown && self.left.pushDown();
          }
        };
        self.snapToRest = function(e) {
          self.content.enableAnimation();
          isDragging = false;
          var ratio = self.getOpenRatio();
          if (ratio === 0) {
            self.openPercentage(0);
            return;
          }
          var velocityThreshold = 0.3;
          var velocityX = e.gesture.velocityX;
          var direction = e.gesture.direction;
          if (ratio > 0 && ratio < 0.5 && direction == 'right' && velocityX < velocityThreshold) {
            self.openPercentage(0);
          } else if (ratio > 0.5 && direction == 'left' && velocityX < velocityThreshold) {
            self.openPercentage(100);
          } else if (ratio < 0 && ratio > -0.5 && direction == 'left' && velocityX < velocityThreshold) {
            self.openPercentage(0);
          } else if (ratio < 0.5 && direction == 'right' && velocityX < velocityThreshold) {
            self.openPercentage(-100);
          } else if (direction == 'right' && ratio >= 0 && (ratio >= 0.5 || velocityX > velocityThreshold)) {
            self.openPercentage(100);
          } else if (direction == 'left' && ratio <= 0 && (ratio <= -0.5 || velocityX > velocityThreshold)) {
            self.openPercentage(-100);
          } else {
            self.openPercentage(0);
          }
        };
        self.enableMenuWithBackViews = function(val) {
          if (arguments.length) {
            enableMenuWithBackViews = !!val;
          }
          return enableMenuWithBackViews;
        };
        self.isAsideExposed = function() {
          return !!isAsideExposed;
        };
        self.exposeAside = function(shouldExposeAside) {
          if (!(self.left && self.left.isEnabled) && !(self.right && self.right.isEnabled))
            return;
          self.close();
          isAsideExposed = shouldExposeAside;
          if (self.left && self.left.isEnabled) {
            self.content.setMarginLeft(isAsideExposed ? self.left.width : 0);
          } else if (self.right && self.right.isEnabled) {
            self.content.setMarginRight(isAsideExposed ? self.right.width : 0);
          }
          self.$scope.$emit('$ionicExposeAside', isAsideExposed);
        };
        self.activeAsideResizing = function(isResizing) {
          $ionicBody.enableClass(isResizing, 'aside-resizing');
        };
        self._endDrag = function(e) {
          if (isAsideExposed)
            return;
          if (isDragging) {
            self.snapToRest(e);
          }
          startX = null;
          lastX = null;
          offsetX = null;
        };
        self._handleDrag = function(e) {
          if (isAsideExposed)
            return;
          if (!startX) {
            startX = e.gesture.touches[0].pageX;
            lastX = startX;
          } else {
            lastX = e.gesture.touches[0].pageX;
          }
          if (!isDragging && Math.abs(lastX - startX) > self.dragThresholdX) {
            startX = lastX;
            isDragging = true;
            self.content.disableAnimation();
            offsetX = self.getOpenAmount();
          }
          if (isDragging) {
            self.openAmount(offsetX + (lastX - startX));
          }
        };
        self.canDragContent = function(canDrag) {
          if (arguments.length) {
            $scope.dragContent = !!canDrag;
          }
          return $scope.dragContent;
        };
        self.edgeThreshold = 25;
        self.edgeThresholdEnabled = false;
        self.edgeDragThreshold = function(value) {
          if (arguments.length) {
            if (angular.isNumber(value) && value > 0) {
              self.edgeThreshold = value;
              self.edgeThresholdEnabled = true;
            } else {
              self.edgeThresholdEnabled = !!value;
            }
          }
          return self.edgeThresholdEnabled;
        };
        self.isDraggableTarget = function(e) {
          var shouldOnlyAllowEdgeDrag = self.edgeThresholdEnabled && !self.isOpen();
          var startX = e.gesture.startEvent && e.gesture.startEvent.center && e.gesture.startEvent.center.pageX;
          var dragIsWithinBounds = !shouldOnlyAllowEdgeDrag || startX <= self.edgeThreshold || startX >= self.content.element.offsetWidth - self.edgeThreshold;
          var backView = $ionicHistory.backView();
          var menuEnabled = enableMenuWithBackViews ? true : !backView;
          if (!menuEnabled) {
            var currentView = $ionicHistory.currentView() || {};
            return backView.historyId !== currentView.historyId;
          }
          return ($scope.dragContent || self.isOpen()) && dragIsWithinBounds && !e.gesture.srcEvent.defaultPrevented && menuEnabled && !e.target.tagName.match(/input|textarea|select|object|embed/i) && !e.target.isContentEditable && !(e.target.dataset ? e.target.dataset.preventScroll : e.target.getAttribute('data-prevent-scroll') == 'true');
        };
        $scope.sideMenuContentTranslateX = 0;
        var deregisterBackButtonAction = angular.noop;
        var closeSideMenu = angular.bind(self, self.close);
        $scope.$watch(function() {
          return self.getOpenAmount() !== 0;
        }, function(isOpen) {
          deregisterBackButtonAction();
          if (isOpen) {
            deregisterBackButtonAction = $ionicPlatform.registerBackButtonAction(closeSideMenu, PLATFORM_BACK_BUTTON_PRIORITY_SIDE_MENU);
          }
        });
        var deregisterInstance = $ionicSideMenuDelegate._registerInstance(self, $attrs.delegateHandle, function() {
          return $ionicHistory.isActiveScope($scope);
        });
        $scope.$on('$destroy', function() {
          deregisterInstance();
          deregisterBackButtonAction();
          self.$scope = null;
          if (self.content) {
            self.content.element = null;
            self.content = null;
          }
        });
        self.initialize({
          left: {width: 275},
          right: {width: 275}
        });
      }]);
      IonicModule.controller('$ionicTab', ['$scope', '$ionicHistory', '$attrs', '$location', '$state', function($scope, $ionicHistory, $attrs, $location, $state) {
        this.$scope = $scope;
        this.hrefMatchesState = function() {
          return $attrs.href && $location.path().indexOf($attrs.href.replace(/^#/, '').replace(/\/$/, '')) === 0;
        };
        this.srefMatchesState = function() {
          return $attrs.uiSref && $state.includes($attrs.uiSref.split('(')[0]);
        };
        this.navNameMatchesState = function() {
          return this.navViewName && $ionicHistory.isCurrentStateNavView(this.navViewName);
        };
        this.tabMatchesState = function() {
          return this.hrefMatchesState() || this.srefMatchesState() || this.navNameMatchesState();
        };
      }]);
      IonicModule.controller('$ionicTabs', ['$scope', '$element', '$ionicHistory', function($scope, $element, $ionicHistory) {
        var self = this;
        var selectedTab = null;
        var selectedTabIndex;
        self.tabs = [];
        self.selectedIndex = function() {
          return self.tabs.indexOf(selectedTab);
        };
        self.selectedTab = function() {
          return selectedTab;
        };
        self.add = function(tab) {
          $ionicHistory.registerHistory(tab);
          self.tabs.push(tab);
        };
        self.remove = function(tab) {
          var tabIndex = self.tabs.indexOf(tab);
          if (tabIndex === -1) {
            return;
          }
          if (tab.$tabSelected) {
            self.deselect(tab);
            if (self.tabs.length === 1) {} else {
              var newTabIndex = tabIndex === self.tabs.length - 1 ? tabIndex - 1 : tabIndex + 1;
              self.select(self.tabs[newTabIndex]);
            }
          }
          self.tabs.splice(tabIndex, 1);
        };
        self.deselect = function(tab) {
          if (tab.$tabSelected) {
            selectedTab = selectedTabIndex = null;
            tab.$tabSelected = false;
            (tab.onDeselect || angular.noop)();
            tab.$broadcast && tab.$broadcast('$ionicHistory.deselect');
          }
        };
        self.select = function(tab, shouldEmitEvent) {
          var tabIndex;
          if (angular.isNumber(tab)) {
            tabIndex = tab;
            if (tabIndex >= self.tabs.length)
              return;
            tab = self.tabs[tabIndex];
          } else {
            tabIndex = self.tabs.indexOf(tab);
          }
          if (arguments.length === 1) {
            shouldEmitEvent = !!(tab.navViewName || tab.uiSref);
          }
          if (selectedTab && selectedTab.$historyId == tab.$historyId) {
            if (shouldEmitEvent) {
              $ionicHistory.goToHistoryRoot(tab.$historyId);
            }
          } else if (selectedTabIndex !== tabIndex) {
            forEach(self.tabs, function(tab) {
              self.deselect(tab);
            });
            selectedTab = tab;
            selectedTabIndex = tabIndex;
            if (self.$scope && self.$scope.$parent) {
              self.$scope.$parent.$activeHistoryId = tab.$historyId;
            }
            tab.$tabSelected = true;
            (tab.onSelect || angular.noop)();
            if (shouldEmitEvent) {
              $scope.$emit('$ionicHistory.change', {
                type: 'tab',
                tabIndex: tabIndex,
                historyId: tab.$historyId,
                navViewName: tab.navViewName,
                hasNavView: !!tab.navViewName,
                title: tab.title,
                url: tab.href,
                uiSref: tab.uiSref
              });
            }
          }
        };
        self.hasActiveScope = function() {
          for (var x = 0; x < self.tabs.length; x++) {
            if ($ionicHistory.isActiveScope(self.tabs[x])) {
              return true;
            }
          }
          return false;
        };
      }]);
      IonicModule.controller('$ionicView', ['$scope', '$element', '$attrs', '$compile', '$rootScope', '$ionicViewSwitcher', function($scope, $element, $attrs, $compile, $rootScope, $ionicViewSwitcher) {
        var self = this;
        var navElementHtml = {};
        var navViewCtrl;
        var navBarDelegateHandle;
        var hasViewHeaderBar;
        var deregisters = [];
        var viewTitle;
        var deregIonNavBarInit = $scope.$on('ionNavBar.init', function(ev, delegateHandle) {
          ev.stopPropagation();
          navBarDelegateHandle = delegateHandle;
        });
        self.init = function() {
          deregIonNavBarInit();
          var modalCtrl = $element.inheritedData('$ionModalController');
          navViewCtrl = $element.inheritedData('$ionNavViewController');
          if (!navViewCtrl || modalCtrl)
            return;
          $scope.$on('$ionicView.beforeEnter', self.beforeEnter);
          $scope.$on('$ionicView.afterEnter', afterEnter);
          $scope.$on('$ionicView.beforeLeave', deregisterFns);
        };
        self.beforeEnter = function(ev, transData) {
          if (transData && !transData.viewNotified) {
            transData.viewNotified = true;
            if (!$rootScope.$$phase)
              $scope.$digest();
            viewTitle = isDefined($attrs.viewTitle) ? $attrs.viewTitle : $attrs.title;
            var navBarItems = {};
            for (var n in navElementHtml) {
              navBarItems[n] = generateNavBarItem(navElementHtml[n]);
            }
            navViewCtrl.beforeEnter({
              title: viewTitle,
              direction: transData.direction,
              transition: transData.transition,
              navBarTransition: transData.navBarTransition,
              transitionId: transData.transitionId,
              shouldAnimate: transData.shouldAnimate,
              enableBack: transData.enableBack,
              showBack: !attrTrue('hideBackButton'),
              navBarItems: navBarItems,
              navBarDelegate: navBarDelegateHandle || null,
              showNavBar: !attrTrue('hideNavBar'),
              hasHeaderBar: !!hasViewHeaderBar
            });
            deregisterFns();
          }
        };
        function afterEnter() {
          var viewTitleAttr = isDefined($attrs.viewTitle) && 'viewTitle' || isDefined($attrs.title) && 'title';
          if (viewTitleAttr) {
            titleUpdate($attrs[viewTitleAttr]);
            deregisters.push($attrs.$observe(viewTitleAttr, titleUpdate));
          }
          if (isDefined($attrs.hideBackButton)) {
            deregisters.push($scope.$watch($attrs.hideBackButton, function(val) {
              navViewCtrl.showBackButton(!val);
            }));
          }
          if (isDefined($attrs.hideNavBar)) {
            deregisters.push($scope.$watch($attrs.hideNavBar, function(val) {
              navViewCtrl.showBar(!val);
            }));
          }
        }
        function titleUpdate(newTitle) {
          if (isDefined(newTitle) && newTitle !== viewTitle) {
            viewTitle = newTitle;
            navViewCtrl.title(viewTitle);
          }
        }
        function deregisterFns() {
          for (var x = 0; x < deregisters.length; x++) {
            deregisters[x]();
          }
          deregisters = [];
        }
        function generateNavBarItem(html) {
          if (html) {
            return $compile(html)($scope.$new());
          }
        }
        function attrTrue(key) {
          return !!$scope.$eval($attrs[key]);
        }
        self.navElement = function(type, html) {
          navElementHtml[type] = html;
        };
      }]);
      IonicModule.directive('ionActionSheet', ['$document', function($document) {
        return {
          restrict: 'E',
          scope: true,
          replace: true,
          link: function($scope, $element) {
            var keyUp = function(e) {
              if (e.which == 27) {
                $scope.cancel();
                $scope.$apply();
              }
            };
            var backdropClick = function(e) {
              if (e.target == $element[0]) {
                $scope.cancel();
                $scope.$apply();
              }
            };
            $scope.$on('$destroy', function() {
              $element.remove();
              $document.unbind('keyup', keyUp);
            });
            $document.bind('keyup', keyUp);
            $element.bind('click', backdropClick);
          },
          template: '<div class="action-sheet-backdrop">' + '<div class="action-sheet-wrapper">' + '<div class="action-sheet">' + '<div class="action-sheet-group">' + '<div class="action-sheet-title" ng-if="titleText" ng-bind-html="titleText"></div>' + '<button class="button" ng-click="buttonClicked($index)" ng-repeat="button in buttons" ng-bind-html="button.text"></button>' + '</div>' + '<div class="action-sheet-group" ng-if="destructiveText">' + '<button class="button destructive" ng-click="destructiveButtonClicked()" ng-bind-html="destructiveText"></button>' + '</div>' + '<div class="action-sheet-group" ng-if="cancelText">' + '<button class="button" ng-click="cancel()" ng-bind-html="cancelText"></button>' + '</div>' + '</div>' + '</div>' + '</div>'
        };
      }]);
      IonicModule.directive('ionCheckbox', ['$ionicConfig', function($ionicConfig) {
        return {
          restrict: 'E',
          replace: true,
          require: '?ngModel',
          transclude: true,
          template: '<label class="item item-checkbox">' + '<div class="checkbox checkbox-input-hidden disable-pointer-events">' + '<input type="checkbox">' + '<i class="checkbox-icon"></i>' + '</div>' + '<div class="item-content disable-pointer-events" ng-transclude></div>' + '</label>',
          compile: function(element, attr) {
            var input = element.find('input');
            forEach({
              'name': attr.name,
              'ng-value': attr.ngValue,
              'ng-model': attr.ngModel,
              'ng-checked': attr.ngChecked,
              'ng-disabled': attr.ngDisabled,
              'ng-true-value': attr.ngTrueValue,
              'ng-false-value': attr.ngFalseValue,
              'ng-change': attr.ngChange
            }, function(value, name) {
              if (isDefined(value)) {
                input.attr(name, value);
              }
            });
            var checkboxWrapper = element[0].querySelector('.checkbox');
            checkboxWrapper.classList.add('checkbox-' + $ionicConfig.form.checkbox());
          }
        };
      }]);
      var COLLECTION_REPEAT_SCROLLVIEW_XY_ERROR = "Cannot create a collection-repeat within a scrollView that is scrollable on both x and y axis.  Choose either x direction or y direction.";
      var COLLECTION_REPEAT_ATTR_HEIGHT_ERROR = "collection-repeat expected attribute collection-item-height to be a an expression that returns a number (in pixels) or percentage.";
      var COLLECTION_REPEAT_ATTR_WIDTH_ERROR = "collection-repeat expected attribute collection-item-width to be a an expression that returns a number (in pixels) or percentage.";
      var COLLECTION_REPEAT_ATTR_REPEAT_ERROR = "collection-repeat expected expression in form of '_item_ in _collection_[ track by _id_]' but got '%'";
      IonicModule.directive('collectionRepeat', ['$collectionRepeatManager', '$collectionDataSource', '$parse', function($collectionRepeatManager, $collectionDataSource, $parse) {
        return {
          priority: 1000,
          transclude: 'element',
          terminal: true,
          $$tlb: true,
          require: ['^$ionicScroll', '^?ionNavView'],
          controller: [function() {}],
          link: function($scope, $element, $attr, ctrls, $transclude) {
            var scrollCtrl = ctrls[0];
            var navViewCtrl = ctrls[1];
            var wrap = jqLite('<div style="position:relative;">');
            $element.parent()[0].insertBefore(wrap[0], $element[0]);
            wrap.append($element);
            var scrollView = scrollCtrl.scrollView;
            if (scrollView.options.scrollingX && scrollView.options.scrollingY) {
              throw new Error(COLLECTION_REPEAT_SCROLLVIEW_XY_ERROR);
            }
            var isVertical = !!scrollView.options.scrollingY;
            if (isVertical && !$attr.collectionItemHeight) {
              throw new Error(COLLECTION_REPEAT_ATTR_HEIGHT_ERROR);
            } else if (!isVertical && !$attr.collectionItemWidth) {
              throw new Error(COLLECTION_REPEAT_ATTR_WIDTH_ERROR);
            }
            var heightParsed = $parse($attr.collectionItemHeight || '"100%"');
            var widthParsed = $parse($attr.collectionItemWidth || '"100%"');
            var heightGetter = function(scope, locals) {
              var result = heightParsed(scope, locals);
              if (isString(result) && result.indexOf('%') > -1) {
                return Math.floor(parseInt(result) / 100 * scrollView.__clientHeight);
              }
              return parseInt(result);
            };
            var widthGetter = function(scope, locals) {
              var result = widthParsed(scope, locals);
              if (isString(result) && result.indexOf('%') > -1) {
                return Math.floor(parseInt(result) / 100 * scrollView.__clientWidth);
              }
              return parseInt(result);
            };
            var match = $attr.collectionRepeat.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
            if (!match) {
              throw new Error(COLLECTION_REPEAT_ATTR_REPEAT_ERROR.replace('%', $attr.collectionRepeat));
            }
            var keyExpr = match[1];
            var listExpr = match[2];
            var trackByExpr = match[3];
            var dataSource = new $collectionDataSource({
              scope: $scope,
              transcludeFn: $transclude,
              transcludeParent: $element.parent(),
              keyExpr: keyExpr,
              listExpr: listExpr,
              trackByExpr: trackByExpr,
              heightGetter: heightGetter,
              widthGetter: widthGetter
            });
            var collectionRepeatManager = new $collectionRepeatManager({
              dataSource: dataSource,
              element: scrollCtrl.$element,
              scrollView: scrollCtrl.scrollView
            });
            var listExprParsed = $parse(listExpr);
            $scope.$watchCollection(listExprParsed, function(value) {
              if (value && !angular.isArray(value)) {
                throw new Error("collection-repeat expects an array to repeat over, but instead got '" + typeof value + "'.");
              }
              rerender(value);
            });
            var scrollViewContent = scrollCtrl.scrollView.__content;
            function rerender(value) {
              var beforeSiblings = [];
              var afterSiblings = [];
              var before = true;
              forEach(scrollViewContent.children, function(node, i) {
                if (ionic.DomUtil.elementIsDescendant($element[0], node, scrollViewContent)) {
                  before = false;
                } else {
                  if (node.hasAttribute('collection-repeat-ignore'))
                    return;
                  var width = node.offsetWidth;
                  var height = node.offsetHeight;
                  if (width && height) {
                    var element = jqLite(node);
                    (before ? beforeSiblings : afterSiblings).push({
                      width: node.offsetWidth,
                      height: node.offsetHeight,
                      element: element,
                      scope: element.isolateScope() || element.scope(),
                      isOutside: true
                    });
                  }
                }
              });
              scrollView.resize();
              dataSource.setData(value, beforeSiblings, afterSiblings);
              collectionRepeatManager.resize();
            }
            var requiresRerender;
            function rerenderOnResize() {
              rerender(listExprParsed($scope));
              requiresRerender = (!scrollViewContent.clientWidth && !scrollViewContent.clientHeight);
            }
            function viewEnter() {
              if (requiresRerender) {
                rerenderOnResize();
              }
            }
            scrollCtrl.$element.on('scroll.resize', rerenderOnResize);
            ionic.on('resize', rerenderOnResize, window);
            var deregisterViewListener;
            if (navViewCtrl) {
              deregisterViewListener = navViewCtrl.scope.$on('$ionicView.afterEnter', viewEnter);
            }
            $scope.$on('$destroy', function() {
              collectionRepeatManager.destroy();
              dataSource.destroy();
              ionic.off('resize', rerenderOnResize, window);
              (deregisterViewListener || angular.noop)();
            });
          }
        };
      }]).directive({
        ngSrc: collectionRepeatSrcDirective('ngSrc', 'src'),
        ngSrcset: collectionRepeatSrcDirective('ngSrcset', 'srcset'),
        ngHref: collectionRepeatSrcDirective('ngHref', 'href')
      });
      function collectionRepeatSrcDirective(ngAttrName, attrName) {
        return [function() {
          return {
            priority: '99',
            link: function(scope, element, attr) {
              attr.$observe(ngAttrName, function(value) {
                if (!value) {
                  element[0].removeAttribute(attrName);
                }
              });
            }
          };
        }];
      }
      IonicModule.directive('ionContent', ['$timeout', '$controller', '$ionicBind', function($timeout, $controller, $ionicBind) {
        return {
          restrict: 'E',
          require: '^?ionNavView',
          scope: true,
          priority: 800,
          compile: function(element, attr) {
            var innerElement;
            element.addClass('scroll-content ionic-scroll');
            if (attr.scroll != 'false') {
              innerElement = jqLite('<div class="scroll"></div>');
              innerElement.append(element.contents());
              element.append(innerElement);
            } else {
              element.addClass('scroll-content-false');
            }
            return {pre: prelink};
            function prelink($scope, $element, $attr, navViewCtrl) {
              var parentScope = $scope.$parent;
              $scope.$watch(function() {
                return (parentScope.$hasHeader ? ' has-header' : '') + (parentScope.$hasSubheader ? ' has-subheader' : '') + (parentScope.$hasFooter ? ' has-footer' : '') + (parentScope.$hasSubfooter ? ' has-subfooter' : '') + (parentScope.$hasTabs ? ' has-tabs' : '') + (parentScope.$hasTabsTop ? ' has-tabs-top' : '');
              }, function(className, oldClassName) {
                $element.removeClass(oldClassName);
                $element.addClass(className);
              });
              $scope.$hasHeader = $scope.$hasSubheader = $scope.$hasFooter = $scope.$hasSubfooter = $scope.$hasTabs = $scope.$hasTabsTop = false;
              $ionicBind($scope, $attr, {
                $onScroll: '&onScroll',
                $onScrollComplete: '&onScrollComplete',
                hasBouncing: '@',
                padding: '@',
                direction: '@',
                scrollbarX: '@',
                scrollbarY: '@',
                startX: '@',
                startY: '@',
                scrollEventInterval: '@'
              });
              $scope.direction = $scope.direction || 'y';
              if (angular.isDefined($attr.padding)) {
                $scope.$watch($attr.padding, function(newVal) {
                  (innerElement || $element).toggleClass('padding', !!newVal);
                });
              }
              if ($attr.scroll === "false") {} else if (attr.overflowScroll === "true") {
                $element.addClass('overflow-scroll');
              } else {
                var scrollViewOptions = {
                  el: $element[0],
                  delegateHandle: attr.delegateHandle,
                  locking: (attr.locking || 'true') === 'true',
                  bouncing: $scope.$eval($scope.hasBouncing),
                  startX: $scope.$eval($scope.startX) || 0,
                  startY: $scope.$eval($scope.startY) || 0,
                  scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
                  scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
                  scrollingX: $scope.direction.indexOf('x') >= 0,
                  scrollingY: $scope.direction.indexOf('y') >= 0,
                  scrollEventInterval: parseInt($scope.scrollEventInterval, 10) || 10,
                  scrollingComplete: function() {
                    $scope.$onScrollComplete({
                      scrollTop: this.__scrollTop,
                      scrollLeft: this.__scrollLeft
                    });
                  }
                };
                $controller('$ionicScroll', {
                  $scope: $scope,
                  scrollViewOptions: scrollViewOptions
                });
                $scope.$on('$destroy', function() {
                  scrollViewOptions.scrollingComplete = angular.noop;
                  delete scrollViewOptions.el;
                  innerElement = null;
                  $element = null;
                  attr.$$element = null;
                });
              }
            }
          }
        };
      }]);
      IonicModule.directive('exposeAsideWhen', ['$window', function($window) {
        return {
          restrict: 'A',
          require: '^ionSideMenus',
          link: function($scope, $element, $attr, sideMenuCtrl) {
            function checkAsideExpose() {
              var mq = $attr.exposeAsideWhen == 'large' ? '(min-width:768px)' : $attr.exposeAsideWhen;
              sideMenuCtrl.exposeAside($window.matchMedia(mq).matches);
              sideMenuCtrl.activeAsideResizing(false);
            }
            function onResize() {
              sideMenuCtrl.activeAsideResizing(true);
              debouncedCheck();
            }
            var debouncedCheck = ionic.debounce(function() {
              $scope.$apply(function() {
                checkAsideExpose();
              });
            }, 300, false);
            checkAsideExpose();
            ionic.on('resize', onResize, $window);
            $scope.$on('$destroy', function() {
              ionic.off('resize', onResize, $window);
            });
          }
        };
      }]);
      var GESTURE_DIRECTIVES = 'onHold onTap onTouch onRelease onDrag onDragUp onDragRight onDragDown onDragLeft onSwipe onSwipeUp onSwipeRight onSwipeDown onSwipeLeft'.split(' ');
      GESTURE_DIRECTIVES.forEach(function(name) {
        IonicModule.directive(name, gestureDirective(name));
      });
      function gestureDirective(directiveName) {
        return ['$ionicGesture', '$parse', function($ionicGesture, $parse) {
          var eventType = directiveName.substr(2).toLowerCase();
          return function(scope, element, attr) {
            var fn = $parse(attr[directiveName]);
            var listener = function(ev) {
              scope.$apply(function() {
                fn(scope, {$event: ev});
              });
            };
            var gesture = $ionicGesture.on(eventType, listener, element);
            scope.$on('$destroy', function() {
              $ionicGesture.off(gesture, eventType, listener);
            });
          };
        }];
      }
      IonicModule.directive('ionHeaderBar', tapScrollToTopDirective()).directive('ionHeaderBar', headerFooterBarDirective(true)).directive('ionFooterBar', headerFooterBarDirective(false));
      function tapScrollToTopDirective() {
        return ['$ionicScrollDelegate', function($ionicScrollDelegate) {
          return {
            restrict: 'E',
            link: function($scope, $element, $attr) {
              if ($attr.noTapScroll == 'true') {
                return;
              }
              ionic.on('tap', onTap, $element[0]);
              $scope.$on('$destroy', function() {
                ionic.off('tap', onTap, $element[0]);
              });
              function onTap(e) {
                var depth = 3;
                var current = e.target;
                while (depth-- && current) {
                  if (current.classList.contains('button') || current.tagName.match(/input|textarea|select/i) || current.isContentEditable) {
                    return;
                  }
                  current = current.parentNode;
                }
                var touch = e.gesture && e.gesture.touches[0] || e.detail.touches[0];
                var bounds = $element[0].getBoundingClientRect();
                if (ionic.DomUtil.rectContains(touch.pageX, touch.pageY, bounds.left, bounds.top - 20, bounds.left + bounds.width, bounds.top + bounds.height)) {
                  $ionicScrollDelegate.scrollTop(true);
                }
              }
            }
          };
        }];
      }
      function headerFooterBarDirective(isHeader) {
        return ['$document', '$timeout', function($document, $timeout) {
          return {
            restrict: 'E',
            controller: '$ionicHeaderBar',
            compile: function(tElement, $attr) {
              tElement.addClass(isHeader ? 'bar bar-header' : 'bar bar-footer');
              $timeout(function() {
                if (isHeader && $document[0].getElementsByClassName('tabs-top').length)
                  tElement.addClass('has-tabs-top');
              });
              return {pre: prelink};
              function prelink($scope, $element, $attr, ctrl) {
                if (isHeader) {
                  $scope.$watch(function() {
                    return $element[0].className;
                  }, function(value) {
                    var isShown = value.indexOf('ng-hide') === -1;
                    var isSubheader = value.indexOf('bar-subheader') !== -1;
                    $scope.$hasHeader = isShown && !isSubheader;
                    $scope.$hasSubheader = isShown && isSubheader;
                  });
                  $scope.$on('$destroy', function() {
                    delete $scope.$hasHeader;
                    delete $scope.$hasSubheader;
                  });
                  ctrl.align();
                  $scope.$on('$ionicHeader.align', function() {
                    ionic.requestAnimationFrame(ctrl.align);
                  });
                } else {
                  $scope.$watch(function() {
                    return $element[0].className;
                  }, function(value) {
                    var isShown = value.indexOf('ng-hide') === -1;
                    var isSubfooter = value.indexOf('bar-subfooter') !== -1;
                    $scope.$hasFooter = isShown && !isSubfooter;
                    $scope.$hasSubfooter = isShown && isSubfooter;
                  });
                  $scope.$on('$destroy', function() {
                    delete $scope.$hasFooter;
                    delete $scope.$hasSubfooter;
                  });
                  $scope.$watch('$hasTabs', function(val) {
                    $element.toggleClass('has-tabs', !!val);
                  });
                }
              }
            }
          };
        }];
      }
      IonicModule.directive('ionInfiniteScroll', ['$timeout', function($timeout) {
        function calculateMaxValue(distance, maximum, isPercent) {
          return isPercent ? maximum * (1 - parseFloat(distance, 10) / 100) : maximum - parseFloat(distance, 10);
        }
        return {
          restrict: 'E',
          require: ['^$ionicScroll', 'ionInfiniteScroll'],
          template: '<i class="icon {{icon()}} icon-refreshing"></i>',
          scope: {load: '&onInfinite'},
          controller: ['$scope', '$attrs', function($scope, $attrs) {
            this.isLoading = false;
            this.scrollView = null;
            this.getMaxScroll = function() {
              var distance = ($attrs.distance || '2.5%').trim();
              var isPercent = distance.indexOf('%') !== -1;
              var maxValues = this.scrollView.getScrollMax();
              return {
                left: this.scrollView.options.scrollingX ? calculateMaxValue(distance, maxValues.left, isPercent) : -1,
                top: this.scrollView.options.scrollingY ? calculateMaxValue(distance, maxValues.top, isPercent) : -1
              };
            };
          }],
          link: function($scope, $element, $attrs, ctrls) {
            var scrollCtrl = ctrls[0];
            var infiniteScrollCtrl = ctrls[1];
            var scrollView = infiniteScrollCtrl.scrollView = scrollCtrl.scrollView;
            $scope.icon = function() {
              return angular.isDefined($attrs.icon) ? $attrs.icon : 'ion-loading-d';
            };
            var onInfinite = function() {
              $element[0].classList.add('active');
              infiniteScrollCtrl.isLoading = true;
              $scope.load();
            };
            var finishInfiniteScroll = function() {
              $element[0].classList.remove('active');
              $timeout(function() {
                scrollView.resize();
                checkBounds();
              }, 0, false);
              infiniteScrollCtrl.isLoading = false;
            };
            $scope.$on('scroll.infiniteScrollComplete', function() {
              finishInfiniteScroll();
            });
            $scope.$on('$destroy', function() {
              if (scrollCtrl && scrollCtrl.$element)
                scrollCtrl.$element.off('scroll', checkBounds);
            });
            var checkBounds = ionic.animationFrameThrottle(checkInfiniteBounds);
            $timeout(checkBounds, 0, false);
            scrollCtrl.$element.on('scroll', checkBounds);
            function checkInfiniteBounds() {
              if (infiniteScrollCtrl.isLoading)
                return;
              var scrollValues = scrollView.getValues();
              var maxScroll = infiniteScrollCtrl.getMaxScroll();
              if ((maxScroll.left !== -1 && scrollValues.left >= maxScroll.left) || (maxScroll.top !== -1 && scrollValues.top >= maxScroll.top)) {
                onInfinite();
              }
            }
          }
        };
      }]);
      var ITEM_TPL_CONTENT_ANCHOR = '<a class="item-content" ng-href="{{$href()}}" target="{{$target()}}"></a>';
      var ITEM_TPL_CONTENT = '<div class="item-content"></div>';
      IonicModule.directive('ionItem', function() {
        return {
          restrict: 'E',
          controller: ['$scope', '$element', function($scope, $element) {
            this.$scope = $scope;
            this.$element = $element;
          }],
          scope: true,
          compile: function($element, $attrs) {
            var isAnchor = angular.isDefined($attrs.href) || angular.isDefined($attrs.ngHref) || angular.isDefined($attrs.uiSref);
            var isComplexItem = isAnchor || /ion-(delete|option|reorder)-button/i.test($element.html());
            if (isComplexItem) {
              var innerElement = jqLite(isAnchor ? ITEM_TPL_CONTENT_ANCHOR : ITEM_TPL_CONTENT);
              innerElement.append($element.contents());
              $element.append(innerElement);
              $element.addClass('item item-complex');
            } else {
              $element.addClass('item');
            }
            return function link($scope, $element, $attrs) {
              $scope.$href = function() {
                return $attrs.href || $attrs.ngHref;
              };
              $scope.$target = function() {
                return $attrs.target || '_self';
              };
            };
          }
        };
      });
      var ITEM_TPL_DELETE_BUTTON = '<div class="item-left-edit item-delete enable-pointer-events">' + '</div>';
      IonicModule.directive('ionDeleteButton', function() {
        return {
          restrict: 'E',
          require: ['^ionItem', '^?ionList'],
          priority: Number.MAX_VALUE,
          compile: function($element, $attr) {
            $attr.$set('class', ($attr['class'] || '') + ' button icon button-icon', true);
            return function($scope, $element, $attr, ctrls) {
              var itemCtrl = ctrls[0];
              var listCtrl = ctrls[1];
              var container = jqLite(ITEM_TPL_DELETE_BUTTON);
              container.append($element);
              itemCtrl.$element.append(container).addClass('item-left-editable');
              if (listCtrl && listCtrl.showDelete()) {
                container.addClass('visible active');
              }
            };
          }
        };
      });
      IonicModule.directive('itemFloatingLabel', function() {
        return {
          restrict: 'C',
          link: function(scope, element) {
            var el = element[0];
            var input = el.querySelector('input, textarea');
            var inputLabel = el.querySelector('.input-label');
            if (!input || !inputLabel)
              return;
            var onInput = function() {
              if (input.value) {
                inputLabel.classList.add('has-input');
              } else {
                inputLabel.classList.remove('has-input');
              }
            };
            input.addEventListener('input', onInput);
            var ngModelCtrl = angular.element(input).controller('ngModel');
            if (ngModelCtrl) {
              ngModelCtrl.$render = function() {
                input.value = ngModelCtrl.$viewValue || '';
                onInput();
              };
            }
            scope.$on('$destroy', function() {
              input.removeEventListener('input', onInput);
            });
          }
        };
      });
      var ITEM_TPL_OPTION_BUTTONS = '<div class="item-options invisible">' + '</div>';
      IonicModule.directive('ionOptionButton', ['$compile', function($compile) {
        function stopPropagation(e) {
          e.stopPropagation();
        }
        return {
          restrict: 'E',
          require: '^ionItem',
          priority: Number.MAX_VALUE,
          compile: function($element, $attr) {
            $attr.$set('class', ($attr['class'] || '') + ' button', true);
            return function($scope, $element, $attr, itemCtrl) {
              if (!itemCtrl.optionsContainer) {
                itemCtrl.optionsContainer = jqLite(ITEM_TPL_OPTION_BUTTONS);
                itemCtrl.$element.append(itemCtrl.optionsContainer);
              }
              itemCtrl.optionsContainer.append($element);
              itemCtrl.$element.addClass('item-right-editable');
              $element.on('click', stopPropagation);
            };
          }
        };
      }]);
      var ITEM_TPL_REORDER_BUTTON = '<div data-prevent-scroll="true" class="item-right-edit item-reorder enable-pointer-events">' + '</div>';
      IonicModule.directive('ionReorderButton', ['$parse', function($parse) {
        return {
          restrict: 'E',
          require: ['^ionItem', '^?ionList'],
          priority: Number.MAX_VALUE,
          compile: function($element, $attr) {
            $attr.$set('class', ($attr['class'] || '') + ' button icon button-icon', true);
            $element[0].setAttribute('data-prevent-scroll', true);
            return function($scope, $element, $attr, ctrls) {
              var itemCtrl = ctrls[0];
              var listCtrl = ctrls[1];
              var onReorderFn = $parse($attr.onReorder);
              $scope.$onReorder = function(oldIndex, newIndex) {
                onReorderFn($scope, {
                  $fromIndex: oldIndex,
                  $toIndex: newIndex
                });
              };
              if (!$attr.ngClick && !$attr.onClick && !$attr.onclick) {
                $element[0].onclick = function(e) {
                  e.stopPropagation();
                  return false;
                };
              }
              var container = jqLite(ITEM_TPL_REORDER_BUTTON);
              container.append($element);
              itemCtrl.$element.append(container).addClass('item-right-editable');
              if (listCtrl && listCtrl.showReorder()) {
                container.addClass('visible active');
              }
            };
          }
        };
      }]);
      IonicModule.directive('keyboardAttach', function() {
        return function(scope, element, attrs) {
          ionic.on('native.keyboardshow', onShow, window);
          ionic.on('native.keyboardhide', onHide, window);
          ionic.on('native.showkeyboard', onShow, window);
          ionic.on('native.hidekeyboard', onHide, window);
          var scrollCtrl;
          function onShow(e) {
            if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
              return;
            }
            var keyboardHeight = e.keyboardHeight || e.detail.keyboardHeight;
            element.css('bottom', keyboardHeight + "px");
            scrollCtrl = element.controller('$ionicScroll');
            if (scrollCtrl) {
              scrollCtrl.scrollView.__container.style.bottom = keyboardHeight + keyboardAttachGetClientHeight(element[0]) + "px";
            }
          }
          function onHide() {
            if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
              return;
            }
            element.css('bottom', '');
            if (scrollCtrl) {
              scrollCtrl.scrollView.__container.style.bottom = '';
            }
          }
          scope.$on('$destroy', function() {
            ionic.off('native.keyboardshow', onShow, window);
            ionic.off('native.keyboardhide', onHide, window);
            ionic.off('native.showkeyboard', onShow, window);
            ionic.off('native.hidekeyboard', onHide, window);
          });
        };
      });
      function keyboardAttachGetClientHeight(element) {
        return element.clientHeight;
      }
      IonicModule.directive('ionList', ['$timeout', function($timeout) {
        return {
          restrict: 'E',
          require: ['ionList', '^?$ionicScroll'],
          controller: '$ionicList',
          compile: function($element, $attr) {
            var listEl = jqLite('<div class="list">').append($element.contents()).addClass($attr.type);
            $element.append(listEl);
            return function($scope, $element, $attrs, ctrls) {
              var listCtrl = ctrls[0];
              var scrollCtrl = ctrls[1];
              $timeout(init);
              function init() {
                var listView = listCtrl.listView = new ionic.views.ListView({
                  el: $element[0],
                  listEl: $element.children()[0],
                  scrollEl: scrollCtrl && scrollCtrl.element,
                  scrollView: scrollCtrl && scrollCtrl.scrollView,
                  onReorder: function(el, oldIndex, newIndex) {
                    var itemScope = jqLite(el).scope();
                    if (itemScope && itemScope.$onReorder) {
                      $timeout(function() {
                        itemScope.$onReorder(oldIndex, newIndex);
                      });
                    }
                  },
                  canSwipe: function() {
                    return listCtrl.canSwipeItems();
                  }
                });
                $scope.$on('$destroy', function() {
                  if (listView) {
                    listView.deregister && listView.deregister();
                    listView = null;
                  }
                });
                if (isDefined($attr.canSwipe)) {
                  $scope.$watch('!!(' + $attr.canSwipe + ')', function(value) {
                    listCtrl.canSwipeItems(value);
                  });
                }
                if (isDefined($attr.showDelete)) {
                  $scope.$watch('!!(' + $attr.showDelete + ')', function(value) {
                    listCtrl.showDelete(value);
                  });
                }
                if (isDefined($attr.showReorder)) {
                  $scope.$watch('!!(' + $attr.showReorder + ')', function(value) {
                    listCtrl.showReorder(value);
                  });
                }
                $scope.$watch(function() {
                  return listCtrl.showDelete();
                }, function(isShown, wasShown) {
                  if (!isShown && !wasShown) {
                    return;
                  }
                  if (isShown)
                    listCtrl.closeOptionButtons();
                  listCtrl.canSwipeItems(!isShown);
                  $element.children().toggleClass('list-left-editing', isShown);
                  $element.toggleClass('disable-pointer-events', isShown);
                  var deleteButton = jqLite($element[0].getElementsByClassName('item-delete'));
                  setButtonShown(deleteButton, listCtrl.showDelete);
                });
                $scope.$watch(function() {
                  return listCtrl.showReorder();
                }, function(isShown, wasShown) {
                  if (!isShown && !wasShown) {
                    return;
                  }
                  if (isShown)
                    listCtrl.closeOptionButtons();
                  listCtrl.canSwipeItems(!isShown);
                  $element.children().toggleClass('list-right-editing', isShown);
                  $element.toggleClass('disable-pointer-events', isShown);
                  var reorderButton = jqLite($element[0].getElementsByClassName('item-reorder'));
                  setButtonShown(reorderButton, listCtrl.showReorder);
                });
                function setButtonShown(el, shown) {
                  shown() && el.addClass('visible') || el.removeClass('active');
                  ionic.requestAnimationFrame(function() {
                    shown() && el.addClass('active') || el.removeClass('visible');
                  });
                }
              }
            };
          }
        };
      }]);
      IonicModule.directive('menuClose', ['$ionicHistory', function($ionicHistory) {
        return {
          restrict: 'AC',
          link: function($scope, $element) {
            $element.bind('click', function() {
              var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
              if (sideMenuCtrl) {
                $ionicHistory.nextViewOptions({
                  historyRoot: true,
                  disableAnimate: true,
                  expire: 300
                });
                sideMenuCtrl.close();
              }
            });
          }
        };
      }]);
      IonicModule.directive('menuToggle', function() {
        return {
          restrict: 'AC',
          link: function($scope, $element, $attr) {
            $scope.$on('$ionicView.beforeEnter', function(ev, viewData) {
              if (viewData.enableBack) {
                var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
                if (!sideMenuCtrl.enableMenuWithBackViews()) {
                  $element.addClass('hide');
                }
              } else {
                $element.removeClass('hide');
              }
            });
            $element.bind('click', function() {
              var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
              sideMenuCtrl && sideMenuCtrl.toggle($attr.menuToggle);
            });
          }
        };
      });
      IonicModule.directive('ionModal', [function() {
        return {
          restrict: 'E',
          transclude: true,
          replace: true,
          controller: [function() {}],
          template: '<div class="modal-backdrop">' + '<div class="modal-wrapper" ng-transclude></div>' + '</div>'
        };
      }]);
      IonicModule.directive('ionModalView', function() {
        return {
          restrict: 'E',
          compile: function(element, attr) {
            element.addClass('modal');
          }
        };
      });
      IonicModule.directive('ionNavBackButton', ['$ionicConfig', '$document', function($ionicConfig, $document) {
        return {
          restrict: 'E',
          require: '^ionNavBar',
          compile: function(tElement, tAttrs) {
            var buttonEle = $document[0].createElement('button');
            for (var n in tAttrs.$attr) {
              buttonEle.setAttribute(tAttrs.$attr[n], tAttrs[n]);
            }
            if (!tAttrs.ngClick) {
              buttonEle.setAttribute('ng-click', '$ionicGoBack($event)');
            }
            buttonEle.className = 'button back-button hide buttons ' + (tElement.attr('class') || '');
            buttonEle.innerHTML = tElement.html() || '';
            var childNode;
            var hasIcon = hasIconClass(tElement[0]);
            var hasInnerText;
            var hasButtonText;
            var hasPreviousTitle;
            for (var x = 0; x < tElement[0].childNodes.length; x++) {
              childNode = tElement[0].childNodes[x];
              if (childNode.nodeType === 1) {
                if (hasIconClass(childNode)) {
                  hasIcon = true;
                } else if (childNode.classList.contains('default-title')) {
                  hasButtonText = true;
                } else if (childNode.classList.contains('previous-title')) {
                  hasPreviousTitle = true;
                }
              } else if (!hasInnerText && childNode.nodeType === 3) {
                hasInnerText = !!childNode.nodeValue.trim();
              }
            }
            function hasIconClass(ele) {
              return /ion-|icon/.test(ele.className);
            }
            var defaultIcon = $ionicConfig.backButton.icon();
            if (!hasIcon && defaultIcon && defaultIcon !== 'none') {
              buttonEle.innerHTML = '<i class="icon ' + defaultIcon + '"></i> ' + buttonEle.innerHTML;
              buttonEle.className += ' button-clear';
            }
            if (!hasInnerText) {
              var buttonTextEle = $document[0].createElement('span');
              buttonTextEle.className = 'back-text';
              if (!hasButtonText && $ionicConfig.backButton.text()) {
                buttonTextEle.innerHTML += '<span class="default-title">' + $ionicConfig.backButton.text() + '</span>';
              }
              if (!hasPreviousTitle && $ionicConfig.backButton.previousTitleText()) {
                buttonTextEle.innerHTML += '<span class="previous-title"></span>';
              }
              buttonEle.appendChild(buttonTextEle);
            }
            tElement.attr('class', 'hide');
            tElement.empty();
            return {pre: function($scope, $element, $attr, navBarCtrl) {
                navBarCtrl.navElement('backButton', buttonEle.outerHTML);
                buttonEle = null;
              }};
          }
        };
      }]);
      IonicModule.directive('ionNavBar', function() {
        return {
          restrict: 'E',
          controller: '$ionicNavBar',
          scope: true,
          link: function($scope, $element, $attr, ctrl) {
            ctrl.init();
          }
        };
      });
      IonicModule.directive('ionNavButtons', ['$document', function($document) {
        return {
          require: '^ionNavBar',
          restrict: 'E',
          compile: function(tElement, tAttrs) {
            var side = 'left';
            if (/^primary|secondary|right$/i.test(tAttrs.side || '')) {
              side = tAttrs.side.toLowerCase();
            }
            var spanEle = $document[0].createElement('span');
            spanEle.className = side + '-buttons';
            spanEle.innerHTML = tElement.html();
            var navElementType = side + 'Buttons';
            tElement.attr('class', 'hide');
            tElement.empty();
            return {pre: function($scope, $element, $attrs, navBarCtrl) {
                var parentViewCtrl = $element.parent().data('$ionViewController');
                if (parentViewCtrl) {
                  parentViewCtrl.navElement(navElementType, spanEle.outerHTML);
                } else {
                  navBarCtrl.navElement(navElementType, spanEle.outerHTML);
                }
                spanEle = null;
              }};
          }
        };
      }]);
      IonicModule.directive('navDirection', ['$ionicViewSwitcher', function($ionicViewSwitcher) {
        return {
          restrict: 'A',
          priority: 1000,
          link: function($scope, $element, $attr) {
            $element.bind('click', function() {
              $ionicViewSwitcher.nextDirection($attr.navDirection);
            });
          }
        };
      }]);
      IonicModule.directive('ionNavTitle', ['$document', function($document) {
        return {
          require: '^ionNavBar',
          restrict: 'E',
          compile: function(tElement, tAttrs) {
            var navElementType = 'title';
            var spanEle = $document[0].createElement('span');
            for (var n in tAttrs.$attr) {
              spanEle.setAttribute(tAttrs.$attr[n], tAttrs[n]);
            }
            spanEle.classList.add('nav-bar-title');
            spanEle.innerHTML = tElement.html();
            tElement.attr('class', 'hide');
            tElement.empty();
            return {pre: function($scope, $element, $attrs, navBarCtrl) {
                var parentViewCtrl = $element.parent().data('$ionViewController');
                if (parentViewCtrl) {
                  parentViewCtrl.navElement(navElementType, spanEle.outerHTML);
                } else {
                  navBarCtrl.navElement(navElementType, spanEle.outerHTML);
                }
                spanEle = null;
              }};
          }
        };
      }]);
      IonicModule.directive('navTransition', ['$ionicViewSwitcher', function($ionicViewSwitcher) {
        return {
          restrict: 'A',
          priority: 1000,
          link: function($scope, $element, $attr) {
            $element.bind('click', function() {
              $ionicViewSwitcher.nextTransition($attr.navTransition);
            });
          }
        };
      }]);
      IonicModule.directive('ionNavView', ['$state', '$ionicConfig', function($state, $ionicConfig) {
        return {
          restrict: 'E',
          terminal: true,
          priority: 2000,
          transclude: true,
          controller: '$ionicNavView',
          compile: function(tElement, tAttrs, transclude) {
            tElement.addClass('view-container');
            ionic.DomUtil.cachedAttr(tElement, 'nav-view-transition', $ionicConfig.views.transition());
            return function($scope, $element, $attr, navViewCtrl) {
              var latestLocals;
              transclude($scope, function(clone) {
                $element.append(clone);
              });
              var viewData = navViewCtrl.init();
              $scope.$on('$stateChangeSuccess', function() {
                updateView(false);
              });
              $scope.$on('$viewContentLoading', function() {
                updateView(false);
              });
              updateView(true);
              function updateView(firstTime) {
                var viewLocals = $state.$current && $state.$current.locals[viewData.name];
                if (!viewLocals || (!firstTime && viewLocals === latestLocals))
                  return;
                latestLocals = viewLocals;
                viewData.state = viewLocals.$$state;
                navViewCtrl.register(viewLocals);
              }
            };
          }
        };
      }]);
      IonicModule.config(['$provide', function($provide) {
        $provide.decorator('ngClickDirective', ['$delegate', function($delegate) {
          $delegate.shift();
          return $delegate;
        }]);
      }]).factory('$ionicNgClick', ['$parse', function($parse) {
        return function(scope, element, clickExpr) {
          var clickHandler = angular.isFunction(clickExpr) ? clickExpr : $parse(clickExpr);
          element.on('click', function(event) {
            scope.$apply(function() {
              clickHandler(scope, {$event: (event)});
            });
          });
          element.onclick = function(event) {};
        };
      }]).directive('ngClick', ['$ionicNgClick', function($ionicNgClick) {
        return function(scope, element, attr) {
          $ionicNgClick(scope, element, attr.ngClick);
        };
      }]).directive('ionStopEvent', function() {
        return {
          restrict: 'A',
          link: function(scope, element, attr) {
            element.bind(attr.ionStopEvent, eventStopPropagation);
          }
        };
      });
      function eventStopPropagation(e) {
        e.stopPropagation();
      }
      IonicModule.directive('ionPane', function() {
        return {
          restrict: 'E',
          link: function(scope, element, attr) {
            element.addClass('pane');
          }
        };
      });
      IonicModule.directive('ionPopover', [function() {
        return {
          restrict: 'E',
          transclude: true,
          replace: true,
          controller: [function() {}],
          template: '<div class="popover-backdrop">' + '<div class="popover-wrapper" ng-transclude></div>' + '</div>'
        };
      }]);
      IonicModule.directive('ionPopoverView', function() {
        return {
          restrict: 'E',
          compile: function(element) {
            element.append(angular.element('<div class="popover-arrow"></div>'));
            element.addClass('popover');
          }
        };
      });
      IonicModule.directive('ionRadio', function() {
        return {
          restrict: 'E',
          replace: true,
          require: '?ngModel',
          transclude: true,
          template: '<label class="item item-radio">' + '<input type="radio" name="radio-group">' + '<div class="item-content disable-pointer-events" ng-transclude></div>' + '<i class="radio-icon disable-pointer-events icon ion-checkmark"></i>' + '</label>',
          compile: function(element, attr) {
            if (attr.icon)
              element.children().eq(2).removeClass('ion-checkmark').addClass(attr.icon);
            var input = element.find('input');
            forEach({
              'name': attr.name,
              'value': attr.value,
              'disabled': attr.disabled,
              'ng-value': attr.ngValue,
              'ng-model': attr.ngModel,
              'ng-disabled': attr.ngDisabled,
              'ng-change': attr.ngChange
            }, function(value, name) {
              if (isDefined(value)) {
                input.attr(name, value);
              }
            });
            return function(scope, element, attr) {
              scope.getValue = function() {
                return scope.ngValue || attr.value;
              };
            };
          }
        };
      });
      IonicModule.directive('ionRefresher', ['$ionicBind', function($ionicBind) {
        return {
          restrict: 'E',
          replace: true,
          require: '^$ionicScroll',
          template: '<div class="scroll-refresher" collection-repeat-ignore>' + '<div class="ionic-refresher-content" ' + 'ng-class="{\'ionic-refresher-with-text\': pullingText || refreshingText}">' + '<div class="icon-pulling" ng-class="{\'pulling-rotation-disabled\':disablePullingRotation}">' + '<i class="icon {{pullingIcon}}"></i>' + '</div>' + '<div class="text-pulling" ng-bind-html="pullingText"></div>' + '<div class="icon-refreshing"><i class="icon {{refreshingIcon}}"></i></div>' + '<div class="text-refreshing" ng-bind-html="refreshingText"></div>' + '</div>' + '</div>',
          compile: function($element, $attrs) {
            if (angular.isUndefined($attrs.pullingIcon)) {
              $attrs.$set('pullingIcon', 'ion-ios7-arrow-down');
            }
            if (angular.isUndefined($attrs.refreshingIcon)) {
              $attrs.$set('refreshingIcon', 'ion-loading-d');
            }
            return function($scope, $element, $attrs, scrollCtrl) {
              $ionicBind($scope, $attrs, {
                pullingIcon: '@',
                pullingText: '@',
                refreshingIcon: '@',
                refreshingText: '@',
                disablePullingRotation: '@',
                $onRefresh: '&onRefresh',
                $onPulling: '&onPulling'
              });
              scrollCtrl._setRefresher($scope, $element[0]);
              $scope.$on('scroll.refreshComplete', function() {
                $scope.$evalAsync(function() {
                  scrollCtrl.scrollView.finishPullToRefresh();
                });
              });
            };
          }
        };
      }]);
      IonicModule.directive('ionScroll', ['$timeout', '$controller', '$ionicBind', function($timeout, $controller, $ionicBind) {
        return {
          restrict: 'E',
          scope: true,
          controller: function() {},
          compile: function(element, attr) {
            element.addClass('scroll-view ionic-scroll');
            var innerElement = jqLite('<div class="scroll"></div>');
            innerElement.append(element.contents());
            element.append(innerElement);
            return {pre: prelink};
            function prelink($scope, $element, $attr) {
              var scrollView,
                  scrollCtrl;
              $ionicBind($scope, $attr, {
                direction: '@',
                paging: '@',
                $onScroll: '&onScroll',
                scroll: '@',
                scrollbarX: '@',
                scrollbarY: '@',
                zooming: '@',
                minZoom: '@',
                maxZoom: '@'
              });
              $scope.direction = $scope.direction || 'y';
              if (angular.isDefined($attr.padding)) {
                $scope.$watch($attr.padding, function(newVal) {
                  innerElement.toggleClass('padding', !!newVal);
                });
              }
              if ($scope.$eval($scope.paging) === true) {
                innerElement.addClass('scroll-paging');
              }
              if (!$scope.direction) {
                $scope.direction = 'y';
              }
              var isPaging = $scope.$eval($scope.paging) === true;
              var scrollViewOptions = {
                el: $element[0],
                delegateHandle: $attr.delegateHandle,
                locking: ($attr.locking || 'true') === 'true',
                bouncing: $scope.$eval($attr.hasBouncing),
                paging: isPaging,
                scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
                scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
                scrollingX: $scope.direction.indexOf('x') >= 0,
                scrollingY: $scope.direction.indexOf('y') >= 0,
                zooming: $scope.$eval($scope.zooming) === true,
                maxZoom: $scope.$eval($scope.maxZoom) || 3,
                minZoom: $scope.$eval($scope.minZoom) || 0.5,
                preventDefault: true
              };
              if (isPaging) {
                scrollViewOptions.speedMultiplier = 0.8;
                scrollViewOptions.bouncing = false;
              }
              scrollCtrl = $controller('$ionicScroll', {
                $scope: $scope,
                scrollViewOptions: scrollViewOptions
              });
              scrollView = $scope.$parent.scrollView = scrollCtrl.scrollView;
            }
          }
        };
      }]);
      IonicModule.directive('ionSideMenu', function() {
        return {
          restrict: 'E',
          require: '^ionSideMenus',
          scope: true,
          compile: function(element, attr) {
            angular.isUndefined(attr.isEnabled) && attr.$set('isEnabled', 'true');
            angular.isUndefined(attr.width) && attr.$set('width', '275');
            element.addClass('menu menu-' + attr.side);
            return function($scope, $element, $attr, sideMenuCtrl) {
              $scope.side = $attr.side || 'left';
              var sideMenu = sideMenuCtrl[$scope.side] = new ionic.views.SideMenu({
                width: attr.width,
                el: $element[0],
                isEnabled: true
              });
              $scope.$watch($attr.width, function(val) {
                var numberVal = +val;
                if (numberVal && numberVal == val) {
                  sideMenu.setWidth(+val);
                }
              });
              $scope.$watch($attr.isEnabled, function(val) {
                sideMenu.setIsEnabled(!!val);
              });
            };
          }
        };
      });
      IonicModule.directive('ionSideMenuContent', ['$timeout', '$ionicGesture', '$window', function($timeout, $ionicGesture, $window) {
        return {
          restrict: 'EA',
          require: '^ionSideMenus',
          scope: true,
          compile: function(element, attr) {
            element.addClass('menu-content pane');
            return {pre: prelink};
            function prelink($scope, $element, $attr, sideMenuCtrl) {
              var startCoord = null;
              var primaryScrollAxis = null;
              if (isDefined(attr.dragContent)) {
                $scope.$watch(attr.dragContent, function(value) {
                  sideMenuCtrl.canDragContent(value);
                });
              } else {
                sideMenuCtrl.canDragContent(true);
              }
              if (isDefined(attr.edgeDragThreshold)) {
                $scope.$watch(attr.edgeDragThreshold, function(value) {
                  sideMenuCtrl.edgeDragThreshold(value);
                });
              }
              function onContentTap(gestureEvt) {
                if (sideMenuCtrl.getOpenAmount() !== 0) {
                  sideMenuCtrl.close();
                  gestureEvt.gesture.srcEvent.preventDefault();
                  startCoord = null;
                  primaryScrollAxis = null;
                } else if (!startCoord) {
                  startCoord = ionic.tap.pointerCoord(gestureEvt.gesture.srcEvent);
                }
              }
              function onDragX(e) {
                if (!sideMenuCtrl.isDraggableTarget(e))
                  return;
                if (getPrimaryScrollAxis(e) == 'x') {
                  sideMenuCtrl._handleDrag(e);
                  e.gesture.srcEvent.preventDefault();
                }
              }
              function onDragY(e) {
                if (getPrimaryScrollAxis(e) == 'x') {
                  e.gesture.srcEvent.preventDefault();
                }
              }
              function onDragRelease(e) {
                sideMenuCtrl._endDrag(e);
                startCoord = null;
                primaryScrollAxis = null;
              }
              function getPrimaryScrollAxis(gestureEvt) {
                if (primaryScrollAxis) {
                  return primaryScrollAxis;
                }
                if (gestureEvt && gestureEvt.gesture) {
                  if (!startCoord) {
                    startCoord = ionic.tap.pointerCoord(gestureEvt.gesture.srcEvent);
                  } else {
                    var endCoord = ionic.tap.pointerCoord(gestureEvt.gesture.srcEvent);
                    var xDistance = Math.abs(endCoord.x - startCoord.x);
                    var yDistance = Math.abs(endCoord.y - startCoord.y);
                    var scrollAxis = (xDistance < yDistance ? 'y' : 'x');
                    if (Math.max(xDistance, yDistance) > 30) {
                      primaryScrollAxis = scrollAxis;
                    }
                    return scrollAxis;
                  }
                }
                return 'y';
              }
              var content = {
                element: element[0],
                onDrag: function(e) {},
                endDrag: function(e) {},
                getTranslateX: function() {
                  return $scope.sideMenuContentTranslateX || 0;
                },
                setTranslateX: ionic.animationFrameThrottle(function(amount) {
                  var xTransform = content.offsetX + amount;
                  $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(' + xTransform + 'px,0,0)';
                  $timeout(function() {
                    $scope.sideMenuContentTranslateX = amount;
                  });
                }),
                setMarginLeft: ionic.animationFrameThrottle(function(amount) {
                  if (amount) {
                    amount = parseInt(amount, 10);
                    $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(' + amount + 'px,0,0)';
                    $element[0].style.width = ($window.innerWidth - amount) + 'px';
                    content.offsetX = amount;
                  } else {
                    $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(0,0,0)';
                    $element[0].style.width = '';
                    content.offsetX = 0;
                  }
                }),
                setMarginRight: ionic.animationFrameThrottle(function(amount) {
                  if (amount) {
                    amount = parseInt(amount, 10);
                    $element[0].style.width = ($window.innerWidth - amount) + 'px';
                    content.offsetX = amount;
                  } else {
                    $element[0].style.width = '';
                    content.offsetX = 0;
                  }
                  $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(0,0,0)';
                }),
                enableAnimation: function() {
                  $scope.animationEnabled = true;
                  $element[0].classList.add('menu-animated');
                },
                disableAnimation: function() {
                  $scope.animationEnabled = false;
                  $element[0].classList.remove('menu-animated');
                },
                offsetX: 0
              };
              sideMenuCtrl.setContent(content);
              var gestureOpts = {stop_browser_behavior: false};
              var contentTapGesture = $ionicGesture.on('tap', onContentTap, $element, gestureOpts);
              var dragRightGesture = $ionicGesture.on('dragright', onDragX, $element, gestureOpts);
              var dragLeftGesture = $ionicGesture.on('dragleft', onDragX, $element, gestureOpts);
              var dragUpGesture = $ionicGesture.on('dragup', onDragY, $element, gestureOpts);
              var dragDownGesture = $ionicGesture.on('dragdown', onDragY, $element, gestureOpts);
              var releaseGesture = $ionicGesture.on('release', onDragRelease, $element, gestureOpts);
              $scope.$on('$destroy', function() {
                if (content) {
                  content.element = null;
                  content = null;
                }
                $ionicGesture.off(dragLeftGesture, 'dragleft', onDragX);
                $ionicGesture.off(dragRightGesture, 'dragright', onDragX);
                $ionicGesture.off(dragUpGesture, 'dragup', onDragY);
                $ionicGesture.off(dragDownGesture, 'dragdown', onDragY);
                $ionicGesture.off(releaseGesture, 'release', onDragRelease);
                $ionicGesture.off(contentTapGesture, 'tap', onContentTap);
              });
            }
          }
        };
      }]);
      IonicModule.directive('ionSideMenus', ['$ionicBody', function($ionicBody) {
        return {
          restrict: 'ECA',
          controller: '$ionicSideMenus',
          compile: function(element, attr) {
            attr.$set('class', (attr['class'] || '') + ' view');
            return {pre: prelink};
            function prelink($scope, $element, $attrs, ctrl) {
              ctrl.enableMenuWithBackViews($scope.$eval($attrs.enableMenuWithBackViews));
              $scope.$on('$ionicExposeAside', function(evt, isAsideExposed) {
                if (!$scope.$exposeAside)
                  $scope.$exposeAside = {};
                $scope.$exposeAside.active = isAsideExposed;
                $ionicBody.enableClass(isAsideExposed, 'aside-open');
              });
              $scope.$on('$ionicView.beforeEnter', function(ev, d) {
                if (d.historyId) {
                  $scope.$activeHistoryId = d.historyId;
                }
              });
              $scope.$on('$destroy', function() {
                $ionicBody.removeClass('menu-open', 'aside-open');
              });
            }
          }
        };
      }]);
      IonicModule.directive('ionSlideBox', ['$timeout', '$compile', '$ionicSlideBoxDelegate', '$ionicHistory', function($timeout, $compile, $ionicSlideBoxDelegate, $ionicHistory) {
        return {
          restrict: 'E',
          replace: true,
          transclude: true,
          scope: {
            autoPlay: '=',
            doesContinue: '@',
            slideInterval: '@',
            showPager: '@',
            pagerClick: '&',
            disableScroll: '@',
            onSlideChanged: '&',
            activeSlide: '=?'
          },
          controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
            var _this = this;
            var continuous = $scope.$eval($scope.doesContinue) === true;
            var shouldAutoPlay = isDefined($attrs.autoPlay) ? !!$scope.autoPlay : false;
            var slideInterval = shouldAutoPlay ? $scope.$eval($scope.slideInterval) || 4000 : 0;
            var slider = new ionic.views.Slider({
              el: $element[0],
              auto: slideInterval,
              continuous: continuous,
              startSlide: $scope.activeSlide,
              slidesChanged: function() {
                $scope.currentSlide = slider.currentIndex();
                $timeout(function() {});
              },
              callback: function(slideIndex) {
                $scope.currentSlide = slideIndex;
                $scope.onSlideChanged({
                  index: $scope.currentSlide,
                  $index: $scope.currentSlide
                });
                $scope.$parent.$broadcast('slideBox.slideChanged', slideIndex);
                $scope.activeSlide = slideIndex;
                $timeout(function() {});
              }
            });
            slider.enableSlide($scope.$eval($attrs.disableScroll) !== true);
            $scope.$watch('activeSlide', function(nv) {
              if (angular.isDefined(nv)) {
                slider.slide(nv);
              }
            });
            $scope.$on('slideBox.nextSlide', function() {
              slider.next();
            });
            $scope.$on('slideBox.prevSlide', function() {
              slider.prev();
            });
            $scope.$on('slideBox.setSlide', function(e, index) {
              slider.slide(index);
            });
            this.__slider = slider;
            var deregisterInstance = $ionicSlideBoxDelegate._registerInstance(slider, $attrs.delegateHandle, function() {
              return $ionicHistory.isActiveScope($scope);
            });
            $scope.$on('$destroy', deregisterInstance);
            this.slidesCount = function() {
              return slider.slidesCount();
            };
            this.onPagerClick = function(index) {
              void 0;
              $scope.pagerClick({index: index});
            };
            $timeout(function() {
              slider.load();
            });
          }],
          template: '<div class="slider">' + '<div class="slider-slides" ng-transclude>' + '</div>' + '</div>',
          link: function($scope, $element, $attr, slideBoxCtrl) {
            if ($scope.$eval($scope.showPager) !== false) {
              var childScope = $scope.$new();
              var pager = jqLite('<ion-pager></ion-pager>');
              $element.append(pager);
              $compile(pager)(childScope);
            }
          }
        };
      }]).directive('ionSlide', function() {
        return {
          restrict: 'E',
          require: '^ionSlideBox',
          compile: function(element, attr) {
            element.addClass('slider-slide');
            return function($scope, $element, $attr) {};
          }
        };
      }).directive('ionPager', function() {
        return {
          restrict: 'E',
          replace: true,
          require: '^ionSlideBox',
          template: '<div class="slider-pager"><span class="slider-pager-page" ng-repeat="slide in numSlides() track by $index" ng-class="{active: $index == currentSlide}" ng-click="pagerClick($index)"><i class="icon ion-record"></i></span></div>',
          link: function($scope, $element, $attr, slideBox) {
            var selectPage = function(index) {
              var children = $element[0].children;
              var length = children.length;
              for (var i = 0; i < length; i++) {
                if (i == index) {
                  children[i].classList.add('active');
                } else {
                  children[i].classList.remove('active');
                }
              }
            };
            $scope.pagerClick = function(index) {
              slideBox.onPagerClick(index);
            };
            $scope.numSlides = function() {
              return new Array(slideBox.slidesCount());
            };
            $scope.$watch('currentSlide', function(v) {
              selectPage(v);
            });
          }
        };
      });
      IonicModule.directive('ionTab', ['$compile', '$ionicConfig', '$ionicBind', '$ionicViewSwitcher', function($compile, $ionicConfig, $ionicBind, $ionicViewSwitcher) {
        function attrStr(k, v) {
          return angular.isDefined(v) ? ' ' + k + '="' + v + '"' : '';
        }
        return {
          restrict: 'E',
          require: ['^ionTabs', 'ionTab'],
          controller: '$ionicTab',
          scope: true,
          compile: function(element, attr) {
            var tabNavTemplate = '<ion-tab-nav' + attrStr('ng-click', attr.ngClick) + attrStr('title', attr.title) + attrStr('icon', attr.icon) + attrStr('icon-on', attr.iconOn) + attrStr('icon-off', attr.iconOff) + attrStr('badge', attr.badge) + attrStr('badge-style', attr.badgeStyle) + attrStr('hidden', attr.hidden) + attrStr('class', attr['class']) + '></ion-tab-nav>';
            var tabContentEle = document.createElement('div');
            for (var x = 0; x < element[0].children.length; x++) {
              tabContentEle.appendChild(element[0].children[x].cloneNode(true));
            }
            var childElementCount = tabContentEle.childElementCount;
            element.empty();
            var navViewName,
                isNavView;
            if (childElementCount) {
              if (tabContentEle.children[0].tagName === 'ION-NAV-VIEW') {
                navViewName = tabContentEle.children[0].getAttribute('name');
                tabContentEle.children[0].classList.add('view-container');
                isNavView = true;
              }
              if (childElementCount === 1) {
                tabContentEle = tabContentEle.children[0];
              }
              if (!isNavView)
                tabContentEle.classList.add('pane');
              tabContentEle.classList.add('tab-content');
            }
            return function link($scope, $element, $attr, ctrls) {
              var childScope;
              var childElement;
              var tabsCtrl = ctrls[0];
              var tabCtrl = ctrls[1];
              var isTabContentAttached = false;
              $ionicBind($scope, $attr, {
                onSelect: '&',
                onDeselect: '&',
                title: '@',
                uiSref: '@',
                href: '@'
              });
              tabsCtrl.add($scope);
              $scope.$on('$destroy', function() {
                if (!$scope.$tabsDestroy) {
                  tabsCtrl.remove($scope);
                }
                tabNavElement.isolateScope().$destroy();
                tabNavElement.remove();
                tabNavElement = tabContentEle = childElement = null;
              });
              $element[0].removeAttribute('title');
              if (navViewName) {
                tabCtrl.navViewName = $scope.navViewName = navViewName;
              }
              $scope.$on('$stateChangeSuccess', selectIfMatchesState);
              selectIfMatchesState();
              function selectIfMatchesState() {
                if (tabCtrl.tabMatchesState()) {
                  tabsCtrl.select($scope, false);
                }
              }
              var tabNavElement = jqLite(tabNavTemplate);
              tabNavElement.data('$ionTabsController', tabsCtrl);
              tabNavElement.data('$ionTabController', tabCtrl);
              tabsCtrl.$tabsElement.append($compile(tabNavElement)($scope));
              function tabSelected(isSelected) {
                if (isSelected && childElementCount) {
                  if (!isTabContentAttached) {
                    childScope = $scope.$new();
                    childElement = jqLite(tabContentEle);
                    $ionicViewSwitcher.viewEleIsActive(childElement, true);
                    tabsCtrl.$element.append(childElement);
                    $compile(childElement)(childScope);
                    isTabContentAttached = true;
                  }
                  $ionicViewSwitcher.viewEleIsActive(childElement, true);
                } else if (isTabContentAttached && childElement) {
                  if ($ionicConfig.views.maxCache() > 0) {
                    $ionicViewSwitcher.viewEleIsActive(childElement, false);
                  } else {
                    destroyTab();
                  }
                }
              }
              function destroyTab() {
                childScope && childScope.$destroy();
                isTabContentAttached && childElement && childElement.remove();
                isTabContentAttached = childScope = childElement = null;
              }
              $scope.$watch('$tabSelected', tabSelected);
              $scope.$on('$ionicView.afterEnter', function() {
                $ionicViewSwitcher.viewEleIsActive(childElement, $scope.$tabSelected);
              });
              $scope.$on('$ionicView.clearCache', function() {
                if (!$scope.$tabSelected) {
                  destroyTab();
                }
              });
            };
          }
        };
      }]);
      IonicModule.directive('ionTabNav', [function() {
        return {
          restrict: 'E',
          replace: true,
          require: ['^ionTabs', '^ionTab'],
          template: '<a ng-class="{\'tab-item-active\': isTabActive(), \'has-badge\':badge, \'tab-hidden\':isHidden()}" ' + ' class="tab-item">' + '<span class="badge {{badgeStyle}}" ng-if="badge">{{badge}}</span>' + '<i class="icon {{getIconOn()}}" ng-if="getIconOn() && isTabActive()"></i>' + '<i class="icon {{getIconOff()}}" ng-if="getIconOff() && !isTabActive()"></i>' + '<span class="tab-title" ng-bind-html="title"></span>' + '</a>',
          scope: {
            title: '@',
            icon: '@',
            iconOn: '@',
            iconOff: '@',
            badge: '=',
            hidden: '@',
            badgeStyle: '@',
            'class': '@'
          },
          compile: function(element, attr, transclude) {
            return function link($scope, $element, $attrs, ctrls) {
              var tabsCtrl = ctrls[0],
                  tabCtrl = ctrls[1];
              $element[0].removeAttribute('title');
              $scope.selectTab = function(e) {
                e.preventDefault();
                tabsCtrl.select(tabCtrl.$scope, true);
              };
              if (!$attrs.ngClick) {
                $element.on('click', function(event) {
                  $scope.$apply(function() {
                    $scope.selectTab(event);
                  });
                });
              }
              $scope.isHidden = function() {
                if ($attrs.hidden === 'true' || $attrs.hidden === true)
                  return true;
                return false;
              };
              $scope.getIconOn = function() {
                return $scope.iconOn || $scope.icon;
              };
              $scope.getIconOff = function() {
                return $scope.iconOff || $scope.icon;
              };
              $scope.isTabActive = function() {
                return tabsCtrl.selectedTab() === tabCtrl.$scope;
              };
            };
          }
        };
      }]);
      IonicModule.directive('ionTabs', ['$ionicTabsDelegate', '$ionicConfig', '$ionicHistory', function($ionicTabsDelegate, $ionicConfig, $ionicHistory) {
        return {
          restrict: 'E',
          scope: true,
          controller: '$ionicTabs',
          compile: function(tElement) {
            var innerElement = jqLite('<div class="tab-nav tabs">');
            innerElement.append(tElement.contents());
            tElement.append(innerElement).addClass('tabs-' + $ionicConfig.tabs.position() + ' tabs-' + $ionicConfig.tabs.style());
            return {
              pre: prelink,
              post: postLink
            };
            function prelink($scope, $element, $attr, tabsCtrl) {
              var deregisterInstance = $ionicTabsDelegate._registerInstance(tabsCtrl, $attr.delegateHandle, tabsCtrl.hasActiveScope);
              tabsCtrl.$scope = $scope;
              tabsCtrl.$element = $element;
              tabsCtrl.$tabsElement = jqLite($element[0].querySelector('.tabs'));
              $scope.$watch(function() {
                return $element[0].className;
              }, function(value) {
                var isTabsTop = value.indexOf('tabs-top') !== -1;
                var isHidden = value.indexOf('tabs-item-hide') !== -1;
                $scope.$hasTabs = !isTabsTop && !isHidden;
                $scope.$hasTabsTop = isTabsTop && !isHidden;
              });
              $scope.$on('$destroy', function() {
                $scope.$tabsDestroy = true;
                deregisterInstance();
                tabsCtrl.$tabsElement = tabsCtrl.$element = tabsCtrl.$scope = innerElement = null;
                delete $scope.$hasTabs;
                delete $scope.$hasTabsTop;
              });
            }
            function postLink($scope, $element, $attr, tabsCtrl) {
              if (!tabsCtrl.selectedTab()) {
                tabsCtrl.select(0);
              }
            }
          }
        };
      }]);
      IonicModule.directive('ionToggle', ['$ionicGesture', '$timeout', function($ionicGesture, $timeout) {
        return {
          restrict: 'E',
          replace: true,
          require: '?ngModel',
          transclude: true,
          template: '<div class="item item-toggle">' + '<div ng-transclude></div>' + '<label class="toggle">' + '<input type="checkbox">' + '<div class="track">' + '<div class="handle"></div>' + '</div>' + '</label>' + '</div>',
          compile: function(element, attr) {
            var input = element.find('input');
            forEach({
              'name': attr.name,
              'ng-value': attr.ngValue,
              'ng-model': attr.ngModel,
              'ng-checked': attr.ngChecked,
              'ng-disabled': attr.ngDisabled,
              'ng-true-value': attr.ngTrueValue,
              'ng-false-value': attr.ngFalseValue,
              'ng-change': attr.ngChange
            }, function(value, name) {
              if (isDefined(value)) {
                input.attr(name, value);
              }
            });
            if (attr.toggleClass) {
              element[0].getElementsByTagName('label')[0].classList.add(attr.toggleClass);
            }
            return function($scope, $element, $attr) {
              var el,
                  checkbox,
                  track,
                  handle;
              el = $element[0].getElementsByTagName('label')[0];
              checkbox = el.children[0];
              track = el.children[1];
              handle = track.children[0];
              var ngModelController = jqLite(checkbox).controller('ngModel');
              $scope.toggle = new ionic.views.Toggle({
                el: el,
                track: track,
                checkbox: checkbox,
                handle: handle,
                onChange: function() {
                  if (checkbox.checked) {
                    ngModelController.$setViewValue(true);
                  } else {
                    ngModelController.$setViewValue(false);
                  }
                  $scope.$apply();
                }
              });
              $scope.$on('$destroy', function() {
                $scope.toggle.destroy();
              });
            };
          }
        };
      }]);
      IonicModule.directive('ionView', function() {
        return {
          restrict: 'EA',
          priority: 1000,
          controller: '$ionicView',
          compile: function(tElement) {
            tElement.addClass('pane');
            tElement[0].removeAttribute('title');
            return function link($scope, $element, $attrs, viewCtrl) {
              viewCtrl.init();
            };
          }
        };
      });
    })();
  }).call(System.global);
  return System.get("@@global-helpers").retrieveGlobal(__module.id, false);
});



System.register("services/contacts/contacts", ["angular", "libraries/ramda/ramda", "./contacts-service"], function($__export) {
  "use strict";
  var __moduleName = "services/contacts/contacts";
  var angular,
      ramda,
      service,
      contacts;
  return {
    setters: [function(m) {
      angular = m.default;
    }, function(m) {
      ramda = m.default;
    }, function(m) {
      service = m.default;
    }],
    execute: function() {
      contacts = angular.module('toc.services.contacts', [ramda.name]).factory(service.name, service);
      $__export('default', contacts);
    }
  };
});



System.register("views/views", ["angular", "./home/home"], function($__export) {
  "use strict";
  var __moduleName = "views/views";
  var angular,
      home,
      views;
  return {
    setters: [function(m) {
      angular = m.default;
    }, function(m) {
      home = m.default;
    }],
    execute: function() {
      views = angular.module('toc.views', [home.name]);
      $__export('default', views);
    }
  };
});



System.register("components/components", ["angular", "./header/header"], function($__export) {
  "use strict";
  var __moduleName = "components/components";
  var angular,
      header,
      components;
  return {
    setters: [function(m) {
      angular = m.default;
    }, function(m) {
      header = m.default;
    }],
    execute: function() {
      components = angular.module('toc.components', [header.name]);
      $__export('default', components);
    }
  };
});



System.register("github:driftyco/ionic-bower@1.0.0-beta.14", ["github:driftyco/ionic-bower@1.0.0-beta.14/js/ionic-angular"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:driftyco/ionic-bower@1.0.0-beta.14/js/ionic-angular");
  global.define = __define;
  return module.exports;
});



System.register("services/services", ["angular", "./contacts/contacts"], function($__export) {
  "use strict";
  var __moduleName = "services/services";
  var angular,
      contacts,
      services;
  return {
    setters: [function(m) {
      angular = m.default;
    }, function(m) {
      contacts = m.default;
    }],
    execute: function() {
      services = angular.module('toc.services', [contacts.name]);
      $__export('default', services);
    }
  };
});



System.register("app", ["angular", "ionic", "app.css!", "./services/services", "./libraries/libraries", "./views/views", "./components/components", "./app-run", "./app-config"], function($__export) {
  "use strict";
  var __moduleName = "app";
  var angular,
      services,
      libraries,
      views,
      components,
      run,
      config,
      app,
      initialize;
  return {
    setters: [function(m) {
      angular = m.default;
    }, function(m) {}, function(m) {}, function(m) {
      services = m.default;
    }, function(m) {
      libraries = m.default;
    }, function(m) {
      views = m.default;
    }, function(m) {
      components = m.default;
    }, function(m) {
      run = m.default;
    }, function(m) {
      config = m.default;
    }],
    execute: function() {
      app = angular.module('toc', ['ionic', services.name, libraries.name, views.name, components.name]).run(run).config(config);
      initialize = function() {
        angular.element(document).ready(function() {
          angular.bootstrap(document.querySelector('[data-toc-app]'), [app.name]);
        });
      };
      app.initialize = initialize;
      $__export('default', app);
    }
  };
});



//# sourceMappingURL=build.js.map