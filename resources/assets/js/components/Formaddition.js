import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

const Formaddition = (props) => {
 
  return(  
    	 <div className="row sm-padding-top-20">
            <div className="col-xs-4">
                <h3>Add Metric</h3>
		    	<form action="" id="sm-create-metric">
		    		<div className="form-group">
		    			<label htmlFor="addMetric">Metric Name</label>
		    			<input type="text" className="form-control" value={props.createMetricName} id="addMetric" placeholder="IE: End Costs" onChange={(e) => props.listenToInput(e, 'createMetricName')} />
		    		</div>
		    		
		    		<div className="form-group">
		    			<label htmlFor="addMetricType">Choose Metric Type</label>
		    			<select className="form-control" id="addMetricType" value={props.createMetricType} onChange={(e) => props.listenToInput(e, 'createMetricType')}>
						  <option value="Integer">Integer</option>
						  <option value="Decimal">Decimal</option>
						</select>
					</div>
		    		<hr />
					<div className="form-group">
		    			<label htmlFor="addMetricData">Add Metric Data</label>
		    			<input type="text" className="form-control" id="addMetricData" value={props.currentMetricPoint} placeholder="" size="10" onChange={(e) => props.listenToInput(e, 'currentMetricPoint')} />
		    		</div>

		    		<div className="form-group">
		    			<label htmlFor="addMetricDate">Add Metric Date</label>
		    			<DatePicker
						  selected={props.currentMetricDate}
						  onChange={props.selectDate}
						  className="form-control" />
		    		</div>
					<input className="btn btn-default add_metric" type="submit" type="submit" value="Add Metric Data Point" onClick={(e) => props.addMetricPoint(e)} />
		    	</form>
	        </div>
            <div className="col-xs-6">
                <h3>Current Metric</h3>
                <div className="sm-metrics-display">
                    <h4 className="sm-metric-name">{props.createMetricName}</h4>
                    <div className="sm-metric-type">{props.createMetricType}</div>
                    {props.createMetricData.length != 0 &&
	                    <div className="sm-metric-datas">
	                    { props.outputMetricData() }
		                </div>
	            	}
                    <div id="sm-list-error"></div>
                </div>
                {props.createMetricData.length != 0 &&
	                <div className="sm-save-metric-holder">
	                    <button className="btn btn-default save-metric" type="submit" onClick={(e) => props.saveMetricData(e)}>Save Metric To Database</button>
	                </div>
	            }
            </div>
        </div>
	)
}
 
export default Formaddition;