
/** 
 *	This file enables us to post stuff to twitter throug the application 
 */
 
function openEditWindow(type, data)
{

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
		text: 'Edit project',
		height: 'auto',
		top: 20,
		left: 20,
		width: 'auto',
		color: '#555',
		font: {fontSize: 16, fontFamily: 'Helvetica Neue', fontWeight: 'bold'}
	});
	
	// Create input field 
	var txtName = Titanium.UI.createTextField({
		value: data.project_name,
		hintText: 'Project name',
		height:35,
		top:65,
		left:20,
		right: 20,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		color: '#555',
		font: {fontSize: 14, fontFamily: 'Helvetica Neue', fontWeight: 'bold'}
	});
	
	// Create the panel for color choosing
	var lblColorpanel = Titanium.UI.createLabel({
		text:'Todo: colorpicker, color is: '+data.project_color,
		height: 'auto',
		top: 120,
		left: 20,
		width: 'auto',
		color: '#555',
		font: {fontSize: 14, fontFamily: 'Helvetica Neue'}
	});
	
	// Create the submit button
	var btnSubmit = Titanium.UI.createButton({
		title:'Save',
		height:26,
		width:100,
		bottom: 15,
		left: 25,
		color: '#555',
		font: {fontSize: 14, fontFamily: 'Helvetica Neue', fontWeight: 'bold'}
	});
	
	btnSubmit.addEventListener('click', function()
	{
		// Get the values from the input fields
		var valProjectId = data.project_id;
		var valProjectName = txtName.value;
		var valProjectColor = data.project_color;

		var projectData = { project_id: valProjectId, project_name: valProjectName, project_color: valProjectColor };
		
		Titanium.App.fireEvent('save_data', { dataType: 'edit_project', data: projectData });
	
		var t3 = Titanium.UI.create2DMatrix();
		t3 = t3.scale(0);
		winEdit.close({transform:t3,duration:300});
	});
	
	// Create the delete button
	var btnDelete = Titanium.UI.createButton({
		title:'Delete',
		height:26,
		width:100,
		bottom: 15,
		color: '#555',
		right: 25,
		font: {fontSize: 14, fontFamily: 'Helvetica Neue'}
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
	winEdit.add(txtName);
	winEdit.add(lblColorpanel);
	
	winEdit.add(btnSubmit);
	
	//winEdit.add(btnDelete);	

	winEdit.open(a);

}

//
// Add global event handlers to hide/show custom indicator
//
Titanium.App.addEventListener('edit_project', function(e)
{
	var data = e.data;
	openEditWindow('project', data);
});
