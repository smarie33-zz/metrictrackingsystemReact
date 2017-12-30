import React, { Component } from 'react';

const Table = (props) => {

	return (
		<div className="row">
            <div className="col">
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
            </div>
        </div>
	)
}

export default Table;