Demandbase.Connectors = window.Demandbase.Connectors || {};
Demandbase.Connectors.Adobe_AudienceManager = {
    domain :	'my_domain.n.net',
    dbToAmMap:	{ //optionally specify audience manager field name, if blank, Demandbase API name is used be default
    	'audience' 		: '', 
    	'industry' 		: '', 
    	'company_name' 	: '',
    	'revenue_range'	: '' 
    },
    send: function(data) {
        var s = document.createElement('script');
        s.async = true;
        s.id = 'adbe_am_api';
        
        var cStr = '', prefix = 'c_';
        for (field in this.dbToAmMap) {
	       //build customer variable string - Example: c_likes=britney+spears&c_loves=lady+gaga& 
	       var db_value = Demandbase.IP.CompanyProfile[field] || 'default';
	       db_value.replace(' ', '+');
		   cStr = cStr + prefix + this.dbToAmMap[field] + '=' + db_value + '&';
        }
        
        s.src = 'http://'+this.domain+'/event?d_stuff=1&d_dst=1&d_rtbd=json&d_ld=some+data+to+log&'+cStr+'d_cb=Demandbase.Connectors.Adobe_AudienceManager.callback';
        //Note: removed deprecated d_px=123,456,789&
        document.getElementsByTagName('head')[0].appendChild(s);
        //alert('sending to ADBE AM for ' + data.company_name || 'non-company visitor');
    },
    callback: function(data) {
	    //this function is called when audience manager returns data.
	    alert(data);
    }
    
};