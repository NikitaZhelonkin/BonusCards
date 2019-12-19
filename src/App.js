import React, { useState, useEffect } from 'react';
import vkconnect from '@vkontakte/vk-connect';
import connect from 'storeon/react/connect'
import { View, Root, Panel, Spinner } from '@vkontakte/vkui'
import { RouteNode } from 'react-router5'
import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';
import Card from './panels/Card';
import AddCard from './panels/AddCard';
import Services from './panels/Services';
import firebase from './firebase'


const App = (props) => {

	const [popout, setPopout] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);



	const toQueryString = (params) => {
		return Object.keys(params).map(key => key + '=' + params[key]).join('&');
	}

	useEffect(() => {

		const authorise = async function () {
			const launchParams = toQueryString(props.route.params);
			console.log("launchParams:" + launchParams)
			//TODO fail if uid is null
			if(firebase.auth().currentUser!=null) return firebase.auth().currentUser;
			const response = await fetch("https://europe-west2-bonuscards-42f7a.cloudfunctions.net/token?uid="+props.route.params.vk_user_id)
			const json = await response.json();
			const data =  await firebase.auth().signInWithCustomToken(json.token);
			return data.user;

		}

		authorise().then((user) => {
			console.log("auth ok:" + user.uid)
			setUser(user);
			setLoading(false);
			props.dispatch('cards/api/get', user.uid)

		}).catch((error) => {
			//TODO handle error
			setLoading(false);
			console.log("auth error:" + error)
		})


		vkconnect.subscribe(({ detail: { type, data } }) => {

			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});


	}, []);

	return (
		<Root activeView={loading ? "splash" : "main"}>
			<View id="splash" activePanel="splash">
				<Panel id="splash">

					<div style={{ margin: 'auto', }}>
						<Spinner size="large" style={{ marginTop: 20 }} />

					</div>
				</Panel>

			</View>

			<View id="main" activePanel={props.route.name} popout={popout}>
				<Home id='home' router={props.router} route={props.route} user={user} />
				<Card id='card' router={props.router} route={props.route} setPopout={setPopout} />
				<Services id='services' router={props.router} route={props.route} />
				<AddCard id='add' router={props.router} route={props.route} user={user} />

			</View>
		</Root>

	)

}

export default connect('cards', (props) => (
	<RouteNode nodeName="">
		{({ route }) => <App route={route} {...props} />}
	</RouteNode>))
