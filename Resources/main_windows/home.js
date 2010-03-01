// Get some important variables
var win = Titanium.UI.currentWindow;	
var api_token = Titanium.App.Properties.getString('api_token');

Ti.include("../app/functions.js");

//
// Is the API token set?
//
if(api_token != "")
{
    // Create a tableview without any data
    var data = [];
    tableView = Titanium.UI.createTableView({ data:data });

    /**
     * Add event listener
     */
    tableView.addEventListener('singletap', function(e)
    {    
    	// Only trigger if the row is not a header	
    	if(e.rowData.isHeader != true)
    	{
    	
    		if( (e.direction == "left") || (e.direction == "right") )
    		{
    	    	Titanium.App.fireEvent('show_notification', {message: 'entering edit after swipe', time: 2});
    	    }
    	    
    	    
    	}
    	
    });
    win.add(tableView);
    
    fetchItems();


    function toggleEditMode()
    {	
    	Ti.API.info("toggle edit mode");
    }
    
    
    /**
     * Create the options and add button
     */
	var buttonObjects = [
		//{image:'../images/order.png', width:35},
    	{title: 'Refresh', width:50},    
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
			fetchItems();
    		break;
    	
    		case 1:
    		Ti.UI.createAlertDialog({title:'Add todo item here', message:'ADD'}).show();
    		break;
    	}
    
    });

    win.setRightNavButton( bRightNav );

// Show a message so the user knows that he has to login	
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
// Fetch items function gets all overdue and today's projects
//
function fetchItems() {
	// First make sure the indicator is shown
	Titanium.App.fireEvent('show_indicator', {message: 'Loading items', time: 10});

	var xhr = Titanium.Network.createHTTPClient();
	
	xhr.onload = function()
	{
		var items = eval( '('+this.responseText+')');
		var marginLeft = 35;
		var data = [];
				
		var itemsToday = items[0]['data'];
		var itemsOverdue = items[1]['data'];
		
		var itemsTodayCount = items[0]['data'].length;
		var itemsOverdueCount = items[1]['data'].length;

		
		Ti.API.info('Overdue count: ' + itemsTodayCount);
		Ti.API.info('Today count: ' + itemsOverdueCount);

		/**
		 * Add today's items header
		 */
		var rowToday = Ti.UI.createTableViewRow();
		rowToday.backgroundColor = '#cccccc';
		rowToday.height = 30;
		rowToday.isHeader = true;
			
		var labelToday = Ti.UI.createLabel({
		    color: '#008000',
			font: {fontSize:16,fontWeight:'bold', fontFamily:'Helvetica Neue'},
			left: 15,
			top: 7,
			height: 'auto',
			width: 'auto',
		    text: "Today"
		});
		
		rowToday.add(labelToday);
		data.push(rowToday);
		
		//
		// Add no items row if none are available
		//
		if(itemsToday.length == 0)
		{
			var row = Ti.UI.createTableViewRow();
			row.height = 30;
			row.disabled = true;

			var itemContent = Ti.UI.createLabel({
				color:'#555',
				font:{fontSize:14, fontFamily:'Helvetica Neue'},
				left: marginLeft,
				top:7,
				height: 'auto',
				width: 'auto',
				text: 'No items'
			});

			row.add(itemContent);
		    data.push(row);
		}

		//
		// Add today's item rows
		//
    	for( var i=0; i < itemsToday.length; i++)
    	{	
    		var item = itemsToday[i];
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
		
		
		//
		// Add overdue items header
		//
		var rowOverdue = Ti.UI.createTableViewRow();
		rowOverdue.backgroundColor = '#cccccc';
		rowOverdue.height = 30;
		rowOverdue.isHeader = true;
			
		var labelOverdue = Ti.UI.createLabel({
		    color:'#AF0000',
			font:{fontSize:16,fontWeight:'bold', fontFamily:'Helvetica Neue'},
			left: 15,
			top:9,
			height:16,
			width:200,
		    text: "Overdue"
		});
		
		rowOverdue.add(labelOverdue);
		data.push(rowOverdue);

		//
		// Add overdue item rows
		//				
    	for( var i=0; i < itemsOverdue.length; i++)
    	{	
    		var item = itemsOverdue[i];	
			var row = Ti.UI.createTableViewRow();
			row.height = 43;

			var itemContent = Ti.UI.createLabel({
				color:'#555',
				font:{fontSize:16,fontWeight:'bold', fontFamily:'Helvetica Neue', textDecoration: 'line-through' },
				left: marginLeft,
				top:7,
				height:16,
				width:230,
				text: item.content
			});

			var projectDue = Ti.UI.createLabel({
				color:'#555',
				font:{fontSize:12, fontFamily:'Helvetica Neue'},
				left: marginLeft,
				top:24,
				height:16,
				width:200,
				text: returnNiceDate(item.due_date)
			});
			
			row.add(itemContent);
			row.add(projectDue);

		    data.push(row);
		}
		
		tableView.setData(data);
		
		Titanium.App.fireEvent('hide_indicator');

	};
	
	xhr.onerror = function()
	{
		Ti.App.fireEvent('hide_indicator');
		Titanium.App.fireEvent('show_notification', {message: 'Unable to complete query', time: 3});

	}
	
	var today = new Date();
	var month = today.getMonth()+1;
	var qry = today.getFullYear()+"-"+month+"-"+today.getDate()+"T23:59";

	// query the todoist api
	xhr.open('GET','http://todoist.com/API/query?queries=["'+qry+'", "overdue"]&token='+api_token+'&js_date=true');

	// send the data
	xhr.send();
}


