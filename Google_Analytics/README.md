#Demandbase Google Analytics Connector
Connect Demandbase to *GA Classic*, *GA Premium*, *Universal Analytics*.
Deploy via *Google Tag Manager* for optimal flexibility.

#Before You Begin
* Obtain Administrator access to Google Analytics
* [Assess which version of GA you have](https://support.google.com/analytics/answer/4457764?hl=en) (either *Classic*, *Universal*, or *Premium*)
  * Demandbase highly recommends [switching to *Universal Analytics*](https://developers.google.com/analytics/devguides/collection/upgrade/) and using *Google Tag Manager* with this solution.
* *Optional* - Install [GA Debugger Chrome extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna?hl=en)
* Check which (if any) Custom Variables/Custom Dimensions you are using in Google Analytics.
  * This is easiest with the GA Debugger Chrome Extension.
  * All new data sent to GA will be in addition to any data already in the system, so avoid re-using Custom Dimensions, if possible.

#Configuration
## First Steps
* Locate your Demandbase Key - provided by [Demandbase Support](mailto:support@demandbase.com)
* Assess which Demandbase attributes to send to Analytics.
  * Your Demandbase Customer Success Manager or Solutions Consultant can help you decide.
* In the GA Admin console, [setup Custom Dimensions](https://support.google.com/analytics/answer/2709829?hl=en&ref_topic=2709827) (for *Universal Analytics only*).
  * Set the 'Scope' to 'User' for any Custom Dimensions receiving Demandbase attributes.
  * Classic users skip this step.

##Configuration Wizard
* *Coming Soon!* - Visit the [Connector Setup Wizard](#) to configure and generate your connector.

##Manual Configuration
* Add your Demandbase Analytics key to the connector code.
* Configure the `fields` object according to the Custom Dimensions you've created.
  * Use `watch_list_` as a prefix for any [Account Watch]() attributes.

#Installation
1. After receiving your configured script, test the code in a sandbox environment, if available.
2. Verify page tracking is functioning and Demandbase attributes are flowing into the appropriate GA Custom Dimensions.
3. Place your script in the appropriate space on each analytics-enabled page.  In most cases, this will be added to a template page within your CMS or Tag Management System.
4. If using Google Tag Manager, talk to your Demandbase Solutions Consultant about additional setup options.

#Release Notes
##v5.0 - Febrauary 2014
* Added `dataLayer` support for use with Google Tag Manager
* Combined GA and UA connector automatically detects which solutions you're using, so you never have to upgrade.

