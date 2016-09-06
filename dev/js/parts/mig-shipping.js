(function ($) {
    var methods = {
        init: function (element, settings) {
            var self = this;
            this.rootElem = $(element);
            this.priceTableBody = this.rootElem.find('tbody.price');
            this.weightTableBody = this.rootElem.find('tbody.weight');
            this.countTableBody = this.rootElem.find('tbody.count');
            this.hiddenInput = this.rootElem.find('.shipp-hidden');

            settings = this.hiddenInput.val().length !== 0 ? $.parseJSON(this.hiddenInput.val()) : settings;

            if (settings && settings.weight && settings.weight.length > 0) {
                self.buildTables('weight', settings.weight);
            }

            if (settings && settings.price && settings.price.length > 0) {
                self.buildTables('price', settings.price);
            }

            if (settings && settings.count && settings.count.length > 0) {
                self.buildTables('count', settings.count);
            }

            if (settings && settings.promotions && settings.promotions.length > 0) {
                self.buildTables('promotions', settings.promotions);
            }

            self.bindEvents();
        },

        buildTables: function (property, tableValues) {
            var table = $(this.rootElem).find('.' + property);

            tableValues.forEach(function (item) {
                var row = $('<tr/>'),
					inputFrom = $('<td><input type="text" data-shipping="from"  class="mig-form-control numeric" value="' + item.from + '" /></td>'),
					inputTo = $('<td><input type="text" data-shipping="to" class="mig-form-control numeric" value="' + item.to + '" /></td>'),
					inputPrice = $('<td><input type="text" data-shipping="price" class="mig-form-control numeric" value="' + item.price + '"/></td>'),
					deleteBtn = $('<td><input class="button blue-btn ship-delete" type="submit" value="Delete" /></td>');

                inputFrom.appendTo(row);
                inputTo.appendTo(row);
                inputPrice.appendTo(row);
                deleteBtn.appendTo(row);

                row.appendTo(table);
            });
        },

        bindEvents: function () {
            var self = this;

            // radio-buttons event, show price/weight table
            //self.rootElem.find('input[type=radio]').change(function(){
            //	self.rootElem.find('.shipping-table').show();
            //	if ($(this).attr('id').indexOf('Price') > -1){
            //	    self.weightTableBody.hide().removeClass('active');
            //	    self.countTableBody.hide().removeClass('active');
            //		self.priceTableBody.show().addClass('active');
            //	} else if ($(this).attr('id').indexOf('Weight') > -1) {
            //		self.priceTableBody.hide().removeClass('active');
            //		self.weightTableBody.show().addClass('active');
            //		self.countTableBody.hide().removeClass('active');
            //	}
            //	else {
            //	    self.priceTableBody.hide().removeClass('active');
            //	    self.weightTableBody.hide().removeClass('active');
            //	    self.countTableBody.show().addClass('active');
            //	}

            //});

            // delete 'row' event
            $('body').on('click', '.ship-delete', function () {
                $(this).parents('tr').remove();
            });

            // input only for numbers
            $('body').on('keyup', '.numeric', function () {
                $(this).val($(this).val().replace(/[^\d\.]/g, ''));
            });

            // add new row to active table with empty fields
            self.rootElem.find('.add-shipp').click(function () {
                var content = $('<tr><td><input type="text" data-shipping="from" class="mig-form-control numeric" /></td><td><input type="text" data-shipping="to" class="mig-form-control numeric" /></td><td><input type="text" data-shipping="price" class="mig-form-control numeric" /></td><td><input class="button blue-btn ship-delete" type="submit" value="Delete" /></td></tr>');
                content.appendTo(self.rootElem.find('tbody.active'));
            });

            self.rootElem.find('.save-shipp').click(function () {
                self.parseAndSave();
            });
        },

        parseAndSave: function () {
            var tableContent = this.rootElem.find('tbody.active'),
				resultObj = {};

            resultObj['error'] = false;

            tableContent.each(function (tableIndex) {
                var tableName = $(this).data('type'),
					shippRows = $(this).find('tr');

                resultObj[tableName] = [];

                shippRows.each(function (rowIndex) {
                    var rowObj = {};

                    $(this).find('td').each(function (colIndex) {
                        var inputContent = $(this).find('input[type="text"]'),
							dataType = $(inputContent).data('shipping');

                        if (inputContent.length === 1) {
                            rowObj[dataType] = $(inputContent).val();
                        }
                    });

                    if (rowIndex != shippRows.length - 1) {
                        if (+rowObj.from > +rowObj.to) {
                            resultObj['error'] = true;
                        }
                    }

                    resultObj[tableName].push(rowObj);
                });
            });

            this.hiddenInput.val(JSON.stringify(resultObj));
        }
    };

    $.fn.shipping = function (settings) {
        return this.each(function () {
            var item = Object.create(methods);
            item.init(this, settings);
            $(this).data('shipping', item);
        });
    };

})(jQuery);

//$('#shipping-domestic').shipping({price: [{from: '1',to: '2',price: '3'},{from: '11',to: '22',price: '33'}],weight:[{from: 'qq',to: 'ee',price: 'ww'},{from: 'e',to: 'w',price: 'q'}]});
//$('#shipping-international').shipping({price: [{from: '1',to: '2',price: '3'},{from: '11',to: '22',price: '33'}],weight:[{from: 'qq',to: 'ee',price: 'ww'},{from: 'e',to: 'w',price: 'q'}]}); 
//settings example
// {
// 	price: [
// 		{
// 			from: '1',
// 			to: '2',
// 			price: '3'	
// 		},{
// 			from: '11',
// 			to: '22',
// 			price: '33'	
// 		}
// 	],
// 	weight: [
// 		{
// 			from: '',
// 			to: '',
// 			price: ''	
// 		},{
// 			from: '',
// 			to: '',
// 			price: ''	
// 		}
// 	]
// }