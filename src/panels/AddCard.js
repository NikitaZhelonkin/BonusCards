import React from 'react';


import { Panel, PanelHeader, FormLayout, FormLayoutGroup, Input, FixedLayout, Button, Div, platform, ANDROID, IOS, FormStatus, HeaderButton } from '@vkontakte/vkui'


import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Done from '@vkontakte/icons/dist/24/done'

import connect from 'storeon/react/connect'
import vkconnect from '@vkontakte/vk-connect';

import { ReactComponent as YourSvg } from '../img/barcode.svg';

import './Cards.css';

class AddCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            number: '',
            error: false
        };

    }

    onDone = (data) => {
        this.setState({ number: data.qr_data })
    }

    onError = (error) => {
        //TODO show error
    }

    scan = (prop) => {
        vkconnect
            .sendPromise('VKWebAppOpenQR')
            .then(this.onDone)
            .catch(this.onError);

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
            this.setState({ error: false })
            const cards = this.props.cards;
            this.props.dispatch('cards/add', ({ cards }, { name, number }))
            go("home")
        } else {
            this.setState({ error: true })
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

    render() {
        const osname = platform()

        return (
            <Panel id={this.props.id}>
                <PanelHeader
                    left={<HeaderButton onClick={() => this.props.go('home')} >
                        {osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                    </HeaderButton>}

                >
                    Добавить карту


                </PanelHeader>



                <FormLayout>
                    {
                        this.state.error === true &&
                        <FormStatus title="Некорректные поля" state="error">
                            Заполните все поля
                            </FormStatus>
                    }

                    <FormLayoutGroup top="Название магазина">
                        <Input
                            onChange={this.onChangeNameTask}
                            type='text'
                            value={this.state.name}
                            placeholder='Введите название магазина'
                        />
                    </FormLayoutGroup>

                    <FormLayoutGroup top="Номер карты">
                        <Input
                            onChange={this.onChangeTextTask}
                            value={this.state.number}
                            placeholder='Введите номер карты' />

                        <Button
                            level="secondary"
                            before={<YourSvg className="Scan" width={30} fill="var(--control_foreground)" />}
                            size='l'
                            onClick={this.scan}
                        >
                            Сканировать
                </Button>

                    </FormLayoutGroup>





                </FormLayout>




                <FixedLayout vertical='bottom'>
                    {
                        osname === ANDROID ?
                            <Div style={{ float: 'right' }}>
                                <Button
                                    className='FixedBottomButton'
                                    onClick={(e) => this.onClickAddTask(e)}
                                >
                                    <Icon24Done />
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