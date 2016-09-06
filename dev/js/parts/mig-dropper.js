(function( $ ) {
	var defaults = {
		width: 200,
		height: 200,
		type: 'image',
		quantity: 1,
        sort: true,
        move: 'copy',
        crop: false,
        array: []
	}

    var methods = {
    	init: function( element ){
    		var self = this;
    		self.dropperContainer = $(element);
    		self.settings = $.extend({}, defaults, self.dropperContainer.data());
    		self.hidden = self.dropperContainer.find('.dropper-hidden');

    		self.droppers = self.dropperContainer.find('.dropper');
                

            self.initExistDropper(self.droppers);

            (self.settings.quantity != 'multiple')
                ? self.createDropper(self.settings.quantity - self.droppers.length)
                : self.createDropper();
            
            if (self.settings.sort)
                self.initSorting();

            self.fillHidden();
    	},

        initSorting: function(){
            var self = this;

            self.dropperContainer.sortable({
                items: '.dropper[data-dropped="true"]',
                start: function(e, ui){
                    var dropper = ui.item;

                    self.setDroppableSize(ui.placeholder);
                    self.initDroppers( dropper, self.droppers );

                },
                stop: function(){
                    self.fillHidden();
                }
            }).attr('data-sort', true);
        },

        initDroppers: function(dropper, currentDroppers){
            var self = this,
                droppers = $('.dropper[data-type="' + dropper.data('asset').type + '"],  .dropper[data-type="file"]').not(currentDroppers);
                droppers.droppable({disabled: false});

                droppers.droppable({
                    addClasses: false,
                    activeClass: "active",
                    hoverClass: "hover",
                    drop: function(){
                        $(this).trigger('drop', dropper.data('asset'));

                        if ( self.settings.move == 'cut' )
                            self.removeAsset(dropper);
                        
                    },
                    deactivate: function(){
                        $(this).droppable({disabled: true});
                    }
                });
        },

        createDropper: function(number){
            var self = this,
                droppersLength = 1;

            if (number != undefined)
                droppersLength = number;

            for (var i = 0; i < droppersLength; i++){
                var dropper = $('<div class="dropper"></div>').appendTo(self.dropperContainer);
                self.initDropper(dropper);
            }

            self.droppers = self.dropperContainer.find('.dropper')
        },

        initDropper: function(dropper){
            var self = this;

            dropper.attr('data-type', self.settings.type)
                .on('drop', function(event, asset){
                    self.dropAsset( $(this), asset);
                });

            self.setDroppableSize(dropper);
        },

        initExistDropper: function(droppers){
            var self = this;

            droppers.each(function() {
                var dropper = $(this),
                    asset = {
                        id: dropper.attr('data-id'),
                        type: dropper.attr('data-type') || self.settings.type,
                        image: dropper.find('.dropped-image').attr('src'),
                        name: dropper.find('.dropped-name').text(),
                        format: dropper.find('.dropped-format').text()
                    }

                dropper.data({
                    dropped: true,
                    id: asset.id,
                    asset: asset
                }).removeAttr('data-id').attr('data-dropped', true);;

                self.initDropper(dropper);
                self.initRemoveBtn(dropper);

            });
        },

        initRemoveBtn: function(dropper){
            var self = this,
                droppedRemoveBtn = dropper.find('.remove-dropped-btn');

            droppedRemoveBtn.click(function(event) {
                self.removeAsset(dropper);
            });
        },

        initEditBtn: function(droppedContainer, asset){
                $('<button/>',{
                    'data-href':  '#modal-template',
                    'data-handler': '/AdminTemplateHandler.handler?referenceId=' + asset.id,
                    addClass: 'hollow-btn button mig-edit-template modal-link',
                    type: 'button',
                    text: 'Edit template'
                }).appendTo(droppedContainer.find('.dropped-overlay'));

        },

    	setDroppableSize: function(element){
    		var self = this;

			element.css({width: self.settings.width, height: self.settings.height});
		},

        dropAsset: function(dropper, asset){
            var self = this;


            if (dropper.data('dropped') ){
                self.removeDropperContent(dropper);
            }else if (self.settings.quantity == 'multiple'){
                self.createDropper();
            }

            
            var droppedContainer = $('<div class="dropped-asset"><div class="dropped-overlay"><button type="button" class="button remove-dropped-btn"><i class="icon-close"></i></button></div></div>');

            if (asset.image)
                $('<img/>',{
                    src: asset.image,
                    addClass: 'dropped-image'
                }).appendTo(droppedContainer);

            if (asset.format)
                $('<span/>',{
                    text: asset.format,
                    addClass: 'dropped-format'
                }).appendTo(droppedContainer);
            
            if (asset.name)
                $('<p/>',{
                    text: asset.name,
                    addClass: 'dropped-name'
                }).appendTo(droppedContainer.find('.dropped-overlay'));

            if (asset.type == 'template'){
                $('<p/>',{
                    text: 'Template #' + asset.id,
                    addClass: 'dropped-name'
                }).appendTo(droppedContainer.find('.dropped-overlay'));
                self.initEditBtn(droppedContainer, asset);
            }

            dropper.attr('data-dropped', true).data({
                'dropped': true,
                'id': asset.id,
                'asset': asset
            }).append(droppedContainer);

            self.initRemoveBtn(dropper);
            self.fillHidden();
        },

        removeAsset: function(dropper){
            var self = this;

            (self.settings.quantity == 'multiple')
                ? self.removeDropper(dropper)
                : self.removeDropperContent(dropper);
        },

        removeDropper: function(dropper){
            var self = this;
            dropper.remove();

            self.fillHidden();
        },

        removeDropperContent: function(dropper){
            var self = this;

            dropper.find('.dropped-asset').remove();
            dropper.removeData('dropped id asset').removeAttr('data-dropped');
            self.dropperContainer.sortable('destroy');
            self.initSorting();  

            self.fillHidden();
        },

        fillHidden: function(){
            var self = this;
                self.droppers = self.dropperContainer.find('.dropper');

            self.settings.array = [];
            self.droppers.each(function() {
                var id = $(this).data('id');

                if (id != undefined)
                    self.settings.array.push( id );
            });

            self.hidden.val(self.settings.array);
        }
    };

$.fn.migDropper = function( method ) {

    if ( methods[method] ) {
        return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    }
    else if ( typeof method === 'object' || ! method ) {
        return this.each(function() {
            var dropper = Object.create( methods );
            dropper.init( this );
            $.data( this, 'migDropper', dropper );
        });
    }
    else{
        $.error( 'Method ' +  method + ' does not exist' );
    }   
};

$('.dropper-container').migDropper();

})( jQuery );



var templateModule = (function () {
    $(document).on('click', '.mig-edit-template', function () {

        var handler = $(this).attr('data-handler');

        $.get(handler, function (data, status) {
            if (data != null) {
                $('#modal-template .modal-content').html(data);

                $('#modal-template .modal-save-btn').attr('onclick', 'MigAjax.request(this, { url:"'+ handler +'"}); return false;');
                $('#modal-template .dropper-container').migDropper();
            }
        });
    });


    $('body').on('closeModal', function(){
        
        $('#modal-template .modal-content').empty();
        // $(modal).find('.modal-content').empty();
    });

})();



var mceuImageModule = (function(){
    var imageHandler;

    $(document).on('click', '.mce-btn[aria-label="Insert/edit image"]', function(){
        imageHandler = $(this).closest('.mce-tinymce').next('textarea').data('handler');
    });

    var dropAssetInInput = function(dropper, asset){
        if (imageHandler){
            asset.image = asset.image.substring(0, asset.image.indexOf('settings-'));
            dropper.val(asset.image + 'settings-' + imageHandler);
        }else{
            dropper.val(asset.image);
        }
    }

    return{
        dropAssetInInput: dropAssetInInput
    }

})();