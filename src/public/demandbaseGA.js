if (typeof window.console === "undefined") window.console = {
    log: function () {},
    debug: function () {}
};
if (typeof window.localStorage === "undefined") window.localStorage = function () {};
var Demandbase = window.Demandbase || {};
Demandbase.utils = window.Demandbase.utils || {};
Demandbase.utils = {
    name: "Demandbase Utilities",
    _version: "1.0",
    logging: true,
    djq: null,
    getQueryParam: function (param) {
        var params = {};
        var qs = window.location.search.substring(1);
        var pairs = qs.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var nvArray = pairs[i].split("=");
            var name = nvArray[0];
            var value = nvArray[1];
            params[name] = value
        }
        return params[param]
    },
    flattenData: function (data) {
        for (var d in data) if (typeof data[d] == "object" && data[d] !== null) {
            for (var nd in data[d]) data[d + "_" + nd] = data[d][nd];
            delete data[d]
        }
        return data
    },
    putLS: function (data) {
        for (var item in data) {
            localStorage.setItem(item, data[item]);
            this._log("Set localStorage field: " + item + " : " + data[item])
        }
    },
    getLS: function (value) {
        if (localStorage.getItem(value)) return localStorage.getItem(value);
        else {
            this._log("Requested field: " + value + " was not found in localStorage.");
            return null
        }
    },
    authorize: function (testKey) {
        var djq = jQuery.noConflict() || Demandbase.jQuery;
        if (djq) djq.ajax({
            url: "http://api.demandbase.com/api/v2/ip.json",
            data: {
                key: testKey
            },
            dataType: "jsonp",
            timeout: 2E3,
            success: function (d, t, x) {
                Demandbase.utils._log("Validating key: " + testKey + ".... Confirmed authorized key")
            },
            error: function (d, t, x) {
                Demandbase.utils._log("Validating key: " + testKey + ".... is NOT a valid key")
            }
        });
        else Demandbase.utils._log("Could not authorize key...jQuery is missing.")
    },
    _log: function (msg) {
        if (typeof window.console !== "undefined" && (this.logging || this.getQueryParam("db_logging") === "true")) window.console.log("Demandbase: " + msg)
    },
    runConnectors: function (data) {
        alert("Testing function extension");
        this._log("Testing function extension")
    }
};
Demandbase.utils.runConnectors = function (data) {};
var Demandbase = window.Demandbase || {};
Demandbase.utils = window.Demandbase.utils || {};
Demandbase.Connectors = window.Demandbase.Connectors || {};
Demandbase.IP = {
    name: "Demandbase IP API Wrapper",
    _version: 1,
    CompanyProfile: {},
    _key: window._dbc.key || "",
    _useTestIp: false,
    _testIpAddress: window._dbc.testIp || "3.0.0.1",
    _debug: true,
    _parser: function (data) {
        if (!data) return "";
        try {
            var self = Demandbase.IP,
                dbu = Demandbase.utils;
            data = dbu.flattenData(data);
            this.CompanyProfile = data;
            dbu.runConnectors(data)
        } catch (e) {
            if (Demandbase.debug) alert("DB IP Connector Error: " + e)
        }
    },
    _load: function () {
        var s = document.createElement("script");
        s.async = true;
        s.id = "db_ip_api";
        s.src = ("https:" == document.location.protocol ? "https://" : "http://") + "api.demandbase.com/api/v2/ip.json?key=" + this._key + "&referrer=" + document.referrer + "&page=" + document.location.href + "&page_title=" + document.title + "&callback=Demandbase.IP._parser&query";
        if (this._useTestIp) {
            if (this._testIpAddress == "") {
                this._testIpAddress = Demandbase._getQueryParam("db_ip");
                Demandbase.utils._log("Query IP API...overriding query parameter from URL: " + this._testIpAddress)
            }
            if (this._testIpAddress !== "") {
                s.src = s.src + "=" + this._testIpAddress;
                Demandbase.utils._log("Query IP API...overriding query Demandbase.IP: " + this._testIpAddress)
            }
        }
        document.getElementsByTagName("head")[0].appendChild(s);
        Demandbase.utils._log("Calling IP API...")
    }
};
Demandbase.IP._load();
Demandbase = window.Demandbase || {};
Demandbase.Connectors = window.Demandbase.Connectors || {};
Demandbase.Connectors.Google_Analytics = {
    name: "Demandbase Google Analytics Connector",
    key: "",
    fields: window._dbc.gaCustomVars || [],
    version: "4.1",
    dbDataSet: null,
    track: function (data) {
        try {
            var dbgac = Demandbase.Connectors.Google_Analytics,
                dflt = "(Non-company Visitor)";
            dbgac.dbDataSet = data;
            for (var field in dbgac.fields) {
                var lbl = dbgac.fields[field];
                var val = data[dbgac.fields[field]] || dflt;
                dbgac._var(parseInt(field) + 1, lbl, val, 1);
                Demandbase.utils._log(parseInt(field) + 1 + " " + lbl + " : " + val)
            }
            if (data) {
                var cat = data["audience"] || dflt;
                var act = data["audience_segment"] || dflt;
                var lbl = data["company_name"] || dflt;
                dbgac._cEvent(cat, act, lbl)
            }
            dbgac._event()
        } catch (e) {
            Demandbase.utils._log("Integration Error: " + e)
        }
    },
    load: function () {
        try {
            if (!window._gaq) window._gaq = [];
            if (!Demandbase.IP.CompanyProfile) alert("Demandbase.IP.CompanyProfile: " + Demandbase.IP.CompanyProfile);
            this.track(Demandbase.IP.CompanyProfile);
            _gaq.push(["_addDevId", "NE7T9"])
        } catch (e) {
            Demandbase.utils._log("Script Error: " + e)
        }
    },
    _p: function (t, v1, v2, v3, v4, v5) {
        window._gaq.push([t,
        v1, v2, v3, v4, v5])
    },
    _var: function (i, k, v, s) {
        this._p("_setCustomVar", i, k, v, s)
    },
    _event: function () {
        this._p("_trackEvent", "Demandbase", "API Resolution", "IP API", 0, 1)
    },
    _cEvent: function (cat, act, lbl) {
        this._p("_trackEvent", cat, act, lbl, 0, 1);
        Demandbase.utils._log("Custom Event Tracked: " + cat + " : " + act + " : " + lbl)
    }
};
(function () {
    var runner = Demandbase.utils.runConnectors;
    Demandbase.utils.runConnectors = extRunConnectors;

    function extRunConnectors() {
        runner.apply(Demandbase.utils);
        Demandbase.Connectors.Google_Analytics.load()
    }
})();