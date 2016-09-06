var sidebarMenuController = (function(){
	var sidebar = $('.sidebar'),
		mainMenu = $('.sidebar').find('.main-menu'),
		mainMenuLinks = mainMenu.find('.menu-primary-link'),
		subMenu = mainMenu.find('.sub-menu');

	$(document).on('mouseenter', '.sidebar .main-menu .menu-primary-link, .sidebar .main-menu .sub-menu', function(event) {
		event.preventDefault();
		toTop(this);
	});

	$(document).on('mouseleave', '.sidebar .main-menu .menu-primary-link, .sidebar .main-menu .sub-menu', function(event) {
		event.preventDefault();
		subMenu.removeClass('to-top');
	});

	function toTop(element) {
		subMenu = $(element).closest('li').find('.sub-menu');

		if ( subMenu.length && subMenu.offset().top + subMenu.height() > sidebar.offset().top + sidebar.height() )
			subMenu.addClass('to-top');
	}

})();