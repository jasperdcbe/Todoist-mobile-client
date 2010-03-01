// Get some important variables
var win = Titanium.UI.currentWindow;	
var api_token = Titanium.App.Properties.getString('api_token');


Ti.include("../app/functions.js");

// Include some required files
Ti.include("../app/gen_editproject.js");
Ti.include("../app/gen_savedata.js");

//
// Is the API token set?
//
if(api_token != "")
{
	//
	// Create a tableview
	//
	var data = [];
	tableView = Titanium.UI.createTableView({ data: data });
	
	//
	//Add event listener
	//
	tableView.addEventListener('singletap', function(e)
	{
		var projectId = e.rowData.projectId;
		var projectName = e.rowData.projectName;
		var projectChildren = e.rowData.projectChildren;
		var projectColor = e.rowData.projectColor;

		if(projectChildren > 0)
		{
			var winProjectItems = Titanium.UI.createWindow({
				title: projectName,
				url: '/main_windows/project_items.js',
				barColor: '#333333'
			});
			
			winProjectItems.projectData = { project_id: projectId };
			Titanium.UI.currentTab.open(winProjectItems, {animated:true});
		}
	});
	
	//
	// Add event listener for double tap (edit item)
	//
	tableView.addEventListener('doubletap', function(e)
	{
	
		var projectId = e.rowData.projectId;
		var projectName = e.rowData.projectName;
		var projectChildren = e.rowData.projectChildren;
		var projectColor = e.rowData.projectColor;
		
		//Ti.App.info("project id called is: "+projectId);

		var projectData = { project_id: projectId, project_name: projectName, project_color: projectColor };
		
		// Fire the edit project event
		Ti.App.fireEvent('edit_project', { dataType: 'editproject', data: projectData});
	});
	
	
	win.add(tableView);
	
	// Now fetch projects and add them to the tableview
	fetchProjects();
	
	//
	// Create the options and add button
	//
	var buttonObjects = [
		{image:'../images/refresh.png', width:35},
		{image:'../images/add.png', width:35}
	];

	var bRightNav = Titanium.UI.createButtonBar({
	    labels: buttonObjects,
	    backgroundColor:'#333333',
		style:Titanium.UI.iPhone.SystemButtonStyle.BAR
	});
	
	bRightNav.addEventListener('click', function(e)
	{
		switch(e.index)
		{
			case 0:
			fetchProjects();
			break;
		
			case 1:
			Titanium.UI.createAlertDialog({title:'Add todo item here', message:'ADD'}).show();
			break;
		}
	
	});
	
	win.setRightNavButton( bRightNav );
	
	// 
	// Toggle move mode
	//
	function toggleMoveMode()
	{
		Ti.API.info("Toggle move mode is now: "+tableView.moving);
	
		if(tableView.moving != true)
		{
			tableView.moving = true;
	
			win.setRightNavButton(cancel);
		
			// Add the cancel button to the nav bar
			var cancel = Titanium.UI.createButton({
				title:'Cancel',
				style:Titanium.UI.iPhone.SystemButtonStyle.DONE
			});
			
			cancel.addEventListener('click', function()
			{
				toggleMoveMode();
			});
			
			win.setRightNavButton( cancel );
	
		//
		// Save order and restore old nav buttons
		//
		}else{
			tableView.moving = false;
			
			win.setRightNavButton( bRightNav );
			
			Titanium.App.fireEvent('show_indicator', {message: 'Saving new order', time: 3});
	
		}
	}

	// 
	// Toggle move mode
	//
	function toggleEditMode()
	{
		Ti.API.info("Toggle edit mode");
	}

	
}else{

	var lblPleaseLogin = Titanium.UI.createLabel({
		color:'#999',
    	text:'Please enter your login credentials on the settings tab',
		height: 'auto',
		width: 'auto',
		left: 15,
		right: 15,
		textAlign: 'center',
		font:{fontSize:20,fontFamily:'Helvetica Neue'}
	});
	
	win.add(lblPleaseLogin);
}


//
// Fetch projects function
//
function fetchProjects() {

	var xhr = Titanium.Network.createHTTPClient();
	
	xhr.onload = function()
	{
		//
		// Show indicator
		//
		Titanium.App.fireEvent('hide_indicator', { });
		Titanium.App.fireEvent('show_indicator', {message: 'Loading projects', time: 5});
		
		var items = eval( '('+this.responseText+')');
		var indentSize = 15;
		var data = [];

    	for( var i=0; i < items.length; i++)
    	{	
    		var item = items[i];
    		var marginLeft = indentSize * (item.indent - 1);

			var row = Ti.UI.createTableViewRow();
			row.height = 40;
			row.projectId = item.id;
			row.projectName = item.name;
			row.projectChildren = item.cache_count;
			row.projectColor = item.color;

			if(item.cache_count != 0) {
				row.hasChild = true;
			}else{
				row.selectedBackgroundColor = "#ffffff";
			}
			
			var colorMarker = Ti.UI.createView({
			    backgroundColor: item.color,
			    top: 10,
				left: 17 + marginLeft,
			    width: 21,
			    height: 21
			});
			
			var projectName = Ti.UI.createLabel({
				color:'#555555',
				font:{fontSize:16,fontWeight:'bold', fontFamily:'Helvetica Neue'},
				left:46 + marginLeft,
				top: 12,
				height:16,
				width:200,
				text: item.name
			});
			
			var cacheCount = Ti.UI.createLabel({
				color: '#555555',
				font: {fontSize: 12, fontFamily:'Helvetica Neue'},
				left: 25 + marginLeft,
				top: 11,
				height: 20,
				width: 20,
				text: item.cache_count
			});
			
			row.add(colorMarker);
			row.add(projectName);
			row.add(cacheCount);

		    data.push(row);
		}


		tableView.setData(data);

		//
		// Hide indicator
		//
		Titanium.App.fireEvent('hide_indicator', { });


	};
	
	// open the client
	xhr.open('GET','https://todoist.com/API/getProjects/?token='+api_token);
	
	// send the data
	xhr.send();

}

