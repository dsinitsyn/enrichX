$(function(){
	$('body').on('click', '.mig-shipping-name', function(){
		var countryName = $(this).html(),
			countryCode = $(this).data('countrycode'),
			countryContainer = $('<tr></tr>'),
			countrySettings = $('#country-settings tbody'),
			select = $("<select>", {
				html: $('<option value="1">Domestic</option><option value="2">International</option>')
			});

		//$(this).parent().remove();

		$('<td  class="mig-shipping-name mig-shipp-search-name" data-countrycode="' + countryCode + '"></td>').append(countryName).appendTo(countryContainer);
		$('<td class="migDropdown"></td>').append(select).appendTo(countryContainer);
		$('<td></td>').append('<a class="mig-inset-btn delete  ship-delete" href="test4.html" name="Delete row" title="Delete"></a>').appendTo(countryContainer);
		
		$(select).migDropdown();

		countryContainer.appendTo(countrySettings);

		parseCountriesData();
	});

	$('body').on('click', '.ship-delete', function(event){
		event.preventDefault();

		var countryRow = $(this).parents('tr'),
			countryElem = countryRow.find('.mig-country-name'),
			countryCode = countryElem.data('countrycode'),
			countryName = countryElem.html(),
			newRow;

		countryRow.remove();
		
		newRow = $('<tr></tr>').append($('<td class="mig-shipping-name mig-shipp-search-name" data-countrycode="' + countryCode + '" >' + countryName + '</td>'));
		newRow.appendTo($('#country-list').find('tbody'));

		parseCountriesData();	
	});

	$('#country-settings').on('change', 'select', function(){
		parseCountriesData();
	});

	// save data on page load
	parseCountriesData();
});

// parsing table, and saving data to hidden field
function parseCountriesData(){
	var countryRows = $('#country-settings tbody tr'),
		resultObj = {
			countries: []
		};

	countryRows.each(function(rowIndex){
		var rowData = {};

		$(this).find('td').each(function(tdIndex){
			if ($(this).hasClass('mig-country-name')){
				rowData['name'] = $(this).html();
				rowData['countrycode'] = $(this).data('countrycode');
			}

			if ($(this).hasClass('mig-country-dropdown')){
				rowData['type'] = $(this).find('option:selected').val()
			}
		});

		resultObj['countries'].push(rowData);
	});

	$('.countries-result').val(JSON.stringify(resultObj));
}

// building table with countries and selects
function buildCountries(obj){
	var countryContainer = $('#country-settings tbody');

	if (obj.countries.length > 0){
		obj.countries.forEach(function(item){
			var row = $('<tr></tr>'),
				select = $("<select>", {
					html: $('<option value="1">Domestic</option><option value="2">International</option>')
				});

			select.val(item.type);

			$('<td class="mig-country-name mig-shipp-search-name" data-countrycode="' + item.countrycode + '"></td>').html(item.name).appendTo(row);
			$('<td class="migDropdown"></td>').append(select).appendTo(row);
			$('<td></td>').append('<a class="mig-inset-btn delete ship-delete" href="test4.html" name="Delete row" title="Delete"></a>').appendTo(row);		
			$(select).migDropdown();
			countryContainer.append(row);
		});
	}
}

// domestic - 1
// international - 2

// Call example
//buildCountries({countries: [{name: 'RUSSIA 1', type: '1', countrycode: 'AA1'},{name: 'РАИССЯ 2',type: '2', countrycode: 'AA2'},{name: 'РАИССЯ 3',type: '2', countrycode: 'AA3'}]});

// JSON example
// {
// 	countries: [
// 		{
// 			name: 'ЮЭСЭЙ',
// 			type: '1',
// 			countrycode: 'AA1'
// 		},{
// 			name: 'РАИССЯ МАТЬ'
// 			type: '2'
// 			countrycode: 'AA2'
// 		}
// 	],
// }