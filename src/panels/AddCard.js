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

        let number = props.route.params.number != null ? parseInt(props.route.params.number) : '';
        this.state = {
            tooltip: props.prefs["scan_tooltip_shown"] !== true,
            serviceId: props.route.params.serviceid,
            name: decodeURIComponent(props.route.params.name),
            number: number,
            error: !this.isValidCard(number),
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
        this.props.dispatch('prefs/set', { key: "scan_tooltip_shown", value: true })
        this.setState({ tooltip: false })
    }

    onDone = (data) => {
        this.setState({ number: data.qr_data, error:false })
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
                        caption="Найдите хорошее освещение"
                        actions={[
                            {
                                title: 'Больше не показывать',
                                type: 'secondary',
                                action: () => {
                                    this.props.dispatch('prefs/set', { key: "scan_ios_tooltip_shown", value: true })
                                    this.props.setModal(null);
                                    this.scan(prop);
                                }
                            },
                            {
                                title: 'Понял',
                                type: 'primary',
                                action: () => {
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
        window.history.back()
    }

    goHome = () => {
        if (window.history.length === 1) {
            this.props.router.navigate("home", {}, { replace: true })
        } else {
            window.history.go(1 - window.history.length)
        }
    }

    onAddClick = () => {

        let {
            name,
            number
        } = this.state

        if (this.isValidName(name) && this.isValidCard(number)) {
            this.setState({ error: false })
            const serviceId = this.state.serviceId;
            const uid = this.props.user.uid;
            this.props.dispatch('cards/api/add', { uid, name, number, serviceId })
            this.goHome();
        } else {
            this.setState({ error: true })
        }

    }

    onChangeText = (e) => {
        // eslint-disable-next-line
        const number = e.target.value.trim().substring(0, 24).replace(/[^\x00-\x7F]/g, "")
        this.setState({ number, error: !this.isValidCard(number) })
    }

    isValidName(name) {
        return name !== '';
    }

    isValidCard(number) {
        return number.match("^[\x00-\x7F]{6,24}$");
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
                                style={{ paddingRight: 56 }}
                                autoFocus
                                status='default'
                                onChange={this.onChangeText}
                                value={this.state.number}
                                type="text"
                                placeholder='Введите номер карты' />
                        </Tooltip>

                        <IconBarcode onClick={this.onScanClick} className="Scan" width={30} height={30} fill="var(--control_foreground)" />


                    </div>

                </FormLayout>



                <Div>
                    <Button
                        disabled={this.state.error === true}
                        size='xl'
                        onClick={(e) => this.onAddClick(e)}>
                        Создать
                    </Button>
                </Div>

            </Panel>
        );
    }


}

export default connect('cards', "prefs", AddCard)