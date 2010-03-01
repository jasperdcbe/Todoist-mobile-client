
function saveData( dataType, objectData)
{
	var api_token = Titanium.App.Properties.getString('api_token');
	var baseUrl = "http://todoist.com/API/";

	// Show the standard indicator
	Titanium.App.fireEvent('show_indicator', {message: 'Saving', time: 5});

	// Save a project
	if(dataType == "add_project")
	{

	
	// Save an item	
	}else if(dataType == "edit_project")
	{
	
		// Get project information 
		var project_id = objectData.project_id;
		var project_name = objectData.project_name;
		var project_color = objectData.project_color;
		
		// Create the call url
		var requestParams = "updateProject/?project_id="+project_id+"&name="+project_name;
	
	}else if(dataType == "add_item")
	{
		Ti.API.info("adding item");
	
		// Get project information 
		var project_id = objectData.project_id;
		var content = objectData.content;
		var date_string = objectData.date_string;
		var priority = objectData.priority;

		// Create the call url
		var requestParams = "addItem/?project_id="+project_id+"&content="+content+"&date_string="+date_string+"&priority="+priority;
	
	}else if(dataType == "edit_item")
	{

	
	}
	
	

	var xhr = Titanium.Network.createHTTPClient();
	
	xhr.onload = function()
	{		
		Titanium.App.fireEvent('hide_indicator', {});

		if(this.responseText !== '"ERROR_PROJECT_NOT_FOUND"')
		{
			// Show success message and refresh the project list
			Titanium.App.fireEvent('show_notification', {message: 'Data saved', time: 3});
			
			switch(dataType)
			{
				case "add_project":	
				case "edit_project":			
					Titanium.App.fireEvent('fetch_projects', { });
				break;

				case "add_item":
				case "edit_item":
					Titanium.App.fireEvent('fetch_items', { });
				break;
			}
			
		}else{
			Titanium.App.fireEvent('show_notification', {message: 'An error occured', time: 3});
		}
	};
	
	xhr.onerror = function(e)
	{
		Titanium.App.fireEvent('hide_indicator', {});
		Titanium.App.fireEvent('show_notification', {message: 'An error occured', time: 3});
	};

	// Request url
	var requestUrl = baseUrl+requestParams+'&token='+api_token;
	
	// open the client
	xhr.open('GET', requestUrl);
	
	// send the data
	xhr.send();
};

//
// Add global event handler to save data
//
Titanium.App.addEventListener('save_data', function(e)
{	
	var dataType = e.dataType;
	var genData = e.data;	

	saveData(dataType, genData);
});

