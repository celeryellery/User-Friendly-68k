window.onload = function() {
	$(document).keypress(function(e) {
	    if(e.which == 13) {
	        createAccount();
	    }
	});
	document.getElementById("submitBtn").onclick = createAccount;
}

//Creates a new account and adds is to the database if the email is valid and passwords match
function createAccount() {
	var email = document.getElementById("emailField").value;
	var password = document.getElementById("passwordField").value;
	var check_pass = document.getElementById("passwordCheck").value;
	var validEmail = validateEmail(email);
	var validPass = passwordMatch(password, check_pass);
	if (!validEmail) {
		// $('#wrongFormat').show();
		alert("Please enter an email of the format example@uw.edu or example@uwb.edu");
		return;
	}
	if (password == "") {
		alert("Please enter a password of your choice");
		return;
	}
	if (!validPass) {
		alert("Please enter matching passwords");
		return;
	}
	if (app.database.supported() && validEmail && validPass) {
		var db = app.database.read();
		console.log("db!!!", db);
		if (!accountExists(db, email)) {
			console.log("We got here");
			var user = new app.schema.user(email, password);
			db.push(user);
			app.database.write(db);
			console.log("db", db);
			alert("Account for " + email + " created!");

			var user = {email: email, 
					password: password,
					LoggedIn: true}
			app.sessionDatabase.write(user);
			
			window.location = "MainPage.html";
		}
	}
}

//Checks if the account already exists
function accountExists(db, email) {
	for (var i = db.length - 1; i >= 0; i--) {
		if (db[i] == null) {
			return false;
		}
		if (db[i].email == email) {
			// $('#existsError').show();
			alert("Account already exists");
			return true;
		}
	}
	return false;
}

//Checks if the passwords match
function passwordMatch(password, check_pass) {
	return (password == check_pass);
}

//Checks if the email is in a valid format
function validateEmail(email){        
   	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}    