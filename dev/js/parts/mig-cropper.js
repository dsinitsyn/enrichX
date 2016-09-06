var migCropper = (function(){

	$(document).on('click', '.crop-btn[data-crop]', function(event){

		var cropBtn = $(this),
			targetImage = $(cropBtn.data('crop')),
			cropData = [];

		cropData.src = targetImage.attr('src');

		targetImage.Jcrop({
		  // aspectRatio: 1,
		  onChange: cropChange,
		  setSelect: [0,100,100,0],
		  trueSize: [targetImage.prop('naturalWidth'), targetImage.prop('naturalHeight')]
		});

		var saveBtn = $('<button/>', {
			text: 'Save',
			addClass: 'button save-btn'
		}).insertAfter( cropBtn );

		saveBtn.click(function(event) {
			sendCropData( targetImage.attr('src') );
		});

		cropBtn.prop('disabled', true);
	});

	function sendCropData( imgSrc ){
		cropData.src = imgSrc;
		var data = JSON.stringify(cropData);


		$.get( "/assetcrop.handler/", data )
			.done(function( data ) {
				alert( "Data Loaded: " + data );
		}).fail(function(){
			alert('fail');
		});
	}

	function cropChange(changeData){
		cropData = changeData;
	}

})();