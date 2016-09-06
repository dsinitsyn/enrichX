(function($) {
	var methods = {
		init : function(element){
			var self = this;
			self.elemParent = $(element).closest('.mig-multicheck-block');
			self.items = self.elemParent.find('li');
			self.no_result = self.elemParent.find('.mig-no-result');
			self.no_result_text = self.no_result.find('.mig-promo-phrase');

			self.bindEvents(element);
		},

		bindEvents : function(searchInput){
			var self = this;

			$(searchInput).on('keyup', function(){
				var searchPhrase = $(this).val(),
					searchResult = false;

				if (searchPhrase.length === 0){
					self.no_result.hide();
					return self.items.show();
				}

				self.items.each(function(index){
					var text = $(this).find('label').text().toLowerCase();

					if (text.indexOf(searchPhrase.toLowerCase()) === -1){
						$(this).hide();
					} else {
						searchResult = true;
						$(this).show();
					}
				});

				if (searchResult === false){
					self.no_result_text.text(searchPhrase);
					self.no_result.show();
				} else {
					self.no_result.hide();
				}
			});
		}
	};

	$.fn.promoSearch = function() {
		return this.each(function() {
			var item = Object.create(methods);
			item.init(this);
			$(this).data('promoSearch', item);
		});
	};

})(jQuery);