//  Create default loading indicator
var indWin = null;
var actInd = null;

function showIndicator( message, time)
{
	var message = message;
	var time = time*1000;

	// window container
	indWin = Titanium.UI.createWindow({
		height:40,
		width:250,
		bottom: 60
	});
	
	// black view
	var indView = Titanium.UI.createView({
		height:40,
		width:250,
		backgroundColor:'#000',
		borderRadius:10,
		opacity:0.8
	});
	indWin.add(indView);
	
	// loading indicator
	actInd = Titanium.UI.createActivityIndicator({
		style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
		height:15,
		width:15,
		left: 10
	});
	indWin.add(actInd);
	
	// message
	var message = Titanium.UI.createLabel({
		text: message,
		color:'#fff',
		font: {fontSize:14},
		top: 10,
		left: 40,
		width: 'auto',
		height: 'auto'
	});
	indWin.add(message);
	indWin.open();
	actInd.show();
	
	// Automagically hide it after X seconds
	setTimeout( function() { hideIndicator() }, time);
};

function hideIndicator()
{
	actInd.hide();
	indWin.close({opacity:0,duration:1000});
};

//
// Add global event handlers to hide/show custom indicator
//
Titanium.App.addEventListener('show_indicator', function(e)
{
	Ti.API.info("Show indicator with msg: \""+e.message+ "\" for: "+e.time+" seconds");
	showIndicator(e.message, e.time);
});

Titanium.App.addEventListener('hide_indicator', function(e)
{
	Ti.API.info("Hide indicator");
	hideIndicator();
});