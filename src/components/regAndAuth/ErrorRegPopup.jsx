import React from "react";
import { useEffect } from "react";
import notOk from '../../images/notOk.png'
import InfoTooltip from './InfoTooltip'

const ErrorRegPopup = ({ isOpen, onClose, name }) => {

    useEffect(() => {
        function handleEscClose(evt) {
            if (evt.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscClose)
            return () => document.removeEventListener('keydown', handleEscClose)
        }
    }, [isOpen])

    const popupClass = `popup  popup_type_${name} ${isOpen ? 'popup_opened' : ''}`;
    return (
        <div className={popupClass} onClick={onClose} >
            <div className="popup__container  popup__container_theme_whithreg" onClick={(e => e.stopPropagation())}>
                <button className="popup__close-button" type="button" aria-label="закрыть"
                    onClick={onClose}></button>
                <InfoTooltip
                    image={notOk}
                    regText='Что-то пошло не так! Попробуйте еще раз.'
                />
            </div>
        </div >
    )
}
export default ErrorRegPopup;