import React, { Component } from 'react';
import moment from 'moment';

const Formaddition = (props) => {
 
  return(
	    <div className="col-md pb-3 pt-3 bg-light">
	        <legend id="root__title">Metric Being Built</legend>
	        <div className="sm-metrics-display">
	            <h4 className="sm-metric-name">{props.createMetricName}</h4>
	            <div className="sm-metric-type">{props.createMetricType}</div>
	            {props.createMetricData.length != 0 &&
	                <div className="sm-metric-datas">
	                { props.outputMetricData() }
	                </div>
	        	}
	        </div>
	        {props.error != '' &&
	        	<div className="text-danger">{props.error}</div>
	    	}
	        {props.createMetricData.length != 0 &&
	            <div className="sm-save-metric-holder">
	                <button className="btn btn-primary save-metric" type="submit" onClick={(e) => props.saveMetricData(e)}>Save Metric To Database</button>
	            </div>
	        }
	    </div>
	)
}
 
export default Formaddition;