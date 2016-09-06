var migReorder = (function(){
	$(document).on('click', '.reorder-btn[data-order]', function(){
		var reorderBtn = $(this),
			target = reorderBtn.data('order'),
			sortable = $( target ).find('tbody');

		reorderBtn.prop('disabled', true)
			.next('.save-btn')
			.fadeIn(100);


		$(this).next('.save-btn').click(function(event) {
			reorderBtn.prop('disabled', false);
			$(this).fadeOut(100);
			sortable.sortable('destroy')
		});


		initSortable(sortable, target);
	});


	function initSortable(sortable, target){

		sortable.sortable({
			placeholder: 'tr-placeholder',
			items: '> tr',

			stop: function(){
				fillHidden(sortable, target);
			}
		});
	}

	function fillHidden(sortable, target){
		var row = sortable.children('tr'),
			orderArray = [];

		row.each(function(index, el) {
			orderArray.push( $(this).attr('id') );
		});

		$('input.order-hidden[name*="'+target+'"]').val(orderArray);
	}

})();