import React, { useEffect, useRef, useCallback } from 'react';
import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/mui';
import getUIWidgets from '../../widgets';
import { useSelector } from "react-redux"
import { triggerFocus } from '../../utils/wiget.utils';

function FormLayout({ schema, uiSchema, onFormChange, onPageSubmit, layoutId, triggerEventAPI, layoutFormData, focus, isFullWidth }) {

    const widgets = getUIWidgets(uiSchema);
    const formRefs = useRef([]);
    const { value: keyValue, counter } = useSelector(state => state.externalInput)

    if (layoutId === focus?.layout) {
        uiSchema = triggerFocus(uiSchema, focus?.field);
    }

    const addFormFieldRef = useCallback((ref) => {
        formRefs.current.push(ref);
    }, []);

    const handelFieldFocus = (fieldId) => {
    }


    const focusNextField = () => {
        const currentFieldIndex = formRefs.current.findIndex(ref => ref === document.activeElement);
        const nextFocusIndex = (currentFieldIndex + 1) % formRefs.current.length;
        formRefs.current[nextFocusIndex]?.focus();
    };


    useEffect(() => {
        if (keyValue && keyValue === "next" & counter > 0) {
            focusNextField()
        }
    }, [keyValue, counter])


    return (
        <>
            <Form
                schema={schema}
                uiSchema={uiSchema}
                formData={layoutFormData}
                validator={validator}
                onSubmit={onPageSubmit}
                onChange={onFormChange}
                idPrefix={layoutId}
                idSeparator={'|'}
                children={<></>}
                widgets={widgets}
                onFocus={handelFieldFocus}
                formContext={{ triggerEventAPI, isFullWidth, addFormFieldRef }}
                id={"custom-workflow-form"}
            />
        </>
    )
}

export default FormLayout