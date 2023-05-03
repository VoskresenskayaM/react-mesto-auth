import React from "react";
import { useEffect } from "react";
import ok from '../../images/ok.png'
import InfoTooltip from './InfoTooltip'

const SuccesRegPopup = ({ isOpen, onClose, name, handleOut }) => {
    function handleClose() {
        handleOut('/sign-up')
        onClose()
    }

    useEffect(() => {
        function handleEscClose(evt) {
            if (evt.key === 'Escape') handleClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscClose)
            return () => document.removeEventListener('keydown', handleEscClose)
        }
    }, [isOpen])

    const popupClass = `popup  popup_type_${name} ${isOpen ? 'popup_opened' : ''}`;
    return (
        <div className={popupClass} onClick={handleClose} >
            <div className="popup__container  popup__container_theme_whithreg" onClick={(e => e.stopPropagation())}>
                <button className="popup__close-button" type="button" aria-label="закрыть"
                    onClick={handleClose}></button>
                <InfoTooltip
                    image={ok}
                    regText='Вы успешно зарегистрировались!'
                />
            </div>
        </div >
    )
}
export default SuccesRegPopup