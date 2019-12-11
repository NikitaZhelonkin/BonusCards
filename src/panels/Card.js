import React, { useState } from 'react';

import { platform, IOS, Group, Panel, Div, Button, PanelHeader, HeaderButton, Alert, Footer, Snackbar } from '@vkontakte/vkui';

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Delete from '@vkontakte/icons/dist/24/delete'
import Icon24Share from '@vkontakte/icons/dist/24/share'

import './Cards.css';
import Barcode from 'react-barcode'
import useStoreon from 'storeon/react'

import vkconnect from '@vkontakte/vk-connect';

const osName = platform();

const Card = props => {
	const { dispatch, cards } = useStoreon('cards')

	const [snackbar, setSnackbar] = useState(null);


	const card = cards.filter((card) => card.id === Number(props.route.params.id))[0]


	const closeDialog = () => {
		props.setPopout(null)
	}

	const showDeleteDialog = () => {
		props.setPopout(<Alert
			actionsLayout="vertical"
			onClose={closeDialog}
			actions={[{
				title: 'Удалить',
				autoclose: true,
				style: 'destructive',
				action: () => {
					window.history.back()
					dispatch('cards/delete', ({ cards }, card.id))
				},
			}, {
				title: 'Отмена',
				autoclose: true,
				style: 'cancel',
			}]}
		>
			<h2>Подтвердите действие</h2>
			<p>Вы уверены, что хотите<br></br>удалить карту {card.name}?</p>
		</Alert>)
	}

	const share = () => {
		const link = 'https://vk.com/app7225850#/add?name=' + encodeURIComponent(card.name)+'&serviceid=' + card.serviceId + '&number=' + card.number;
		console.log(link)
		vkconnect.send("VKWebAppShare", { "link": link });
	}

	const copyToClipboard = () => {
		setSnackbar(true)
		vkconnect.send("VKWebAppCopyText", { text: card.number });
	}

	return (
		<Panel id={props.id}>
			<PanelHeader
				left={<HeaderButton onClick={() => window.history.back()} >
					{osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
				</HeaderButton>}
			>
				{
					typeof card !== 'undefined' &&
					card.name
				}

			</PanelHeader>


			{
				typeof card !== 'undefined' &&
				<div>
					<Group >
						<div className="Barcode" onClick={copyToClipboard} >
							<Barcode value={card.number.toString()} displayValue={true} fontSize={25} height={120} />
						</div>

					</Group>


					<Footer>Предьявите этот код на кассе магазина</Footer>

					<Div style={{ display: 'flex' }}>
						<Button before={<Icon24Share />} size="l" stretched level="secondary" onClick={share} style={{ marginRight: 8 }}>Поделиться</Button>
						<Button before={<Icon24Delete />} size="l" stretched level="secondary" onClick={showDeleteDialog}>Удалить</Button>
					</Div>
				</div>
			}
			{
				snackbar && <Snackbar
					layout="vertical"
					onClose={() => setSnackbar(false)}
				>
					Номер скопирован в буфер обмена
	  			</Snackbar>
			}


		</Panel>
	);
}



export default Card;
