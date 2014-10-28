#Demandbase Form Connector
##Table of Contents
* [Functionality Overview](https://github.com/demandbaselabs/demandbaselabs/blob/master/FormConnector/README.md#functionality-overview)
* [Getting Started](https://github.com/demandbaselabs/demandbaselabs/blob/master/FormConnector/README.md#getting-started)
* [Installation](https://github.com/demandbaselabs/demandbaselabs/blob/master/FormConnector/README.md#installation)
  * [Marketo Integration](https://github.com/demandbaselabs/demandbaselabs/blob/master/FormConnector/README.md#marketo-integration)
  * [Eloqua Integration](https://github.com/demandbaselabs/demandbaselabs/blob/master/FormConnector/README.md#eloqua-integration)
* [Configuration Options](https://github.com/demandbaselabs/demandbaselabs/blob/master/FormConnector/README.md#configuration-options)
  * [Growing Form Options](https://github.com/demandbaselabs/demandbaselabs/blob/master/FormConnector/README.md#growing-form-options)
  * [Testing](https://github.com/demandbaselabs/demandbaselabs/blob/master/FormConnector/README.md#testing-options)
  * [Styling the Company Autocomplete Menu](https://github.com/demandbaselabs/demandbaselabs/blob/master/FormConnector/README.md#styling-the-company-autocomplete-menu)
  * [Hook Functions](https://github.com/demandbaselabs/demandbaselabs/blob/master/FormConnector/README.md#hook-functions)
* [Support](https://github.com/demandbaselabs/demandbaselabs/blob/master/FormConnector/README.md#support)
* [Release Notes](https://github.com/demandbaselabs/demandbaselabs/blob/master/FormConnector/README.md#release-notes)

#Functionality Overview
The Demandbase Form Connector provides any easy-to-deploy, light-weight solution for adding the Demandbase Form Module to your web forms.

##Key Features
* Demandbase Real-Time Identification capabilities using 3-tier company identification (by IP address, email domain, and company autocomplete, includes automatic ISP filtering)
* Capture Demandbase company profile attributes in hidden, visible, or expandable fields using a simple mapping
* Scalable, easy-to-maintain, cloud-based solution
* Easy deployment - a simple JS tag to place in your HTML / page templates
* Flexibility to customize for any type of web form with any marketing automation system or form processor

##Advanced Features
* Configurable API priority logic
* Expanding/Growing form behavior: specify fields that are hidden at first and only shown as-needed.  This enables reduced friction up-front without the risk of missing crucial data points
* Easy-to-use testing features
* Works alongside your existing form validation and progressive profiling
* Extensibility - use "hook" functions to define and trigger custom functionality


#Getting Started
1. Decide which Demandbase attributes to capture and whether they'll be hidden fields, growing fields, or visible fields.  Then, complete a Form Design Reference document (available from your Customer Success Manager).
2. Create a test form and landing page.  (It's best to use a single, reusable form and landing page template, if possible.)
  * This typically involves cloning one of your existing page *and* adding hidden fields for the Demandbase attributes you wish to capture.
3. Configure your Connector JS snippet using this guide. (The initial configuration is typically provided by the Demandbase Consulting Services team).
4. Add your configured Form Connecor JS Snippet to your landing page.
5. Test and Deploy.

*If you are not already using the cloud-based Form Connector, talk to your Customer Success Manager about an upgrade!*

#Installation

###NOTE: If you are currently using the Demandbase Tag, do not manually add this code to your page. If you are unsure of your integration, please contact [Demandbase Support](http://support.demandbase.com/hc/en-us/requests/new).

To add the Demandbase Form Connector to your web forms:

1. Replace "Email" and "Company" in the snippet below with the actual IDs from the email and company fields on your form.
2. Add your Demandbase key
3. Create hidden fields on your form for the attributes you wish to capture.
  * Use our default `db_[api_name]` naming convention to automatically map fields, or
  * Map to existing hidden or visible fields using the `fieldMap`
4. Place the entire snippet in the `head` or top of the `body` of your HTML.
  * *Tag placement may vary based on your Marketing Automation System or form processor.*
5. Optionally, define additional functionality by sending additional parameters to the `connect` function or adding hook functions.
  * See [Configuration Options](https://github.com/demandbaselabs/demandbaselabs/blob/master/FormConnector/README.md#configuration-options) for a full list of options and associated functionality.

```
<script>
    window.dbAsyncInit = function() {
        var dbf = Demandbase.Connectors.WebForm;
        dbf.connect({
            emailID: "Email",
            companyID: "Company",
            key: 'YOUR_KEY_HERE'
        });
    };

    (function() {
        var dbt = document.createElement('script'); dbt.type = 'text/javascript';
        dbt.async = true; dbt.id = 'demandbase-form';
        dbt.src = ('https:'==document.location.protocol?'https://':'http://')+'scripts.demandbase.com/formWidget.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(dbt, s);
    })();
</script>
```

In this basic implementation, `Email` is the `id` of the the user-facing email field, and `Company` is the `id` of the user-facing company field.
This simplified example assumes that any hidden fields captured uses the standard `db_[api_name]` naming convention.  See **Configuration Options** for `fieldMap` for more on mapping to your existing fields.  See also `fieldPrefix` and `fieldSuffix` to establish your own naming convention.

**The Form Connector is compatible with all form processors and marketing automation systems that allow adding JavaScript to form pages.**

Specific instructions for the most commonly used systems are provided here.

##Marketo Integration

1. Open or create a landing page or landing page template.
2. If you have an existing Demandbase deployment, remove ALL existing Demandbase code and links to files
3. At the end of the page, just before the closing `body` tag, copy and paste your configured Form Connector tag as provided by Demandbase.

##Eloqua Integration

1. Open or create a landing page or landing page template.
2. Click the red toolbox labeled *Tools* on the left, then in the layout tools dialog, click the orange code icon (`</>`).
4. Click *Open JS Editor*.
5. Copy and paste your configured Form Connector tag as provided by Demandbase into the script editor, then click *Save*.


#Configuration Options

Configuration options are provided to the Form Connector using the `connect` function, which takes a single JSON object as it's only argument.  Properties can also be manually overridden using hook functions, but using the `connect` function is the best way to initialize.  The available properties and the functionality they provide are described in detail here.

For a further details see our [detailed technical specification](http://www.demandbaselabs.com/docs/form_connector) of the `Demandbase.Connectors.WebForm` class.

##Common/Required Parameters
####key
*Required* - This is your Demandbase authentication token.
####companyID
*Required* - This is the `id` of the *user-facing* (visible) company field, typically an `input` element.  This tells the Company Autocomplete Widget where to show the auto-suggest list of companies.  This will also trigger API calls based on user interactions with this field.

**Eloqua 10 Users** may choose to assign the HTML `name` to this property, rather than `id`.  Eloqua 10 changes the ID when fields are reordered on a form.

####emailID
*Required* - This is the `id` of the user-facing email field, typically an `input` element.  This tells the Company Autocomplete Widget where the user's email address is entered.  A call to the Domain API is triggered based on user interactions with this field.

**Eloqua 10 Users** may choose to assign the HTML `name` to this property, rather than `id`.  Eloqua 10 changes the ID when fields are reordered on a form.

####fieldMap
*Optional* - A JSON object used to map Demandbase attributes to input elements in the HTML.  The Demandbase API names on the left can be mapped to either the `id` (preferred) or the `name` of an HTML element.  

**If mapping by `name`, ensure your HTML does not have multiple elements with the same name.**

Hidden fields are automatically created for each attribute using the default naming convention `db_[api_name]` if nothing (or the empty string) is specified in `fieldMap`.

To establish (or match) your own naming convention, use the `fieldPrefix` *and/or* `fieldSuffix` parameters.  These tells the Connector to build/populate hidden fields with the naming convention `[fieldPrefix][api_name][fieldSuffix]`.  

**Note: ** Attributes mapped using `fieldMap` will override the default naming convention as well as `fieldPrefix` and `fieldSuffix`, so both can be used if not all fields match the defined prefix/suffix.

This example of using the `connect` function with `fieldMap` uses field names typically seen in Marketo:
```
<script>
    window.dbAsyncInit = function() {
        var dbf = Demandbase.Connectors.WebForm;
        dbf.connect({
            emailID: "Email",
            companyID: "Company",
            key: 'YOUR_KEY_HERE',
            fieldMap: {
                'company_name': 'HiddenCompany', //custom hidden field for Demandbase-provided company
                'demandbase_sid': '', //Unique ID for a company
                'industry': 'Industry',
                'sub_industry': 'SubIndustry',
                'revenue_range': '', //blank means this will map to 'db_revenue_range'
                'employee_range': 'NumberOfEmployees',
                'street_address': 'BillingStreet',
                'city': 'City',
                'state': 'State',
                'zip': 'PostalCode',
                'country': 'Country',
                'country_name': '', //blank means this will map to 'db_country_name'
                'phone': 'Phone',
                'data_source': '', //which data point provided the company profile (one of: 'ip', 'domain', or 'company')
                'watch_list_account_status': '' //example of using an Account Watch field called 'account_status'
            }
        });
    };

    (function() {
        var dbt = document.createElement('script'); dbt.type = 'text/javascript';
        dbt.async = true; dbt.id = 'demandbase-form';
        dbt.src = ('https:'==document.location.protocol?'https://':'http://')+'scripts.demandbase.com/formWidget.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(dbt, s);
    })();
</script>
```
For a full list of available attributes, please visit the [Demandbase API Documentation](http://demandbaselabs.com/docs/wiki/index.php?title=Demandbase_API_Documentation).

**Tip**: Do not use `fieldMap` to map to the user-facing company field.  This will cause the company field to be pre-filled and discourage the user from using the Company Autocomplete Widget, hence forgoing a valuable chance for company identification/verification.  Instead, **always have a second (hidden) field** for the company name provided by Demandbase.  *This way you will always have the company name that matches the company profile provided by Demandbase*, regardless of what the user types in the company name field.

##Growing Form Options
Growing or "expanding" form functionality can be implemented on any form.  The default `getToggleElement` and `getToggleFieldValue` functions work best with Eloqua-generated markup, and they can easily be set to work with Marketo form markup or any other system.

###How to Setup a Growing Form

1. Define `toggleFieldList` (an Array). List the `id` of each elements to hide/show.
2. Manually run the `toggleFields` function, and observe which elements show and hide.  If the `input` and `label` elements both hide, skip to step 4, otherwise go to step 3.
3. Define `getToggleElement` (a function).  Establish the relationship between the values in `toggleFieldList` and the actual elements to show/hide.
4. Define `getToggleFieldValue` (a function).   Define the relationship between the values in `toggleFieldList` and the `value` attribute on the `input` element being set.
5. To test, run `Demandbase.Connectors.WebForm.toggleFields({force:true})`.

####toggleFieldList
*Optional* (*Default:* `[]`)
This property defines the HTML elements which receive the "growing" form behavior.  This `Array` of `String` values holds the IDs of the HTML elements that hide initially and are shown if they do not have a value after the visitor has provided an email address and company name. *Do not put the empty string (`''`) in this array.*

Ideally, the HTML markup will have an element with an `id` that wraps both the `input` element and it's label.  If there is no wrapper element, it may be required to also specify the ID of the label element.  Alternatively, the `getToggleElement` function can be passed to the `connect` function to define the relationship between `toggleFieldList` and the HTML elements to show and hide.

Fields in this list are hidden by the Form Connector when the page loads, and **must be created as visible fields on your form**.  The `_areToggleFieldsVisible` function handles hiding fields when the page loads.

Pass `{force:true}` to override `toggleEmptyFieldsOnly` setting.

####toggleEmptyFieldsOnly
*Optional* (*Default:* `true`)
When `true` only the fields in `toggleField` list that do not have a value will be shown.  (Those fields whose `getToggleFieldValue` function returns empty or null will be shown.)

Set to `false` to toggle all fields every time.

####getToggleElement
*Optional (Required in some cases)*

*Default:*
```
function(id) {
    return this.djq('#' + id);
}
```
This function defines the relationship between the IDs listed in `toggleFieldList` and the actual HTML elements that need to be hidden.  In some cases the HTML markup will have an ID on an element that wraps both the input field and it's label.

For Eloqua forms list the IDs such as `["formElement1", "formElement2"]`, which are the IDs of the wrapper `div` elements, not the `input` elements themselves.  In this case it is not necessary to set `getToggleElement`.

For Marketo forms, the parent list element that wraps the field and it's label does not have an `id`, so the `getToggleElement` function must be overridden to:
```
function(id) {
    return this.djq('#' + id).parents('li');
}
```
Your Demandbase Consultant can assist you with properly defining this function.

####getToggleFieldValue
*Optional (Required in some cases)*
This function returns the value of a toggling field.  The function defines the relationship between the string values (typicaclly IDs) in the `toggleFieldList` and the HTML element that holds the field value (usually an `input` or `select` element).

By default, this will use a descending selector to look for the value of a child `input` or `select` element.
```
var inputSelector = '#' + id + ' input', menuSelector = '#' + id + ' select';
if(typeof this.djq(inputSelector).val() !== 'undefined') {
    return this.djq(inputSelector).val();
}
if(typeof this.djq(menuSelector).val() !== 'undefined') {
    return this.djq(menuSelector).val();
}
return null;
```

If `toggleFieldList` has the ID of the input element itself, such as in Marketo forms, then override this function to simply return the value of the element.   For example:
```
return this.djq('#'+id).val();
```

####areToggleFieldsVisible
**Deprecated** (*Default:* `true`)
*This was replaced by the `_areToggleFieldsVisible` function which automatically detects if the elements specified by `toggleFieldList` / `getToggleElement` are visible.

~~This Boolean flag tells the Form Connector whether or not the toggling fields are currently shown.  This should be `true` to start, which triggers hiding of the fields when the page loads. Only set to `false` if the fields in `toggleFieldList` are created as hidden fields in your form system.~~

##Advanced Options
####fieldPrefix
*Optional* (*Default:* `'db_'`)
To establish or match-to your own naming convention, use the `fieldPrefix` *and/or* `fieldSuffix` parameters.  The Connector will  build hidden fields with the naming convention `[fieldPrefix][api_name][fieldSuffix]`.
####fieldSuffix
*Optional* (*Default:* `''`)
To establish or match-to your own naming convention, use the `fieldPrefix` *and/or* `fieldSuffix` parameters.  The Connector will  build hidden fields with the naming convention `[fieldPrefix][api_name][fieldSuffix]`.

Example: you may want to set `fieldSuffix:'__c'` if your form process fields are also mapped to Salesforce fields.
####autocompleteLabel
*Optional* (*Default:* `'{marketing_alias} ({city}, {state})'`)
Allows you to changes the fields, format, and layout that appear in the Company Autocomplete Widget's list of suggested companies.
The style of the list can also be customized using CSS.  For details, see: [Styling the Company Autocomplete Menu](https://github.com/demandbaselabs/demandbaselabs/blob/master/FormConnector/README.md#styling-the-company-autocomplete-menu).

This can also be a function passed to the `connect` function.
In this example, the autocomplete list shows the zip code when available and the country name for countries without postal codes.

```
autocompleteLabel : function($, pick) {
    var zip = pick.zip || ''
    if(zip !== '') {
        return '{marketing_alias} ({city}, ' + zip + ')';
    } else {
        return '{marketing_alias} ({city}, {country_name})';
    }
}
```

####autocompletePlaceholder
*Optional* (*Default:* 'To Select, begin typing.')
Sets the placeholder text on the company name input field (as specified by `companyID`).
Note: this HTML5 feature may not be supported in all browsers.

####formNameList
*Optional (Required in some cases)* (*Default:*`[]`)
This is only required if there is more than one `form` element on the page.  By default the Form Connector will use the first form found in the DOM.

If there are additional forms on the page, then define this `Array` of `String` values, listing the `name` of each form to use.  **Note: using `formNameList` does not mean that every form that uses the Connector needs to be listed by name. ** When `formNameList` is defined, the Connector will attempt to attach to the `form` elements whose names are in the list.  If no `form` matches the names in the list, then the first form in the DOM will still be used by default.
####priorityMap
*Optional*

*Default*
```
priorityMap: {
    'domain': 3,
    'ip': 2,
    'company': 1
}
```
Defines which API's data set will contribute the Company Profile that gets submitted with the form when more than one API identifies the visitor's company.  **The highest number is the highest priority**.

Keeping the default priority is *strongly* recommended.

**Note:** If two or more API's return the same company (as defined by `demandbase_sid`), then this will override the `priorityMap`.

##Testing Options
These options are for *testing only*, and they all are set to `false` by default.  These should only be set to true in development and QA environments.
####debug
Show alert messages when errors occur.
**Note:** This can also be *temporarily overridden* on page load by adding `db_debug=true` to the page's URL query string string.
####logging
Turns on verbose messaging in the browser console.
**Note:** This can also be *temporarily overridden* on page load by adding `db_logging=true` to the page's URL query string. string.
####useTestIp
Tells the IP API override it's `query` parameter using the value set in `testIpAddress`.
**Note:** *This option will not have an effect on the autocomplete dropdown.* This can also be *temporarily overridden* on page load by adding `db_useTestIp=true` to the page's URL query string.
####testIpAddress
A `String` of the IP address to use to override the IP API's `query` parameter.
**Note:** *This option will not have an effect on the autocomplete dropdown.* This can also be *temporarily overridden* on page load by adding `db_ip=3.0.0.1` (any IP address can be used) to the page's URL query string.  If set in the query string, this will override the static value of `testIpAddress`.
####showResult
This will show a table below the form with all fields in the company profile each time a new data set is parsed.

####Sample Testing URL
`http://www.company.com/contactus.html?db_useTestIp=true&db_ip=3.0.0.1`


##Styling the Company Autocomplete Menu
You can customize the look and feel of the Company Autocomplete menu using CSS rules.
The Company Autocomplete menu has custom IDs and follows the styling instructions found in the official jQuery UI Theming documentation.

To change the contents of the each autocomplete entry or the placeholder text, see: `autocompleteLabel` and `autocompletePlaceholder` in [Advanced Options](https://github.com/demandbaselabs/demandbaselabs/blob/master/FormConnector/README.md#advanced-options).

###Sample CSS Rules
Some form systems will have CSS rules that override the styles of the autocomplete menu.  The most common example is the alignment of items in an unordered list.

This rule ensures the menu items are left-aligned:

```
<style type='text/css'>
   #demandbase-autocomplete { text-align: left; }
</style>
```

This example sets the default font size of the widget drop-down menu results:

```
<style type='text/css'>
   #demandbase-autocomplete { font-size: small; }
</style>
```

This rule places a thin black border around the entire menu:

```
<style type='text/css'>
     #demandbase-autocomplete #demandbase-company-autocomplete-widget .ui-widget {
        border-color: black;
        border-style: solid;
        border-width: 1px;
     }
</style>
```

###Sample HTML Markup
This is the markup rendered when the autocomplete menu shows.
This is shown to provide an example of IDs and classes available for use in CSS selectors.

```
<div id="demandbase-autocomplete">
   <div id="demandbase-company-autocomplete-widget" class="demandbase-company-autocomplete ui-widget">
      <ul class="demandbase-company-autocomplete ui-autocomplete ui-menu ui-widget ui-widget-content ui-corner-all role="listbox” aria-activedescendant="ui-active-menuitem">
         <li class="ui-menu-item" role="menuitem">
            <a class="ui-corner-all" tabindex="-1">Demandbase (San Francisco, CA)</a>
         </li>
      </ul>
   </div>
</div>
```

**Do not place this HTML in your page.**  *It's automatically rendered when the visitor enters 2 or more characters in the company field.*

##Hook Functions
Extend the functionality of the Form Connector (or have it trigger additional operations) by defining these functions in your implementation snippet.  These functions are never required and should be defined globally.  None of the functions return a value, but they do have parameters, and they can modify static members of the `Demandbase.Connectors.WebForm` class.

In each function the `data` parameter represents the JSON object of the Company Profile being parsed.  The `source` parameter will be the lowercase String representation of the API providing `data` ('ip', 'domain' or 'company').

When implementing hook functions, you may need to familiarize yourself with the `Demandbase.Connectors.WebForm` class.  For a complete technical reference, see [http://www.demandbaselabs.com/docs/form_connector](http://www.demandbaselabs.com/docs/form_connector).

Hook functions are implemented within the configuration snippet, and should be placed just after the `dbAsyncInit` function.

###db_hook_init()
Runs at the end of the `init` function, which is called on DOM ready.  Accepts no parameters.
###db_hook_before_parse(data, source)
Runs whenever an API returns data, but is subject to the ISP filter (see `filterISP`).  This function runs before a data set can be filtered by the `priorityMap`.
###db_hook_after_parse(data, source)
Runs after a new API response has been parsed.  This can be used to trigger extended functionality each time a new overriding data set is detected.
###db_hook_attr(source, attr, val)
Runs for each attribute while iterating through each attribute in a new overriding data set.  `attr` is the Demandbase API name of the attribute; `val` is the value of that attribute.
###db_hook_no_id()
Only runs if all three APIs have been hit and no API has provided a company profile.  This gives the opportunity to use registry attributes from `_ipDataSet` or trigger additional functionality if Demandbase is not providing required fields.
###db_hook_all_hit()
This function runs after all APIs have been queried, typically after the visitor has entered both an email address and company name.  This function runs after the "growing" form fields are shown, and it runs after `db_hook_no_id`.

#Support
[Email us](mailto:support@demandbase.com) anytime!  We're always listening, and your feedback is valuable!

For feature requests, bug fixes, or questions on configuration, email: [support@demandbase.com](mailto:support@demandbase.com)

#Release Notes
##v1.2.4 (April 14, 2014)
* **Bug Fix:** `_resetFields` plays nicely with new configuration options.
* *Enhancement:* `_attachCompanyAPI` has better support for element names and leverages existing IDs.
* *Enhancement:* `autocompletePlaceholder` will not replace existing placeholders.
* *Enhancement:* added some more friendly console logging for API priority.

##v1.2.2 (April 9, 2014)
* **Eloqua 10 Support:** `name` attribute is now supported for `companyID` and `emailID` properties.
 * Provides easier support for forms with dynamic IDs (or no ID) on these `input` elements
* **Bug Fix:** Added `encodeURIComponent` to IP API call to support page parameters with anchors, etc.
* Removed `runTests` and `_attachUnitTests` (no longer required)

##v1.2 (March 24, 2014)
* Growing Form Enhancement
  * Added `toggleEmptyFieldsOnly` configuration option, defaults to `false`.  Fields in `toggleFieldList` will only be shown if their `getToggleFieldValue` function returns null or empty.
  * Set `toggleEmptyFieldsOnly` to `false` to show all fields when `toggleFields` runs.
* Upgraded to jQuery 1.7.1 and Sizzle 1.10.19
* Added `autocompletePlaceholder` configuration option.

##v1.1 (February 2014)
* Marketo Forms 2.0 Support
  * Existing form attributes have value set rather than being re-built
  * `setAttribute` added for setting field values
* Growing form behavior enhancements
  * Retired `areToggleFieldsVisible` Boolean option.  This is now automatically detected by `_areToggleFieldsVisible` function
  * Removed from `connect` function
  * `toggleFields` checks visibility of each element, rather than using `areToggleFieldsVisible` property.
* Added `hasOwnProperty` checks in all `for...each` loops to support prototypal inheritance by other libraries.

##v1.0 (February 2014)
* Introduced hosted Form Connector solution with simplified deployment and completely asynchronous integration.
* Provides complete backwards-compatibility with implementation using legacy `demandbaseFormStd.js` and beta `demandbaseForm.js`.  **Talk to your Demandbase Consultant or Customer Success Manager for information about upgrades.**


