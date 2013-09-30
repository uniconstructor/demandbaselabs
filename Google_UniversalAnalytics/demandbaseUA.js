/* 
Demandbase / Google Universal Analytics Integration
The contents of this file can be delivered to pages via Google Tag Manager, or it can be referenced on any page.
*/
/* Add script tags if placing directly in HTML page
<script type="text/javascript">
*/
/*Standard Google UA code 
 Note: This standard code from Google may already be in your existing UA deployment */
ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};(function(f,a,s,t){
s=a.createElement(f),t=a.getElementsByTagName(f)[0];s.async=true;s.src='//www.google-analytics.com/analytics.js';t.parentNode.insertBefore(s,t)})('script',document);
ga('create', 'UA-YOUR-PROPERTY-ID');
/*End  Standard Google UA code */

/*Start Demandbase integration */ 
var Demandbase = window.Demandbase || {};
Demandbase.Connectors = window.Demandbase.Connectors || {};
Demandbase.Connectors.Google_UniversalAnalytics = {
    name: 'Demandbase Universal Analytics Connector',
    version: '2.0',
    key:'YOUR-DEMANDBASE-KEY',
    /* Customize which variables are sent to GA. 
       'fields' must be a Demandbase variable name
       'fieldLabels' is free form this is the custom variable key in GA */
    fields:['company_name','industry','sub_industry','employee_range','revenue_range','audience','audience_segment'],
    fieldLabels: ['Company Name', 'Industry', 'Sub Industry', 'Employee Range', 'Revenue Range','Audience','Audience Segment'],
    dbDataSet: null,
    track:function(data) {
      try {
        var dbgua = Demandbase.Connectors.Google_UniversalAnalytics;
        var dflt='(Non-company Visitor)'
        data=dbgua._flatA(data);
        dbgua.dbDataSet = data;
        for(field in dbgua.fields){
          var l=dbgua.fieldLabels[field],v=data[dbgua.fields[field]]||dflt;
          dbgua._var((parseInt(field)+1),l,v,1)
          dbgua._logE((parseInt(field)+1)+' ' +l +' : '+v);
        };
        dbgua._event();
        
        dbgua._cEvent(data['audience']||dflt,data['industry']||dflt,data['company_name']||dflt);
        /* Example of custom Account Watch fields
        dbgua._cEvent(data['watch_list_account_type']||dflt,data['watch_list_buying_stage']||dflt,data['company_name']||dflt);
        */
      } catch(e){ Demandbase.Connectors.Google_UniversalAnalytics._logE('Integration Error: '+e) }; 
    },
    load:function(){
      try { 
        if(!window.ga) window.ga=[];
        var db=document.createElement('script');db.type='text/javascript'; db.async=true;
        /* Remove 'sandbox.' from src URL when deploying to production */
        db.src=('https:'==document.location.protocol?'https://':'http://')+'api.demandbase.com/api/v2/ip.json?key='+this.key+'&callback=Demandbase.Connectors.Google_UniversalAnalytics.track&page='+document.URL+'&referrer='+document.referrer;
        var s=document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(db,s);
        Demandbase.Connectors.Google_UniversalAnalytics._logE('Loaded Script ' + db.src);
      } catch(e){ this._logE('Script Error: '+e)}; 
    },
    _flatA:function(a){ 
      for(d in a){ 
        if(typeof a[d]=='object'&&a[d]!==null){ 
          for(cd in a[d]){a[d+'_'+cd]=a[d][cd]};
          delete a[d];
        }
      }; 
      return a;
    },
    _logE:function(m){ if(typeof(console) !== 'undefined' && window['console'] !== 'undefined') { console.log('DB UA: '+m); } },
    _var:function(i,k,v,s){ ga('set','dimension'+i,v); },
    _event:function(){ 
        ga("send", "event", {
        eventCategory: "Demandbase",
        eventAction: "API Resolution",
        eventLabel: "IP Address API",
        nonInteraction: true
      });
      Demandbase.Connectors.Google_UniversalAnalytics._logE('Sent Custom Event: Demandbase/API Resolution/IP Address API');
    },
    _cEvent:function(c,a,l){
      ga("send", "event", {
        eventCategory: c,
        eventAction: a,
        eventLabel: l,
        nonInteraction: true
      });
      Demandbase.Connectors.Google_UniversalAnalytics._logE('Sent Custom Event:'+c+'/'+a+'/'+l);
    }
};
Demandbase.Connectors.Google_UniversalAnalytics.load();
/* End Demandbase integration */

/* Send track page view call to Universal Analytics 
   Note: This standard code from Google may already be in your existing UA deployment */
ga('send', 'pageview');

/* End Demandbase / Google Universal Analytics */

/*  Add script tags if placing directly in HTML page
</script> */ 

