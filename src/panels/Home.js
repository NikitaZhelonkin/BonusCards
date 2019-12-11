import React from 'react';

import { Panel, FixedLayout, Div, Button, platform, ANDROID, List, Cell, PanelHeader, Search, Footer, Avatar } from
	'@vkontakte/vkui'
import Icon24Add from '@vkontakte/icons/dist/24/add'
import Icon28Money from '@vkontakte/icons/dist/28/money_transfer'
import connect from 'storeon/react/connect'
import cyrillicToTranslit from 'cyrillic-to-translit-js'
import persik from '../img/persik.png';
import './Cards.css';

class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = { search: '', services: [] };
		this.onChange = this.onChange.bind(this);
	}

	onChange(search) { this.setState({ search }); }

	get cards() {
		const cards = this.props.cards;
		const search = this.state.search.toLowerCase();
		const searchTranslit = cyrillicToTranslit().transform(search);
		const filtered = cards.filter(({ name }) => {
			return name.toLowerCase().indexOf(search) > -1 || name.toLowerCase().indexOf(searchTranslit) > -1;;
		}).map((card) => {
			const service = this.state.services.filter(({ id }) => {
				return id === card.serviceId
			})[0];
			return ({
				id: card.id,
				name: card.name,
				number: card.number,
				logo: service != null ? service.logo : null,
				bgColor: service != null ? service.bgColor : null
			})
		});

		return filtered;
	} 

	componentDidMount() {
		fetch(`./data.json`)
			.then(res => res.json())
			.then(json => this.setState({ services: json.data }));
	} 

	render() {
		let {
			id,
			router,
			cards,
			dispatch
		} = this.props



		return (
			<Panel id={id}>
				<PanelHeader noShadow>Бонус карты</PanelHeader>

				<Search value={this.state.search} onChange={this.onChange} theme="default" />

				{
					this.cards.length === 0 && this.state.search.length === 0 ?

						<Footer>
							<img className="Persik" src={persik} alt="Persik The Cat" />
							Вы пока не добавили ни одной карточки
						</Footer>
						: this.cards.length === 0 &&
						<Footer>
							<img className="Persik" src={persik} alt="Persik The Cat" />
							По вашему запросу ничего не найдено
						</Footer>
				}

				<List>
					{
						this.cards.map((card) =>
							(
								<Cell
									before={
										typeof card.logo !== 'undefined' && card.logo != null ?
											<Avatar type="image" src={process.env.PUBLIC_URL + card.logo} style={{ background: card.bgColor }} />
											:
											<Avatar type="image" ><Icon28Money /></Avatar>
									}
									multiline
									expandable
									removable={false}
									key={card.id}
									onRemove={() => dispatch('cards/delete', ({ cards }, card.id))}
									onClick={() => router.navigate('card', { id: card.id })}

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
									onClick={() => router.navigate('services')}
								>
									<Icon24Add />
								</Button>
							</Div>
							:
							<Div>
								<Button
									size="xl"
									onClick={() => router.navigate('services')}
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


export default connect('cards', Home)
