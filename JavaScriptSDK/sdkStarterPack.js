<script type="text/javascript">
    var __db = {};
    __db.key = 'YOUR_KEY_HERE';
    __db.conditions = [
         { name: 'Audience_SMB', attribute: 'audience', operator: '=', value: 'SMB' }
        ,{ name: 'Audience_MidMkt', attribute: 'audience', operator: '=', value: 'Mid-Market Business' }
        ,{ name: 'Audience_Ent', attribute: 'audience', operator: '=', value: 'Enterprise Business' }
        ,{ name: 'Audience_Edu', attribute: 'audience', operator: '=', value: 'Education' }
        ,{ name: 'Audience_Govt', attribute: 'audience', operator: '=', value: 'Government' }
    ];
    __db.segments = [
    ];
    __db.callback = function(company) {
        /**
          Content customization code goes here!
          Add any function calls or other code here to be run after the Demandbase Company Profile is available
          'company' argument is equivalent to Demandbase.Segments.CompanyProfile
        **/
    };

    (function() {
        var db = document.createElement('script'); db.type = 'text/javascript'; db.async = true;
        db.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'scripts.demandbase.com/demandbase-sdk.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(db, s);
    })();
</script>