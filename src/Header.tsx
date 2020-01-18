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

import './Header.css'

import { StyleActionTypes, LoadingState } from './StyleReducerTypes';
import { openMenu } from './StyleReducerActions';

import { RootState } from './RootReducer';


interface IProps {
}

interface StateProps {
    styleName: string;
    lastUpdate: number;
}

interface DispatchProps {
    openMenu: () => void,
}

interface IState {
}

type Props = StateProps & DispatchProps & IProps;

function mapStateToProps(state: RootState, ownProps: IProps): StateProps {

    if (state.style.loadingState === LoadingState.LOADED) {

        return { styleName: state.style.styleName, lastUpdate: state.poi.lastUpdate };
    }
    else {

        return { styleName: "No map loaded", lastUpdate: 0 };
    }
}

const mapDispatchToProps = {
  
    openMenu
};

class Header extends React.Component <Props,IState> {

    constructor(props: Props) {

        super(props);

        this.openMenuDialog = this.openMenuDialog.bind(this);
    }

    lastUpdate() {

        if (this.props.lastUpdate <= 0) {
            return null;
        }
        else {
            return (<div>{new Date(this.props.lastUpdate).toLocaleString()}</div>);
        }
    }

    openMenuDialog() {

        this.props.openMenu();
    }

    render() {
        return (
            <div className="Header">
                
                <div className="headerTitle"><a href="https://github.com/meandmaps/editor" target="_blank">me & maps editor</a><div className="headerVersion">v0.01</div></div>
                <div className="styleName" onClick={this.openMenuDialog}>{this.props.styleName}</div>
                <div className="lastUpdate">Last update: {this.lastUpdate()}</div>
            </div>
          );
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Header)

