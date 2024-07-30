export const CustomWidgets = {
    TEXT_BOX: "TextBox",
    FULL_TEXT_BOX: "FullTextBox",
    TEXT_AREA: "TextArea",
    FULL_TEXT_AREA: "FullTextArea",
    TEXT_WITH_BUTTON: "TextWithButton",
    SELECT: "Select",
    MULTI_SELECT: "MultiSelect",
    ICON: "Icon",
    CLICKABLE_ICON: "ClickableIcon",
    MENU_ICON: "MenuIcon",
    IMAGE: "Image",
    CLICKABLE_IMAGE: "ClickableImage",
    TITLED_ICON: "TitledIcon",
    CLICKABLE_TITLED_ICON: "ClickableTitledIcon",
    LABEL: "Label",
    CLICKABLE_LABEL: "ClickableLabel",
    LONG_BUTTON: "LongButton",
    CHIP: "Chip",
    CLICKABLE_CHIP: "ClickableChip",
    DELETABLE_CHIP: "DeletableChip",
    AUTO_COMPLETE: "Autocomplete",
    CARD_MEDIA: "CardMedia",
    CARD_IMAGE: "CardImage",
    CARD: "Card",
    SWITCH: "Switch",
    COUNTER: "Counter",
    SLIDER: "Slider",
    RegularButton: "RegularButton",
    BUTTON_WITH_ICON: "ButtonWithIcon",
    TIMER_BUTTON: "TimerButton",
    PASSWORD: "Password",
    LIVE_LABEL: "LiveLabel",
    LIVE_PROGRESS: "LiveProgress",
    LABEL_LIST: "ListWidget",
}


export const LayoutTypes = {
    FORM: "form",
    TABLE: "table",
    CARD: "card"
}


const DefaultStyles = {
    masterGrid: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: "98%",
        height: "91vh",
        margin: "auto",
        position: "relative"
    },
    mainContainer: {
        height: "100%",
        width: "100%",
    },

    header: {
        height: "12%",
        width: "100%",
        paddingLeft: 3,
    },
    customLayoutContainer: {
        height: "76%",
        width: "100%",
        display: 'grid',
        gap: 7,
    },
    Footer: {
        height: "12%",
        width: "100%",
    }
}

const DefaultProps = {
    customFlowContainer: {
        xs: 12,
    }
}

export const UIProps = {
    DefaultStyles: DefaultStyles,
    DefaultProps: DefaultProps
}

export const TableCellTypes = {
    LABEL: "label",
    SELECT: "select",
    CHECKBOX: "checkbox",
    TEXT: "text",
    BUTTON: "button",
    ICON: "icon",
    IMAGE: "image"
}


export const FocusStyle = {
    border: "1px solid purple",
    boxShadow: "0px 0px 10px purple"
}

export const PreDefinedPages = {
    MEASUREMENT_PAGE: "measurement_page",
    ADDITIONAL_IMAGE: "additional_image",
    PRINTER_SETTING_PAGE: "printer_config_page"
}

export const WidgetsWithLabelContainerStyle = {
    width: "100%",
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginY: "2%"
}

export const CustomServicePort = 8800;


export const getWrapperStyle = (isFullwidth) => {
    return {
        width: "100%",
        height: "7vh",
        marginY: "1.5%",
        paddingX: 20,
        minWidth: isFullwidth ? "50vw" : "100%"
    }

}

export const getLabelStyle = (isFullwidth) => {
    return {
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: isFullwidth ? "flex-start" : "flex-end",
        paddingRight: isFullwidth ? 0 : 40,
        textAlign: isFullwidth ? "left" : "right",
    }
}

export const getFieldStyle = (isFullwidth) => {
    return {
        height: "100%",
        width: "70%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingLeft: isFullwidth ? 30 : 0
    }
}


export const MessageType = {
    ERROR: "ERROR",
    SUCCESS: "SUCCESS"
}

