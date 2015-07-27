window.onload = function() {
	document.getElementById("logoutBtn").onclick = logout;
	document.getElementById("submit").onclick = submit; 
	document.getElementById("closeSubmit").onclick = closeSubmit;
	document.getElementById("closeNoSubmit").onclick = closeNoSubmit;

	var email = document.getElementById("emailField");
	var user = app.sessionDatabase.read();
	console.log(user.email);
	email.value = user.email;
	spamChecker();
	if (!isLoggedIn()) {
		setupGuestCase();
	}
}

var spamValue1 = Math.round(Math.random() * 10); 
var spamValue2 = Math.round(Math.random() * 10); 

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

function spamChecker()
{


var spamAnswer = spamValue1 + spamValue2; 

var label = document.getElementById("spamChecker"); 

label.innerHTML = "What is " + spamValue1 + " + " + spamValue2 + "? (Prove you're a human)"; 

}

function submit() 
{

	var answer = document.getElementById("InputReal").value; 
	if (answer == (spamValue1 + spamValue2))
	{
		 $('#yesSubmit').show();
	}
	else
	{
		$('#noSubmit').show();
	}

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

	var submit = document.getElementById("submit");
	submit.setAttribute("disabled", "disabled");
}

function closeSubmit() {
	$('#yesSubmit').hide();
}

function closeNoSubmit() {
	$('#noSubmit').hide();
}