
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup'
import { useState } from 'react';
import { useEffect } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { CurrentUserEmailContext } from '../contexts/CurrentUserEmailContext';
import api from '../utils/Api';
import EditProfilePopup from './EditProfilePopup.jsx';
import AddPlacePopup from './AddPlacePopup.jsx';
import EditAvatarPopup from './EditAvatarPopup';
import DeleteCardPopup from './DeleteCardPopup';
import Register from './regAndAuth/Register';
import Login from './regAndAuth/Login';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRouteElement from './regAndAuth/ProtectedRoute.jsx'
import *as auth from './regAndAuth/auth'
import ErrorRegPopup from './regAndAuth/ErrorRegPopup'
import SuccesRegPopup from './regAndAuth/SuccesRegPopup'

function App() {

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
    const [isImagePopupOpen, setIsImagePopupOpen] = useState(false)
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
    const [isSuccesRegPopupOpen, setIsSuccesRegPopupOpen] = useState(false)
    const [isErrorRegPopupOpen, setIsErrorRegPopupOpen] = useState(false)
    const [selectedCard, setSelectedCard] = useState({})
    const [cards, setCards] = useState([])

    useEffect(() => {

        api.getAllCardWhithUser()
            .then(([cards, user]) => {
                setCards(cards)
                setCurrentUser(user)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const [currentUser, setCurrentUser] = useState({ name: '', about: '', avatar: '' })

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true)
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true)
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true)
    }

    function handleCardClick(card) {
        setIsImagePopupOpen(true)
        setSelectedCard(card)
    }

    function handleDeleteCardClick(card) {
        setIsDeletePopupOpen(true)
        setSelectedCard(card)
    }

    function closeAllPopups() {
        if (isEditProfilePopupOpen) setIsEditProfilePopupOpen(false)
        if (isAddPlacePopupOpen) setIsAddPlacePopupOpen(false)
        if (isEditAvatarPopupOpen) setIsEditAvatarPopupOpen(false)
        if (isImagePopupOpen) setIsImagePopupOpen(false)
        if (isDeletePopupOpen) setIsDeletePopupOpen(false)
        if (isSuccesRegPopupOpen) setIsSuccesRegPopupOpen(false)
        if (isErrorRegPopupOpen) setIsErrorRegPopupOpen(false)
    }

    const [isLoadingDeleteCard, setIsLoadingDeleteCard] = useState(false)
    const [isLoadingAddNewCard, setIsLoadingAddNewCard] = useState(false)
    const [isLoadingUpdateUser, setIsLoadingUpdateUser] = useState(false)
    const [isLoadingUpdateAvatar, setIsLoadingUpdateAvatar] = useState(false)

    function handleDeleteCard() {
        setIsLoadingDeleteCard(true)
        api.deleteCard(selectedCard._id)
            .then(() => {
                setCards(cards => cards.filter(c => c._id !== selectedCard._id))
                closeAllPopups()
            })
            .catch((err) =>
                console.log(err))
            .finally(() => {
                setIsLoadingDeleteCard(false)
            })
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id)
        api.changeLikeCardStatus(card._id, isLiked)
            .then((newCard) => {
                setCards(cards => cards.map(c => c._id === card._id ? newCard : c))
            })
            .catch((err) => console.log(err))
    }

    function handleAddNewCard(card) {
        setIsLoadingAddNewCard(true)
        api.addNewCard({ item: card })
            .then((newCard) => {
                setCards([newCard, ...cards])
                closeAllPopups()
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setIsLoadingAddNewCard(false)
            })
    }

    function handleUpdateUser(user) {
        setIsLoadingUpdateUser(true)
        api.editUserInfo({ item: user })
            .then((newUser) => {
                setCurrentUser(newUser)
                closeAllPopups()
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setIsLoadingUpdateUser(true)
            })
    }

    function handleUpdateAvatar(userAvatarLink) {
        setIsLoadingUpdateAvatar(true)
        api.editAvatar({ item: userAvatarLink })
            .then((newAvatar) => {
                setCurrentUser(newAvatar)
                closeAllPopups()
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setIsLoadingUpdateAvatar(false)
            })
    }

    /*регистрация, авторизация*/
    const [loggenIn, setLoggenIn] = useState(false);
    const [isBurger, setIsBurger] = useState(true)
    const [currentUserEmail, setCurrentUserEmail] = useState('')

    const navigate = useNavigate();

    const handleLogin = () => {
        setLoggenIn(true);
    }

    useEffect(() => {
        tokenCheck();
    }, [])

    function tokenCheck() {
        if (localStorage.getItem('token')) {
            const token = localStorage.getItem('token')
            auth.getContent(token)
                .then((res) => {
                    if (res) {
                        setLoggenIn(true)
                        const email = res.data.email
                        setCurrentUserEmail(email)
                        navigate('/', { replace: true })
                    }
                })
        }
    }

    /*регистрация пользователя*/
    function registerUser(email, password) {
        auth.register(email, password)
            .then((res) => {
                if (!res) {
                    setIsErrorRegPopupOpen(true)
                }
                else {
                    setIsSuccesRegPopupOpen(true)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    /*авторизация пользователя*/
    function loginUser(form) {
        if (!form.email || !form.password) {
            return
        }
        auth.authorize(form.email, form.password)
            .then((data) => {
                if (data.token) {
                    handleLogin();
                    setCurrentUserEmail(form.email)
                    navigate('/', { replace: true })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    /*переход по страницам*/
    function handleOut(path) {
        navigate(path, { replace: true })
    }

    function handleBurgerButton() {
        setIsBurger(!isBurger)
    }

    function handleUserOut() {
        localStorage.removeItem('token')
        handleOut('/sign-up')
        handleLogin()
        handleBurgerButton()
    }

    return (
        <div className="App">
            <CurrentUserContext.Provider value={currentUser}>
                <CurrentUserEmailContext.Provider value={currentUserEmail}>
                    <div className="page">
                        <Routes>
                            <Route path='*' element={loggenIn ? <Navigate to='/' replace /> :
                                <Navigate to='/sign-up' replace />} />
                            <Route path='/sign-up' element={<Login
                                handleLogin={handleLogin}
                                loggenIn={loggenIn}
                                loginUser={loginUser}
                                handleOut={handleOut}
                                handleBurgerButton={handleBurgerButton} />} />
                            <Route path="/sign-in" element={<Register
                                loggenIn={loggenIn}
                                registerUser={registerUser}
                                handleOut={handleOut}
                                handleBurgerButton={handleBurgerButton} />} />
                            <Route path="/" element={<ProtectedRouteElement element={Main}
                                setCards={setCards}
                                cards={cards}
                                onEditProfile={handleEditProfileClick}
                                onAddPlace={handleAddPlaceClick}
                                onEditAvatar={handleEditAvatarClick}
                                onCardClick={handleCardClick}
                                onCardDelete={handleDeleteCardClick}
                                onCardLike={handleCardLike}
                                loggenIn={loggenIn}
                                handleLogin={handleLogin}
                                handleUserOut={handleUserOut}
                                handleBurgerButton={handleBurgerButton}
                                isBurger={isBurger} />} />
                        </Routes>
                        <Footer />
                        <EditProfilePopup
                            isOpen={isEditProfilePopupOpen}
                            onClose={closeAllPopups}
                            onUpdateUser={handleUpdateUser}
                            isLoading={isLoadingUpdateUser}>
                        </EditProfilePopup>
                        <AddPlacePopup
                            isOpen={isAddPlacePopupOpen}
                            onClose={closeAllPopups}
                            onAddNewCard={handleAddNewCard}
                            isLoading={isLoadingAddNewCard}>
                        </AddPlacePopup>
                        <ImagePopup
                            card={selectedCard}
                            isOpen={isImagePopupOpen}
                            onClose={setIsImagePopupOpen} />
                        <DeleteCardPopup
                            isOpen={isDeletePopupOpen}
                            onClose={setIsDeletePopupOpen}
                            onDeleteCard={handleDeleteCard}
                            isLoading={isLoadingDeleteCard}>
                        </DeleteCardPopup>
                        <EditAvatarPopup
                            isOpen={isEditAvatarPopupOpen}
                            onClose={closeAllPopups}
                            onUpdateAvatar={handleUpdateAvatar}
                            isLoading={isLoadingUpdateAvatar}>
                        </EditAvatarPopup>
                        <SuccesRegPopup
                            name='regSucces'
                            isOpen={isSuccesRegPopupOpen}
                            onClose={closeAllPopups}
                            handleOut={handleOut}>
                        </SuccesRegPopup>
                        <ErrorRegPopup
                            name='regError'
                            isOpen={isErrorRegPopupOpen}
                            onClose={closeAllPopups}>
                        </ErrorRegPopup>
                    </div>
                </CurrentUserEmailContext.Provider>
            </CurrentUserContext.Provider>
        </div >
    );
}

export default App;

