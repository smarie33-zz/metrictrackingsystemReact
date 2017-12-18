$(function() {

	var errors = ['Only numbers you bum!', 'Hey.. HEY only numbers and decimals please'];
	var checkType;

	$('#addMetric').keyup(function() {
		$('.sm-metric-name').text($(this).val());
		$('.sm-metric-type').text($('#addMetricType option:selected').text());
		if($.trim($('.sm-metric-datas').text()) != ''){
			$('.sm-save-metric-holder').removeClass('sm-hide');
		}
	});

	$('#addMetricType').change(function() {
		$('.sm-metric-type').text($(this).children('option:selected').text());
		checkType = $(this).children('option:selected').val();
		if(checkType == 'digits'){
			$('#addMetricData').attr('data-parsley-required-message', errors[0]);
		}else{
			$('#addMetricData').attr('data-parsley-required-message', errors[1]);
		}
		$('#addMetricData').attr('data-parsley-type', checkType);
		if($('.sm-metric-point-holder').length > 0){
			checkIfDatasAreCorrect(checkType);
		}		
	});

	$('body').on('click', '.sm-delete-point', function(){
		$(this).parent('.sm-metric-point-holder').remove();
		if($('.sm-metric-point-holder').length < 1){
			$('.sm-metric-datas').addClass('sm-hide');
			$('.sm-save-metric-holder').addClass('sm-hide');
		}
	})

	$('#addMetricDate').datepicker({
		onSelect: function(date) {
            $('#addMetricDate').next('.parsley-errors-list').remove();
            $('#addMetricDate').removeClass('parsley-error');
        }
	});

	$('#sm-create-metric').parsley().on('field:validated', function() {
	    var ok = $('.parsley-error').length === 0;
	  })
	  .on('form:submit', function(e) {
	  	e.preventDefault;
	  	e.stopPropagation;
	  	var mdata = $('#addMetricData').val();
	  	if(checkType == 'number'){
	  		if(mdata.indexOf(".")==-1){
	  			mdata = mdata+'.00';
	  		}
	  	}
		var mdate = $('#addMetricDate').val();
		var oldHtml = $('.sm-metric-datas').html();
		var newHtml = '<div class="sm-metric-point-holder"><div class="sm-metric-date visible-xs-inline-block visible-sm-inline-block visible-md-inline-block visible-lg-inline-block">'+mdate+'</div><div class="sm-metric-point visible-xs-inline-block visible-sm-inline-block visible-md-inline-block visible-lg-inline-block">'+mdata+'</div><span class="sm-delete-point glyphicon glyphicon-remove"></span></div>';
		$('.sm-metric-datas').removeClass('sm-hide');
		$('.sm-metric-datas').html(oldHtml+newHtml);
		if($.trim($('.sm-metric-name').text()) != ''){
			$('.sm-save-metric-holder').removeClass('sm-hide');
		}
		$('#addMetricData').val('');
		$('#addMetricDate').val('');
	    return false;
	  });

	  window.Parsley.addValidator('checkdates', {
		validate: function(value) {
		    return moment(value, "MM/DD/YYYY", true).isValid();
		  },
		  messages: {
		    en: 'This field must have a date formated: MM/DD/YYYY'
		  }
	  });

	  window.Parsley.addValidator('checkagainstdates', {
		  validate: function(value) {
 		  	if($('.sm-metric-point-holder').length == 0){
		  		return true;
		  	}else{
		  		var e = 0;
		  		$('.sm-metric-point-holder').each(function(){
		  			var listedDate = $(this).children('.sm-metric-date').text()
		  			if(moment(value).format('MM') == moment(listedDate).format('MM')){
		  				e++;
		  			}
		  		})
		  		return (e == 0) ? true : false;
		  	}
		  },
		  messages: {
		    en: 'There cannot be more than one data point in the same month'
		  }
	  });

	  window.Parsley.addValidator('checkdups', {
		validate: function(value) {
			var v = $.trim(value);
			var e = 0;
			$('.sm-metric-name-table').each(function(){
				if(v.toLowerCase() == $(this).text().toLowerCase()){
					e++;
				}
			})
			return (e == 0) ? true : false;
		  },
		  messages: {
		    en: 'This metric already exists'
		  }
	  });

	  function checkIfDatasAreCorrect(type){
	  	var e = 0;
		$('.sm-metric-point-holder').each(function(){
			var thisData = $(this).children('.sm-metric-point').text();
			if(thisData.indexOf(".")==-1){
	  			if(type == 'digits'){
	  				$(this).removeClass('sm-error-bg');
		  		}else{
		  			$(this).addClass('sm-error-bg');
		  			e++;
		  		}
	  		}else{
	  			if(type == 'digits'){
	  				$(this).addClass('sm-error-bg');
		  			e++;	  				
	  			}else{
	  				$(this).removeClass('sm-error-bg');
	  			}
	  		}
		})
		if(e > 0 && type == 'digits'){
			$('#sm-list-error').text('The highlighted data points cannot have decimals');
		}else{
			$('#sm-list-error').text('The highlighted data points need have decimals');
		}
		if(e == 0){
			resetErrors();
		}
	  }

	  function resetErrors(name, type, metrics, newDates){
	  	$('#sm-list-error').text('');
	  }
 
	  $('.save-metric').click(function(e){
        	e.preventDefault();
        	//console.log('meta', $('meta[name="csrf-token"]').attr('content'));
        	//console.log('token', $('[name="_token"]').val());
        	var metricName = $('.sm-metric-name').text();
        	var type = $('.sm-metric-type').text();
        	var metrics = {};
        	var datesEntered = [];
        	$('.sm-metric-point-holder').each(function(index){
        		metrics[index] = {
        			'date': moment($(this).children('.sm-metric-date').text()).format('YYYY-MM-DD'),
        			'num': $(this).children('.sm-metric-point').text()
        		};
        		datesEntered.push(moment($(this).children('.sm-metric-date').text()).format('YYY-MM-01'));
        	})
		    $.ajax({
			    url: '/save-metric',
			    headers: {
			    	'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
			    },
			    type: "post",
			    data: {'_token': $('[name="_token"]').val(), 'metricName': metricName, 'type': type, 'metrics': metrics, 'addDates': datesEntered},
			    dataType: 'JSON',
			    success: function (data) {
			    	addToTable(metricName, type, metrics, data);
			    },
			    error: function (request, status, error) {
			        alert('There was a problem saving: '+request.responseText);
			    }
			});
      });

});