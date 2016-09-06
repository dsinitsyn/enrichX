(function($) {
	var methods = {
		init : function(element){
			var elemParent = $(element).closest('.widget');
			
			this.items = elemParent.find('tbody .mig-shipp-search-name');
			this.bindEvents(element);
		},

		bindEvents : function(searchInput){
			var self = this;

			$(searchInput).on('keyup', function(){
				var searchPhrase = $(this).val();

				if (searchPhrase.length === 0){
					return self.items.parent().show();
				}

				self.items.each(function(index){
					var text = $(this).html().toLowerCase();

					if (text.indexOf(searchPhrase.toLowerCase()) === -1){
						$(this).parent().hide();
					} else {
						$(this).parent().show();
					}
				});
			});
		}
	};

	$.fn.shippCountriesSearch = function() {
		return this.each(function() {
			var item = Object.create(methods);
			item.init(this);
			$(this).data('shippCountriesSearch', item);
		});
	};

})(jQuery);

$(function(){
	$('.mig-countries-search').shippCountriesSearch();
});