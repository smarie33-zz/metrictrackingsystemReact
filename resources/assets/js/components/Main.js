import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {render} from 'react-dom';
import Formaddition from './Formaddition';
import Table from './Table';
import moment from 'moment';
import Moment from 'react-moment';

export default class Main extends Component {
    constructor() {
        super();
        this.state = {
            filedMetrics: [],
            dates: [],
            createMetricName: '',
            createMetricType: 'Integer',
            currentMetricPoint: '',
            currentMetricDate: moment(),
            createMetricData: [],
            newDates: []
        }
        this.deleteMetricPoint.bind(this)
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
    selectDate(date) {
        this.setState({currentMetricDate: date})
    }
    listenToInput(e, name) {
        this.setState({ [name]: e.target.value })
    }
    saveMetricData(e){
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        let s = this.state
        fetch( '/delete-metric', {
           method:'post',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
           },
            data: {'metricName': s.createMetricName, 'type': s.createMetricType, 'metrics': s.createMetricData, 'addDates': s.datesEntered},

           body: JSON.stringify(product)
       })
       .then(response => {
           return response.json();
       })
       .then( data => {
           //update the state of products and currentProduct
           // this.setState((prevState)=> ({
           //     products: prevState.products.concat(data),
           //     currentProduct : data
           // }))
       })
        return false;
    }
    addMetricPoint(e){
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        let addToData = this.state.createMetricData
        addToData.push({point: this.state.currentMetricPoint, date: this.state.currentMetricDate})
        this.state.newDates.push(this.state.newDates)
        this.setState({createMetricData: addToData, currentMetricPoint: '', currentMetricDate: moment()})
        return false;
    }
    deleteMetricPoint(place){
        let removeData = this.state.createMetricData.slice()
        let removed = removeData.splice(place, 1)
        let removeDate = this.state.newDates.slice()
        let removeDateD = removeData.newDates(place, 1)
        this.setState({createMetricData: removeDate})
    }
    outputMetricData() {
        return this.state.createMetricData.map((metric, index) => {
            return (
                <div key={index} classNalet removedD = removeData.splice(place, 1)me="sm-metric-point-holder">
                    <div className="sm-metric-date visible-xs-inline-block visible-sm-inline-block visible-md-inline-block visible-lg-inline-block">
                        <Moment format="MM/DD/YYYY">
                            {metric.date}
                        </Moment>
                    </div>
                    <div className="sm-metric-point visible-xs-inline-block visible-sm-inline-block visible-md-inline-block visible-lg-inline-block">
                        {metric.point}
                    </div>
                    <span className="sm-delete-point glyphicon glyphicon-remove" onClick={() => this.deleteMetricPoint(index)}></span>
                </div>
            );
        })
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
                <Table 
                    createTableHeaderDates={this.createTableHeaderDates.bind(this)}
                    createTableRows={this.createTableRows.bind(this)} />
                <Formaddition 
                    createMetricName={this.state.createMetricName}
                    createMetricType={this.state.createMetricType}
                    addMetricData={this.addMetricData.bind(this)}
                    createMetricData={this.state.createMetricData}
                    currentMetricDate={this.state.currentMetricDate}
                    currentMetricPoint={this.state.currentMetricPoint}
                    addMetricPoint={this.addMetricPoint.bind(this)}
                    listenToInput={this.listenToInput.bind(this)}
                    selectDate={this.selectDate.bind(this)}
                    outputMetricData={this.outputMetricData.bind(this)}  />                    
            </div>
        );
    }
}

if (document.getElementById('root')) {
    ReactDOM.render(<Main />, document.getElementById('root'))
}
