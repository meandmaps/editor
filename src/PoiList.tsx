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
import { LoadingState, Sprite, Symbol } from './StyleReducerTypes';

interface IProps {

}

interface StateProps {
  poiList: Poi[];
  selectedPoi: number;
  styleLoadingState: LoadingState;
  sprite: Sprite;
  imageUrl: string;
  panelSize: [number,number];
}

interface DispatchProps {
  selectPoi: (ref: number) => void;
  editPoi: (ref: number) => void;
  removePoi: (ref: number) => void;
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
        imageUrl: state.style.imageUrl,
        panelSize: state.style.panelSize,
    };
}

const mapDispatchToProps = {
  
  selectPoi,
  editPoi,
  removePoi
};

class PoiList extends React.Component <Props,IState> {

  private poiListRef = React.createRef<HTMLDivElement>();
  private selectedPoiRef = React.createRef<HTMLLIElement>();

  constructor(props: Props) {

    super(props);
  
    this.selectPoi = this.selectPoi.bind(this);
  }

  getSymbol(key: string): any {

    let symbol: Symbol;

    if (key in this.props.sprite) {

      symbol = this.props.sprite[key];
    }
    else {

      return null;
    }

    const xRatio = 12.0/symbol.width;
    const yRatio = 12.0/symbol.height;

    const ratio = (xRatio <= yRatio)?xRatio:yRatio;

    const topStyle: CSSProperties = {

        width: ''+(symbol.width*ratio)+'px',
        height: ''+(symbol.height*ratio)+'px',
        padding: '3px',
    };

    const style: CSSProperties = {

        width: ''+symbol.width+'px',
        height: ''+symbol.height+'px',
        backgroundImage: "url('"+this.props.imageUrl+"')",
        backgroundPosition: ''+(-symbol.x)+'px '+(-symbol.y)+'px',
        transform: 'scale('+ratio+')',
        transformOrigin: '0 0'
    };
    
    return (<div style={topStyle}><div style={style}></div></div>);
  }

  updatePoi(poi: Poi) {

    if (poi.ref == this.props.selectedPoi) {

      return (<div className="UpdatePoi"><div className="UpdateAction" onClick={(e) => {this.props.editPoi(poi.ref); e.stopPropagation();} }>Edit</div></div>);
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
    
    //console.log("componentDidUpdate");

    if (this.poiListRef.current) {

      const parentBounds = this.poiListRef.current.getBoundingClientRect();

      if (this.selectedPoiRef.current) {

        const bounds = this.selectedPoiRef.current.getBoundingClientRect();

        if ( (bounds.top > parentBounds.bottom) || (bounds.bottom < parentBounds.top) ) {

          this.selectedPoiRef.current.scrollIntoView(true);
        }
      }
    }
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

          <li onClick={(e) => this.selectPoi(poi)} key={poi.ref} ref={poi.ref == this.props.selectedPoi ? this.selectedPoiRef:""}>
            
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
        <div className="PoiList" ref={this.poiListRef} style={{height:'calc(100% - '+((this.props.panelSize)?this.props.panelSize[1]:200)+'px - 35px)'}}>
          <ul>
            {this.renderPoi()}
          </ul>
        </div>
      );
    }
    else if (this.props.styleLoadingState === LoadingState.LOADED) {

      return (

        <div className="noPoi">Select a symbol above and enter in edit mode for adding a POI.</div>

      );
    }
    else {

      return null;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PoiList)
