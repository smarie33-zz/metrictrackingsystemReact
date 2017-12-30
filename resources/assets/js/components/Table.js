import React, { Component } from 'react';

const Table = (props) => {

	return (
		<div className="row">
            <div className="col">
                {props.filedMetrics.length > 0 &&
                <div className="table-responsive">
                    <table className="table table-striped">
                        <tbody>
                            <tr>
                                <th>Metric Name</th>
                                <th>Data type</th>
                                { props.createTableHeaderDates() }
                            </tr>
                            { props.createTableRows() }
                        </tbody>
                        
                    </table>
                </div>
                }
                {props.filedMetrics.length < 1 &&
                    <h2>Add a metric to create the table</h2>
                }
            </div>
        </div>
	)
}

export default Table;