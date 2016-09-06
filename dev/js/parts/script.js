var tabsModule = (function(){
	$(document).on('click', '.tabs li a, .nav-tabs li a', function(){
		var tab = $(this);
		showTabContent(tab);
		return false;
	});

	function showTabContent(tab){
		var content = tab.attr('href'),
			container = tab.closest('ul');

		container.find('a').removeClass('active');
		tab.addClass('active');
		$(content).addClass('active').siblings().removeClass('active');
	}
}());

var assetSelectionModule = (function(){
	$(document).on('click', '#selection-btn', function(){
		var checked = $('.asset-checkbox:checked');

		if (checked.length == 0){
			selectAll();
		}else{
			deselectAll();
		}
	});

	$(document).on('click', '.asset-checkbox', function(){
		setCaptions();
	});

	function selectAll(){
		$('.asset-checkbox').prop('checked', true);
		setCaptions();

	}

	function deselectAll(){
		$('.asset-checkbox').prop('checked', false);
		setCaptions();
	}

	function setCaptions(){
		var selectionBtn = $('#selection-btn'),
			checked = $('.asset-checkbox:checked'),
			hidden = $('#selection-hidden');

		if (checked.length == 0){
			selectionBtn.text('Select all');
			hidden.val('');
		}else{
			selectionBtn.text('Deselect all (' + checked.length + ')');
			hidden.val('');

			checked.each(function() {
				hidden.val( hidden.val() + $(this).attr('id')  + ',');
			});
		}
	}
})();

var assetUploadModule = (function(){

	$(document).on('click', '#asset-upload-btn', function(){
		$(this).hide().next('.asset-upload-group').addClass('visible');
	});

	 $(document).on('change', '.asset-upload-group input[type=file]', function () {
            if ( $(this).val() ) {
               $('.asset-upload-group').find('button.button').prop('disabled', false);
            }
        }
    );
})();

var calendarModule = (function(){
	$(function(){
		if ( $('.datepicker-form').length < 1 )
			return false;

		$('.datepicker-form > input[type="text"]').each(function() {
			$( this ).datepicker({
				dateFormat: 'dd-mm-yy',
		      	prevText: '<i class="icon-nav-left"></i>', 
		      	nextText: '<i class="icon-nav-right"></i>',
			    dayNamesMin: $.datepicker._defaults.dayNamesShort,
			    firstDay: 1,
			    beforeShow: function (input, inst) {
			        var rect = input.getBoundingClientRect();
			        setTimeout(function () {
				        inst.dpDiv.css({ top: rect.top, left: rect.width + rect.left + 10 });
			        }, 0);
			    }
			});
		});
		$('#ui-datepicker-div').draggable();
	});
})();

var editor = (function(){
	$(document).on('click', '.mce-container', function(){
		$('.mce-edit-area').find('iframe').contents().find('body').on('keypress', function(){
			tinyMCE.triggerSave()
		});
	});
})();
