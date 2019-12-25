import React, { CSSProperties } from 'react';
import './Menu.css';

import Markers from './Markers';
import PoiList from './PoiList';

interface IProps {

    sprite: any;
    imageUrl: string;
    markerSelected: any;
}

interface IState {

}

export default class Menu extends React.Component <IProps,IState> {

  constructor(props: IProps) {

    super(props);
  }

  componentDidUpdate() {
      
  }

  render() {
    return (
      <div className="Menu">
          <Markers sprite={this.props.sprite} imageUrl={this.props.imageUrl} markerSelected={this.props.markerSelected}/>
          <PoiList sprite={this.props.sprite} imageUrl={this.props.imageUrl} />
      </div>
    );
  }
}

