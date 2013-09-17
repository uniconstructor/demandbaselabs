
/**
Demandbase.Connectors namespace - Contains all functions and properties for a Demandbase-enabled form
@module Demandbase.Connectors
@main Demandbase.Connectors
@beta
**/
'use strict';
Demandbase = window.Demandbase || {};
Demandbase.Connectors=window.Demandbase.Connectors || {};

/**
Connects three Demandbase APIs to a form using the CompanyAutocomplete Widget and the IP Address API.
Includes functionality to determine API priority order, populate hidden and visible fields, and show additional fields
when hidden fields are not provided by Demandbase.
@class Demandbase.Connectors.WebForm
@static
@beta
**/
Demandbase.Connectors.WebForm = {
    name: 'Demandbase Form Module',
    /**
    Required - Demandbase API key for authenticating calls to IP address API and Company Autocomplete Widget
    @property key
    @type string
    @static
    @default ""
    @required
    **/
    key: '',
    /**
    Required - ID of user-facing input element for capturing visitor's email address.
    After visitor enters email address, the value of this field is used to query the Domain API via the
    Company Autocomplete Widget.
    @property emailID
    @type string
    @static
    @default ""
    @required
    **/
    emailID: '',
    /**
    Required - ID of the user-facing input element for capturing company name.
    The will have autocomplete list will be attached to this field, which also triggers the call to the Company Name API.
    Note: This is separate from/in-addition-to the hidden company field which has the coompany named from the winning Demandbase data set
    @property companyID
    @type string
    @static
    @default ""
    @required
    **/
    companyID: '',
    /**
    Specify which form has the input fields indicated by companyID and emailID and the fields mapped in the hiddenFieldMap and visibleFieldsMap.
    This should only be set if all Demandbase-enabled forms always has the same name, otherwise use formNameList.
    Specifying a form is not required if there is only one form on the page. Leaving default value  (null) selects first form found in the DOM.
    This is the Form object to populate with Demandbase data and send to the form processor.
    If the form/landing page has another <form> element (common for search, email subscribe or login functionality), define this property.
    If neither form nor formName list is defined, then the first form in the DOM is used by default.
    @property form
    @type HTML Element
    @default null
    @static
    @optional
    @example
        document.forms['form_name']
    **/
    form: null,                     //Optional
    /**
    Specify which form has the input fields indicated by companyID and emailID and the fields mapped in the hiddenFieldMap and visibleFieldMap.
    This array is used when there are multiple form pages that have forms with different names.
    If every form has the same name, use the form propery.
    Specifying a form is not required if there is only one form on the page. Leaving default value  (null) selects first form found in the DOM.
    This is the Form object to populate with Demandbase data and send to the form processor.
    If the form/landing page multiple <form> element (common for search, email subscribe or login functionality),
    and the name is not the same on every Demandbase-enabled form, then define this property.
    If neither form nor formName list is defined, then the first form in the DOM is used by default.
    @property formNameList
    @type String Array
    @default ['']
    @static
    @optional
    @example
        ['formName1', 'formName2', 'formName3']
    **/
    formNameList: [''],
    /**
    Testing mode - Show alert to use if there are errors.
    To enable in production/deployed page, set "db_debug=true" in URL query string.
    Warning: set to false before deploying!
    @property debug
    @type Boolean
    @static
    @default true
    @required
    @example
        false
    **/
    debug: true,
    /**
    Testing mode - Shows a div of all fields in the winning Demandbase data with the configured field mapping
    This cannot be enabled via query string parameter.
    Warning: set to false before deploying!
    @property showResult
    @type Boolean
    @static
    @default false
    @required
    @example
        false
    **/
    showResult: true,
    /**
    Testing mode - set to true to run QUnit tests and display results on the page
    This can be enabled via query string parameter by setting "db_runTests=true".
    Warning: set to false before deploying!
    @property runTests
    @static
    @default false
    @example
        true
    **/
    runTests: false,
    /**
    Testing mode - logs messages to console on key events and actions
    Advise: set to false before deploying.
    Note: this can also be set in the query string, for example: add "?db_logging=true" to the landing page URL to enable on production form
    @property logging
    @type Boolean
    @static
    @default true
    @required
    @example
        false
    **/
    logging: true,
    /**
    Testing mode - set to false when deploying to production.
    Set to true to test using testIpAddress (overrides value sent to IP API query parameter)
    Note: this can also be set in the query string, for example: add "?db_useTestIp=true" to the landing page URL to enable
    Advise: set to false before deploying.
    @property useTestIp
    @type Boolean
    @static
    @default false
    **/
    useTestIp: false,
    /**
    Testing mode - IP passed to query parameter when useTestIp is true,
    Set to test any individual IP for testing.  This value can also be set from the URL query string, for example "?db_ip=3.0.0.1".
    If useTestIp is not set to true this value will be ignored
    @property testIpAddress
    @type String
    @static
    @default ''
    @example
        '50.59.18.196'
    **/
    testIpAddress: '3.0.0.1',
    /**
    Optional - True means user input for company field will match the nearest company, false means company name API will only match a company when the user selects
    a company from the autocomplete list.
    Advise: set to false before deploying.
    @property useCompanyInputMatch
    @type Boolean
    @static
    @default false
    **/
    useCompanyInputMatch: false,
    /**
    Optional - False means IP addresses that resolve to an ISP will count as a match.
    True is the recommended value, so results from the IP address API will not be considered an identification if the result is from an ISP.
    @property useIspFilter
    @type Boolean
    @static
    @default true
    **/
    useIspFilter: true,
    /**
    Optional - True means the audience fields from the IP API will be added to the data sets returned by the Domain and Company APIs.
    This property does not impact the IP field itself.
    @property keepAudienceFields
    @type Boolean
    @static
    @default false
    **/
    keepAudienceFields: false,
    /**
    Optional - Use only if needing to override the fields shown in the company autocomplete auto suggest list
    @property cacLabel
    @optional
    @type String
    @static
    @default '{marketing_alias} ({city}, {state})'
    @example
        '{company_name} ({industry} / {zip})'
    **/
    cacLabel: '{marketing_alias} ({city}, {state})',
    /**
    Required - map IDs (or name) of hidden form fields to populate with Demandbase data and integrate with form processor
    This set of name/values pairs has the Demandbase variable name on left, DOM ID of input field element on the right.
    This does not work with single select menus.

    Note: This mapping is not required if the ID or name of the hidden fields matches the Demandbase variable
    name with the prefix ("db_") defined in the _normalize function.
    Strategy tips:
    Demandbase recommends capturing the IP address
    Store the Demandbase unique ID for use with Eloqua Cloud Connector
    Note Account Watch must be setup to use "watch_list_"+[variableName] for custom Account Watch fields
    Optional Manual Review flag set when Company API is used
    @property hiddenFieldMap
    @type object
    @static
    @default (various)
    @required
    @example
        hiddenFieldMap: {
            'company_name': 'DBCompanyName',
            'audience' : 'DBAudience',
            'industry': 'DBIndustry',
            'employee_range': 'DBEeRange',
            'revenue_range': 'DBRevRange',
        }
    **/
    hiddenFieldMap: {},
    /**
    Optional - map visible form fields to pre-populate with Demandbase data.
    This set of name/values pairs has the Demandbase variable name on left, and the ID (or name) of the input field or select element to populate on the right
    @property visibleFieldMap
    @type object
    @static
    @default (various)
    @optional
    @example
        visibleFieldMap: {
            '[demandbaseVarName]' : '[input_element_id]'
            'industry': 'Industry__c',
            'employee_range': 'EmployeeRange__c'
        }
    **/
    visibleFieldMap: {},
    /**
    Defines the order of precedence to use when more than one API returns a result by mapping "Email", "IP", and "Company" to numeric values
    Highest number is top priority, lowest number is only used when other APIs do not identify the company.
    Be default, Domain API "wins" over other APIs.  If Domain API doesnt identify, use IP Address API, then use Company selected
    @property priorityMap
    @type object
    @static
    @default
        priorityMap: {
            'domain': 3,   //highest # is top priority - Domain API "wins" over other APIs
            'ip': 2,       //if Domain API doesnt identify, use IP Address API
            'company': 1   //Company API is lowest priority (lowest number)
        }
    @required
    **/
    priorityMap: {
        'domain': 3,
        'ip': 2,
        'company': 1
    },
    /**
    A list of Demandbase variable names which defines the returned attributes that signify an identification.
    If the fields in list are not returned by any of the APIs, then the onNoId function is called, and the elements in the
    toggleFieldList are shown.
    @property requiredAttrsList
    @type object
    @static
    @default ['company_name']
    @optional
    @example
        requiredAttrsList : ['company_name','country','state']
    **/
    requiredAttrsList: ['company_name'],        //Array of Demandbase variable names to determine if an API call has ID'd the visitor (if a field is blank, this counts as not ID'd)
    /**
    Defines a list of DOM IDs of elements to hide initially and show if Demandbase does not populate them with data.
    Note, this is not typically the input field itself, rather it is usually a wrapper div that also contains the field label.
    @property toggleFieldList
    @type String Array
    @static
    @default []
    @optional
    @example
        toggleFieldList : ['formFieldContainer1', 'formFieldContainer2']
    **/
    toggleFieldList: [],                     //Array of the DOM IDs of fields to show when company is not ID'd
    /**
    Indicates whether the form fields in toggleFieldList are shown by default.
    The default value, true, indicates fields will be hidden when the page loads.
    This is updated whenever the _toggleFields function is called to indicate whether fields should be shown or hidden.
    This helps prevent fields from being re-hidden if the vistior interacts with the company/email fields multiple times
    @property areToggleFieldsVisible
    @static
    @default true
    @optional
    **/
    areToggleFieldsVisible: true,
    /**
    This method accepts an object containing any parameters to be set from outside the Demandbase.Connectors.WebForm, providing the flexibility to modify the field mapping, form, and autocomplete fields.
    Call the connect method from the page, rather than creating a unique version of the form module for a particular page.  This is very useful on sites that do not have a formalized
    naming convention for fields and forms.  See example for how to use within a page.
    @method connect
    @param {Object} [options] Fields to set in Demandbase.Connectors.WebForm class.  Any public property can be passed.
    @example
        var dbf = Demandbase.Connectors.WebForm;
        dbf.connect({
            emailID : "email_input_id",
            companyID : "company_input_id",
            form: document.forms['simpleFormTest'],
            hiddenFieldMap: {
                'company_name': 'DBCompanyName',
                'industry': 'DBIndustry',
                'employee_range': 'DBEeRange',
            }
        });
    **/
    connect: function(options) {
        if (!options) options = {};
        if (options.key) this.key = options.key;
        if (options.companyID) this.companyID = options.companyID;
        if (options.emailID) this.emailID = options.emailID;
        if (options.form) this.form = options.form;
        if (options.formNameList) this.formNameList = options.formNameList;
        if (options.testIpAddress) this.testIpAddress = options.testIpAddress;
        if (options.cacLabel) this.cacLabel = options.cacLabel;
        if (options.hiddenFieldMap) this.hiddenFieldMap = options.hiddenFieldMap;
        if (options.visibleFieldMap) this.visibleFieldMap = options.visibleFieldMap;
        if (options.priorityMap) this.priorityMap = options.priorityMap;
        if (options.requiredAttrsList) this.requiredAttrsList = options.requiredAttrsList;
        if (options.toggleFieldList) this.toggleFieldList = options.toggleFieldList;

        if (typeof options.debug !== 'undefined' && !this._isNullEmpty(options.debug)) this.debug = options.debug;
        if (typeof options.showResult !== 'undefined' && !this._isNullEmpty(options.showResult)) this.showResult = options.showResult;
        if (typeof options.logging !== 'undefined' && !this._isNullEmpty(options.logging)) this.logging = options.logging;
        if (typeof options.useTestIp !== 'undefined' && !this._isNullEmpty(options.useTestIp)) this.useTestIp = options.useTestIp;
        if (typeof options.useIspFilter !== 'undefined' && !this._isNullEmpty(options.useIspFilter)) this.useIspFilter = options.useIspFilter;
        if (typeof options.useCompanyInputMatch !== 'undefined' && !this._isNullEmpty(options.useCompanyInputMatch)) this.useCompanyInputMatch = options.useCompanyInputMatch;
        if (typeof options.keepAudienceFields !== 'undefined' && !this._isNullEmpty(options.keepAudienceFields)) this.keepAudienceFields = options.keepAudienceFields;
        if (typeof options.areToggleFieldsVisible !== 'undefined' && !this._isNullEmpty(options.areToggleFieldsVisible)) this.areToggleFieldsVisible = options.areToggleFieldsVisible;
        this._log('Module Run with Options: ');
        this._log(options);
    },
    /**
    This method initializes the connector, attaching the Company Autocomplete Widget to the form and loading a script tag to call the IP address API.
    First, this function checks to ensure the Demandbase namespace is available, an indication that the widget.js file has loaded.
    @method init
    **/
    init: function() {
        if (typeof Demandbase !== 'undefined') {
            Demandbase.jQuery(document).ready(function() {
                var dbf = Demandbase.Connectors.WebForm;
                dbf.djq = Demandbase.jQuery;
                dbf._loadAsyncScript(); //TODO: MD - test running this function outside of doc ready so IP API is called regardless of CAC
                dbf._attachCompanyAPI();

                //Assign form to use Select the first form that matches a value in formNameList...
                for (var formName in dbf.formNameList) {
                    dbf.form = document.forms[dbf.formNameList[formName]];
                    if (dbf.form != null) { break; }
                }
                //...use the first form in the DOM, if otherwise not specified
                if (! dbf.form) dbf.form = document.forms[0];

                if (dbf.djq('#' + dbf.emailID).val() !== '') Demandbase.CompanyAutocomplete.getPerson(Demandbase.CompanyAutocomplete.callback);
                if (dbf.toggleFieldList.length > 0 && dbf.areToggleFieldsVisible) dbf.toggleFields();

                db_hook_init();
            });
            this._log('Initializing ' + this.name + ' v.' + this._version);
        } else {
            this._loadAsyncScript(); //still call IP API, even if widget isnt loaded
            this._log('Initializing ' + this.name + ' v.' + this._version + '... \nFAILED - widget.js file not loaded');
        }

    },
    /**
    This method is the "engine" that runs the Demandbase.Connectors.WebForm, accepting the data set returned by each API call, determining which API returned data and populating fields on the form.
    The parser uses the priorityMap to determine when a returned dataset should override the existing one, and it creates a field set for the fields in the hiddenFieldMap.
    When showResult is set to true, this method outputs a table of the returned attributes.  When debug is true, this method will display alerts if there is a JS error.
    This parser function is called 3X during a form interaction
            1st call - User lands on the form page, triggering a call to the Demandbase IP Address API
            2nd call - User enters email address which returns a data.person object
            3rd call - User enters company name which returns a data.pick object (or data.input_match, if they just type a name and do not actually select a company from the list)
    @method parser
    @param {Object} [data] - The JSON data set returned from any of the three Demandbase APIs
    **/
    parser: function(data) {
        if (! data) return '';  //Protects against 404 errors or empty objects
        try {
            //Identify data source and priority
            var priority, source;
            if (typeof data.person == 'object') {
                source = 'domain';
                this._sourceChecker.setSource(source, this._isIdComplete(data), true);
                if (!data.person) return; //TODO: MD - why here? better way?
                data = data.person;
                /* if Domain API returns same SID as existing data set, do not override */
                if (this._dbDataSet && data.demandbase_sid == this._dbDataSet.demandbase_sid) return;

            } else if (data.pick || data.input_match) {
                source = 'company';        /*Company API returns data*/
                if (data.pick) {
                    data = data.pick;
                    /*set dbDataSet early when no other dataset has been popld yet - reqd for checkSources/onNoId*/
                    if (this._dbDataSet == null) this._dbDataSet = data;
                } else if (data.input_match) {
                    data = data.input_match;
                    if (this.useCompanyInputMatch) {
                        this._log('Using input_match object from Company Name API...');
                    } else {
                        //this._sourceChecker.setSource(source, false, true);  // Record source and result.
                        this._log('input_match object detected from Company Name API...exiting because useCompanyInputMatch=false');
                        return;
                    }
                }
                data['manual_review'] = true;    /*Add manual review flag when the Company Name API is used (can be captured to flag for potential user input errors)*/
            } else {
                source = 'ip';            /*IP Address API returns data*/
                /*store fields returned only by IP API*/
                this._detectedIP = data['ip'] || '';
                this._detectedAudience = data['audience'] || '';
                this._detectedAudienceSegment = data['audience_segment'] || '';
                this._ipDataSet = data;
                this._sourceChecker.setSource('ip', this._isIdComplete(data), false);
                this._log('Queried IP Address: ' + this._detectedIP);
                if (data['isp'] === true && this.useIspFilter) return; //Handle ISP traffic
                //this._lastDataSource = this.priorityMap[source];     //initialize lastDataSource when IP API is called
            }
            this._log('Parsing response from API: ' + source);
            this._sourceChecker.setSource(source, this._isIdComplete(data), true);  /* Record source and result.*/

            if (this._dbDataSet) isIdMatch = data.demandbase_sid == this._dbDataSet.demandbase_sid;

            db_hook_before_parse(data, source); /*call hook function before parsing*/

            priority = this.priorityMap[source]; /*Check if data source takes precedence*/
            if (this._lastDataSource !== null && priority < this._lastDataSource) {
                //by pass API priority if current result from Domain API matches SID from subsequent result
                if (!isIdMatch /*&& this._dbDataSrc !== 'domain'*/) return;
            }
            this._dbDataSet = data;  //Update the data object used
            this._dbDataSrc = source;
            data['data_source'] = source;
            this._removeDataset(data);    //Remove previously used data set
            this._log('Parsing data response from: ' + this._dbDataSrc);
            this._log('New Data Set:');
            this._log(this._dbDataSet);
            data = this._flattenData(data);
            this._restoreIpFields(data);

            var fs = document.createElement('fieldset');
            fs.id = 'db_data_container', fs.style.cssText = 'border:none;';
            for (var attr in data) {
                var val = data[attr] || '';
                var newEl = this._buildHiddenField(attr, val);
                if (this.showResult) {
                    var testEl = document.createElement('div');
                    testEl.setAttribute('id', newEl.id + '_container');
                    testEl.innerHTML = '<strong>' + newEl.id + '</strong>: ' + newEl.value + '<br/>';
                    fs.appendChild(testEl);
                }
                this._prepopVisibleFields(attr, val);
                fs.appendChild(newEl);
                db_hook_attr(source, attr, val);
            }
            if (this.form) {
                this.form.appendChild(fs);
                this._lastDataSource = priority;
            }
            db_hook_after_parse(data, source);
          }catch (e) {
              if (this.debug || this._getQueryParam('db_debug') === 'true') alert('Error: ' + e + ' \n ' + e.stack);
          }
    },
     /**
    Some demandbase fields are returned as objects (hq hierarchy and Account Watch)
     This function breaks out each individual field in those objects andnormalizes the name, making
      it possible to iterate through the entire data set without checking for objects
    @method _flattenData
    @params  {Object} [data] - The JSON data set returned from any of the three Demandbase APIs
    **/
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
    /**
    Adds the IP address to the data sets returned by the Domain and Company Name APIs, so it can still be stored if the IP address API data set is overridden.
    @method _restoreIpFields
    @params  {Object} [data] - The JSON data set returned from any of the three Demandbase APIs
    **/
    _restoreIpFields: function(data) {
        if (data) {
            if (typeof data['ip'] == 'undefined' && !this._isNullEmpty(this._detectedIP)) {
                data['ip'] = this._detectedIP;
            }
            if (this.keepAudienceFields) {
                if (typeof data['audience' == 'undefined'] && !this._isNullEmpty(this._detectedAudience)) {
                    data['audience'] = this._detectedAudience;
                }
                if (typeof data['audience_segment' == 'undefined'] && !this._isNullEmpty(this._detectedAudienceSegment)) {
                    data['audience_segment'] = this._detectedAudienceSegment;
                }
            }
        }
    },
    /**
    This function swaps the Demandbase variable name for the value listed in hiddenFieldMap.
    If a field is not listed in hiddenFieldMap, then a prefix is applied to the variable name.
    Note, this function alters the in-memory JSON object returned from Demandbase.
    @method _normalize
    @params {String} name - A Demandbase varialbe name to lookup in hiddenFieldMap
    **/
    _normalize: function(name) {
        var prefix = 'db_';
        return this.hiddenFieldMap[name] ? this.hiddenFieldMap[name] : prefix + name;
    },
    /**
    Creates a new hidden field and sets its value according to the returned data set.  If a field with the same name already exists, it will be deleted and re-created.
    Note: this does not support the population of hidden drop down lists.  Single select menus can only be populated if they're visible.
    @method _buildHiddenField
    @params {String} attr - Field name of field to be created
    @params    {String} val -  Field value to be set in field
    **/
    _buildHiddenField: function(attr, val) {
         var elName = this._normalize(attr); //Maps the Demandbase variable name to the form field to populate

        var fieldId = elName;
        var fieldName = elName;

        /*If MAS renders the form with hidden fields present...
        ...remove them to avoid multiple values in the POST*/
        var oldField = this._getElmByIdOrName(elName);
        //if (typeof oldField !== 'undefined' && oldField == null) oldField = document.getElementsByName(elName)[0];
        if (oldField) {
            fieldId = oldField.id;

            if (oldField.name) fieldName = oldField.name;
            if (!fieldId) fieldId = elName; /* just in case existing element does not have ID set */
            //TODO: MD - possibly popl single select menu here, instead of creating new element
            oldField.parentNode.removeChild(oldField);
        }

        var newEl = document.createElement('input');
        newEl.setAttribute('id', fieldId);
        newEl.setAttribute('name', fieldName);
        newEl.setAttribute('type', 'hidden');
        newEl.value = val;

        return newEl;
    },
    /**
    This method populates visible fields according to the visibleFieldMap, includes setting values in select elements (menus)
    @method _prepopVisibleFields
    @params  {String} attr - Name of field to populate
    @params     {String} val - Value to set in field
    @uses visibleFieldMap
    **/
    _prepopVisibleFields: function(attr, val) {
        if (this.visibleFieldMap[attr]) {
            var valSet = false,
            field = this._getElmByIdOrName(this.visibleFieldMap[attr]);

            if (field) {
                /*pre-populating a single select or multi select menu*/
                if (field.type == 'select-one') {
                    for (var i = 0; i < field.options.length; i++) {
                        if (field.options[i].value == val) {
                            valSet = field.options[i].selected = true;
                            break;
                        }
                    }
                }else {
                    field.value = val;
                    valSet = true;
                }
                //Trigger change event when value is set
                if (valSet) {
                    this.djq(field).change().parents('p');
                    //.addClass('db_hidden').hide();  //optional - hide fields after pre-populating
                }
            }
        }
    },
    /**
    This method first attempts to retrieve an element by it's ID (supplied as the single argument).
    If no element is found with the ID, then this looks for the element by name.
    Note: this only looks for named elements on the specified form, not all named elements in the DOM
    This is used by any function that retrieves a DOM element within this class.
    @method _getElmByIdOrName
    @params {String} field - the ID or name of the element to retrieve
    @static
    **/
    _getElmByIdOrName: function(field) {
        var elm = document.getElementById(field);
        if (!elm && this.form) {
            elm = this.form.elements.namedItem(field);
            if (elm && elm instanceof NodeList) elm = elm[0];
        }
        //TODO: what if elm is still undefined?
        return elm;
    },
    /**
    Used to get the IP address from the query string, this function can retrieve the value of any parameter from the URL query string.
    @method _getQueryParam
    @params {String} param - The name of the query parameter whose value to retrieve
    @static
    **/
    _getQueryParam: function(param) {
        var qs = window.location.search.substring(1); //remove the leading '?'
        var pairs = qs.split('&');
        var params = {};
        for (var i = 0; i < pairs.length; i++) {
          var nvArray = pairs[i].split('=');
          var name = nvArray[0];
          var value = nvArray[1];
          params[name] = value;
        }
        return params[param];
    },
    /**
    Attaches the Demandbase Company Autocomplete Widget to the input fields specified by companyID and emailID.
    In addition to the dynamci autocomplete list of companies, this makes calls to the Domain API and Company Name API when the user enters information.
    Required widget.js file is already loaded.
    @method _attachCompanyAPI
    **/
    _attachCompanyAPI: function() {
        //Instantiating the Company Autocomplete Widget - this automatically calls the Domain and Company Name APIs
        //when the user enters an email or company name
        //Be sure to include widget.js on the page
        if(this.companyID && this.emailID) {
            if (Demandbase.CompanyAutocomplete) {
                Demandbase.CompanyAutocomplete.widget({
                    company: this.companyID,
                    email: this.emailID,
                    key: this.key,
                    label: this.cacLabel,
                    callback: function(data) {Demandbase.Connectors.WebForm.parser(data)}
                });
                var self;
                self = Demandbase.Connectors.WebForm;
                /*Since the callback is not called when there is no match on company name
                we explictly check sources after an 'autocompletechange' event.*/
                self.djq('#' + self.companyID).bind('autocompletecreate', function() {
                    self.djq(this).autocomplete('option', 'change', function(event, ui) {
                        Demandbase.CompanyAutocomplete._change.call(this, event, ui);
                        self._sourceChecker.checkSources();  //this runs after the blur event
                    });
                });
            }
            this._log('Attached CompanyAutocomplete Widget to email/company fields: ' + this.emailID + ' / ' + this.companyID);
         } else{ this._log("ERROR: CompanyID has no value or has the wrong ID. Autocomplete has not attached to any element."); }
    },
    /**
    Effectively calls the IP address API by adding a script tag at the end of the head.
    useTestIp and testIpAddress can be used to override the query parameter to test as a specific visitor IP.
    @method _loadAsyncScript
    @uses useTestIp
    @uses testIpAddress
    **/
    _loadAsyncScript: function() {
        var s = document.createElement('script');
        s.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'api.demandbase.com/api/v2/ip.json?key=' + this.key + '&referrer=' + document.referrer + '&page=' + document.location.href + '&page_title=' + document.title + '&callback=Demandbase.Connectors.WebForm.parser&query=';
        s.id = 'db_ip_api';
        s.async = true;
        //override query parameter with test IP address when bln is set
        if (this.useTestIp || this._getQueryParam('db_useTestIp') === 'true') {
            var testIp = this._getQueryParam('db_ip');
            if (testIp && testIp !== '') {
                this.testIpAddress = testIp;
                this._log('Overriding IP Address from query string: ' + this.testIpAddress);
            } else {
                this._log('Overriding IP Address from internal: ' + this.testIpAddress);
            }
            s.src = s.src + this.testIpAddress;
        }
        document.getElementsByTagName('head')[0].appendChild(s);
        this._log('Loaded IP Address API');
        this._sourceChecker.setSource('ip');  //Register HIT with source checker
        this._attachUnitTests();
    },
    /**
    Checks for empty values that should trigger form to grow (false here means API has not "fully" identified according to implemented definition)
    Uses list of Demandbase variable names that trigger positive identification (company _name is default indicator)
    @method _isIdComplete
    @param {Object} [data] JSON object returned from Demandbase APIs
    **/
    _isIdComplete: function(data) {
        triggerFieldList = this.requiredAttrsList;
        if (data) {
            for (var field in triggerFieldList) {
                if (!data[triggerFieldList[field]] || data[triggerFieldList[field]] == '') {
                    return false;
                }
            }
        } else { return false; } /* return false if arg is null*/
        return true;
    },
    /**
    Shows or hides fields in the toggleFieldList
    Note adjustments may be required depending on form markup.
    Note for Marketo forms, change to use: Demandbase.jQuery('#' + fieldId).parents('li').toggle();
    @method toggleFields
    **/
    toggleFields: function() {
        var toggled = false;
        for (var field in this.toggleFieldList) {
            fieldId = this.toggleFieldList[field];
            if (fieldId !== '') {
                var elmToToggle = this._getToggleElm(fieldId);
                if(elmToToggle) {
                  if (this.areToggleFieldsVisible) {
                      
                      this.djq(elmToToggle).hide();
                      toggled = true;
                  } else {
                      
                      this.djq(elmToToggle).show();
                      toggled = true;
                  }                  
                } else {
                  this._log('Failed attempt to toggle element with ID ' + fieldId + '. _getToggleElm could not find this element.')
                }

            }
        }
        if (toggled) this.areToggleFieldsVisible = !this.areToggleFieldsVisible;
    },
    /**
    @method _getToggleElm
    @param String id - the DOM id of HTML element
    **/
    _getToggleElm : function(id) {
      //For Marketo, override to "return this.djq('#' + fieldId).parents('li');""
      return this.djq('#' + id);
    },
    /**
    If an already-set field is not returned by an overriding dataset, this function will reset the field value to the empty string.
    @method _resetFields
    @param {Object} data
    **/
    _resetFields: function(data) {
        if (data) {
            for (var field in this.visibleFieldMap) {
                if (typeof data[field] == 'undefined' || this._isNullEmpty(data[field])) {
                    var id = this.visibleFieldMap[field];
                    this.djq('[id="' + id + '"]').val('');
                }
            }
            for (var field in this.hiddenFieldMap) {
                if (typeof data[field] == 'undefined' || this._isNullEmpty(data[field])) {
                    var id = this.hiddenFieldMap[field];
                    this.djq('[id="' + id + '"]').val('');
                }
            }
        }
    },
    /**
    Deletes the data container added by the parser function.  This runs whenever a dataset overrides the exisiting data to ensure there are no duplicate fields.
    @method _removeDataset
    @param {Object} data
    **/
    _removeDataset: function(data) {
        var fs = document.getElementById('db_data_container');
        if (fs && fs.parentNode) {
            fs.parentNode.removeChild(fs);
            this._resetFields(data);
        }
    },
    /**
    Checks to see if the argument is null or the empty string ('')
    @method _isNullEmpty
    @param {Object} a
    **/
    _isNullEmpty: function(a) {
        return (a == null || a === '') ? true : false;
    },
    /**
    Safe log method. All logging can be disabled by setting logging to false.
    @method _log
    **/
    _log: function(msg) {
        if (this.logging || this._getQueryParam('db_logging') === 'true') window.console.log('DB Form Connector: ' + msg);
    },
    /**
    Adds unit test files to page when flag set in file or in query string.
    Qunit is loaded first and actual test file is loaded in callback after qunit is loaded.
    Stylesheet for qunit is also added to head.
    @method _attachUnitTests
    **/
    _attachUnitTests: function() {
        if (this.runTests || (this._getQueryParam('db_runTests') == 'true')) {
            var qu = document.getElementById('qunit'), quf = document.getElementById('qunit-fixture');
            if (!qu || !quf) {
                /* append divs for qunit fixture */
                var b = document.getElementsByTagName('body');
                if(b && b instanceof NodeList) {
                    b = b[0];
                    var qud = document.createElement('div'), quf = document.createElement('div');
                    qud.setAttribute('id', 'qunit');
                    quf.setAttribute('id', 'qunit-fixture');
                    qud.appendChild(quf); 
                    b.appendChild(qud);                    
                }
            }

            this.djq('<link>').appendTo('head').attr({
                rel: 'stylesheet',
                type:'text/css',
                id:  'qunit_style',  
                href: 'http://www.demandbaselabs.com/css/qunit.css'
            });

            this.djq.getScript(('https:' == document.location.protocol ? 'https://' : 'http://') + 'www.demandbaselabs.com/scripts/qunit.js', function(data, textStatus, jqxhr) {
            
                Demandbase.Connectors.WebForm.djq.getScript(('https:' == document.location.protocol ? 'https://' : 'http://') + 'www.demandbaselabs.com/scripts/unitTest_WebForm.js');
            });

        }
    },
    /**
    The number from priorityMap of the most recent Demandbase API who's data set has been used.
    @property _lastDataSource
    @type Integer
    @default null
    @protected
    @static
    **/
    _lastDataSource: null,
    /**
    The IP address returned by the Demandbase IP API
    @property _detectedIP
    @type String
    @default null
    @protected
    @static
    **/
    _detectedIP: null,
    /**
    The value of the "audience" field returned by the Demandbase IP API
    @property _detectedAudience
    @type String
    @default null
    @protected
    @static
    **/
    _detectedAudience: null,
    /**
    The value of the "audience_segment" field returned by the Demandbase IP API
    @property _detectedAudienceSegment
    @type String
    @default null
    @protected
    @static
    **/
    _detectedAudienceSegment: null,
    /**
    Demandbase data object returned from the IP address API
    @property _ipDataSet
    @type Object
    @default null
    @protected
    @static
    **/
    _ipDataSet: null,
    /**
    Demandbase object used in form submit (set automatically)
    @property _dbDataSet
    @type Object
    @default null
    @protected
    @static
    **/
    _dbDataSet: null,
    /**
    Demandbase API that provided _dbDataSet (leave these fields blank)
    @property _dbDataSrc
    @type Object
    @default null
    @protected
    @static
    **/
    _dbDataSrc: null,
    /**
    Namespace propery for jQuery - grabbed from CAC
    This is set in the init function because we need to check for jQuery
    @property djq
    @type function
    @final
    **/
    djq : null,
    /**
    Version for Demandbase.Connectors.WebForm file
    @property _version
    @type String
    @default (varies)
    @protected
    @final
    **/
    _version: 'beta_0.8',
    /**
    @class _sourceChecker
    @extensionfor formConncector
    @static
    **/
    _sourceChecker: {
        /**
        A JS closure which indicates if each API has been queried and whether the result counts as an identificaiton according to requiredFieldsList
        @property sources
        @type object
        **/
        'sources': {
            'ip': {
                'hit': false,
                'result': false
            },
            'company': {
                'hit': false,
                'result': false
            },
            'domain': {
                'hit': false,
                'result': false
            }
        },
        /**
        @method setSource
        @params {String} source - The name of the API which returned data
        @params {Boolean} result - Does the result count as an identification according to the requiredFieldsList
        @params {Boolean} check - Run checkSources method after registering hit?
        **/
        'setSource': function(source, result, check) {
            if (!result) result = false;
            this.sources[source].hit = true;
            this.sources[source].result = result;
            Demandbase.Connectors.WebForm._log('API response logged with SourceChecker: ' + source + ' : ' + result);
            if (check) this.checkSources();
        },
        /**
        Examines _sourceChecker.sources to see if each API has been queried and identified the company.  If all APIs have been hit and none have identified, then the onNoId function is called.
        @method checkSources
        **/
        'checkSources': function() {

            var id = false,
                allHit = true;
            for (var source in this.sources) {
                if (this.sources[source].result) id = true;
                if (!this.sources[source].hit) {
                    allHit = false;
                    break;
                }
            }
            if (allHit) this.onAllHit();
            /*if (allHit && !id)     this.onNoId();*/
        },
        /**
        This function is called when all APIs have been hit but none have provided the required fields.  The primary use is to show additional form fields to the visitor.
        @method onNoId
        **/
        'onNoId': function() {
            //Callback when all three API's have been hit but no identification has been made.
            Demandbase.Connectors.WebForm._log('All APIs hit with no identification. Running onNoId function...');
            //Calling function to show elements defined in toggleFieldList
            Demandbase.Connectors.WebForm.toggleFields();
            db_hook_no_id();
        },
        /**
        This function is called when all three APIs have been queried, regardless of the results.
        In general, this function is run after the visitors has entered a company name.
        Note: this may be run more than once, if the user goes back and corrects the email address or company name they entered
        @method onAllHit
        **/
        'onAllHit' : function() {
            isId = Demandbase.Connectors.WebForm._isIdComplete(Demandbase.Connectors.WebForm._dbDataSet);
            if (!isId) this.onNoId();
            db_hook_all_hit();
        }
    }
};

/** ensure console.log and console.debug exist **/
if (typeof window.console === 'undefined') window.console = {log: function() {}, debug: function() {}};

/** Safety: define hook functions, in case they're not defined elsewhere **/
/** These hooks provide extensibility.  They are global functions that can be defined any where are called by the init and parser functions.**/
/**This fcn is called at the end of Demandbase.Connectors.WebForm.init**/
if (typeof db_hook_init === 'undefined') db_hook_init = function() {};

/** this function is called after all APIs have been queried **/
if (typeof db_hook_all_hit === 'undefined') db_hook_all_hit = function() {};

/** this function is called after all APIs have been queried but non have returned the values for the fields in requiredFieldList**/
if (typeof db_hook_no_id === 'undefined') db_hook_no_id = function() {};

/**This fcn is called by Demandbase.Connectors.WebForm.parser for each field when a returned data set is parsed**/
if (typeof db_hook_attr === 'undefined') db_hook_attr = function() {};

/**This fcn is called by Demandbase.Connectors.WebForm.parser before a data set is processed.
This function runs regardless of whether the returned data set overrides the current data set.**/
if (typeof db_hook_before_parse === 'undefined') db_hook_before_parse = function() {};

/**This fcn is called at the end of Demandbase.Connectors.WebForm.parser, after a data set is processed.
This function runs only when the returned data set overrides the current data set.**/
if (typeof db_hook_after_parse === 'undefined') db_hook_after_parse = function() {};

Demandbase.Connectors.WebForm.init();
