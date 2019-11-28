import React from 'react';
import PropTypes from 'prop-types';
import useStoreon from 'storeon/react'
import { Panel,  FixedLayout, Div, Button, platform, ANDROID, List, Cell, PanelHeader } from 
'@vkontakte/vkui'
import Icon24Add from '@vkontakte/icons/dist/24/add'


const Home = ({ id, go }) => {
	const { dispatch, cards } = useStoreon('cards')
	
	return (
		<Panel id={id}>
			<PanelHeader>Bonus Cards</PanelHeader>

			<List>
				{
					cards.map((card, index) => (
						<Cell
							multiline
							expandable
							removable={false}
							key={index}
							onRemove={() => dispatch('cards/delete', ({ cards }, card.id))}
							onClick={() => go('card', card.id)}

						>
							{card.name}
						</Cell>
					))
				}
			</List>

			<FixedLayout vertical='bottom'>
							{
								platform() === ANDROID ?
								<Div style={{ float : 'right' }}>
									<Button
										className='FixedBottomButton'
										onClick={()=>go('add')}
									>
										<Icon24Add/>
									</Button>
								</Div>
								:
								<Div>
									<Button
										size="xl"
										onClick={()=>go('add')}
									>
										Добавить новую карту
									</Button>
								</Div>
							}
							
						</FixedLayout>
		</Panel>
	);


}

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
