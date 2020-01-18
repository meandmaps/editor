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
import * as Redux from 'redux'
import { connect } from 'react-redux'

import { Poi, PoiActionTypes } from './PoiReducerTypes';
import { selectPoi, editPoi, removePoi } from './PoiReducerActions';

import './PoiList.css';
import { RootState } from './RootReducer';
import { LoadingState } from './StyleReducerTypes';

interface IProps {

}

interface StateProps {
  poiList: Poi[],
  selectedPoi: number,
  styleLoadingState: LoadingState;
  sprite: any;
  imageUrl: string;
}

interface DispatchProps {
  selectPoi: (ref: number) => void,
  editPoi: (ref: number) => void,
  removePoi: (ref: number) => void,
}

interface IState {

}

type Props = StateProps & DispatchProps & IProps;

function mapStateToProps(state: RootState, ownProps: IProps): StateProps {

    return {
        poiList: state.poi.poiList,
        selectedPoi: state.poi.selectedPoi,
        styleLoadingState: state.style.loadingState,
        sprite: state.style.sprite,
        imageUrl: state.style.imageUrl
    };
}

const mapDispatchToProps = {
  
  selectPoi,
  editPoi,
  removePoi
};

class PoiList extends React.Component <Props,IState> {

  constructor(props: Props) {

    super(props);
  
    this.selectPoi = this.selectPoi.bind(this);
  }

  getSymbol(key: string): any {

    const marker: boolean = ("marker" in this.props.sprite[key]);

    const xRatio = 12.0/this.props.sprite[key].width;
    const yRatio = 12.0/this.props.sprite[key].height;

    const ratio = (xRatio <= yRatio)?xRatio:yRatio;

    const topStyle: CSSProperties = {

        width: ''+(this.props.sprite[key].width*ratio)+'px',
        height: ''+(this.props.sprite[key].height*ratio)+'px',
        padding: '3px',
    };

    const style: CSSProperties = {

        width: ''+this.props.sprite[key].width+'px',
        height: ''+this.props.sprite[key].height+'px',
        backgroundImage: "url('"+this.props.imageUrl+"')",
        backgroundPosition: ''+(-this.props.sprite[key].x)+'px '+(-this.props.sprite[key].y)+'px',
        transform: 'scale('+ratio+')',
        transformOrigin: '0 0'
    };
    
    return (<div style={topStyle}><div style={style}></div></div>);
  }

  updatePoi(poi: Poi) {

    if (poi.ref == this.props.selectedPoi) {

      return (<div className="UpdatePoi"><div className="UpdateAction" onClick={(e) => {this.props.editPoi(poi.ref); e.stopPropagation();} }>Edit</div><div className="UpdateAction" onClick={(e) => {this.props.removePoi(poi.ref); e.stopPropagation();}}>Delete</div></div>)
    }
  }

  selectPoi(poi: Poi) {

    if (poi.ref == this.props.selectedPoi) {
      this.props.selectPoi(-1);
    }
    else {
      this.props.selectPoi(poi.ref);
    }
  }

  componentDidUpdate() {
    
  }

  getPoiTitle(poi: Poi) {

    if ( (poi.metadata != null) && (poi.metadata.length > 0) )
      return poi.metadata[0].title;

    return "Sans titre";
  }

  renderPoi() {

    if (this.props.styleLoadingState !== LoadingState.LOADED)
      return null;
    
    return this.props.poiList.map((poi: Poi) => { return (

          <li onClick={(e) => this.selectPoi(poi)} key={poi.ref}>
            
            <div className="Poi">
              {this.getSymbol(poi.symbol)}
              <div style={poi.ref == this.props.selectedPoi ? {color:'aquamarine'} : {}}>{this.getPoiTitle(poi)}</div>
            </div>

            {this.updatePoi(poi)}
            
          </li>
        
        );
    
      });
  }
  
  render() {

    if (this.props.poiList.length > 0) {
      return (
        <div className="PoiList">
          <ul>
            {this.renderPoi()}
          </ul>
        </div>
      );
    }
    else if (this.props.styleLoadingState === LoadingState.LOADED) {

      return (

        <div className="noPoi">Select a symbol above and click long on the map for adding a POI</div>

      );
    }
    else {

      return null;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PoiList)
