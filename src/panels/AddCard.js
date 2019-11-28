import React from 'react';


import { Panel, PanelHeader, FormLayout, Textarea, Input, FixedLayout, Button, Div, platform, ANDROID,IOS, FormStatus,HeaderButton } from '@vkontakte/vkui'


import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Done from '@vkontakte/icons/dist/24/done'

import connect from 'storeon/react/connect'

import './Cards.css';

class AddCard extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
			name : '',
			number : '',
			error : false
        }; 

    }
    onClickAddTask = () => {
		let {
			go
		} = this.props

		let {
			name,
			number
		} = this.state

        
		if (name !== '' && number !== '') {
			this.setState({ error : false })
            const cards = this.props.cards;
			this.props.dispatch('cards/add', ({ cards }, { name, number }))
			go("home")
		} else {
			this.setState({ error : true })
		}

	}

    onChangeNameTask = (e) => {
		const name = e.target.value
		this.setState({ name })
	}

	onChangeTextTask = (e) => {
		const number = e.target.value
		this.setState({ number })
	}

    render(){
        const osname = platform()
    
        return (
            <Panel id={this.props.id}>
                <PanelHeader
                    left={<HeaderButton onClick={() => this.props.go('home')} >
                        {osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                    </HeaderButton>}
                >
                    Add New Card
    
    
                </PanelHeader>
    
                <FormLayout>
                        {
                            this.state.error === true &&
                            <FormStatus title="Некорректные поля" state="error">
                                Заполните все поля
                            </FormStatus>
                        }
                        <Input 
                            onChange={this.onChangeNameTask}
                            type='text'
                            value={this.state.name}
                            placeholder='Название магазина' 
                        />
                        <Textarea 
                            onChange={this.onChangeTextTask}
                            value={this.state.number}
                            placeholder='Номер карты' />
                    </FormLayout>
                    <FixedLayout vertical='bottom'>
                        {
                            osname === ANDROID ? 
                            <Div style={{ float : 'right' }}>
                                <Button
                                    className='FixedBottomButton'
                                    onClick={(e) => this.onClickAddTask(e)}
                                >
                                    <Icon24Done/>
                                </Button>
                            </Div>
                            :
                            <Div>
                                <Button
                                    size='xl'
                                    onClick={(e) => this.onClickAddTask(e)}
                                >
                                    Добавить
                                </Button>
                            </Div>
                        }
                    </FixedLayout>
                
            </Panel>
        );
    }



   
}

export default connect('cards', AddCard)