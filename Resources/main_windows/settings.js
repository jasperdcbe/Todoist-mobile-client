var win = Titanium.UI.currentWindow;

// Fetch some basic settings
var usernameVal = Titanium.App.Properties.getString("un");
var passwordVal = Titanium.App.Properties.getString("pw");
var api_tokenVal = Titanium.App.Properties.getString("api_token");

//
//  Create the header label
//
var lblTitle = Ti.UI.createLabel({
  text: 'Todoist Credentials:',
  textAlign:'center',
  font:{
    fontSize:24,
    fontFamily:'Trebuchet MS',
    fontWeight:'bold',
    fontStyle:'italic'
  },
  height:'auto',
  width:'auto',
  color:'#555555',
  top:60
});

//
//  Username textfield
//
var userNameInput = Titanium.UI.createTextField({
	value: usernameVal,
	hintText: 'Todoist username',
	height: 35,
	top: 95,
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
	top: 135,
	width: 250,
	color: '#555555',
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

//
// Create login button
//
var btnSave = Titanium.UI.createButton({
	top:180,
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

		}else{
			// woeps, login failed
			Titanium.App.fireEvent('hide_indicator');
			Titanium.App.fireEvent('show_notification', {message: 'Login failed', time: 3});
		}
		
	};
	
	// open the client
	xhr.open('GET','https://todoist.com/API/login/?email='+valUsername+'&password='+valPassword);

	// send the data
	xhr.send();
});

var lblStatus = Titanium.UI.createLabel({
	color: '#555555',
	font: { fontSize: 14 },
	text: "",
	top: 240,
	height: 'auto',
	width: 'auto',
	textAlign: 'center'
})


// Add a reset button
var btnReset = Titanium.UI.createButton({
	title: "Clear credentials",
	bottom: 60,
	height: 30,
	width: 160,
	color: '#555555'
});

btnReset.addEventListener('click', function(e)
{
	Titanium.App.fireEvent('show_notification', {message: 'Reset done', time: 3});
	
	// Reset the form
	userNameInput.value = "";
	passwordInput.value = "";
	lblStatus.text = "Please fill in the form";

	// Reset property strings
	Titanium.App.Properties.setString('un', "");
	Titanium.App.Properties.setString('pw', "");
	Titanium.App.Properties.setString('api_token', "");
	
	// Close the app after resetting everything
	Titanium.App.fireEvent('stop_app');

});

// Push elements onto the window
win.add(lblTitle);

win.add(userNameInput);
win.add(passwordInput);

win.add(btnSave);

win.add(lblStatus);

win.add(btnReset);


