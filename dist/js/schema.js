//
// schema.js
//
app.schema = function()
{
	// public methods
	function user(email, password)
	{
		var obj =  {email: email,
					password: password};					
		return obj;
	}
	
	function book()
	{
		var obj =  {authorFullName: "",
					title: "",
					subTitle: "",
					edition: "",
					ISBN: "",
					price: "",
					seller: "",
					condition: ""};
		return obj;
/*
		//subject = []; // optional (from openlibrary)
		//table_of_contents = []; // optional (from openlibrary)
*/		
	}
	
	// public API
	return {user: user,
			book: book}
}();
