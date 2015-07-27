//
// searchBook.js
//

//Search for books in the database given a search term 
app.search = function() 
{
	// public methods
	function searchBook()
	{
		// database will search for an exact match of term
		// in the title property of each stored book object
		var term = document.getElementById("searchBar").value;
		if (term == "") {
			alert("Please enter a search term");
			return;
		}
		var list = document.getElementById("list");
		list.innerHTML = "";
		
		// search the database and return a list of all
		// books that match the search criteria
		var books = searchDatabase(term, "title", "authorFullName");
		var user = app.sessionDatabase.read();
		
		// create and display list of search results
		for (var i = 0; i < books.length; i++) 
		{	
			//div container
			var a = document.createElement('a');
			a.setAttribute("id", "result")
			a.className = "list-group-item";
			a.setAttribute('href', "#");

			var h3 = document.createElement("h3");
			h3.className = "list-group-item-heading";
			h3.innerHTML = books[i].title;
			h3.style.fontWeight = "bold";
			h3.style.color = "#005263";

			var h4 = document.createElement("h4");
			h4.className = "list-group-item-heading";
			h4.innerHTML = "By " + books[i].authorFullName;
			h4.style.color = "#005263";
			
			var pEdition = document.createElement("p");
			pEdition.className = "list-group-item-text";
			pEdition.innerHTML = "Edition: " + books[i].edition;		
			pEdition.style.color = "#005263";
			
			var pPrice = document.createElement("p");
			// pPrice.setAttribute('align', 'right');
			pPrice.className = "list-group-item-text";
			pPrice.innerHTML = "$" + books[i].price;
			pPrice.style.color = "#005263";
		   
			//sec container
			var bCon = document.createElement("p");
			// bCon.setAttribute('align', 'right');
			bCon.className = "list-group-item-text";
			bCon.innerHTML = "Condition: " + books[i].condition;
			bCon.style.color = "#005263";
			
			// var aEmail = document.createElement('a');
			// aEmail.innerHTML = "Email the seller: " + books[i].seller;
			// aEmail.className = "list-group-item-text";
			// var email = "mailto:" + books[i].seller; //temp string 
			// aEmail.setAttribute('href', email);

			a.appendChild(h3);
			a.appendChild(h4);
			a.appendChild(pEdition);
			// div.appendChild(a);
			// div.appendChild(sec);
			
			a.appendChild(pPrice);
			a.appendChild(bCon);

			//If the user is not logged in, then a warning message is displayed that
			//does not allow the user to conact the seller
			if (user.LoggedIn === true) {
				var alink = document.createElement('a');
				alink.setAttribute("href", "mailto:" + books[i].seller);
				alink.innerHTML = "Email " + books[i].seller;
				var img = document.createElement('img');
				img.setAttribute("src", "dist/img/mail_thumbnail.png");
				img.setAttribute("width", "40");
				img.setAttribute("height", "35");
				alink.appendChild(img);
				a.appendChild(alink);
			} else {
				var warning = document.createElement('p');
				warning.innerHTML = "Please log in to contact the seller";
				warning.setAttribute('id', 'warning');
				a.appendChild(warning);
			}

			list.appendChild(a);
		}
		$('#bookModal').modal('show');
		document.getElementById("searchBar").value = "";
	}
	
	// internally search the database for a given "term"
	// and sees which objects have a designated property
	// with a value equal to the search term
	// i.e. searchDatabase("The Lord of the Rings", "title") (returns books)
	// or   searchDatabase("matt.stewart.us@gmail.com", "email") (returns users)
	function searchDatabase(term, property, property2)
	{
		var db = app.database.read();
		var searchItems = []; //array of items that match search criteria
		for(var i = 0; i < db.length; i++)
		{
			// if the object has the specified property,
			// check if the property has the desired value
			// if the object is what was being searched for, add it to the list of search items
			if (db[i].hasOwnProperty(property) && db[i][property].toLowerCase().indexOf(term.toLowerCase()) != -1)
			{
				searchItems.push(db[i]);
			}
			else if (db[i].hasOwnProperty(property2) && db[i][property2].toLowerCase().indexOf(term.toLowerCase()) != -1)
			{
				searchItems.push(db[i]);
			}
		}
		return searchItems;
	}
	
	// changes the email of a user to the new email given to the function
	function changeUserEmail(email, newEmail)
	{
		var db = app.database.read();
		for (var i = 0; i < db.length; i++)
		{
			// found user with specified email
			if (db[i].hasOwnProperty("email") && db[i].email.toLowerCase().indexOf(email.toLowerCase()) != -1)
			{
				db[i].email = newEmail;
				// change the seller of all books posted by the user to reflect the new email
				for (var j = 0; j < db.length; j++)
				{
					if (db[j].hasOwnProperty("seller") && db[j].seller.toLowerCase().indexOf(email.toLowerCase()) != -1)
					{
						db[j].seller = newEmail;
					}
				}
				app.database.write(db);
				return;
			}
		}
	}
	
	// changes the password of a user to newPassword
	function changeUserPassword(email, newPassword)
	{
		var db = app.database.read();
		for (var i = 0; i < db.length; i++)
		{
			// found user with specified email
			if (db[i].hasOwnProperty("email") && db[i].email.toLowerCase().indexOf(email.toLowerCase()) != -1)
			{
				// change password to new password
				db[i].password = newPassword;
				app.database.write(db);
				return;
			}
		}
	}
	
	// public api
	return {searchBook: searchBook,
			searchDatabase: searchDatabase,
			changeUserEmail: changeUserEmail,
			changeUserPassword: changeUserPassword};
}();