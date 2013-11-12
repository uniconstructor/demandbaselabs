/**
    File: segments.js
    Name: Demandbase Segmentor
    Authors: Matthew Downs (mdowns[at@]demandbase[dot.]com)
    Support Contact: strategicservices[at@]demandbase[dot.]com
    License: Copyright 2013. This code may not be reused without explicit permission by its owners. All rights reserved.

    Content Segment Connector - create conditions and segments, pair with content blocks.
    To use this file, include utils.js, ip.js, segments.js (in order), or comile them into a single file using Closure Compiler.
    1. place your Demandbase Content key in ip.js
    2. Define the _conditions and _segments lists in this file
    3. Use named segments in JS conditions
    	Example:
    		var dbs = Demandbase.Segments;
    		if(dbs.SMBSegment) {
				//JS to customize content here
    		} else {
				//default experience here
    		}

**/
'use strict';
var Demandbase = window.Demandbase || {};
Demandbase.utils = window.Demandbase.utils || {};
Demandbase.IP = window.Demandbase.IP || {};
//Determines whether an attribute matches a value
var DBCondition = function(attr, op, val, name) { //TODO - replace params with single object
	this.attribute	= attr;	//this is a demandbase attr value
	this.operator = op;
	this.value	= val;	//TODO: refactor name
	this.name	= name;
	this.evaluate	= function() {
		op = this.operator.toLowerCase();
		//convert = and != to words, also supports non-plural versions
		op = (op === '=' || op === 'equal') ? 'equals' : op;
		op = (op === '!=' || op === 'not equal') ? 'not equals' : op;
		switch (op) {
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
	return this.attribute + ' ' + this.operator + ' ' + this.value;
};

//evaluates a combination of conditions
var DBSegment = function(n, c) {
	this.name	= n;
	this._conditions	= [];
	this._operators	= [];
	this.addCondition	= function(c,o) {
		this._conditions.push(c);
		var op = '';
		if (typeof o !== 'undefined') {
			op = o.toLowerCase();
			this._operators.push(o);
		}
		switch (op) {
			case 'and':
				return this.value = (this.value && c.evaluate());
				//break;
			case 'or':
				return this.value = (this.value || c.evaluate());
				//break;
			default:
				return c.evaluate();
		}
	};
	this.value = this.addCondition(c);
};

DBSegment.prototype.toString = function() {
	var r = '';
	for (var c in this._conditions) {
		r = r + this._conditions[c] + this._operators[c];
	}
	return r;
};

var DBConditionBuilder = {
	build: function(name, condition) {
		var n = name, cArr = condition, attr, op, val;
		attr = cArr[0];
		op = cArr[1];
		val = cArr[2];
		var condObj = new DBCondition(attr, op, val, n);
		return condObj;
	}
};

/*
Examples of DBCondition and DBSegment usage
var t = new DBCondition('test', '=', 'test', 'true cond');
var f = new DBCondition('nottest', 'equals', 'test', 'false cond');
var s = new DBSegment('namedSeg', t);
s.addCondition(f, 'OR');*/

var DBContent = function(options) {
	(function(options) {
		this.content_name = options.name || ''; //free form name of content
		this.content_id = options.id || ''; //id (of html element) | {{token}}
		this.content = options.value || ''; //url | html string | token value | function
		this.type = options.type || ''; //anchor | img | html | token
		this.segments = options.segments; //array of segment (names or objects) paired with this content
		this.url = options.url || '';
	})();
};

//TODO: does this need to be an auto-invoked anony fcn?
//(function(){
	Demandbase.Segments = {
		name: 'Demandbase Segments',
		_version: 'beta 0.1',
		_debug: true,
		_conditions: {
			'IndustryIsSoftware' : ['industry', '=', 'Software & Technology'],
			'AudienceIsSMB' : ['audience', 'equals', 'SMB'],
			'AudienceIsEnterprise'	: ['audience', 'equals', 'Enterprise'],
			'CountryIsJapan'	: ['country', '=', 'JP']
			//'TestObjCond'		: new DBCondition('audience', 'equals', 'SMB') //Note: this works, but does not evaluate 'audience' on the lhs
		},
		_segments: {
			//TODO: Docs - first array item must be condition name
			//any number of conditions can be added but must always include an operator
			//array should end with a condition, not an operator
			'DemandbaseSegment' : ['IndustryIsSoftware', 'and', 'AudienceIsSMB'],
			'EnterpriseSegment' : ['AudienceIsEnterprise'],
			'SMBSegment'	: ['AudienceIsSMB'],
			'GEO_JP'	: ['CountryIsJapan']
		},

		_setup: function() {
			//iterate through conditions object and replace array with a newly created DBCondition object
			for (var cond in this._conditions) {
				//replace demandbase api var name with actual value from API response
				this._conditions[cond][0] = Demandbase.IP.CompanyProfile[this._conditions[cond][0]];
				//replaces array with DBCondition object
				this._conditions[cond] = DBConditionBuilder.build(cond, this._conditions[cond]);
			}

			//iterate through segments object and replace named conditions with actual condition object
			for (var seg in this._segments) {
				var sArr = this._segments[seg];
				for (var c in sArr) {
					if (this._conditions[sArr[c]]) {
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
			for (var seg in this._segments) {
				var sArr = this._segments[seg];
				//create new segment with single condition (first listed)
				var s = new DBSegment(seg, sArr[0]);

				//for mulit-condition segments
				if (sArr.length > 1) {
					//if multiple conditions are defined for a segment, add all conditions
					for (var i = 1; i < sArr.length; i = i + 2) {
						s.addCondition(sArr[i + 1], sArr[i]);
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
			} catch (e) {	if (this._debug)	alert('DBContentConnector Error: ' + e);	}
		}
		//TODO: maybe define additional public properties
		//activeSegments: null,
		//inactiveSegments: null,
	};
//})(Demandbase);

//Wrapping in runConnectors function ensures Segments is not initialized until IP API callback runs
Demandbase.utils.runConnectors = function(data) {
	Demandbase.Segments._init();
};
