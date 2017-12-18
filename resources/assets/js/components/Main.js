import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {render} from 'react-dom';

export default class Main extends Component {
    constructor() {
        super();
        this.state = {
            filedMetrics: [],
            dates: [],
            types: []
        }
    }
    componentDidMount() {
        fetch('/metrics')
            .then(response => {
                return response.json();
            })
            .then(tableAssets => {
                console.log(tableAssets)
                this.setState({ filedMetrics: tableAssets['filedMetrics'], dates: tableAssets['dates'], types: tableAssets['types'] })
            });
    }
    createTableRows() {
        let s = this.state;
        return s.filedMetrics.map((metric) => {
            return (
                <tr key="{metric.id}">
                    <td className="sm-metric-name-table" data-id="{metric.id}">{metric.name}</td>
                    {metric.metrics[0].i_number != null &&
                        <td>{{s.types.i}}</td>
                    }
                    {metric.metrics[0].d_number != null &&
                        <td>{{s.types.d}}</td>
                    }
                </tr>     
            );
        })
    }
    render() {
        return (
            <div className="row">
                <div className="col-xs-12">
                    <table className="table table-striped">
                        <tbody>
                            { this.createTableRows() }
                        </tbody>
                        
                    </table>
                </div>
            </div>
        );
    }
}

if (document.getElementById('root')) {
    ReactDOM.render(<Main />, document.getElementById('root'))
}
