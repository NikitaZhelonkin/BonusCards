import React, { useState, useEffect } from 'react';
import vkconnect from '@vkontakte/vk-connect';
import connect from 'storeon/react/connect'
import { View, Root, Panel, Spinner, Footer, FixedLayout, Placeholder } from '@vkontakte/vkui'
import Icon56InfoOutline from '@vkontakte/icons/dist/56/info_outline';
import { RouteNode } from 'react-router5'
import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';
import Card from './panels/Card';
import AddCard from './panels/AddCard';
import Services from './panels/Services';
import firebase from './firebase'
import packageJson from './package.alias.json';



const App = (props) => {

	const [popout, setPopout] = useState(null);
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);


	const toQueryString = (params) => {
		return Object.keys(params).map(key => key + '=' + params[key]).join('&');
	}

	const parseQueryString = (string) => {
		return string.slice(1).split('&')
			.map((queryParam) => {
				let kvp = queryParam.split('=');
				return { key: kvp[0], value: kvp[1] }
			})
			.reduce((query, kvp) => {
				query[kvp.key] = kvp.value;
				return query
			}, {})
	};

	useEffect(() => {

		const authorise = async function () {

			const searchParams = parseQueryString(props.search)

			if (firebase.auth().currentUser != null) return firebase.auth().currentUser;
			const response = await fetch("https://europe-west2-bonuscards-42f7a.cloudfunctions.net/token" + props.search)
			const json = await response.json();
			

			const data = await firebase.auth().signInWithCustomToken(json.token);
			return data.user;
		}

		authorise().then((user) => {
			console.log("auth ok:" + user.uid)
			setUser(user);
			setLoading(false);
			
			props.dispatch('cards/listen', { uid: user.uid })

			const hashParams = parseQueryString(props.hash)
			if (hashParams.add_number != null && hashParams.add_name != null) {

				props.router.navigate('add', { name: hashParams.add_name, number: hashParams.add_number, serviceid: hashParams.add_service_id })
			}

		}).catch((error) => {
			setError(error);
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
		<Root activeView={loading ? "splash" : error != null ? "error" : "main"}>
			<View id="splash" activePanel="splash">
				<Panel id="splash">

					

					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
						<Spinner size="large" />
					</div>

					<FixedLayout vertical='bottom'>

						<Footer>{packageJson.version}</Footer>
					</FixedLayout>
				</Panel>

			</View>

			<View id="error" activePanel="error">
				<Panel id="error">
					<Placeholder
						icon={<Icon56InfoOutline />}>
						Произошла ошибка, попробуйте еще раз
					</Placeholder>
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
