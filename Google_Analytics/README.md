#Demandbase Google Analytics Connector
Connect Demandbase to *GA Classic*, *GA Premium*, *Universal Analytics*.

Deploy and manage via [*Google Tag Manager*](https://www.google.com/tagmanager/) for optimal flexibility.

#Before You Begin
* Obtain Administrator access to Google Analytics
* [Assess which version of GA you have](https://support.google.com/analytics/answer/4457764?hl=en) (either *Classic*, *Universal*, or *Premium*)
  * Demandbase highly recommends [switching to *Universal Analytics*](https://developers.google.com/analytics/devguides/collection/upgrade/) and using *Google Tag Manager* with this solution.
* *Optional* - Install [GA Debugger Chrome extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna?hl=en)
* Check which (if any) Custom Variables/Custom Dimensions you are using in Google Analytics.
  * Verify within your reports, or use the GA Debugger Chrome Extension.
  * All new data sent to GA will be in addition to any data already in the system, so avoid re-using Custom Dimensions, if possible.

#Configuration
## First Steps
* Locate your Demandbase Key - provided by [Demandbase Support](mailto:support@demandbase.com)
* Assess which Demandbase attributes to send to Analytics.
  * Your Demandbase Customer Success Manager or Solutions Consultant can help you decide.
* *Universal Analytics only* - In the GA Admin console, [setup Custom Dimensions](https://support.google.com/analytics/answer/2709829?hl=en&ref_topic=2709827).
  * Set the 'Scope' to 'User' for any Custom Dimensions receiving Demandbase attributes.
  * GA Classic users skip this step.

##Configuration Wizard
* Visit the [Connector Setup Wizard](http://demandbaselabs.com/ga/) to configure and generate your connector.
* Enter your key, select the attributes you wish to integrate.  (Make sure they're in the same order you created them in Universal Analytics)
* Click *Generate*, then follow the [Installation](https://github.com/demandbaselabs/demandbaselabs/tree/master/Google_Analytics#installation) steps.

##Manual Configuration
* Add your Demandbase Analytics API key (replace 'YOUR_KEY_HERE' in the connector code).
* Configure the `fields` JSON object according to the Custom Dimensions you've created in UA.
  * Use `watch_list_` as a prefix for any [Account Watch](http://demandbaselabs.com/docs/wiki/index.php?title=Account_Watch) attributes.

#Installation
1. After receiving your configured script, test the code in a sandbox environment, if available.
  * *Optional* - Within the connector code, set the `logging` property to `true` in your test environment.  This will show the connector's activities in the browser console for easy verification.
2. Verify page tracking is functioning and Demandbase attributes are flowing into the appropriate Custom Dimensions/Variables.
3. Place your script in the appropriate space on each analytics-enabled page.  In most cases, this will be added to a template page within your CMS or in your Tag Management System.
4. If using [Google Tag Manager](https://www.google.com/tagmanager/), talk to your Demandbase Solutions Consultant about additional setup options.

#Release Notes
##v5.0 - Febrauary 2014
* Added [`dataLayer`](https://developers.google.com/tag-manager/android/reference/com/google/tagmanager/DataLayer) support for use with Google Tag Manager
* Combined GA and UA connector automatically detects which solutions you're using, so you do not need to upgrade your connector when [switching from GA to UA](https://developers.google.com/analytics/devguides/collection/upgrade/).
* Boolean attributes now return `false` where appropriate, rather than the default non-company value.

