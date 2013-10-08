demandbase = function(args) {
	for (var arg in args) {
		var cmd = args[arg];
		switch (cmd) {
			case 'set':
				//arg is name value pair or object
			case 'create':
				//spins up new connectors - getscript for addtl files
		
		//not sure what the gets will do
			case 'getAll':
			case 'getByName':
			default:

		}
	}
};

/***
Property ideas:			
	'client_id':
		//this value would set the key for the IP API
	'ga':
		//function to send key, fields object, and custom event object to GA connector
	'form_id':
		//function to set key, email id, company id, etc
	'content_id':