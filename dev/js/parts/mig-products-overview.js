var productsOverviewModule = (function(){
	var productsTable = $('.products-overview');

	$('.product-accordion-link').click(function(event) {
		event.preventDefault();
		var link = $(this);

		
		if (!link.hasClass('loaded'))  {
			$.getJSON('/ProductsOverviewHandler.handler',{productId: link.attr('data-value')}, function(json){
				var product = $(json.html);
				var quantity = json.count;

				link.data('stock', product);
	    		link.data('quantity', quantity);
	    		!link.hasClass('active') ? showProducts(link) : hideProducts(link);
			});
    	} else {
    		!link.hasClass('active') ? showProducts(link) : hideProducts(link);
    	};
	});

	function showProducts(link) {
		$('.product-accordion-link.active').length && hideProducts($('.product-accordion-link.active'));

		link.addClass('active');
		link.find('i').toggleClass('icon-angle-down').toggleClass('icon-angle-up');

    	if (!link.hasClass('loaded'))  {
    		link.data('stock').insertAfter(link.closest('tr'));
    		link.addClass('loaded');
    	};

		link.closest('tr').find('td[rowspan]').attr('rowspan', link.data('quantity') + 1);

    	link.data('stock').show();
	};

	function hideProducts(link) {
		link.removeClass('active');
		link.closest('tr').find('td[rowspan]').attr('rowspan', '');
		link.find('i').toggleClass('icon-angle-down').toggleClass('icon-angle-up');
    	link.data('stock').hide();
	};
})();

