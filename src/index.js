import 'core-js/features/map';
import 'core-js/features/set';
import React from 'react';
import ReactDOM from 'react-dom';
import connect from '@vkontakte/vk-connect';
import App from './App';
import createStore from 'storeon'
import createRouter from './create-router'
import { RouterProvider } from 'react-router5'
import persistState from '@storeon/localstorage'
import cards from './cards'
import prefs from './prefs'
import StoreContext from 'storeon/react/context'
import registerServiceWorker from './sw';
import firebase from './firebase'

// Init VK  Mini App
connect.send('VKWebAppInit');

const store = createStore([cards, prefs, persistState(['prefs']),])
const router = createRouter()

firebase.firestore().enablePersistence()
    .then(() => {
        console.log("success enablingPersistance")
    })
    .catch(function (err) {
        console.log("error enablingPersistance:" + err)
    });

// Если вы хотите, чтобы ваше веб-приложение работало в оффлайне и загружалось быстрее,
// расскомментируйте строку с registerServiceWorker();
// Но не забывайте, что на данный момент у технологии есть достаточно подводных камней
// Подробнее про сервис воркеры можно почитать тут — https://vk.cc/8MHpmT
registerServiceWorker();

router.start(() => {
    ReactDOM.render(
        <RouterProvider router={router}>
            <StoreContext.Provider value={store}>
                <App router={router} />
            </StoreContext.Provider>
        </RouterProvider>, document.getElementById('root'));
})

