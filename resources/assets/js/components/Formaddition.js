import React, { Component } from 'react';

const Formaddition = (props) => {
 
 
  //if the props product is null, return Product doesn't exist
  // if(!product) {
  //   return(<div style={divStyle}>  Product Doesnt exist </div>);
  // }
     
  //Else, display the product data
  return(  
    <div className="row sm-padding-top-20">
	    <div className="col-xs-4">
	    	<h3>Add Metric</h3>
	    	<form action="" id="sm-create-metric">
	    		<div className="form-group">
	    			<label for="addMetric">Metric Name</label>
	    			<input type="text" className="form-control" id="addMetric" data-parsley-trigger="change" placeholder="IE: End Costs" data-parsley-checkdups="" />
	    		</div>
	    		
	    		<div className="form-group">
	    			<label for="addMetricType">Choose Metric Type</label>
	    			<select className="form-control" id="addMetricType">
					  <option value="digits" selected>Integer</option>
					  <option value="number">Decimal</option>
					</select>
				</div>
	    		<hr />
				<div className="form-group">
	    			<label for="addMetricData">Add Metric Data</label>
	    			<input type="text" className="form-control" id="addMetricData" placeholder="" size="10" data-parsley-trigger="change" data-parsley-type="digits" required="" data-parsley-required-message="Only numbers you bum!" />
	    		</div>

	    		<div className="form-group">
	    			<label for="addMetricDate">Add Metric Date</label>
	    			<input type="text" className="form-control" id="addMetricDate" placeholder="" data-parsley-trigger="change" data-parsley-checkdates="" data-parsley-checkagainstdates="" required="" />
	    		</div>
				<input className="btn btn-default add_metric" type="submit" type="submit" value="Add Metric Data Point" />
	    	</form>
	    </div>
	    <div className="col-xs-4">
	    	<h3>Current Metric</h3>
			<div className="sm-metrics-display">
				<h4 className="sm-metric-name"></h4>
				<div className="sm-metric-type"></div>
				<div className="sm-metric-datas sm-hide"></div>
				<div id="sm-list-error"></div>
			</div>
			<div className="sm-save-metric-holder sm-hide"><button className="btn btn-default save-metric" type="submit">Save Metric To Database</button></div>
	    </div>
	</div>
  )
}
 
export default Formaddition;