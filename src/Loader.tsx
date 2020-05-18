/* MIT License

Copyright (c) 2019 Benoit Baudaux

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import React from 'react';
import { connect } from 'react-redux'

import { StyleActionTypes, LoadingState } from './StyleReducerTypes';
import { selectStyle } from './StyleReducerActions';

import { RootState } from './RootReducer';

import './Loader.css';

interface IProps {
}

interface StateProps {
    styleUrl: string;
    loadingState: LoadingState;
}

interface DispatchProps {
    selectStyle: (style_url: string) => void;
}

interface IState {

    styleUrl: string;
}

type Props = StateProps & DispatchProps & IProps;

function mapStateToProps(state: RootState, ownProps: IProps): StateProps {

    return { styleUrl: state.style.styleUrl, loadingState: state.style.loadingState };
}

const mapDispatchToProps = {

    selectStyle,
};

class Loader extends React.Component <Props,IState> {

    constructor(props: Props) {

        super(props);

        this.state = {styleUrl: 'https://<path>/style.json'};

        this.onChange = this.onChange.bind(this);
        this.onLoad = this.onLoad.bind(this);
    }

    onChange(event: any) {

        this.setState({styleUrl: event.target.value});
    }

    validURL(str: string) {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return (!!pattern.test(str)) || (str.indexOf("mapbox://") == 0);
    }

    onLoad(e: any) {

        // mapbox://styles/mapbox/streets-v11?access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg

        if (this.validURL(this.state.styleUrl)) {

            this.props.selectStyle(this.state.styleUrl);
        }
    }

    render() {

        if (this.props.loadingState === LoadingState.LOADED)
            return null;

        return (

            <div className="Loader">
                <div>
                    <div id="styleTitle">Enter a map style url</div>
                    <input id="styleUrl" type="text" placeholder="Map style url" value={this.state.styleUrl} onChange={this.onChange}></input>
                    <button onClick={this.onLoad}>Go!</button>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loader)