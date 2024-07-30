import lodash from "lodash";

export const getWidgetStyle = (props) => {
    if (props?.uiSchema?.["ui:widgetStyle"]) {
        return props?.uiSchema?.["ui:widgetStyle"]
    }
    return {}
}

export const getWidgetAttributes = (props) => {
    if (props?.uiSchema?.["ui:widgetAttributes"]) {
        return props?.uiSchema?.["ui:widgetAttributes"]
    }
    return {}
}


export const triggerFocus = (uiSchema, fieldToBeFocused) => {
    let uiSchemaClone = lodash.cloneDeep(uiSchema);
    uiSchemaClone = {
        ...uiSchemaClone,
        [fieldToBeFocused]: {
            ...uiSchemaClone[fieldToBeFocused],
            'ui:autofocus': true,
        }
    }
    return uiSchemaClone;
}