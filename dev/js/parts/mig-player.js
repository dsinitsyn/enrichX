var mediaPlayerController = (function(){
    $(document).on('click', '.modal-link.video-modal-link', function(event) {
		init($($(this).attr('href')).find('video'));
	});

	function init(element) {
		var self = $( element );

		self.mediaPlayerOptions = {
			features: ['playpause','progress','fullscreen'],
			startVolume: 0.5,
			iPadUseNativeControls: true,
		    iPhoneUseNativeControls: true,
		    AndroidUseNativeControls: true,
	        usePluginFullScreen: false,
	        hasTrueNativeFullScreen: true,
	        pluginType: 'native'
		}

		self.mediaPlayerOptions.success = function (mediaElement, domObject) {
			var modal = $(mediaElement).closest('.modal');
			modal.find('.modal-close-btn').bind('click.mediaPlayer', function(event) {
				resetMediaPlayer(mediaElement);
			});
			$(mediaElement).closest('.backdrop').bind('click.mediaPlayer', function(event) {
				if($(event.target).closest('.modal').length){return};
				resetMediaPlayer(mediaElement);
			});
		};

		var k = 0.5, img = document.createElement('img');
        img.src = self.attr('poster');

        var visibleImage = setInterval(function(){
            if(img.naturalHeight > 0) {
                k = img.naturalHeight / img.naturalWidth;
                var newHeight = $(self).closest('.asset-view').height(),
                	newWidth = $(self).closest('.asset-view').width();

        		if ( ($(window).height() - 110) < newHeight ) {
        			newHeight = $(window).height() - 150;
        		}

				self.height(newHeight).width(newWidth);
                createMediaPlayer(self);
                MediaElementPlayer(self).setPlayerSize(newWidth, newHeight);
                clearInterval(visibleImage);
            }
        },1);

        $(window).on('resize', function () {
        	var newHeight = $(self).closest('.asset-view').height(),
                newWidth = $(self).closest('.asset-view').width();
        	if ( ($(window).height() - 110) < newHeight ) {
    			newHeight = $(window).height() - 150;
    		}

            self.height(newHeight).width(newWidth);
            MediaElementPlayer(self).setPlayerSize(newWidth, newHeight);
        });
	}

	function createMediaPlayer(element) {
        var mediaPlayer = new MediaElementPlayer(element, element.mediaPlayerOptions);
        var posterSrc = element.attr('poster');
        $(element).closest('.mejs-container').find('.mejs-poster').css({'background-image': 'url("' + posterSrc + '")'});
        return mediaPlayer;
	}

	function resetMediaPlayer(element) {
		element.pause();
		element.setCurrentTime(0);
	}

	function playVideo(element){
		MediaElementPlayer(element).play();
	}

	function pauseVideo(element){
		MediaElementPlayer(element).pause();
	}

	return{
		init: init,
		play: playVideo,
		pause: pauseVideo
	}
})();