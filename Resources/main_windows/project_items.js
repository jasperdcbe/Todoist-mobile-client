
var win = Titanium.UI.currentWindow;		
var api_token = Titanium.App.Properties.getString('api_token');
var project_id = win.projectData.project_id;

Ti.include("../app/functions.js");
Ti.include("../app/gen_additem.js");

// Create a tableview without any data
var data = [];
tableView = Titanium.UI.createTableView({ data:data });

if(api_token != "")
{
	// Create a tableview
	var data = [];
	tableView = Titanium.UI.createTableView({ data: data });

	//
	//Add event listener
	//
	tableView.addEventListener('singletap', function(e)
	{
		Titanium.App.fireEvent('show_notification', {message: 'TODO', time: 3});
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

		var projectData = { project_id: projectId, project_name: projectName, project_color: projectColor };
		
		// Fire the edit project event
		Ti.App.fireEvent('edit_project', { type: 'editproject', data: projectData});
	});
	
	// Add the table to the view
	win.add(tableView);

	// Fetch all items from Todoist
	fetchItems();

}else{

	var label2 = Titanium.UI.createLabel({
		color:'#999',
		text:'Please login',
		height: 'auto',
		width: 'auto',
		textAlign: 'center',
		font:{fontSize:20,fontFamily:'Helvetica Neue'}
	});
	
	win.add(label2);
}

/**
 * Fetch items function gets all overdue and today's projects
 */

function fetchItems() {
	// First make sure the indicator is shown
	Titanium.App.fireEvent('show_indicator', {message: 'Loading items', time: 10});

	var xhr = Titanium.Network.createHTTPClient();
	
	xhr.onload = function()
	{
		var items = eval( '('+this.responseText+')');
		var marginLeft = 35;
		var data = [];

		/**
		 * Add item rows
		 */
    	for( var i=0; i < items.length; i++)
    	{	
    	
    		var item = items[i];
			var row = Ti.UI.createTableViewRow();
			row.height = 43;

			var itemContent = Ti.UI.createLabel({
				color:'#555',
				font:{fontSize:16,fontWeight:'bold', fontFamily:'Helvetica Neue'},
				left: marginLeft,
				top:7,
				height: 'auto',
				width: 'auto',
				text: item.content
			});

			var projectDue = Ti.UI.createLabel({
				color:'#555',
				font:{fontSize:12, fontFamily:'Helvetica Neue'},
				left: marginLeft,
				top:24,
				height: 'auto',
				width: 'auto',
				text: returnNiceDate(item.due_date)
			});
			
			row.add(itemContent);
			row.add(projectDue);

		    data.push(row);
		}
		
		tableView.setData(data);
		
		Titanium.App.fireEvent('hide_indicator');

	};
	
	// open the client	
	xhr.open('GET','http://todoist.com/API/getUncompletedItems?token='+api_token+'&project_id='+project_id+'&js_date=true');

	// send the data
	xhr.send();
}

// 
// Toggle move mode
//
function toggleMoveMode()
{
    Ti.API.info("Toggle move mode is now: "+tableView.moving);

    if(tableView.moving != true)
    {
    	tableView.moving = true;
    
    	// Add the cancel button to the nav bar
    	var btnDone = Titanium.UI.createButton({
    		title:'Done',
    		style:Titanium.UI.iPhone.SystemButtonStyle.DONE
    	});
    	
    	btnDone.addEventListener('click', function()
    	{
    		toggleMoveMode();
    	});
    	
    	win.setRightNavButton( btnDone );

    //
    // Save order and restore old nav buttons
    //
    }else{
    	tableView.moving = false;
    	win.setRightNavButton( bRightNav );
    	
    	Ti.API.info("order mode for #items: "+tableView.data);
    	
    	Ti.App.fireEvent('save_order', {});
    	Ti.App.fireEvent('show_indicator', {message: 'TODO: Saving new order', time: 3});
    }
}



/**
 * Create the options and add button
 */
var buttonObjects = [
    {title: 'Order', width:45},
    {title: 'Add', width:35}
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
		toggleMoveMode();
		break;
	
		case 1:
		
		
		
		var itemData = {project_id: project_id};
    	Ti.App.fireEvent('add_item', {type: 'item', data: itemData });
    	
    	
    	

		break;
	}

});

win.setRightNavButton( bRightNav );




