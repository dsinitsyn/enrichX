var migAlert = (function(){

	$(document).on('click', '.alert-close-btn', function(){
		var alert = $(this).closest('.alert');
		closeAlert(alert);
	});

	function showAlert(message, status, time){
		closeAlert();

		var status = status || 'info',
			alert = $('<div class="alert ' + status + '"> <p class="alert-message">'+ message +'</p> <button class="alert-close-btn button" type="button"><i class="icon-close"></i></button></div>');
		
		alert.appendTo('body');
		alert.css({right: -alert.width()}).animate({right: 0}, 300);

		if (time > 0)
			setTimeout(function(){
				closeAlert(alert);
			}, time);
	}

	function closeAlert(alert){

		var alert = alert || $('.alert');

		alert.animate({marginTop: 60, opacity: 0}, 100, function(){
			alert.hide();
		});
	}

	return {
		show: showAlert
	}
})();