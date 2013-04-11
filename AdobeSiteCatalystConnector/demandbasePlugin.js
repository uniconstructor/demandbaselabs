window.demandbasePlugin = {};
/* Set plugin object instance to global scope */
demandbasePlugin = (function(){
	"use strict";
	window.s = window.s||{};
	var	sess = {}, //session data object
		isExternalIP = true, //dbParse: method updates default true
		isDetailed, //dbParse: set via db response isDetailed
		dbv,
		local = 'Internal Testing', //dbParse: message set for internal traffic
		wasErrorInDemandbasePlugin,

	library = {
		isDefinedAndNotEmpty: function(variableToCheck) {
		if ((typeof(variableToCheck) !== 'undefined') && variableToCheck !== '' && variableToCheck !== null) {
			return true;
		}
		return false;
	},
	// errorValue and detailedErrorValue can be set in the inspect calls below for a more granular handling of error checks
	inspect:  function(variableToCheck, isDetailed, errorValue, detailedErrorValue) {
		errorValue = (this.isDefinedAndNotEmpty(errorValue)) ? errorValue : "ISP Visitor";
		detailedErrorValue = (this.isDefinedAndNotEmpty(detailedErrorValue)) ? detailedErrorValue : "Error";
		if (this.isDefinedAndNotEmpty(variableToCheck)) {
			return variableToCheck;
		} else {
			if (isDetailed) {
				return detailedErrorValue;
			} else {
				return errorValue;
			}
		}
	},
	demandbaseParse: function(dbInfo) {
		try {
				isDetailed = dbInfo.isDetailed,
				local = 'Internal Testing'; //message set for internal traffic;

			if (dbInfo.error && dbInfo.status) {
				if (dbInfo.error === 'Not Found' && dbInfo.status === '404') {
					isExternalIP = false;
				}
			}

			if (isExternalIP) {
				sess.errorMsg = dbInfo.error, //capture error and status to determine internal IP
				sess.statusMsg = dbInfo.status,
				sess.isDetailed = (dbInfo.information_level === 'Detailed') ? 'true' : 'false';
				sess.companyName = this.inspect(dbInfo.company_name, isDetailed);
				sess.primaryIndustry = this.inspect(dbInfo.industry, isDetailed);
				sess.subIndustry = this.inspect(dbInfo.sub_industry, isDetailed);
				sess.employeeBand = this.inspect(dbInfo.employee_range, isDetailed);
				sess.revenueBand = this.inspect(dbInfo.revenue_range, isDetailed);
				sess.state = this.inspect(dbInfo.state, isDetailed);
				sess.countryName = this.inspect(dbInfo.country_name, isDetailed);
				sess.fortune1000 = this.inspect(dbInfo.fortune_1000, isDetailed);
				sess.website = this.inspect(dbInfo.web_site, isDetailed);
				sess.demandbaseID = this.inspect(dbInfo.demandbase_sid, isDetailed);
				sess.audience = this.inspect(dbInfo.audience, isDetailed);
			} 
			else if (!isExternalIp) {
				sess.companyName = local;
				sess.accountStatus = local;
				sess.primaryIndustry = local;
				sess.subIndustry = local;
				sess.employeeBand = local;
				sess.revenueBand = local;
				sess.state = local;
				sess.countryName = local;
				sess.fortune1000 = local;
				sess.website = local;
				sess.demandbaseID = local;
				sess.audience = local;
			}
			if ('undefined' !== typeof(dbInfo.watch_list) && dbInfo.watch_list !== ''){
				sess.accountStatus = dbInfo.watch_list['category'];
			}
			demandbasePlugin.response = sess;
		} catch (err) {
			wasErrorInDemandbasePlugin = true;
			demandbasePlugin.ERROR = err;
		}
		window.dbr = sess;
	}};

	return library;
}(demandbasePlugin))

