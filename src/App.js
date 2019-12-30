import React, { useState, useEffect, useRef } from 'react';
import connect from 'storeon/react/connect'
import { View, Root, Panel, Spinner, Footer, FixedLayout, Placeholder, PanelHeader } from '@vkontakte/vkui'
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
	const [modal, setModal] = useState(null);
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	const poputRef = useRef(popout);


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
		poputRef.current = popout;
		
		//Почему в реакте такая геморная навигация????
		props.router.canActivate("home", (router) => (toState, fromState) => {
			if (fromState.name === "card" && poputRef.current!==null) {
				setPopout(null)
				window.history.go(1)
				return false;
			}else{
				return true;
			}
			
		});

	}, [popout])


	useEffect(() => {



		const authorise = async function () {

			const response = await fetch("https://europe-west2-bonuscards-42f7a.cloudfunctions.net/token" + props.search)

			const json = await response.json();

			console.log("signin...")
			await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
			await firebase.auth().signInWithCustomToken(json.token);

		}

		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				console.log("auth ok:" + user.uid)
				setUser(user);

				props.dispatch('cards/listen', { uid: user.uid })

				const hashParams = parseQueryString(props.hash)
				if (hashParams.add_number != null && hashParams.add_name != null) {

					props.router.navigate('add', { name: hashParams.add_name, number: hashParams.add_number, serviceid: hashParams.add_service_id })
				}
			} else {
				authorise().catch((error) => {
					setError(error);

					console.log("auth error:" + error)
				})
			}
		});




	}, []);


	return (
		<Root activeView={error != null ? "error" : props.cards.loading === true ? "splash" : "main"}>
			<View id="splash" activePanel="splash">
				<Panel id="splash">


					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>

						<Spinner size="large" />
					</div>

					<FixedLayout vertical='bottom'>

						<Footer>{packageJson.version}</Footer>
					</FixedLayout>
				</Panel>

			</View>

			<View id="error" activePanel="error">
				<Panel id="error">
					<PanelHeader >Бонус карты</PanelHeader>
					<Placeholder
						icon={<Icon56InfoOutline />}>
						Произошла ошибка, попробуйте еще раз
					</Placeholder>
				</Panel>

			</View>

			<View id="main" activePanel={props.route.name} popout={popout} modal={modal}>
				<Home id='home' router={props.router} route={props.route} user={user} />
				<Card id='card' router={props.router} route={props.route} setPopout={setPopout} />
				<Services id='services' router={props.router} route={props.route} />
				<AddCard id='add' router={props.router} route={props.route} user={user} setModal={setModal} />

			</View>
		</Root>

	)

}

export default connect('cards', (props) => (
	<RouteNode nodeName="">
		{({ route }) => <App route={route} {...props} />}
	</RouteNode>))
