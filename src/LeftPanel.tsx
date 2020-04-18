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

import React, { CSSProperties } from 'react';
import { connect } from 'react-redux'

import { RootState } from './RootReducer';

import './LeftPanel.css';

import Markers from './Markers';
import PoiList from './PoiList';

interface IProps {

  verticalMove(x: number): void,
  horizontalMove(y: number): void,
}

interface StateProps {

  panelSize: [number,number];
}

interface DispatchProps {
}

interface IState {

}

type Props = StateProps & DispatchProps & IProps;

function mapStateToProps(state: RootState, ownProps: IProps): StateProps {
  
  return { panelSize: state.style.panelSize };
}

class LeftPanel extends React.Component <Props,IState> {

  constructor(props: Props) {

    super(props);

    this.onVerticalBorder = this.onVerticalBorder.bind(this);
    this.onHorizontalBorder = this.onHorizontalBorder.bind(this);
  }

  onVerticalBorder(e: any) {

    e.preventDefault();

    this.props.verticalMove(e.clientX);
  }

  onHorizontalBorder(e: any) {

    e.preventDefault();

    this.props.horizontalMove(e.clientY);
  }

  render() {

    return (
      <div id="LeftPanel" style={{width:''+((this.props.panelSize)?this.props.panelSize[0]:260)+'px'}}>
        <div id="menu">
          <Markers height={(this.props.panelSize)?this.props.panelSize[1]:200}/>
          <div id="horizontalBorder" onMouseDown={ this.onHorizontalBorder }></div>
          <PoiList />
        </div>
        <div id="verticalBorder" onMouseDown={ this.onVerticalBorder }></div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(LeftPanel)