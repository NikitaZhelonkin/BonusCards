import React from 'react';
import PropTypes from 'prop-types';
import { Panel, FixedLayout, Div, Button, platform, ANDROID, List, Cell, PanelHeader, Search } from
	'@vkontakte/vkui'
import Icon24Add from '@vkontakte/icons/dist/24/add'
import connect from 'storeon/react/connect'
import vkconnect from '@vkontakte/vk-connect';

class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = { search: '' };
		this.onChange = this.onChange.bind(this);
	}

	onChange(search) { this.setState({ search }); }

	scan() {
		console.log("scan");
		vkconnect
			.sendPromise('VKWebAppOpenCodeReader')
			.then(data => {
				// Обработка события в случае успеха
				console.log("data:"+data);
			})
			.catch(error => {
				console.log("error:"+error);
			});

	}

	get cards() {
		const cards = this.props.cards;
		const search = this.state.search.toLowerCase();
		const filtered = cards.filter(({ name }) => {
			return name.toLowerCase().indexOf(search) > -1;
		});
		
		return filtered;
	}



	render() {
		let {
			id,
			go,
			cards,
			dispatch
		} = this.props

		return (
			<Panel id={id}>
				<PanelHeader >Bonus Cards</PanelHeader>

				<Search value={this.state.search} onChange={this.onChange} theme="default" />


				<List>
					{
						this.cards.map((card) => (
							<Cell

								multiline
								expandable
								removable={false}
								key={card.id}
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
							<Div style={{ float: 'right' }}>
								<Button
									className='FixedBottomButton'
									onClick={this.scan}
								>
									<Icon24Add />
								</Button>
							</Div>
							:
							<Div>
								<Button
									size="xl"
									onClick={this.scan}
								>
									Добавить новую карту
									</Button>
							</Div>
					}

				</FixedLayout>
			</Panel>
		);
	}
}

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired
};

export default connect('cards', Home)
