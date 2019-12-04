import React, { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';
import View from '@vkontakte/vkui/dist/components/View/View';

import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Card from './panels/Card';
import AddCard from './panels/AddCard';
import Scan from './panels/Scan';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [args, setArgs] = useState(null);
	const [popout, setPopout] = useState(null);


	useEffect(() => {
		console.log('useEffect');
		connect.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});

	}, []);

	const go = (name, args) => {
		console.log('По ссылке кликнули:' + name + ' ' + args);
		setArgs(args);
		setActivePanel(name);
	};


	return (
		<View activePanel={activePanel} popout={popout}>
			<Home id='home' go={go} />
			<Card id='card' go={go} setPopout={setPopout} args={args} />
			<AddCard id='add' go={go} args={args} />
			<Scan id='scan' go={go} />
		</View>
	);
}

export default App;

