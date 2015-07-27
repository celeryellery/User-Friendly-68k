//
// sessionDatabase.js
//
app.sessionDatabase = function()
{
	var key = "CurrentUser";
	
	// public methods
    function supported()
	{
		// check to make sure that session storage is support by the browser
		var t = 'test';
		try 
		{
			sessionStorage.setItem(t,t);
			sessionStorage.removeItem(t);
			return true;
		} catch(e) 
		{
			return false;
		}
	}
	
	// returns the database object from session storage which is
	// an array of user and book objects
	function read()
	{
		try 
		{
			var json = sessionStorage.getItem(key) //retrieve database from session storage in json format
			json = JSON.parse(json);             //parse json into a javascript object
			if (json === null)                   //if database is null
				json = [];                       //create an empty database
			return json;
		} catch(e) 
		{
			return null;
		}
	}
	
	// writes the database object to session storage
	function write(obj)
	{
		try 
		{
			sessionStorage.setItem(key, JSON.stringify(obj));
			return true;
		} catch(e) 
		{
			return false;
		}
	}
	
		
	// deletes the entire database object in session storage
	function remove()
	{
		try 
		{
			sessionStorage.removeItem(key);
			return true;
		} catch(e) 
		{
			return false;
		}
	}
	
	// public API
	return {read: read,
			write: write,
			remove: remove,
			supported: supported}
}();