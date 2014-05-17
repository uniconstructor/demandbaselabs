/*
    Demandbase/WebTrends Integration
    Sends company profile attributes as DCSext variables
*/
Demandbase = window.Demandbase || {};
Demandbase.Connectors = Demandbase.Connectors || {};
Demandbase.Connectors.Webtrends_Analytics={
    /* Insert your customer key field, here, as well as the fields to collect */
    key:'YOUR_KEY_HERE',
    fields: [
        'audience',
        'audience_segment',
        'company_name',
        'industry',
        'sub_industry',
        'revenue_range',
        'employee_range',
        'demandbase_sid',
        'ip',
        'fortune_1000',
        'forbes_2000',
        'city',
        'state',
        'zip',
        'country',
        'primary_sic',
        'web_site'
    ],
    registryMap : {
        'city' : 'registry_city',
        'state' : 'registry_state',
        'zip' : 'registry_zip_code',
        'country' : 'registry_country_code',
    },
    /* Done customizing!  Don't touch the stuff below.  */
    tags:[], /* Array of variables (custom measures) to send */
    version:'2.2',
    CompanyProfile: null,
    logging: false, //logs activity to browser console
    track:function(data) {
      try {
        var self = Demandbase.Connectors.Webtrends_Analytics;
        data = self._flatA(data);
        self.CompanyProfile = data;  /*allows access to db dataset in JS outside of this namespace */
        for(field in self.fields){
            if(self.fields.hasOwnProperty(field)) {
                var dflt = '[n/a]',
                    rName = self.registryMap[self.fields[field]],
                    lbl = self.fields[field],
                    val = data[self.fields[field]]||data[rName]||dflt;
                if(data[self.fields[field]] === false) { val = 'false'; }
                self._var(lbl,val);
            }

        }
        this.dcsJSONTrack(self.tags);
      } catch(e){ this._log(e); };
    },
    _var:function(i,k){
        Demandbase.Connectors.Webtrends_Analytics.tags.push('DCSext.db_'+i, k);
        this._log('Set DCSext.db_' + i + ' : ' + k);
    },
    dcsJSONTrack: function(jperm) {
        var Args = [];
        for (var i in jperm) {
            if(jperm.hasOwnProperty(i)) {
                //Take the jperm array and push it into Args
                if (typeof(i)!=='undefined' && typeof(jperm[i])!=='undefined') {
                    Args.push(jperm[i].toString()); //It appears that we do not need to URI encode the values
                }
            }
        }
        /*Note: dcsMultiTrack is Webtrends (top section) code / needs to load before this script runs */
        if (typeof(dcsMultiTrack)!=='undefined') {
            //Note: WT.dl 5 used for Demandbase - ensure this is open or configure
            //Consider also: ('WT.ti','DemandBase Data Collection','DCS.dcsuri','demandbase-data-collection.dbc')
            Args.push('WT.dl','5');
            dcsMultiTrack.apply(this, Args);
            this._log('dcsMultiTrack Successful. With args: ' + Args);
        }
        else {
            /* Write data to meta tag, if no dcsMultiTrack */
            for (var i = 0; i < Args.length; i+=2) {
              var metaTag=document.createElement('meta');
              metaTag.name=Args[i];
              metaTag.content=Args[i+1];
              document.head.appendChild(metaTag);
              this._log('Added meta tag: ' + metaTag.name + ' : ' + metaTag.content);
            }
        }
    },
    _flatA : function(a){ for(d in a){ if(typeof a[d]=='object' && a[d] !== null){ for(cd in a[d]){a[d+'_'+cd]=a[d][cd]}; delete a[d]; } }; return a; },
    _log : function(msg) { if (this.logging && typeof window.console !== 'undefined') window.console.log('DB WT: ' + msg); },
    load : function(){ try { var db=document.createElement('script'), pg=document.URL; if(top !== self) { pg=document.referrer; } db.type='text/javascript'; db.async=true; db.src=('https:'==document.location.protocol?'https://':'http://')+'api.demandbase.com/api/v2/ip.json?key='+this.key+'&callback=Demandbase.Connectors.Webtrends_Analytics.track&page='+pg+'&referrer='+document.referrer+'&page_title='+document.title; var s=document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(db,s); } catch(e){ this._log(e); }; },
};
Demandbase.Connectors.Webtrends_Analytics.load();