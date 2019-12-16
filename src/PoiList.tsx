import React, { CSSProperties } from 'react';
import './PoiList.css';

import Poi from './Poi';

interface IProps {

  poiList: Poi[]
}

interface IState {

}

export default class PoiList extends React.Component <IProps,IState> {

  constructor(props: IProps) {

    super(props);
  }

  renderPoi() {

    return this.props.poiList.map((poi: Poi) => { return (<li>{poi.getTitle()}</li>)});
  }
  
  render() {
    return (
      <div className="PoiList">
        <ul>
          {this.renderPoi()}
        </ul>
      </div>
    );
  }
}

