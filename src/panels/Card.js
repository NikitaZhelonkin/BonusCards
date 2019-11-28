import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, Group } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import HeaderButton from '@vkontakte/vkui/dist/components/HeaderButton/HeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import './Cards.css';
import Barcode from 'react-barcode'
import useStoreon from 'storeon/react'

const osName = platform();

const Card = props => {
	const { cards } = useStoreon('cards')
	const task = cards.filter((card) => card.id === Number(props.args))[0]
	return (
		<Panel id={props.id}>
			<PanelHeader
				left={<HeaderButton onClick={() => props.go('home')} >
					{osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
				</HeaderButton>}
			>
				{
					typeof props.args !== 'undefined' &&
					task.name
				}


			</PanelHeader>


			{
				typeof props.args !== 'undefined' &&
				<Group>
					<div className="Barcode" >
						<Barcode value={task.number} displayValue='true' fontSize={25} />
					</div>

				</Group>
			}
		</Panel>
	);
}

Card.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	args: PropTypes.any
};

export default Card;
