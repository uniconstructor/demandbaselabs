/*Start Demandbase Form Connector Implementation*/
window.dbAsyncInit = function() {
  var dbf = Demandbase.Connectors.WebForm;
  dbf.connect({
    /*Form Connector Configuration*/
    emailID: "ID_OR_NAME_OF_EMAIL_FIELD",   /* These can be name or ID */  
    companyID: "ID_OR_NAME_OF_COMPANY_FIELD",
    key: 'YOUR_KEY_HERE',
    fieldMap: {
      'company_name': '', /* These can be name or ID */
      'industry': '',
      'sub_industry': '',
      'primary_sic': '',
      'revenue_range': '',
      'annual_sales': '',
      'employee_range': '',
      'employee_count': '',
      'street_address': '',
      'city': '',
      'state': '',
      'zip': '',
      'country': '',
      'country_name': '',
      'latitude': '',
      'longitude': '',
      'phone': '',
      'web_site': '',
      'stock_ticker': '',
      'traffic': '',
      'b2b': '',
      'b2c': '',
      'fortune_1000': '',
      'forbes_2000': '',
      'duns_num': '',
      'demandbase_sid': '',
      'data_source': '',
      'audience': '',
      'audience_segment': ''
    },
    toggleFieldList: [
      'exampleFieldID1', /*Field IDs*/
      'exampleFieldID2'
    ],
    getToggleElement: function(id) {
      return ((this.djq('.mktoFormCol').length > 0) ? this.djq('#'+id).parents('.mktoFormCol') : this.djq('#'+id).parents('li'));
    },
    getToggleFieldValue: function(id) {
      return this.djq('#'+id).val();
    }
  });
};

(function() {
  var dbt = document.createElement('script'); dbt.type = 'text/javascript'; 
  dbt.async = true; dbt.id = 'demandbase-form';
  dbt.src = ('https:'==document.location.protocol?'https://':'http://')+'scripts.demandbase.com/formWidget.js'; 
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(dbt, s);
})();