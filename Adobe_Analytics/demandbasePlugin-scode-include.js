/* ******** Start of Demandbase Plugin *********
The following snippets are placed within the "s_doPlugins" function.

Set demandbase values with window.db_company
db_company is set by the Demandbase API in page-level code.  See demandbasePageExample.html

See: http://wiki.demandbaselabs.com/mwiki/index.php?title=Demandbase_API_Documentation#Sample_Responses
for variable names in the Demandbase IP API response and a full list of fields.

'||defaultVal' is reqd when assigning fields to make operations null safe.  This ensures the evars are always assigned.

********* Demandbase Plugin ******** */

var dbs = (window.db_company)||{}, defaultVal='(Non-Company Visitor)';
s.eVar1 = dbs.audience 		||defaultVal;
s.eVar2 = dbs.audience_segment	||defaultVal;
s.eVar3 = dbs.industry 		||defaultVal;
s.eVar4 = dbs.employee_range 	||defaultVal;
s.eVar5 = dbs.revenue_range 	||defaultVal;
s.eVar6 = dbs.company_name 	||defaultVal;

/* Optional - Assign special eVars for zip and state
	Note attempts to use public registry info if not available from company profile */
s.zip 	= dbs.zip 		||dbs.registry_zip_code ||'(No Zip Code)';
s.state = dbs.state		||dbs.registry_state	||'(No State)';

/* Account Watch Example */
if(typeof dbs.watch_list !== 'undefined') {
	s.eVar7 = dbs.watch_list.user_defined_var || defaultVal;
} else {
	s.eVar7 = 'Non-Account Watch Visitor'
}

/* HQ Hierarchy Example */
if(typeof dbs.worldhq !== 'undefined') {
	s.eVar8 = dbs.worhq.compy_name || defaultVal;
}

/* Optional - Set sprops (traffic variables), only if needed 
   Note: be sure your s_code.js version supports assignment shorthand, 
   otherwise, use the format: s.prop1 = dbs.company_name||defaultVal;  */
if (s.eVar1) { s.prop1 = 'D=v1'; }
if (s.eVar2) { s.prop2 = 'D=v2'; }
if (s.eVar3) { s.prop3 = 'D=v3'; }
if (s.eVar4) { s.prop4 = 'D=v4'; }
if (s.eVar5) { s.prop5 = 'D=v5'; }
if (s.eVar6) { s.prop6 = 'D=v6'; }


/* ***** 	Using Context Data    *****
Optional, send all Demandbase fields to contextData (instead of eVars)
This requires assigining eVars and sprops using Processing Rules.
!! Notice: Requires Site Catalyst version 15.3 or higher AND s_code.js version H23 or higher.
Requires Adobe approval to write processing rules.  */

for(var field in dbs) {
	s.contextData[field] = dbs[field]||'';
}

/******* End Demandbase Plugin *********/
