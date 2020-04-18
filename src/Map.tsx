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
import * as Redux from 'redux'
import { connect } from 'react-redux'

import mapboxgl from 'mapbox-gl';
import './mapbox-gl.css'
import './Map.css'

import { Poi, PoiActionTypes } from './PoiReducerTypes';
import { addPoi, selectPoi } from './PoiReducerActions';
import { styleLoaded } from './StyleReducerActions';
import { RootState } from './RootReducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons'

interface IProps {
}

interface StateProps {
    poiList: Poi[];
    styleUrl: string;
    selectedMarker: string;
    selectedPoi: number;
    panelSize: [number,number];
}
       
interface DispatchProps {
    addPoi: (newPoi: Poi) => void,
    selectPoi: (ref: number) => void,
    styleLoaded: (styleName: string, sprite: any, imageUrl: string) => void,
}

interface IState {

    editMode: boolean;
}

type Props = StateProps & DispatchProps & IProps;

function mapStateToProps(state: RootState, ownProps: IProps): StateProps {

    return { 
        poiList: state.poi.poiList,
        selectedPoi: state.poi.selectedPoi,
        styleUrl: state.style.styleUrl,
        selectedMarker: state.style.selectedMarker,
        panelSize: state.style.panelSize,
    };
}

const mapDispatchToProps = {
    
    addPoi,
    selectPoi,
    styleLoaded,
};

class Map extends React.Component <Props,IState> {

    private mapRef = React.createRef<HTMLDivElement>();
    private map: mapboxgl.Map | null = null;

    private currentStyleUrl: string;

    private popup: mapboxgl.Popup;

    private do_not_move: boolean = false;

    constructor(props: Props) {
        
        super(props);

        this.currentStyleUrl = '';

        this.state = { editMode: false };

        this.popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false});

        this.toggleEdit = this.toggleEdit.bind(this);
    }

    addPoi(e: mapboxgl.MapMouseEvent) {

        if (e != null) {

            const metadata = [ {lang:"fr", title:"Sans titre", desc:""} ];

            const poi: Poi = {
                ref: Date.now(),
                metadata: metadata,
                photoUrl: "",
                lngLat: e.lngLat,
                symbol: this.props.selectedMarker,
                symbolSize: 0.5
            };

            this.props.addPoi(poi);
        }
    }

    updateMarkers() {

        if (this.map) {

            const source: mapboxgl.GeoJSONSource = this.map.getSource('markers') as mapboxgl.GeoJSONSource;

            if (source) {

                let geojsondata: any = {
                    type: 'FeatureCollection',
                    features: new Array()
                };

                for (let poi of this.props.poiList) {

                    let feature: any = {

                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [poi.lngLat.lng,poi.lngLat.lat]
                        },
                        'properties': {
                            'icon': poi.symbol,
                            'icon-size': (poi.ref == this.props.selectedPoi)?2*poi.symbolSize:poi.symbolSize,
                            'ref': poi.ref,
                            'metadata': poi.metadata,
                        }
                    };
                    
                    geojsondata.features.push(feature);

                    if ( (!this.do_not_move) && (poi.ref == this.props.selectedPoi) ) {

                        this.map.flyTo({center: poi.lngLat, zoom: 15});
                    }
                }
                
                source.setData(geojsondata);
            }
        }
    }

    selectPoi(ref: number) {

        this.do_not_move = true;
        this.props.selectPoi(ref);
    }

    toggleEdit() {

        this.setState({editMode: !this.state.editMode});

        this.do_not_move = true;
    }

    loadMap() {

        if (this.currentStyleUrl === this.props.styleUrl)
            return;

        this.currentStyleUrl = this.props.styleUrl;

        if (this.map) {

            this.map.remove();

            this.map = null;
        }

        if (this.props.styleUrl.length > 0) {

            let index = this.props.styleUrl.indexOf("access_token");

            if ( index >= 0) {

                mapboxgl.accessToken = this.props.styleUrl.substring(index+13);

                console.log(mapboxgl.accessToken);
            }
            else {

                mapboxgl.accessToken = "";
            }

            this.map = new mapboxgl.Map({
                container: 'map',
                style: this.props.styleUrl,
                attributionControl: true,
                customAttribution: '<a href="https://www.meandmaps.com" target="_blank">© me & maps</a>'
            });
    
            if (this.map) {
    
                this.map.on('load', () => {
    
                    if (this.map) {
    
                        const mapName: string = this.map.getStyle().name || '';

                        let spriteJsonUrl: string = this.map.getStyle().sprite + "@2x.json" || '';
                        let spritePngUrl: string = this.map.getStyle().sprite + "@2x.png" || '';

                        fetch(spriteJsonUrl)
                            .then(res => res.json())
                            .then(
                                (result) => {

                                    this.props.styleLoaded(mapName,result,spritePngUrl);
                                },
                                // Note: it's important to handle errors here
                                // instead of a catch() block so that we don't swallow
                                // exceptions from actual bugs in components.
                                (error) => {
                                    
                                    spriteJsonUrl = this.map!.getStyle().sprite + ".json" || '';
                                    spritePngUrl = this.map!.getStyle().sprite + ".png" || '';

                                    fetch(spriteJsonUrl)
                                        .then(res => res.json())
                                        .then(
                                            (result) => {

                                                this.props.styleLoaded(mapName,result,spritePngUrl);
                                            },
                                            // Note: it's important to handle errors here
                                            // instead of a catch() block so that we don't swallow
                                            // exceptions from actual bugs in components.
                                            (error) => {
                                                
                                                console.log(error);
                                            }
                                        );
                                }
                            );

                        this.map.addSource('markers', { type: 'geojson', data: {
                                type: 'FeatureCollection',
                                features: []
                            }
                        });

                        this.map.addLayer({
                            'id': 'markers',
                            'type': 'symbol',
                            'source': 'markers',
                            'layout': {
                                'icon-image': ['get', 'icon'],
                                "icon-size": ['get', 'icon-size'],
                                "icon-allow-overlap": true
                            }
                        });
                    }
                    
                });

                this.map.on('mousedown', (e: mapboxgl.MapMouseEvent) => {

                    if (this.state.editMode) {
                        
                        this.addPoi(e);
                    }
                });

                this.map.on('click', 'markers', (e: any) => {

                    if (this.state.editMode)
                        return;

                    if (e) {

                        this.selectPoi(e.features[0].properties.ref);
                        
                        //console.log('click on POI '+e.features[0].properties.ref);
                    }
                });

                // Change the cursor to a pointer when the mouse is over the places layer.
                this.map.on('mouseenter', 'markers', (e: any) => {

                    if (this.state.editMode)
                        return;

                    // I don not know why it is a string, then we have to parse it
                    let metadata = JSON.parse(e.features[0].properties.metadata);

                    e.target.getCanvas().style.cursor = 'pointer';

                    this.popup
                        .setLngLat(e.features[0].geometry.coordinates)
                        .setHTML('<span>'+metadata[0].title+'</span>')
                        .addTo(this.map!);
                });
                
                // Change it back to a pointer when it leaves.
                this.map.on('mouseleave', 'markers', (e: mapboxgl.MapMouseEvent) => {

                    if (this.state.editMode)
                        return;

                    e.target.getCanvas().style.cursor = '';

                    this.popup.remove();
                });
            }
        }
    }

    componentDidMount() {

        this.loadMap();

        this.updateMarkers();
    }

    componentDidUpdate() {

        this.loadMap();

        this.updateMarkers();

        this.do_not_move = false;

        if (this.map) {

            this.map.resize();

            if (this.state.editMode) {

                this.map.getCanvas().style.cursor = 'crosshair';
            }
            else {

                this.map.getCanvas().style.cursor = '';
            }
        }
    }
        
    render() {
        return (
            <div className="Map"><div id="map"></div><FontAwesomeIcon id="edit" className={(this.state.editMode == true) ? 'editOn' : 'editOff'} icon={faEdit} onClick={this.toggleEdit} /></div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)