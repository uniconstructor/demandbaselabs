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
s.eVar15 = dbs.audience||defaultVal;
s.eVar16 = dbs.audience_segment||defaultVal;
s.eVar17 = dbs.industry||defaultVal;
s.eVar18 = dbs.sub_industry||defaultVal;
s.eVar19 = dbs.revenue_range||defaultVal;
s.eVar20 = dbs.company_name||defaultVal;
s.zip = dbs.zip||dbs.registry_zip_code||defaultVal;

/* Optional - Set sprops for each eVar 
   Note: be sure your s_code.js version supports this kind of assignment, otherwise, use the format:
   s.prop1 = dbs.company_name||defaultVal;
*/
if (s.eVar15) { s.prop15 = 'D=v15';}
if (s.eVar16) { s.prop16 = 'D=v16';}
if (s.eVar17) { s.prop17 = 'D=v17';}
if (s.eVar18) { s.prop18 = 'D=v18';}
if (s.eVar19) { s.prop19 = 'D=v19';}
if (s.eVar20) { s.prop20 = 'D=v20';}


/* 	Alternatively, send all Demandbase fields to contextData
	With this method, fields are assigned to eVars and sprops using Processing Rules.
	This option requires a resource who is approved to write processing rules and 
	
	**Requires Site Catalyst version 15.3 or higher AND s_code.js version H23 or higher.
*/
	for(var field in dbs) {
		s.contextData[field] = dbs[field]||'';
	}



/******* End of Demandbase Plugin *********/

/****** End of Plugins *********/