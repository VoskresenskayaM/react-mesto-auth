import logo from '../images/logo.svg'

const HeaderNotReg = ({ actionText, handleOut }) => {
    return (
        <header className="header">
            <img className="logo" src={logo} alt="логотип" />
            <p onClick={handleOut} className='header__action-notreg'>{actionText}</p>
        </header>
    )
}
export default HeaderNotReg; 
