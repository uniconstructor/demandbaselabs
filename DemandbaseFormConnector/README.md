File: demandbaseForm.js  v.beta_0.1
Name: Demandbase Form Module
Authors: Matthew Downs (mdowns[at@]demandbase[dot.]com), Ilya Hoffman (Ilya[at@]SynapseAutomation[dot.]com), 
Support Contact: strategicservices[at@]demandbase[dot.]com
License: Copyright 2013. All rights reserved.

demandbaseForm.js is a replacement for demandbaseFormStd.js.  This new-and-improved framework is a public beta.  

Technical documentation is available at:
	http://www.demandbaselabs.com/docs/form_connector
	
Getting Started Guide (work-in-progress)
	http://wiki.demandbaselabs.com/mwiki/index.php?title=Demandbase_Form_Connector

Demonstration page with Eloqua form integration is available at:
	http://www.demandbaselabs.com/sandbox/form.html

Unit test page using qUnit is currently in-developement at:
	http://www.demandbaselabs.com/form/FormConnectorTest.html



New Features:
	
	- "connect" function provides an easy way to set/override properties from outside the demandbaseForm.js file
	- added "authorize" function to validate Demandbase key
	- "_restoreIpFields" function adds detected IP back to data sets from Domain and Company API, so IP address can be captured with every visit.
	- "keepAudienceFields" option to always capture audience and audience segment, regardless of the winning API
	- Domain API call is triggered even when Email field has a prepopulated value
	- added "hook" function so class functionality can be extended.  
		- db_hook_init is called in init function
		- db_hook_before_parse is called whenever a data set is returned
		- db_hook_attr is called for each returned attribute whenever a data set is parsed
		- db_hook_after_parse is called after a data set is parsed (only called for overriding data sets)

Enhancements:
	
	- elements specified in toggleFieldList are automatically hidden when script loads
	- visible and hidden elements can be mapped by name or ID (uses _getElmByIdOrName function)
	- only elements within the specified form are considered when mapping by name (uses _getElmByIdOrName function)
	- Company Autocomplete label can now be set via property instead of modifying function
	- prepopFieldMap has been renamed to visibleFieldMap
	- added version property for basic version tracking
	- added properties for IP API-only fields detectedIP, detectedAudience, detectedAudienceSegment
	- added optional console logging for easy demo and debugging
	- Automatic HTTPS support - added protocol detection when loading IP API
	- "idTriggerFieldList" renamed to "requiredAttrsList"
	- Extensive commenting of each property and method for YUI doc generation.
	- cleaned/clarified header comments and instructions

Bug Fixes:
	
	- null/empty attributes are no longer stripped-out by the _flattenData function
	- if a field is not returned by an overriding data set, the previously set value will now be set to blank instead of persisting (_resetFields) function
	- more robust detection of widget.js file - IP API is still called even if widget.js is not present.


