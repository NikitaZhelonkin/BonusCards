import React from 'react';


import { Panel, PanelHeader, FormLayout, Input, Button, Div, platform, IOS, HeaderButton, Cell, Avatar, Tooltip, ModalCard, ModalRoot } from '@vkontakte/vkui'



import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon28Money from '@vkontakte/icons/dist/28/money_transfer'

import connect from 'storeon/react/connect'
import vkconnect from '@vkontakte/vk-connect';

import { ReactComponent as IconBarcode } from '../img/barcode.svg';
import imgBarcode from '../img/barcode_how.png';

import './Cards.css';


class AddCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tooltip: props.prefs["scan_tooltip_shown"] !== true,
            serviceId: props.route.params.serviceid,
            name: decodeURIComponent(props.route.params.name),
            number: props.route.params.number != null ? parseInt(props.route.params.number) : '',
            error: false,
            service: null
        };



    }

    componentDidMount() {
        fetch(`./data.json`)
            .then(res => res.json())
            .then(json => this.setState({
                service: json.data.all.filter(({ id }) => {
                    return id === this.state.serviceId
                })[0]
            }));
    }

    onTooltipClose = () => {

        this.props.dispatch('prefs/set',{ key: "scan_tooltip_shown", value: true })
        this.setState({ tooltip: false })
    }

    onDone = (data) => {
        this.setState({ number: data.qr_data })
    }

    onError = (error) => {
        //TODO show error
    }

    onScanClick = (prop) => {
        const showScanIosTooltip = this.props.prefs["scan_ios_tooltip_shown"] !== true && platform === IOS
        if (showScanIosTooltip) {
            this.props.setModal(
                <ModalRoot activeModal="modal">
                    <ModalCard
                        id="modal"
                        onClose={() => this.props.setModal(null)}
                        icon={<Avatar type="app" src={imgBarcode} size={72} />}
                        title="Чтобы отсканировать, наведите код на нижнюю часть рамки"
                        caption="И еще найдите хорошее освещение"
                        actions={[{
                            title: 'Понял',
                            type: 'primary',
                            action: () => {
                                this.props.dispatch('prefs/set',  { key: "scan_ios_tooltip_shown", value: true })
                                this.props.setModal(null);
                                this.scan(prop);
                            }
                        }
                        ]}
                    />
                </ModalRoot>)
        } else {
            this.scan(prop);
        }

    }


    scan = (prop) => {
        vkconnect
            .sendPromise('VKWebAppOpenQR')
            .then(this.onDone)
            .catch(this.onError);

    }


    goBack = () => {
        if (window.history.length === 1) {
            this.props.router.navigate("home", {}, { replace: true })
        } else {
            window.history.back()
        }
    }

    goHome = () => {
        if (window.history.length === 1) {
            this.props.router.navigate("home", {}, { replace: true })
        } else {
            window.history.go(1 - window.history.length)
        }
    }

    onClickAddTask = () => {

        let {
            name,
            number
        } = this.state

        if (name !== '' && number !== '') {
            this.setState({ error: false })            // const data = loadData().data;
            const cards = this.props.cards;
            const serviceId = this.state.serviceId;
            const uid = this.props.user.uid;
            this.props.dispatch('cards/api/add', ({ cards }, { uid, name, number, serviceId }))
            this.goHome();
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
                    left={<HeaderButton onClick={() => this.goBack()} >
                        {osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                    </HeaderButton>}

                >
                    Новая карта

                </PanelHeader>


                <Cell
                    style={{ marginTop: 10 }}
                    before={
                        this.state.service != null && this.state.service.logo != null ?
                            <Avatar type="image" src={process.env.PUBLIC_URL + this.state.service.logo} style={{ background: this.state.service.bgColor }} />
                            :
                            <Avatar type="image" ><Icon28Money /></Avatar>
                    }
                >
                    {this.state.name}
                </Cell>


                <FormLayout>


                    <div >
                        <Tooltip text="Карту можно отсканировать"
                            isShown={this.state.tooltip}
                            alignX="right"
                            cornerOffset={-10}
                            offsetX={-5}
                            offsetY={5}
                            onClose={this.onTooltipClose}>
                            <Input
                                autoFocus
                                status={this.state.error === true ? 'error' : 'valid'}
                                onChange={this.onChangeTextTask}
                                value={this.state.number}
                                type='number'
                                placeholder='Введите номер карты' />

                        </Tooltip>

                        <IconBarcode onClick={this.onScanClick} className="Scan" width={30} height={30} fill="var(--control_foreground)" />


                    </div>

                </FormLayout>



                <Div>
                    <Button
                        size='xl'
                        onClick={(e) => this.onClickAddTask(e)}>
                        Создать
                    </Button>
                </Div>

            </Panel>
        );
    }


}

export default connect('cards', "prefs", AddCard)