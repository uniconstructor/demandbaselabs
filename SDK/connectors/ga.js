/**
  File: ga.js  v.4.1
  Name: Demandbase Analytics Module for Google Analytics
  Authors:  Matthew Downs (mdowns[at@]demandbase[dot.]com),
            Ehsan Ketabchi (eketabchi[at@]demandbase[dot.]com),
            Ilya Hoffman (Ilya[at@]SynapseAutomation[dot.]com)

  Support Contact: strategicservices[at@]demandbase[dot.]com
  License: Copyright 2013. This code may not be reused without explicit permission by its owners. All rights reserved.
**/
Demandbase=window.Demandbase||{};
Demandbase.Connectors=window.Demandbase.Connectors||{};
Demandbase.Connectors.Google_Analytics={
    name: 'Demandbase Google Analytics Connector',
    key:'',
    /* Customize which variables are sent to GA. each element in 'fields' must be a Demandbase variable name */
    fields: window._dbc.gaCustomVars || [],
    version:'4.1',
    dbDataSet: null,
    track:function(data) {
      try {
        var dbgac = Demandbase.Connectors.Google_Analytics, dflt='(Non-company Visitor)';
        //data=dbgac._flatA(data);
        dbgac.dbDataSet = data;  
        for(var field in dbgac.fields){
            var lbl=dbgac.fields[field];
            var val=data[dbgac.fields[field]]||dflt;
            dbgac._var((parseInt(field)+1),lbl,val,1);
            Demandbase.utils._log((parseInt(field)+1)+' '+lbl+' : '+val);
        }
        /*  additional event with Demandbase data as category/action/label  */
        if(data) {
            var cat=data['audience'] || dflt;
            var act=data['audience_segment'] || dflt;
            var lbl=data['company_name'] || dflt;
            dbgac._cEvent(cat,act,lbl);
        }
        dbgac._event();
      } catch(e){ Demandbase.utils._log('Integration Error: '+e)}; 
    },
    load:function(){
        try { 
            if(!window._gaq) window._gaq=[];
            /*
            var db=document.createElement('script');db.type='text/javascript'; db.async=true;
            db.src=('https:'==document.location.protocol?'https://':'http://')+'api.demandbase.com/api/v2/ip.json?key='+this.key+'&callback=Demandbase.Connectors.Google_Analytics.track&page='+document.URL+'&referrer='+document.referrer+'&page_title='+document.title;
            var s=document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(db,s);
            */
            if(!Demandbase.IP.CompanyProfile) alert('Demandbase.IP.CompanyProfile: ' + Demandbase.IP.CompanyProfile);
            this.track(Demandbase.IP.CompanyProfile);
            _gaq.push(['_addDevId', 'NE7T9']);
            //Demandbase.utils._log('Loaded Script ' + db.src);
        } catch(e){ Demandbase.utils._log('Script Error: '+e)}; 
    },
    //_logE:function(m){ if(window['console'] !== 'undefined' && typeof(console) !== 'undefined') { console.log('DB GA: '+m); } },
    _p:function(t,v1,v2,v3,v4,v5){ window._gaq.push([t,v1,v2,v3,v4,v5]); },
    _var:function(i,k,v,s){ this._p('_setCustomVar',i,k,v,s); },
    _event:function(){ this._p('_trackEvent','Demandbase','API Resolution','IP API',0,1); },
    _cEvent:function(cat, act, lbl){
        this._p('_trackEvent', cat, act, lbl, 0, 1);
        Demandbase.utils._log('Custom Event Tracked: '+cat+' : '+act+' : '+lbl);
    }
};
(function() {
    var runner = Demandbase.utils.runConnectors;
    Demandbase.utils.runConnectors = extRunConnectors;
    function extRunConnectors() {
        runner.apply(Demandbase.utils); // Use #apply in case `init` uses `this`
        Demandbase.Connectors.Google_Analytics.load(); 
    }
})();
/*
Demandbase.utils.runConnectors = (function(data) {
    Demandbase.Connectors.Google_Analytics.load();    
})();*/
