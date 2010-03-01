var viewLogin = Titanium.UI.createView({
  width: 'auto',
  height:420,
  top: 180,
  visible:false,
  backgroundColor: '#fff'
});

//
//  Username textfield
//
var userNameInput = Titanium.UI.createTextField({
	value: usernameVal,
	hintText: 'Todoist username',
	height: 35,
	top: 20,
	width: 250,
	color: '#555555',
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

//
//  Password field
//
var passwordInput = Titanium.UI.createTextField({
	value: passwordVal,
	hintText: 'Todoist password',
	passwordMask: true,
	height:35,
	top: 60,
	width: 250,
	color: '#555555',
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

var test = new Date();



//
// Create login button
//
var btnSave = Titanium.UI.createButton({
	top:100,
	backgroundImage:'../save-button.png',
	width:145,
	height:53
});

// create table view event listener
btnSave.addEventListener('click', function(e)
{
	Titanium.App.fireEvent('show_indicator', {message: 'Logging you in...', time: 3});

	Ti.API.info("Start login action");
	
	var valUsername = userNameInput.value;
	var valPassword = passwordInput.value;
	
	Ti.API.info('username is: '+valUsername);
	Ti.API.info('pw is: '+valPassword);

	var xhr = Titanium.Network.createHTTPClient();
	
	xhr.onload = function()
	{		
		var json = eval( '('+this.responseText+')');
		
		Ti.API.info( 'resonponse is: '+this.responseText);
		
		Ti.API.info('token is: '+json.api_token);
		
		if( typeof(json.api_token) !== "undefined")
		{
			Titanium.App.Properties.setString('un', valUsername);
			Titanium.App.Properties.setString('pw', valPassword);
	
			Titanium.App.Properties.setString('api_token', json.api_token);

			Titanium.App.fireEvent('hide_indicator');
			Titanium.App.fireEvent('show_notification', {message: 'Login succesful', time: 3});
			
			// Set the status indicator
			lblStatus.text = "Your account has been verified";
			
			// Open the app after 3 seconds
			Titanium.App.fireEvent('start_app');


		}else{
			Titanium.App.fireEvent('hide_indicator');
			Titanium.App.fireEvent('show_notification', {message: 'Login failed', time: 3});
		}
		
	};
	
	// open the client
	xhr.open('GET','https://todoist.com/API/login/?email='+valUsername+'&password='+valPassword);

	// send the data
	xhr.send();
});

// Push elements onto the window
viewLogin.add(userNameInput);
viewLogin.add(passwordInput);
viewLogin.add(btnSave);

