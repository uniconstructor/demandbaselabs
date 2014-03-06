/*
    Demandbase/WebTrends integration
    Sends custom measures (popl'd by Demandbase)
*/
Demandbase = window.Demandbase || {};
Demandbase.Connectors = Demandbase.Connectors || {};
Demandbase.Connectors.Webtrends_Analytics = {
    /* Insert your customer key field, here, as well as the fields to collect */
    key:'YOUR_KEY_HERE',
    fields:["audience","audience_segment","company_name","industry","sub_industry","revenue_range","employee_range","demandbase_sid","ip","fortune_1000","forbes_2000","b2b","b2c","city","state","zip","country"],
    /* Done customizing!  Don't touch the stuff below.  */
    tags:[], /* Array of variables (custom measures) to send */
    version:'2.1',
    CompanyProfile: null,
    logging: true, /* logs activity to browser console */
    track:function(data) {
      try {
        var self = Demandbase.Connectors.Webtrends_Analytics;
        data = self._flatA(data);
        self.CompanyProfile = data;  /*allows access to db dataset in JS outside of this namespace */
        for(field in self.fields){
            var lbl=self.fields[field];
            var val=data[self.fields[field]]||'(not set)';
            self._var(lbl,val);
            this._log('set var: ' + lbl + ' : ' + val);
        }
        dcsJSONTrack(self.tags);
      } catch(e){ };
    },
    load:function(){
        try {
            var db=document.createElement('script');db.type='text/javascript'; db.async=true;
            db.src=('https:'==document.location.protocol?'https://':'http://')+'api.demandbase.com/api/v2/ip.json?key='+this.key+'&callback=Demandbase.Connectors.Webtrends_Analytics.track&page='+document.URL+'&referrer='+document.referrer+'&page_title='+document.title;
            var s=document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(db,s);
        } catch(e){  };
    },
    _flatA:function(a){
        for(d in a){
            if(typeof a[d]=='object' && a[d] !== null){
                for(cd in a[d]){a[d+'_'+cd]=a[d][cd]};
                delete a[d];
            }
        };
        return a;
    },
    _var:function(i,k){
        /*Using DCSext. instead of WT.*/
        Demandbase.Connectors.Webtrends_Analytics.tags.push("DCSext.db_"+i, k);
    },
    _log: function(msg) {
        if (this.logging && typeof window.console !== 'undefined') window.console.log('DB WT Analytics: ' + msg);
    },
    dcsJSONTrack: function(jperm) {
        var Args = [];
        for (var i in jperm) {
            /*Take the jperm array and push it into Args*/
            if (typeof(i)!="undefined" && typeof(jperm[i])!="undefined") {
                Args.push(jperm[i].toString()); //It appears that we do not need to URI encode the values
            }
        }
        /*Note: in order for this to work, the Webtrends code must load before this script runs */
        if (typeof(dcsMultiTrack)!="undefined") {
            Args.push('WT.dl','5','WT.ti','DemandBase Data Collection','DCS.dcsuri','demandbase-data-collection.dbc'); /* we do not need to URI encode the WT.ti value */
            dcsMultiTrack.apply(this, Args);
        }
        else {
            /* Write data to meta tag, if no dcsMultiTrack for custom measures */
            for (var i = 0; i < Args.length; i+=2) {
              var metaTag=document.createElement("meta");
              metaTag.name=Args[i];
              metaTag.content=Args[i+1];
              document.head.appendChild(metaTag);
            }
        }
    }
};
Demandbase.Connectors.Webtrends_Analytics.load();