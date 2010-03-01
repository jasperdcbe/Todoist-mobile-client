//  Create default loading indicator
var indWin = null;
var actInd = null;
var indicatorActive = false;

function showNotification( message, time)
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
	
	// message
	var message = Titanium.UI.createLabel({
		text: message,
		color:'#fff',
		font: {fontSize:14},
		top: 10,
		width: 'auto',
		height: 'auto',
		textAlign: 'center'
	});
	indWin.add(message);
	indWin.open();
	actInd.show();
	
	// Automagically hide it after X seconds
	setTimeout( function() { hideNotification() }, time);
};

function hideNotification()
{
	actInd.hide();
	indWin.close({opacity:0,duration:1000});
};

//
// Add global event handlers to hide/show custom indicator
//
Titanium.App.addEventListener('show_notification', function(e)
{
	// Hide the indicator if it's still active
	if(indicatorActive == true)
	{
		hideNotification();
	}
	
	Ti.API.info("Show notification with msg: \""+e.message+ "\" for: "+e.time+" seconds");
	showNotification(e.message, e.time);
		
	indicatorActive = true;	
});

Titanium.App.addEventListener('hide_notification', function(e)
{
	Ti.API.info("Hide notification");
	showNotification();
	
	indicatorActive = false;

});