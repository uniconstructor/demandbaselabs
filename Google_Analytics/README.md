#Demandbase Google Analytics Connector
Connect Demandbase to *GA Classic*, *GA Premium*, *Universal Analytics*.

#Google Tag Manager
Deploy and manage via [*Google Tag Manager*](https://www.google.com/tagmanager/) for optimal flexibility.

##Setup Guide for Google Tag Manager

1. Install Cloud Connector / Write to `dataLayer`
2. Event `DB_Loaded`
3. Tag to setup macros
4. Macros Used in GA/UA Tag Setup

###Resources
[FAQ](https://www.google.com/tagmanager/faq.html)


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

#Migrating from Previous Versions
Upgrading to v5.0+ from another version is quick and easy.

1. Download [demandbaseGA.html](https://github.com/demandbaselabs/demandbaselabs/blob/master/Google_Analytics/demandbaseGA.html)
2. Add you Demandbase Analytics key.
3. Update the `fields` object.  For UA connectors, you can generally copy and paste the object.  
  * **Note:** If you are using *GA Classic*, `fields` may be an array, rather than an object.
  * **Important:** When switching from *GA Classic* to *Universal Analytics* you have an opportunity to add more Demandbase attributes.  Talk to your Customer Success Manager about which attributes you may want to add.
4. Functionality changes:
  * **Custom Events:** If your existing connector sends Demandbase attributes as Custom Events, you will need to provision new Custom Dimensions for these when switching to *Universal Analytics*.
  * **Concatenating attributes:** If your *GA Classic* connector concatenates two attributes together, these should be setup as separate Custom Dimensions in *Universal Analytics* (for example `industry` and `sub_industry` or `audience` and `audience_segment`).
5. Follow the [Installation Steps](https://github.com/demandbaselabs/demandbaselabs/tree/master/Google_Analytics#installation).

#Release Notes
##v5.0 - Febrauary 2014
* Added [`dataLayer`](https://developers.google.com/tag-manager/android/reference/com/google/tagmanager/DataLayer) support for use with Google Tag Manager
* Combined GA and UA connector automatically detects which solutions you're using, so you do not need to upgrade your connector when [switching from GA to UA](https://developers.google.com/analytics/devguides/collection/upgrade/).
* Boolean attributes now return `false` where appropriate, rather than the default non-company value.

