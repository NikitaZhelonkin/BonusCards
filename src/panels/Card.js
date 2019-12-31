import React, { useState, useEffect } from 'react';

import { platform, IOS, Group, Panel, Div, Button, PanelHeader, HeaderButton, Alert, Footer, Snackbar, Placeholder } from '@vkontakte/vkui';

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Delete from '@vkontakte/icons/dist/24/delete'
import Icon24Share from '@vkontakte/icons/dist/24/share'
import Icon56InfoOutline from '@vkontakte/icons/dist/56/info_outline';

import './Cards.css';
import Barcode from 'react-barcode'
import useStoreon from 'storeon/react'

import vkconnect from '@vkontakte/vk-connect';

const osName = platform();

const Card = props => {
	const { dispatch, cards } = useStoreon('cards')

	const [snackbar, setSnackbar] = useState(null);


	const card = cards.data.filter((card) => card.id === props.route.params.id)[0]


	const closeDialog = () => {
		props.setPopout(null)
	}

	const showDeleteDialog = () => {
		props.setPopout(<Alert
			actionsLayout="vertical"
			onClose={closeDialog}
			actions={[{
				title: 'Удалить',
				false: true,
				style: 'destructive',
				action: () => {
					closeDialog()
					window.history.back()
					dispatch('cards/api/delete', card)
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
		const link = 'https://vk.com/app7225850#add_name=' + encodeURIComponent(card.name) + '&add_service_id=' + card.serviceId + '&add_number=' + card.number;
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
					typeof card !== 'undefined' ? card.name : "Упс"
				}

			</PanelHeader>


			{
				typeof card !== 'undefined' &&
				<div>
					<Group >

						<div className="BarcodeContainer" onClick={copyToClipboard} >
							<div className="Barcode">
								<Barcode value={card.number.toString()} displayValue={true} fontSize={25} height={120} />
							</div>
						</div>

					</Group>


					<Footer>Предъявите этот код на кассе магазина</Footer>

					<Div style={{ display: 'flex' }}>
						<Button before={<Icon24Share />} size="l" stretched level="secondary" onClick={share} style={{ marginRight: 8 }}>Поделиться</Button>
						<Button before={<Icon24Delete />} size="l" stretched level="destructive" onClick={showDeleteDialog}>Удалить</Button>
					</Div>
				</div>
			}
			{
				typeof card === 'undefined' &&
				<Placeholder
					icon={<Icon56InfoOutline />}>
					Такой карточки нет, либо она была удалена
				</Placeholder>

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
