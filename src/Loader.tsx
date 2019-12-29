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

        this.state = {styleUrl: 'http://127.0.0.1:7777/lesarcs/style_lesarcs.json'};

        this.onChange = this.onChange.bind(this);
        this.onLoad = this.onLoad.bind(this);
    }

    onChange(event: any) {

        this.setState({styleUrl: event.target.value});
    }

    onLoad(e: any) {

        this.props.selectStyle(this.state.styleUrl);
    }

    render() {

        if (this.props.loadingState === LoadingState.LOADED)
            return null;

        return (

            <div className="Loader">
                <div>
                    <input id="styleUrl" type="text" placeholder="Map style url" value={this.state.styleUrl} onChange={this.onChange}></input>
                    <button onClick={this.onLoad}>Go!</button>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loader)