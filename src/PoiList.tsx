import React, { CSSProperties } from 'react';
import './PoiList.css';

import Poi from './Poi';

interface IProps {

  poiList: Poi[];
  sprite: any;
  imageUrl: string;
  poiDeleted: any;
  poiEdited: any;
}

interface IState {

  selectedPoi: Poi|null;
}

export default class PoiList extends React.Component <IProps,IState> {

  constructor(props: IProps) {

    super(props);

    this.state = {selectedPoi: null};

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

    if (poi == this.state.selectedPoi) {

      return (<div className="UpdatePoi"><div className="UpdateAction" onClick={(e) => {this.props.poiEdited(poi); e.stopPropagation();} }>Edit</div><div className="UpdateAction" onClick={(e) => this.props.poiDeleted(poi)}>Delete</div></div>)
    }
  }

  selectPoi(poi: Poi) {

    if (poi == this.state.selectedPoi) {
      this.setState({selectedPoi:null});
    }
    else {
      this.setState({selectedPoi:poi});
    }
  }

  renderPoi() {

    return this.props.poiList.map((poi: Poi) => { return (
    
          <li onClick={(e) => this.selectPoi(poi)}>
            
            <div className="Poi">
              {this.getSymbol(poi.getSymbol())}
              <div style={poi == this.state.selectedPoi ? {color:'aquamarine'} : {}}>{poi.getTitle()}</div>
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

