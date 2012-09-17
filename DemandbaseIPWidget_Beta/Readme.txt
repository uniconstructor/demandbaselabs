Readme for Demandbase IP Widget:
Author: Matthew Downs - 2012-09-17
Description:  This file provides instructions for how to install and use the Demandbase IP Override Widget.
For more details, please visit:  http://wiki.demandbaselabs.com/mwiki/index.php?title=IP_Simulation_Widget

Prerequisites:  
-jQuery v. 1.7.2
-jQuery UI v. 1.8.21

Required Files:
-ipWidjet_beta.js
-ipWidget.css

Test page:
-ipWidgetSample.html

Installation Instructions:
1. Place the CSS and JS files in the appropriate folders according to your website's directory structure. 

2. Include the following lines in the <head> of your HTML page:
        <!-- jQuery includes -->
        <!-- Note, omitt this step if your page already has jQuery -->
        <link type="text/css" rel="stylesheet" href="[YOUR_PATH]/ui-lightness/jquery-ui-1.8.21.custom.css" />
        <script type="text/javascript" src="[YOUR_PATH]/jquery-1.7.2.min.js"></script>
        <script type="text/javascript" src="[YOUR_PATH]/jquery-ui-1.8.21.custom.min.js"></script>

        <!-- IP Widget Includes -->
        <link type="text/css" rel="stylesheet" href="[YOUR_PATH]/ipWidget.css"/>
        <script type="text/javascript" src="[YOUR_PATH]/ipWidget_beta.js"></script>

        <!-- Including Demandbase API Client -->
        <script type="text/javascript" src="https://dkj2m377b0yzw.cloudfront.net/clients/javascript/demandbase-1.0.0-min.js"></script>

3. Add your demandbase key:
	- Edit ipWidget_beta.js: Assign the 'token' global variable to your Demandandbase key.  This will enable use of the "Simulate" button.
	- Edit ipWidgetSample.html, passing your demandbase key to the call to DemandbaseClient.	
	- In both files, replace "<Your_Demandbase_Key_Here>" with your actual key.  (Hint: search for "TODO" comments)

4. Connect the IP Widget to your existing Demandbase Implementation.
	- Make a call to the Demandbase IP Address API using the DemandbaseClient object.
         For further details on this client, see:
         http://wiki.demandbaselabs.com/mwiki/index.php?title=Demandbase_API_Documentation#Calling_the_Domain_API_with_JavaScript_and_HTML

	- Use the function "DemandbaseLabs.IPWidget.demandbase_parse" to "Run" the IP Widget (Tip: use this as the callback function in the Demandbase IP API call)
        