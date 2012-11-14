/***
Name: Demandbase Standard Forms Implementation
Authors: Ilya Hoffman (Ilya[at@]SynapseAutomation[dot.]com), Matthew Downs (mdowns[at]demandbase[dot]com)
License: Copyright 2012. This code may not be reused without explicit permission by its owners. All rights reserved.

Instructions:
Step 1 - Add the Company Autocomplete widget to your HTML page (or landing page template)
    <!--Including Demandbase Company Autocomplete Widget -->
    <script src="http://api.demandbase.com/autocomplete/widget.js" type="text/javascript"></script>
	<!-- stylesheet is optional -->
	<link rel="stylesheet" type="text/css" href="http://autocomplete.demandbase.com/autocomplete/stylesheet.v2.css" />

Step 2 - Add this file to your HTML page (or landing page template)
    <!-- Including Demandbase Standard Forms Implementation -->
    <script src="[YOUR_JS_PATH]/demandbaseFormStd.js" type="text/javascript"></script>

Step 3 - Update this file with required info:
	Search for "TODO" comments and fill-in required values
		1.  Fill in Demandbase Key, Company ID, and Email ID
		2.  Update hiddenFieldMap - Add field name for any hidden fields to be populated by Demandbase data 
			(add additional fields or remove unused fields as needed)
		3.  Add the form name (or add a form name map if using multiple forms with different names)
	Search for "Optional" comments and make additional adjustments as needed

Testing:
	-Set "debug" property to true to enable alerts if there is an error calling the API
	-Set "testing" property to true to display a table of Demandbase fields on the page
		-Be sure to set both these values to false before deploying this script to a production environment
	-To simulate a visit from a particular IP address, specify a value for the 'query' parameter (on the s.src variable) 
	 in the "_loadAsyncScript" function
	-See stdFormSample.html for an example of this file in action 

When using this file for multiple forms or multiple landing pages, ensure that the email, company name 
and any hidden fields populated by Demandbase have the same DOM name (or DOM ID) in your marketing
automation system.  If the fields have different names (and it is not possible to rename (or recreate) the fields), then 
create a mapping in this file to correlate form names, emailIDs and companyIDs.

Visit www.demandbaselabs.com for a live examples of Demandbase.
Contact Demandbase Strategic Services with questions, comments, or requests. <demandbaselabs@demandbase.com>
***/

var DemandbaseForm={};
DemandbaseForm.demandbaseParser = {
	name: 'Demandbase Parser',
	key:"", 						//TODO: Required - Add your Demandbase key here
	emailID: 'email_input_id', 		//TODO: Required - DOM ID of Email field
	companyID: 'company_input_id', 	//TODO: Required - DOM ID of Company field
	form: null, 					//TODO: Optional - specify form name - Form object to populate with Db data and send to MAS (null selects first form found in the DOM)  !Warning! - if your landing page has another <form> element (common for search or login functionality), define this element
	elType: 'hidden', 				//Controls element type/visiblity
	debug: false, 					//Testing mode - Show errors to user - set this to false before deploying!
	testing: true, 					//Testing mode - displays returned fields with labels - TODO: set this to false before deploying!
	useTestIp: false, 				//Testing mode - set to false when deploying to production - set to true to test using testIpAddress (sends value to IP API query parameter)
	testIpAddress: '30.0.0.1',		//passed to query parameter when useTestIp is true - set to test any individual IP for testing
	useCompanyInputMatch: true,		//Testing mode - true means user input for company field will match the nearest company, false means company name API will only match a company when the user selects something from the drop down menu
	useIspFilter: true,				//False means IP addresses that resolve to an ISP will count as a match (true is recommended value)
	hiddenFieldMap: {
		//TODO: Required - update this map with actual form field IDs (or HTML name) of form field to populate with Demandbase data and integrate with form processor
		//TODO: Optional - add/remove Demandbase or Account Watch fields
		'marketing_alias': '[HTML NAME GOES HERE]',
		'industry': '',
		'sub_industry': '',
		'primary_sic': '',
		'employee_range': '',
		'revenue_range': '',
		'street_address': '',
		'city': '',
		'state': '',
		'zip': '',
		'country': '',	//Country ISO code
		'country_name': '',
		'phone': '',
		'fortune_1000': '',
		'forbes_2000': '',
		'isp': '',
		'ip' : '',   //Demandbase recommends capturing the IP address of form submits
		'watch_list_account_status': '',
		'manual_review' : '' //Optional Manual Review flag set when Company API is used
	},
	prepopFieldMap: {
		/* Optional - map visible fields to pre-populate with Demandbase data */
		'db_var_name' : 'html_field_name'
	},
	/* TODO: Optional - If using this implementation on multiple forms/landing pages (or pages with more than one form)
				  Uncomment this list, and add the IDs (or Names) of the forms here
	*/
	/* formNameList: { 
		//Maintenance Tip: Add Eloqua Form ID here to enable Demandbase on a form
		//The first form on a landing page that matches this list will be selected
		'[HTML_FORM_NAME_GOES_HERE]' : '[HTML_FORM_NAME_GOES_HERE]' , 
		'[HTML_FORM_NAME_GOES_HERE_2]' : '[HTML_FORM_NAME_GOES_HERE_2]' 
	},*/
	dbDataSet: null,	//Demandbase object used in form submit (set automatically)
	dbDataSrc: null,	//Demandbase API that provided dbDataSet (leave these fields blank)
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
		if(! data) return '';  //Protects against 404 errors or empty objects
		/*
			This parser function is called 3X during a form interaction
			1st call - User lands on the form page, triggering a call to the Demandbase IP Address API
			2nd call - User enters email address which returns a data.person object
			3rd call - User enters company name which returns a data.pick object (or data.input_match, if they just type a name and do not actually select a company from the list)
		*/
		/* TODO: Optional - If using on multiple forms/landing pages (or pages with more than one form)
				 Uncomment this section if defining formNameList above
		*/
		/*
		for (formName in this.formNameList) {
			this.form = document.forms[formName];
			if(this.form != null) { break; }	
		}
		*/

		if(! this.form) this.form=document.forms[0];	//use the first form in the DOM, if otherwise not specified
		try {
			//Identify data source and priority
			var priority, source;
			if (typeof data.person == 'object') {
				if (!data.person) return;
				source = 'Email';		//Domain API data set
				data = data.person;
			} else if (data.pick || data.input_match) {
				source = 'Company';		//Company API data set
				if (data.pick) data = data.pick;
				if (this.useCompanyInputMatch && data.input_match) data = data.input_match;
				data['manual_review'] = true;	//Add manual review flag when the Company Name API is used (incase of user input errors)
			} else {
				source = 'IP';			//IP Address API data set
				if (data['isp']===true && this.useIspFilter) return; //Handle ISP traffic
				this._lastDataSource = this.priorityMap[source]; 	//initialize lastDataSource when IP API is called
			}
			
			//Check if data source takes precedence
			priority = this.priorityMap[source];
			if (priority < this._lastDataSource) return; 
				
			this.dbDataSet = data;  //Update the data object used
			this.dbDataSrc = source;
		   	this._removeDataset();	//Remove previously used data set
		   	data = this._flattenData(data);

			var fs = document.createElement('fieldset');
			fs.id='db_data_container', fs.style.cssText='border:none;';

			for(info in data){
				var elName = this._normalize(info); //Maps the Demandbase variable name to the form field to populate
	            
	            //If MAS renders the form with hidden fields present
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
			   		testEl.innerHTML='<strong>'+newEl.id+'</strong>: '+newEl.value+'<br/>';
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
		var select; 
		if (this.prepopFieldMap[info]){
			var valSet = false,
				field  = document.getElementById(this.prepopFieldMap[info]);
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
		//Optional - not used by default
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
		var prefix = 'db_';
		return this.hiddenFieldMap[name] ? this.hiddenFieldMap[name] : prefix + name;
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
		//Instantiating the Company Autocomplete Widget - this automatically calls the Domain and Company Name APIs
		//when the user enters an email or company name
		//Be sure to include widget.js on the page
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
		//calling the IP Address API
		var s = document.createElement('script');
		s.src = "http://api.demandbase.com/api/v2/ip.json?key="+this.key+"&referrer="+document.referrer+"&page="+document.URL+"&callback=DemandbaseForm.demandbaseParser.parser&query";
		//override query parameter with test IP address, when bln is set
		if(this.useTestIp) {
			s.src = s.src + "=" + this.testIpAddress
		}
		document.getElementsByTagName('head')[0].appendChild(s);
	},
	_removeDataset: function() {
		var fs = document.getElementById('db_data_container');
		if (fs) this.form.removeChild(fs);		
	},
	_lastDataSource: null
}

DemandbaseForm.demandbaseParser.init();
