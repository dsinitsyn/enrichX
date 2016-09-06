var itemListModule = (function(){
    $(function(){
        $('.mig-multicheck-block').on('click', 'input[type=checkbox]', function () {
            var block = $(this).closest('.mig-multicheck-block');
            createJson(block);
        });

        $('.mig-multicheck-block').on('click', '.mig-deselect', function () {
            var block = $(this).closest('.mig-multicheck-block');
            block.find('input[type=checkbox]:checked').prop('checked', false);
            block.find('input[type=hidden]').val('');
        });
    })  

    function getItemList(url) {
        $.get(url, function (data) {
            var dataObj = JSON.parse(data);

            jQuery.each(dataObj, function(i){
                createList(dataObj[i], i);
            })
            
        }).done(function () {
            // $('.mig-multi-loader').detach();

            $('.mig-multicheck-block').each(function () {
                createJson($(this));
            });

            $('.mig-promo-search').promoSearch();
        });
    }

    function createList(data, type) {
        jQuery.each(data, function (i, array) {
            var id = array.code || array.id;

            var input = $('<input>', {
                type: 'checkbox',
                value: array.id,
                id: type + 'Id-' + id,
                checked: array.active
            });

            var label = $('<label/>', {
                text: array.name,
                for: type + 'Id-' + id
            });

            array.parent_id && treePaddings(type);

            var listItem = $('<li/>', {
                'data-id': array.id,
                'data-parentid': array.parent_id
            }).append(input, label);

            var listElement = '.mig-mc-' + type;

            $(listElement.toString()).find('ul').append(listItem);
        });
    }

    function treePaddings(type) {
        var listElement = '.mig-mc-' + type,
            listItem = $(listElement).find('li'),
            depthPadding = 20;

        listItem.each(function (index) {
            var prevElem = $(this).prev(),
                thisLabel = $(this).find('label');
            if (prevElem.length > 0) {
                if ($(this).data('parentid') === -1) {
                    return true;
                }

                if (prevElem.data('id') === $(this).data('parentid')) {
                    return thisLabel.css('padding-left', parseInt(prevElem.find('label').css('padding-left')) + depthPadding + 'px');
                }

                if (prevElem.data('parentid') === $(this).data('parentid')) {
                    return thisLabel.css('padding-left', prevElem.find('label').css('padding-left'));
                }

                var parentElem = listItem.parent().find('li[data-id="' + $(this).data('parentid') + '"]').find('label');
                thisLabel.css('padding-left', parseInt(parentElem.css('padding-left')) + depthPadding + 'px');
            }
        });
    }

    function createJson(block) {
        var jsonObj = [];
        block.find("input[type=checkbox]:checked").each(function () {
            var argument = $(this).val();
            item = {}
            item['id'] = argument;
            jsonObj.push(item);
        });

        jsonString = JSON.stringify(jsonObj);
        block.find('input[type=hidden]').val(jsonString);
    }

    return {
        getItemList : getItemList
    }
})();