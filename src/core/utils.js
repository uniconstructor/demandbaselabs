// ensure console.log and console.debug exist
if (typeof window.console === 'undefined') window.console = {log: function() {}, debug: function() {}};
if (typeof window.localStorage === 'undefined') window.localStorage = function() {};
'use strict';
var Demandbase = window.Demandbase || {};
Demandbase.utils = window.Demandbase.utils || {};
Demandbase.utils = {
    name: 'Demandbase Utilities',
    _version: '1.0',
	logging: true,
	djq: null,
	/**
	Takes a string--the name of a query string parameter, and retrieves the value of a parameter from the pages URL query string
	@method getQueryParam
	**/
	getQueryParam: function(param) {
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
	},
    /**
    Puts an object into localStorage (parses each field from object)
    @method putLS
    **/
	putLS : function(data) {
	    for (var item in data) {
    	    localStorage.setItem(item, data[item]);
	   	    this._log('Set localStorage field: ' + item + ' : ' + data[item]);
	    }
	},
    /**
    Gets a value from localStorage
    @method getLS
    **/
	getLS : function(value) {
	    if(localStorage.getItem(value)) {
    	    return localStorage.getItem(value);
	    } else {
    	    this._log('Requested field: ' + value + ' was not found in localStorage.');
    	    return null;
	    }	
	},
	/**
    Queries the IP address API to validate the provided key.
    @method _authorize
    **/
    authorize: function(testKey) {
        var djq = jQuery.noConflict() || Demandbase.jQuery;
        if(djq) {
            djq.ajax({
                url: 'http://api.demandbase.com/api/v2/ip.json',
                data: { key: testKey},
                dataType: 'jsonp',
                timeout: 2000,
                success: function(d,t,x) {
                    Demandbase.utils._log('Validating key: '+testKey+'.... Confirmed authorized key');
                },
                error: function(d,t,x) {
                    Demandbase.utils._log('Validating key: '+testKey+'.... is NOT a valid key');
                }
            });    
        } else {
            Demandbase.utils._log('Could not authorize key...jQuery is missing.');
        }
    },
    /**
    Wrapper around console.log, takes message string as argument.
    @method _log
    **/
    _log: function(msg) {
	    if ((typeof window.console !== 'undefined') && (this.logging || this.getQueryParam('db_logging') === 'true')) {
	        window.console.log('Demandbase: ' + msg);
	    }
	},
    runConnectors: function(data) {}
};

Demandbase.utils.runConnectors = function(data) {
    /** Implement custom calls to your connector here.
        This function is run after the Demandbase IP Address API has returned data, and the data has been processed.
		
		The argument in this function ("data"), contains the company profile attributes returned by the IP Address API.
		Attributes can be assigned to variables here for use in other functions.
		Example:
		db_industry = data.industry || '';//assumes "var db_industry;" declaration is elsewhere 
		
        Additionally, Company profile attributes can be accessed from the Demandbase namespace.
        Examples:
        	var db_industry = Demandbase.IP.CompanyProfile.industry || '';
			Demandbase.Connectors.Adobe_AudienceManager.send(Demandbase.IP.CompanyProfile);
    **/
    //Demandbase.Connectors.Adobe_AudienceManager.send(Demandbase.IP.CompanyProfile);
};