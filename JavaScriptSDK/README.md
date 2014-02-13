
Demandbase JavaScript SDK
==============

The Demandbase JavaScript SDK is a developer toolkit for the leveraging the Demandbase Platform's Real-Time Identification APIs.  Key features include the ability to create reusable visitor segments, and easy access to a website visitor's company profile based on IP address or email domain.

##Starter Pack
The JS file provided here is pre-configured with 5 commonly-used, broad-based visitor segments.

Start personalizing and targeting your site content by simply adding `sdkStarterPack.js` to your HTML, then add your Demandbase Content Module key.

The sample implementation provided here is just a starting point.  This solution is completely configurable and can match your target segments.

Talk to your Demandbase Solutions Consultant for details on configuring the SDK.

##Table of Contents
* [Overview](https://gist.github.com/demandbaselabs/8365109#overview)
* [Installation](https://gist.github.com/demandbaselabs/8365109#installation)
* [Configuration](https://gist.github.com/demandbaselabs/8365109#configuration)
* [How to Use Segments](https://gist.github.com/demandbaselabs/8365109#how-to-use-segments)
* [How to Use Demandbase Attribute Values](https://gist.github.com/demandbaselabs/8365109#how-to-user-demandbase-attribute-values)
* [Basic Definitions](https://gist.github.com/demandbaselabs/8365109#basic-definitions)
* [Demandbase.Segments Class](https://gist.github.com/demandbaselabs/8365109#demandbasesegments-class)
* [Helper Classes](https://gist.github.com/demandbaselabs/8365109#additional-helper-classes)
* [Resources](https://gist.github.com/demandbaselabs/8365109#additional-resources)

##Overview
The Demandbase JavaScript SDK doesn't have any standalone files that need to be downloaded or installed, instead you simply need to include a short piece of JavaScript in your HTML that will asynchronously load the JavaScript library. By asynchronously loading, the library and API calls do not block loading other elements of your page.

This JavaScript library provides an easy-to-use wrapper to the Demandbase IP and Domain APIs as well as a means to build reusable rules around a visitor's company profile.  The rules created using this library, called "Segments" allow marketing teams and web developers to drive content personalization and targeting on their web site.

##Installation
First place a `script` tag similar to this one immediately inside the `body` tag on each page of your website.  The definitions for conditions and segments will be unique to your site, based on the requirements of your business.

**Important: ** The Demandbase Consulting team will configure this snippet for you based on your desired market segments/audiences.

```
<script type="text/javascript">
var __db = {};
__db.key = 'YOUR_KEY_HERE';
__db.conditions = [
     { name: 'IndustryIsSoftware', attribute: 'industry', operator: '=', value: 'Software & Technology', standalone: false }
    ,{ name: 'AudienceIsSMB', attribute: 'audience', operator: '=', value: 'SMB', standalone: false }
    ,{ name: 'AudienceIsEnterprise', attribute: 'audience', operator: '=', value: 'Enterprise' }
    ,{ name: 'CountryIsJapan', attribute: 'country', operator: '=', value: 'JP', standalone: false}
    ,{ name: 'RegCountryIsJapan', attribute: 'registry_country_code', operator: '=', value: 'JP', standalone: false }
    ,{ name: 'RevenueOver10M', attribute: 'revenue_range', operator: '!=', value: ['$1 - $1M', '$1M - $5M', '$5M - $10M'] }
];
__db.segments = [
    { name: 'SMB_Software', rules: ['IndustryIsSoftware', 'AudienceIsSMB'], operator: 'and' }
   ,{ name: 'SoftwareOrOver10M', rules: ['RevenueOver10M', 'IndustryIsSoftware'], operator: 'any' }
   ,{ name: 'GEO_JP', rules: ['CountryIsJapan', 'RegCountryIsJapan'], operator: 'or' }
];
__db.callback = function(company) {
    /**
      Content customization code goes here!
      Add any function calls or other code here to be run after the Demandbase Company Profile is available
      'company' argument is equivalent to Demandbase.Segments.CompanyProfile
    **/
};

(function() {
    var db = document.createElement('script'); db.type = 'text/javascript'; db.async = true;
    db.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'scripts.demandbase.com/demandbase-sdk.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(db, s);
})();
</script>
```

See also the [Segmentation Library Implementation Sample](https://gist.github.com/demandbaselabs/8365097) Gist.
For a live sample implementation (which includes Optimizely and Adobe Target), see the [DemandbaseLabs.com Sandbox](http://demandbaselabs.com/sandbox/).

##Configuration
The JavaScript SDK is initialized via the `__db` global object, which holds definitions for the various configuration options.
###`__db.key` (String)
**Required**, this is your Demandbase authentication token.

###`__db.conditions` (Array)
This is a list of objects which defines the Conditions available as Segments or for use in building Segments.  **Required** when using visitor segmentation.

###`__db.segments` (Array)
A list of objects defining the visitor Segments available.  **Required** when using visitor segmentation.

###`__db.callback` (function)
This *optional* function is run asynchronously once the visitor's company profile is available in the page.  This function is automatically called each time the IP address or Domain APIs return data.  Any code using the Demandbase Company Profile should be placed in this function.

###`__db.getDomain` (function)
*Optional*, this function only needs to be defined if using the Domain API for company identification.  This function is used to retrieve a visitor's email address from the page context, typically from a cookie, HTML element, or a JavaScript variable.
The return value of this function should be a string of the email address or email domain.
If this function is define, the SDK will attempt to retrieve a company profile using the Demandbase Domain API.   If a profile is available for the visitor's email domain, then the Domain API company profile will override the IP address API data set for that visitor.

##How to Use Segments
The `Demandbase.Segments` class evaluates all defined Conditions and Segments and makes them available as easy-to-use Boolean properties of the `Demandbase.Segments` class.
This example shows using segments to set variable in a JavaScript condition:

```
if(Demandbase.Segments.EnterpriseSegment) {
    imgUrl = 'enterpriseURL.jpg';
} else if (Demandbase.Segments.SMBSegment) {
    imgUrl = 'smbURL.jpg';
} else {
    imgURL = 'defaultURL.jpg';
}
```

##How to User Demandbase Attribute Values
The value of any attribute in a visitor's `CompanyProfile` are also available.  This is can be used to place attribute values as dynamic copy in a page.

```
var visitor_industry = Demandbase.Segments.CompanyProfile.industry||‘your industry’;
var visitor_company = Demandbase.Segments.CompanyProfile.company_name||‘your company’;
```

##Basic Definitions
###Conditions
A "Condition" is a comparison of a Demandbase attribute and a specific value or an list of values.  Think of Conditions as the building blocks for Segments.
A 'Condition' that does not have the `standalone` attribute set to `false` will also be a "Segment". Any number of Conditions can be used to define a Segment.  

###Segments
A "Segment" is a business rule, a Boolean combinations of Conditions (or the evaluation of a single Condition) surrounding a visitor's company profile.   

##Configuring Conditions and Segments
The Demandbase.Segments class houses an array of `DBCondition` objects and an array of `DBSegment` objects.  
These are initially defined using a configuration snippet before the library is loaded, using the `__db.conditions` `__db.segments` arrays as shown in the sample above.

###Defining Conditions
Conditions are evaluations of Demandbase Company Profile attributes, which are represented as a JSON object.  Note, at runtime, the JSON objects are converted into `DBCondition` objects.

A condition has a `name`, a single `attribute` (a Demandbase Company Profile field), an `operator`, and a `value` (or array of values).

Here is an example of a JSON representation of a condition:
```
{ 
  name : 'condition_name', 
  attribute : 'demandbase_variable', 
  operator : '=|equals|!=|not equals|contains', 
  value : 'attribute value',
  standalone : true|false //optional
}
```

The `value` attribute can be a single value as a string, or an array of string values.  If an array is defined, the `evaluate` function of the DBCondition will return an 'or' operation of the values in the list, because any given attribute from the API response will only have one value for a given visitor.

| Supported Operator        | Supported Shorthand |
| ------------- |:-------------:|
| equals      | = |
| not equals  | != |
| contains    | contain |

Note: These are programmatically accessible using `DBCondition.prototype.supportedOperators`.

Use the `Demandbase.Segments.add` function to dynamically create a new Condition:
```
Demandbase.Segments.add('condition', { name:'MyAudience', attribute: 'audience', operator: 'equals', value: ['SOHO', 'SMB', 'Residential'], standalone: true });
```

If the `standalone` attribute is true or omitted from the Condition definition, each Condition will also be added as a Segment.  A Segment is Boolean property of the `Demandbase.Segments` class.  These are the properties used to drive content.

Continuing the previous example, this Condition is now available as a Segment (a Boolean property) using `Demandbase.Segments.MyAudience`, which will return `true` or `false`, base on the site visitor's company profile.

Set the `standalone` attribute to `false`, if you do not want a Condition to also be added as it's own segment.  You can still programmatically check the value of the Condition, but it will not be added as a property of the class.

###Defining Segments
Once you've defined Conditions against particular attributes, then you can combine them to build Segments.  

**If each of your conditions is standalone, then you do not need to define Segments separately.**  For example, if you want to whether a visitor belongs to one of 5 industries, you can define a standalone Condition for each industry, or you can define a single Condition with an array of industries.

Segments are represented as JSON objects consisting of a name, an operator and an list of Conditions (rules).
`name` is a user-defined value that is used when leveraging the Segment.
`rules` is an array containing names of Conditions
`operator` a Boolean operators (`or`, `and`), which is applied to the group of Conditions.  These effectively provide 'any' or 'all' operations, so these are supported as well.

Here is an example of a JSON representation of a condition:
```
{ 
  name : 'segment_name', 
  rules : ['ConditionName1', 'ConditionName2', 'ConditionNameN'], 
  operator : 'any/or/all/and', 
}
```
Supported operators are `any` (effectively `or`) and `all` (effectively `and`).  
This is programmatically available using `DBSegment.prototype.supportedOperators`.

| Supported Operator  | Equivalent Shorthand |
| ------------- |:-------------:|
| any      | or, &#124;&#124; |
| all  | and, &&  |

####Build Complex Segments using Multiple Conditions
**For Segments that use a single Condition, there is no need to use the `__db.segments` array or the `add` function to create a Segment.  The Segment will be created when the Condition is added, provided the `standalone` attribute was not set to `false`.**  

For Segments that use multiple Conditions, it is necessary to define them in the `__segments` array as shown in the implementation sample above.

The `rules` array in a Segment object is comprised of the `name` attributes from the defined Condition objects.

In addition to initializing using the `__db.segments` array, you can also use the `Demandbase.Segments.add` function to dynamically create a new Segment:

```
Demandbase.Segments.add('segment', { name: 'UserDefinedName', rules: ['condition_name', 'another_condition_name'], operator: 'any|or|and|all'});
```

##Demandbase.Segments Class
In the implementation snippet above the initialization options in the `__db` object get assigned to various properties within the library.

####Demandbase.Segments.[segmentName]
Returns `true` or `false` for a user-defined Segment as evaluated against the current `Demandbase.Segments.CompanyProfile`.

####Demandbase.Segments.CompanyProfile
A JSON object, this is the visitor profile used to evaluate all segments.

####Demandbase.Segments.add(type, newObject)
Used to create a new Condition or Segment.
`type` parameter is either "condition" or "segment".
`newObject` parameter is the JSON definition of either a Condition or a Segment.
<!-- TODO: explain adding a new condition with fcn call -->

####Demandbase.Segments.get(type, itemName)
Retrieves a Condition or Segment object.  If `type` parameter is not specified, `segment` is presumed by default as this is the most common use.

####Demandbase.Segments.getActiveSegments()
Returns an array of all segments that apply to the current visitor profile.
<!-- TODO: does this return an array of strings or an array of objects? -->

####Demandbase.Segments.getInactiveSegments()
Returns an array of all segments that are defined but do not apply to the current visitor profile.
<!-- TODO: does this return an array of strings or an array of objects? -->

<!--TODO: document isValid function -->

####Demandbase.Segments._allConditions
Within the `Demandbase.Segments` class the `_allConditions` array stores condition objects available for use in segments.
```
_allConditions: [
    { name: 'IndustryIsSoftware', attribute : 'industry', operator : '=', value : 'Software & Technology', standalone : false },
    { name: 'AudienceIsSMB', attribute : 'audience', operator : 'equals', value : 'SMB' },
    { name: 'AudienceIsEnterprise', attribute : 'audience', operator : 'equals', value : 'Enterprise' },
]
```
In this example, "AudienceIsSMB" and "AudienceIsEnterprise" will both also be available as Segments, however, "IndustryIsSoftware" will not, because the `standalone` flag is set to `false`.

####Demandbase.Segments._allSegments
Similar to Conditions, the `_allSegments` array stores the currently-defined segments.  These intermediate JSON representations are replaced by `DBSegment` objects at runtime.
```
_allSegments: [
    { name: 'DemandbaseSegment', rules: ['IndustryIsSoftware', 'AudienceIsSMB'], operator: 'any' },
    { name: 'EnterpriseSegment', rules: ['AudienceIsEnterprise', MyAudience'], operator: 'all' },
]
```
<!-- eventually....
###Demandbase.ContentMod

###Demandbase.CompanyAutocomplete
###Demandbase.Connectors.WebForm
###Demandbase.Connectors.Google_Analytics
-->

##Additional Helper Classes
These classes drive communications with the Demandbase APIs, providing data and basic functionality to the `Demandbase.Segments` class.

###Demandbase.utils Class
A set of helper functions used by the IP and Domain classes.
####Demandbase.utils.getQueryParam(param)
Returns the value of the specified parameter from the current pages URL query string.

####Demandbase.utils.flattenData(data)
Takes a JSON object and returns the same object with first-level nested objects flattened into the base object.
For example,
```
var nest = {
  foo : 'a',
  bar : {
    b : 'c'
  }
}
var flat = Demandbase.utils.flattenData(nest);
```

Now `flat` would be:
```
var nest = {
  foo : 'a',
  bar_b : 'c'
}
```

####Demandbase.utils.putLS(obj)
Accepts an object and places each item in the object into `localStorage`.

####Demandbase.utils.getLS(name)
Retrieves the value of `name` from `localStorage`.

####Demandbase.utils._log(msg)
Used throughout the library, prints `msg` to the console, if `Demandbase.utils.logging` is set to true, or if `db_logging=true` is added to the query string.

<!-- TODO: Document runConnectors, loadScript, _loadJquery, authorize -->

###Demandbase.IP
Query the Demandbase IP Address API each time a page loads.
Use the `CompanyProfile` property of this class to access all Demandbase attributes for a visitor.

####Demandbase.IP.CompanyProfile
A JSON object - the API response from the IP address API.

####Demandbase.IP.load
Queries the IP address API using the key defined in __db.key.
<!-- TODO: examples of using CompanyProfile, load,  -->

###Demandbase.Domain
Query the Demandbase Domain API, if a visitor's email is available within the page context or a cookie.
Using this is optional, and requires defining a function (`getDomain`) that retrieves the visitor's email domain.

####Demandbase.Domain.CompanyProfile
A JSON object - the API response from the Domain API.

####Demandbase.Domain.load
Queries the Domain API using the key defined in __db.key.
<!-- TODO: examples of using CompanyProfile, load,  -->

##Testing
To simulate a visit from a particular IP address, add `db_ip` as a query string parameter to the URL of a page using the library.
For example to simulate General Electric visiting `http://mysite.com/index.html`, use `http://www.mysite.com/index.html?db_ip=3.0.0.1`. 

###Debug Version
A debug version of the library is available as well.  Change the source URL to `scripts.demandbase.com/demandbase-sdk-debug.js`.  This will enable console logging, debugging alerts, and load an un-compiled version of the library.

<!-- TOOD: define DBCondition and DBSegment object types -->

#Additional Resources
For values to use in conditions, a complete enumeration of Demandbase attribute values for `audience`, `audience_segment`, `industry`, and `sub_industry` are available here:
https://github.com/demandbaselabs/demandbase_return_values

Details on using Demandbase's API and a list of attributes available in the Demandbase Company Profile is available here:
http://demandbaselabs.com/docs/wiki/index.php?title=Demandbase_API_Documentation

For further information, please contact your Demandbase Customer Success Manager, or email [Demandbase Support](mailto:support@demandbase.com)



