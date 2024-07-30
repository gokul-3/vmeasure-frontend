import { useState } from 'react'
import { getWidgetStyle } from "../utils/wiget.utils";

const ImageWidget = (props) => {
    const { schema } = props
    const widgetStyle = { "width": "20vh", "height": "10vh", "border-radius": "50%", ...getWidgetStyle(props) }
    return (
        <div>
            <img src={schema?.imageURL} alt={"Image Not Found"} style={widgetStyle} />
        </div>
    );
}

//CLICKABLE IMAGE

const ClickableImageWidget = (props) => {
    const [isClicked, setIsClicked] = useState(false);
    const widgetStyle = { "cursor": 'pointer', "transition": '0.2s', "width": "20vh", "height": "10vh", "border-radius": "50%", "boxShadow": isClicked ? '0 0 5px rgba(0, 0, 0.5,0.5)' : 'none', ...getWidgetStyle(props) }
    const { schema, formContext } = props
    const { triggerEventAPI } = formContext
    const handleImageClick = () => {
        setIsClicked(true);
        if(schema.onClick){
            triggerEventAPI(schema.onClick)
        }
        setTimeout(() => {
            setIsClicked(false);
        }, 200);
    };

    return (
        <div>
            <img src={schema?.imageURL} style={widgetStyle} onClick={schema.onClick ? handleImageClick : null} />
        </div>
    );
}
export { ImageWidget, ClickableImageWidget }