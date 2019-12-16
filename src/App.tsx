import React from 'react';
import './App.css';

import Header from './Header';
import Menu from './Menu';
import Map from './Map';
import Loader from './Loader';
import Poi from './Poi';
import PoiList from './PoiList';

interface IProps {

}

interface IState {

  openLoad: boolean;
  styleUrl: string;
  styleName: string;
  sprite: any;
  imageUrl: string;
  poiList: Poi[];
  selectedMarker: string;
}

export default class App extends React.Component <IProps,IState> {

  constructor(props: IProps) {

    super(props);

    this.state = {

      openLoad: true,
      styleUrl: '',
      styleName: '',
      sprite: null,
      imageUrl: '',
      poiList: new Array(),
      selectedMarker: '',
    };
  }

  onLoad(url: string) {

    console.log("onLoad :" + url);

    this.setState({openLoad: false,styleUrl: url});
  }

  onClose() {

    this.setState({openLoad: false});
  }

  displayLoader() {

    if (this.state.openLoad)
      return (<Loader loadHandler={(url: string) => this.onLoad(url)} closeHandler={() => this.onClose()}/>);
    else
      return;
  }

  mapLoaded(styleName: string, sprite: any, img: string) {

    this.setState({styleName:styleName,sprite:sprite,imageUrl:img});
  }

  poiAdded(lngLat: mapboxgl.LngLat) {

    this.state.poiList.push(new Poi(lngLat));

    this.setState({poiList: this.state.poiList});
  }

  markerSelected(key: string) {

    this.setState({selectedMarker: key});
  }

  render() {
    return (
      <div className="App">
        <Header styleName={this.state.styleName}/>
        <Menu sprite={this.state.sprite} imageUrl={this.state.imageUrl} poiList={this.state.poiList} markerSelected={(key: string) => this.markerSelected(key)}/>
        <Map styleUrl={this.state.styleUrl} mapLoaded={(styleName: string, sprite: any, imageUrl: string) => this.mapLoaded(styleName,sprite,imageUrl)} poiAdded={(lngLat: mapboxgl.LngLat) => this.poiAdded(lngLat)} marker={this.state.selectedMarker}/>
        {this.displayLoader()}
      </div>
    );
  }
}

