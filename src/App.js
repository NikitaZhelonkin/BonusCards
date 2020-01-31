import React, { useState, useEffect, useRef } from 'react';
import connect from 'storeon/react/connect'

import { View, Root, Panel, Spinner, Footer, FixedLayout, Placeholder, PanelHeader, ConfigProvider } from '@vkontakte/vkui'
import Icon56InfoOutline from '@vkontakte/icons/dist/56/info_outline';
import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';
import Card from './panels/Card';
import vkconnect from '@vkontakte/vk-connect';
import AddCard from './panels/AddCard';
import Services from './panels/Services';
import firebase from './firebase'


import packageJson from './package.alias.json';


const App = (props) => {

	const [activePanel, setActivePanel] = useState({ name: "home", args: {} });
	const [history, setHistory] = useState([{ name: "home", args: {} }]);


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

	const goBack = () => {

		if (poputRef.current != null) {
			setPopout(null)
		} else if (history.length === 1) {
			vkconnect.send("VKWebAppClose");
		} else if (history.length > 1) {
			history.pop()
			setActivePanel(history[history.length - 1])
			console.log("setActivePanel"+history[history.length - 1].name)
		}
	}

	const goHome = () => {
		history.length = 0;
		history.push({ name: "home", args: {} })
		
		setActivePanel({ name: "home", args: {} });
		
		
	}

	const goToPage = (page, args) => {
		window.history.pushState(args, page)
		history.push({ name: page, args: args || {} })
		
		setActivePanel({ name: page, args: args || {} });
	
	};

	useEffect(() => {
		poputRef.current = popout;
	}, [popout])


	useEffect(() => {

		window.addEventListener('popstate', e => { e.preventDefault(); goBack(e) });

		const authorise = async function () {

			const response = await fetch("https://europe-west2-bonuscards-42f7a.cloudfunctions.net/token" + props.search)

			const json = await response.json();
			console.log("params checked");


			await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

			console.log("signInWithCustomToken");
			await firebase.auth().signInWithCustomToken(json.token);

		}

		const onUser = function (user) {

			setUser(user);

			props.dispatch('cards/listen', { uid: user.uid })

			const hashParams = parseQueryString(props.hash)
			if (hashParams.add_number != null && hashParams.add_name != null) {
				goToPage('add', { name: hashParams.add_name, number: hashParams.add_number, serviceid: hashParams.add_service_id })
			}
		}



		if (firebase.auth().currentUser != null) {
			onUser(firebase.auth().currentUser)
		} else {
			firebase.auth().onAuthStateChanged(function (user) {
				if (user) {
					onUser(user)
				} else {
					authorise().catch((error) => {
						setError(error);
						console.log("auth error:" + error)
					})
				}
			}, (error) => {
				console.log(error)
			});

		}

		vkconnect.subscribe((e) => {
			if (e.detail.type === "VKWebAppViewRestore") {
				let user = firebase.auth().currentUser;
				if (user) {
					onUser(user);
				}
			} else if (e.detail.type === "VKWebAppViewHide") {
				console.log("terminate")
				firebase.firestore().terminate();

			}
		});

		// eslint-disable-next-line
	}, []);


	return (
		
		<ConfigProvider isWebView={true}>
			<Root activeView={error != null ? "error" : props.cards.loading === true ? "splash" : "main"}>
				<View id="splash" activePanel="splash">
					<Panel id="splash">


						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>

							<Spinner size="large" />
						</div>

						<FixedLayout vertical='bottom'>

							<Footer className="unselectable">{packageJson.version}</Footer>
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

				<View id="main" activePanel={activePanel.name} popout={popout} modal={modal} onSwipeBack={goBack}>
					<Home id='home' goToPage={goToPage} user={user} args={activePanel.args} />
					<Card id='card' goToPage={goToPage} goBack={goBack} setPopout={setPopout} args={activePanel.args} />
					<Services id='services' goToPage={goToPage} goBack={goBack} args={activePanel.args} />
					<AddCard id='add' goToPage={goToPage} goBack={goBack} goHome={goHome} args={activePanel.args} user={user} setModal={setModal} />

				</View>


			</Root>



		</ConfigProvider>

	)

}

export default connect('cards', App)
