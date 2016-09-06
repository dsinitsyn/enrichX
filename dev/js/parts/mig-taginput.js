(function( $ ) {
    var methods = {
        init: function(element){
        	var self = this;

			self.tagHidden = $(element);
			self.tagInput = $('<input type="text" class="tag-input">');
            self.tagItem = $('<li class="tag-item"><p class="tag-name"></p><button type="button" class="tag-remove-btn"><i class="icon-tab-close"></i></button></li>');
            self.tagList = $('<ul class="tag-list"></ul>');

            self.setup();
        },

        setup: function(){
			var self = this;

			self.tagHidden.css({
				margin: 0,
				padding: 0,
				visibility: 'hidden',
				height: 0,
				border: 'none',
				position: 'absolute'
			});

			self.tagInput.insertAfter(self.tagHidden);

			self.tagList.insertAfter(self.tagInput);


			if ( self.tagHidden.val() ){
				self.arrTags = self.tagHidden.val().split(',');
			}else{
				self.arrTags = [];
			}

			for (var i = 0; i < self.arrTags.length; i++) {
				if ( !self.arrTags[i].match(/^\s*$/) ) {
					self.createTag(self.arrTags[i]);
				}
			}

			self.tagInput.on('keypress', function(event) {
	        	event.stopPropagation();
	        	
            	(event.keyCode === 13) && event.preventDefault();

	            if( !$(this).val().match(/^\s*$/) && ( event.keyCode === 44 || event.keyCode === 13)) {
	            	self.hiddenTagsArr($(this).val());
	            	self.createTag($(this).val());
	            	return false;
	            }
	        }); 
        },

        hiddenTagsArr: function(value) {
        	var self = this;
			self.arrTags.push( value );

			self.tagHidden.val( self.arrTags );
        },

        createTag: function(value) {
        	var self = this;

			self.tagList = self.tagInput.next('.tag-list');

	        var newTag = self.tagItem.clone();

	        newTag.find('.tag-name').html(value);
	        newTag.appendTo(self.tagList);
	        newTag.find('.tag-remove-btn').click(function(event) {
				event.preventDefault();
				self.removeTag(this);
			});

	        self.tagInput.val('');
		},

		removeTag: function(element) {
			var self = this;

			var curTagItem = $( element ).closest('.tag-item'),
			    curTagIndex = curTagItem.index();

			curTagItem.remove();

			self.arrTags.splice(curTagIndex, 1);
			self.tagHidden.val(self.arrTags);
		}
    };

$.fn.migTaginput = function( method ) {

    if ( methods[method] ) {
        return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    }
    else if ( typeof method === 'object' || ! method ) {
        return this.each(function() {
            var slider = Object.create( methods );
            slider.init( this );
            $.data( this, 'migTaginput', slider );
        });
    }
    else{
        $.error( 'Method ' +  method + ' does not exist' );
    }   
};

})( jQuery );

$(function(){
	$('.tag-input-hidden').migTaginput();
});

