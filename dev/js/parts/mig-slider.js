(function( $ ) {
    var defaults = {
        cells: 1,
        pagination: false,
        dotted: false,
        touch: false,
        arrows: true,
        duration: 300,
        carousel: true,
        autoslide: false,
        animate: false
    };

    var methods = {
        init: function(element, option){
            var self = this;
            self.element = $(element);
            self.settings = $.extend({}, defaults, self.element.data(), option);
            self.ribbon = self.createWrapper('slider-ribbon');
            self.slider = self.createWrapper('slider-content');
            self.cell = self.ribbon.children('div');
            self.shiftWidth = self.slider.width() + parseInt(self.cell.css('padding-left')) + parseInt(self.cell.css('padding-right'));
            self.slidesAmount = Math.ceil(self.cell.length / self.settings.cells );
            self.slides = self.divideSlides().width( self.shiftWidth );

            self.steps = 0;
            self.isAnimated = false;
            self.setup();
        },

        setup: function(){
            var self = this;

            $(window).resize(function(event) {
                self.resize();
            });

            self.settings.pagination && self.initPagination();
            self.settings.dotted && self.initDots();

            if (self.settings.touch ){

                if (self.slides.length > 1){
                    self.slider.on("swipeleft",function(){
                        self.disableAutoslide();
                        self.moveSlideNext();
                    });

                    self.slider.on("swiperight",function(){
                        self.disableAutoslide();
                        self.moveSlidePrev();
                    });
                }
            }

            if (self.settings.arrows){

                self.slideNextBtn = $('<button/>',{
                    addClass: 'slider-next-btn',
                    type: 'button',
                    'data-icon': '>'
                });

                self.slidePrevBtn = $('<button/>',{
                    addClass: 'slider-prev-btn',
                    type: 'button',
                    'data-icon': '<'
                });

                if (self.slides.length > 1)
                    $('<div class="slider-control"></div>').append(self.slidePrevBtn, self.slideNextBtn).insertAfter(self.slider);
            }

            if (self.settings.dotted){
                self.dotsBtn.first().trigger('click');
            }

            if (self.settings.arrows){
                self.slidePrevBtn.click(function(event) {
                    self.disableAutoslide();
                    self.moveSlidePrev();
                });

                self.slideNextBtn.click(function(event) {
                    self.disableAutoslide();
                    self.moveSlideNext();
                });
            }

            if (self.settings.carousel == false && self.settings.arrows){
                self.slidePrevBtn.prop('disabled', true);
                self.slider.off('swiperight');
            }

            if (self.settings.autoslide !== false){

                self.autoSlide = setInterval(function(){
                    if ( self.settings.carousel ) {
                        self.moveSlideNext();
                    } else {
                        if ( self.steps !== self.slidesAmount - 1 ){
                            self.moveSlideNext();
                        } else {
                            self.ribbon.stop().animate({left: 0}, self.settings.duration);
                            self.steps = 0;
                            self.makeSlideActive(self.steps);
                            self.settings.arrows && self.slidePrevBtn.prop('disabled', true);
                            self.settings.arrows && self.slideNextBtn.prop('disabled', false);
                        }
                    }
                }, self.settings.autoslide);
            }

            self.makeSlideActive(0);
        },

        resize: function(){
            var self = this;

            self.shiftWidth = self.slider.width() + parseInt(self.cell.css('padding-left')) + parseInt(self.cell.css('padding-right'));
            self.ribbon.find('.slide').width( self.shiftWidth );
            self.goToSlide(self.activeSlide.index());
        },

        initDots: function(){
            var self = this;

            self.dots = $('<ul/>', {
                addClass: 'slider-dots'
            }).appendTo(self.element);

            for(var i = 0; i < self.slidesAmount; i++){
                self.dots.append('<li><button type="button" data-slide="' + i +'"></button></li>')
            }

            self.dotsBtn = self.dots.find('button');

            self.dotsBtn.click(function(event) {
                self.disableAutoslide();
                (self.settings.animate == 'fade')
                    ? self.goToSlide( $(this).data('slide'), self.settings.duration, true)
                    : self.goToSlide( $(this).data('slide'), self.settings.duration);

                $(this).closest('ul').find('button').removeClass('active');
                $(this).addClass('active');
            });

            self.element.bind('changeSlide', function(event) {
                $(self.dotsBtn)
                    .removeClass('active')
                    .eq(event.number)
                    .addClass('active');
            });
        },

        initPagination: function(){
            var self = this;

            self.paginator = $('<ul/>', {
                addClass: 'slider-paginator'
            }).appendTo(self.element);   

            self.paginator.append('<p><span>1</span>/' + self.slidesAmount + '</p>');

            self.element.bind('changeSlide', function(event) {
                self.paginator.find('span').html(event.number + 1);
            });
        },

        moveSlideNext: function(){
            var self = this;
            if ( !self.isAnimated ){
                self.steps++;
                self.isAnimated = true;

                if ( self.steps === self.slidesAmount ){
                    var position = parseInt(self.ribbon.css('left')),
                        tempSlide = self.slides.first().clone().addClass('temporary');
                    tempSlide.appendTo(self.ribbon);
                    self.makeSlideActive(0);
                    self.ribbon.stop().animate({left: position - self.shiftWidth}, self.settings.duration, function(){
                        self.ribbon.css({left: 0});
                        tempSlide.detach();
                        self.steps = 0;
                        self.isAnimated = false;
                    });

                }else{
                    self.makeSlideActive(self.steps);
                    var position = parseInt(self.ribbon.css('left'));
                    self.ribbon.stop().animate({left: position - self.shiftWidth}, self.settings.duration,function(){
                        self.isAnimated = false;
                    });

                    if( (self.steps === self.slidesAmount - 1) && (self.settings.carousel == false)){
                        self.settings.arrows && self.slideNextBtn.prop('disabled', true);
                        self.slider.off('swipeleft');
                    }
                    self.settings.arrows && self.slidePrevBtn.prop('disabled', false);
                    self.slider.on("swiperight",function(){
                        self.moveSlidePrev();
                    });
                }
            }
        },

        moveSlidePrev: function(){
            var self = this;

            if ( !self.isAnimated ){
                self.isAnimated = true;

                if ( self.steps === 0 ){

                    var tempSlide = self.slides.first().clone().addClass('temporary');
                    tempSlide.appendTo(self.ribbon);
                    
                    self.makeSlideActive(self.slidesAmount - 1);

                    self.ribbon.css({left: - (self.shiftWidth * self.slidesAmount)});
                    var position = parseInt(self.ribbon.css('left'));

                    self.ribbon.stop().animate({left: position + self.shiftWidth}, self.settings.duration,function(){
                        tempSlide.detach();
                        self.steps = self.slidesAmount - 1;
                        self.isAnimated = false;
                    });

                }else{
                    self.makeSlideActive(self.steps - 1);

                    var position = parseInt(self.ribbon.css('left'));
                    self.ribbon.stop().animate({left: position + self.shiftWidth}, self.settings.duration,function(){
                        self.isAnimated = false;
                    });

                    if( (self.steps === 1) && (self.settings.carousel == false)){
                        self.settings.arrows && self.slidePrevBtn.prop('disabled', true);  
                        self.slider.off('swiperight');
                    }
                    self.settings.arrows && self.slideNextBtn.prop('disabled', false);
                    self.slider.on("swipeleft",function(){
                        self.moveSlideNext();
                    });
                }
                
                self.steps--;
            }
        },

        goToSlide: function(number, time, fade){
            var self = this.hasOwnProperty('element')
                ? this
                : $(this).data().migSlider;

            if (fade){
                var tempRibbon = self.ribbon.clone();
                tempRibbon.insertBefore(self.ribbon).css({
                    position: 'absolute',
                    top: 0
                });

                self.ribbon.css({opacity: 0})
                    .animate({opacity: 1}, time, function(){
                    tempRibbon.remove();
                });
            }
            
            self.ribbon.stop(true, true).animate({left: -self.shiftWidth * number}, fade ? 0 : time );
            self.steps = number;
            self.makeSlideActive(number);
        },

        disableAutoslide: function(){
            var self;

            if (this.hasOwnProperty('element')){
                self = this;
            }else{
                self = $(this).data().migSlider;
            }

            clearInterval(self.autoSlide);
        },

        divideSlides: function(){

            var self = this;
            for( var i = 0; i < self.cell.length; i += self.settings.cells ) {
                self.cell.slice(i, i + self.settings.cells ).wrapAll("<div class='slide'></div>");
            }

            return self.ribbon.find('.slide');
        },

        createWrapper: function(className){
            var self = this;
            self.element.wrapInner('<div class="'+className+'"></div>');

            return self.element.find('.'+className);
        },

        makeSlideActive: function(number){
            var self = this;
            self.activeSlide = self.slides.eq(number)
                .addClass('active')
                .siblings()
                .removeClass('active')
                .end();

            self.element.trigger({
                type: 'changeSlide', 
                number: number
            });
        },

        reinit: function(params){
            var slider = $(this);

            if (slider.length){
                //remove slide wrapper
                if (slider.data('cells')){
                    slider.find('.slide > *').unwrap();
                }

                //remove controls
                slider.find('.slider-control').remove();

                //remove ribbon and content
                slider.find('.slider-content').replaceWith(slider.find('.slider-ribbon').contents());

                if (params){
                    params = $.parseJSON(params);
                    
                    //set new params
                    $.each(params, function (key, value) {
                        slider.data(key, value);
                    });
                }

                //init
                slider.migSlider();
            }else{
                return;
            }
        }
    };

$.fn.migSlider = function( method ) {

    if ( methods[method] ) {
        return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    }
    else if ( typeof method === 'object' || ! method ) {
        return this.each(function() {
            var slider = Object.create( methods );
            slider.init( this, method );
            $.data( this, 'migSlider', slider );
        });
    }
    else{
        $.error( 'Method ' +  method + ' does not exist' );
    }   
};

})( jQuery );
    
$(function(){
    $('.slider-wrapper').migSlider({duration: 500, carousel: false});
});