
// Include some important listeners
Ti.include("app/gen_activityind.js");
Ti.include("app/gen_logincheck.js");
Ti.include("app/gen_notification.js");

Titanium.UI.setBackgroundColor('#fff');

//
// create base UI tab and root window
//
var winHome = Titanium.UI.createWindow({  
    title:'Todo',
    backgroundColor:'#fff',
    url: 'main_windows/home.js',
    barColor: '#333333'
});
var tab1 = Titanium.UI.createTab({  
    icon:'images/todo.png',
    title:'Todo',
    window: winHome
});

//
// create controls tab and root window
//
var winProjects = Titanium.UI.createWindow({  
    title:'Projects',
    backgroundColor:'#fff',
    url: 'main_windows/projects.js',
    barColor: '#333333'
});
var tab2 = Titanium.UI.createTab({  
    icon:'images/projects.png',
    title:'Projects',
    window: winProjects
});

//
// create the settings window + tab
//
var winSettings = Titanium.UI.createWindow({  
    title:'Settings',
    backgroundColor:'#fff',
    url: 'main_windows/settings.js',
    barColor: '#333333'
});

var tab3 = Titanium.UI.createTab({  
    icon: 'images/settings.png',
    title: 'Settings',
    window: winSettings
});

// create tab group
var tabGroup = Titanium.UI.createTabGroup();
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  
tabGroup.addTab(tab3);  

//
// First we create some important action listeners
//
var usernameVal = Titanium.App.Properties.getString("un");
var passwordVal = Titanium.App.Properties.getString("pw");
var api_tokenVal = Titanium.App.Properties.getString("api_token");

var isLoggedIn = false;


// If all is good, the app can be started
Titanium.App.addEventListener('process_login', function(e)
{
	// Enter login mode
	if(isLoggedIn == false)
	{
		var winWelcome = Titanium.UI.createWindow({
		    url: 'main_windows/welcome.js'
		});
		winWelcome.open(winWelcome, { transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT });
	
	// Just open the application
	}else{
		tabGroup.open({
			transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
		});
	}
});

// If all is good, the app can be started
Titanium.App.addEventListener('start_app', function(e)
{
	setTimeout( function() {
		tabGroup.open({
			transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
		});
	}, 3000);
});

// Close the app after clearing login credentials
Titanium.App.addEventListener('stop_app', function(e)
{
	setTimeout( function() {
		tabGroup.close({
			transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
		});
		
		var winWelcome = Titanium.UI.createWindow({
		    url: 'main_windows/welcome.js'
		});
		winWelcome.open(winWelcome, { transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT });
	}, 1500);

});

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
		
		Titanium.App.fireEvent('process_login');
	};
	
	// open the client
	xhr.open('GET','https://todoist.com/API/login/?email='+usernameVal+'&password='+passwordVal);
	// send the data
	xhr.send();
	
}else{
	Titanium.App.fireEvent('process_login');
}



