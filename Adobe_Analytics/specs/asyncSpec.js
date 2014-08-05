var stdName = 's_dmdbase',
    custName = 's_dmdbase_custom',
    downName = 's_dmdbase_downstream',
    readCookie = s_db.c_r,
    writeCookie = s_db.c_w,
    saveCxd = {}, saveCookie = '',
    expectedStd = '3415304:Demandbase Inc:Software & Technology:Software Applications:Small:$10M - $25:SMB:Software & Technology',
    expectedCust = 'San Francisco:CA:94105:US:true:false:[n/a]:[n/a]'
    expectedDown = 'false:false:7372:65:20000000:demandbase.com:[n/a]:Medium';
    //expectedCust = 'Demandbase Inc:Internal:[n/a]:true:false:false:false:[n/a]';

module('Initial State', {
    setup: function() {
        saveCxd = s.contextData;
        s.contextData = {};

        /*saveCookie = document.cookie;
        writeCookie(s, stdName, '');
        writeCookie(s, custName, '');
        writeCookie(s, downName, '');*/
    },
    teardown: function() {
        s.contextData = saveCxd;

    }
});

/*test('Cookie Check', 2, function(){
    deepEqual(readCookie(s, stdName), '', 'Standard cookie is empty');
    deepEqual(readCookie(s, custName), '', 'Custom cookie is empty');
});*/

test('contextData Check', 2, function(){
    deepEqual(s.contextData[stdName], undefined, 'Standard attrs not set in contextData');
    deepEqual(s.contextData[custName], undefined, 'Custom attrs not set in contextData');
});

test('DB API tag', 1, function(){
    notDeepEqual(document.getElementById('db_ip_api_aadc'), null, 'IP api tag added');
});

module('Track', {
    setup: function() {
    },
    teardown: function() {
    }
});

test('contextData set', 3, function(){
    deepEqual(s.contextData[stdName], expectedStd, 'standard attributes set in contextData');
    deepEqual(s.contextData[custName], expectedCust, 'custom attributes set in contextData');
    deepEqual(s.contextData[downName], expectedDown, 'downstream attributes set in contextData');
});

test('cookies set', 3, function(){
    deepEqual(readCookie(s, stdName), expectedStd, 'standard attributes set in cookie');
    deepEqual(readCookie(s, custName), expectedCust, 'custom attributes set in cookie');
    deepEqual(readCookie(s, downName), expectedDown, 'downstream attributes set in cookie');
});