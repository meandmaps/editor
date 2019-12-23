import React from 'react';
import './App.css';

import Header from './Header';
import Menu from './Menu';
import Map from './Map';
import Loader from './Loader';
import Poi from './Poi';
import PoiList from './PoiList';
import PoiEditor from './PoiEditor';

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
  editPoi: Poi|null;
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
      editPoi: null,
    };

    this.poiAdded = this.poiAdded.bind(this);
    this.poiDeleted = this.poiDeleted.bind(this);
    this.poiEdited = this.poiEdited.bind(this);
    this.editDone = this.editDone.bind(this);
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

  displayPoiBox() {

    if (this.state.editPoi)
      return (<PoiEditor poi={this.state.editPoi} editDone={this.editDone} imageUrl={this.state.imageUrl} sprite={this.state.sprite}/>);
    else
      return;
  }

  editDone() {

    this.setState({editPoi: null});
  }

  mapLoaded(styleName: string, sprite: any, img: string) {

    this.setState({styleName:styleName,sprite:sprite,imageUrl:img});
  }

  poiAdded(poi: Poi) {

    this.state.poiList.push(poi);

    this.setState({poiList: this.state.poiList});
  }

  poiDeleted(poi: Poi) {

    this.setState({poiList: this.state.poiList.filter((p:Poi) => p !== poi)});
  }

  poiEdited(poi: Poi) {

    this.setState({editPoi: poi});
  }

  markerSelected(key: string) {

    this.setState({selectedMarker: key});
  }

  render() {
    return (
      <div className="App">
        <Header styleName={this.state.styleName}/>
        <Menu sprite={this.state.sprite} imageUrl={this.state.imageUrl} poiList={this.state.poiList} markerSelected={(key: string) => this.markerSelected(key)} poiDeleted={this.poiDeleted} poiEdited={this.poiEdited}/>
        <Map styleUrl={this.state.styleUrl} mapLoaded={(styleName: string, sprite: any, imageUrl: string) => this.mapLoaded(styleName,sprite,imageUrl)} poiAdded={(poi: Poi) => this.poiAdded(poi)} poiList={this.state.poiList} marker={this.state.selectedMarker}/>
        {this.displayLoader()}
        {this.displayPoiBox()}
      </div>
    );
  }
}

