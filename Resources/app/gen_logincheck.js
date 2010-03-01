
function handleLoginCheck( api_token )
{
	if(api_token == "")
	{
		// Go to the settings tab
		tabGroup.tabs[2].active = true;
	}
}

//
// Add global event handlers to handle login
//
Titanium.App.addEventListener('login_required', function(e)
{
	handleLoginCheck(e.api_token);
});




