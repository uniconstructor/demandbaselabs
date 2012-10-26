/***
Name: Demandbase IP Widget
Authora: Matthew Downs (mdowns[at]demandbase[dot]com)
License: Copyright 2012. This code may not be reused without explicit permission by its owners. All rights reserved.
demandbaselabs@demandbase.com

Instructions:
To enable the IP Widget:
  1. Add your Demandbase Key
  2. Include ipWidget.js in your web page
  3. Use "DemandbaseLabs.IPWidget.demandbase_parse" as the callback function in a call to the Demandbase IP or Domain API.

Optional - To enable content customizations, or to see a live example of the IP widget, see Demandbaselabs.com/sandbox.

Contact Demandbase Strategic Services with questions, comments, or requests.
***/
var DemandbaseLabs = {};
DemandbaseLabs.IPWidget = {
  ipWidget : null,
  ipDetails : null,
  detectedIP : '',  //IP address detected by demandbase
  overrideIP : '',  //IP address manually entered by user
  token : '',  //TODO: add your Demandbase key here
  debug : false,
  useTestIP : false,
  TEST_IP : '108.67.118.168',
  dbCompanyDataSet : [],
  setIpWidgetMode : function(mode) {
    ipWidget.className = mode;
    //changes the arrow character on the toggle button...
    if (mode == 'off')
      document.getElementById('ipWidgetShowHide').value = '\u2B05'; 
    else
      document.getElementById('ipWidgetShowHide').value = '\u27A1';
  },

  setIpDetailsMode : function(mode) {
    this.ipDetails.className = mode;
  },

  showIpWidgetHelp: function() {
    //modal popup explaining the widget, triggered by 'help' button
    alert('Entering an IP Address here simulates a visitor from an alternate IP address, showing how this site would look customized by the firmographic data returned by the Demandbase IP Address API for that visitor.');
  },

  toggleIpWidgetMode : function() {
    this.setIpWidgetMode(ipWidget.className == 'off' ? 'on' : 'off');
  },

  toggleIpDetails : function() {
    this.setIpDetailsMode(ipDetails.className == 'off' ? 'on' : 'off');
  },

  toggleOverrideIp : function() {
    if($('#chkRevertIp').val() == 'on') {
      //when the box is checked, remove override IP from localStorage
      localStorage.removeItem('overrideIpAddress');
    } else {
      //when box is unchecked, set value in localStorage
      localStorage.setItem('overrideIpAddress', $("#overrideIpAddress").val());
      if(localStorage.overrideIpAddress == 'null') {
        localStorage.setItem('overrideIpAddress', '');
      }
    }

  },

  simulateVisit : function() {  //called when "Simulate" button is clicked...
    overrideIP = $('#overrideIpAddress').val(); //get from document when simulate button is called --updating global value
    if(overrideIP != '') {
      this.overrideIP = overrideIP; //update local value
      localStorage.setItem('overrideIpAddress', overrideIP);  //update value in local storage
      this.setSimulateMsg();
      this.loadAsyncScript();
    } else {
      alert('Please enter an IP address');
    }
  },

  setSimulateMsg : function() {
    $('#simulateIpMsg').html('&nbsp;<em><b>(Simulating: ' + this.overrideIP + ')</b></em>');
  },

  updateOverrideIp : function(element) {
    var idx=element.selectedIndex;
    var val=element.options[idx].value;
    var content=element.options[idx].innerHTML;
    $('#overrideIpAddress').val(val);
  },

  initIpFields : function(company) {
    if(company) {
      if(this.useTestIP) {
        //detectedIP = company.ip;
        this.overrideIP = TEST_IP;
        localStorage.setItem('overrideIpAddress', TEST_IP);
        this.loadAsyncScript();
        this.detectedIP = company.ip
      } else {
        this.overrideIP = localStorage.getItem('overrideIpAddress') || '';
        this.detectedIP = localStorage.getItem('detectedIp') || '';
        if(this.detectedIP == '') {
          //on first load, write detected Ip to localStorage
          this.detectedIP = company.ip;
          localStorage.setItem('detectedIp', this.detectedIP);
        }
      }
      if(this.overrideIP == '') {
        this.overrideIP = this.detectedIP;  
      }
    }// end if(company)
    //run ip widget regardless if company is resolved
    this.initIpWidget();
    this.setDetailFields(company);
  },

  loadAsyncScript : function() {
    var s = document.createElement('script');
    s.src = "http://api.demandbase.com/api/v2/ip.json?key="+this.token+"&query="+this.overrideIP+"&callback=DemandbaseLabs.IPWidget.demandbase_override";
    document.getElementsByTagName('head')[0].appendChild(s);
  },

  flattenData : function(data) {
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

  demandbase_parse : function(company) {
      //initial callback function when instantiating ipWidget via IP API
      if(company) {
          this.dbCompanyDataSet = company;
          
          /* Note: This function outputs html to the page that is customized based on Demandbase values.
                   This fcn is different on each page - placed at the end of the body tag on each page 
                   where content customization is enabled.  This function can also be called from the page where 
                   it is defined (after the call to the demandbase IP API --eg after this function runs)
            args:
              company - object - required - a demandbase company dataset
              pageType - string - optional - the link clicked or primary demandbase field used for customization
                                             can be used in dbContentCustomizer fnc
          TODO: uncomment this line and define this function in the page to enable content customization
          */
          
          //dbContentCustomizer(this.dbCompanyDataSet, pageType);
      } else {
        alert('No data returned for IP Address: ' + overrideIP + '. Please enter a valid public IP address.')
      }

      //After API call, run IP widget (even if IP is not resolved)
      DemandbaseLabs.IPWidget.initIpFields(company);
  },

  demandbase_override : function(company) {
      //callback function used by loadAsyncScrip fcn
      if(company) {
          //
          this.setDetailFields(company);
          this.dbCompanyDataSet = company; //update data object on override
          var pageType = localStorage.getItem('linkClicked') || 'industry';
          //TODO: still call this fcn on 404
          //dbContentCustomizer(company, pageType); //'industry');
      } else {
        //alert('404');
      }
      //update customized content 
      dbContentCustomizer(company, pageType); //'industry');

      if(typeof DBForms !== 'undefined') {
        //Note: compatibility with demandbaseFormStd.js
        //if on a forms page, also refresh/override data from form API calls
        DBForms.demandbaseParser.parser(company);
      } 
  },

  setDetailFields : function(company) {
    //this function builds a set of tabs populated with demandbase data and puts it into the widget
    var regTabToken = 'registry';
    var hqTabToken = 'hq';
    var awTabToken = 'watch_list';
    var locFieldList = ["street_address", "city", "state", "zip", "country", "country_name", "phone", "latitude", "longitude"];
    if(! company) return '';  //404 safety
    company = this.flattenData(company);   //for hq and account watch
    
    this.ipDetails.innerHTML = ''; //clear the results of the previous query
    //creating the tab switcher elements for jQuery UI (note CSS for classes lives in jQ CSS files)
    tabsElm = document.createElement('div');
    tabsElm.innerHTML = '<div id="tabs" class="ui-tabs ui-widget ui-widget-content ui-corner-all">' +
      '<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">' +
        '<li class="ui-state-default ui-corner-top ui-tabs-selected ui-state-active"><a href="#tabs-1">Company Summary</a></li>' +
        '<li class="ui-state-default ui-corner-top"><a href="#tabs-2">Registry</a></li>' +
        '<li class="ui-state-default ui-corner-top"><a href="#tabs-3">HQ</a></li>' +
        '<li class="ui-state-default ui-corner-top"><a href="#tabs-4">Account Watch</a></li>' +
        '<li class="ui-state-default ui-corner-top"><a href="#tabs-5">Premium</a></li>' +
      '</ul>' +
      '<div id="tabs-1" class="ui-tabs-panel ui-widget-content ui-corner-bottom"></div>' +
      '<div id="tabs-2" class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide"></div>' +
      '<div id="tabs-3" class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide"></div>' +
      '<div id="tabs-4" class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide"></div>' +
      '<div id="tabs-5" class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide"></div>' +
    '</div>';
    ipDetails.appendChild(tabsElm);
    $('#tabs').tabs();  //instantiate jQ UI tab switcher

    try {
      //Set IP Source and register with sourceChecker
      //if (!data.source) data.source = 'ip';     
      //this._sourceChecker.setSource(data.source, (data.company_name ? true : false), false)
      var fs = document.createElement('ul');
      fs.id='db_data_container';
      tabID = fs.id; //initialize
      for(eachField in company){
        var elName = eachField; //this._normalize(eachField);
        var newEl = document.createElement('li');
        newEl.setAttribute('id', elName);
        newEl.setAttribute('name', elName);
        //newEl.setAttribute('type',this.elType);
        newEl.setAttribute('class', 'dbFieldValue');
        newEl.innerHTML = '<strong>'+elName +': </strong>' + company[eachField];
        if(elName.substring(0, regTabToken.length) == regTabToken) {
          tabID = 'tabs-2'; //registry fields on tab 2
        } else if (elName.substring(elName.length-hqTabToken.length, elName.length) == hqTabToken || elName.indexOf(hqTabToken) != -1 || locFieldList.indexOf(elName) != -1) {
          tabID = 'tabs-3'; //location info and ending with hq goes to tab 3
        } else if (elName.substring(0, awTabToken.length) == awTabToken) {
          tabID = 'tabs-4'; //account watch is tab 4
        } else {
          //all the important stuff on tab 1
          tabID = 'tabs-1';
        }
        tabElm = document.getElementById(tabID);
        tabElm.appendChild(newEl);         
      }

      //add "Your data here" demo messaging
      var newEl = document.createElement('li');
      newEl.setAttribute('id', 'watch_list_promo');
      newEl.setAttribute('name', 'watch_list_promo');
      newEl.setAttribute('class', 'dbFieldValue');
      newEl.innerHTML = '<br/><strong>[ <em>Your custom data</em> goes here! ]</strong>';
      var tabElm = document.getElementById('tabs-4');
      tabElm.appendChild(newEl);

      //Show [example] premium attrs on last tab for DUNS and tech insights
      tabElm = document.getElementById('tabs-5');
      var newEl = document.createElement('li');
      newEl.setAttribute('id', 'premium_duns');
      newEl.setAttribute('name', 'premium_duns');
      newEl.setAttribute('class', 'dbFieldValue');
      newEl.innerHTML = '<strong>DUNS Number</strong>';
      tabElm.appendChild(newEl);
      
      var newEl = document.createElement('li');
      newEl.setAttribute('id', 'premium_ti');
      newEl.setAttribute('name', 'premium_ti');
      newEl.setAttribute('class', 'dbFieldValue');
      newEl.innerHTML = '<strong>Technology Insights Data</strong><br/><br/><em>Talk to your CSM or Sales for more info!</em>';
      tabElm.appendChild(newEl);

      this.ipDetails.appendChild(fs);
      
    } catch(e){if(debug)alert('Error: '+e);}
    
    $('#tabs').tabs().select(1); //render with the first tab chosen
  }, //end setDetailFields

  initIpWidget : function() {
      this.ipWidget = document.createElement('div');
      this.ipWidget.id = 'ipWidget';
      this.ipWidget.onclick = function (event) { event.stopPropagation() };
      currentIpElm = '';
      //if($('#currentIpMsg')) { //.html() != '' && $('#currentIpMsg').html() !== 'null'
        currentIpElm = '<span id="currentIpMsg">Your Current IP: ' + this.detectedIP + '</span>&nbsp;<span id="simulateIpMsg"></span>';
      //} else {
        //only write the current ip message on the first load
      //  currentIpElm = $('#currentIpMsg').html();
      //}
      
      //if(debug) { testIP = detectedIP; }
      this.testIP = (this.debug) ? this.detectedIP : this.overrideIP;
      if(this.overrideIP != '' && this.overrideIP != 'null') {
        this.testIP = this.overrideIP;
      } else {
        this.testIP = this.detectedIP;
      }
      if(this.useTestIP) { testIP = TEST_IP; }
      
      //building the ip address widget ui...
      if(typeof DBForms !== 'undefined') {
        toggleFldsElm = '<span><input type="checkbox" value="false" onclick="DBForms.demandbaseParser.toggleHiddenFields()">Display Hidden Form Fields</input></span>';
      } else { toggleFldsElm = ''; }
      revertElm = '<span><input type="checkbox" id="chkRevertIp" onclick="DemandbaseLabs.IPWidget.toggleOverrideIp()">Use Actual IP</input></span>';
      simulateIpElm = '<span id="ipSection">Enter an IP Address to Simulate a Visit:</span> <input size=40 id=overrideIpAddress autocomplete=on onkeydown="if (event.keyCode == 13) { DemandbaseLabs.IPWidget.simulateVisit() }" value=' + this.testIP + '> <input value="Simulate" type=button onclick="DemandbaseLabs.IPWidget.simulateVisit()">';
      detailsElm = '<input value="Details" type=button onClick="DemandbaseLabs.IPWidget.toggleIpDetails()">';
      helpElm = '<input value="Help" type=button onclick=showIpWidgetHelp()>';
      companySelectElm = '<select id="companySelect" onchange="DemandbaseLabs.IPWidget.updateOverrideIp(this);">'
          + '<option value="">--Select a company to simulate--</option>'
          + '<option value="4.18.62.1">East West Bank (Financial Services)</option>'
          + '<option value="4.21.101.1">AFIP (Healthcare & Medical)</option>'
          + '<option value="12.2.77.225">Japs-Olson (Printing & Publishing)</option>'
          + '<option value="4.71.21.65">Hughes Telematics (Telecommunications)</option>'
          + '<option value="4.20.98.65">Williams-Sonoma (Retail & Distribution)</option>'
          + '<option value="12.4.23.1">Airline Pilots Assoc. (Transportation & Logistics)</option>'
          + '<option value="30.0.0.1">US Dept. of Defense (Government)</option>'
          + '<option value="3.0.0.1">General Electric (Financial Services)</option>'
          + '<option value="212.125.84.152">Ski Class (Business Services)</option>'
          + '<option value="4.21.76.33">Mro / IBM (Software & Technology)</option>'
          + '<option value="12.131.200.224">Adobe (Software & Technology)</option>'
          + '<option value="123.45.0.0">ISP (Basic)</option>'
          
        + '</select>';

      this.ipWidget.innerHTML = '<input value="" id="ipWidgetShowHide" type=button onclick=DemandbaseLabs.IPWidget.toggleIpWidgetMode()>' 
                                + simulateIpElm + detailsElm + '<br/>'
                                + currentIpElm + '<span>&nbsp; &nbsp;</span>' + toggleFldsElm + '<br/>'
                                + companySelectElm + '<span>&nbsp; &nbsp;</span>';// + '<span>&nbsp; &nbsp;</span>' + revertElm;

      //store detected or test ip in localStorage
      localStorage.setItem('overrideIpAddress', this.testIP);
      this.ipDetails = document.createElement('div');
      this.ipDetails.id = 'ipDetails';
      this.ipDetails.onclick = function (event) { event.stopPropagation() };
      this.ipDetails.innerHTML = '<h4>Demandbase IP Data</h4>';
      this.ipWidget.appendChild(this.ipDetails);
      document.body.appendChild(this.ipWidget);
      
      //update 'Simulating' msg if overriding the detected ip
      if(this.detectedIP != this.overrideIP) {
        this.setSimulateMsg();
      }

      //turning debug mode on, the widget loads expanded
      if(this.debug) {
        var mode = 'on';
      } else {
        var mode = 'off'; //getCookie('review');
      }
      if (mode != 'off') {
        mode = 'on';
      }
      this.setIpWidgetMode(mode);
      this.setIpDetailsMode(mode);
      manualIP = document.getElementById('overrideIpAddress').value;
  }  //end initIpWidget
} //end DemandbaseLabs.IPWidget
//initIpWidget();  //enable this to instantiate widget w/o a db api call

