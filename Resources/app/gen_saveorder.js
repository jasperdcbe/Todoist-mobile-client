
function saveOrder( type, data)
{

	Ti.API.info("SAVE "+type+" DATA NOW");
	
	var xhr = Titanium.Network.createHTTPClient();
	
	xhr.onload = function()
	{
		Ti.API.info('JSON response is: ' + this.responseText);

		var items = eval( '('+this.responseText+')');

		Titanium.App.fireEvent('hide_indicator');

	};
	
	// open the client	
	xhr.open('GET','http://todoist.com/API/updateOrders?token='+api_token+'&project_id='+project_id);

	// send the data
	xhr.send();
	
	
	
	

};

//
// Add global event handler to save data
//
Titanium.App.addEventListener('save_order', function(e)
{
	var type = e.type;
	var data = e.data;	

	saveOrder(type, data);
});
