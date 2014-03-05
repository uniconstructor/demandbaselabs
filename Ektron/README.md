#Demandbase Connector for Ektron 8.5
This connector enables content authors to create content conditions based on potential Demandbase values.
Developed by Ektron, this connector modifies the *Targeted Content Widget*, which is included in all instances of *Ektron 8.5*, and *Page Builder*, which commonly leveraged by most Ektron users.

The integration exposes Demandbase attributes to the *Targeted Content Widget* user interface in the application layer.
Additionally the administrative aspects of configuration (e.g. Demandbase key, what attributes will show up as options) is done in the code, not exposed to content authors.

#Installation
Installing and configuring the connector requires a technical user with access to the instance file system.

If the Targeted Content widget has been modified already in your Ektron instance, there is some (minimal) effort involved in merging the Demandbase code into your changes.

1. Add a key to your `web.config` (or `application.config`) called `DemandBase.AccountId`. Set the value to your Demandbase Content Module key.  This is required by the `DemandBaseTargetingInfo` class.
2. Download the files in this directory. (available as a [.zip](http://demandbaselabs.com/docs/wiki/index.php?title=File:DemandbaseEktronIntegration20120926.zip))
3. Place the following files into your *Ektron* instance's file system:
  * `/widgets/TargetedContent.ascx.cs`
    * Defines the Targeted Content User Interface and calls the rules
  * `/App_Code/CSCode/TargetedContent/TargetedContentRules.cs`
    * Defines the Targeted Content rules

#Configuration
##`TargetedContent.ascx.cs`
In the *Targeted Content Widget*, there’s a method called `AddDemandBaseRuleTemplates`.

```
private void AddDemandBaseRuleTemplates()
{
    AddRuleTemplate(new DemandBaseIndustryTemplate("Industry"));
}
```

This method calls a class, `DemandBaseIndustryTemplate`, which resides in the file `/App_Code/CSCode/TargetedContent/TargetedContentRules.cs`.

For any other Demandbase attributes that you’d like to use to target, create a class similar to the `DemandBaseIndustryTemplate` class
and call it from the `AddDemandBaseRuleTemplates` method using the same syntax as the `DemandBaseIndustryTemplate` rule.  This can be done for any of the attributes in the Demandbase company profile.

##`TargetedContentRules.cs`
The `DemandBaseTargetingInfo` class will be used by all classes that you create for targeting content based on the Demandbase company profile.
This class will handle all aspects of detecting the site visitor’s IP address, making the call to the Demandbase API, caching the XML block that’s returned for a particular IP address, and parsing the data from the XML block returned.

