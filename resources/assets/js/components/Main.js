import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {render} from 'react-dom';
import Formaddition from './Formaddition';
import Formremoval from './Formremoval';
import Formupdate from './Formupdate';
import Table from './Table';
import MetricFunctionDropdown from './Functiondropdown';
import moment from 'moment';
import Moment from 'react-moment';
import Form from 'react-jsonschema-form';
import * as fs from './FormSchemas';

const log = (type) => console.log.bind(console, type)

function transformErrors(errors) {
    return errors.map(error => {
        if (error.property ==='.metricDataI') {
            error.message = 'Numbers only ppplleeeaaasssseeee'
        }
        if (error.property ==='.metricDataD') {
            error.message = 'Hey hey hey! Number or decimal'
        }
        return error;
    });
}

function findDuplicates(data) {
    let result = []
    data.forEach(function(element, index) {
        if (data.indexOf(element, index + 1) > -1) {
            if (result.indexOf(element) === -1) {
                result.push(element);
            }
        }
    })
  return result
}

const changeFormData = fs.changeFormData
const changeSchema = fs.changeSchema
const changeUiSchema = fs.changeUiSchema
const schema = fs.schema
const updateSchema = fs.updateSchema
const updateUiSchema = fs.updateUiSchema
const updateFormData = fs.updateFormData

export default class Main extends Component {
    constructor() {
        super();
        this.state = {
            'filedMetrics': [],
            'dates': [],
            'createMetricName': '',
            'createMetricType': '',
            'createMetricData': [],
            'datesEntered': [],
            'errorRemoval': '',
            'errorAddition': '',
            'errorUpdate': '',
            'error': '',
            'mDeleteDDSelected': 0,
            'mDeletepSelected': '',
            'mUpdateDDSelected': 0,
            'mUpdateMetricSelected': '',
            'metricFunction': 'add-metric',
            schema,
            updateSchema,
            updateUiSchema,
            updateFormData,
        }
        this.deleteMetricPoint.bind(this)
        this.getMetrics.bind(this)
        this.checkMetricType.bind(this)
        this.pullUpdate.bind(this)
    } 
    componentDidMount() {
        this.getMetrics()
    }
    listenToInput(e, name) {
        if(name == 'mDeletepSelected'){
            this.setState({ [name]: [...e.target.options].filter(({selected}) => selected).map(({value}) => value) })
        }else if(name == 'mUpdateDDSelected'){
            this.setState({ [name]: e.target.value })
            this.pullUpdate(e.target.value)
        }else{
            this.setState({ [name]: e.target.value })
        }
    }
    saveMetricData(e) {
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        if(this.state.errorAddition == ''){
            let s = this.state
            fetch( '/save-metric', {
               'method':'POST',
               'headers': {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json',
               },
               'body': JSON.stringify({
                    'metricName': s.createMetricName,
                    'type': s.createMetricType,
                    'metrics': s.createMetricData,
                    'addDates': s.datesEntered
               })
            })
            .then(response => response.json())
            .then(data => {
                this.getMetrics()
                this.setState({errorAddition: '', createMetricData: [], error: '', createMetricType: '', 'createMetricName': '', datesEntered: []})
            })
            .catch(error => {
                this.setState({errorAddition: error.message})
           })
        }
    }
    getMetrics() {
        fetch('/metrics')
            .then(response => {
                return response.json();
            })
            .then(tableAssets => {
                this.setState({ filedMetrics: tableAssets['filedMetrics'], dates: tableAssets['dates'] })
                this.pullUpdate(0)
            });
    }
    pullUpdate(metricNameID){
        if(this.state.filedMetrics.length > 0){
            const filedMetrics = this.state.filedMetrics[metricNameID]
            let points = [];
            let nonstateS = updateSchema
            let nonstateU = updateUiSchema
            let nonstateD = updateFormData
            nonstateS.properties = {}
            nonstateS.required = []
            nonstateD = {}

            let pattern = ''
            let message = ''
            if(filedMetrics['type'] == 'Integer'){
                pattern = '^\\d*$'
                message = 'Numbers only ppplleeeaaasssseeee'
            }else{
               pattern = '^\\d+(\\.\\d+)?$'
               message = 'Hey hey hey! Number or decimal'
            }
            let compensate = 0
            for (let i = 0; i < filedMetrics['metrics'].length; i++) {
                const d = 'pointDate'+compensate
                const p = 'point'+compensate
                const id  = 'id'+compensate
                if(filedMetrics['metrics'][i]['point'] != ''){
                    compensate++
                }
                if(filedMetrics['metrics'][i]['point'] != ''){
                    nonstateS.properties[d] = {'type': 'string', 'format': 'date'},
                    nonstateS.properties[p] = {'type': 'string', 'pattern': pattern, 'message': message}
                    nonstateS.properties[id] = {'type': 'string'}
                    nonstateS.required.push(p)
                    nonstateU[d] = {'ui:options': {label: false}, classNames: 'mb-1'}
                    nonstateU[p] = {'ui:options': {label: false}, classNames: 'mb-4'}
                    nonstateU[id] = {'ui:widget': 'hidden'}
                    nonstateD[d] = filedMetrics['metrics'][i]['date']
                    nonstateD[p] = filedMetrics['metrics'][i]['point'].toString()
                    nonstateD[id] = filedMetrics['metrics'][i]['id'].toString()
                    this.setState({'updateSchema': nonstateS, 'updateFormData': nonstateD, 'updateUiSchema': nonstateU})
                }
            }
        }
    }
    addMetricToUpdateArea(e){
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        let nonstateS = updateSchema
        let nonstateU = updateUiSchema
        const s = this.state
        const newPos = (Object.keys(nonstateS.properties).length / 3)
        let pattern = ''
        let message = ''
        if(s.filedMetrics[s.mUpdateDDSelected]['type'] == 'Integer'){
                pattern = '^\\d*$'
                message = 'Numbers only ppplleeeaaasssseeee'
        }else{
           pattern = '^\\d+(\\.\\d+)?$'
           message = 'Hey hey hey! Number or decimal'
        }
        nonstateS.required.push('pointDate'+newPos)
        nonstateS.required.push('point'+newPos)
        nonstateS.properties['pointDate'+newPos] = {type: 'string', format: 'date'}
        nonstateS.properties['id'+newPos] = {'type': 'string'}
        nonstateS.properties['point'+newPos] = {'type': 'string', 'pattern': pattern, 'message': message}
        nonstateU['pointDate'+newPos] = {'ui:options': {'label': false}, 'classNames': 'mb-1'}
        nonstateU['point'+newPos] = {'ui:options': {'label': false}, 'classNames': 'mb-4'}
        nonstateU['id'+newPos] = {'ui:widget': 'hidden'}
        this.setState({'updateSchema': nonstateS, 'updateUiSchema': nonstateU})
    }
    transformErrorsUpdate(errors) {
        return errors.map(error => {
            let prop = error.property.replace('.','')
            if (this.state.updateSchema.properties[prop]['message'] != '' ) {
                return {
                  ...error,
                  'message': this.state.updateSchema.properties[prop]['message']
                };
            }
            return error;
        });
    }
    validateDatesAdd(formData, errors) {
        const data = this.state.createMetricData
        if(data.length > 0){
            const thisDate = moment(formData.metricDate).format('MMM-YYYY')
            let formatedDates = data.map(function(point) {
                return moment(point.date).format('MMM-YYYY');
            });
            if(formatedDates.includes(thisDate)){
                errors.metricDate.addError("No metric points can be in the same month and year")
            }
        }
        return errors;
    }
    validateDatesUpdate(formData, errors) {

        if(Object.keys(formData).length > 0){
            const numOfPoints = Object.keys(formData).length / 3
            let formatedDates = []
            for(let i = 0; i < numOfPoints; i++) {
                if(formData.hasOwnProperty('pointDate'+i)) {
                    formatedDates.push(moment(formData['pointDate'+i]).format('MMM-YYYY'))
                }
            }
            const theDups = findDuplicates(formatedDates)
            if(theDups.length > 0){
                for(let x = 0; x < theDups.length; x++) {
                    console.log(theDups[x])
                    const place = formatedDates.findIndex(key => key === theDups[x])
                errors['pointDate'+place].addError('No metric points can be in the same month and year')
                }
            }
        }
        return errors
    }
    addMetric(data) {
        let addToData = this.state.createMetricData
        let schema = this.state.schema
        delete schema.properties.metricDataI
        delete schema.properties.metricDataD
        delete schema.required

        if(data.formData.metricType == 'Integer'){
            schema.required = ['metricDataI', 'metricDate']
            schema.properties = Object.assign(schema.properties, {              
              'metricDataI': {'type': 'string', 'title': 'Add Metric Data', 'pattern': '^\\d*$'}
            })
        }else{
            schema.required = ['metricDataD', 'metricDate']
            schema.properties = Object.assign(schema.properties, {
                metricDataD: {'type': 'string', 'title': 'Add Metric Data', 'pattern': '^\\d+(\\.\\d+)?$'}
            })
        }

        this.setState({
            createMetricName: data.formData.metricName,
            createMetricType: data.formData.metricType,
            schema
        })

        if(this.state.createMetricData.length > 0){
            this.checkMetricType(data.formData.metricType)
        }
    }
    addMetricPoint(data) {
        const addToData = this.state.createMetricData
        let curPoint = '' 
        if(this.state.createMetricType == 'Integer'){
            curPoint = data.formData.metricDataI
        }else{
            curPoint = data.formData.metricDataD
            if(curPoint.indexOf('.') === -1){
                curPoint = data.formData.metricDataD + '.00'
            }
        }
 
        addToData.push({'point': curPoint, 'date': data.formData.metricDate})
        this.setState({'createMetricData': addToData})
    }
    deleteMetricPoint(place) {
        const removeData = this.state.createMetricData.slice()
        const leaveData = removeData.splice(place,1)
        this.setState({'createMetricData': removeData, 'errorAddition': ''})
    }
    deleteMetricFromDB(e){
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        const s = this.state
        const id = this.state.filedMetrics[this.state.mDeleteDDSelected]['id']
        fetch( '/delete-metric', {
           'method':'POST',
           'headers': {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
           },
           'body': JSON.stringify({
                'fullmetric': id
           })
        })
        .then(response => response.json())
        .then(success => {
            this.getMetrics()
            this.setState({'errorRemoval': ''})
        })
        .catch(error => {
            this.setState({'errorRemoval': error.message})
        })
    }
    deleteMetricDataFromDB(e){
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        const s = this.state
        fetch( '/delete-metric', {
           'method':'POST',
           'headers': {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
           },
           'body': JSON.stringify({
                'metricPoint': s.mDeletepSelected
           })
        })
        .then(response => response.json())
        .then(success => {
            console.log(success)
            this.getMetrics()
            this.setState({'errorRemoval': ''})
        })
        .catch(error => {
            this.setState({'errorRemoval': error.message})
        })
    }
    updateMetricFromDB(e){
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        const s = this.state
        if(s.mUpdateMetricSelected.trim() != ''){
            fetch( '/update-metric', {
               'method':'POST',
               'headers': {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json',
               },
               'body': JSON.stringify({
                    'metricName': s.mUpdateMetricSelected,
                    'metridID': s.filedMetrics[s.mUpdateDDSelected]['id']
               })
            })
            .then(response => response.json())
            .then(success => {
                this.getMetrics()
                this.setState({'errorUpdate': '', mUpdateMetricSelected: ''})
            })
            .catch(error => {
                this.setState({'errorUpdate': error.message})
            })
        }else{
            this.setState({'errorUpdate': 'This metric would have no name'})
        }
    }
    updateMetricDataFromDB(data){
        const s = this.state
        console.log(data.formData)
        fetch( '/update-metric', {
           'method':'POST',
           'headers': {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
           },
           'body': JSON.stringify({
                'metricPoints': data.formData,
                'metricType': s.filedMetrics[s.mUpdateDDSelected]['type'],
                'metricId': s.filedMetrics[s.mUpdateDDSelected]['id']
           })
        })
        .then(response => response.json())
        .then(success => {
            this.getMetrics()
            this.setState({'mUpdateDDSelected': 0})
        })
        .catch(error => {
            this.setState({'errorUpdate': error.message})
        })

    }
    checkMetricType(type){
        const metrics = this.state.createMetricData
        let e = 0
        for(let i = 0; i < metrics.length; i++){
            const p = metrics[i].point
            if(type == 'Integer'){
                if(p.indexOf('.') !== -1){
                    metrics[i]['error'] = 'true'
                    e++
                }else{
                    delete metrics[i]['error']
                    if(e > 0)
                        e--
                }
            }else{
                if(p.indexOf('.') === -1){
                    metrics[i]['error'] = 'true'
                    e++
                }else{
                    delete metrics[i]['error']
                    if(e > 0)
                        e--
                }
            }
        }
        if(e > 0){
            if(type == 'Integer'){
                this.setState({'errorAddition': 'Please change highlighted metric data to integers'})
            }else{
                this.setState({'errorAddition': 'Please change highlighted metric data to decimals'})
            }
        }else{
            this.setState({'errorAddition': ''})
        }
    }
    outputMetricData() {
        return this.state.createMetricData.map((metric, index) => {
            return (
                <div key={index} className={"sm-metric-point-holder "+ (metric.error ? 'bg-danger' : '')}>
                    <span className="sm-metric-date ">
                        <Moment format="MM/DD/YYYY">
                            {metric.date}
                        </Moment>
                    </span>
                    <span className="sm-metric-point">
                        {metric.point}
                    </span>
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
                    { this.getDataForRows(metric.metrics, metric.type) }
                </tr>     
            );
        })
    }
    getDataForRows(metrics, type) {
        return metrics.map((data, index) => {
            let td = ''
            let symbol = ''
            if(type != 'Integer'){
                data.point != '' ? symbol = '$' : symbol = ''
                td = <td key={index} data-id={data.id}>{symbol}{data.point}</td>
            }else{
                 td = <td key={index} data-id={data.id}>{data.point}</td>
            }
            return (
                td
            );
        })
    }
    outputMetricNamesForSelect(){
        return this.state.filedMetrics.map((metric, index) => {
            return (
                <option key={index} value={index}>{metric.name}</option>
            );
        })
    }
    outputMetricDataForSelect(){
        let points = [];
        const pos = this.state.mDeleteDDSelected
        const filedMetrics = this.state.filedMetrics[pos]['metrics']
        filedMetrics.map((metric, index) => {
            if(metric.point != ''){
                points.push(<option key={index} value={metric.id}>{moment(metric.date).format('MMM-YYYY')} : {metric.point}</option>)
            }
        })
        return (
            <select multiple className="custom-select" id="deleteMetricPoints"  onChange={(e) => this.listenToInput(e, 'mDeletepSelected')}>
            {points}
            </select>
        )
    }
    render() {
        return (
            <div>
                <Table 
                    createTableHeaderDates={this.createTableHeaderDates.bind(this)}
                    filedMetrics={this.state.filedMetrics}
                    createTableRows={this.createTableRows.bind(this)} />
                <hr className="mt-3 mb-3" />
                <MetricFunctionDropdown
                listenToInput={this.listenToInput.bind(this)} />
                {this.state.metricFunction == 'add-metric' &&
                <div className="row mb-5">
                    <div className="col-md-6 pb-3 mt-3">
                        <Form schema={changeSchema}
                            formData={changeFormData}
                            uiSchema={changeUiSchema}
                            onSubmit={this.addMetric.bind(this)}
                            onError={log("errors")} >
                            <button type="submit" className="btn btn-primary add_metric">Add Metric</button>
                        </Form>
                        {this.state.createMetricName != '' &&
                            <div>
                                <hr />
                                <Form schema={this.state.schema}
                                    onSubmit={this.addMetricPoint.bind(this)}
                                    onError={log("errors")}
                                    transformErrors={transformErrors}
                                    validate={this.validateDatesAdd.bind(this)}
                                    showErrorList={false}
                                    liveValidate={true} >
                                    <button type="submit" className="btn btn-primary add_metric_data">Add Metric Data Point</button>
                                </Form>
                            </div>
                        }
                    </div>
                    <Formaddition
                        metricFunction={this.state.metricFunction}
                        createMetricName={this.state.createMetricName}
                        createMetricType={this.state.createMetricType}
                        createMetricData={this.state.createMetricData}
                        saveMetricData={this.saveMetricData.bind(this)}
                        error={this.state.errorAddition}
                        outputMetricData={this.outputMetricData.bind(this)} />
                </div>
                }
                {this.state.metricFunction == 'update-metric' && this.state.filedMetrics.length > 0 &&
                <div className="row mb-5">
                    <div className="col-md-6 pb-3 pt-3 bg-light">
                        <Formupdate
                            updateMetricFromDB={this.updateMetricFromDB.bind(this)}
                            error={this.state.errorUpdate}
                            mUpdateDDSelected={this.state.mUpdateDDSelected}
                            listenToInput={this.listenToInput.bind(this)}
                            mUpdateMetricSelected={this.state.mUpdateMetricSelected}
                            outputMetricNamesForSelect={this.outputMetricNamesForSelect.bind(this)} />
                    </div>
                    <div className="col-md-6 pb-3 pt-3 bg-light">
                        <Form schema={this.state.updateSchema}
                            formData={this.state.updateFormData}
                            uiSchema={this.state.updateUiSchema}
                            onSubmit={this.updateMetricDataFromDB.bind(this)}
                            transformErrors={this.transformErrorsUpdate.bind(this)}
                            showErrorList={false}
                            liveValidate={true} 
                            validate={this.validateDatesUpdate.bind(this)}
                            onError={log("errors")} >
                            <button type="submit" className="btn btn-info update_add_metric_data" onClick={(e) => this.addMetricToUpdateArea(e)}>Add Metric Point</button>
                            <button type="submit" className="btn btn-primary float-right update_metric_data">Update Metric Points</button>
                        </Form>
                    </div>
                </div>
                }
                {this.state.metricFunction == 'update-metric' && this.state.filedMetrics.length == 0 &&
                    <div className="row mb-5">
                        <div className="col-md-6 pb-3 pt-3 bg-light">
                            <h3>There are no metrics to update</h3>
                        </div>
                    </div>
                }
                {this.state.metricFunction == 'remove-metric' && this.state.filedMetrics.length > 0 &&
                    <Formremoval
                        deleteMetricFromDB={this.deleteMetricFromDB.bind(this)}
                        deleteMetricDataFromDB={this.deleteMetricDataFromDB.bind(this)}
                        error={this.state.errorRemoval}
                        listenToInput={this.listenToInput.bind(this)}
                        outputMetricNamesForSelect={this.outputMetricNamesForSelect.bind(this)}
                        outputMetricDataForSelect={this.outputMetricDataForSelect.bind(this)} />
                }
                {this.state.metricFunction == 'remove-metric' && this.state.filedMetrics.length == 0 &&
                    <div className="row mb-5">
                        <div className="col-md-6 pb-3 pt-3 bg-light">
                            <h3>There are no metrics to remove</h3>
                        </div>
                    </div>
                }
                {this.state.error != '' &&
                    <div className="text-danger">{this.state.error}</div>
                }
                </div>
        );
    }
}

if (document.getElementById('root')) {
    ReactDOM.render(<Main />, document.getElementById('root'))
}
