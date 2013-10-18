/**
    File: domain.js
    Name: Demandbase Domain API Helper Class
    Authors: Matthew Downs (mdowns[at@]demandbase[dot.]com)
    Support Contact: strategicservices[at@]demandbase[dot.]com
    License: Copyright 2013. This code may not be reused without explicit permission by its owners. All rights reserved.
**/
'use strict';
var Demandbase = window.Demandbase || {};
Demandbase.utils = window.Demandbase.utils || {};
Demandbase.Connectors = window.Demandbase.Connectors || {};
var _dbc = window._dbc || {};
if(typeof Demandbase.utils.runConnectors === 'undefined') Demandbase.utils.runConnectors = function(){};
Demandbase.Domain = {
    name: 'Demandbase Domain API Wrapper',
    _version: '1.0',
    CompanyProfile: {},
    _key: window._dbc.key || 'YOUR_KEY_HERE',
    _useTestDomain: true,  //Note: Set to 'false' before deploying to production
    _testDomain: window._dbc.testDomain || 'demandbase.com',
    _debug: true,
    _parser: function(data) {
        if (!data) return ''; //Protects against 404 errors or empty objects
        try {
            var self = Demandbase.Domain, dbu = Demandbase.utils;
            data = dbu.flattenData(data);
            this.CompanyProfile = data;
            dbu.runConnectors(data);
        } catch (e) { if (Demandbase.debug) alert('DB Domain Connector Error: ' + e);}
    },
    _load: function() {
        //calling the Domain API
        var s = document.createElement('script');
        s.async = true;
        s.id = 'db_domain_api';
        s.src = ('https:'==document.location.protocol?'https://':'http://')+'api.demandbase.com/api/v2/domain.json?key=' + this._key + '&referrer=' + document.referrer + '&page=' + document.location.href + '&page_title=' + document.title + '&callback=Demandbase.Domain._parser&query';//+this._callback+
        if (this._useTestDomain) {
            //override query parameter with test IP address when bln is set
            if (this._testDomain == '') {
                this._testDomain = Demandbase._getQueryParam('db_domain');
                Demandbase.utils._log('Query IP API...overriding query parameter from URL: ' + this._testDomain);
            }
            if (this._testDomain !== '') {
                s.src = s.src + '=' + this._testDomain;
                Demandbase.utils._log('Query IP API...overriding query Demandbase.Domain: ' + this._testDomain);
            }
        } else {
            s.src = s.src + '=' + this.getDomain();
        }
        document.getElementsByTagName('head')[0].appendChild(s);
        Demandbase.utils._log('Calling IP API...');
    },
    /**
    This function is defined unqiue for each site
    Returns a visitor's email address or domain from a cookie, client context, data layer, CMS object, etc.
    @method
    **/
    getDomain : function(args) { }
};
Demandbase.Domain._load();
