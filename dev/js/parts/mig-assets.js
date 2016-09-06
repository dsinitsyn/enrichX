var clipboardModule = (function(){

	$(document).on('click', '.show-clipboard-btn', function(){

		$('.mig-clipboard').hasClass('visible')
		? hideClipboard()
		: showClipboard();

	});

	function showClipboard(){
		var clipboard = $('.mig-clipboard'),
			clipboardBtn = clipboard.find('.show-clipboard-btn');

		clipboardBtn.find('i').removeClass('icon-angle-up').addClass('icon-angle-down');
		clipboard.addClass('visible');
		$('.mig-frame-content').animate({paddingBottom: clipboard.height()}, 200);
	}

	function hideClipboard(){
		var clipboard = $('.mig-clipboard'),
			clipboardBtn = clipboard.find('.show-clipboard-btn');

		clipboardBtn.find('i').removeClass('icon-angle-down').addClass('icon-angle-up');
		clipboard.removeClass('visible');
		$('.mig-frame-content').animate({paddingBottom: 0}, 200);
	}

	function setClipboardLength(){
		var clipboard = $('.mig-clipboard'),
			clipboardBtn = clipboard.find('.show-clipboard-btn');

		clipboardBtn.find('.counter').text('(' + clipboard.find('.clipboard-asset').length +')');

		if (clipboard.find('.clipboard-asset').length == 0){
			hideClipboard();
		}

	}

	return{
		show: showClipboard,
		hide: hideClipboard,
		setLength: setClipboardLength
	}
})();



var migAsset = {
	clipboardAssetArray: [],

	triggerAsset: function(id){
		var self = this,
			element = migTabs.currentFrame.contents().find('.asset-list > .asset[data-id='+id+']');

		self.createAsset(element);
	},

	createAsset: function(element){
		var self = this,
			assetContainer = $(element).is('.asset') ? $(element) : $(element).closest('.asset');
		

		if (self.inClipboard(assetContainer.data('id')) >= 0){
			clipboardModule.show();
			return;
		}


		var asset = {
			type: assetContainer.data('type'),
			id: assetContainer.data('id'),
			image: assetContainer.find('.asset-image').attr('src'),
			name: assetContainer.find('.asset-name').text(),
			size: assetContainer.find('.asset-size').text(),
			date: assetContainer.find('.asset-date').text(),
			format: assetContainer.find('.asset-format').text(),
		}

		self.inClipboard(asset.id);

		assetContainer.data('asset', asset);
		self.addToClipboard(asset);
	},

	addToClipboard: function(asset){
		var self = this,
			clipboardAssetList = $('.clipboard-asset-list'),
			clipboardAssetContainer = $('<li class="clipboard-asset" data-type="'+ asset.type +'"><button type="button" class="button remove-asset-btn"><i class="icon-close"></i></button><figure class="asset-view"><img class="asset-image" src="" alt=""></figure><div class="asset-details"><p class="asset-name"></p><p class="asset-size"></p><p class="asset-date"></p></div></li>');

		clipboardAssetContainer.find('.asset-image').attr('src', asset.image);
		clipboardAssetContainer.find('.asset-name').text(asset.name);
		clipboardAssetContainer.find('.asset-size').text(asset.size);
		clipboardAssetContainer.find('.asset-date').text(asset.date);
		clipboardAssetContainer.find('.remove-asset-btn').click(function(){
			self.removeFromClipboard(asset);
		});

		if (asset.type == 'file' || asset.type == 'video'){
			clipboardAssetContainer.find('.asset-view')
				.append('<span class="asset-format">' + asset.format + '</span>');
		}

		if (asset.type == 'template'){
			clipboardAssetContainer.find('.asset-name')
				.html('Template </br>#' + asset.id);
		}

		asset.clipboardContainer = clipboardAssetContainer;
		clipboardAssetContainer.data('asset', asset);

		clipboardAssetList.append(clipboardAssetContainer);
		self.clipboardAssetArray.push(asset.id);

			
		clipboardModule.show();
		clipboardModule.setLength();

		self.initAssetDrag(asset);
	},

	removeFromClipboard: function(asset){
		var self = this
		asset.clipboardContainer.remove();
		clipboardModule.setLength();
		self.clipboardAssetArray.splice( $.inArray(asset.id, self.clipboardAssetArray), 1 );
		delete asset;
	},

	initAssetDrag: function(asset){
		var self = this;

		asset.clipboardContainer.draggable({
			addClasses: false,
			appendTo: 'body',
			revert: "invalid",
			cursorAt: { top: 1, left: 1 },
			cursor: "move",
			iframeFix: true,
			iframeOffset: migTabs.currentFrame.offset(),

			helper: function() {
				return $('<div class="draggable-asset" data-type="'+asset.type+'"></div>').append( '<div>' + $(this).html() + '</div>');
			},

			start: function(){
				self.initDroppers(asset);
				$('body').css({overflow: 'hidden'});
				$(this).css({opacity: .5});
			},

			stop: function(){
				$('body').css({overflow: ''});
				$(this).css({opacity: 1});

			},

			cancel: function(){
				$(this).css({opacity: 1});
			},

		});
	},

	initDroppers: function(asset){
		var self = this,
			droppers = migTabs.currentFrame.contents().find('.dropper[data-type="' + asset.type + '"], .dropper[data-type="file"]');
		
		//for mce Editor
		if (asset.type == 'image')
			var droppers = droppers.add(migTabs.currentFrame.contents().find('.mce-window[aria-label="Insert/edit image"] .mce-first.mce-formitem .mce-textbox')); 

		if (asset)
		droppers.droppable({disabled: false});


		droppers.droppable({
			addClasses: false,
			activeClass: "active",
			hoverClass: "hover",
			iframeFix: true,
            iframeOffset: migTabs.currentFrame.offset(),
            drop: function(){
	            var dropper = $(this);

	            (dropper.is('input'))
		            ? migTabs.currentFrame[0].contentWindow.mceuImageModule.dropAssetInInput(dropper, asset)
		            : migTabs.currentFrame[0].contentWindow.$(this).trigger('drop', asset);

            },
            deactivate: function(){
                $(this).droppable({disabled: true});
            }
		});
	},

	inClipboard: function(id){
		var self = this;
		return $.inArray(id, self.clipboardAssetArray);
	}
}
