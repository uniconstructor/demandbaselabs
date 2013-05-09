/******* do Plugins *******/

/********* Start of Demandbase Plugin **********/

/*
Set demandbase values with window.dbr
The fields in dbr have the same varialbe names as the Demandbase IP API response
For a full list of fields, see: http://wiki.demandbaselabs.com/mwiki/index.php?title=Demandbase_API_Documentation#Sample_Responses

The plugin will flatten nested objects, so HQ and Account Watch fields can be accessed using the object name as a prefix.
For example:
s.eVar1 = dbs.watch_list_account_type	||defaultVal;
s.eVar2 = dbs.hq_company_name			||defaultVal;
s.eVar3 = dbs.worldhq_industry			||defaultVal;

Note: using  '||defaultVal' when assigning fields is required!!  
This ensures the evars are still assigned, even if the field is not in the returned data set.
*/

var dbs = (window.dbr)||{}, defaultVal="[EMPTY]";
s.eVar50 = dbs.company_name||defaultVal;
s.eVar49 = dbs.watch_list_account_status||defaultVal;
s.eVar48 = dbs.industry||defaultVal;
s.eVar47 = dbs.sub_industry||defaultVal;
s.eVar46 = dbs.employee_range||defaultVal;
s.eVar45 = dbs.revenue_range||defaultVal;
s.eVar44 = dbs.state||defaultVal;
s.eVar43 = dbs.country||defaultVal;
s.eVar42 = dbs.fortune_1000||defaultVal;
s.eVar41 = dbs.web_site||defaultVal;
s.eVar40 = dbs.demandbase_sid||defaultVal;
s.eVar39 = dbs.audience||defaultVal;
s.eVar38 = dbs.audience_segment||defaultVal;

/* Optional - Set sprops for each eVar 
   Note: be sure your s_code.js version supports this kind of assignment, otherwise, use the format:
   s.prop1 = dbs.company_name||defaultVal;
*/
if (s.eVar50) { s.prop50 = 'D=v50';}
if (s.eVar49) { s.prop49 = 'D=v49';}
if (s.eVar48) { s.prop48 = 'D=v48';}
if (s.eVar47) { s.prop47 = 'D=v47';}
if (s.eVar46) { s.prop46 = 'D=v46';}
if (s.eVar45) { s.prop45 = 'D=v45';}
if (s.eVar44) { s.prop44 = 'D=v44';}
if (s.eVar43) { s.prop43 = 'D=v43';}
if (s.eVar42) { s.prop42 = 'D=v42';}
if (s.eVar41) { s.prop41 = 'D=v41';}
if (s.eVar40) { s.prop40 = 'D=v40';}
if (s.eVar39) { s.prop39 = 'D=v39';}	
if (s.eVar38) { s.prop38 = 'D=v38';}

/* 	Alternatively, send all Demandbase fields to contextData
	With this method, fields are assigned to eVars and sprops using Processing Rules.
	This option requires a resource who is approved to write processing rules and 
	
	**Requires Site Catalyst version 15.3 or higher AND s_code.js version H23 or higher.

	for(var field in dbs) {
		s.contextData[field] = dbs[field]||'';
	}
*/	


/******* End of Demandbase Plugin *********/

/****** End of Plugins *********/