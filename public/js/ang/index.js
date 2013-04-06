$('#stopSubmit').on('click', function(e) {
	var link = $('#agencySelect').val() + '/stop/' + $('#stopField').val()
	//alert(link)
	window.location = link;

})