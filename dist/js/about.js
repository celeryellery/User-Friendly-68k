window.onload = function() {
	document.getElementById("logoutBtn").onclick = logout;
	if (!isLoggedIn()) {
		setupGuestCase();
	}
}

function isLoggedIn()
{
	var user = app.sessionDatabase.read();
	console.log(user);
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

//Changes the html to display a different page for users who are not logged in
function setupGuestCase() {
	var btn = document.getElementById("logoutBtn");
	btn.innerHTML = "Log in to access extra features";

	var profile = document.getElementById("profileItem");
	profile.innerHTML = "";
	var a = document.createElement("a");
	a.innerHTML = "Profile"
	a.setAttribute("href", "#");
	profile.appendChild(a);
	profile.setAttribute("class", "disabled");
}