Readme for Demandbase IP Widget:
Author: Matthew Downs - 2012-07-19
Description:  This file provides instructions for how to install and use the Demandbase IP Widget.

Prerequisites:  
-jQuery v. 1.7.2
-jQuery UI v. 1.8.21

Required Files:
-ipWidjet_rc1.js
-ipWidget.css

Installation Instructions:
1. Place the CSS and JS files in the appropriate folders according to your website's directory structure.  Note: the code in Step 2 assumes the .js files are in the "scripts" folder and the .css files are in the "css" folder.

2. Include the following lines in the <head> of your HTML page:
        <!-- jQuery includes -->
        <link type="text/css" href="css/ui-lightness/jquery-ui-1.8.21.custom.css" rel="stylesheet" />
        <script type="text/javascript" src="scripts/jquery-1.7.2.min.js"></script>
        <script type="text/javascript" src="scripts/jquery-ui-1.8.21.custom.min.js"></script>

        <!-- IP Widget Includes -->
        <link href="css/ipWidget.css" type="text/css" rel="stylesheet"/>
        <script type="text/javascript" src="scripts/ipWidget_rc1.js"></script>

3. Add your demandbase key:
	Edit ipWidget_rc1.js:
		On line 11, assign the 'token' global variable to your Demandandbase key.
	Edit ipWidgetSample.html, passing your demandbase key to the call to DemandbaseClient.	
	In both files, replace "<Your_Demandbase_Key_Here>" with your actual key.

4. Connect the IP Widget to your existing Demandbase Implementation.
	-Grab the "override IP address" (as shown in line 20 of ipWidgetSample.html), and pass it to the "query" parameter of your call to a Demandbase API
	-Call the function "demandbase_parse" to "Run" the IP Widget (or use this as the callback in a Demandbase API call)
        
        
        