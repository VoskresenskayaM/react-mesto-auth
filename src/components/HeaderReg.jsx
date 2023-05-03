import logo from '../images/logo.svg'
import BurgerButton from "./BurgerButton"
import MobileHeaderBurgerBlock from './MobileHeaderBurgerBlock'
import { CurrentUserEmailContext } from '../contexts/CurrentUserEmailContext'
import { useContext } from 'react'

const HeaderReg = ({ actionText, handleOut, handleBurgerButton, isBurger }) => {

    const currentUserEmail = useContext(CurrentUserEmailContext);

    function handleBurgerButtonClick() {
        handleBurgerButton()
    }

    return (
        <div>
            {!isBurger && <MobileHeaderBurgerBlock
                actionText={actionText}
                handleOut={handleOut}
            />}
            <header className="header">
                <img className="logo" src={logo} alt="логотип" />
                <ul className='header__menu'>
                    <li className='header__user-email'>{currentUserEmail}</li>
                    <li onClick={handleOut} className='header__action'>{actionText}</li>
                </ul>
            </header>
            <BurgerButton
                isBurger={isBurger}
                handleClick={handleBurgerButtonClick}
            />
        </div>
    )
}
export default HeaderReg;

