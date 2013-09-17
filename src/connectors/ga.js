Demandbase=window.Demandbase||{};
Demandbase.Connectors=window.Demandbase.Connectors||{};
Demandbase.Connectors.Google_Analytics={
    name: 'Demandbase Google Analytics Connector',
    key:'',
    /* Customize which variables are sent to GA. each element in 'fields' must be a Demandbase variable name */
    fields:["audience","industry","revenue_range","employee_range", "company_name"],
    version:'4.0',
    dbDataSet: null,
    track:function(data) {
      try {
        var dbgac = Demandbase.Connectors.Google_Analytics;
        data=dbgac._flatA(data);
        dbgac.dbDataSet = data;  
        for(var field in dbgac.fields){
            var lbl=dbgac.fields[field];
            var val=data[dbgac.fields[field]]||'(Non-company Visitor)';
            dbgac._var((parseInt(field)+1),lbl,val,1);
            dbgac._logE((parseInt(field)+1)+' '+lbl+' : '+val);
        }
        
        /*  additional event with Demandbase data as category/action/label  */
        if(data) {
            var cat=data['audience'] || '(Non-company Visitor)';
            var act=data['audience_segment'] || '(Non-company Visitor)';
            var lbl=data['company_name'] || '(Non-company Visitor)';
            dbgac._cEvent(cat,act,lbl);
        }
        dbgac._event();
      } catch(e){ Demandbase.Connectors.Google_Analytics._logE('Integration Error: '+e)}; 
    },
    load:function(){
        try { 
            if(!window._gaq) window._gaq=[];
            var db=document.createElement('script');db.type='text/javascript'; db.async=true;
            db.src=('https:'==document.location.protocol?'https://':'http://')+'api.demandbase.com/api/v2/ip.json?key='+this.key+'&callback=Demandbase.Connectors.Google_Analytics.track&page='+document.URL+'&referrer='+document.referrer+'&page_title='+document.title;
            var s=document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(db,s);
            _gaq.push(['_addDevId', 'NE7T9']);
            Demandbase.Connectors.Google_Analytics._logE('Loaded Script ' + db.src);
        } catch(e){ this._logE('Script Error: '+e)}; 
    },
    _flatA:function(a){ 
        for(var d in a){ 
            if(typeof a[d]=='object' && a[d] !== null){ 
                for(var cd in a[d]){a[d+'_'+cd]=a[d][cd]};
                delete a[d];
            }
        }; 
        return a;
    },
    _logE:function(m){ if(window['console'] !== 'undefined' && typeof(console) !== 'undefined') { console.log('DB GA: '+m); } },
    _p:function(t,v1,v2,v3,v4,v5){ window._gaq.push([t,v1,v2,v3,v4,v5]); },
    _var:function(i,k,v,s){ this._p('_setCustomVar',i,k,v,s); },
    _event:function(){ this._p('_trackEvent','Demandbase','API Resolution','IP API',0,1); },
    _cEvent:function(cat, act, lbl){
        this._p('_trackEvent', cat, act, lbl, 0, 1);
        this._logE('Custom Event Tracked: '+cat+' : '+act+' : '+lbl);
    }
};
Demandbase.Connectors.Google_Analytics.load();