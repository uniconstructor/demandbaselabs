//	See this page for details on how to get the 
//	correct information from your Marketo form:
//	http://developers.marketo.com/documentation/websites/forms-2-0/

//	Be sure to replace ALL XXXX characters with your relevant Marketo info

MktoForms2.loadForm("//XXX-XXX.marketo.com", "XXX-XXX-XXX", XXXX, function (form) {

	//from here we have access to the form object and can call its methods.
	window.dbAsyncInit = function () {
		var dbf = Demandbase.Connectors.WebForm;
		dbf.connect({
			emailID: "ID_OR_NAME_OF_EMAIL_FIELD",
			companyID: "ID_OR_NAME_OF_COMPANY_FIELD",
			key: 'YOUR_KEY_HERE',
			fieldMap: {
				'company_name': '',
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
				'exampleFieldID1',
				'exampleFieldID2'
			],
			getToggleElement: function (id) {
				return ((this.djq('.mktoFormCol').length > 0) ? this.djq('#' + id).parents('.mktoFormCol') : this.djq('#' + id).parents('li'));
			},
			getToggleFieldValue: function (id) {
				return this.djq('#' + id).val();
			}
		});
	};

	(function () {
		var dbt = document.createElement('script');
		dbt.type = 'text/javascript';
		dbt.async = true;
		dbt.id = 'demandbase-form';
		dbt.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'scripts.demandbase.com/formWidget.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(dbt, s);
	})();
});
