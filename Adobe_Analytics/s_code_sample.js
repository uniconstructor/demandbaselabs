/* SiteCatalyst code version: H.26.
Copyright 1996-2013 Adobe, Inc. All Rights Reserved
More info available at http://www.omniture.com */

var s_account="your_report_suite"
var s=s_gi(s_account)
/************************** CONFIG SECTION **************************/
/* You may add or alter any code config here. */
s.charSet="UTF-8"
/* Conversion Config */
s.currencyCode="USD"
/* Link Tracking Config */
s.trackDownloadLinks=true
s.trackExternalLinks=true
s.trackInlineStats=true
s.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx"
s.linkInternalFilters="javascript:,."
s.linkLeaveQueryString=false
s.linkTrackVars="None"
s.linkTrackEvents="None"

/* PLUGIN CONFIG */
s.usePlugins=true
function s_doPlugins(s) {
	/*
	This example shows how to assign eVars from Demandbase data using the Integrate module
	*/
	s.loadModule("Integrate");
	s.Integrate.add('DemandbasePlugin');
	s.Integrate.DemandbasePlugin.setVars = function (s, p) {
		var dbs = window.dbr||{}, defaultVal="(Non-Company Visitor)";	
		s.eVar1 = dbs.audience 			||defaultVal;
		s.eVar2 = dbs.audience_segment	||defaultVal;
		s.eVar3 = dbs.company_name		||defaultVal;
		s.eVar4 = dbs.industry			||defaultVal;
		s.eVar5 = dbs.sub_industry		||defaultVal;
		s.eVar6 = dbs.revenue_range		||defaultVal;
		s.eVar7 = dbs.employee_range	||defaultVal;	
		s.eVar8 = dbs.ip 				||defaultVal;
		s.eVar9 = dbs.demandbase_sid	||defaultVal;
		s.zip   = dbs.zip 				||dbs.registry_zip	||'No Zip';
		s.state = dbs.state 			||dbs.registry_state||'No State';
		
		if(dbs.company_name && typeof dbs.watch_list !== 'undefined') {
			var wl_def = "(Not in Watch List)";
			s.eVar12= dbs.watch_list.account_type||wl_def;
			s.eVar13= dbs.watch_list.buying_stage||wl_def;
			s.eVar14= dbs.watch_list.crm_system||wl_def;
			s.eVar15= dbs.watch_list.primary_product_family||wl_def;
			s.eVar16= dbs.watch_list.target_product_family||wl_def;
		}
	}; //end Integrate.setVars fcn
} // end s_doPlugins functions
s.doPlugins=s_doPlugins


/* PLUGIN MODULES */
/* Module: Integrate v2 (from Adobe)*/
s.m_Integrate_c="var m=s.m_i('Integrate');m.add=function(n,o){var m=this,p;if(!o)o='s_Integrate_'+n;if(!m.s.wd[o])m.s.wd[o]=new Object;m[n]=new Object;p=m[n];p._n=n;p._m=m;p._c=0;p._d=0;p.disable=0;p"
+".get=m.get;p.delay=m.delay;p.ready=m.ready;p.beacon=m.beacon;p.script=m.script;m.l[m.l.length]=n};m._g=function(t){var m=this,s=m.s,i,p,f=(t?'use':'set')+'Vars',tcf;for(i=0;i<m.l.length;i++){p=m[m."
+"l[i]];if(p&&!p.disable&&p[f]){if(s.apv>=5&&(!s.isopera||s.apv>=7)){tcf=new Function('s','p','f','var e;try{p[f](s,p)}catch(e){}');tcf(s,p,f)}else p[f](s,p)}}};m._t=function(){this._g(1)};m._fu=func"
+"tion(p,u){var m=this,s=m.s,v,x,y,z,tm=new Date;if(u.toLowerCase().substring(0,4) != 'http')u='http://'+u;if(s.ssl)u=s.rep(u,'http:','https:');p.RAND=Math&&Math.random?Math.floor(Math.random()*10000"
+"000000000):tm.getTime();p.RAND+=Math.floor(tm.getTime()/10800000)%10;x=0;while(x>=0){x=u.indexOf('[',x);if(x>=0){y=u.indexOf(']',x);if(y>x){z=u.substring(x+1,y);if(z.length>2&&z.substring(0,2)=='s."
+"'){v=s[z.substring(2)];if(!v)v=''}else{v=''+p[z];if(!(v==p[z]||parseFloat(v)==p[z]))z=0}if(z) {u=u.substring(0,x)+s.rep(escape(v),'+','%2B')+u.substring(y+1);x=y-(z.length-v.length+1)} else {x=y}}}"
+"}return u};m.get=function(u,v){var p=this,m=p._m;if(!p.disable){if(!v)v='s_'+m._in+'_Integrate_'+p._n+'_get_'+p._c;p._c++;p.VAR=v;p._d++;m.s.loadModule('Integrate:'+v,m._fu(p,u),0,1,p._n)}};m.delay"
+"=function(){var p=this;if(p._d<=0)p._d=1};m.ready=function(){var p=this,m=p._m;p._d=0;if(!p.disable)m.s.dlt()};m._d=function(){var m=this,i,p;for(i=0;i<m.l.length;i++){p=m[m.l[i]];if(p&&!p.disable&"
+"&p._d>0)return 1}return 0};m._x=function(d,n){var p=this[n],x;if(!p.disable){for(x in d)if(x&&(!Object||!Object.prototype||!Object.prototype[x]))p[x]=d[x];p._d--}};m.beacon=function(u){var p=this,m"
+"=p._m,s=m.s,imn='s_i_'+m._in+'_Integrate_'+p._n+'_'+p._c,im;if(!p.disable&&s.d.images&&s.apv>=3&&(!s.isopera||s.apv>=7)&&(s.ns6<0||s.apv>=6.1)){p._c++;im=s.wd[imn]=new Image;im.src=m._fu(p,u)}};m.s"
+"cript=function(u){var p=this,m=p._m;if(!p.disable)m.s.loadModule(0,m._fu(p,u),0,1)};m.l=new Array;if(m.onLoad)m.onLoad(s,m)";
s.m_i("Integrate");
/************* END PLUGINS SECTION **************/
//*** The rest of s_code.js (omitted) goes here.... ***//


