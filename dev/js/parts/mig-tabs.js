$(function () {
    migTabs.init();
});

$(window).resize(function () {
    migTabs.tabsResize();
});

var mig = {
    init: function () {
        mig.tabsContainer = $('.mig-tabs');
        mig.menu = $('.mig-tab-link');
        mig.framesContainer = $('.mig-frame-content');
        mig.dashboard = mig.menu.filter('a[name="Dashboard"]');
        mig.setup();      

    },

    setup: function(){
        mig.menu.click(function (event) {
            var currentMenu = $(this);
            (event.preventDefault) ? event.preventDefault() : event.returnValue = false;

            var name = $(this).attr('name');
            var link = $(this).attr('href');

            if (currentMenu.data('tab')) {
                mig.tabPress(currentMenu.data('tab'));
            } else {
                currentMenu.tab = mig.tabCreate(name, link, currentMenu);
                currentMenu.data('tab', currentMenu.tab);
            }
        });

        mig.dashboard.trigger('click');

        $('.main-logo').click(function(){
            mig.dashboard.trigger('click'); 
        });
    },

    tabCreate: function (name, link, menu) {

        var tab = $('<li/>', {
            name: name
        });

        var tabLink = $('<a/>', {
            href: link,
            append: $('<span/>').text(name),
            title: name,
            click: function () {
                mig.tabPress(tab);
                return false;
            }
        }).appendTo(tab);

        var closeBtn = $('<button/>', {
            class: 'mig-close-tab',
            type: 'button',
            html: '<i class="icon-tab-close"></i>',
            click: function () {
                mig.tabClose(tab);
            }
        }).appendTo(tab);

        tab.css({ top: '50px' })
            .animate({ top: 0 }, 100);

        var tabFrame = mig.frameCreate(name, link);
        tab.data('active-frame', tabFrame);
        tab.frames = [];
        tab.frames.push(tabFrame);

        if ( menu ){
            tab.appendTo(mig.tabsContainer);
            tab.data('menu', menu);
            mig.tabPress(tab);
        } else {
            tab.insertAfter(mig.currentTab);
        }

        return tab;
    },

    tabPress: function (tab) {
        self = this;
        mig.makeElementActive(tab);
        mig.makeMenuActive(tab.data('menu'));
        mig.currentTab = tab;
        mig.tabsResize();
        mig.frameShow(tab.data('active-frame'));
    },

    tabClose: function (tab) {
        var tabs = mig.tabsContainer.children('li');

        if ((tab.is(mig.currentTab)) && (tabs.length > 1)) {
            var targetTab = (tab.next().length > 0 ? tab.next() : tab.prev());
            mig.tabPress(targetTab);
        }

        tab.data('menu') && tab.data('menu').removeData('tab');
        mig.removeElementArray(tab.frames);
        tab.remove();
        mig.tabsResize();

        tabs.length == 1 && mig.dashboard.trigger('click');
    },

    tabSetActiveFrame: function (frame) {
        mig.currentTab.data('active-frame', frame);
    },

    tabAddFrame: function (frame) {
        mig.currentTab.frames.push(frame);
    },

    tabsResize: function () {
        var tabsNotActive = mig.tabsContainer.find('li').not('.active');
        var tabs = mig.tabsContainer.find('li');
        var ACTIVE_TAB_WIDTH = 160;
        var tabsContainerWidth = mig.tabsContainer.width() - ACTIVE_TAB_WIDTH;
        tabs.outerWidth(tabsContainerWidth / tabsNotActive.length);
    },

    frameCreate: function (name, link, parent) {
        var frame = $('<iframe/>', {
            src: link,
            name: name,
        }).appendTo(mig.framesContainer);

        frame.link = link;
        frame.name = name;

        if (parent) {
            frame.parentFrame = parent;
            parent.childFrame = frame;
            mig.makeElementActive(frame);
        }

        mig.frameInitContent(frame);
        mig.currentFrame = frame;


        return frame;
    },

    frameInitContent: function (frame) {
        frame.load(function () {
            mig.insetsContainer = frame.contents().find('.mig-breadcrumbs');
            frame.parentFrames = [];
            frame.childFrames = [];
            mig.initialFrame = frame;
            mig.frameSetParentArray(frame);
            mig.frameInitInsets(frame);
            mig.insetButtonInit(frame);
        });
    },

    insetButtonInit: function (frame) {
        if (frame != null) {
            var insetButton = frame.contents().find('.mig-inset-btn');
            var body = frame.contents().find('body');

            body.on('click', '.mig-inset-btn', function (event) {
                if ($(this).attr('target') == '_blank' )
                    return;

                (event.preventDefault) ? event.preventDefault() : event.returnValue = false;

                var currentInsetButton = ($(event.target).hasClass('.mig-inset-btn') ? $(event.target) : $(event.target).closest('.mig-inset-btn'));

                var insetName = currentInsetButton.attr('name');
                var insetLink = currentInsetButton.attr('href') || currentInsetButton.data('href');
                var sourceFrame = mig.currentTab.data('active-frame');

                if (event.ctrlKey){
                    var tab = mig.tabCreate(insetName, insetLink);
                    tab.sourceFrame = sourceFrame;
                }else{
                    var targetFrame = mig.frameCreate(insetName, insetLink, sourceFrame);
                    mig.tabSetActiveFrame(targetFrame);
                    mig.tabAddFrame(targetFrame);
                }

                return false;
            });

        }
    },

    frameShow: function (frame) {
        mig.makeElementActive(frame);
        mig.currentFrame = frame;
    },

    frameInitInsets: function (frame) {
        var html = '';
        var insets = frame.parentFrames.reverse();
        insets.push(frame);

        jQuery.each(insets, function (i, insetFrame) {
            var inset = $('<a/>', {
                src: insetFrame.link,
                name: insetFrame.name,
                append: insetFrame.name,
                click: function () {
                    //mig.frameReload(insetFrame);
                    mig.frameShow(insetFrame);
                    mig.tabSetActiveFrame(insetFrame);
                    mig.frameSetChildArray(insetFrame);
                    mig.removeElementArray(mig.currentFrame.childFrames);
                }
            });
            $('<li></li>').append(inset).appendTo(mig.insetsContainer);
        });
    },


    frameReload: function (frame) {
        frame.attr('src', frame.link);
    },

    frameReloadWithNewUrl: function (frame, url, time) {
        var time = (time ? time : 0);
        setTimeout( function(){
            frame.attr('src', url);
        } , time);
        
    },

    frameSetParentArray: function (frame) {
        if (frame.parentFrame) {
            mig.initialFrame.parentFrames.push(frame.parentFrame);
            mig.frameSetParentArray(frame.parentFrame);
        } else {
            return;
        }
    },

    frameSetChildArray: function (frame) {

        if (frame.childFrame) {
            mig.currentFrame.childFrames.push(frame.childFrame);
            mig.frameSetChildArray(frame.childFrame);
        } else {
            return;
        }
    },

    insetClose: function(frame) {
            frame.remove();
            mig.tabSetActiveFrame(frame.parentFrame);
            mig.frameReload(frame.parentFrame);
            mig.frameShow(frame.parentFrame);
    },

    pageClose: function(){
        var frame = mig.currentFrame;
        var tab = mig.currentTab;
        frame.parentFrame ? mig.insetClose(frame) : mig.tabClose(tab);
    },

    makeMenuActive: function (menu){
        mig.menu.removeClass('active');
        if (menu && !menu.is(mig.dashboard)){
            menu.addClass('active');
        }

    },

    makeElementActive: function (element) {
        element.siblings().removeClass('active');
        element.addClass('active');
    },

    removeElementArray: function (elements) {
        jQuery.each(elements, function (index, element) {
            element.remove();
        });
    },

    reloadCurrentFrame: function () {
        mig.frameReload(mig.currentFrame);
    },

    reloadCurrentFrameWithNewUrl: function (url, time) {
        
        mig.frameReloadWithNewUrl(mig.currentFrame, url, time);
    },

    reloadSourceFrameWithNewUrl: function (url) {
        mig.currentTab.sourceFrame ? mig.frameReload(mig.currentTab.sourceFrame) : mig.parentFramesReloadWithNewUrl(mig.currentFrame, url);
    },

    reloadSourceFrame: function() {
        mig.currentTab.sourceFrame ? mig.frameReload(mig.currentTab.sourceFrame) : mig.parentFramesReload(mig.currentFrame);
    },

    parentFramesReload: function(frame){
        if (frame.parentFrame){
            mig.frameReload(frame.parentFrame);
            mig.parentFramesReload(frame.parentFrame);
        }
    },

    parentFramesReloadWithNewUrl: function(frame, url){
        if (frame.parentFrame){
            mig.frameReloadWithNewUrl(frame.parentFrame, url);
            mig.parentFramesReloadWithNewUrl(frame.parentFrame);
        }
    }
};

var migTabs = Object.create(mig);





// $(window).on("navigate", function (event, data) {
//     var direction = data.state.direction;
//     if (direction == 'back') {
//         alert('a');
//         window.migTabs.insetClose();
//         window.history.forward(1);
//     }

//     if (direction == 'forward') {
//        //window.history.back(); 
//     }
// });

