// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
/* eslint-disable react/no-string-refs */

import $ from 'jquery';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import Constants from 'utils/constants';
import * as Utils from 'utils/utils.jsx';

import FileInfoPreview from 'components/file_info_preview';

export default class AudioVideoPreview extends React.PureComponent {
    static propTypes = {

        /**
        * Compare file types
        */
        fileInfo: PropTypes.object.isRequired,

        /**
        *  URL of pdf file to output and compare to update props url
        */
        fileUrl: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            canPlay: true,
        };
    }

    componentDidMount() {
        this.handleFileInfoChanged(this.props.fileInfo);

        if (this.refs.source) {
            $(ReactDOM.findDOMNode(this.refs.source)).one('error', this.handleLoadError);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.fileUrl !== prevProps.fileUrl) {
            this.handleFileInfoChanged(this.props.fileInfo);
        }

        if (this.refs.source) {
            $(ReactDOM.findDOMNode(this.refs.source)).one('error', this.handleLoadError);
        }
    }

    handleFileInfoChanged = (fileInfo) => {
        let video = ReactDOM.findDOMNode(this.refs.video);
        if (!video) {
            video = document.createElement('video');
        }

        const canPlayType = video.canPlayType(fileInfo.mime_type);

        this.setState({
            canPlay: canPlayType === 'probably' || canPlayType === 'maybe',
        });
    }

    handleLoadError = () => {
        this.setState({
            canPlay: false,
        });
    }

    stop = () => {
        if (this.refs.video) {
            const video = ReactDOM.findDOMNode(this.refs.video);
            video.pause();
            video.currentTime = 0;
        }
    }

    render() {
        if (!this.state.canPlay) {
            return (
                <FileInfoPreview
                    fileInfo={this.props.fileInfo}
                    fileUrl={this.props.fileUrl}
                />
            );
        }

        let width = Constants.WEB_VIDEO_WIDTH;
        let height = Constants.WEB_VIDEO_HEIGHT;
        if (Utils.isMobile()) {
            width = Constants.MOBILE_VIDEO_WIDTH;
            height = Constants.MOBILE_VIDEO_HEIGHT;
        }

        // add a key to the video to prevent React from using an old video source while a new one is loading
        return (
            <video
                key={this.props.fileInfo.id}
                ref='video'
                data-setup='{}'
                controls='controls'
                width={width}
                height={height}
            >
                <source
                    ref='source'
                    src={this.props.fileUrl}
                />
            </video>
        );
    }
}
/* eslint-enable react/no-string-refs */
