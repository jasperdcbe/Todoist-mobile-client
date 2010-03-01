var win = Titanium.UI.currentWindow;

Ti.include("../app/form_login.js");

// Fetch some basic settings
var usernameVal = Titanium.App.Properties.getString("un");
var passwordVal = Titanium.App.Properties.getString("pw");
var api_tokenVal = Titanium.App.Properties.getString("api_token");

//
//  Create the header label
//

var imgLogo = Ti.UI.createImageView({
	url:'../logo.png',
	top: 35,
	height: 55,
	width: 165
});

var lblWelcome = Ti.UI.createLabel({
  text: 'Welcome!',
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
  top:125
});

var lblStatus = Ti.UI.createLabel({
  text: 'Please enter your credentials',
  textAlign:'center',
  font:{
    fontSize:18,
    fontFamily:'Trebuchet MS',
    fontWeight:'bold',
    fontStyle:'italic'
  },
  height:'auto',
  width:'auto',
  color:'#555555',
  top:160
});


viewLogin.visible = true;

win.add(imgLogo);
win.add(lblWelcome);
win.add(lblStatus);

win.add(viewLogin);


