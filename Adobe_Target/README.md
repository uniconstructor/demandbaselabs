#Demandbase Adobe Target Connector
Demandbase can be leveraged in Adobe Target for delivering a specific content experience to a particular audience and for segmenting the results of content tests.  By identifying the company that is visiting the website in real-time, Demandbase provides B2B marketers the ability to customize page content according to defined segments.

##Adobe Analytics Data Connector
The fastest and easiest way to integrate with Adobe Target is to also integrate with Adobe Analytics.  It's best to use use the Demandbase Analytics Module in conjunction with the Demandbase Content Module for website optimization, so you can fully measure the results of content targeting and personalization efforts.

To automatically integrate with Adobe Target, simply select "yes" from the dropdown menu in *Step 1* of the Adobe Data Connector wizard within Adobe Analytics.  

* For step-by-step instructions, see [Adobe Analytics in-product documentation - Completing the Adobe Integration Wizard](http://microsite.omniture.com/t2/help/en_US/connectors/demandbase/#Completing_the_Adobe_Integration_Wizard).
* Complete instructions on the Adobe Analytics Data Connector are available in this repo: [Demandbase Adobe Analytics Setup Guide on GitHub](https://github.com/demandbaselabs/demandbaselabs/tree/master/Adobe_Analytics#data-connector).

**Important**:  *Use of this solution requires a license for both the Demandbase Content Module as well as the Demandbase Analytics Module.*


##JavaScript Connector
This **manual** solution is only recommended if you do not have Adobe Analytics or you have not licensed the Demandbase Analytics Module.

###Installation
1. Edit your `mbox.js` file to include the following plugin (*Configuration > Mbox.js > Edit*).
  * Click *Save* and download new `mbox.js.`
  * Note: You do not have to include all of the fields in this plugin. You can capture any attribute returned by Demandbase.
  * It is highly recommended to wrap the variable declarations and callback function in a namespace to avoid conflicts with other JavaScript on the site.

The simplest solution is to iteratively add each Demandbase attribute to the visitor's profile.  This ensures all attributes (such as Account Watch are always added), and it means you won't have to make a code change if new attributes are added.

Skip step 3 below when using this approach.

    ```
         function set_mbox_variables(data) {
            /**
                This function is called when Demandbase returns data.
                Iteratively add each Demandbase Company Profile to
                the visitor's Adobe Target Profile
            **/
            if(!data) return;
            try {
                var profileAttrStr = '', delim = ',', builder;
                for (var d in data) {
                        if (typeof data[d] == 'object' && data[d] !== null) {
                            for (var cd in data[d]) {
                                data[d + '_' + cd] = data[d][cd]
                            };
                            delete data[d];
                        }
                }
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var attr = 'profile.' + key + '=' + data[key] + delim;
                        profileAttrStr += attr;
                    }
                }
                profileAttrStr = profileAttrStr.split(delim);
                if(typeof mboxFactoryDefault !== 'undefined') {
                    builder = mboxFactoryDefault.getUrlBuilder();
                    builder.addParameters(profileAttrStr)
                }
            } catch (e) {
                console.log(e);
            }
        }
    ```
    Alternatively, you can select specific Demandbase attributes to add to the visitor's profile, assigning each to a global JS variable.  This method is best if you are concerned with the size of the server call or using a single global mbox.
    
    ```
    <!-- Demandbase Integration Plugin -->
    <script>
    var company_name =''
    ,industry =''
    ,sub_industry =''
    ,employee_range =''
    ,revenue_range =''
    ,account_status =''
    ,audience = '';
    function set_mbox_variables (data) {
      if(!data) return '';
      try{
        company_name = escape(data['company_name'] || '');
        industry = escape(data['industry'] || '');
        sub_industry = escape(data['sub_industry'] || '');
        employee_range = escape(data['employee_range'] || '');
        revenue_range = escape(data['revenue_range'] || '');
        if(typeof data.watch_list !== 'undefined') {
            account_status = escape(data.watch_list['account_status'] || '')
        }
        audience = escape(data['audience'] || '');
      } catch(e) {
       alert(e); //TODO: remove this alert in PROD
      }
    }
    </script>
    ```

2. Create in-mbox profile parameters that can be leveraged for personalization by appending the applicable profiles to the mbox:

    ```
    <div class="mboxDefault"></div>
    <script type="text/javascript">
       mboxCreate('mbox-name',
            'profile.company='+unescape(company_name),
            'profile.industry='+unescape(industry),
            'profile.subindustry='+unescape(sub_industry),
            'profile.accountstatus='+unescape(account_status),
            'profile.employeerange='+unescape(employee_range),
            'profile.revenuerange='+unescape(revenue_range),
            'profile.audience='+unescape(audience)
        );
    </script>
    ```
    
3. In the `<head>` section of the page, **after** the `mbox.js` script tag, add a `script` tag to call the Demandbase API with your API key.  This calls the `set_mbox_variables` function that sets the variables from the plugin in Step 1:

    ```
    <!-- Demandbase API reference tag -->
    <script type="text/javascript" src="//api.demandbase.com/api/v2/ip.json?key=YOUR_KEY_HERE&callback=set_mbox_variables"></script>
    ```
    
###Testing

1. Validate with a Web Debugger like *Firebug*, *Chrome Developer Tools*, or *Charles* to see the API response:

    ```
    set_mbox_variables("company_name":"Adobe", "industry":"Software & Technology","sub_industry":"Software Applications","account_status":"Customer","revenue_range":"$2.5B - $5B","employee_range":"Enterprise", "audience":"Enterprise Business"})
    ```

2. Validate with Digital Pulse Debugger to View Mbox Profile Parameters:

  *(Be sure to clear your cookies in between tests when using the [Adobe Digital Pulse Debugger](http://helpx.adobe.com/analytics/using/digitalpulse-debugger.html).)*

  <img src="https://www.evernote.com/shard/s100/sh/96538b23-5215-4789-acd5-2e4f9d334947/1dd704e9c99ebeb759aa50f2af221a49/deep/0/Screenshot%206/20/13%2011:53%20AM.jpg" />

3. Verify Profile variables are available in Adobe Target:

  <img src="https://www.evernote.com/shard/s100/sh/5fd377c8-8932-4262-b839-56355215c7b3/6afbe7310f930e4ad64dd758676e3560/deep/0/Screenshot6/20/1312:01PM.jpg" />


