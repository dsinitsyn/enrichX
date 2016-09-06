// Visual options and markup 
var chart = {
	chartsList: []   					// List of existing charts
}

Chart.defaults.global.defaultFontSize = 16;
// Object example

var chartObj = {
	type       : 'line',
	name       : 'Orders',
	chartTitle : 'Orders22',
	datasets   : [{
		        	lineTension: 0,
		            label           : 'May',
		            data            : [1, 3, 20, 13, 50, 8],
		            backgroundColor : 'rgba(50, 156, 54, 0.1)',
		            borderColor     : 'rgba(50, 156, 54, 0.9)',
		            borderWidth     : 3
		        },
				{
		        	lineTension: 0,
		            label           : 'June',
		            data            : [10, 30, 200, 130, 500, 80],
		        	backgroundColor : 'rgba(50, 156, 54, 0.1)',
		            borderColor     : 'rgba(50, 156, 54, 0.9)',
		            borderWidth     : 3
		        }],
	labels     : ["May", "June", "July", "August", "September", "October"],
	chartWidth : 6,
	showAxis   : true
}
chartObj = JSON.stringify(chartObj);
function createChart(chartObj) {
	chartObj = JSON.parse(chartObj);
	var source = $('#chart-template').html(),
		template = Handlebars.compile(source);
	$('#charts-category').append(template(chartObj));
	if(chartObj.datasets.length) {
		var ctx = document.getElementById("chart-" + chartObj.name);
		var newChart = new Chart(ctx, {
		    type: chartObj.type,
		    data: {
		        labels: chartObj.labels,
		        datasets: chartObj.datasets
		    },
		    options: {
		    	legend: {
					display: false,
		    		labels: {
		    			fontSize: 20
		    		}
		    	},
		    	responsive: true,
		        scales: chartObj.showAxis == true ? {
		            yAxes: [{
		                ticks: {
		                    beginAtZero: true
		                }
		            }],
		            xAxes: [{
		                ticks: {
		                    beginAtZero: true
		                }
		            }]
		        }
				:
				false,
				scale: 'linear'
		    }
		});
		$('.chart-datepicker').each(function() {
			if(!$(this).hasClass('hasDatepicker')) {

				$( this ).datepicker({
					dateFormat: 'dd-mm-yy',
			      	prevText: '<i class="icon-nav-left"></i>', 
			      	nextText: '<i class="icon-nav-right"></i>',
				    dayNamesMin: $.datepicker._defaults.dayNamesShort,
				    firstDay: 1,
				    beforeShow: function (input, inst) {
				        var rect = input.getBoundingClientRect();
				        setTimeout(function () {
					        inst.dpDiv.css({ top: rect.top, left: rect.width + rect.left + 10 });
				        }, 0);
				    }
				});
			}
			
		});
	} else {
		$('.chartBody:last .filters').hide();
		$('.chartBody:last .emptyChart').show();
	}
	

	chart.chartsList.push(newChart);
};

function updateChart(name, newChartObj) {
	newChartObj = JSON.parse(newChartObj);
	$.each(chart.chartsList, function(i, item) {
		if(item.chart.canvas.id.indexOf(name) > -1) {
			item.chart.config.data = {
				labels: newChartObj.labels,
				datasets: newChartObj.datasets
			};
			item.update();
		};
	});
};

$(document).delegate('.beginRange', 'change', function(event) {
	event.preventDefault();
	$(this).siblings('.endRange').datepicker('option', 'minDate', $(this).datepicker().val());
	$('.endRange').datepicker('option', 'maxDate', '+30Y');
});

$(document).delegate('.endRange', 'change', function(event) {
	event.preventDefault();
	$(this).siblings('.beginRange').datepicker('option', 'maxDate', $(this).datepicker().val());
	$('.beginRange').datepicker('option', 'minDate', '-30Y');
});

$(document).delegate('.chart .tabs a', 'click', function(event) {
	event.preventDefault();
	
	MigAjax.request(this,{eventTarget:'cDrp' + $(this).closest('.chart').find('canvas').data('chartname'), eventArgument: $(this).attr('href')});
});



$(document).on('click', '.changeFilter', function(event) {
	event.preventDefault();
	$('.error').remove();
	//ajax
	var chartToUpdate = {
		name       : $(this).closest('.chart').find('canvas').data('chartname'),
		filterDate : $(this).closest('.filters').find('.beginRange').val() + ' - ' + $(this).closest('.filters').find('.endRange').val(),
	}
	if ($(this).closest('.filters').find('.beginRange').val().length == 0 || $(this).closest('.filters').find('.endRange').val().length == 0) {
		$(this).closest('.filters').append('<span class="error">Please, fill all fields</span>');
	} else {
		$('.error').remove();
		MigAjax.request(this,{eventTarget:'cBtn' + chartToUpdate.name, eventArgument: chartToUpdate.filterDate});
	}
	// Object example for updating
	/*
	var newChartObj = {
		labels   : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		datasets : [{
		        	lineTension: 0,
		            label           : 'Monday',
		            data            : [123, 331, 202, 133, 501, 83],
		            backgroundColor : 'rgba(180, 250, 132, 0.4)',
		            borderColor     : 'rgba(180, 250, 1, 0.9)',
		            borderWidth     : 1
		          },
				  {
		        	lineTension: 0,
		            label           : 'Tuesday',
		            data            : [20, 0, 100, 45, 300, 20],
		            backgroundColor : 'rgba(180, 100, 132, 0.4)',
		            borderColor     : 'rgba(180, 20, 200, 0.9)',
		            borderWidth     : 1
		          }]
	}
	updateChart(chartToUpdate.name, newChartObj);
	*/
});


// Launch function

if ($('#charts-category').length) {
	createChart(chartObj);
}
