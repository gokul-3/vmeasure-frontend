import React from 'react'
import Form from '@rjsf/mui';
import Box from "@mui/material/Box";
import validator from '@rjsf/validator-ajv8';
import { getWidget } from '../../widgets';

function CardLayout({
    schema,
    uiSchema,
    layoutId,
    triggerEventAPI,
}) {

    let widgets = {};
    if (uiSchema['ui:widget']) {
        widgets = {
            TextWidget: getWidget(uiSchema['ui:widget'])
        }
    }

    let attributes = {}
    if (uiSchema["ui:widgetAttribute"]) {
        attributes = uiSchema["ui:widgetAttribute"]
    }
        
    return (
        <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            flexDirection={attributes.scroll === "horizontal" ? 'row' : 'column'}
            height={'100%'}
            width={'100%'}

            flexWrap={"wrap"}
            overflow={"auto"}
            padding={15}
            gap={20}

        >
            {schema?.cardData?.map((card, i) => {
                return (
                    <Box key={i}>
                        <Form
                            schema={card}
                            uiSchema={{...uiSchema,"ui:widget":undefined}}
                            widgets={widgets}
                            validator={validator}
                            idSeparator={'|'}
                            idPrefix={layoutId}
                            formContext={{ triggerEventAPI }}
                            children={<></>}
                        />
                    </Box>
                );
            })}
        </Box>
    )
}

export default CardLayout;