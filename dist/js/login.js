window.onload = function() {
	$(document).keypress(function(e) {
	    if(e.which == 13) {
	        login();
	    }
	});
	document.getElementById("loginBtn").onclick = login;
	
	// add a user object to session storage to keep track of
	// who is currently logged in, who is logged out by default
	var user = {email: "",
				password: "",
				LoggedIn: false}
	app.sessionDatabase.write(user);
}

//Makes the proper checks to see if the textfields are filled in properly and if the account exists, then lets users
//access the homepage
function login() {
	var email = document.getElementById("inputEmail").value;
	var password = document.getElementById("inputPassword").value;
	var loginForm = document.getElementById("loginForm");
	if (email == "" || password == "") {
		alert("Please enter both an email and password");
		return;
	}
	if (!validateEmail(email)) {
		alert("Please enter an email of the format example@uw.edu or example@uwb.edu");
		return;
	}
	if (passwordMismatch(email, password)) {
		alert("The password that was entered is incorrect.");
		return;
	}
	if (!accountExists(email, password)) {
		alert("The email " + email + " does not have an existing account.");
	} else {
		window.location = "MainPage.html";
		
		// store the user's information in sessionStorage so we can
		// determine if someone is currently logged in, and have information
		// on the user that is currently logged in for creating a book post
		// with proper information about the seller
		var user = {email: email, 
					password: password,
					LoggedIn: true}
		app.sessionDatabase.write(user)
	}
}

//Checks if the email is in a valid format
function validateEmail(email){        
   	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

//Checks the database for if the account exists
function accountExists(email, password) {
	var db = app.database.read();
	console.log(db);
	for (var i = 0; i < db.length; i++) {
		if (db[i].email == email && db[i].password == password) {
			return true;
		}
	}
	return false;
}

function passwordMismatch(email, password) {
	var db = app.database.read();
	for (var i = 0; i < db.length; i++) {
		if (db[i].email == email && db[i].password != password) {
			return true;
		}
	}
	return false;
}