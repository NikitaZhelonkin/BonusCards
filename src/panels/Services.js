import React from 'react';
import PropTypes from 'prop-types';
import { Panel, HeaderButton, IOS, platform, List, Cell, PanelHeader, Search, Avatar, Spinner } from
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
        this.state = { search: '', services: [] };
        this.onChange = this.onChange.bind(this);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 100
        });
    }

    onChange(search) { this.setState({ search }); }

    matchSearch(keyword, search) {
        return keyword.toLowerCase().indexOf(search) > -1;
    }

    get services() {
        const search = this.state.search.toLowerCase();
        const searchTranslit = cyrillicToTranslit().transform(search);
        const filtered = this.state.services.filter((service) => {
           
            return this.matchSearch(service.name, search) || this.matchSearch(service.name, searchTranslit) || (service.keywords != null && service.keywords.filter((keyword) => {
                return  this.matchSearch(keyword, search) || this.matchSearch(keyword, searchTranslit) }).length > 0);
        });

        if (search.length > 0) {
            filtered.unshift({
                id: null,
                logo: null,
                name: search.charAt(0).toUpperCase() + search.slice(1)
            });
        }

        return filtered;
    }


    componentDidMount() {
        fetch(`./data.json`)
            .then(res => res.json())
            .then(json => this.setState({ services: json.data }));
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
                </div>
            </CellMeasurer>
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
                        <List>
                            <Virtualized
                                width={width}
                                height={height}
                                deferredMeasurementCache={this.cache}
                                rowHeight={this.cache.rowHeight}
                                rowRenderer={({ index, key, style, parent }) => this.renderRow(index, key, style, parent)}
                                rowCount={this.services.length}
                                overscanRowCount={3} />
                        </List>
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