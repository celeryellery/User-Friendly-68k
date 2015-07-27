//
// database.js
//
var app = {};

app.database = function()
{
	var key = "Bookit";
	
	// public methods
    function supported()
	{
		// check to make sure that local storage is support by the browser
		var t = 'test';
		try 
		{
			localStorage.setItem(t,t);
			localStorage.removeItem(t);
			return true;
		} catch(e) 
		{
			return false;
		}
	}
	
	// returns the database object from local storage which is
	// an array of user and book objects
	function read()
	{
		try 
		{
			var json = localStorage.getItem(key) //retrieve database from local storage in json format
			json = JSON.parse(json);             //parse json into a javascript object
			if (json === null)                   //if database is null
				json = [];                       //create an empty database
			return json;
		} catch(e) 
		{
			return null;
		}
	}
	
	// writes the database object to local storage
	function write(obj)
	{
		try 
		{
			localStorage.setItem(key, JSON.stringify(obj));
			return true;
		} catch(e) 
		{
			return false;
		}
	}
	
	// deletes the entire database object in local storage
	function remove()
	{
		try 
		{
			localStorage.removeItem(key);
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

