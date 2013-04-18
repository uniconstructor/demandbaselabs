var DemandbaseAnalytics= window.DemandbaseAnalytics || {};
/* Set plugin object instance to global scope */
DemandbaseAnalytics.demandbaseSC = (function(){
	"use strict";
	window.s = window.s||{};
	var	sess = {}, 					//session data object
		isDetailed, 				//dbParse: set via db response isDetailed
		local = 'Internal Testing', //dbParse: message set for internal traffic
		wasError = false,
	library = {
		isDefinedAndNotEmpty: function(v) {
			if ((typeof(v) !== 'undefined') && v !== '' && v !== null) {
				return true;
			}
			return false;
		},
		
		inspect:  function(v, isDetailed) {
			/* errorValue and detailedErrorValue can be set in the inspect calls below for a more granular handling of error checks*/
			var errorValue = "ISP Visitor",
				detailedErrorValue = "[EMPTY]";
			if (this.isDefinedAndNotEmpty(v)) {
				return v;
			} else {
				if (sess.isDetailed) {
					return detailedErrorValue;
				} else {
					return errorValue;
				}
			}
		},
		_flatten:function(a){ 
	      for(var d in a){ 
	        if(typeof a[d]=='object' && a[d]!==null){ 
	          for(var cd in a[d]){ a[d+'_'+cd]=a[d][cd] };
	          delete a[d];
	        }
	      }; 
	      return a;
	    },
		demandbaseParse: function(dbInfo) {
			try {
				if(!dbInfo) {
					/*fail safe against empty data*/
					window.dbr={};
					return;
				}
				isDetailed = dbInfo.isDetailed||'';
				
				sess.errorMsg = dbInfo.error||'(no error)', //capture error and status to determine internal IP
				sess.statusMsg = dbInfo.status||'(status ok)',
				sess.isDetailed = (dbInfo.information_level === 'Detailed') ? 'true' : 'false';
				dbInfo = this._flatten(dbInfo);
				for (var field in dbInfo) {
					sess[field] = this.inspect(dbInfo[field]);
				}

				DemandbaseAnalytics.demandbaseSC.response = sess;
			} catch (err) {
				wasError = true;
				DemandbaseAnalytics.demandbaseSC.ERROR = err;
			}
			window.dbr = sess;
		}
	};
	return library;
}(DemandbaseAnalytics.demandbaseSC))

