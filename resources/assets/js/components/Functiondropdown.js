import React, { Component } from 'react';

const MetricFunctionDropdown = (props) => {
 
  return(
  		<div className="row mb-3">
  			<div className="col">
			  	<div className="form-group">
				    <label htmlFor="metricFunctionDropdown">What would you like to do to the metrics?</label>
				    <select className="form-control" id="metricFunctionDropdown" onChange={(e) => props.listenToInput(e, 'metricFunction')}>
					    <option value="add-metric">Add Metric</option>
					    <option value="update-metric">Update Metric</option>
					    <option value="remove-metric">Remove Metric</option>
				    </select>
				</div>
			</div>
		</div>
	)
}
 
export default MetricFunctionDropdown;