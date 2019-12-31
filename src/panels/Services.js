import React from 'react';
import PropTypes from 'prop-types';
import { Panel, HeaderButton, IOS, platform, Cell, PanelHeader, Search, Avatar, Spinner, Header } from
    '@vkontakte/vkui'

import { List as Virtualized, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized";

import cyrillicToTranslit from 'cyrillic-to-translit-js'
import Icon24Back from '@vkontakte/icons/dist/24/back'
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back'
import Icon28Money from '@vkontakte/icons/dist/28/money_transfer'


import './Cards.css';



const osname = platform();

class Services extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = { search: '', services: [], popular: [] };
        this.onChange = this.onChange.bind(this);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 100
        });
    }

    onChange(search) {
        this.setState({ search: search.substring(0, 40) });
    }

    matchSearch(keyword, search) {
        return keyword.toLowerCase().indexOf(search) > -1;
    }

    get services() {
        const search = this.state.search.toLowerCase().trim();
        const searchTranslit = cyrillicToTranslit().transform(search);
        const filtered = this.state.services.filter((service) => {

            return this.matchSearch(service.name, search) || this.matchSearch(service.name, searchTranslit) || (service.keywords != null && service.keywords.filter((keyword) => {
                return this.matchSearch(keyword, search) || this.matchSearch(keyword, searchTranslit)
            }).length > 0);
        }).map((service)=>{
            return service
        });

        if (search.length > 0) {
            filtered.unshift({
                id: null,
                logo: null,
                name: search
            });
        }

        return filtered.map((service)=>{
            service.name = service.name.charAt(0).toUpperCase() + service.name.slice(1);
            return service
        });
    }


    componentDidMount() {
        fetch(`./data.json`)
            .then(res => res.json())
            .then(json => this.setState({
                services: json.data.all, popular: json.data.all.filter(({ id }) => {
                    return json.data.popular.includes(id)
                })
            }));
    }


    renderHeader() {
        return (
            <div>
                <Header level="secondary">Популярное</Header>
                {this.state.popular.map((service) => this.renderCard(service))}
                <Header level="secondary">Все</Header>
            </div>
        )
    }


    renderRow(index, key, style, parent) {
        var card = this.services[index];
        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}>
                <div key={key} style={style} >
                    {/* {index === 0 && this.state.search.length == 0 && this.renderHeader()} */}
                    {this.renderCard(card)}
                </div>
            </CellMeasurer>
        )
    }

    renderCard(card) {
        return (
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
                onClick={() => {
                    this.props.router.navigate('add', { name: card.name, serviceid: card.id })
                }}
            >
                {card.name}
            </Cell>
        )
    }


    goBack() {
        window.history.back()
    }

    render() {
        let {
            id,
        } = this.props

        return (
            <Panel id={id}>

                <PanelHeader
                    left={<HeaderButton onClick={this.goBack} >{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
                >

                    <Search
                        theme="header"
                        style={{ paddingRight: platform == IOS ? 0 : 56 }}
                        value={this.state.search}
                        onChange={this.onChange}
                        onClose={this.goBack}
                    />

                </PanelHeader>

                {
                    this.state.services.length === 0 &&
                    <Spinner size="medium" style={{ marginTop: 20 }} />
                }



                <AutoSizer>
                    {({ height, width }) => (


                        <Virtualized

                            width={width}
                            height={height}
                            deferredMeasurementCache={this.cache}
                            rowHeight={this.cache.rowHeight}
                            rowRenderer={({ index, key, style, parent }) => this.renderRow(index, key, style, parent)}
                            rowCount={this.services.length}
                            overscanRowCount={3} >

                        </Virtualized>


                    )}

                </AutoSizer>


            </Panel>
        );
    }
}


Services.propTypes = {
    id: PropTypes.string.isRequired,

};

export default Services