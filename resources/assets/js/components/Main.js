import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {render} from 'react-dom';
import Formaddition from './Formaddition';

export default class Main extends Component {
    constructor() {
        super();
        this.state = {
            filedMetrics: [],
            dates: []
        }
    }
    componentDidMount() {
        fetch('/metrics')
            .then(response => {
                return response.json();
            })
            .then(tableAssets => {
                console.log(tableAssets)
                this.setState({ filedMetrics: tableAssets['filedMetrics'], dates: tableAssets['dates'] })
            });
    }
    createTableHeaderDates() {
        return this.state.dates.map((date, index) => {
            return (
                <th key={index}>
                    {date.formatted}
                </th>     
            );
        })
    }
    createTableRows() {
        return this.state.filedMetrics.map((metric, index) => {
            return (
                <tr key={index}>
                    <td className="sm-metric-name-table" data-id={metric.id}>{metric.name}</td>
                    <td>{metric.type}</td>
                    { this.getDataForRows(metric.metrics) }
                </tr>     
            );
        })
    }
    getDataForRows(metrics) {
        return metrics.map((data, index) => {
            return (
                <td key={index} data-id={data.id}>{data.point}</td>
            );
        })
    }
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        <table className="table table-striped">
                            <tbody>
                                <tr>
                                    <th>Metric Name</th>
                                    <th>Data type</th>
                                    { this.createTableHeaderDates() }
                                </tr>
                                { this.createTableRows() }
                            </tbody>
                            
                        </table>
                    </div>
                </div>
                <Formaddition check={this.state.dates} />
            </div>
        );
    }
}

if (document.getElementById('root')) {
    ReactDOM.render(<Main />, document.getElementById('root'))
}
