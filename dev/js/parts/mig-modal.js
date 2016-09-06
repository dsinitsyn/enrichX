
var migModal = (function(){

	$(document).on('click', '.modal-link', function(event) {
		event.stopPropagation();
		var modal = $(this).attr('href') || $(this).data('href');
		showModal(modal);

		if ( $(this).data('handler') )
			loadData(modal, $(this).data('handler'));			

		return false;
	});

	$(document).on('click', '.modal-close-btn', function(event){
		closeModal();
	});

	$(document).on('click', '.backdrop', function(event){
		$(event.target).is(this) && closeModal();
	});

	var body = $('body'),
		backdrop = $('.backdrop');

	function showModal(modal, mes, arg, event) {
		var modal = $(modal);
	    var parentModal = $('.modal:visible');

	    	console.log(backdrop);


	    var eventTarget = event ? event : 'cBtnYes';
    	
	    if (parentModal.length){
	    	modal.data('parent', parentModal);
	    	parentModal.hide();
	    }else{
		    body.css({paddingRight: getScrollbarWidth(), top: -$(document).scrollTop() }).addClass('backstage');
		    backdrop.addClass('visible')
		    	.css({opacity: 0})
		    	.animate({opacity: 1}, 500);
		    browserBackButtonEvent();
	    }

	    if (mes && arg){
	    	modal.find('[data-message]').text(mes);
	    	modal.find('#cBtnYes').attr('onclick', 'MigAjax.request(this,{eventTarget:"' + eventTarget + '", eventArgument:"'+ arg +'"}); return false;');
	    }

	    modal.show()
	    	.css({marginTop: -300})
	    	.animate({marginTop: 0});

	    return false;
	}

	function loadData(modal, handler){
    	var modal = $(modal);

		 $.get(handler, function (data, status) {
            if (data != null) {
                modal.find('.modal-content').html(data);
            }
        });
	}

	function closeModal() {
		var modal = $('.backdrop .modal'),
			parentModal = modal.filter(':visible').data('parent');

		if (parentModal){
			modal.hide();
			parentModal.show();
		}else{
			$('body, html').css({paddingRight: '' }).removeClass('backstage').animate({scrollTop: Math.abs(parseInt(body.css('top'))) }, 0);
		    backdrop.animate({opacity: 0}, 200, function(){
		    	$(this).removeClass('visible');	
				modal.hide();
				$('body').trigger('closeModal');
		    });
		}

	}


    function browserBackButtonEvent(){
    	history.pushState("jibberish", null, null);
		window.onpopstate = function () {
			closeModal();
		};
    }

    function getScrollbarWidth() {
	    var windowWidth = $(window).width();
	    $('body').css({ overflow: 'hidden' });
	    var windowFullWidth = $(window).outerWidth();
	    $('body').css({ overflow: '' });
	    return windowFullWidth - windowWidth;
	}

	return{
		show: showModal,
		close: closeModal
	}
})();