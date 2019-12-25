import React, { CSSProperties } from 'react';
import * as Redux from 'redux'
import { connect } from 'react-redux'

import { Poi, PoiActionTypes } from './PoiReducerTypes';
import { selectPoi, editPoi, removePoi } from './PoiReducerActions';

import './PoiList.css';
import { RootState } from './RootReducer';

interface IProps {

  sprite: any;
  imageUrl: string;
}

interface StateProps {
  poiList: Poi[],
  selectedPoi: number,
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

    return { poiList: state.poi.poiList, selectedPoi: state.poi.selectedPoi };
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

  renderPoi() {

    return this.props.poiList.map((poi: Poi) => { return (
    
          <li onClick={(e) => this.selectPoi(poi)} key={poi.ref}>
            
            <div className="Poi">
              {this.getSymbol(poi.symbol)}
              <div style={poi.ref == this.props.selectedPoi ? {color:'aquamarine'} : {}}>{poi.title}</div>
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
    else {

      return (

        <div className="noPoi">Select a symbol above and click long on the map for adding a POI</div>

      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PoiList)
