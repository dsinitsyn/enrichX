var migTree = (function() {
	var treeContainer = $('.tree-structure');

	$('body').on('click', '.tree-trigger', function(event) {
		event.preventDefault();
		$(this).is('.active') ? compressTreeSub(this) : expandTreeSub(this);
	});

	$('body').on('click', '.expand-btn[data-tree]', function(){
		var tree = $( $(this).data('tree') );
		var trigger = tree.find('.tree-trigger:not(.active)');

		expandTreeSub(trigger);
	});

	$('body').on('click', '.compress-btn[data-tree]', function(){
		var tree = $( $(this).data('tree') );
		var trigger = tree.find('.tree-trigger.active');
		compressTreeSub(trigger);
	});

	$('body').on('click', '.reorder-btn[data-tree]', function(){
		var reorderBtn = $(this);
		reorderBtn.prop('disabled', true)
			.next('.save-btn')
			.fadeIn(100);

		$(this).next('.save-btn').click(function(event) {
			reorderBtn.prop('disabled', false);
			$(this).fadeOut(100);
			$('.tree-sub').sortable('destroy')
		});
		initSortable();
	});

	$('body').on('click', '.mig-request-link', function() {
        var element = this;
        var elementId = $(element).attr('rel');

        MigAjax.request(element, { 'eventArgument': elementId });
        return false;
    });

	function expandTreeSub(trigger) {
		$(trigger).addClass('active').parent('div').next().slideDown(400);
	}

	function compressTreeSub(trigger) {
		$(trigger).removeClass('active').parent('div').next().slideUp(400);
	}

	function initSortable(){
		$('.tree-sub, .tree-structure').sortable({
			placeholder: 'tree-placeholder',
			items: '> .tree-item',
			start: function(event, ui){
				compressTreeSub(ui.item.find('.tree-trigger'));
			},

			stop: function(){
				fillHidden();
			}
		});
	}

	function fillHidden(){
		var treeJson = [];

		$('.tree-structure, .tree-sub').each(function(index, el) {
			var treeItem = {};

			var parent = $(this).closest('.tree-item').attr('id');
			treeItem.parent = parent;
			treeItem.children = [];

			$(this).children('.tree-item').each(function(index, el) {
				treeItem.children.push( $(this).attr('id') );
			});

			treeJson.push(treeItem);
		});
		
		$('.tree-hidden').val(JSON.stringify(treeJson));
	}
})();