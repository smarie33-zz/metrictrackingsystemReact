<div class="row sm-padding-top-20">
    <div class="col-xs-4">
    	<h3>Add Metric</h3>
    	<form action="" id="sm-create-metric">
    		{{csrf_field()}}
    		<div class="form-group">
    			<label for="addMetric">Metric Name</label>
    			<input type="text" class="form-control" id="addMetric" data-parsley-trigger="change" placeholder="IE: End Costs" data-parsley-checkdups="">
    		</div>
    		
    		<div class="form-group">
    			<label for="addMetricType">Choose Metric Type</label>
    			<select class="form-control" id="addMetricType">
				  <option value="digits" selected>Integer</option>
				  <option value="number">Decimal</option>
				</select>
			</div>
    		<hr>
			<div class="form-group">
    			<label for="addMetricData">Add Metric Data</label>
    			<input type="text" class="form-control" id="addMetricData" placeholder="" size="10" data-parsley-trigger="change" data-parsley-type="digits" required="" data-parsley-required-message="Only numbers you bum!">
    		</div>

    		<div class="form-group">
    			<label for="addMetricDate">Add Metric Date</label>
    			<input type="text" class="form-control" id="addMetricDate" placeholder="" data-parsley-trigger="change" data-parsley-checkdates="" data-parsley-checkagainstdates="" required="">
    		</div>
			<input class="btn btn-default add_metric" type="submit" type="submit" value="Add Metric Data Point">
    	</form>
    </div>
    <div class="col-xs-4">
    	<h3>Current Metric</h3>
		<div class="sm-metrics-display">
			<h4 class="sm-metric-name"></h4>
			<div class="sm-metric-type"></div>
			<div class="sm-metric-datas sm-hide"></div>
			<div id="sm-list-error"></div>
		</div>
		<div class="sm-save-metric-holder sm-hide"><button class="btn btn-default save-metric" type="submit">Save Metric To Database</button></div>
    </div>
</div>