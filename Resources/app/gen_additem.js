
/** 
 *	This file enables us to post stuff to twitter throug the application 
 */
 
function openAddItemWindow(type, data)
{
	Ti.API.info("add item window open it");

	var t = Titanium.UI.create2DMatrix();
	t = t.scale(0);

	var winEdit = Titanium.UI.createWindow({
		backgroundColor:'#ffffff',
		borderWidth: 2,
		borderColor: '#555',
		height: 220,
		width: 270,
		borderRadius: 10,
		opacity: 1,
		transform: t
	});
	
	// create first transform to go beyond normal size
	var t1 = Titanium.UI.create2DMatrix();
	t1 = t1.scale(1.1);
	var a = Titanium.UI.createAnimation();
	a.transform = t1;
	a.duration = 200;
	
	// when this animation completes, scale to normal size
	a.addEventListener('complete', function()
	{
		var t2 = Titanium.UI.create2DMatrix();
		t2 = t2.scale(1.0);
		w.animate({transform:t2, duration:200});
	});
	
	// Create a window title
	var lblTitle = Titanium.UI.createLabel({
		text: 'Add a new item',
		height: 'auto',
		top: 20,
		left: 20,
		width: 'auto',
		color: '#555',
		font: {fontSize: 16, fontFamily: 'Helvetica Neue'}
	});
	
	// Create input field 
	var txtContent = Titanium.UI.createTextField({
		hintText: 'description',
		height:35,
		top:55,
		left:20,
		right: 20,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		color: '#555',
		font: {fontSize: 14, fontFamily: 'Helvetica Neue'}
	});
	
	// Create a window title
	var lblWhen = Titanium.UI.createLabel({
		text: 'When?',
		height: 'auto',
		top: 100,
		left: 20,
		width: 'auto',
		color: '#555',
		font: {fontSize: 16, fontFamily: 'Helvetica Neue'}
	});
	
	// Create input field 
	var txtWhen = Titanium.UI.createTextField({
		hintText: 'today, tomorrow, wednesday',
		height:35,
		top:125,
		left:20,
		right: 20,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		color: '#555',
		font: {fontSize: 14, fontFamily: 'Helvetica Neue', fontWeight: 'bold'}
	});

	// Create the submit button
	var btnSubmit = Titanium.UI.createButton({
		title:'Save',
		height:26,
		width:100,
		bottom: 15,
		color: '#555',
		font: {fontSize: 14, fontFamily: 'Helvetica Neue', fontWeight: 'bold'}
	});
	
	btnSubmit.addEventListener('click', function()
	{
		// Get the values from the input fields
		var valProjectId = data.project_id;
		var valItemContent = txtContent.value;
		var valItemWhen = txtWhen.value;
		var valItemPriority = "1";

		var itemData = { project_id: valProjectId, content: valItemContent, date_string: valItemWhen, priority: valItemPriority };
		
		Titanium.App.fireEvent('save_data', { dataType: 'add_item', data: itemData });
	
		var t3 = Titanium.UI.create2DMatrix();
		t3 = t3.scale(0);
		winEdit.close({transform:t3,duration:300});
	});

	// create a button to close window
	var btnCancel = Titanium.UI.createButton({
		title:'X',
		height: 20,
		width: 40,
		top: 20,
		right: 20,
		color: '#555'
	});

	btnCancel.addEventListener('click', function()
	{
		var t3 = Titanium.UI.create2DMatrix();
		t3 = t3.scale(0);
		winEdit.close({transform:t3,duration:300});
	});
	
	// Add all elements to the window
	winEdit.add(btnCancel);
	
	winEdit.add(lblTitle);
	winEdit.add(txtContent);	
	
	winEdit.add(lblWhen);
	winEdit.add(txtWhen);
	
	winEdit.add(btnSubmit);
	
	winEdit.open(a);

}

//
// Add global event handlers to hide/show custom indicator
//
Titanium.App.addEventListener('add_item', function(e)
{
	
	var data = e.data;
	openAddItemWindow('item', data);
});
