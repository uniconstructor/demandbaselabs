<script type="text/javascript">
    var __db = {};
    __db.key = 'YOUR_KEY_HERE';
    __db.conditions = [
         { name: 'Audience_SMB', attribute: 'audience', operator: '=', value: 'SMB' }
        ,{ name: 'Audience_MidMkt', attribute: 'audience', operator: '=', value: 'Mid-Market Business' }
        ,{ name: 'Audience_Ent', attribute: 'audience', operator: '=', value: 'Enterprise Business' }
        ,{ name: 'Audience_Edu', attribute: 'audience', operator: '=', value: 'Education' }
        ,{ name: 'Audience_Govt', attribute: 'audience', operator: '=', value: 'Government' }
        ,{ name: 'Fortune1000', attribute: 'fortune_1000', operator: '=', value: true }
        ,{ name: 'Forbes2000', attribute: 'forbes_2000', operator: '=', value: true }
    ];
    __db.segments = [];
    __db.callback = function(company) {
        /**
          Content customization code goes here!
          Add any function calls or other code here to be run after the Demandbase Company Profile is available
          'company' argument is equivalent to Demandbase.Segments.CompanyProfile
        **/

        //Add Customizations in each section below
        if(Demandbase.Segments.Audience_SMB) {
            //Small business
        } else if(Demandbase.Segments.Audience_MidMkt) {
            //Mid-Market
        } else if(Demandbase.Segments.Audience_Ent) {
            //Enterprise
        } else if(Demandbase.Segments.Audience_Edu) {
            //Education
        } else if(Demandbase.Segments.Audience_Govt) {
            //Government
        } else {
            //Default
            //Demandbase Recommends - Always define default experience here...
        }

    };
    (function() {
        var db = document.createElement('script'); db.type = 'text/javascript'; db.async = true;
        db.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'scripts.demandbase.com/demandbase-sdk.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(db, s);
    })();
</script>