export const changeSchema = {
    title: 'Add Metric',
    type: 'object',
    required: ['metricName', 'metricType'],
    properties: {
        metricName: {type: 'string', title: 'Metric Name'},
        metricType: {
          type: 'string',
          title: 'Choose Metric Type',
          'enum': [
            'Integer',
            'Decimal'
          ]
        }
    }
}
export const changeUiSchema = {
    metricName: {
        'ui:placeholder': 'IE: End Costs'
    }
}
export const changeFormData = {
    metricType: 'Integer'
}
export const schema = {
    type: 'object',
    required: ['metricDataI', 'metricDate'],
    properties: {
        metricDataI: {type: 'string', title: 'Add Metric Data', pattern: '^\\d*$'},
        metricDate: {type: 'string', format: 'date', title: 'Add Metric Data'}
    }
}

export const updateSchema = {
	title: 'Update Metric Points',
    type: 'object',
    required: [],
    properties: {}
}
export const updateUiSchema = {}
export const updateFormData = {}