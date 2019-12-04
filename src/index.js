import 'core-js/features/map';
import 'core-js/features/set';
import React from 'react';
import ReactDOM from 'react-dom';
import connect from '@vkontakte/vk-connect';
import App from './App';
import createStore from 'storeon'
import persistState from '@storeon/localstorage'
import cards from './cards'
import StoreContext from 'storeon/react/context'
import registerServiceWorker from './sw';

const store = createStore([cards, persistState(['cards'])])


// Init VK  Mini App
connect.send('VKWebAppInit');

// Если вы хотите, чтобы ваше веб-приложение работало в оффлайне и загружалось быстрее,
// расскомментируйте строку с registerServiceWorker();
// Но не забывайте, что на данный момент у технологии есть достаточно подводных камней
// Подробнее про сервис воркеры можно почитать тут — https://vk.cc/8MHpmT
registerServiceWorker();

ReactDOM.render(<StoreContext.Provider value={store}>
    <App />
</StoreContext.Provider>, document.getElementById('root'));
