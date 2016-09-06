(function( $ ) {
    var methods = {
        init: function(element){
        	var self = this;

			self.itemsList = $(element);
			self.items = self.itemsList.find('.mig-select-option');
			self.container = $('<div class="mig-multi-select-container"><ul class="multi-select-choices"><li class="search-field"><input type="text" value="Choose a Country..." class="default" autocomplete="off"></li></ul><div class="multi-select-drop"></div></div>');
			self.dropBlock = self.container.find('.multi-select-drop');
        	self.choicesList = self.container.find('.multi-select-choices');
			self.searchField = self.container.find('.search-field');
			self.searchFieldInput = self.searchField.find('input');
			self.message = $('<li><p class="message">No results match "<span></span>"</p></li>');

			self.itemsObject = new Object;
			self.arrChoices = new Array;
			self.arrSelectedItemsId = new Array;
			self.arrVisibleItems = new Array;

			self.backspaceRemove = true;
			
            self.setup();
        },

        setup: function(){
        	var self = this;

        	self.container.insertAfter(self.itemsList);	
        	self.itemsList.appendTo(self.dropBlock);
        	self.message.appendTo(self.itemsList).hide();

        	for (var i = 0; i < self.items.length; i++) {
        		self.itemsObject[$(self.items[i]).find('[id]').attr('id')] = $(self.items[i]);
        	}
        	
        	self.selectedItemsArray();

        	self.bindEvents.click(self);
        	self.bindEvents.keypress(self);
        	self.bindEvents.hover(self);
        	self.triggerListeners();

        	for (var i = 0; i < self.arrSelectedItemsId.length; i++) {
        		self.createChoice(self.arrSelectedItemsId[i]);
        	}
        },

        selectedItemsArray: function() {
        	var self = this;

        	self.arrSelectedItemsId = $.makeArray(self.itemsList.find('input').filter(':checked')).map(function(el){
        		return $(el).attr('id');
        	});
        },

        visibleItemsArray: function(){
        	var self = this;

        	self.arrVisibleItems = $.makeArray(self.items.filter(':not(.checked)').filter(':visible'));
        },

        changeArray: function(element, array, action) {
        	switch (action) {
			  	case 'add':
					if ( $.inArray(element, array) == -1 ) {
				        array.push(element);
				    }
			    	break;
			  	case 'remove':
			    	array.splice(array.indexOf(element), 1);
			    	break;
			};
        },

        choicePrototype: function(id, text) {
			this.choiceElement = $('<li class="search-choice"/>');
        	this.choiceName = $('<span/>',{html: text}).appendTo(this.choiceElement);
        	this.choiceCloseBtn = $('<button/>',{
										addClass: 'search-choice-close',
										type: 'button',
										html: '<i class="icon-tab-close"></i>'
									}).attr('data-id', id).appendTo(this.choiceElement);
        },

        createChoice: function(id){
        	var self = this,
        		text = $(self.itemsObject[id].context).text(),
        	 	newChoice = new self.choicePrototype(id, text);

     		newChoice.choiceElement.insertBefore(self.searchField);

     		newChoice.choiceCloseBtn.click(function(event){
        		self.removeChoice($(this).attr('data-id'), newChoice.choiceElement);
        	});

			$('#' + id).attr('checked', true);
    		self.itemsObject[id].addClass('checked').removeClass('hover');

			self.dropEvents.closeDrop(self);

        	self.refreshSearch();
     		self.changeArray(id, self.arrSelectedItemsId, 'add');
     		self.changeArray(newChoice.choiceElement, self.arrChoices, 'add');
        },

        removeChoice: function(id, element){
			var self = this;

			self.itemsList.find('#' + id + '').attr('checked', false);
			self.itemsObject[id].removeClass('checked');

			self.refreshSearch();
			self.changeArray(id, self.arrSelectedItemsId, 'remove');
			self.changeArray(element, self.arrChoices, 'remove');

        	element.remove();
        },

        refreshSearch: function() {
			var self = this;

			self.searchFieldInput.val('');
			self.items.show();
			self.backspaceRemove = true;
		},

		changeHoverItem: function(index) {
			var self = this;

			self.visibleItemsArray();

			if ( index < self.arrVisibleItems.length && index > -1 ) {
				$(self.arrVisibleItems[index]).addClass('hover').siblings().removeClass('hover');
			}
		},

		checkEmptyInput: function(phrase) {
			var self = this;
				self.emptyInput = false;

			if (phrase.length === 0 || phrase.match(/^\s*$/)){
				self.emptyInput = true;
			}
		},

		emptySearchResult: function() {
			var self = this;

			!self.items.filter(':visible').length ? self.message.show().find('span').text(self.searchFieldInput.val()) : self.message.hide();
		},

		triggerListeners: function() {
			var self = this;

			// self.container.bind('emptyInput', function(event, keyCode) {
				
			// });

			// self.container.bind('removeChoice', function(event, id, choice) {
				
			// });
		},

		bindEvents: {
			click: function(self) {
				self.choicesList.click(function(event) {
	        		self.dropEvents.openDrop(self);
	        		self.searchFieldInput.focus().val('');
	        	});

	        	$(document).click(function(event) {
	        		if ( !event.target.closest('.mig-multi-select-container') && !event.target.closest('.search-choice')) {
	        			self.dropEvents.closeDrop(self);
        				self.searchFieldInput.val(self.searchFieldInput.attr('value'));
	        		}
	        	});

	        	self.items.click(function(event) {
	        		if ( !$(this).hasClass('checked') ) {
						self.createChoice($(this).find('[id]').attr('id'));
	        		} else {
						return false;
	        		}
	        	});
			},

			keypress: function(self) {
				self.searchFieldInput.on('keyup', function(event){
					var searchPhrase = $(this).val(),
					    curHoverItemIndex = 0;

					self.visibleItemsArray();
					self.checkEmptyInput(searchPhrase);

					if ( !self.itemsList.find('.hover').length ) {
						$(self.arrVisibleItems[curHoverItemIndex]).addClass('hover').siblings().removeClass('hover');
					}

					self.arrVisibleItems.filter(function(index) {
						if ( $(index).hasClass('hover') ) {
							curHoverItemIndex = self.arrVisibleItems.indexOf(index);
						}
						return index;
					});

					switch (event.keyCode) {
					  	case 38:
					    	curHoverItemIndex--;
							self.changeHoverItem(curHoverItemIndex);
							if ( curHoverItemIndex < 0 ) { 
								self.dropEvents.closeDrop(self);
								self.itemsList.find('.hover').removeClass('hover');
							};
							if ( !$(self.container).is('.with-drop') ) {
								break;
							}
					    	break;
					  	case 40:
					    	curHoverItemIndex++;
					    	!$(self.container).is('.with-drop') && self.dropEvents.openDrop(self);
							self.changeHoverItem(curHoverItemIndex);
					    	break;
					    case 13:
					    	self.itemsList.find('.hover').find('input').trigger('click');
					    	
					    	// self.createChoice(self.itemsList.find('.hover').find('[id]').attr('id'));
					    	break;
					    case 8:
					    	if ( self.backspaceRemove && self.arrChoices.length > 0) {
					    		self.removeChoice(self.arrSelectedItemsId[self.arrSelectedItemsId.length - 1], self.arrChoices[self.arrChoices.length - 1]);
					    	}
					    default:
						    !$(self.container).is('.with-drop') && self.dropEvents.openDrop(self);

						    self.backspaceRemove = false;

						    if ( self.emptyInput ) {
						    	self.backspaceRemove = true;
						    	self.items.show();
								self.emptySearchResult();
								break;
						    }

							search(searchPhrase);

							self.emptySearchResult();
							break;
					};
				});

				function search(searchPhrase) {
					var itemsProcessed = 0;

					for (var key in self.itemsObject) {
						var text = $(self.itemsObject[key].context).text().toLowerCase();

						itemsProcessed++;

						if (text.indexOf(searchPhrase.toLowerCase()) === -1){
							self.itemsObject[key].hide();
						} else {
							self.itemsObject[key].show();
						}

					    self.changeHoverItem(0);
					}
				}
			},

			hover: function(self) {
				self.items.mouseenter(function() {
					self.visibleItemsArray();
					self.changeHoverItem(self.arrVisibleItems.indexOf(this));
				});

				self.container.mouseleave(function() {
					self.itemsList.find('.hover').removeClass('hover');
				});
			}
		},

		dropEvents: {
			openDrop: function(self){
				$('.mig-multi-select-container').removeClass('with-drop');
        		self.container.addClass('with-drop');
        		self.emptySearchResult();

        		self.container.trigger('openDrop');
			},

			closeDrop: function(self){
        		self.container.removeClass('with-drop');
        		self.items.show();
        		self.emptySearchResult();

        		self.container.trigger('closeDrop');
			}
		}
    };

$.fn.migMultiCheck = function( method ) {

    if ( methods[method] ) {
        return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    }
    else if ( typeof method === 'object' || ! method ) {
        return this.each(function() {
            var migMultiCheck = Object.create( methods );
            migMultiCheck.init( this );
            $.data( this, 'migMultiCheck', migMultiCheck );
        });
    }
    else{
        $.error( 'Method ' +  method + ' does not exist' );
    }   
};

})( jQuery );

$(function(){
	$('.mig-multi-select').migMultiCheck();
});

