/**
    File: ip.js
    Name: Demandbase IP API Helper Class
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
Demandbase.IP = {
    name: 'Demandbase IP API Wrapper',
    _version: '1.0',
    CompanyProfile: {},
    _key: window._dbc.key || 'YOUR_KEY_HERE',
    _useTestIp: false,  //Note: Set to 'false' before deploying to production
    _testIpAddress: window._dbc.testIp || '3.0.0.1',
    _debug: true,
    _parser: function(data) {
        if (!data) return ''; //Protects against 404 errors or empty objects
        try {
            var self = Demandbase.IP, dbu = Demandbase.utils;
            data = dbu.flattenData(data);
            this.CompanyProfile = data;
            dbu.runConnectors(data);
        } catch (e) { if (Demandbase.debug) alert('DB IP Connector Error: ' + e);}
    },
    _load: function() {
        //calling the IP Address API
        var s = document.createElement('script');
        s.async = true;
        s.id = 'db_ip_api';
        s.src = ('https:'==document.location.protocol?'https://':'http://')+'api.demandbase.com/api/v2/ip.json?key=' + this._key + '&referrer=' + document.referrer + '&page=' + document.location.href + '&page_title=' + document.title + '&callback=Demandbase.IP._parser&query';//+this._callback+
        if (this._useTestIp) {
            //override query parameter with test IP address when bln is set
            if (this._testIpAddress == '') {
                this._testIpAddress = Demandbase._getQueryParam('db_ip');
                Demandbase.utils._log('Query IP API...overriding query parameter from URL: ' + this._testIpAddress);
            }
            if (this._testIpAddress !== '') {
                s.src = s.src + '=' + this._testIpAddress;
                Demandbase.utils._log('Query IP API...overriding query Demandbase.IP: ' + this._testIpAddress);
            }
        }
        document.getElementsByTagName('head')[0].appendChild(s);
        Demandbase.utils._log('Calling IP API...');
    }
};
Demandbase.IP._load();
