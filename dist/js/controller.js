window.onload = function() {
	$("#searchBar").keypress(function(e) {
	    if(e.which == 13) {
	        app.search.searchBook();
	    }
	});
	$("#myModal").keypress(function(e) {
	    if(e.which == 13) {
	        submit();
	    }
	});
	if (!isLoggedIn()) {
		setupGuestCase();
	}
	document.getElementById("submitBtn").onclick = submit;
	document.getElementById("closeConfirm").onclick = hideConfirm;
	document.getElementById("closeReject").onclick = hideReject;
	document.getElementById("searchBtn").onclick = app.search.searchBook;
	document.getElementById("isbn").onchange = queryOpenLibrary;
	document.getElementById("logoutBtn").onclick = logout;
}

console.log(app);

//After entering in book information, the book is submitted to the database
function submit() {
	var authorFullName = document.getElementById("authorFullName").value;
	var bookSubtitle = document.getElementById("bookSubtitle").value;
	var edition = document.getElementById("edition").value;
	var bookTitle = document.getElementById("bookTitle").value;
	var isbn = document.getElementById("isbn").value;
	var price = document.getElementById("price").value;
	var condition = document.getElementById("selectCondition").value;
	var priceInt = parseFloat(price);
	var book = app.schema.book();
	book.authorFullName = authorFullName;
	book.subTitle = bookSubtitle;
	book.edition = edition;
	book.title = bookTitle;
	book.ISBN = isbn;
	book.price = price;
	book.condition = condition;
	// find out who is currently logged in and add that user's
	// email to the book object before adding it to the database
	var currentUser = app.sessionDatabase.read();
	book.seller = currentUser.email;
	
	if (bookTitle == "" || authorFullName == "" || price == "" || edition == "") {
		alert("Please fill in all of the required fields.");
		return;
	}
	if (priceInt < 0.0) {
		alert("Please use a  non-negative price");
		return;
	}
	clearAllFormData();
	$('#myModal').modal('hide');
	if (isSupported()) {
		var db = app.database.read();
		db.push(book);
		app.database.write(db);
		$('#confirm').show();
	} else {
		$('#rejected').show();
	}
}

function hideConfirm() {
	$('#confirm').hide();	
}

function hideReject() {
	$('#rejected').hide();	
}

function isSupported() {
  return app.database.supported();
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

// Determine whether user made an error typing in ISBN
function validateIsbn(isbn)
{
	// Note: Validation algorithm from http://en.wikipedia.org/wiki/International_Standard_Book_Number
	// ISBN 10
	if (isbn.length === 10 )
	{
		var sumOfProducts10 = 0;
		for (var i = 10; i > 0; i--)
		{
			sumOfProducts10 += isbn[10-i]*i;
		}
		return ((sumOfProducts10%11)===0);
	}
	// ISBN 13
	else if (isbn.length === 13)
	{
		var sumOfProducts13 = 0;
		var multiplier = 1;
		for (var i = 13; i > 0; i--)
		{
			multiplier = 1;
			if (i%2 === 0)
			{
				multiplier = 3;
			}
			sumOfProducts13 += isbn[13-i]*multiplier;
		}
		return ((sumOfProducts13%10)===0);
	}
	else
	{
		return false;
	}
}

function fillOutForm(book)
{
	// clear the form of previous information before auto-filling
	clearFormData();
	// title
	if (book.title && book.title.length)
	{
		document.getElementById("bookTitle").value = book.title;
	}
	// subtitle
	if (book.subtitle && book.subtitle.length)
	{
		document.getElementById("bookSubtitle").value = book.subtitle;
	}
	// Author full name
	if (book.authorFullName && book.authorFullName.length)
	{
		document.getElementById("authorFullName").value = book.authorFullName;
	}
	// Edition
	if (book.edition && book.edition.length)
	{
		document.getElementById("edition").value = book.edition;
	}
}

// clears data fields that will be replaced with openlibrary.org data,
// isbn and price are not cleared
function clearFormData()
{
	document.getElementById("bookTitle").value = "";
	document.getElementById("bookSubtitle").value = "";
	document.getElementById("authorFullName").value = "";
	document.getElementById("edition").value = "";
}

function clearAllFormData()
{
	document.getElementById("isbn").value = "";
	document.getElementById("bookTitle").value = "";
	document.getElementById("bookSubtitle").value = "";
	document.getElementById("authorFullName").value = "";
	document.getElementById("edition").value = "";
	document.getElementById("price").value = "";
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
	var addbtn = document.getElementById("addBtn");
	addbtn.setAttribute("disabled", "disabled");

	var profile = document.getElementById("profileItem");
	profile.innerHTML = "";
	var a = document.createElement("a");
	a.innerHTML = "Profile"
	a.setAttribute("href", "#");
	profile.appendChild(a);
	profile.setAttribute("class", "disabled");
}