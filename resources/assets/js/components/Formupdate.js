import React, { Component } from 'react';

const Formupdate = (props) => {
 
  return(  
	    <div>
	        <legend id="root__title">Update Metric</legend>
	        <form className="mb-4">
	            <div className="form-group mt-4">
	            	<label htmlFor="deleteFullMetric">Update Metric Name</label>
	            	<select id="deleteFullMetric" className="form-control" value={props.mUpdateDDSelected} onChange={(e) => props.listenToInput(e, 'mUpdateDDSelected')}>
	            	{ props.outputMetricNamesForSelect() }
					</select>
					<input type="text" className="mt-3 form-control" value={props.mUpdateMetricSelected} placeholder="add new metric name here" onChange={(e) => props.listenToInput(e, 'mUpdateMetricSelected')} />
				</div>
				{props.error != '' &&
		        	<div className="text-danger mb-3">{props.error}</div>
		    	}
				<button className="btn btn-primary update-metric" type="submit" onClick={(e) => props.updateMetricFromDB(e)}>Update Metric Name</button>
	        </form>
	    </div>
	)
}
 
export default Formupdate;