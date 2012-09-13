/***
Name: Demandbase Standard Forms Implementation
Authors: Ilya Hoffman (Ilya[at@]SynapseAutomation[dot.]com), Matthew Downs (mdowns[at]demandbase[dot]com)
License: Copyright 2012. This code may not be reused without explicit permission by its owners. All rights reserved.

Instructions:
Search for "TODO"" comments and fill-in required values
	1.  Fill in Demandbase Key, Company ID, and Email ID
	2.  Add field name for any hidden fields to be populated by Demandbase data 
		(add additional fields or remove unused fields as needed)
	3.  Add the form name (or add a form name map if using multiple forms with different names)
Search for "Optional" comments and make additional adjustments as needed

Testing:
	-Set "debug" property to true to enable alerts if there is an error calling the API
	-Set "testing" property to true to display a table of Demandbase fields on the page
		-Be sure to set both these values to false before deploying this script to a production environment
	-To simulate a visit from a particular IP address, specify a value for the 'query' parameter (on the s.src variable) 
	 in the "_loadAsyncScript" function 

When using this file for multiple forms or multiple landing pages, ensure that the email, company name 
and any hidden fields populated by Demandbase have the same DOM name (or DOM ID) in your marketing
automation system.  If the fields have different names (and it is not possible to rename (or recreate) the fields), then 
create a mapping in this file to correlate form names, emailIDs and companyIDs.

Contact Demandbase Strategic Services with questions, comments, or requests.
***/

var DemandbaseForm={};
DemandbaseForm.demandbaseParser = {
	name: 'Demandbase Parser',
	key:"", 		//TODO: Required - Add your Demandbase key here
	companyID: '', 	//TODO: Required - DOM ID of Company field
	emailID: '', 	//TODO: Required - DOM ID of Email field
	elType: 'hidden', //Controls element type/visiblity
	form: null, 	//TODO: Optional - specify form name - Form object to append fields to (null selects first form found in the DOM)
	debug: false, 	//Show errors to user
	testing: false, //Testing mode (displays labels)
	priorityMap: {
		'IP': 2, 		//if Domain API doesnt identify, use IP Address API
		'Company': 1,	//Company API is lowest priority (lowest number)
		'Email': 3 		//highest # is top priority - Domain API "wins" over other APIs
	},
	init: function(){
		Demandbase.jQuery(function(){
			var dbp = DemandbaseForm.demandbaseParser;
			dbp._attachCompanyAPI();
			dbp._loadAsyncScript();
		});
	},
	parser: function(data) {
		if(! data) return '';
		if(! this.form) this.form=document.forms[0];
		try {
			//Identify data source and priority
			var source, priority;
			if (typeof data.person == 'object') {
				if (!data.person) return;
				source = 'Email';
				data = data.person;
			} else if (data.pick || data.input_match) {
				source = 'Company';
				if (data.pick) data = data.pick;
				if (data.input_match) data = data.input_match;
				//Add manual review flag when the Company Name API is used
				data['manual_review'] = true;
			} else {
				source = 'IP';
				//Handle ISP traffic
				if (data['isp']===true) return; 
			}
			priority = this.priorityMap[source];
			//Check if data source takes precedence
			if (priority < this._lastDataSource) return;
		   	this._removeDataset();
			var fs = document.createElement('fieldset');
			fs.id='db_data_container', fs.style.cssText='border:none;';
			for(info in data){
				var elName = this._normalize(info);
	            
	            //Optional - If MAS renders the form with hidden fields present
	            //we want to remove them to avoid multiple values in the POST
	            var oldField = document.getElementById(elName);
	            if (oldField) oldField.parentNode.removeChild(oldField);   

				var newEl = document.createElement('input');
			    newEl.setAttribute('id',elName);
			    newEl.setAttribute('name',elName);
			    newEl.setAttribute('type',this.elType);
			    newEl.value = data[info];
			    if(this.testing){
			   		var testEl = document.createElement('div');
			   		testEl.setAttribute('id',elName + '_container');
			   		testEl.innerHTML='Field Name: <strong>'+newEl.id+'</strong><br/>';
				    fs.appendChild(testEl);
			    } 
   				//Prepop
   				//Optional - enable to prepopulate select fields
				this._prepopData(data,info);
				fs.appendChild(newEl);
    		}
    		if(this.form) {
    			this.form.appendChild(fs);
				this._lastDataSource = priority;
			}
  		}catch(e){if(this.debug)alert('Error: '+e);}
	},
	_prepopData: function(data,info) {
		var select, dataToElMap = {
		}
		if (dataToElMap[info]){
			var valSet = false,
				field  = document.getElementById(dataToElMap[info]);
			if (field.type == 'select-one') {
				for (var i=0;i<field.options.length;i++){
					if (field.options[i].value == data[info]) {
						valSet = field.options[i].selected = true; 
						break;
					}
				}
			} else {
				field.value = data[info];
				valSet = true;
			}
			if (valSet) {
				//Trigger event and hide field
				jQuery(field)
					.change()
					.parents('p')
					.addClass('db_hidden')
					.hide();
			}
		}
	},
	_ISPFilter: function(data) {
		if (data.information_level == 'Basic') {
			var dataPoint, registryPoint,
				registryPrefix = 'registry_',
				registryPoints = [ 
					['country','country_name'],
					['zip_code','zip'],
					'state',
					'city'					
				];
			for(registryPoint in registryPoints){
				dataPoint 		= (registryPoints[registryPoint] instanceof Array ? registryPoints[registryPoint][1] : registryPoints[registryPoint]);
				registryPoint 	= (registryPoints[registryPoint] instanceof Array ? registryPoints[registryPoint][0] : registryPoints[registryPoint]);
				data[dataPoint] = data[registryPrefix + registryPoint];
			}
		}
		return data;
	},
	_normalize: function(name) {
		//TODO: Required - update with actual form field IDs (HTML name in Eloqua)
		var prefix = 'db_', nameMap = {
			'marketing_alias': '',
			'industry': '',
			'sub_industry': '',
			'employee_count': '',
			'employee_range': '',
			'revenue_range': '',
			'annual_sales': '',
			'street_address': '',
			'city': '',
			'state': '',
			'zip': '',
			'country': '',
			'country_name': '',
			'phone': '',
			'fortune_1000': '',
			'forbes_2000': '',
			'isp': '',
			'web_site': '',
			'stock_ticker': '',
			'demandbase_sid': '',
			'primary_sic': '',
			'watch_list_account_status': '',
			'manual_review' : ''
			//TODO: Optional - use the manual_review flag to indicate that leads identified by the Company Name API should be verified or scored differently
			//TODO: Optional - add more Demandbase or Account Watch fields
		}
		return nameMap[name] ? nameMap[name] : prefix + name;
	},
	_flattenData: function(data){
		//some demandbase fields are returned as json objects (hq hierarchy and account watch)
  		//this fcn breaks out each individual field in those objects andnormalizes the name, making
  		//it possible to iterate through the entire data set without checking for objects
		for (d in data){
			if (typeof data[d] == 'object') {

				for (nd in data[d]) {
					data[d+'_'+nd] = data[d][nd];
				}
				delete data[d];
			}
		}
	
		return data;
	},
	_attachCompanyAPI: function() {
		if (Demandbase.CompanyAutocomplete){
			Demandbase.CompanyAutocomplete.widget({
				company: this.companyID, 
				email:   this.emailID,
				key: this.key,   
				callback: function(data){DemandbaseForm.demandbaseParser.parser(data)}
	  		})
		};
	},
	_loadAsyncScript: function() {
		var s = document.createElement('script');
		s.src = "http://api.demandbase.com/api/v2/ip.json?key="+this.key+"&callback=DemandbaseForm.demandbaseParser.parser&query";
		document.getElementsByTagName('head')[0].appendChild(s);
	},
	_removeDataset: function() {
		var fs = document.getElementById('db_data_container');
		if (fs) this.form.removeChild(fs);		
	},
	_lastDataSource: null
}

DemandbaseForm.demandbaseParser.init();
