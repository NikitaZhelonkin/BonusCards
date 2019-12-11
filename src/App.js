import React, { useState, useEffect } from 'react';
import vkconnect from '@vkontakte/vk-connect';
import connect from 'storeon/react/connect'
import { View } from'@vkontakte/vkui'
import { RouteNode } from 'react-router5'
import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';
import Card from './panels/Card';
import AddCard from './panels/AddCard';
import Services from './panels/Services';



const App = (props) => {
	
	const [popout, setPopout] = useState(null);


	useEffect(() => {
		
		vkconnect.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});

	}, []);

	return (
		<View activePanel={props.route.name} popout={popout}>
			<Home id='home' router={props.router}/>
			<Card id='card' router={props.router} route={props.route} setPopout={setPopout} />
			<Services id='services' router={props.router} route={props.route}/>
			<AddCard id='add' router={props.router} route={props.route}/>
		
		</View>
	)
}

export default connect('cards', (props) => (
    <RouteNode nodeName="">
		{({ route }) => <App route={route} {...props} />}
	</RouteNode>))

