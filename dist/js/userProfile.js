window.onload = function() {
	var email = document.getElementById("emailField");
	var user = app.sessionDatabase.read();
	email.innerHTML += user.email;
	document.getElementById("logoutBtn").onclick = logout;
	document.getElementById("usernameSubmitBtn").onclick = submitUsername;
	document.getElementById("passwordSubmitBtn").onclick = submitPassword;
    //searchData();
}
//Matt's for tanner
function getbooks()
{
	var currentUser = app.sessionDatabase.read();
	var seller = currentUser.email;
	var books = app.search.searchDatabase(seller, "email", "");
}

function isLoggedIn()
{
	var user = app.sessionDatabase.read();
	return user.LoggedIn === true;
}

function logout() 
{
	// log the user out and create an empty user that is not logged in
	// as a default
	var user = {email: "",
				password: "",
				LoggedIn: false}
	app.sessionDatabase.write(user);
	window.location = "SignIn.html";
}

//Checks if the email is in a valid format
function validateEmail(email){        
   	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}    

//Checks if the account already exists
function accountExists(db, email) {
	for (var i = db.length - 1; i >= 0; i--) {
		if (db[i] == null) {
			return false;
		}
		if (db[i].email == email) {
			return true;
		}
	}
	return false;
}

//After entering in username change information, the new username is submitted to the database
function submitUsername() {
	var newUsername = document.getElementById("newUsername").value;
	var newUsernameConfirm = document.getElementById("newUsernameConfirm").value;
	var validUsername = validateEmail(newUsername);
	var db = app.database.read();

	// Format validation
	if (!validUsername) {
		alert("Please enter an email of the format example@uw.edu or example@uwb.edu");
		return;
	}
	
	// Checking that they entered the same username both times
	if (newUsername != newUsernameConfirm) {
		alert("Please make sure you typed the same username both times.");
		return;
	}
	
	// Checking that their new username doesn't belong to any other users
	if (accountExists(db, newUsername)) {
		alert("An acount with this username already exists. Please choose a different username.");
		return;
	}
	
	var currentUser = app.sessionDatabase.read();
	app.search.changeUserEmail(currentUser.email, newUsername); // change permanent user email in local storage
	currentUser.email = newUsername; 
	app.sessionDatabase.write(currentUser);        // change current user email in session storage
	
	document.getElementById("newUsername").value = "";
	document.getElementById("newUsernameConfirm").value = "";
	$('#usernameModal').modal('hide');
	
	//Refresh page to make new username appear in profile
	location.reload();
}

//After entering in password change information, the new password is submitted to the database
function submitPassword() {
	var currentUser = app.sessionDatabase.read();
	var db = app.database.read();
	var oldPassword = currentUser.password;
	var newPassword = document.getElementById("newPassword").value;
	var newPasswordConfirm = document.getElementById("newPasswordConfirm").value;
	
	// validation: check that the old password is correct
	if (document.getElementById("oldPassword").value != oldPassword){
		alert("Old password was entered incorrectly.");
		return;
	}

	// validation: check that the same password both times
	if (newPassword != newPasswordConfirm){
		alert("Please make sure you typed the same password both times.");
		return;
	}

	currentUser.password = newPassword;
	app.search.changeUserPassword(currentUser.email, newPassword); // change permanent user password in local storage
	app.sessionDatabase.write(currentUser);						   // change current user password in session storage
	
	document.getElementById("oldPassword").value = "";
	document.getElementById("newPassword").value = "";
	document.getElementById("newPasswordConfirm").value = "";
	$('#passwordModal').modal('hide');

}
/*
function searchData(){

var db = app.database.read();
var currentUser = app.sessionDatabase.read();
var book = searchDatabase(currentUser.email, "seller", "");
var table = document.createElement('table');

table.setAttribute("ID", "bookInfo" +i);
table.className = "user-listings";
var row = document.createElement('tr');
var rowData = document.createElement ('th');
rowdata.innerHTML = "Book Title"; 
}

for (var i = 0; i < books.length; i++) 
	{
        //container
        
        //div container
		var row = document.createElement('tr');
        
        
        
		var h3 = document.createElement("h3");
		h3.className = "list-group-item-heading";
		h3.innerHTML = books[i].title;
		h3.style.fontWeight = "bold";

		var h4 = document.createElement("h4");
		h4.className = "list-group-item-heading";
		h4.innerHTML = books[i].authorFullName;
        
		var pEdition = document.createElement("p");
		pEdition.className = "list-group-item-text";
		pEdition.innerHTML = "Edition " + books[i].edition;		
        
        var pPrice = document.createElement("h4");
        pPrice.setAttribute('align', 'right');
		pPrice.className = "list-group-item-text";
		pPrice.innerHTML = "$" + books[i].price;
       
        //sec container
        var bCon = document.createElement("p");
        bCon.setAttribute('align', 'right');
		bCon.className = "list-group-item-text";
		bCon.innerHTML = "Condition:" + books[i].condition;
        
        var aEmail = document.createElement('a');
         aEmail.setAttribute('align', 'right');
        
        aEmail.innerHTML = " Email Seller";
		aEmail.className = "list-group-item";
        var email = "mailto:" + books[i].seller; //temp string 
		aEmail.setAttribute('href', email);

		a.appendChild(h3);
		a.appendChild(h4);
		a.appendChild(pEdition);
        div.appendChild(a);
        div.appendChild(sec);
        
        sec.appendChild(pPrice);
        sec.appendChild(bCon);
        sec.appendChild(aEmail);
 
		list.appendChild(div);
	}
	*/

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
		if (db[i].hasOwnProperty(property) && db[i][property] != null && db[i][property].toLowerCase().indexOf(term.toLowerCase()) != -1)
		{
			searchItems.push(db[i]);
		}
		else if (db[i].hasOwnProperty(property2) && db[i][property2] != null && db[i][property2].toLowerCase().indexOf(term.toLowerCase()) != -1)
		{
			searchItems.push(db[i]);
		}
	}
	return searchItems;
}

function queryOpenLibrary()
{
	var isbn = document.getElementById("isbn").value;
	if (validateIsbn(isbn))
	{
		app.openLibrary.search(isbn, fillOutForm);
	}
	else
	{
		alert("Please check your ISBN format. Something's not right!");
	}
}

