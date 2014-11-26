#Demandbase Google Analytics Connector
Connect Demandbase to *GA Classic*, *GA Premium*, *Universal Analytics*.

##Contents
* [Getting Started](https://github.com/demandbaselabs/demandbaselabs/tree/master/Google_Analytics#before-you-begin)
* [Configuration](https://github.com/demandbaselabs/demandbaselabs/tree/master/Google_Analytics#configuration)
* [Installation](https://github.com/demandbaselabs/demandbaselabs/tree/master/Google_Analytics#installation)
* [Google Tag Manager](https://github.com/demandbaselabs/demandbaselabs/tree/master/Google_Analytics#google-tag-manager)
* [Upgrading from Prior Versions](https://github.com/demandbaselabs/demandbaselabs/tree/master/Google_Analytics#migrating-from-previous-versions)
* [Release Notes](https://github.com/demandbaselabs/demandbaselabs/tree/master/Google_Analytics#release-notes)

#Getting Started
* Obtain Administrator access to Google Analytics
* [Assess which version of GA you have](https://support.google.com/analytics/answer/4457764?hl=en) (either *Classic*, *Universal*, or *Premium*)
  * Demandbase highly recommends [switching to *Universal Analytics*](https://developers.google.com/analytics/devguides/collection/upgrade/) and using *Google Tag Manager* with this solution.
* *Recommended* - Install [Google Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-by-google/kejbdjndbnbjgmefkgdddjlbokphdefk?hl=en)
* *Optional* - Install [GA Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna?hl=en)
* Check which (if any) Custom Variables/Custom Dimensions you are using in Google Analytics.
  * Verify within your reports, or use your Chrome Extension(s).
  * All new data sent to GA will be in addition to any data already in the system, so avoid re-using Custom Variables/Dimensions, if possible.

#Configuration
## First Steps
* Locate your Demandbase Key - provided by [Demandbase Support](mailto:support@demandbase.com)
* Assess which Demandbase attributes to send to Analytics.
  * Your Demandbase Customer Success Manager or Solutions Consultant can help you decide.
* *Universal Analytics only* - In the GA Admin console, [setup Custom Dimensions](https://support.google.com/analytics/answer/2709829?hl=en&ref_topic=2709827).
  * Set the 'Scope' to 'User' for any Custom Dimensions receiving Demandbase attributes.
  * GA Classic users skip this step.

##Configuration Wizard
>####NOTE: If you are currently using the Demandbase Tag, do not manually add this code to your page. If you are unsure of your integration, please contact [Demandbase Support](http://support.demandbase.com/hc/en-us/requests/new).

* If you are using Google Tag Manager, skip to [Using Google Tag Manager](https://github.com/demandbaselabs/demandbaselabs/tree/master/Google_Analytics#google-tag-manager)
* Visit the [Connector Setup Wizard](http://demandbaselabs.com/cloud/) to configure and generate your connector.
* Enter your key, select the attributes you wish to integrate.  (Make sure they're in the same order you created them in Universal Analytics)

* Click *Get Your Tag*, then follow the [Installation](https://github.com/demandbaselabs/demandbaselabs/tree/master/Google_Analytics#installation) steps.

##Manual Configuration
**(Not Recommended)** - If you need a customized integration script, talk to your Demandbase Solutions Consultant.  Chances are we've solved the problem before and can provide you the code you need.
* Add your Demandbase Analytics API key (replace 'YOUR_KEY_HERE' in the connector code).
* Configure the `fields` JSON object according to the Custom Dimensions you've created in UA.
  * Use `watch_list_` as a prefix for any [Account Watch](http://demandbaselabs.com/docs/wiki/index.php?title=Account_Watch) attributes.

#Installation
1. After receiving your configured script, test the code in a sandbox environment, if available.
  * *Optional* - Within the connector code, set the `logging` property to `true` in your test environment.  This will show the connector's activities in the browser console for easy verification.
2. Verify page tracking is functioning and Demandbase attributes are flowing into the appropriate Custom Dimensions/Variables.
3. Place your script in the appropriate space on each analytics-enabled page.  In most cases, this will be added to a template page within your CMS or in your Tag Management System.
4. If using [Google Tag Manager](https://www.google.com/tagmanager/), see [the Google Tag Manager instructions](https://github.com/demandbaselabs/demandbaselabs/tree/master/Google_Analytics#google-tag-manager)
  * If using another Tag Management System, talk to your Demandbase Solutions Consultant about additional setup options.

#Google Tag Manager
Deploy and manage via [*Google Tag Manager*](https://www.google.com/tagmanager/) for optimal flexibility.

##Using the Google Analytics Connector with Google Tag Manager
In order to deploy the Demandbase Connector using Google Tag Manager, you should deploy Google Analytics using the out-of-the-box tags available in GTM.

1. If not already, create a GTM account, a container for all your scripts and a Universal Tag with a macro of your tracking ID (UA-XXXXX-X).
2.  In Google Tag Manager, create a RULE called "All Pages after gtm.dom" with 2 conditions. All Pages (url matches regex .*) AND (event equals gtm.dom)
3.  Create a new "Custom HTML Tag", then copy/paste the Demandbase Tag into the GTM HTML Tag. Assign the RULE from prevoius step to the Firing Rule of this tag.
4. In GTM, Create a Rule that fires on the "Demandbase_Loaded" event.
  * <img src="https://www.evernote.com/shard/s100/sh/bcb963f6-62ab-420b-99b0-f4a29253c13a/81ebc0cede3b01e9a61df1bcc88930be/deep/0/Screenshot%205/16/14,%209:58%20AM.jpg" alt="event-based rule setup" />
5. Create Macros (in GTM) for each Demandbase attribute you wish to capture.
  * Each Demandbase attribute will have a corresponding Data Layer Variable.  Use the [Demandbase IP API](http://demandbaselabs.com/docs/wiki/index.php?title=Demandbase_API_Documentation#IP_Address_API) variable name (e.g. `company_name`, `revenue_range`, etc.) in the "Data Layer Variable Name" field.
  * <img src="https://www.evernote.com/shard/s100/sh/278d9b6e-9b08-461f-b2e5-1e1239c557fc/de2cc954748566c624dd2e806b2496ca/deep/0/Screenshot%205/14/14,%2010:56%20AM.jpg" alt="Macro setup example"/>
6. Now, [create a *new* Universal Analytics tag](https://support.google.com/tagmanager/answer/3281379?hl=en).   This tag will send a Custom Event and assign Custom Dimensions using the Macros you created.
  * Under "Track Type", select "Event".
    * Use "Demandbase" / "API Resolution" / "IP Address API" as the category / action / label for your event.
    * SEt "Non-Interaction Hit" to `true`
  * For Firing Rules, use the "Demandbase_Loaded" Event created in step 3.
  * Set the Custom Dimensions - Use the number from the Dimension you created in Google Analytics paired with the corresponding Macro created in step 4.
  * <img src="https://www.evernote.com/shard/s100/sh/e321d290-afef-4a41-b327-97a8b39fca8f/ebf52febf2f29032ee8d345490a3814e/deep/0/Screenshot%205/5/14,%201:29%20PM.jpg" alt="GTM tag setup" />

##GTM Resources

* [Setting up Google Analytics Tags](https://support.google.com/tagmanager/answer/3281379?hl=en)
* [Tags, Rules, Macros, Data Layer](https://support.google.com/tagmanager/answer/3284009?hl=en)
* [More on Macros](https://support.google.com/tagmanager/answer/2644341?hl=en)
* [FAQ](https://www.google.com/tagmanager/faq.html)
* [Product Forum](https://productforums.google.com/forum/#!forum/tag-manager)

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
##v6.0 - May 2014
* Added support for Demandbase Company-Targeted Advertising pixels
* UI refresh for Connector tool (now includes Ads and GTM)
* *Bug Fix* Type conversions to match Google API expectations

##v5.0 - Febrauary 2014
* Added [`dataLayer`](https://developers.google.com/tag-manager/android/reference/com/google/tagmanager/DataLayer) support for use with Google Tag Manager
* Combined GA and UA connector automatically detects which solutions you're using, so you do not need to upgrade your connector when [switching from GA to UA](https://developers.google.com/analytics/devguides/collection/upgrade/).
* Boolean attributes now return `false` where appropriate, rather than the default non-company value.

