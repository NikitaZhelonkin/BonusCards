import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, Group, Panel, FixedLayout, Div, Button, ANDROID, PanelHeader, HeaderButton, Alert } from '@vkontakte/vkui';

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Delete from '@vkontakte/icons/dist/24/delete'

import './Cards.css';
import Barcode from 'react-barcode'
import useStoreon from 'storeon/react'

const osName = platform();

const Card = props => {
	const { dispatch, cards } = useStoreon('cards')
	const card = cards.filter((card) => card.id === Number(props.args))[0]
	
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
					props.go('home')
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


	return (
		<Panel id={props.id}>
			<PanelHeader
				left={<HeaderButton onClick={() => props.go('home')} >
					{osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
				</HeaderButton>}
			>
				{
					typeof props.args !== 'undefined' &&
					card.name
				}


			</PanelHeader>


			{
				typeof props.args !== 'undefined' &&
				<Group>
					<div className="Barcode" >
						<Barcode value={card.number.toString()} displayValue={true} fontSize={25} />
					</div>

				</Group>
			}

			<FixedLayout vertical='bottom'>
				{
					platform() === ANDROID ?
						<Div style={{ float: 'right' }}>
							<Button
								className='FixedBottomButton'
								onClick={() => {
									props.go('home')
									dispatch('cards/delete', ({ cards }, card.id))
								}}
							>
								<Icon24Delete />
							</Button>
						</Div>
						:
						<Div>
							<Button
								size="xl"
								onClick={showDeleteDialog}
							>
								Удалить карту
									</Button>
						</Div>
				}
			</FixedLayout>
		</Panel>
	);
}

Card.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	args: PropTypes.any
};

export default Card;
