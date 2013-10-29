/**
	File: demandbase.js
	Name: Demandbase JavaScript Framework
    Authors: Matthew Downs (mdowns[at@]demandbase[dot.]com)
    Support Contact: strategicservices[at@]demandbase[dot.]com
    License: Copyright 2013. This code may not be reused without explicit permission by its owners. All rights reserved.
**/
'use strict';
// ensure console.log and console.debug exist
if (typeof window.console === 'undefined') window.console = {log: function() {}, debug: function() {}};
if (typeof window.localStorage === 'undefined') window.localStorage = function() {};
var Demandbase = window.Demandbase || {};
Demandbase.Connectors = window.Demandbase.Connectors || {};

//TODO: _dbc may be replaced by 'dbase' function call
var _dbc = window._dbc || {};

/**
    File: utils.js
    Name: Demandbase Helper Utilities Class
**/
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
    @method flattenData
    **/
    flattenData: function(data) {
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
    runConnectors: function(data) { alert('Testing function extension'); this._log('Testing function extension'); }
};  //end Demandbase.utils

/**
    File: ip.js
    Name: Demandbase IP API Helper Class
**/
Demandbase.IP = window.Demandbase.IP || {
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
}; //end Demandbase.IP

//TODO: determine when/where _load function should be called --ideally on $.ready()
Demandbase.IP._load();

Demandbase.Domain = window.Demandbase.Domain || {
    name: 'Demandbase Domain API Wrapper',
    _version: '1.0',
    CompanyProfile: {},
    _key: window._dbc.key || 'YOUR_KEY_HERE',
    _useTestDomain: true,  //Note: Set to 'false' before deploying to production
    _testDomain: window._dbc.testDomain || 'demandbase.com',
    _debug: true,
    detectedDomain: '',
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
    getDomain : function(args) { 
        if(this._useTestDomain) {
            return this._testDomain;
        } else {
            //this is where we define where to grab the domain/email from the client context
        }
    }
}; //end Demandbase.Domain

//TODO: determine when/where _load function should be called --ideally on $.ready()
Demandbase.Domain._load();

/**
    File: segments.js
    Name: Demandbase Segmentor
    Content connector - create conditions and segments, pair with content blocks.
**/

//Determines whether an attribute matches a value
var DBCondition = function (attr, op, val, name) { //TODO - replace params with single object
	this.attribute	= attr;	//this is a demandbase attr value
	this.operator 	= op;
	this.value		= val;	//TODO: refactor name
	this.name		= name;
	this.evaluate	= function() {
		op = this.operator.toLowerCase();
		//convert = and != to words, also supports non-plural versions
		op = (op === '=' || op === 'equal') ? 'equals' : op;
		op = (op === '!=' || op === 'not equal') ? 'not equals' : op;
		switch(op) {
			case 'equals':  
				return this.attribute == this.value;
			case 'not equals':
				return this.attribute !== this.value;
			case 'contains':
				return (this.attribute.indexOf(this.value) !== -1);
			default:
				return false;
		}
	};
}; 	
DBCondition.prototype.toString = function() {
	return this.attribute+' '+this.operator+' '+this.value; 
};

//evaluates a combination of conditions 
var DBSegment = function (n, c) {
	this.name			= n;
	this._conditions	= [];
	this._operators		= [];
	this.addCondition	= function(c,o) {
		this._conditions.push(c);
		var op='';
		if (typeof o !== 'undefined') {
			op = o.toLowerCase()
			this._operators.push(o);
		}
		switch(op) {
			case 'and':
				return this.value = (this.value && c.evaluate());
				//break;
			case 'or':
				return this.value = (this.value || c.evaluate());
				//break;
			default:
				return c.evaluate();
		}
	}
	this.value = this.addCondition(c);		
};

DBSegment.prototype.toString = function() {
	var r='';
	for(var c in this._conditions) {
		r = r+this._conditions[c] + this._operators[c];
	}
	return r;	
};

var DBConditionBuilder = {	
	build: function(name, condition) {
		var n = name, cArr = condition, attr, op, val;
		attr= cArr[0];
		op 	= cArr[1];
		val = cArr[2];
		var condObj = new DBCondition(attr, op, val, n); 
		return condObj;
	}	
};

var DBContent = function(options) {
	(function(options) {
		this.content_name = options.name||''; //free form name of content
		this.content_id = options.id||''; //id (of html element) | {{token}}
		this.content = options.value||''; //url | html string | token value | function
		this.type = options.type||''; //anchor | img | html | token
		this.segments = options.segments; //array of segment (names or objects) paired with this content
		this.url = options.url || '';
	})();
};

Demandbase.Segments = window.Demandbase.Segments || {
	name: 'Demandbase Segments',
	_version: 'beta 0.1',
	_debug: true,
	_conditions: {
		'IndustryIsSoftware' 	: ['industry', '=', 'Software & Technology']
		,'AudienceIsSMB' 		: ['audience', 'equals', 'SMB']
		,'AudienceIsEnterprise'	: ['audience', 'equals', 'Enterprise']
		,'CountryIsJapan'		: ['country', '=', 'JP']
		//'TestObjCond'		: new DBCondition('audience', 'equals', 'SMB') //Note: this works, but does not evaluate 'audience' on the lhs
	},
	_segments: {
		//TODO: Docs - first array item must be condition name
		//any number of conditions can be added but must always include an operator
		//array should end with a condition, not an operator
		'DemandbaseSegment' : ['IndustryIsSoftware', 'and', 'AudienceIsSMB']
		,'EnterpriseSegment': ['AudienceIsEnterprise']
		,'SMBSegment'		: ['AudienceIsSMB']
		,'GEO_JP'			: ['CountryIsJapan']
	},	
	
	_setup: function() {
		//iterate through conditions object and replace array with a newly created DBCondition object 
		for(var cond in this._conditions) {
			//replace demandbase api var name with actual value from API response
			this._conditions[cond][0] = Demandbase.IP.CompanyProfile[this._conditions[cond][0]];
			//replaces array with DBCondition object
			this._conditions[cond] = DBConditionBuilder.build(cond, this._conditions[cond]);
		}
		
		//iterate through segments object and replace named conditions with actual condition object
		for(var seg in this._segments) {
			var sArr = this._segments[seg];
			for(var c in sArr) {
				if(this._conditions[sArr[c]]) {
					this._segments[seg][c] = this._conditions[sArr[c]];
				}
			}
		}
		this._segmentBuilder();	
	},
	//TODO: this should be refactored/encapsulated in a builder class 
	//TODO: builder class should be able to handle condition definition so single-condition segments can be defined in _conditions
	_segmentBuilder: function() {
		//TODO: Validation - check to ensure array is defined properly
		//iterates over segments object and builds DBSegment objects
		for(var seg in this._segments) {
			var sArr = this._segments[seg];
			//create new segment with single condition (first listed)
			var s=new DBSegment(seg, sArr[0]);
			
			//for mulit-condition segments
			if(sArr.length > 1) {
				//if multiple conditions are defined for a segment, add all conditions
				for(var i=1;i<sArr.length;i=i+2) {
					s.addCondition(sArr[i+1],sArr[i]);
				} 
			}
			//replace array with actual segment object
			this._segments[seg] = s;
			//dynamically add property to the Demandbase.Segments namespace for each DBSegment object defined in segments
			Object.defineProperty(this, seg, s);
		}		
	},
	_init: function(data) {
		try {
			var dbs = Demandbase.Segments;
			dbs._setup();
		} catch(e){	if(this._debug)	alert('DBContentConnector Error: '+e);	}
	}
	//TODO: maybe define additional public properties
	//activeSegments: null,
	//inactiveSegments: null,
} //end Demandbase.Segments

//TODO: consolidate init calls on IP callback.
//Wrapping in runConnectors function ensures Segments is not initialized until IP API callback runs
Demandbase.utils.runConnectors = function(data) {
	Demandbase.Segments._init();
}

/**
  File: ga.js
  Name: Demandbase Analytics Module for Google Analytics
  Authors:  Matthew Downs (mdowns[at@]demandbase[dot.]com),
            Ehsan Ketabchi (eketabchi[at@]demandbase[dot.]com),
            Ilya Hoffman (Ilya[at@]SynapseAutomation[dot.]com)
**/
//TODO: maybe need to use '$.getScript' based on call from driver fcn
Demandbase.Connectors.Google_Analytics = {
    name: 'Demandbase Google Analytics Connector',
    key: 'bea32069fc38372f9a97811e0edfac02d6863e86',
    /* Customize which variables are sent to GA. each element in 'fields' must be a Demandbase variable name */
    fields : ["audience", "employee_range", "company_name", "revenue_range", "industry"],
    version: '4.2',
    dbDataSet: null,
    logging: true,
    track: function(data) {
      try {
        var dbgac = Demandbase.Connectors.Google_Analytics, dflt = '(Non-company Visitor)';
        data = dbgac._flatA(data);
        dbgac.dbDataSet = data;
        for (var i = 0; i < dbgac.fields.length; i++) {
            var num = i + 1, lbl = dbgac.fields[i], val = data[dbgac.fields[i]] || dflt;
            dbgac._var(num, lbl, val, 1);
        }
        dbgac._event();
      } catch (e) { Demandbase.Connectors.Google_Analytics._logE('Integration Error: ' + e)}
    },
    load: function() {
        try {
            if (!window._gaq) window._gaq = [];
            /*var db = document.createElement('script'); db.type = 'text/javascript'; db.async = true; db.id = 'db_ip_api_ga';
            db.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'api.demandbase.com/api/v2/ip.json?key=' + this.key + '&callback=Demandbase.Connectors.Google_Analytics.track&page=' + document.URL + '&referrer=' + document.referrer + '&page_title=' + document.title;
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(db, s);*/
            if(!Demandbase.IP.CompanyProfile) alert('Demandbase.IP.CompanyProfile: ' + Demandbase.IP.CompanyProfile);
            this.track(Demandbase.IP.CompanyProfile);
            _gaq.push(['_addDevId', 'NE7T9']);
            Demandbase.Connectors.Google_Analytics._logE('Loaded Script ' + db.src);
        } catch (e) { this._logE('Script Error: ' + e)}
    },
    _flatA: function(a) { for (var d in a) { if (typeof a[d] == 'object' && a[d] !== null) { for (var cd in a[d]) { a[d + '_' + cd] = a[d][cd]; } delete a[d]; } } return a; },
    _logE: function(m) { if (this.logging && window['console'] !== 'undefined' && typeof(console) !== 'undefined') { console.log('DB GA: ' + m); } },
    _p: function(t,v1,v2,v3,v4,v5) { window._gaq.push([t, v1, v2, v3, v4, v5]); },
    _var: function(i,k,v,s) { this._p('_setCustomVar', i, k, v, s); this._logE(i + ' ' + k + ' : ' + v); },
    _event: function() { this._p('_trackEvent', 'Demandbase', 'API Resolution', 'IP API', 0, 1); },
    _cEvent: function(cat, act, lbl) { this._p('_trackEvent', cat, act, lbl, 0, 1); this._logE('Custom Event Tracked: ' + cat + ' : ' + act + ' : ' + lbl); }
};
//Demandbase.Connectors.Google_Analytics.load();

/**
	This extends the 'runConnectors' function, adding additional code from 
	what's defined in Demandbase.utils
	All connector calls should be made from here.
**/
(function() {
    var runner = Demandbase.utils.runConnectors;
    Demandbase.utils.runConnectors = extRunConnectors;
    function extRunConnectors() {
        runner.apply(Demandbase.utils); // Use #apply in case `init` uses `this`
        Demandbase.Connectors.Google_Analytics.load();
        //TODO: initialize other connectors here 
    }
})();

/***************************************************************************/
var dbase = window.dbase||function(cmd,args) {
	//(ga.q=ga.q||[]).push(arguments)
	if(!cmd) return;
	switch (cmd) {
		case 'form':
		case 'analytics':
		case 'content':
		case 'ad':
		default:
	}
};

var driver = function(args) {
	for(var arg in args) {
		//gets field to set from cmdHash and sets each field
	}
};

var cmdHash = {
	'fieldMap' : WebForm.fieldMap,
	'forms_key' : WebForm.key,

};

