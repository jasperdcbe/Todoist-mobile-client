// Check if the has already configured login credentials

/*
var usernameVal = Titanium.App.Properties.getString("un");
var passwordVal = Titanium.App.Properties.getString("pw");
var api_tokenVal = Titanium.App.Properties.getString("api_token");

var isLoggedIn = false;

Ti.API.info("username was: "+usernameVal);

// If username and pw are set, try to login
if( (usernameVal != "") && (passwordVal != "") )
{

	// Check if login credentials are correct
	var xhr = Titanium.Network.createHTTPClient();
	
	xhr.onload = function()
	{		
		var json = eval( '('+this.responseText+')');

		// Login was succesful
		if( typeof(json.api_token) !== "undefined")
		{
			Titanium.App.Properties.setString('api_token', json.api_token);

			// Set the logged in credential
			isLoggedIn = true;
			
		// Show error message for incorrect login credentials
		}else{
			Titanium.App.fireEvent('hide_indicator');
			Titanium.App.fireEvent('show_notification', {message: 'Login failed', time: 3});
		}
		
	};
	
	// open the client
	xhr.open('GET','https://todoist.com/API/login/?email='+usernameVal+'&password='+passwordVal);

	// send the data
	xhr.send();

}
*/
