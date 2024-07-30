import React from 'react'
import ScaleReconnectPopup from '../../../scales/scale-reconnect-popup'
import QueueFullPopup from '../../../measurement/queue-full-popup'
import { useSelector } from 'react-redux'

const ScaleAndQueuePopupHandler = ({ isQueueFilled, isScaleReconnect }) => {
    const { is_scale_detected, is_scale_detached } = useSelector((state) => state.settings.weighing_scale)
    return (
        <>
            {
                isQueueFilled &&
                <QueueFullPopup />
            }
            {
                isScaleReconnect &&
                <ScaleReconnectPopup
                    isMeasurePage={true}
                    is_scale_detached={is_scale_detached}
                    is_scale_detected={is_scale_detected}
                />
            }
        </>
    )
}

export default ScaleAndQueuePopupHandler