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
import './App.css';

import { connect } from 'react-redux'

import { resizePanel } from './StyleReducerActions';
import { RootState } from './RootReducer';

import Header from './Header';
import LeftPanel from './LeftPanel';
import Map from './Map';
import Loader from './Loader';
import PoiEditor from './PoiEditor';
import Menu from './Menu';

interface IProps {

}

interface StateProps {

  panelSize: [number,number];
}

interface DispatchProps {
  
  resizePanel: (size: [number, number]) => void;
}

interface IState {

}

type Props = StateProps & DispatchProps & IProps;

function mapStateToProps(state: RootState, ownProps: IProps): StateProps {
  
  return { panelSize: state.style.panelSize };
}

const mapDispatchToProps = {
  
  resizePanel,
};

class App extends React.Component <Props,IState> {
  
  private originX: number = 0;
  private originY: number = 0;
  private verticalMoveActive: boolean = false;
  private horizontalMoveActive: boolean = false;

  constructor(props: Props) {

    super(props);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.verticalMove = this.verticalMove.bind(this);
    this.horizontalMove = this.horizontalMove.bind(this);

    this.state = {
    };
  }

  onMouseMove(e: any) {

    e.preventDefault();

    if (this.verticalMoveActive) {

      let panelSize = this.props.panelSize;

      if (!panelSize)
        panelSize = [260,200];

      panelSize[0] += e.clientX-this.originX;

      if (panelSize[0] < 150)
        panelSize[0] = 150;

      this.props.resizePanel(panelSize);

      this.originX = e.clientX;
    }
    else if (this.horizontalMoveActive) {

      let panelSize = this.props.panelSize;

      if (!panelSize)
        panelSize = [260,200];

      panelSize[1] += e.clientY-this.originY;

      if (panelSize[1] < 50)
        panelSize[1] = 50;

      this.props.resizePanel(panelSize);

      this.originY = e.clientY;
    }
  }

  onMouseUp(e: any) {

    this.verticalMoveActive = false;
    this.horizontalMoveActive = false;
  }

  verticalMove(x: number) {

    this.verticalMoveActive = true;
    this.originX = x;
  }

  horizontalMove(y: number) {

    this.horizontalMoveActive = true;
    this.originY = y;
  }
  
  render() {
    return (
      <div className="App" onMouseMove={ this.onMouseMove } onMouseUp={ this.onMouseUp } >
        <Header />
        <LeftPanel verticalMove={this.verticalMove} horizontalMove={this.horizontalMove}/>
        <Map />
        <PoiEditor />
        <Menu />
        <Loader />
      </div>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App)
