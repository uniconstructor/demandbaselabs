/**
    File: demandbaseIP.js
    Name: Demandbase Form Module
    Authors: Matthew Downs (mdowns[at@]demandbase[dot.]com)
    Support Contact: strategicservices[at@]demandbase[dot.]com
    License: Copyright 2013. This code may not be reused without explicit permission by its owners. All rights reserved.
**/
// ensure console.log and console.debug exist
if (typeof window.console === 'undefined') window.console = {log: function() {}, debug: function() {}};
'use strict';

var Demandbase = window.Demandbase || {};
Demandbase.Connectors = window.Demandbase.Connectors || {};
Demandbase.CompanyProfile = window.Demandbase.CompanyProfile || {};
Demandbase.debug = true;
Demandbase.logging = true;
Demandbase.getQueryParam = function(param) {
    var params = {};
    //get query string, remove the leading '?'
    var qs = window.location.search.substring(1);
    var pairs = qs.split('&');
    for (var i = 0; i < pairs.length; i++) {
        var nvArray = pairs[i].split('=');
        var name = nvArray[0];
        var value = nvArray[1];
        params[name] = value;
    }
    return params[param];
};

Demandbase._log = function(msg) {
    if ((typeof window.console === 'undefined') && (Demandbase.logging || Demandbase._getQueryParam('db_logging') === 'true')) {
        window.console.log('DBContentConnector: ' + msg);
    }
};

//pseudo/safety define runConnectors function
if (Demandbase.runConnectors === undefined) Demandbase.runConnectors = function() {};

Demandbase.IP = {
        _key: 'YOUR_KEY_HERE',
        _useTestIp: false,  //Note: Set to 'false' before deploying to production
        _testIpAddress: '3.0.0.1',
        _version: 1.0,
        _parser: function(data) {
            if (!data) return ''; //Protects against 404 errors or empty objects
            try {
                var dbc = Demandbase.IP;
                data = dbc._flattenData(data);
                Demandbase.CompanyProfile = data;
                Demandbase.runConnectors(data);
            } catch (e) { if (Demandbase.debug) alert('DB IP Connector Error: ' + e);}
        },
        _flattenData: function(data) {
            for (var d in data) {
                if (typeof data[d] == 'object' && data[d] !== null) {
                    for (var nd in data[d]) {
                        data[d + '_' + nd] = data[d][nd];
                    }
                    delete data[d];
                }
            }
            return data;
        },
        _load: function() {
            //calling the IP Address API
            var s = document.createElement('script');
            s.async = true;
            s.id = 'db_ip_api';
            s.src = 'http://api.demandbase.com/api/v2/ip.json?key=' + this._key + '&referrer=' + document.referrer + '&page=' + document.location.href + '&page_title=' + document.title + '&callback=Demandbase.IP._parser&query';//+this._callback+
            if (this._useTestIp) {
                //override query parameter with test IP address when bln is set
                if (this._testIpAddress == '') {
                    this._testIpAddress = Demandbase._getQueryParam('db_ip');
                }
                if (this._testIpAddress !== '') s.src = s.src + '=' + this._testIpAddress;
            }
            document.getElementsByTagName('head')[0].appendChild(s);
        }
};
Demandbase.IP._load();

Demandbase.runConnectors = function(data) {
    /** Implement custom calls to your connector here.
        This function is run after the Demandbase IP Address API has returned data, and the data has been processed.
		
		The argument in this function ("data"), contains the company profile attributes returned by the IP Address API.
		Attributes can be assigned to variables here for use in other functions.
		Example:
		db_industry = data.industry || '';//assumes "var db_industry;" declaration is elsewhere 
		
        Additionally, Company profile attributes can be accessed from the Demandbase namespace.
        Examples:
        	var db_industry = Demandbase.CompanyProfile.industry || '';
			Demandbase.Connectors.AudienceManager.send(Demandbase.CompanyProfile);
    **/


};

Demandbase.Connectors.AudienceManager = {
    send: function(data) {
        alert('sending to AAM - ' + data.company_name || 'non-company visitor');
    }
};
