import React, { Component } from 'react';

const Formremoval = (props) => {
 
  return(
	  	<div className="row mb-5">
		    <div className="col-md-6 pb-3 pt-3">
		        <legend id="root__title">Remove Metric</legend>
		        <h6 className="text-warning">The actions taken here cannot be undone</h6>
		        <form>
		            <div className="form-group mt-4">
		            	<label htmlFor="deleteFullMetric">Delete entire Metric from Database</label>
		            	<select id="deleteFullMetric" className="custom-select" onChange={(e) => props.listenToInput(e, 'mDeleteDDSelected')}>
		            	{ props.outputMetricNamesForSelect() }
						</select>
					</div>
					<button className="btn btn-primary delete-metric" type="submit" onClick={(e) => props.deleteMetricFromDB(e)}>Delete Entire Metric</button>
		        </form>
		    </div>
		    <div className="col-md-6 pb-3 pt-3">
		    	<legend id="root__title">Remove Metric Points</legend>
		    	<h6 className="text-warning">The actions taken here cannot be undone</h6>
		        <form>
		            <div className="form-group mt-4">
		            	<label htmlFor="deleteMetricPoints">Delete selected Metric data from Database</label><br />
						{ props.outputMetricDataForSelect() }
					</div>
					<button className="btn btn-primary delete-metric-data" type="submit" onClick={(e) => props.deleteMetricDataFromDB(e)}>Delete Metric Point(s)</button>
		        </form>
		        {props.error != '' &&
		        	<div className="text-danger">{props.error}</div>
		    	}
		    </div>
		</div>
	)
}
 
export default Formremoval;