/*Start Demandbase Form Connector Implementation*/
window.dbAsyncInit = function() {
    /*Form Connector Configuration*/
    var dbf = Demandbase.Connectors.WebForm;
    dbf.connect({
        emailID: 'ID_OR_NAME_OF_EMAIL_FIELD',     /* These can be name or ID */
        companyID: 'ID_OR_NAME_OF_COMPANY_FIELD', 
        key: 'YOUR_KEY_HERE',
        toggleFieldList: ['fieldIDsGoHere'],
        fieldMap: {
            'company_name': '' /* These can be name or ID */
            ,'marketing_alias':''
            ,'industry': ''
            ,'sub_industry': ''
            ,'primary_sic': ''
            ,'revenue_range': ''
            ,'annual_sales': ''
            ,'employee_range': ''
            ,'employee_count': ''
            ,'street_address': ''
            ,'city': ''
            ,'state': ''
            ,'zip': ''
            ,'country': ''
            ,'country_name': ''
            ,'latitude': ''
            ,'longitude': ''
            ,'phone': ''
            ,'web_site': ''
            ,'stock_ticker': ''
            ,'traffic': ''
            ,'b2b': ''
            ,'b2c': ''
            ,'fortune_1000': ''
            ,'forbes_2000': ''
            ,'demandbase_sid': ''
            ,'data_source': ''
            ,'audience': ''
            ,'audience_segment': ''
            ,'ip':'ip'
        }
    });
    /**
        'db_hook_' function implementations go here
        Optional - define further functionality here, if needed
    **/
};
(function() {
    /*Retrieve Form Connector core file from the cloud*/
    var dbt = document.createElement('script'); dbt.type = 'text/javascript'; dbt.async = true; dbt.id = 'demandbase-form';
    dbt.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'scripts.demandbase.com/formWidget.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(dbt, s);
})();
/*End Demandbase Form Connector Implementation*/
