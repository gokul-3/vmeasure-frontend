import { FullTextAreaWidget, FullTextWidget, TextAreaWidget, PasswordWidget, TextWidget, TextWithButtonWidget } from './input-fields.widget'
import { SwitchWidget } from './boolean.widget'
import { MediaCardWidget, SimpleCardWidget, ImageCardWidget } from './cards.widget'
import { ChipWidget, ClickableChipWidget, DeletableChip } from './chips.widget'
import { ClickableIconWidget, ClickableTitledIconWidget, IconWidget, TitledIconWidget, MenuIconWidget } from './icons.widget'
import { ClickableImageWidget, ImageWidget } from './images.widget'
import { AutocompleteWidget, MultipleSelectChip, Dropdown } from './dropdowns.widget'
import { ClickableLabelWidget, LabelWidget } from './labels.widget'
import { CounterWidget, SliderWidget } from './numerics.widget'
import { ButtonWithIcon, CounterButton, LongButton, RegularButton } from './buttons.widget'
import { CustomWidgets } from '../../../constants/custom-flow';
import { LiveLabel, LiveProgress } from "./live-update.widget";
import { ListWidget } from './list.widget'

const WidgetMapper = {
    [CustomWidgets.TEXT_BOX]: TextWidget,
    [CustomWidgets.FULL_TEXT_BOX]: FullTextWidget,
    [CustomWidgets.FULL_TEXT_AREA]: FullTextAreaWidget,
    [CustomWidgets.TEXT_AREA]: TextAreaWidget,
    [CustomWidgets.TEXT_WITH_BUTTON]: TextWithButtonWidget,
    [CustomWidgets.SELECT]: Dropdown,
    [CustomWidgets.MULTI_SELECT]: MultipleSelectChip,
    [CustomWidgets.ICON]: IconWidget,
    [CustomWidgets.CLICKABLE_ICON]: ClickableIconWidget,
    [CustomWidgets.IMAGE]: ImageWidget,
    [CustomWidgets.CLICKABLE_IMAGE]: ClickableImageWidget,
    [CustomWidgets.TITLED_ICON]: TitledIconWidget,
    [CustomWidgets.CLICKABLE_TITLED_ICON]: ClickableTitledIconWidget,
    [CustomWidgets.MENU_ICON]: MenuIconWidget,
    [CustomWidgets.LABEL]: LabelWidget,
    [CustomWidgets.CLICKABLE_LABEL]: ClickableLabelWidget,
    [CustomWidgets.LONG_BUTTON]: LongButton,
    [CustomWidgets.CHIP]: ChipWidget,
    [CustomWidgets.CLICKABLE_CHIP]: ClickableChipWidget,
    [CustomWidgets.DELETABLE_CHIP]: DeletableChip,
    [CustomWidgets.AUTO_COMPLETE]: AutocompleteWidget,
    [CustomWidgets.CARD_MEDIA]: MediaCardWidget,
    [CustomWidgets.CARD]: SimpleCardWidget,
    [CustomWidgets.CARD_IMAGE]: ImageCardWidget,
    [CustomWidgets.SWITCH]: SwitchWidget,
    [CustomWidgets.SLIDER]: SliderWidget,
    [CustomWidgets.COUNTER]: CounterWidget,
    [CustomWidgets.RegularButton]: RegularButton,
    [CustomWidgets.BUTTON_WITH_ICON]: ButtonWithIcon,
    [CustomWidgets.TIMER_BUTTON]: CounterButton,
    [CustomWidgets.PASSWORD]: PasswordWidget,
    [CustomWidgets.LIVE_LABEL]: LiveLabel,
    [CustomWidgets.LIVE_PROGRESS]: LiveProgress,
    [CustomWidgets.LABEL_LIST]: ListWidget,
}

export const getWidget = (uiWidgetString) => {
    return WidgetMapper[uiWidgetString] ?? null
};


export const getUIWidgets = (uiSchema) => {
    let widgets = {};
    Object.keys(uiSchema).forEach((fieldName) => {
        const uiWidgetString = uiSchema[fieldName]["ui:widget"]
        const customWidgetComponent = getWidget(uiWidgetString);
        if (customWidgetComponent) {
            widgets[uiWidgetString] = customWidgetComponent
        }
    });
    return widgets
}

export default getUIWidgets