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

import { StyleActionTypes, LoadingState } from './StyleReducerTypes';
import { selectMarker } from './StyleReducerActions';

import { RootState } from './RootReducer';

import './Markers.css';

interface IProps {

  height: number;
}

interface StateProps {
  sprite: any;
  imageUrl: string;
  selectedMarker: string;
}

interface DispatchProps {
  selectMarker: (key: string) => void;
}

interface IState {

}

type Props = StateProps & DispatchProps & IProps;

function mapStateToProps(state: RootState, ownProps: IProps): StateProps {

  return {
    sprite: state.style.sprite,
    imageUrl: state.style.imageUrl,
    selectedMarker: state.style.selectedMarker,
  };
}

const mapDispatchToProps = {

  selectMarker,
};

class Markers extends React.Component <Props,IState> {

  constructor(props: Props) {

    super(props);

    this.state = {};
  }

  componentDidMount() {

  }

  componentDidUpdate() {

    if ( (this.props.selectedMarker === '') && (this.props.sprite) ) {
          
      for (let key in this.props.sprite) {

        if (this.props.sprite[key].default) {

          this.props.selectMarker(key);
          return;
        }
      }

      this.props.selectMarker(Object.keys(this.props.sprite)[0]);
    }
  }

  selectMarker(key: string) {

    this.props.selectMarker(key);
  }

  getSprite(key: string): any {

    const marker: boolean = ("marker" in this.props.sprite[key]);

    if (!marker)
        return;

    const xRatio = 30.0/this.props.sprite[key].width;
    const yRatio = 30.0/this.props.sprite[key].height;

    const ratio = (xRatio <= yRatio)?xRatio:yRatio;

    const topStyle: CSSProperties = {

        width: ''+(this.props.sprite[key].width*ratio)+'px',
        height: ''+(this.props.sprite[key].height*ratio)+'px',
        padding: '3px',
        border: (this.props.selectedMarker === key)?'1px solid aquamarine':'1px solid #282830'
    };

    const style: CSSProperties = {

        width: ''+this.props.sprite[key].width+'px',
        height: ''+this.props.sprite[key].height+'px',
        backgroundImage: "url('"+this.props.imageUrl+"')",
        backgroundPosition: ''+(-this.props.sprite[key].x)+'px '+(-this.props.sprite[key].y)+'px',
        transform: 'scale('+ratio+')',
        transformOrigin: '0 0'
    };

    const handleClick: any = () => { this.selectMarker(key) };
    
    return (<div key={key} id={key} title={key} style={topStyle} onClick={handleClick}><div style={style}></div></div>);
  }

  getSprites(): any {

    if (this.props.sprite) {

        return Object.keys(this.props.sprite).map(key => this.getSprite(key));
    }
  }
  
  render() {
    
    return (
      <div className="Markers" style={{height:''+this.props.height+'px'}}>
        {this.getSprites()}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Markers)
