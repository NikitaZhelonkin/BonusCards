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


connect.subscribe((e) => {
    switch (e.detail.type) {
        case 'VKWebAppUpdateConfig':
            let schemeAttribute = document.createAttribute('scheme');
            schemeAttribute.value = e.detail.data.scheme ? e.detail.data.scheme : 'client_light';
            document.body.attributes.setNamedItem(schemeAttribute);
            break;
        default:
            console.log(e.detail.type);
    }
 });


// Init VK  Mini App
connect.send('VKWebAppInit');

const store = createStore([cards, prefs, persistState(['prefs']),])
const router = createRouter()


// Если вы хотите, чтобы ваше веб-приложение работало в оффлайне и загружалось быстрее,
// расскомментируйте строку с registerServiceWorker();
// Но не забывайте, что на данный момент у технологии есть достаточно подводных камней
// Подробнее про сервис воркеры можно почитать тут — https://vk.cc/8MHpmT
registerServiceWorker();

const search = window.location.search
const hash = window.location.hash


router.start(() => {
    ReactDOM.render(
        <RouterProvider router={router}>
            <StoreContext.Provider value={store}>
                <App router={router} search={search} hash={hash} />
            </StoreContext.Provider>
        </RouterProvider>, document.getElementById('root'));
})

