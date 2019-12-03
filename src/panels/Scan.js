import React, { Component } from 'react'

import { Panel ,Div, Group, View} from '@vkontakte/vkui';

class Scan extends Component {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
        this.handleVideo = this.handleVideo.bind(this);
        this.videoError = this.videoError.bind(this);
    }

    handleVideo(stream) {
        this.videoRef.current.srcObject = stream;
    }

    videoError = (err) => {
        alert(err.name)
    }


    componentDidMount() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        if (navigator.getUserMedia) {
            let constraints = {
                audio: false,
                video: {facingMode: 'environment'}
            };

            navigator.mediaDevices.getUserMedia(constraints)
                .then(this.handleVideo)
                .catch(this.videoError)
        }
    }

    render() {
        return (
            <View activePanel="mainPanel" header={false}>
                <Panel id="mainPanel">
                    <Group>
                        <Div>
                            <video ref={this.videoRef} style={{width: '100%'}} playsInline autoPlay muted/>
                        </Div>
                    </Group>
                </Panel>
            </View>
        );
    }
}

export default Scan